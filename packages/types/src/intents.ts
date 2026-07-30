import { z } from 'zod';

const walletAddressSchema = z.string().min(32).max(88);
const receiptIdSchema = z.string().min(8).max(160);
const promptSchema = z.string().min(1).max(2000);

const operationSchema = z.enum([
  'read',
  'scan',
  'simulate',
  'prepare_unsigned_transaction',
  'explain',
  'receipt',
  'refuse'
]);

const riskTierSchema = z.enum(['read_only', 'low', 'standard']);

export const humanWalletTargetSchema = z.object({
  wallet_role: z.literal('human_wallet'),
  human_wallet_address: walletAddressSchema
}).strict();

export const agentWalletTargetSchema = z.object({
  wallet_role: z.literal('agent_wallet'),
  agent_wallet_address: walletAddressSchema
}).strict();

export const walletTargetSchema = z.discriminatedUnion('wallet_role', [
  humanWalletTargetSchema,
  agentWalletTargetSchema
]);

export const policyBoundsSchema = z.object({
  daily_notional_lamports: z.number().int().positive(),
  operations_per_day: z.number().int().positive(),
  cooldown_seconds: z.number().int().positive(),
  risk_tier_ceiling: riskTierSchema,
  allowed_operations: z.array(operationSchema).min(1),
  valid_until: z.string().datetime().nullable()
}).strict();

const ownAddressDestinationSchema = z.object({
  wallet_role: z.literal('human_wallet'),
  human_wallet_address: walletAddressSchema,
  address_is_user_attested_own_address: z.literal(true)
}).strict();

const requestedActionSchema = z.object({
  user_instruction: promptSchema,
  operation: operationSchema,
  token_mint: z.string().min(32).max(88).optional(),
  amount_lamports: z.number().int().positive().optional(),
  own_address_destination: ownAddressDestinationSchema.optional()
}).strict();

export const intentToolSchemas = {
  toreva_establish_agent_wallet: z.object({
    human_wallet_address: walletAddressSchema,
    policy_bounds: policyBoundsSchema,
    prompt: promptSchema.optional()
  }).strict(),
  toreva_read_or_scan: z.object({
    target_wallet: walletTargetSchema,
    prompt: promptSchema
  }).strict(),
  toreva_simulate_action: z.object({
    target_wallet: agentWalletTargetSchema,
    policy_bounds: policyBoundsSchema,
    requested_action: requestedActionSchema
  }).strict(),
  toreva_prepare_unsigned_transaction: z.object({
    target_wallet: agentWalletTargetSchema,
    policy_bounds: policyBoundsSchema,
    requested_action: requestedActionSchema.extend({
      operation: z.literal('prepare_unsigned_transaction'),
      simulation_receipt_id: receiptIdSchema
    })
  }).strict(),
  toreva_explain_action: z.object({
    receipt_id: receiptIdSchema.optional(),
    target_wallet: walletTargetSchema.optional(),
    prompt: promptSchema
  }).strict(),
  toreva_get_receipt: z.object({
    receipt_id: receiptIdSchema
  }).strict(),
  toreva_refuse_action: z.object({
    target_wallet: walletTargetSchema.optional(),
    reason_code: z.enum([
      'outside_policy',
      'unknown_wallet_role',
      'missing_cap',
      'blind_signing',
      'unsupported_operation',
      'legal_block'
    ]),
    user_instruction: promptSchema,
    receipt_id: receiptIdSchema.optional()
  }).strict()
} as const;

export const INTENT_RELAY_TYPES = {
  toreva_establish_agent_wallet: 'policy.establish_agent_wallet',
  toreva_read_or_scan: 'policy.read_or_scan',
  toreva_simulate_action: 'policy.simulate_action',
  toreva_prepare_unsigned_transaction: 'policy.prepare_unsigned_transaction',
  toreva_explain_action: 'policy.explain_action',
  toreva_get_receipt: 'policy.get_receipt',
  toreva_refuse_action: 'policy.refuse_action'
} as const;

export type WalletTarget = z.infer<typeof walletTargetSchema>;
export type PolicyBounds = z.infer<typeof policyBoundsSchema>;
export type IntentToolName = keyof typeof intentToolSchemas;
export type IntentRelayType = (typeof INTENT_RELAY_TYPES)[IntentToolName];
