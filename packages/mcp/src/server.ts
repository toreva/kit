import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, type Tool } from '@modelcontextprotocol/sdk/types.js';
import { intentToolSchemas } from '@toreva/types';
import type { ZodTypeAny } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { resolveRuntimeConfig } from './config.js';
import { RelayClient } from './relay-client.js';
import { withBranding } from './tools/branding.js';
import { intentToolDefinitions, toIntentRelayRequest } from './tools/intents.js';
import { isBoxPayload, renderTier1Box } from './tools/render-receipt-box.js';

function toInputSchema(zodSchema: ZodTypeAny): Tool['inputSchema'] {
  const jsonSchema = zodToJsonSchema(zodSchema, { target: 'openApi3' }) as Record<string, unknown>;
  const { $schema: _, ...rest } = jsonSchema;
  return rest as Tool['inputSchema'];
}

const allSchemas: Record<string, ZodTypeAny> = {
  ...intentToolSchemas,
};

const toolDescriptions: Array<{ name: string; description: string }> = [
  { name: 'toreva_establish_agent_wallet', description: 'Create the agent wallet.\nThe user sets hard limits first.\nToreva does not hold the key.\nReturns a receipt.' },
  { name: 'toreva_read_or_scan', description: 'Read or scan one wallet.\nSay human wallet or agent wallet.\nNo money moves.\nReturns a receipt.' },
  { name: 'toreva_simulate_action', description: 'Test the action first.\nOnly use the agent wallet.\nShow what would happen.\nReturns a receipt.' },
  { name: 'toreva_prepare_unsigned_transaction', description: 'Prepare an unsigned transaction.\nOnly after simulation.\nThe user signs elsewhere.\nNo money moves.\nReturns a receipt.' },
  { name: 'toreva_explain_action', description: 'Explain an action or receipt.\nUse short words.\nSay what happened.\nSay why it passed or failed.' },
  { name: 'toreva_get_receipt', description: 'Get one receipt.\nUse the receipt id.\nShow the final outcome.\nShow the limits used.' },
  { name: 'toreva_refuse_action', description: 'Refuse an unsafe action.\nSay the reason.\nDo not move money.\nReturns a refusal receipt.' },
];

export function createServer(relayClient: RelayClient): Server {
  const server = new Server({ name: '@toreva/mcp', version: '0.2.0' }, { capabilities: { tools: {} } });

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
      : null;

    if (!relayRequest) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    const relayResponse = await relayClient.send(relayRequest);

    const content: Array<{ type: 'text'; text: string }> = [];

    // If the gateway returned a grammar Box render payload for the chatgpt surface,
    // prepend the visual Tier-1 receipt so ChatGPT renders it before the raw JSON.
    if (isBoxPayload(relayResponse.result)) {
      const html = renderTier1Box({ ...relayResponse.result, surface: 'chatgpt' });
      if (html) content.push({ type: 'text', text: html });
    }

    content.push({ type: 'text', text: JSON.stringify(withBranding(relayResponse), null, 2) });

    return { content };
  });

  return server;
}

export async function runServer(): Promise<void> {
  const { relayUrl, relayAuthToken } = resolveRuntimeConfig();
  const server = createServer(new RelayClient({ relayUrl, relayAuthToken }));
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
