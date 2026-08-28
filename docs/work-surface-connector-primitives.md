# Work-Surface Connector Primitives

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps to open. Everything else is free.

This reference defines Kit's public primitive shapes for unattended work
surfaces. It covers SDK, API, MCP, and CLI contracts only. It does not add
execution business logic, move funds, or authorize customer action by itself.

The front door is the object store behind the gateway relay. GitHub or another
identity provider may establish who controls a scope, but work still lands by
reading or writing Toreva objects and receiving a `receipt_id`.

## Scope

Work surfaces include coding tools, daemon runners, scheduled agents, and
agent frameworks that may act without an open chat window. Kit's boundary is
install, configure, invoke, and return receipts through the relay protocol over
HTTPS at `https://gateway.toreva.com/relay`.

Toreva governance applies only to agents that route through Toreva for state or
authority Toreva holds. A caller that never invokes Toreva is outside this
connector's governance claim.

## Compute Binding Doors

Compute is selected per scope. The shared primitive set below applies after a
scope chooses one of these doors:

| Door | Who runs compute | Status | Kit role |
| --- | --- | --- | --- |
| `mcp` | The person's own AI client or local MCP host | Live | Install the MCP connector, authenticate, call tools, and return receipts |
| `fleet` | The organization's own runners or daemon agents | Live pattern | Provide MCP, SDK, CLI, relay, and receipt shapes for customer-owned agents |
| `hosted` | Toreva-hosted agents | Deferred | Not documented as available |

The `mcp` and `fleet` paths do not require Toreva to hold a per-user AI API key.
For a GitHub organization fleet, see
[GitHub Org Agent Fleet](./github-org-agent-fleet.md).

## Minimum Primitive Set

| Primitive | SDK/API shape | MCP/CLI shape | Required result |
| --- | --- | --- | --- |
| `install_connector` | Import `@toreva/sdk` or run `@toreva/mcp` as a stdio server | `toreva init --client=<supported-client>` or a runner-owned MCP stanza | A Toreva server entry exists under the caller's tool config |
| `configure_relay_auth` | Supply a gateway-issued bearer token from the runner secret store | `toreva login` for attended setup, or `RELAY_AUTH_TOKEN` injected by the runner | No token is committed to code or an MCP JSON file |
| `verify_connector` | Call `client.relay(...)` with an idempotent probe | `toreva doctor` plus MCP `tools/list` | The caller proves it can reach the connector and gateway |
| `discover_capabilities` | Read exported tool names and relay types from `@toreva/types` | MCP `tools/list` | The caller sees canonical tool names before invoking |
| `upsert_governed_object` | Send the W1 relay envelope below | Call the same tool name and payload through MCP | A governed object is accepted, queued for review, or refused with a receipt |
| `get_receipt` | Call the receipt lookup relay type with `receipt_id` | `toreva_get_receipt` | The caller can resolve the returned receipt |

## Install And Configure Shape

The unattended runner owns where secrets live. Kit requires only a process
environment reference, not an inline secret.

```json
{
  "surface": {
    "kind": "daemon_runner",
    "name": "example-runner",
    "instance_id": "runner-2026-08-14-001"
  },
  "mcp": {
    "serverKey": "toreva",
    "command": "npx",
    "args": ["-y", "@toreva/mcp"],
    "env": {
      "RELAY_URL": "https://gateway.toreva.com",
      "RELAY_AUTH_TOKEN": "${RELAY_AUTH_TOKEN}"
    }
  },
  "sdk": {
    "package": "@toreva/sdk",
    "relayUrl": "https://gateway.toreva.com"
  },
  "cli": {
    "install": "npm install -g @toreva/cli",
    "configure": ["toreva login", "toreva doctor"]
  }
}
```

## Invocation Shape

The create/update call uses the existing relay envelope. The tool name and
relay type below are the v0 identifiers exported by Kit for gateway relay
consumers.

```http
POST https://gateway.toreva.com/relay
Authorization: Bearer <relay-token>
Content-Type: application/json
```

```json
{
  "type": "governed_object.upsert",
  "toolName": "toreva_governed_object_upsert",
  "requestId": "runner-job-2026-08-14-001",
  "payload": {
    "contract_version": "work_surface.governed_object_upsert.v0",
    "operation": "create",
    "actor": {
      "surface_kind": "daemon_runner",
      "surface_name": "example-runner",
      "agent_instance_id": "agent-42",
      "run_id": "run-2026-08-14-001"
    },
    "object": {
      "object_kind": "statement_of_intent",
      "subject_ref": "external-subject-ref",
      "walletAddress": "11111111111111111111111111111111",
      "fields": {
        "goal_context": "Record a user-authored intent for later review."
      }
    },
    "lineage": {
      "human_grant_ref": "grant_01",
      "delegator_ref": "agent_root",
      "parent_delegation_ref": "delegation_01",
      "attenuation_refs": ["rule_read_write_record_only"]
    },
    "idempotency_key": "runner-job-2026-08-14-001",
    "require_receipt": true,
    "nothing_should_move": true
  }
}
```

`venue` may appear only when the governed object is venue-scoped. Do not use
legacy venue aliases.

## Receipt Return Shape

Every successful, pending, or refused write returns a receipt reference. A
work-surface proof is not accepted from an HTTP 200 alone.

```json
{
  "ok": true,
  "result": {
    "contract_version": "work_surface.governed_object_upsert.v0",
    "operation": "create",
    "status": "pending_review",
    "object_ref": {
      "object_kind": "statement_of_intent",
      "object_id": "soi_01",
      "subject_ref": "external-subject-ref"
    },
    "receipt_id": "rct_01",
    "lineage_ref": "lineage_01",
    "human_grant_ref": "grant_01",
    "write_boundary": "gateway",
    "nothing_has_moved": true
  },
  "meta": {
    "requestId": "runner-job-2026-08-14-001",
    "timestamp": "2026-08-14T00:00:00.000Z"
  }
}
```

Refusals use the same outer relay response and include a `receipt_id`,
`refusal.reason_code`, and `refusal.human_reason`.

## Connector Readiness Checklist

A work surface is connector-ready when it can install the Toreva MCP server or
SDK, reference a runner-owned relay token without committing it, issue an
idempotent relay probe, discover canonical tool names, submit a governed-object
upsert request, and return the resulting `receipt_id` to the caller.

## Non-Execution Boundary

These primitives describe configuration, request, and receipt shapes only. They
do not route orders, score venues, enforce fees, sign transactions, or bypass
the gateway. Consumers must treat a work-surface write as unproven until the
gateway returns a `receipt_id`.
