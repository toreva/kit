import { PERPS_RELAY_TYPES, type PerpsToolName, type RelayResponse } from '@toreva/types';
import { TorevaClient } from './client.js';

export class PerpsApi {
  constructor(private readonly client: TorevaClient) {}

  call<TPayload, TResult>(toolName: PerpsToolName, payload: TPayload): Promise<RelayResponse<TResult>> {
    return this.client.relay({
      type: PERPS_RELAY_TYPES[toolName],
      toolName,
      payload
    });
  }
}
