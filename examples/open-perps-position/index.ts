import { PerpsApi, TorevaClient } from '@toreva/sdk';

const client = new TorevaClient({
  relayUrl: process.env.RELAY_URL ?? 'https://gateway.toreva.com',
  relayAuthToken: process.env.RELAY_AUTH_TOKEN ?? ''
});

const perps = new PerpsApi(client);

void perps.call('toreva_perps_long', {
  wallet: 'ExampleWallet111111111111111111111111111111111',
  market: 'SOL-PERP',
  notionalUsd: 100,
  venue: 'drift'
});
