import { PerpsApi, TorevaClient } from '@toreva/sdk';
import type { PerpsToolName } from '@toreva/types';

export async function runPerpsCommand(toolName: PerpsToolName, payload: Record<string, unknown>): Promise<void> {
  const relayAuthToken = process.env.RELAY_AUTH_TOKEN;
  if (!relayAuthToken) {
    throw new Error('RELAY_AUTH_TOKEN is required');
  }

  const client = new TorevaClient({ relayAuthToken, relayUrl: process.env.RELAY_URL });
  const api = new PerpsApi(client);
  const result = await api.call(toolName, payload);
  console.log(JSON.stringify(result, null, 2));
}
