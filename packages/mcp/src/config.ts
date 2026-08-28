import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const DEFAULT_RELAY_URL = 'https://gateway.toreva.com';

export interface McpRuntimeConfig {
  relayUrl: string;
  relayAuthToken: string;
}

interface CliConfigFile {
  authToken?: unknown;
}

export function getTorevaConfigPath(env: NodeJS.ProcessEnv = process.env): string {
  const configDir = env.TOREVA_CONFIG_DIR ?? join(homedir(), '.config', 'toreva');
  return join(configDir, 'config.json');
}

function readCliAuthToken(env: NodeJS.ProcessEnv): string | undefined {
  const configPath = getTorevaConfigPath(env);
  if (!existsSync(configPath)) return undefined;

  let parsed: CliConfigFile;
  try {
    parsed = JSON.parse(readFileSync(configPath, 'utf8')) as CliConfigFile;
  } catch (err) {
    throw new Error(
      `Could not read Toreva CLI config at ${configPath}: ${(err as Error).message}`
    );
  }

  return typeof parsed.authToken === 'string' && parsed.authToken.length > 0
    ? parsed.authToken
    : undefined;
}

export function resolveRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env
): McpRuntimeConfig {
  const relayUrl = env.RELAY_URL ?? DEFAULT_RELAY_URL;
  const relayAuthToken =
    env.RELAY_AUTH_TOKEN ?? env.TOREVA_AUTH_TOKEN ?? readCliAuthToken(env);

  if (!relayAuthToken) {
    throw new Error(
      'RELAY_AUTH_TOKEN is required, or run `toreva login` before starting the MCP server.'
    );
  }

  return { relayUrl, relayAuthToken };
}
