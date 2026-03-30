import { earnRequestSchema, type RelayRequest } from '@toreva/types';

export const earnToolDefinition = {
  name: 'toreva_earn',
  inputSchema: earnRequestSchema
};

export function toEarnRelayRequest(payload: { operation: 'scan' | 'simulate' | 'execute'; [k: string]: unknown }): RelayRequest {
  return {
    type: `earn.${payload.operation}`,
    toolName: earnToolDefinition.name,
    payload
  };
}
