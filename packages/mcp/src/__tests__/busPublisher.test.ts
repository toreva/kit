import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BusPublisher, COORDINATOR_BUS_TOPIC, type BusEnvelope } from '../bus-publisher.js';

const envelope: BusEnvelope = {
  envelope_id: '11111111-1111-4111-8111-111111111111',
  schema_version: 'v1',
  routing_key: 'kit.bus.onboarding.verification',
  published_at: '2026-04-18T00:00:00.000Z',
  source: {
    domain: 'kit',
    repo: 'toreva/kit',
    actor: 'codex'
  },
  correlation_id: '22222222-2222-4222-8222-222222222222',
  causation_id: null,
  idempotency_key: '33333333-3333-4333-8333-333333333333',
  object_type: 'participant.bus_onboarding.verification',
  object_ref: 'kit/onboarding/verification',
  policy_context: {
    objective_context: [
      {
        objective_id: 'OBJ-bus-first',
        expected_contribution: 'positive'
      }
    ]
  },
  payload: {
    participant_id: 'kit'
  }
};

describe('BusPublisher', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('publishes to the coordinator bus topic by default', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ messageIds: ['mid-1'] })
    });

    const publisher = new BusPublisher({ accessToken: 'token-123', fetchImpl: fetchMock as typeof fetch });
    const messageId = await publisher.publish(envelope);

    expect(messageId).toBe('mid-1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      `https://pubsub.googleapis.com/v1/${COORDINATOR_BUS_TOPIC}:publish`
    );
  });

  it('supports async token providers', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ messageIds: ['mid-2'] })
    });

    const publisher = new BusPublisher({
      getAccessToken: async () => 'dynamic-token',
      fetchImpl: fetchMock as typeof fetch
    });

    await publisher.publish(envelope);

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(request.headers).toMatchObject({
      Authorization: 'Bearer dynamic-token'
    });
  });

  it('throws when no token configuration is provided', async () => {
    const publisher = new BusPublisher({});
    await expect(publisher.publish(envelope)).rejects.toThrow(
      'BusPublisher requires either accessToken or getAccessToken.'
    );
  });

  it('throws when token provider returns an empty token', async () => {
    const publisher = new BusPublisher({
      getAccessToken: async () => '',
      fetchImpl: fetchMock as typeof fetch
    });
    await expect(publisher.publish(envelope)).rejects.toThrow(
      'BusPublisher token provider returned an empty access token.'
    );
  });

  it('throws when a required envelope field is empty', async () => {
    const publisher = new BusPublisher({ accessToken: 'token-123', fetchImpl: fetchMock as typeof fetch });
    await expect(
      publisher.publish({
        ...envelope,
        routing_key: ''
      })
    ).rejects.toThrow('Bus envelope field is required: routing_key');
  });
});
