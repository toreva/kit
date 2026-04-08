import { describe, it, expect } from 'vitest';
import { createServer } from '../server.js';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { WALLET_RELAY_TYPES } from '@toreva/types';
import { STAKING_RELAY_TYPES } from '@toreva/types';

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

describe('wallet tools registration', () => {
  it('createServer registers toreva_balance tool', async () => {
    const tools = await listTools();
    expect(tools.some((t) => t.name === 'toreva_balance')).toBe(true);
  });

  it('createServer registers toreva_tokens tool', async () => {
    const tools = await listTools();
    expect(tools.some((t) => t.name === 'toreva_tokens')).toBe(true);
  });

  it('toreva_balance requires wallet param', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_balance').inputSchema;
    expect(schema.required).toEqual(['wallet']);
  });

  it('toreva_balance maps to relay type wallet.balance', () => {
    expect(WALLET_RELAY_TYPES.toreva_balance).toBe('wallet.balance');
  });
});

describe('staking tools registration', () => {
  it('createServer registers toreva_stake tool', async () => {
    const tools = await listTools();
    expect(tools.some((t) => t.name === 'toreva_stake')).toBe(true);
  });

  it('createServer registers toreva_unstake tool', async () => {
    const tools = await listTools();
    expect(tools.some((t) => t.name === 'toreva_unstake')).toBe(true);
  });

  it('toreva_stake requires wallet and amount params', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_stake').inputSchema;
    expect(schema.required).toEqual(expect.arrayContaining(['wallet', 'amount']));
    expect(schema.required).toHaveLength(2);
  });

  it('toreva_stake maps to relay type staking.stake', () => {
    expect(STAKING_RELAY_TYPES.toreva_stake).toBe('staking.stake');
  });
});

describe('total tool count', () => {
  it('registers exactly 24 tools (20 existing + 4 new)', async () => {
    const tools = await listTools();
    expect(tools).toHaveLength(24);
  });
});
