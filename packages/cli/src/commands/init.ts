import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { isSupportedClient, resolveClient, SUPPORTED_CLIENTS, type SupportedClient } from '../clients.js';
import { getMcpUrl } from '../config.js';

export interface InitResult {
  client: SupportedClient;
  configPath: string;
  serverKey: string;
  mcpUrl: string;
  created: boolean;
}

/**
 * Build the MCP server stanza to inject into a client config.
 *
 * Both Claude Desktop and the popular MCP clients accept either:
 *   - { command, args, env } (stdio) — used here via npx @toreva/mcp
 *   - { url } (HTTP/SSE)
 *
 * We default to stdio via npx so the user doesn't need to keep a
 * gateway URL alive locally; the MCP package itself talks to the
 * Toreva gateway over HTTP.
 */
export function buildServerStanza(mcpUrl: string): Record<string, unknown> {
  return {
    command: 'npx',
    args: ['-y', '@toreva/mcp'],
    env: {
      TOREVA_MCP_URL: mcpUrl,
    },
  };
}

interface ParsedConfig {
  raw: Record<string, unknown>;
}

function parseConfigFile(path: string): ParsedConfig {
  if (!existsSync(path)) {
    return { raw: {} };
  }
  const text = readFileSync(path, 'utf-8').trim();
  if (!text) return { raw: {} };
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error(
      `Existing config at ${path} is not valid JSON — refusing to overwrite. Fix it manually and retry. (${(err as Error).message})`
    );
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Existing config at ${path} is not a JSON object — refusing to overwrite.`);
  }
  return { raw: parsed as Record<string, unknown> };
}

export function runInit(
  client: string,
  env: NodeJS.ProcessEnv = process.env,
  platform: NodeJS.Platform = process.platform
): InitResult {
  if (!isSupportedClient(client)) {
    throw new Error(
      `Unsupported --client=${client}. Supported: ${SUPPORTED_CLIENTS.join(', ')}`
    );
  }

  const target = resolveClient(client, env, platform);
  const mcpUrl = getMcpUrl(env);
  const stanza = buildServerStanza(mcpUrl);

  const created = !existsSync(target.configPath);
  const { raw } = parseConfigFile(target.configPath);

  const existing = (raw.mcpServers as Record<string, unknown> | undefined) ?? {};
  raw.mcpServers = { ...existing, [target.serverKey]: stanza };

  const dir = dirname(target.configPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(target.configPath, JSON.stringify(raw, null, 2) + '\n');

  return {
    client,
    configPath: target.configPath,
    serverKey: target.serverKey,
    mcpUrl,
    created,
  };
}

export function parseInitArgs(args: string[]): { client: string } {
  let client = '';
  for (const arg of args) {
    const [k, v] = arg.split('=', 2);
    if (k === '--client' && v) client = v;
  }
  if (!client) {
    throw new Error(
      `Missing --client=<name>. Supported: ${SUPPORTED_CLIENTS.join(', ')}`
    );
  }
  return { client };
}
