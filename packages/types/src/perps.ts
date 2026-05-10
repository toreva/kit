import { z } from 'zod';

export const venueSchema = z.enum(['drift', 'jupiter-perps', 'pacifica', 'flash']);

const walletAddressSchema = z.object({ walletAddress: z.string().min(32).max(88) });
const tokenSchema = z.object({ token: z.string().min(1) });
const venueOptionalSchema = z.object({ venue: venueSchema.optional() });
const venueRequiredSchema = z.object({ venue: venueSchema });
const openBaseSchema = walletAddressSchema.merge(tokenSchema).merge(venueOptionalSchema).extend({
  sizeUsd: z.number().positive(),
  leverage: z.number().min(1).max(101),
  collateralToken: z.string().min(1),
  collateralAmount: z.number().positive(),
  agentWalletAddress: z.string().min(32).max(88).optional(),
  maxSlippageBps: z.number().int().min(0).max(1000).optional(),
  stopLoss: z.number().positive().optional(),
  takeProfit: z.number().positive().optional(),
  marginMode: z.enum(['cross', 'isolated']).optional(),
  builderCode: z.string().regex(/^[A-Za-z0-9]{1,16}$/).optional(),
  clientRequestId: z.string().min(1).max(128).optional()
});
const positionSchema = walletAddressSchema.merge(venueRequiredSchema).extend({
  positionId: z.string(),
  orderId: z.string().optional(),
  token: z.string().min(1).optional(),
  side: z.enum(['long', 'short']).optional(),
  agentWalletAddress: z.string().min(32).max(88).optional(),
  maxSlippageBps: z.number().int().min(0).max(1000).optional(),
  clientRequestId: z.string().min(1).max(128).optional(),
  expiryWindowMs: z.number().int().min(1000).max(120000).optional()
});

export const perpsToolSchemas = {
  toreva_perps_long: openBaseSchema,
  toreva_perps_short: openBaseSchema,
  toreva_perps_close: positionSchema,
  toreva_perps_add_margin: positionSchema.extend({
    amount: z.number().positive(),
    token: z.string().min(1)
  }),
  toreva_perps_remove_margin: positionSchema.extend({
    amount: z.number().positive(),
    token: z.string().min(1)
  }),
  toreva_perps_cancel_order: positionSchema,
  toreva_perps_funding_settle: positionSchema,
  toreva_perps_query_position: walletAddressSchema.merge(venueOptionalSchema),
  toreva_perps_query_funding: tokenSchema,
  toreva_perps_query_venues: z.object({}),
  toreva_perps_query_markets: venueOptionalSchema,
  toreva_perps_simulate: walletAddressSchema.partial().merge(tokenSchema).extend({
    direction: z.enum(['long', 'short']),
    sizeUsd: z.number().positive(),
    leverage: z.number().min(1).max(101),
    collateralToken: z.string().min(1),
    collateralAmount: z.number().positive()
  }),
  toreva_perps_explain: walletAddressSchema.partial().merge(venueOptionalSchema).extend({
    positionId: z.string().optional(),
    txSignature: z.string().optional()
  })
} as const;

export const PERPS_RELAY_TYPES = {
  toreva_perps_long: 'perps.open_long',
  toreva_perps_short: 'perps.open_short',
  toreva_perps_close: 'perps.close',
  toreva_perps_add_margin: 'perps.add_margin',
  toreva_perps_remove_margin: 'perps.remove_margin',
  toreva_perps_cancel_order: 'perps.cancel_order',
  toreva_perps_funding_settle: 'perps.funding_settle',
  toreva_perps_query_position: 'perps.query_position',
  toreva_perps_query_funding: 'perps.query_funding',
  toreva_perps_query_venues: 'perps.query_venues',
  toreva_perps_query_markets: 'perps.query_markets',
  toreva_perps_simulate: 'perps.simulate',
  toreva_perps_explain: 'perps.explain'
} as const;

export type PerpsToolName = keyof typeof perpsToolSchemas;
export type PerpsRelayType = (typeof PERPS_RELAY_TYPES)[PerpsToolName];

const priceSchema = z.union([z.number(), z.string()]);

export const perpsExecutionResultSchema = z.object({
  venue: venueSchema.or(z.string()).optional(),
  positionId: z.string().optional(),
  orderId: z.string().optional(),
  txSignature: z.string().optional(),
  receiptId: z.string().optional(),
  averagePrice: priceSchema.optional(),
  entryPrice: priceSchema.optional(),
  liquidationPrice: priceSchema.optional(),
  requestHash: z.string().optional(),
  responseHash: z.string().optional(),
}).passthrough();

export const perpsQueryResultSchema = z.object({
  venues: z.array(z.record(z.unknown())).optional(),
  positions: z.array(z.record(z.unknown())).optional(),
  funding: z.array(z.record(z.unknown())).optional(),
  markets: z.array(z.record(z.unknown())).optional(),
  simulation: z.record(z.unknown()).optional(),
  explanation: z.union([z.string(), z.record(z.unknown())]).optional(),
}).passthrough();

export const perpsResultSchemas = {
  toreva_perps_long: perpsExecutionResultSchema,
  toreva_perps_short: perpsExecutionResultSchema,
  toreva_perps_close: perpsExecutionResultSchema,
  toreva_perps_add_margin: perpsExecutionResultSchema,
  toreva_perps_remove_margin: perpsExecutionResultSchema,
  toreva_perps_cancel_order: perpsExecutionResultSchema,
  toreva_perps_funding_settle: perpsExecutionResultSchema,
  toreva_perps_query_position: perpsQueryResultSchema,
  toreva_perps_query_funding: perpsQueryResultSchema,
  toreva_perps_query_venues: perpsQueryResultSchema,
  toreva_perps_query_markets: perpsQueryResultSchema,
  toreva_perps_simulate: perpsQueryResultSchema,
  toreva_perps_explain: perpsQueryResultSchema
} as const;

export type PerpsToolInput<TToolName extends PerpsToolName> = z.infer<
  (typeof perpsToolSchemas)[TToolName]
>;
export type PerpsToolResult<TToolName extends PerpsToolName> = z.infer<
  (typeof perpsResultSchemas)[TToolName]
>;
