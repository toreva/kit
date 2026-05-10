import { z } from 'zod';

export const phase1EffectCountsSchema = z.object({
  read: z.number().int().nonnegative(),
  value: z.number().int().nonnegative(),
  authority: z.number().int().nonnegative(),
  admin: z.number().int().nonnegative(),
  composition: z.number().int().nonnegative()
});

export const phase1FamilyTargetSchema = z.object({
  familyId: z.string().min(1),
  label: z.string().min(1),
  primitiveCount: z.number().int().positive(),
  effectCounts: phase1EffectCountsSchema,
  primaryVenueOrProvider: z.string().min(1),
  secondaryOrWatchlist: z.array(z.string()),
  extraMainnetEvidenceRecords: z.number().int().nonnegative(),
  mainnetEvidenceRecords: z.number().int().positive(),
  currentReadiness: z.string().min(1),
  currentGreenState: z.string().min(1),
  targetReadiness: z.literal('battle_tested'),
  targetGreenState: z.literal('green')
});

export const phase2HoldSchema = z.object({
  familyIds: z.array(z.string().min(1)),
  primitiveCount: z.number().int().nonnegative(),
  compositionLayerIds: z.array(z.string().min(1)),
  compositionTermCount: z.number().int().nonnegative(),
  rule: z.string().min(1),
  publicExecutableCount: z.number().int().nonnegative(),
  greenCount: z.number().int().nonnegative()
});

export const phase1TestBlockSchema = z.object({
  blockId: z.string().min(1),
  label: z.string().min(1),
  requiredCount: z.number().int().positive(),
  basis: z.string().min(1)
});

export const phase1FeeRebateTransactionClassSchema = z.enum([
  'data_transaction',
  'value_transaction',
  'first_party_value_transaction'
]);

export const phase1FeeRebateEvidenceSchema = z.object({
  transactionClass: phase1FeeRebateTransactionClassSchema,
  chargedBps: z.number().nonnegative(),
  externalValueShadowBps: z.number().nonnegative(),
  treasuryFeeAccount: z.string().min(1).optional(),
  firstPartyChargeExemptionReason: z.string().min(1).optional(),
  rebateSourcesChecked: z.array(z.string().min(1)),
  rebateNonBlockingForDay1: z.literal(true)
});

export type Phase1FeeRebateEvidence = z.infer<typeof phase1FeeRebateEvidenceSchema>;

export const phase1BattleTestedPlanSchema = z.object({
  schemaVersion: z.literal('toreva.phase-1-battle-tested-plan.v1'),
  claimBoundary: z.string().min(1),
  greenDefinition: z.string().min(1),
  requiredEvidence: z.array(z.string().min(1)),
  targetFamilies: z.array(phase1FamilyTargetSchema),
  targetFamilyCount: z.number().int().positive(),
  targetPrimitiveCount: z.number().int().positive(),
  valuePrimitiveCount: z.number().int().nonnegative(),
  readPrimitiveCount: z.number().int().nonnegative(),
  authorityPrimitiveCount: z.number().int().nonnegative(),
  adminPrimitiveCount: z.number().int().nonnegative(),
  mainnetEvidenceRecordTarget: z.number().int().positive(),
  testBlocks: z.array(phase1TestBlockSchema),
  totalRequiredTestCheckCount: z.number().int().positive(),
  phase2Hold: phase2HoldSchema,
  classAGates: z.array(z.string().min(1))
});

export type Phase1BattleTestedPlan = z.infer<typeof phase1BattleTestedPlanSchema>;

export function assertPhase1FeeRebateEvidence(evidence: Phase1FeeRebateEvidence): void {
  if (evidence.rebateSourcesChecked.length === 0) {
    throw new Error('Phase 1 fee/rebate evidence must list at least one checked rebate source');
  }

  if (evidence.transactionClass === 'value_transaction') {
    if (evidence.chargedBps !== 2 || evidence.externalValueShadowBps !== 2) {
      throw new Error('External value transactions must charge and shadow-price at 2 bps');
    }
    if (!evidence.treasuryFeeAccount) {
      throw new Error('External value transactions must include a treasury fee account');
    }
    return;
  }

  if (evidence.transactionClass === 'first_party_value_transaction') {
    if (evidence.chargedBps !== 2 || evidence.externalValueShadowBps !== 2) {
      throw new Error('First-party value transactions must charge and shadow-price at 2 bps');
    }
    if (evidence.firstPartyChargeExemptionReason) {
      throw new Error('First-party value transactions must not include a charge exemption reason');
    }
    return;
  }

  if (evidence.chargedBps !== 0 || evidence.externalValueShadowBps !== 0) {
    throw new Error('Data transactions must charge and shadow-price at 0 bps');
  }
}

export function assertPhase1BattleTestedPlanSurface(plan: Phase1BattleTestedPlan): void {
  if (plan.targetFamilyCount !== 10) {
    throw new Error(`Phase 1 must expose 10 target families, got ${plan.targetFamilyCount}`);
  }
  if (plan.targetPrimitiveCount !== 101) {
    throw new Error(`Phase 1 must expose 101 target primitives, got ${plan.targetPrimitiveCount}`);
  }
  if (plan.mainnetEvidenceRecordTarget !== 117) {
    throw new Error(
      `Phase 1 must require 117 mainnet evidence records, got ${plan.mainnetEvidenceRecordTarget}`
    );
  }
  if (plan.totalRequiredTestCheckCount !== 1068) {
    throw new Error(
      `Phase 1 must require 1068 tests/checks, got ${plan.totalRequiredTestCheckCount}`
    );
  }
  if (plan.phase2Hold.publicExecutableCount !== 0 || plan.phase2Hold.greenCount !== 0) {
    throw new Error('Phase 2 entries must not be executable or green in Kit surfaces');
  }
}
