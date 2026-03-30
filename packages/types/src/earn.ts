import { z } from 'zod';

export const earnOperationSchema = z.enum(['scan', 'simulate', 'execute']);

export const earnRequestSchema = z.object({
  operation: earnOperationSchema,
  wallet: z.string(),
  amountUsd: z.number().positive().optional()
});

export type EarnRequest = z.infer<typeof earnRequestSchema>;
