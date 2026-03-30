import { z } from 'zod';
import type { RelayRequest } from '@toreva/types';

export const catalogToolDefinition = {
  name: 'toreva_strategies',
  relayType: 'strategy.catalog.get',
  inputSchema: z.object({
    includeArchived: z.boolean().optional()
  })
};

export function toCatalogRelayRequest(payload: unknown): RelayRequest {
  return {
    type: catalogToolDefinition.relayType,
    toolName: catalogToolDefinition.name,
    payload
  };
}
