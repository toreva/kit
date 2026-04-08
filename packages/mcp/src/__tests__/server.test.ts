import { describe, it, expect } from 'vitest';
import { createServer } from '../server.js';

// Minimal mock of RelayClient — server tests only exercise tool registration, not relay calls
const mockRelayClient = { send: async () => ({ ok: true }) } as any;

describe('createServer', () => {
  async function listTools() {
    const server = createServer(mockRelayClient);
    const handler = (server as any)._requestHandlers?.get('tools/list');
    if (handler) {
      const result = await handler({ method: 'tools/list' });
      return result.tools as Array<{ name: string; description: string }>;
    }
    throw new Error('Could not find tools/list handler on server');
  }

  it('registers exactly 24 tools', async () => {
    const tools = await listTools();
    expect(tools).toHaveLength(24);
  });

  it('all tool names start with toreva_', async () => {
    const tools = await listTools();
    for (const tool of tools) {
      expect(tool.name).toMatch(/^toreva_/);
    }
  });

  it('every tool has a non-empty description', async () => {
    const tools = await listTools();
    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
      expect(tool.description.length).toBeGreaterThan(0);
    }
  });
});
