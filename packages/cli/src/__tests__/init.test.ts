import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInit, parseInitArgs, buildServerStanza } from '../commands/init.js';

describe('parseInitArgs', () => {
  it('extracts --client', () => {
    expect(parseInitArgs(['--client=cursor'])).toEqual({ client: 'cursor' });
  });

  it('throws when --client missing', () => {
    expect(() => parseInitArgs([])).toThrow(/Missing --client/);
  });
});

describe('buildServerStanza', () => {
  it('produces stdio command + TOREVA_MCP_URL env', () => {
    const stanza = buildServerStanza('https://mcp.example.com') as {
      command: string;
      args: string[];
      env: Record<string, string>;
    };
    expect(stanza.command).toBe('npx');
    expect(stanza.args).toEqual(['-y', '@toreva/mcp']);
    expect(stanza.env.TOREVA_MCP_URL).toBe('https://mcp.example.com');
  });
});

describe('runInit', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'toreva-init-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  function envFor(client: 'claude-desktop' | 'openclaw' | 'cursor', overrides: Record<string, string> = {}) {
    const path = join(dir, `${client}.json`);
    const map = {
      'claude-desktop': 'TOREVA_CLAUDE_DESKTOP_CONFIG',
      openclaw: 'TOREVA_OPENCLAW_CONFIG',
      cursor: 'TOREVA_CURSOR_CONFIG',
    } as const;
    return {
      configPath: path,
      env: {
        ...process.env,
        TOREVA_HOME: dir,
        TOREVA_MCP_URL: 'https://mcp.example.com',
        [map[client]]: path,
        ...overrides,
      } as NodeJS.ProcessEnv,
    };
  }

  it('writes a fresh claude-desktop config when none exists', () => {
    const { configPath, env } = envFor('claude-desktop');
    const res = runInit('claude-desktop', env, 'darwin');
    expect(res.created).toBe(true);
    expect(res.configPath).toBe(configPath);
    expect(existsSync(configPath)).toBe(true);

    const written = JSON.parse(readFileSync(configPath, 'utf-8')) as {
      mcpServers: Record<string, { command: string; args: string[]; env: Record<string, string> }>;
    };
    expect(written.mcpServers.toreva.command).toBe('npx');
    expect(written.mcpServers.toreva.args).toEqual(['-y', '@toreva/mcp']);
    expect(written.mcpServers.toreva.env.TOREVA_MCP_URL).toBe('https://mcp.example.com');
  });

  it('preserves existing servers when adding toreva', () => {
    const { configPath, env } = envFor('cursor');
    writeFileSync(
      configPath,
      JSON.stringify({ mcpServers: { existing: { command: 'foo' } }, otherKey: 42 })
    );
    const res = runInit('cursor', env, 'darwin');
    expect(res.created).toBe(false);

    const written = JSON.parse(readFileSync(configPath, 'utf-8')) as {
      mcpServers: Record<string, unknown>;
      otherKey: number;
    };
    expect(written.mcpServers.existing).toEqual({ command: 'foo' });
    expect(written.mcpServers.toreva).toBeDefined();
    expect(written.otherKey).toBe(42);
  });

  it('overwrites a previous toreva entry without duplicating', () => {
    const { configPath, env } = envFor('openclaw');
    writeFileSync(
      configPath,
      JSON.stringify({ mcpServers: { toreva: { command: 'old' } } })
    );
    runInit('openclaw', env, 'linux');
    const written = JSON.parse(readFileSync(configPath, 'utf-8')) as {
      mcpServers: { toreva: { command: string } };
    };
    expect(written.mcpServers.toreva.command).toBe('npx');
  });

  it('rejects unsupported clients', () => {
    expect(() => runInit('vscode')).toThrow(/Unsupported --client/);
  });

  it('refuses to overwrite invalid JSON', () => {
    const { configPath, env } = envFor('cursor');
    writeFileSync(configPath, 'not json');
    expect(() => runInit('cursor', env, 'darwin')).toThrow(/not valid JSON/);
  });
});
