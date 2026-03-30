import { z } from 'zod';

const baseIntentInputSchema = z.object({
  wallet: z.string(),
  prompt: z.string().min(1)
});

export const intentToolSchemas = {
  toreva_scan: baseIntentInputSchema,
  toreva_simulate: baseIntentInputSchema,
  toreva_execute: baseIntentInputSchema,
  toreva_explain: baseIntentInputSchema,
  toreva_configure: baseIntentInputSchema.extend({
    settings: z.record(z.unknown()).optional()
  })
} as const;

export const INTENT_RELAY_TYPES = {
  toreva_scan: 'intent.scan',
  toreva_simulate: 'intent.simulate',
  toreva_execute: 'intent.execute',
  toreva_explain: 'intent.explain',
  toreva_configure: 'intent.configure'
} as const;

export type IntentToolName = keyof typeof intentToolSchemas;
export type IntentRelayType = (typeof INTENT_RELAY_TYPES)[IntentToolName];
