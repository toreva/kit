import { PERPS_RELAY_TYPES, perpsToolSchemas, type PerpsToolName, type RelayRequest } from '@toreva/types';

/**
 * R1 truthfulness flag (2026-05-10).
 *
 * Every perps tool below is `discovery_only: true`. The MCP surface advertises
 * them so callers can introspect schemas (`tools/list`), but `tools/call`
 * routes via the gateway relay which returns CLASS_A_PENDING for any perps
 * verb today. Execution lands in R3 once Sentinel adversarial review and
 * Risk admission complete for at least one perps venue.
 */
export const PERPS_DISCOVERY_ONLY = true;

export const perpsToolDefinitions = (Object.keys(perpsToolSchemas) as PerpsToolName[]).map((toolName) => ({
  name: toolName,
  relayType: PERPS_RELAY_TYPES[toolName],
  inputSchema: perpsToolSchemas[toolName],
  discovery_only: PERPS_DISCOVERY_ONLY,
}));

export function toPerpsRelayRequest(toolName: PerpsToolName, payload: unknown): RelayRequest {
  return {
    type: PERPS_RELAY_TYPES[toolName],
    toolName,
    payload
  };
}
