import { z } from 'zod';

const baseIntentInputSchema = z.object({
  wallet: z.string(),
  prompt: z.string().min(1)
});

const walletAddressSchema = z.string().min(32).max(88);
const signerKindSchema = z.enum([
  'delegated_authority',
  'human_wallet',
  'venue_api_agent',
  'mpc',
  'multisig',
  'smart_account',
  'exchange_api_agent',
  'simulated'
]);

const establishCapabilitySchema = z.object({
  capability_type: z.string().min(1),
  delegation_provider: z.string().min(1).optional(),
  network: z.string().min(1).optional(),
  venue: z.string().min(1).optional(),
  execution_adapter: z.string().min(1).optional(),
  signer_kind: signerKindSchema.optional(),
  guardrails: z.record(z.unknown()).optional(),
  provider_metadata: z.record(z.unknown()).optional()
});

export const intentToolSchemas = {
  toreva_establish: z.object({
    walletAddress: walletAddressSchema,
    prompt: z.string().min(1).optional(),
    agent_authority: z.object({
      delegation_provider: z.string().min(1).default('swig'),
      network: z.string().min(1).default('solana'),
      signer_kind: signerKindSchema.optional(),
      policy_id: z.string().optional(),
      policy_hash: z.string().optional(),
      provider_metadata: z.record(z.unknown()).optional()
    }).optional(),
    capabilities: z.array(establishCapabilitySchema).optional()
  }),
  toreva_scan: baseIntentInputSchema,
  toreva_simulate: baseIntentInputSchema,
  toreva_execute: baseIntentInputSchema,
  toreva_explain: baseIntentInputSchema,
  toreva_configure: baseIntentInputSchema.extend({
    settings: z.record(z.unknown()).optional()
  })
} as const;

export const INTENT_RELAY_TYPES = {
  toreva_establish: 'intent.establish',
  toreva_scan: 'intent.scan',
  toreva_simulate: 'intent.simulate',
  toreva_execute: 'intent.execute',
  toreva_explain: 'intent.explain',
  toreva_configure: 'intent.configure'
} as const;

export type IntentToolName = keyof typeof intentToolSchemas;
export type IntentRelayType = (typeof INTENT_RELAY_TYPES)[IntentToolName];
