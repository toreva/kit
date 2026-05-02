import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { formatReport, runDoctor } from '../commands/doctor.js';

function fetchReturning(status: number): typeof fetch {
  return (async () =>
    ({
      ok: status >= 200 && status < 300,
      status,
      statusText: `status-${status}`,
      json: async () => ({}),
    }) as unknown as Response) as unknown as typeof fetch;
}

function fetchThrowing(message: string): typeof fetch {
  return (async () => {
    throw new Error(message);
  }) as unknown as typeof fetch;
}

describe('runDoctor', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'toreva-doctor-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  function envBase(): NodeJS.ProcessEnv {
    return {
      ...process.env,
      TOREVA_CONFIG_DIR: dir,
      TOREVA_MCP_URL: 'https://mcp.example.com',
    };
  }

  function writeConfig(token: string | undefined): void {
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'config.json'),
      JSON.stringify({
        mcpUrl: 'https://mcp.example.com',
        authToken: token,
        issuedAt: '2026-04-26T00:00:00Z',
      })
    );
  }

  it('reports OK when config + token + reachable gateway all healthy', async () => {
    writeConfig('tok-1');
    const report = await runDoctor({ fetch: fetchReturning(200) }, envBase());
    expect(report.ok).toBe(true);
    expect(report.checks.map((c) => c.status)).toEqual(['ok', 'ok', 'ok']);
  });

  it('reports config_present error when no config file', async () => {
    const report = await runDoctor({ fetch: fetchReturning(200) }, envBase());
    expect(report.ok).toBe(false);
    const cfg = report.checks.find((c) => c.name === 'config_present');
    expect(cfg?.status).toBe('error');
  });

  it('reports auth_token error when config exists but no token', async () => {
    writeConfig(undefined);
    const report = await runDoctor({ fetch: fetchReturning(200) }, envBase());
    const tok = report.checks.find((c) => c.name === 'auth_token');
    expect(tok?.status).toBe('error');
    // mcp_call should be skipped (warn) when no token.
    const call = report.checks.find((c) => c.name === 'mcp_call');
    expect(call?.status).toBe('warn');
  });

  it('reports mcp_call error when gateway rejects token', async () => {
    writeConfig('bad');
    const report = await runDoctor({ fetch: fetchReturning(401) }, envBase());
    const call = report.checks.find((c) => c.name === 'mcp_call');
    expect(call?.status).toBe('error');
    expect(call?.message).toMatch(/rejected token/);
    expect(report.ok).toBe(false);
  });

  it('reports mcp_call error when network unreachable', async () => {
    writeConfig('tok-1');
    const report = await runDoctor({ fetch: fetchThrowing('ENOTFOUND') }, envBase());
    const call = report.checks.find((c) => c.name === 'mcp_call');
    expect(call?.status).toBe('error');
    expect(call?.message).toMatch(/ENOTFOUND/);
  });

  it('formatReport renders status tags', () => {
    const text = formatReport({
      ok: false,
      checks: [
        { name: 'a', status: 'ok', message: 'fine' },
        { name: 'b', status: 'warn', message: 'meh' },
        { name: 'c', status: 'error', message: 'bad' },
      ],
    });
    expect(text).toMatch(/\[ OK \] a/);
    expect(text).toMatch(/\[WARN\] b/);
    expect(text).toMatch(/\[FAIL\] c/);
    expect(text).toMatch(/One or more checks failed/);
  });
});
