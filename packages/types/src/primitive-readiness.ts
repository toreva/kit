import { z } from 'zod';

export const primitiveReadinessStateSchema = z.enum([
  'proposed',
  'canonical',
  'integration_ready',
  'canary_ready',
  'battle_tested'
]);

export const primitiveReadinessEvidenceSchema = z.object({
  allFamilyPrimitivesBattleTested: z.boolean(),
  kitSurface: z.boolean(),
  apiSurface: z.boolean(),
  mcpSurface: z.boolean(),
  cliSurface: z.boolean(),
  skillsSurface: z.boolean(),
  sdkSurface: z.boolean(),
  docsSurface: z.boolean(),
  iaCanonical: z.boolean(),
  gatewayKitNoSubmit: z.boolean(),
  venueAdmission: z.boolean(),
  signerFundingBoundary: z.boolean(),
  receiptsMonitoring: z.boolean(),
  riskApproval: z.boolean(),
  frameworkMarketReview: z.boolean(),
  standardsInteropReview: z.boolean(),
  marketRevisitCadence: z.boolean(),
  withdrawRevokeClosePath: z.boolean(),
  recoveryPath: z.boolean(),
  mainnetRealFunds: z.boolean()
});

export const primitiveGreenStateSchema = z.enum(['not_green', 'green']);

export const primitiveFamilyReadinessSchema = z.object({
  familyId: z.string().min(1),
  label: z.string().min(1),
  readiness: primitiveReadinessStateSchema,
  greenState: primitiveGreenStateSchema,
  owner: z.string().min(1),
  canonicalOwner: z.string().min(1),
  executionOwner: z.string().min(1),
  firstVenues: z.array(z.string()),
  publicSurface: z.enum(['public', 'internal', 'planned']),
  revenueTreatment: z.enum(['metered_not_charged_internal', 'priced_public', 'unpriced']),
  publicWording: z.string().min(1),
  evidence: primitiveReadinessEvidenceSchema,
  tools: z.array(z.string()).optional(),
  notes: z.array(z.string())
});

export const primitiveReadinessCatalogSchema = z.object({
  schemaVersion: z.literal('toreva.primitive-readiness.v1'),
  ambition: z.string().min(1),
  safePlatformClaim: z.string().min(1),
  greenDefinition: z.string().min(1),
  readinessLadder: z.array(primitiveReadinessStateSchema),
  battleTestedRequiredEvidence: z.array(z.string()),
  greenRequiredEvidence: z.array(z.string()),
  families: z.array(primitiveFamilyReadinessSchema)
});

export type PrimitiveReadinessState = z.infer<typeof primitiveReadinessStateSchema>;
export type PrimitiveGreenState = z.infer<typeof primitiveGreenStateSchema>;
export type PrimitiveReadinessEvidence = z.infer<typeof primitiveReadinessEvidenceSchema>;
export type PrimitiveFamilyReadiness = z.infer<typeof primitiveFamilyReadinessSchema>;
export type PrimitiveReadinessCatalog = z.infer<typeof primitiveReadinessCatalogSchema>;

export const BATTLE_TESTED_REQUIRED_EVIDENCE = [
  'allFamilyPrimitivesBattleTested',
  'kitSurface',
  'apiSurface',
  'mcpSurface',
  'cliSurface',
  'skillsSurface',
  'sdkSurface',
  'docsSurface',
  'frameworkMarketReview',
  'standardsInteropReview',
  'marketRevisitCadence',
  'iaCanonical',
  'gatewayKitNoSubmit',
  'signerFundingBoundary',
  'mainnetRealFunds',
  'receiptsMonitoring',
  'recoveryPath',
  'riskApproval',
  'venueAdmission',
  'withdrawRevokeClosePath'
] as const;

export function assertNoPrimitiveReadinessOverclaim(catalog: PrimitiveReadinessCatalog): void {
  for (const family of catalog.families) {
    if (family.greenState === 'green' && family.readiness !== 'battle_tested') {
      throw new Error(
        `Primitive family ${family.familyId} cannot be green unless readiness is battle_tested`
      );
    }

    if (family.readiness === 'battle_tested' && family.greenState !== 'green') {
      throw new Error(
        `Primitive family ${family.familyId} must be green when readiness is battle_tested`
      );
    }

    if (family.readiness !== 'battle_tested') {
      continue;
    }

    const missing = BATTLE_TESTED_REQUIRED_EVIDENCE.filter((key) => !family.evidence[key]);
    if (missing.length > 0) {
      throw new Error(
        `Primitive family ${family.familyId} cannot be battle_tested without evidence: ${missing.join(', ')}`
      );
    }
  }
}
