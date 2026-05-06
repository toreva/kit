import { describe, it, expect } from 'vitest';
import { createServer } from '../server.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

const mockRelayClient = { send: async () => ({ ok: true }) } as any;

async function listTools(): Promise<Tool[]> {
  const server = createServer(mockRelayClient);
  const handler = (server as any)._requestHandlers?.get('tools/list');
  if (handler) {
    const result = await handler({ method: 'tools/list' });
    return result.tools as Tool[];
  }
  throw new Error('Could not find tools/list handler on server');
}

function findTool(tools: Tool[], name: string): Tool {
  const tool = tools.find((t) => t.name === name);
  if (!tool) throw new Error(`Tool ${name} not found`);
  return tool;
}

describe('inputSchemas — typed per tool', () => {
  it('toreva_establish requires walletAddress and accepts child capabilities', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_establish').inputSchema as any;
    expect(schema.required).toEqual(['walletAddress']);
    expect(schema.properties).toHaveProperty('capabilities');
    expect(schema.properties).toHaveProperty('agent_authority');
  });

  it('toreva_scan inputSchema has required=[wallet, prompt]', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_scan').inputSchema;
    expect(schema.required).toEqual(expect.arrayContaining(['wallet', 'prompt']));
    expect(schema.required).toHaveLength(2);
  });

  it('toreva_perps_long inputSchema matches Gateway open input contract', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_perps_long').inputSchema;
    expect(schema.required).toEqual(
      expect.arrayContaining([
        'walletAddress',
        'token',
        'sizeUsd',
        'leverage',
        'collateralToken',
        'collateralAmount'
      ])
    );
  });

  it('toreva_perps_long inputSchema has venue as optional', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_perps_long').inputSchema as any;
    expect(schema.required).not.toContain('venue');
    expect(schema.properties).toHaveProperty('venue');
  });

  it('toreva_perps_query_venues has no required properties', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_perps_query_venues').inputSchema;
    const required = schema.required ?? [];
    expect(required).toHaveLength(0);
  });

  it('no tool has additionalProperties: true (generic schema is gone)', async () => {
    const tools = await listTools();
    for (const tool of tools) {
      expect(tool.inputSchema).not.toHaveProperty('additionalProperties', true);
    }
  });

  it('all tools have type: object inputSchema', async () => {
    const tools = await listTools();
    for (const tool of tools) {
      expect(tool.inputSchema.type).toBe('object');
    }
  });

  it('toreva_configure inputSchema includes optional settings property', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_configure').inputSchema as any;
    expect(schema.properties).toHaveProperty('settings');
    expect(schema.required).not.toContain('settings');
  });
});
