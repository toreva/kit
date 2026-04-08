import { describe, it, expect } from 'vitest';
import { intentToolSchemas, INTENT_RELAY_TYPES } from '../intents.js';

describe('intentToolSchemas', () => {
  describe('toreva_scan', () => {
    it('parses valid input', () => {
      const result = intentToolSchemas.toreva_scan.safeParse({
        wallet: 'abc',
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
        wallet: 'abc',
        prompt: '',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('INTENT_RELAY_TYPES', () => {
  it('maps toreva_scan to intent.scan', () => {
    expect(INTENT_RELAY_TYPES.toreva_scan).toBe('intent.scan');
  });

  it('maps toreva_execute to intent.execute', () => {
    expect(INTENT_RELAY_TYPES.toreva_execute).toBe('intent.execute');
  });

  it('all 5 intent tools have corresponding relay types', () => {
    const schemaKeys = Object.keys(intentToolSchemas).sort();
    const relayKeys = Object.keys(INTENT_RELAY_TYPES).sort();
    expect(schemaKeys).toEqual(relayKeys);
    expect(schemaKeys).toHaveLength(5);
  });
});
