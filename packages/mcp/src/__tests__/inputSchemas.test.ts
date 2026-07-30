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

describe('inputSchemas — policy-envelope MCP tools', () => {
  it('lists only the public policy-envelope tool set', async () => {
    const tools = await listTools();

    expect(tools.map((tool) => tool.name).sort()).toEqual([
      'toreva_establish_agent_wallet',
      'toreva_execute_within_policy',
      'toreva_explain_action',
      'toreva_get_receipt',
      'toreva_read_or_scan',
      'toreva_refuse_action',
      'toreva_simulate_action'
    ].sort());
  });

  it('does not publish perps, earn, staking, or strategy catalog tools', async () => {
    const tools = await listTools();
    const names = tools.map((tool) => tool.name);

    expect(names.some((name) => name.includes('perps'))).toBe(false);
    expect(names.some((name) => name.includes('earn'))).toBe(false);
    expect(names.some((name) => name.includes('stake'))).toBe(false);
    expect(names).not.toContain('toreva_strategies');
  });

  it('establish agent wallet requires human wallet and policy bounds', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_establish_agent_wallet').inputSchema as any;

    expect(schema.required).toEqual(expect.arrayContaining(['human_wallet_address', 'policy_bounds']));
    expect(schema.properties.policy_bounds.required).toEqual(expect.arrayContaining([
      'daily_notional_lamports',
      'operations_per_day',
      'cooldown_seconds',
      'risk_tier_ceiling',
      'allowed_operations',
      'valid_until'
    ]));
  });

  it('read or scan requires a discriminated wallet target', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_read_or_scan').inputSchema as any;

    expect(schema.required).toEqual(expect.arrayContaining(['target_wallet', 'prompt']));
    expect(schema.properties.target_wallet).toHaveProperty('anyOf');
  });

  it('execute-within-policy requires an agent wallet target and simulation receipt', async () => {
    const tools = await listTools();
    const schema = findTool(tools, 'toreva_execute_within_policy').inputSchema as any;

    expect(schema.required).toEqual(expect.arrayContaining([
      'target_wallet',
      'policy_bounds',
      'requested_action'
    ]));
    expect(schema.properties.requested_action.required).toContain('simulation_receipt_id');
  });

  it('no tool has additionalProperties: true', async () => {
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
});
