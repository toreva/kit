import { WALLET_RELAY_TYPES, walletToolSchemas, type WalletToolName, type RelayRequest } from '@toreva/types';

export const walletToolDefinitions = (Object.keys(walletToolSchemas) as WalletToolName[]).map((toolName) => ({
  name: toolName,
  relayType: WALLET_RELAY_TYPES[toolName],
  inputSchema: walletToolSchemas[toolName]
}));

export function toWalletRelayRequest(toolName: WalletToolName, payload: unknown): RelayRequest {
  return {
    type: WALLET_RELAY_TYPES[toolName],
    toolName,
    payload
  };
}
