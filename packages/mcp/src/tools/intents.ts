import { INTENT_RELAY_TYPES, intentToolSchemas, type IntentToolName, type RelayRequest } from '@toreva/types';

export const intentToolDefinitions = (Object.keys(intentToolSchemas) as IntentToolName[]).map((toolName) => ({
  name: toolName,
  relayType: INTENT_RELAY_TYPES[toolName],
  inputSchema: intentToolSchemas[toolName]
}));

function extractSubject(toolName: IntentToolName, payload: unknown): string | undefined {
  const p = payload as Record<string, unknown>;

  if (toolName === 'toreva_explain_action') {
    const target = p.target_wallet as Record<string, unknown> | undefined;
    if (target?.wallet_role === 'human_wallet') {
      return target.human_wallet_address as string;
    }
    if (target?.wallet_role === 'agent_wallet') {
      return target.agent_wallet_address as string;
    }
  }

  if (toolName === 'toreva_get_receipt') {
    // For get_receipt, subject is not directly available; receipt_id is the key
    // Subject will be determined by the gateway when looking up the receipt
    return undefined;
  }

  return undefined;
}

export function toIntentRelayRequest(toolName: IntentToolName, payload: unknown): RelayRequest {
  const subject = extractSubject(toolName, payload);

  return {
    type: INTENT_RELAY_TYPES[toolName],
    toolName,
    subject,
    payload
  };
}
