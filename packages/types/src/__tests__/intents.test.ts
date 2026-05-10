import { describe, it, expect } from 'vitest';
import { intentToolSchemas, INTENT_RELAY_TYPES } from '../intents.js';

describe('intentToolSchemas', () => {
  describe('toreva_establish', () => {
    it('uses Gateway MCP walletAddress naming', () => {
      const result = intentToolSchemas.toreva_establish.safeParse({
        walletAddress: '11111111111111111111111111111111',
      });
      expect(result.success).toBe(true);
    });

    it('rejects the old wallet alias on establish', () => {
      const result = intentToolSchemas.toreva_establish.safeParse({
        wallet: '11111111111111111111111111111111',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('toreva_perps_establish', () => {
    it('is a perps-family alias for the same establish payload', () => {
      const result = intentToolSchemas.toreva_perps_establish.safeParse({
        walletAddress: '11111111111111111111111111111111',
        capabilities: [
          {
            capability_type: 'perps',
            delegation_provider: 'venue_api',
            venue: 'pacifica',
            signer_kind: 'venue_api_agent'
          }
        ]
      });
      expect(result.success).toBe(true);
    });
  });

  describe('toreva_scan', () => {
    it('parses valid input', () => {
      const result = intentToolSchemas.toreva_scan.safeParse({
        walletAddress: '11111111111111111111111111111111',
        prompt: 'scan my wallet',
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing wallet', () => {
      const result = intentToolSchemas.toreva_scan.safeParse({
        prompt: 'scan my wallet',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty prompt', () => {
      const result = intentToolSchemas.toreva_scan.safeParse({
        walletAddress: '11111111111111111111111111111111',
        prompt: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects the old wallet alias', () => {
      const result = intentToolSchemas.toreva_scan.safeParse({
        wallet: '11111111111111111111111111111111',
        prompt: 'scan my wallet',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('INTENT_RELAY_TYPES', () => {
  it('maps toreva_establish to intent.establish', () => {
    expect(INTENT_RELAY_TYPES.toreva_establish).toBe('intent.establish');
  });

  it('maps toreva_perps_establish alias to intent.establish', () => {
    expect(INTENT_RELAY_TYPES.toreva_perps_establish).toBe('intent.establish');
  });

  it('maps toreva_scan to intent.scan', () => {
    expect(INTENT_RELAY_TYPES.toreva_scan).toBe('intent.scan');
  });

  it('maps toreva_execute to intent.execute', () => {
    expect(INTENT_RELAY_TYPES.toreva_execute).toBe('intent.execute');
  });

  it('all 7 intent tools have corresponding relay types', () => {
    const schemaKeys = Object.keys(intentToolSchemas).sort();
    const relayKeys = Object.keys(INTENT_RELAY_TYPES).sort();
    expect(schemaKeys).toEqual(relayKeys);
    expect(schemaKeys).toHaveLength(7);
  });
});
