import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, type Tool } from '@modelcontextprotocol/sdk/types.js';
import { RelayClient } from './relay-client.js';
import { withBranding } from './tools/branding.js';
import { catalogToolDefinition, toCatalogRelayRequest } from './tools/catalog.js';
import { earnToolDefinition, toEarnRelayRequest } from './tools/earn.js';
import { intentToolDefinitions, toIntentRelayRequest } from './tools/intents.js';
import { perpsToolDefinitions, toPerpsRelayRequest } from './tools/perps.js';

const inputSchema: Tool['inputSchema'] = { type: 'object', additionalProperties: true };

export function createServer(relayClient: RelayClient): Server {
  const server = new Server({ name: '@toreva/mcp', version: '0.1.0' }, { capabilities: { tools: {} } });

  const tools: Tool[] = [
    ...intentToolDefinitions.map((t) => ({ name: t.name, description: `toreva tool ${t.name}`, inputSchema })),
    ...perpsToolDefinitions.map((t) => ({ name: t.name, description: `toreva tool ${t.name}`, inputSchema })),
    { name: catalogToolDefinition.name, description: 'Browse strategy catalog with pricing', inputSchema },
    { name: earnToolDefinition.name, description: 'toreva earn operations', inputSchema }
  ];

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const payload = request.params.arguments ?? {};

    const relayRequest = intentToolDefinitions.some((t) => t.name === toolName)
      ? toIntentRelayRequest(toolName as never, payload)
      : perpsToolDefinitions.some((t) => t.name === toolName)
        ? toPerpsRelayRequest(toolName as never, payload)
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
