import { z } from 'zod';

export const venueSchema = z.enum(['drift', 'jupiter-perps', 'pacifica', 'flash']);

const walletSchema = z.object({ wallet: z.string() });
const marketSchema = z.object({ market: z.string() });
const venueOptionalSchema = z.object({ venue: venueSchema.optional() });

export const perpsToolSchemas = {
  toreva_perps_long: walletSchema.merge(marketSchema).merge(venueOptionalSchema).extend({
    notionalUsd: z.number().positive(),
    leverage: z.number().positive().max(101).optional()
  }),
  toreva_perps_short: walletSchema.merge(marketSchema).merge(venueOptionalSchema).extend({
    notionalUsd: z.number().positive(),
    leverage: z.number().positive().max(101).optional()
  }),
  toreva_perps_close: walletSchema.merge(marketSchema).merge(venueOptionalSchema),
  toreva_perps_add_margin: walletSchema.merge(marketSchema).merge(venueOptionalSchema).extend({
    amountUsd: z.number().positive()
  }),
  toreva_perps_remove_margin: walletSchema.merge(marketSchema).merge(venueOptionalSchema).extend({
    amountUsd: z.number().positive()
  }),
  toreva_perps_cancel_order: walletSchema.merge(venueOptionalSchema).extend({
    orderId: z.string()
  }),
  toreva_perps_funding_settle: walletSchema.merge(marketSchema).merge(venueOptionalSchema),
  toreva_perps_query_position: walletSchema.merge(marketSchema).merge(venueOptionalSchema),
  toreva_perps_query_funding: walletSchema.merge(marketSchema).merge(venueOptionalSchema),
  toreva_perps_query_venues: z.object({}),
  toreva_perps_query_markets: venueOptionalSchema,
  toreva_perps_simulate: walletSchema.merge(marketSchema).merge(venueOptionalSchema).extend({
    side: z.enum(['long', 'short']),
    notionalUsd: z.number().positive()
  }),
  toreva_perps_explain: walletSchema.merge(marketSchema).merge(venueOptionalSchema).extend({
    context: z.string().optional()
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
