import {
  type PerpsToolInput,
  type PerpsToolName,
  type PerpsToolResult,
  type RelayResponse,
} from '@toreva/types';
import { TorevaClient } from './client.js';

/**
 * DISCOVERY_ONLY guard for perps execution.
 *
 * As of v0.2.0 (R1, 2026-05-10) perps tools are MCP-discoverable but every
 * `tools/call` returns CLASS_A_PENDING. Execution lands in R3 once Sentinel
 * adversarial review and Risk admission complete for at least one perps
 * venue (pacifica candidate). Until then any SDK invocation throws — better
 * to fail fast at the caller than to silently return CLASS_A_PENDING.
 *
 * Read-only `query_*` tools are also gated here today; they will be unlocked
 * in R2 once the read-only adapter ships. Use the MCP discovery surface
 * directly (e.g. `mcp.toreva.com/mcp tools/list`) to inspect schemas now.
 *
 * Type exports below remain available for IDE discoverability and downstream
 * compile-time integration. Runtime calls throw.
 *
 * Tracking: https://toreva.com/roadmap
 */

export class PerpsApi {
  constructor(private readonly _client: TorevaClient) {}

  call<TToolName extends PerpsToolName>(
    toolName: TToolName,
    _payload: PerpsToolInput<TToolName>
  ): Promise<RelayResponse<PerpsToolResult<TToolName>>> {
    throw new Error(
      `DISCOVERY_ONLY: perps tool "${toolName}" cannot be executed via SDK in v0.2.0 (R1). ` +
        `Perps execution lands in R3 once Sentinel adversarial review + Risk admission complete. ` +
        `Use mcp.toreva.com/mcp tools/list for read-only discovery. See https://toreva.com/roadmap`
    );
  }
}

/**
 * Helper aliases so callers using `import { openLong } from '@toreva/sdk'`
 * style get the same DISCOVERY_ONLY error fast. R3 will replace these stubs
 * with real implementations.
 */
function discoveryOnly(toolName: string): never {
  throw new Error(
    `DISCOVERY_ONLY: ${toolName} is not yet operational. ` +
      `Perps execution lands in R3. Use toreva_perps_query_* tools for read-only discovery once R2 ships. ` +
      `See https://toreva.com/roadmap`
  );
}

export function openLong(_args?: unknown): never {
  return discoveryOnly('openLong');
}

export function openShort(_args?: unknown): never {
  return discoveryOnly('openShort');
}

export function closePosition(_args?: unknown): never {
  return discoveryOnly('closePosition');
}

export function addMargin(_args?: unknown): never {
  return discoveryOnly('addMargin');
}

export function removeMargin(_args?: unknown): never {
  return discoveryOnly('removeMargin');
}

export function cancelOrder(_args?: unknown): never {
  return discoveryOnly('cancelOrder');
}

// Re-export types for IDE discoverability — type-only, no runtime cost.
export type {
  PerpsToolInput,
  PerpsToolName,
  PerpsToolResult,
} from '@toreva/types';
