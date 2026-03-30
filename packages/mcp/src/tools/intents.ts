import { INTENT_RELAY_TYPES, intentToolSchemas, type IntentToolName, type RelayRequest } from '@toreva/types';

export const intentToolDefinitions = (Object.keys(intentToolSchemas) as IntentToolName[]).map((toolName) => ({
  name: toolName,
  relayType: INTENT_RELAY_TYPES[toolName],
  inputSchema: intentToolSchemas[toolName]
}));

export function toIntentRelayRequest(toolName: IntentToolName, payload: unknown): RelayRequest {
  return {
    type: INTENT_RELAY_TYPES[toolName],
    toolName,
    payload
  };
}
