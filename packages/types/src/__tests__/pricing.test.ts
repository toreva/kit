import { describe, expect, it } from 'vitest';
import { CANONICAL_TAGLINE } from '../branding.js';
import { FEE_SCHEDULE } from '../treasury.js';

describe('Toreva platform pricing contract', () => {
  it('pins the founder pricing directive for data and value transactions', () => {
    expect(CANONICAL_TAGLINE).toContain('Data transactions are free');
    expect(CANONICAL_TAGLINE).toContain('External value transactions are 2 bps');

    expect(FEE_SCHEDULE.dataTransactionBps).toBe(0);
    expect(FEE_SCHEDULE.valueTransactionBps).toBe(2);
    expect(FEE_SCHEDULE.firstPartyValueBps).toBe(2);
    expect(FEE_SCHEDULE.earnStakeBps).toBe(2);
    expect(FEE_SCHEDULE.strategyRebalanceBps).toBe(2);
    expect(FEE_SCHEDULE.strategyExecutionBps).toBe(2);
    expect(FEE_SCHEDULE.perpsOpenBps).toBe(2);
  });
});
