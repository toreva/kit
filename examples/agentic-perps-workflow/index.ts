import { PerpsApi, TorevaClient } from '@toreva/sdk';

const walletAddress = process.env.TOREVA_HUMAN_WALLET ?? 'ExampleWallet111111111111111111111111111111111';

const client = new TorevaClient({
  relayUrl: process.env.RELAY_URL ?? 'https://gateway.toreva.com',
  relayAuthToken: process.env.TOREVA_AUTH_TOKEN ?? ''
});

const perps = new PerpsApi(client);

async function main() {
  await client.relay({
    type: 'intent.establish',
    toolName: 'toreva_establish',
    requestId: 'example-establish-perps-agent',
    payload: {
      walletAddress,
      prompt: 'Create a capped Toreva perps agent for SOL with Pacifica available as a child capability.',
      agent_authority: {
        delegation_provider: 'swig',
        network: 'solana',
        signer_kind: 'delegated_authority',
        policy_id: 'perps_agent_v1'
      },
      capabilities: [
        {
          capability_type: 'perps',
          delegation_provider: 'venue_api',
          network: 'solana',
          venue: 'pacifica',
          execution_adapter: 'pacifica',
          signer_kind: 'venue_api_agent',
          guardrails: {
            max_notional_usd: 500,
            max_leverage: 1.5,
            markets: ['SOL-PERP'],
            collateral_tokens: ['USDC'],
            requires_human_approval_for_funding: true
          }
        }
      ]
    }
  });

  await perps.call('toreva_perps_query_venues', {});

  await perps.call('toreva_perps_simulate', {
    walletAddress,
    token: 'SOL',
    direction: 'long',
    sizeUsd: 180,
    leverage: 1.2,
    collateralToken: 'USDC',
    collateralAmount: 150
  });

  await perps.call('toreva_perps_long', {
    walletAddress,
    token: 'SOL',
    sizeUsd: 180,
    leverage: 1.2,
    collateralToken: 'USDC',
    collateralAmount: 150,
    maxSlippageBps: 50,
    clientRequestId: 'example-agentic-perps-workflow-open'
  });

  await perps.call('toreva_perps_query_position', {
    walletAddress,
    venue: 'pacifica'
  });

  await perps.call('toreva_perps_close', {
    walletAddress,
    venue: 'pacifica',
    positionId: '<position-id>',
    token: 'SOL',
    side: 'long',
    maxSlippageBps: 50,
    clientRequestId: 'example-agentic-perps-workflow-close'
  });
}

void main();
