import { TorevaClient } from '@toreva/sdk';

export async function runScanCommand(wallet: string, prompt: string): Promise<void> {
  const relayAuthToken = process.env.RELAY_AUTH_TOKEN;
  if (!relayAuthToken) {
    throw new Error('RELAY_AUTH_TOKEN is required');
  }

  const client = new TorevaClient({ relayAuthToken, relayUrl: process.env.RELAY_URL });
  const result = await client.relay({
    type: 'intent.scan',
    toolName: 'toreva_scan',
    payload: { wallet, prompt }
  });

  console.log(JSON.stringify(result, null, 2));
}
