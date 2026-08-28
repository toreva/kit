import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_RELAY_URL,
  getTorevaConfigPath,
  resolveRuntimeConfig,
} from '../config.js';

describe('resolveRuntimeConfig', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'toreva-mcp-config-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  function env(overrides: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
    return {
      TOREVA_CONFIG_DIR: dir,
      ...overrides,
    };
  }

  function writeCliConfig(authToken: string): void {
    writeFileSync(
      join(dir, 'config.json'),
      JSON.stringify({ mcpUrl: 'https://mcp.example.com', authToken })
    );
  }

  it('uses explicit relay environment first', () => {
    const config = resolveRuntimeConfig(
      env({
        RELAY_URL: 'https://gateway.example.com',
        RELAY_AUTH_TOKEN: 'env-token',
      })
    );

    expect(config).toEqual({
      relayUrl: 'https://gateway.example.com',
      relayAuthToken: 'env-token',
    });
  });

  it('uses the token written by toreva login when no env token is present', () => {
    writeCliConfig('cli-token');

    const config = resolveRuntimeConfig(env());

    expect(config).toEqual({
      relayUrl: DEFAULT_RELAY_URL,
      relayAuthToken: 'cli-token',
    });
  });

  it('lets the env token override the CLI config token', () => {
    writeCliConfig('cli-token');

    const config = resolveRuntimeConfig(env({ RELAY_AUTH_TOKEN: 'env-token' }));

    expect(config.relayAuthToken).toBe('env-token');
  });

  it('uses TOREVA_AUTH_TOKEN for direct token injection', () => {
    const config = resolveRuntimeConfig(env({ TOREVA_AUTH_TOKEN: 'direct-token' }));

    expect(config.relayAuthToken).toBe('direct-token');
  });

  it('throws a setup hint when no token is available', () => {
    expect(() => resolveRuntimeConfig(env())).toThrow(/run `toreva login`/);
  });

  it('throws a config-read error for malformed CLI config', () => {
    writeFileSync(getTorevaConfigPath(env()), 'not json');

    expect(() => resolveRuntimeConfig(env())).toThrow(/Could not read Toreva CLI config/);
  });
});
