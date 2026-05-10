import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  assertPhase1FeeRebateEvidence,
  assertPhase1BattleTestedPlanSurface,
  phase1FeeRebateEvidenceSchema,
  phase1BattleTestedPlanSchema
} from '../phase1.js';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

function readRootFile(path: string) {
  return readFileSync(resolve(rootDir, path), 'utf8');
}

describe('Phase 1 battle-tested plan surface', () => {
  it('parses the generated public Phase 1 plan document', () => {
    const plan = phase1BattleTestedPlanSchema.parse(
      JSON.parse(readRootFile('docs/phase-1-battle-tested-primitive-plan.json'))
    );

    expect(plan.schemaVersion).toBe('toreva.phase-1-battle-tested-plan.v1');
    expect(plan.targetFamilyCount).toBe(10);
    expect(plan.targetPrimitiveCount).toBe(101);
    expect(plan.mainnetEvidenceRecordTarget).toBe(117);
    expect(plan.totalRequiredTestCheckCount).toBe(1068);
    expect(plan.greenDefinition).toContain('real mainnet funds');
    expect(plan.claimBoundary).toContain('not an operational claim');
    expect(() => assertPhase1BattleTestedPlanSurface(plan)).not.toThrow();
  });

  it('keeps Phase 2 terms out of executable and green Kit surfaces', () => {
    const plan = phase1BattleTestedPlanSchema.parse(
      JSON.parse(readRootFile('docs/phase-1-battle-tested-primitive-plan.json'))
    );

    expect(plan.phase2Hold.familyIds).toEqual([
      'options',
      'prediction_markets',
      'nft',
      'governance',
      'claims',
      'lp_liquidity',
      'bridge_wrap',
      'commerce_billing'
    ]);
    expect(plan.phase2Hold.primitiveCount).toBe(67);
    expect(plan.phase2Hold.compositionTermCount).toBe(45);
    expect(plan.phase2Hold.publicExecutableCount).toBe(0);
    expect(plan.phase2Hold.greenCount).toBe(0);
  });

  it('fails closed when counts drift', () => {
    const plan = phase1BattleTestedPlanSchema.parse(
      JSON.parse(readRootFile('docs/phase-1-battle-tested-primitive-plan.json'))
    );

    expect(() =>
      assertPhase1BattleTestedPlanSurface({
        ...plan,
        targetPrimitiveCount: 100
      })
    ).toThrow(/101/);
    expect(() =>
      assertPhase1BattleTestedPlanSurface({
        ...plan,
        phase2Hold: {
          ...plan.phase2Hold,
          greenCount: 1
        }
      })
    ).toThrow(/Phase 2/);
  });

  it('requires 2 bps treasury evidence for external value transactions', () => {
    const evidence = phase1FeeRebateEvidenceSchema.parse({
      transactionClass: 'value_transaction',
      chargedBps: 2,
      externalValueShadowBps: 2,
      treasuryFeeAccount: 'toreva-treasury-fee-account',
      rebateSourcesChecked: ['jito-mev', 'jupiter-builder-fee'],
      rebateNonBlockingForDay1: true
    });

    expect(() => assertPhase1FeeRebateEvidence(evidence)).not.toThrow();
    expect(() =>
      assertPhase1FeeRebateEvidence({
        ...evidence,
        chargedBps: 1
      })
    ).toThrow(/2 bps/);
    expect(() =>
      assertPhase1FeeRebateEvidence({
        ...evidence,
        treasuryFeeAccount: undefined
      })
    ).toThrow(/treasury fee account/);
  });

  it('charges first-party Toreva service value paths at 2 bps', () => {
    const evidence = phase1FeeRebateEvidenceSchema.parse({
      transactionClass: 'first_party_value_transaction',
      chargedBps: 2,
      externalValueShadowBps: 2,
      rebateSourcesChecked: ['jito-mev'],
      rebateNonBlockingForDay1: true
    });

    expect(() => assertPhase1FeeRebateEvidence(evidence)).not.toThrow();
    expect(() =>
      assertPhase1FeeRebateEvidence({
        ...evidence,
        chargedBps: 0
      })
    ).toThrow(/2 bps/);
  });

  it('keeps data transactions free and requires rebate-source checking as non-blocking evidence', () => {
    const evidence = phase1FeeRebateEvidenceSchema.parse({
      transactionClass: 'data_transaction',
      chargedBps: 0,
      externalValueShadowBps: 0,
      rebateSourcesChecked: ['not-applicable-data-read'],
      rebateNonBlockingForDay1: true
    });

    expect(() => assertPhase1FeeRebateEvidence(evidence)).not.toThrow();
    expect(() =>
      assertPhase1FeeRebateEvidence({
        ...evidence,
        rebateSourcesChecked: []
      })
    ).toThrow(/rebate source/);
  });
});
