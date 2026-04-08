import { describe, it, expect } from 'vitest';
import { stakingToolSchemas, STAKING_RELAY_TYPES } from '../staking.js';

describe('stakingToolSchemas', () => {
  describe('toreva_stake', () => {
    it('parses valid input', () => {
      const result = stakingToolSchemas.toreva_stake.safeParse({
        wallet: 'abc',
        amount: 1.5,
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative amount', () => {
      const result = stakingToolSchemas.toreva_stake.safeParse({
        wallet: 'abc',
        amount: -1,
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing wallet', () => {
      const result = stakingToolSchemas.toreva_stake.safeParse({
        amount: 1.5,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('toreva_unstake', () => {
    it('parses valid input', () => {
      const result = stakingToolSchemas.toreva_unstake.safeParse({
        wallet: 'abc',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('STAKING_RELAY_TYPES', () => {
  it('maps toreva_stake to staking.stake', () => {
    expect(STAKING_RELAY_TYPES.toreva_stake).toBe('staking.stake');
  });

  it('maps toreva_unstake to staking.unstake', () => {
    expect(STAKING_RELAY_TYPES.toreva_unstake).toBe('staking.unstake');
  });

  it('all staking tools have corresponding relay types', () => {
    const schemaKeys = Object.keys(stakingToolSchemas).sort();
    const relayKeys = Object.keys(STAKING_RELAY_TYPES).sort();
    expect(schemaKeys).toEqual(relayKeys);
    expect(schemaKeys).toHaveLength(2);
  });
});
