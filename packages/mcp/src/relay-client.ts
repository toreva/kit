import type { RelayRequest, RelayResponse } from '@toreva/types';

export interface RelayClientConfig {
  relayUrl: string;
  relayAuthToken: string;
}

export class RelayClient {
  constructor(private readonly config: RelayClientConfig) {}

  async send<TPayload = unknown, TResult = unknown>(
    request: RelayRequest<TPayload>
  ): Promise<RelayResponse<TResult>> {
    const endpoint = new URL('/relay', this.config.relayUrl).toString();
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.relayAuthToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Relay request failed (${response.status}): ${text}`);
    }

    return (await response.json()) as RelayResponse<TResult>;
  }
}
