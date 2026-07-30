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

describe('public MCP tool families', () => {
  it('registers exactly the seven policy-envelope tools', async () => {
    const tools = await listTools();

    expect(tools).toHaveLength(7);
    expect(tools.every((tool) => tool.name.startsWith('toreva_'))).toBe(true);
  });

  it('descriptions are short, front-loaded lines', async () => {
    const tools = await listTools();

    for (const tool of tools) {
      const lines = tool.description?.split('\n') ?? [];
      expect(lines.length).toBeGreaterThanOrEqual(3);
      expect(lines.every((line) => line.length <= 80)).toBe(true);
    }
  });
});
