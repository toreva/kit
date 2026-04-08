import { describe, it, expect } from 'vitest';
import { walletToolSchemas, WALLET_RELAY_TYPES } from '../wallet.js';

describe('walletToolSchemas', () => {
  describe('toreva_balance', () => {
    it('parses valid input', () => {
      const result = walletToolSchemas.toreva_balance.safeParse({
        wallet: 'abc',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing wallet', () => {
      const result = walletToolSchemas.toreva_balance.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('toreva_tokens', () => {
    it('parses valid input', () => {
      const result = walletToolSchemas.toreva_tokens.safeParse({
        wallet: 'abc',
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('WALLET_RELAY_TYPES', () => {
  it('maps toreva_balance to wallet.balance', () => {
    expect(WALLET_RELAY_TYPES.toreva_balance).toBe('wallet.balance');
  });

  it('maps toreva_tokens to wallet.tokens', () => {
    expect(WALLET_RELAY_TYPES.toreva_tokens).toBe('wallet.tokens');
  });

  it('all wallet tools have corresponding relay types', () => {
    const schemaKeys = Object.keys(walletToolSchemas).sort();
    const relayKeys = Object.keys(WALLET_RELAY_TYPES).sort();
    expect(schemaKeys).toEqual(relayKeys);
    expect(schemaKeys).toHaveLength(2);
  });
});
