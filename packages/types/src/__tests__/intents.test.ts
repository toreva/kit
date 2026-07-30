import { describe, it, expect } from 'vitest';
import { intentToolSchemas, INTENT_RELAY_TYPES } from '../intents.js';

const humanWallet = '11111111111111111111111111111111';
const agentWallet = '22222222222222222222222222222222';

const policyBounds = {
  daily_notional_lamports: 1_000_000,
  operations_per_day: 3,
  cooldown_seconds: 60,
  risk_tier_ceiling: 'low',
  allowed_operations: ['read', 'scan', 'simulate', 'prepare_unsigned_transaction'],
  valid_until: null
};

describe('intentToolSchemas', () => {
  it('requires non-null policy caps when establishing an agent wallet', () => {
    const result = intentToolSchemas.toreva_establish_agent_wallet.safeParse({
      human_wallet_address: humanWallet,
      policy_bounds: policyBounds
    });

    expect(result.success).toBe(true);
  });

  it('rejects omitted caps on establish', () => {
    const result = intentToolSchemas.toreva_establish_agent_wallet.safeParse({
      human_wallet_address: humanWallet
    });

    expect(result.success).toBe(false);
  });

  it('rejects null cap sentinels while allowing nullable valid_until', () => {
    const result = intentToolSchemas.toreva_establish_agent_wallet.safeParse({
      human_wallet_address: humanWallet,
      policy_bounds: {
        ...policyBounds,
        daily_notional_lamports: null
      }
    });

    expect(result.success).toBe(false);
  });

  it('separates human wallet and agent wallet targets by wallet_role', () => {
    const humanResult = intentToolSchemas.toreva_read_or_scan.safeParse({
      target_wallet: {
        wallet_role: 'human_wallet',
        human_wallet_address: humanWallet
      },
      prompt: 'scan'
    });
    const agentResult = intentToolSchemas.toreva_read_or_scan.safeParse({
      target_wallet: {
        wallet_role: 'agent_wallet',
        agent_wallet_address: agentWallet
      },
      prompt: 'scan'
    });

    expect(humanResult.success).toBe(true);
    expect(agentResult.success).toBe(true);
  });

  it('rejects an agent address under a human wallet role', () => {
    const result = intentToolSchemas.toreva_read_or_scan.safeParse({
      target_wallet: {
        wallet_role: 'human_wallet',
        agent_wallet_address: agentWallet
      },
      prompt: 'scan'
    });

    expect(result.success).toBe(false);
  });

  it('prepare-unsigned-transaction only accepts the agent wallet target', () => {
    const result = intentToolSchemas.toreva_prepare_unsigned_transaction.safeParse({
      target_wallet: {
        wallet_role: 'human_wallet',
        human_wallet_address: humanWallet
      },
      policy_bounds: policyBounds,
      requested_action: {
        user_instruction: 'send to my own wallet',
        operation: 'prepare_unsigned_transaction',
        simulation_receipt_id: 'receipt-123',
        own_address_destination: {
          wallet_role: 'human_wallet',
          human_wallet_address: humanWallet,
          address_is_user_attested_own_address: true
        }
      }
    });

    expect(result.success).toBe(false);
  });
});

describe('INTENT_RELAY_TYPES', () => {
  it('maps all policy-envelope tools to relay types', () => {
    const schemaKeys = Object.keys(intentToolSchemas).sort();
    const relayKeys = Object.keys(INTENT_RELAY_TYPES).sort();

    expect(schemaKeys).toEqual(relayKeys);
    expect(schemaKeys).toHaveLength(7);
  });
});
