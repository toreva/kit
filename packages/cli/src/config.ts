import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * Default Toreva MCP gateway URL. Override with TOREVA_MCP_URL env var.
 */
export const DEFAULT_MCP_URL = 'https://mcp.toreva.com';

export interface TorevaConfig {
  mcpUrl: string;
  authToken?: string;
  issuedAt?: string;
}

export function getConfigDir(env: NodeJS.ProcessEnv = process.env): string {
  if (env.TOREVA_CONFIG_DIR) return env.TOREVA_CONFIG_DIR;
  return join(homedir(), '.config', 'toreva');
}

export function getConfigPath(env: NodeJS.ProcessEnv = process.env): string {
  return join(getConfigDir(env), 'config.json');
}

export function getMcpUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.TOREVA_MCP_URL || DEFAULT_MCP_URL;
}

export function readConfig(env: NodeJS.ProcessEnv = process.env): TorevaConfig | null {
  const path = getConfigPath(env);
  if (!existsSync(path)) return null;
  try {
    const raw = readFileSync(path, 'utf-8');
    return JSON.parse(raw) as TorevaConfig;
  } catch {
    return null;
  }
}

export function writeConfig(config: TorevaConfig, env: NodeJS.ProcessEnv = process.env): string {
  const dir = getConfigDir(env);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  const path = getConfigPath(env);
  writeFileSync(path, JSON.stringify(config, null, 2) + '\n', { mode: 0o600 });
  return path;
}
