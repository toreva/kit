import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runLogin } from '../commands/login.js';

interface MockResponse {
  status: number;
  body: unknown;
}

function makeFetch(plan: MockResponse[]): typeof fetch {
  let i = 0;
  const calls: { url: string; init?: RequestInit }[] = [];
  const fn = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    const next = plan[Math.min(i, plan.length - 1)];
    i++;
    return {
      ok: next.status >= 200 && next.status < 300,
      status: next.status,
      statusText: `status-${next.status}`,
      json: async () => next.body,
    } as unknown as Response;
  }) as unknown as typeof fetch;
  (fn as unknown as { calls: typeof calls }).calls = calls;
  return fn;
}

describe('runLogin', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'toreva-login-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  function envBase(): NodeJS.ProcessEnv {
    return {
      ...process.env,
      TOREVA_CONFIG_DIR: dir,
      TOREVA_MCP_URL: 'https://mcp.example.com',
      TOREVA_AUTH_TOKEN: '',
    };
  }

  it('completes device-code flow when gateway returns token', async () => {
    const fetchMock = makeFetch([
      {
        status: 200,
        body: {
          device_code: 'dc-1',
          user_code: 'ABCD-EFGH',
          verification_uri: 'https://gateway.example.com/device',
          expires_in: 60,
          interval: 0,
        },
      },
      { status: 428, body: { error: 'authorization_pending' } },
      { status: 200, body: { access_token: 'tok-1', token_type: 'bearer', expires_in: 3600 } },
    ]);

    const logs: string[] = [];
    const res = await runLogin({ fetch: fetchMock, log: (m) => logs.push(m) }, envBase());

    expect(res.authToken).toBe('tok-1');
    expect(res.mcpUrl).toBe('https://mcp.example.com');
    expect(existsSync(res.configPath)).toBe(true);

    const written = JSON.parse(readFileSync(res.configPath, 'utf-8')) as {
      mcpUrl: string;
      authToken: string;
      issuedAt: string;
    };
    expect(written.authToken).toBe('tok-1');
    expect(written.mcpUrl).toBe('https://mcp.example.com');
    expect(written.issuedAt).toBeTruthy();

    const mode = statSync(res.configPath).mode & 0o777;
    expect(mode).toBe(0o600);

    expect(logs.join('\n')).toMatch(/ABCD-EFGH/);
  });

  it('skips device-code flow when TOREVA_AUTH_TOKEN is set', async () => {
    const fetchMock = makeFetch([{ status: 500, body: {} }]);
    const env = { ...envBase(), TOREVA_AUTH_TOKEN: 'paste-me' };
    const res = await runLogin({ fetch: fetchMock }, env);
    expect(res.authToken).toBe('paste-me');
    // fetch should never have been called.
    expect((fetchMock as unknown as { calls: unknown[] }).calls).toHaveLength(0);
  });

  it('throws on malformed device-code response', async () => {
    const fetchMock = makeFetch([{ status: 200, body: { foo: 'bar' } }]);
    await expect(runLogin({ fetch: fetchMock }, envBase())).rejects.toThrow(/malformed device-code/);
  });

  it('throws on gateway 5xx during token poll', async () => {
    const fetchMock = makeFetch([
      {
        status: 200,
        body: {
          device_code: 'dc-1',
          user_code: 'X',
          verification_uri: 'https://x',
          interval: 0,
        },
      },
      { status: 502, body: {} },
    ]);
    await expect(runLogin({ fetch: fetchMock }, envBase())).rejects.toThrow(/Gateway error 502/);
  });
});
