# @toreva/sdk

TypeScript client for Toreva gateway relay and governed-object connectors.

Kit is the public client layer for connecting user-owned compute to Toreva
governed objects. The SDK is a small typed wrapper around the gateway relay; it
does not implement business logic, hold secrets, or move money by itself.

## Install

```bash
pnpm add @toreva/sdk
# or
npm install @toreva/sdk
```

## Quick Start

```ts
import { TorevaClient } from '@toreva/sdk';

const client = new TorevaClient({
  relayUrl: process.env.RELAY_URL ?? 'https://gateway.toreva.com',
  relayAuthToken: process.env.RELAY_AUTH_TOKEN ?? ''
});

const response = await client.relay({
  type: 'governed_object.upsert',
  toolName: 'toreva_governed_object_upsert',
  requestId: 'runner-job-001',
  payload: {
    contract_version: 'work_surface.governed_object_upsert.v0',
    operation: 'create',
    actor: {
      surface_kind: 'daemon_runner',
      surface_name: 'example-runner'
    },
    object: {
      object_kind: 'statement_of_intent',
      subject_ref: 'external-subject-ref',
      fields: {
        goal_context: 'Record a user-authored intent for later review.'
      }
    },
    idempotency_key: 'runner-job-001',
    require_receipt: true,
    nothing_should_move: true
  }
});

console.log(response.result);
```

## Boundary

- All calls go through `https://gateway.toreva.com/relay` by default.
- The runner owns its relay token; do not commit tokens to source control.
- A write is not considered accepted without a returned `receipt_id`.
- Product-family mechanics live in docs custody until a separate publication
  pass approves them for kit.

## Three Doors

- MCP: a person's own AI client connects the Toreva MCP server.
- Customer-owned fleet: an organization runs its own agents and runners.
- Hosted compute: deferred until available.

See the root README for the public onboarding path.

## License

MIT.
