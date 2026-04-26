import { existsSync } from 'node:fs';
import { getConfigPath, getMcpUrl, readConfig } from '../config.js';

export type CheckStatus = 'ok' | 'warn' | 'error';

export interface DoctorCheck {
  name: string;
  status: CheckStatus;
  message: string;
}

export interface DoctorReport {
  ok: boolean;
  checks: DoctorCheck[];
}

export interface DoctorDeps {
  fetch?: typeof fetch;
}

/**
 * Run end-to-end install / token / first-call diagnostics.
 *
 * Returns a structured report rather than logging directly so that tests
 * can assert on the individual checks. The CLI wrapper prints them.
 */
export async function runDoctor(
  deps: DoctorDeps = {},
  env: NodeJS.ProcessEnv = process.env
): Promise<DoctorReport> {
  const checks: DoctorCheck[] = [];
  const doFetch = deps.fetch ?? fetch;
  const mcpUrl = getMcpUrl(env);
  const configPath = getConfigPath(env);

  // 1. Config file exists.
  const cfgExists = existsSync(configPath);
  checks.push({
    name: 'config_present',
    status: cfgExists ? 'ok' : 'error',
    message: cfgExists
      ? `Found config at ${configPath}`
      : `No config at ${configPath} — run \`toreva login\``,
  });

  const cfg = cfgExists ? readConfig(env) : null;

  // 2. Auth token present.
  const hasToken = Boolean(cfg?.authToken);
  checks.push({
    name: 'auth_token',
    status: hasToken ? 'ok' : 'error',
    message: hasToken
      ? `Token issued at ${cfg?.issuedAt ?? 'unknown'}`
      : 'No auth token — run `toreva login`',
  });

  // 3. MCP URL reachable + first call works.
  // We hit a /healthz-style endpoint; gateway team will provide the canonical
  // probe, but until then a HEAD/GET against the base MCP URL is the cheapest
  // smoke test. If a token is present we attach it so we exercise auth too.
  if (hasToken) {
    try {
      const res = await doFetch(`${mcpUrl}/healthz`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${cfg!.authToken}` },
      });
      if (res.ok) {
        checks.push({
          name: 'mcp_call',
          status: 'ok',
          message: `Gateway healthy at ${mcpUrl} (${res.status})`,
        });
      } else if (res.status === 401 || res.status === 403) {
        checks.push({
          name: 'mcp_call',
          status: 'error',
          message: `Gateway rejected token (${res.status}) — re-run \`toreva login\``,
        });
      } else {
        checks.push({
          name: 'mcp_call',
          status: 'warn',
          message: `Gateway returned ${res.status} — service may be degraded`,
        });
      }
    } catch (err) {
      checks.push({
        name: 'mcp_call',
        status: 'error',
        message: `Cannot reach ${mcpUrl}: ${(err as Error).message}`,
      });
    }
  } else {
    checks.push({
      name: 'mcp_call',
      status: 'warn',
      message: 'Skipped — no token. Login first.',
    });
  }

  const ok = checks.every((c) => c.status === 'ok');
  return { ok, checks };
}

export function formatReport(report: DoctorReport): string {
  const lines: string[] = [];
  for (const c of report.checks) {
    const tag = c.status === 'ok' ? '[ OK ]' : c.status === 'warn' ? '[WARN]' : '[FAIL]';
    lines.push(`${tag} ${c.name}: ${c.message}`);
  }
  lines.push('');
  lines.push(report.ok ? 'All checks passed.' : 'One or more checks failed.');
  return lines.join('\n');
}
