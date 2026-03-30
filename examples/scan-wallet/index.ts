import { TorevaClient } from '@toreva/sdk';

const client = new TorevaClient({
  relayUrl: process.env.RELAY_URL ?? 'https://gateway.toreva.com',
  relayAuthToken: process.env.RELAY_AUTH_TOKEN ?? ''
});

void client.relay({
  type: 'intent.scan',
  toolName: 'toreva_scan',
  payload: {
    wallet: 'ExampleWallet111111111111111111111111111111111',
    prompt: 'Scan balances and open positions'
  }
});
