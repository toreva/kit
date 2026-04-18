export const COORDINATOR_BUS_TOPIC = 'projects/toreva-prod/topics/coordinator-bus-prod';

export type ExpectedContribution = 'positive' | 'negative' | 'neutral';

export interface BusEnvelope {
  envelope_id: string;
  schema_version: string;
  routing_key: string;
  published_at: string;
  source: {
    domain: string;
    repo: string;
    actor: string;
  };
  correlation_id: string;
  causation_id: string | null;
  idempotency_key: string;
  object_type: string;
  object_ref: string;
  policy_context: {
    objective_context: Array<{
      objective_id: string;
      expected_contribution: ExpectedContribution;
    }>;
  };
  payload: Record<string, unknown>;
}

export interface BusPublisherConfig {
  topic?: string;
  accessToken?: string;
  getAccessToken?: () => Promise<string>;
}

export class BusPublisher {
  private readonly topic: string;

  constructor(private readonly config: BusPublisherConfig) {
    this.topic = config.topic ?? COORDINATOR_BUS_TOPIC;
  }

  private async resolveAccessToken(): Promise<string> {
    if (this.config.getAccessToken) {
      return this.config.getAccessToken();
    }

    if (!this.config.accessToken) {
      throw new Error('BusPublisher requires either accessToken or getAccessToken.');
    }

    return this.config.accessToken;
  }

  async publish(envelope: BusEnvelope): Promise<string> {
    const endpoint = `https://pubsub.googleapis.com/v1/${this.topic}:publish`;
    const encoded = Buffer.from(JSON.stringify(envelope), 'utf8').toString('base64');
    const accessToken = await this.resolveAccessToken();

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            attributes: {
              routing_key: envelope.routing_key,
              object_type: envelope.object_type,
              source_domain: envelope.source.domain,
              source_repo: envelope.source.repo
            },
            data: encoded
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to publish bus envelope (${response.status}): ${errorText}`);
    }

    const payload = (await response.json()) as { messageIds?: string[] };
    const firstId = payload.messageIds?.[0];

    if (!firstId) {
      throw new Error('Failed to publish bus envelope: Pub/Sub did not return messageIds[0].');
    }

    return firstId;
  }
}
