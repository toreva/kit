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

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface BusPublisherConfig {
  topic?: string;
  accessToken?: string;
  getAccessToken?: () => Promise<string>;
  fetchImpl?: typeof fetch;
}

export class BusPublisher {
  private readonly topic: string;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: BusPublisherConfig) {
    this.topic = config.topic ?? COORDINATOR_BUS_TOPIC;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  private async resolveAccessToken(): Promise<string> {
    if (typeof this.config.getAccessToken === 'function') {
      const token = await this.config.getAccessToken();
      if (!token) {
        throw new Error('BusPublisher token provider returned an empty access token.');
      }
      return token;
    }

    if (!this.config.accessToken) {
      throw new Error('BusPublisher requires either accessToken or getAccessToken.');
    }

    return this.config.accessToken;
  }

  async publish(envelope: BusEnvelope): Promise<string> {
    this.validateEnvelope(envelope);

    const endpoint = `https://pubsub.googleapis.com/v1/${this.topic}:publish`;
    const encoded = Buffer.from(JSON.stringify(envelope), 'utf8').toString('base64');
    const accessToken = await this.resolveAccessToken();

    const response = await this.fetchImpl(endpoint, {
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

  private validateEnvelope(envelope: BusEnvelope): void {
    const required: Array<[string, string]> = [
      ['envelope_id', envelope.envelope_id],
      ['schema_version', envelope.schema_version],
      ['routing_key', envelope.routing_key],
      ['published_at', envelope.published_at],
      ['source.domain', envelope.source.domain],
      ['source.repo', envelope.source.repo],
      ['source.actor', envelope.source.actor],
      ['correlation_id', envelope.correlation_id],
      ['idempotency_key', envelope.idempotency_key],
      ['object_type', envelope.object_type],
      ['object_ref', envelope.object_ref]
    ];

    for (const [field, value] of required) {
      if (!value || value.trim().length === 0) {
        throw new Error(`Bus envelope field is required: ${field}`);
      }
    }

    if (envelope.policy_context.objective_context.length === 0) {
      throw new Error('Bus envelope policy_context.objective_context must contain at least one objective.');
    }

    const uuidFields: Array<[string, string | null]> = [
      ['envelope_id', envelope.envelope_id],
      ['correlation_id', envelope.correlation_id],
      ['idempotency_key', envelope.idempotency_key],
      ['causation_id', envelope.causation_id]
    ];

    for (const [field, value] of uuidFields) {
      if (value !== null && !UUID_V4_PATTERN.test(value)) {
        throw new Error(`Bus envelope field must be a UUID v4: ${field}`);
      }
    }

    const publishedAt = Date.parse(envelope.published_at);
    if (Number.isNaN(publishedAt)) {
      throw new Error('Bus envelope field must be an ISO timestamp: published_at');
    }
  }
}
