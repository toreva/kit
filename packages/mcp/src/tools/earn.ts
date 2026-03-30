import { earnOperationSchema, earnRequestSchema, type RelayRequest } from '@toreva/types';

export const earnToolDefinition = {
  name: 'toreva_earn',
  inputSchema: earnRequestSchema
};

export function toEarnRelayRequest(payload: { operation: 'scan' | 'simulate' | 'execute'; [k: string]: unknown }): RelayRequest {
  const operation = earnOperationSchema.parse(payload.operation);
  return {
    type: `earn.${operation}`,
    toolName: earnToolDefinition.name,
    payload
  };
}
