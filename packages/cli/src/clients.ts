import { homedir } from 'node:os';
import { join } from 'node:path';

export type SupportedClient = 'claude-desktop' | 'openclaw' | 'cursor';

export const SUPPORTED_CLIENTS: SupportedClient[] = ['claude-desktop', 'openclaw', 'cursor'];

export interface ClientTarget {
  /** Human-readable client name. */
  label: string;
  /** Absolute path to the client's MCP config file. */
  configPath: string;
  /** Logical key the connector should be registered under. */
  serverKey: string;
}

export function isSupportedClient(value: string): value is SupportedClient {
  return (SUPPORTED_CLIENTS as string[]).includes(value);
}

/**
 * Resolve the on-disk config path for a given MCP-aware client.
 *
 * Paths follow the documented defaults for each client:
 * - Claude Desktop: ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
 * - OpenClaw: ~/.config/openclaw/mcp.json
 * - Cursor: ~/.cursor/mcp.json
 *
 * Override roots via env vars for tests:
 *   TOREVA_HOME — overrides homedir()
 *   TOREVA_CLAUDE_DESKTOP_CONFIG / TOREVA_OPENCLAW_CONFIG / TOREVA_CURSOR_CONFIG — full path overrides
 */
export function resolveClient(
  client: SupportedClient,
  env: NodeJS.ProcessEnv = process.env,
  platform: NodeJS.Platform = process.platform
): ClientTarget {
  const home = env.TOREVA_HOME || homedir();

  switch (client) {
    case 'claude-desktop': {
      const override = env.TOREVA_CLAUDE_DESKTOP_CONFIG;
      const path =
        override ||
        (platform === 'darwin'
          ? join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json')
          : platform === 'win32'
            ? join(env.APPDATA || join(home, 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json')
            : join(home, '.config', 'Claude', 'claude_desktop_config.json'));
      return { label: 'Claude Desktop', configPath: path, serverKey: 'toreva' };
    }
    case 'openclaw': {
      const override = env.TOREVA_OPENCLAW_CONFIG;
      const path = override || join(home, '.config', 'openclaw', 'mcp.json');
      return { label: 'OpenClaw', configPath: path, serverKey: 'toreva' };
    }
    case 'cursor': {
      const override = env.TOREVA_CURSOR_CONFIG;
      const path = override || join(home, '.cursor', 'mcp.json');
      return { label: 'Cursor', configPath: path, serverKey: 'toreva' };
    }
  }
}
