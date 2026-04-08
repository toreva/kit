import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, type Tool } from '@modelcontextprotocol/sdk/types.js';
import { intentToolSchemas, perpsToolSchemas, walletToolSchemas, stakingToolSchemas } from '@toreva/types';
import type { ZodTypeAny } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { RelayClient } from './relay-client.js';
import { withBranding } from './tools/branding.js';
import { catalogToolDefinition, toCatalogRelayRequest } from './tools/catalog.js';
import { earnToolDefinition, toEarnRelayRequest } from './tools/earn.js';
import { intentToolDefinitions, toIntentRelayRequest } from './tools/intents.js';
import { perpsToolDefinitions, toPerpsRelayRequest } from './tools/perps.js';
import { stakingToolDefinitions, toStakingRelayRequest } from './tools/staking.js';
import { walletToolDefinitions, toWalletRelayRequest } from './tools/wallet.js';

function toInputSchema(zodSchema: ZodTypeAny): Tool['inputSchema'] {
  const jsonSchema = zodToJsonSchema(zodSchema, { target: 'openApi3' }) as Record<string, unknown>;
  const { $schema: _, ...rest } = jsonSchema;
  return rest as Tool['inputSchema'];
}

const allSchemas: Record<string, ZodTypeAny> = {
  ...intentToolSchemas,
  ...perpsToolSchemas,
  ...walletToolSchemas,
  ...stakingToolSchemas,
  toreva_strategies: catalogToolDefinition.inputSchema,
  toreva_earn: earnToolDefinition.inputSchema,
};

const toolDescriptions: Array<{ name: string; description: string }> = [
  { name: 'toreva_scan', description: 'Scan a Solana wallet to find idle capital, yield opportunities, and risk flags. Returns actionable recommendations ranked by expected return. Non-custodial.' },
  { name: 'toreva_simulate', description: 'Simulate execution of a strategy without committing funds. Returns projected returns, fees, venue selection, and risk assessment. Use before toreva_execute to preview what will happen.' },
  { name: 'toreva_execute', description: 'Execute a strategy on Solana. Supports earning yield on USDC, staking SOL, rebalancing portfolios, and more. Non-custodial. Every action receipted.' },
  { name: 'toreva_explain', description: 'Explain an existing intent, receipt, or strategy in plain language. Provides breakdown of what happened, fees charged, and reasoning behind venue selection.' },
  { name: 'toreva_configure', description: 'Configure preferences for toreva execution. Set default constraints, preferred protocols, and risk tolerance.' },
  { name: 'toreva_perps_long', description: 'Open a long perpetual futures position on Solana. Routes to better execution across Jupiter Perps, Pacifica, Drift, and Flash Trade \u2014 compares fees, funding rate, and available liquidity, then routes to whichever venue offers a better fill. 1 bps execution fee on notional. Trades routed to Drift receive a 5% fee discount vs going direct. Your agent decides direction, size, and leverage. Toreva handles venue selection and transaction construction. Non-custodial. Every execution receipted. Execution only \u2014 not financial advice.' },
  { name: 'toreva_perps_short', description: 'Open a short perpetual futures position on Solana. Routes to better execution across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps execution fee on notional. Trades routed to Drift receive a 5% fee discount vs going direct. Your agent decides direction, size, and leverage. Toreva handles venue selection and transaction construction. Non-custodial. Execution only \u2014 not financial advice.' },
  { name: 'toreva_perps_close', description: "Close a perpetual futures position. Executes at the position's venue. Free \u2014 no Toreva fee. Non-custodial. Execution only." },
  { name: 'toreva_perps_add_margin', description: "Add margin to a perpetual futures position. Executes at the position's venue. Free \u2014 no Toreva fee. Non-custodial." },
  { name: 'toreva_perps_remove_margin', description: "Remove margin from a perpetual futures position. Executes at the position's venue. Free \u2014 no Toreva fee. Non-custodial." },
  { name: 'toreva_perps_cancel_order', description: "Cancel an open perpetual futures order. Executes at the position's venue. Free \u2014 no Toreva fee. Non-custodial." },
  { name: 'toreva_perps_funding_settle', description: "Settle funding payments on a perpetual futures position. Executes at the position's venue. Free \u2014 no Toreva fee. Non-custodial." },
  { name: 'toreva_perps_query_position', description: 'Query open perpetual futures positions for a wallet. Read-only. Free.' },
  { name: 'toreva_perps_query_funding', description: 'Query current funding rates across Jupiter Perps, Pacifica, Drift, and Flash Trade for a token. Read-only. Free.' },
  { name: 'toreva_perps_query_venues', description: 'List available perps venues with fee structures. Read-only. Free.' },
  { name: 'toreva_perps_query_markets', description: 'List available perpetual futures markets. Read-only. Free.' },
  { name: 'toreva_perps_simulate', description: 'Simulate opening a perpetual futures position without executing. Compares Jupiter Perps, Pacifica, Drift, and Flash Trade on fees, funding rate, and liquidity. Returns projected entry price, fees, funding cost, and venue comparison. Free \u2014 no execution, no fee. Use before toreva_perps_long or toreva_perps_short to preview what would happen.' },
  { name: 'toreva_perps_explain', description: 'Explain a perpetual futures position or trade. Returns venue used, entry price, fees paid, funding rate at entry, current P&L if open, and why the venue was selected. Free. Use after execution to understand what happened and why.' },
  { name: 'toreva_balance', description: 'Query wallet SOL and token balances' },
  { name: 'toreva_tokens', description: 'List all token holdings in a wallet' },
  { name: 'toreva_stake', description: 'Stake SOL via liquid staking' },
  { name: 'toreva_unstake', description: 'Unstake SOL from liquid staking' },
  { name: 'toreva_strategies', description: 'Browse the toreva strategy catalog. Returns available strategies with descriptions, risk labels, and pricing tiers. Use to discover what toreva can do before executing.' },
  { name: 'toreva_earn', description: 'Deploy idle USDC to the highest-yield DeFi lending strategy on Solana. Risk-ranked across verified venues (Kamino, Marginfi, Drift). Scan, simulate projected returns with fees, and execute via user-signable transaction. Non-custodial. Every action receipted.' },
];

export function createServer(relayClient: RelayClient): Server {
  const server = new Server({ name: '@toreva/mcp', version: '0.1.2' }, { capabilities: { tools: {} } });

  const tools: Tool[] = toolDescriptions.map(({ name, description }) => ({
    name,
    description,
    inputSchema: allSchemas[name]
      ? toInputSchema(allSchemas[name])
      : { type: 'object' as const }, // fallback — no typed schema yet
  }));

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const payload = request.params.arguments ?? {};

    const relayRequest = intentToolDefinitions.some((t) => t.name === toolName)
      ? toIntentRelayRequest(toolName as never, payload)
      : perpsToolDefinitions.some((t) => t.name === toolName)
        ? toPerpsRelayRequest(toolName as never, payload)
        : walletToolDefinitions.some((t) => t.name === toolName)
          ? toWalletRelayRequest(toolName as never, payload)
          : stakingToolDefinitions.some((t) => t.name === toolName)
            ? toStakingRelayRequest(toolName as never, payload)
            : toolName === catalogToolDefinition.name
              ? toCatalogRelayRequest(payload)
              : toolName === earnToolDefinition.name
                ? toEarnRelayRequest(payload as never)
                : null;

    if (!relayRequest) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    const relayResponse = await relayClient.send(relayRequest);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(withBranding(relayResponse), null, 2)
        }
      ]
    };
  });

  return server;
}

export async function runServer(): Promise<void> {
  const relayUrl = process.env.RELAY_URL ?? 'https://gateway.toreva.com';
  const relayAuthToken = process.env.RELAY_AUTH_TOKEN;

  if (!relayAuthToken) {
    throw new Error('RELAY_AUTH_TOKEN is required');
  }

  const server = createServer(new RelayClient({ relayUrl, relayAuthToken }));
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
