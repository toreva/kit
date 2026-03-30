import type { RelayRequest, RelayResponse } from '@toreva/types';

export interface TorevaClientConfig {
  relayUrl?: string;
  relayAuthToken: string;
}

export class TorevaClient {
  private readonly relayUrl: string;

  constructor(private readonly config: TorevaClientConfig) {
    this.relayUrl = (config.relayUrl ?? 'https://gateway.toreva.com').replace(/\/+$/, '');
  }

  async relay<TPayload, TResult>(request: RelayRequest<TPayload>): Promise<RelayResponse<TResult>> {
    const response = await fetch(`${this.relayUrl}/relay`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.relayAuthToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Relay call failed with status ${response.status}`);
    }

    return response.json() as Promise<RelayResponse<TResult>>;
  }
}
