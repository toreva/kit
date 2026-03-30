import { PERPS_RELAY_TYPES, perpsToolSchemas, type PerpsToolName, type RelayRequest } from '@toreva/types';

export const perpsToolDefinitions = (Object.keys(perpsToolSchemas) as PerpsToolName[]).map((toolName) => ({
  name: toolName,
  relayType: PERPS_RELAY_TYPES[toolName],
  inputSchema: perpsToolSchemas[toolName]
}));

export function toPerpsRelayRequest(toolName: PerpsToolName, payload: unknown): RelayRequest {
  return {
    type: PERPS_RELAY_TYPES[toolName],
    toolName,
    payload
  };
}
