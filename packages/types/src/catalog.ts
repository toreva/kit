import { z } from 'zod';

export const strategyCatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  riskLabel: z.string(),
  pricingBps: z.number().nonnegative()
});

export const strategyCatalogResponseSchema = z.object({
  items: z.array(strategyCatalogItemSchema)
});

export type StrategyCatalogItem = z.infer<typeof strategyCatalogItemSchema>;
export type StrategyCatalogResponse = z.infer<typeof strategyCatalogResponseSchema>;
