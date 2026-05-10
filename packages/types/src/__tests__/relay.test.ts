import { describe, expect, it } from 'vitest';
import { RELAY_ERROR_CODES, type RelayErrorCode } from '../relay.js';

describe('Relay error contract', () => {
  it('publishes stable retry-aware error codes for integrators', () => {
    const codes: RelayErrorCode[] = [...RELAY_ERROR_CODES];
    expect(codes).toEqual(expect.arrayContaining([
      'AUTH_INVALID',
      'GUARDRAIL_REJECTED',
      'VENUE_UNAVAILABLE',
      'INSUFFICIENT_COLLATERAL',
      'SLIPPAGE_EXCEEDED',
      'IDEMPOTENT_REPLAY'
    ]));
  });
});
