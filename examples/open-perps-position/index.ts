import { PerpsApi, TorevaClient } from '@toreva/sdk';

const client = new TorevaClient({
  relayUrl: process.env.RELAY_URL ?? 'https://gateway.toreva.com',
  relayAuthToken: process.env.TOREVA_AUTH_TOKEN ?? ''
});

const perps = new PerpsApi(client);

void perps.call('toreva_perps_long', {
  walletAddress: 'ExampleWallet111111111111111111111111111111111',
  token: 'SOL',
  sizeUsd: 100,
  leverage: 1.2,
  collateralToken: 'USDC',
  collateralAmount: 84
});
