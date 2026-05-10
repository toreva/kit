import {
  PERPS_RELAY_TYPES,
  type PerpsToolInput,
  type PerpsToolName,
  type PerpsToolResult,
  type RelayResponse
} from '@toreva/types';
import { TorevaClient } from './client.js';

export class PerpsApi {
  constructor(private readonly client: TorevaClient) {}

  call<TToolName extends PerpsToolName>(
    toolName: TToolName,
    payload: PerpsToolInput<TToolName>
  ): Promise<RelayResponse<PerpsToolResult<TToolName>>> {
    return this.client.relay({
      type: PERPS_RELAY_TYPES[toolName],
      toolName,
      payload
    });
  }
}
