import { describe, it, expect } from 'vitest';
import {
  PERPS_RELAY_TYPES,
  perpsExecutionResultSchema,
  perpsQueryResultSchema,
  perpsResultSchemas,
  perpsToolSchemas,
} from '../perps.js';

describe('perpsToolSchemas', () => {
  describe('toreva_perps_long', () => {
    it('parses valid input', () => {
      const result = perpsToolSchemas.toreva_perps_long.safeParse({
        walletAddress: '11111111111111111111111111111111',
        token: 'SOL',
        sizeUsd: 1000,
        leverage: 2,
        collateralToken: 'USDC',
        collateralAmount: 500,
      });
      expect(result.success).toBe(true);
    });

    it('rejects negative sizeUsd', () => {
      const result = perpsToolSchemas.toreva_perps_long.safeParse({
        walletAddress: '11111111111111111111111111111111',
        token: 'SOL',
        sizeUsd: -100,
        leverage: 2,
        collateralToken: 'USDC',
        collateralAmount: 500,
      });
      expect(result.success).toBe(false);
    });

    it('rejects leverage > 101', () => {
      const result = perpsToolSchemas.toreva_perps_long.safeParse({
        walletAddress: '11111111111111111111111111111111',
        token: 'SOL',
        sizeUsd: 1000,
        leverage: 102,
        collateralToken: 'USDC',
        collateralAmount: 500,
      });
      expect(result.success).toBe(false);
    });

    it('rejects the old Kit wallet/market/notional aliases', () => {
      const result = perpsToolSchemas.toreva_perps_long.safeParse({
        wallet: '11111111111111111111111111111111',
        market: 'SOL-PERP',
        notionalUsd: 1000,
        leverage: 2,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('toreva_perps_close', () => {
    it('requires the venue from the position venue', () => {
      const result = perpsToolSchemas.toreva_perps_close.safeParse({
        walletAddress: '11111111111111111111111111111111',
        positionId: 'position-1',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('PERPS_RELAY_TYPES', () => {
  it('maps toreva_perps_long to perps.open_long', () => {
    expect(PERPS_RELAY_TYPES.toreva_perps_long).toBe('perps.open_long');
  });

  it('all 13 perps tools have corresponding relay types', () => {
    const schemaKeys = Object.keys(perpsToolSchemas).sort();
    const relayKeys = Object.keys(PERPS_RELAY_TYPES).sort();
    expect(schemaKeys).toEqual(relayKeys);
    expect(schemaKeys).toHaveLength(13);
  });
});

describe('perps result schemas', () => {
  it('parses execution results with the fields external integrators need to monitor and close', () => {
    const result = perpsExecutionResultSchema.safeParse({
      venue: 'pacifica',
      positionId: 'position-1',
      orderId: 'order-1',
      averagePrice: '142.12',
      receiptId: 'receipt-1',
      requestHash: 'request-hash',
      responseHash: 'response-hash',
    });

    expect(result.success).toBe(true);
  });

  it('parses query results for venues, positions, funding, markets, simulation, and explain', () => {
    const result = perpsQueryResultSchema.safeParse({
      venues: [{ venue: 'pacifica', status: 'available' }],
      positions: [{ positionId: 'position-1' }],
      funding: [{ token: 'SOL', rateBps: 1.2 }],
      markets: [{ token: 'SOL' }],
      simulation: { estimatedFeeUsd: 0.01 },
      explanation: 'Routed by best estimated all-in cost.',
    });

    expect(result.success).toBe(true);
  });

  it('exports one result schema for every public perps tool', () => {
    expect(Object.keys(perpsResultSchemas).sort()).toEqual(Object.keys(perpsToolSchemas).sort());
  });
});
