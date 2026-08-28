# GitHub Org Agent Fleet

Use this door when an organization needs unattended or scheduled agents that it
runs at its own expense. If a person is actively using Claude Desktop, Cursor,
OpenClaw, or another MCP client, use the MCP door in the root README instead.
That bypasses a fleet entirely.

## Control Boundary

GitHub is entity identity only. It can prove the organization, repository, and
admin scope, but it does not carry Toreva work messages.

Toreva's receiving system is the object store behind the gateway relay. Agents
read the objects they are authorized to read, write the next object state, and
return `receipt_id` proof for every accepted, pending, or refused write.

The organization's runner owns compute. Its AI credentials stay in the
organization's runner secret store, GitHub Actions secrets, or local machine
credential store. Toreva does not need, receive, or hold those model
credentials for this path.

## Admin Setup

1. Create or choose an organization-owned GitHub repository for the agent code
   and runner config.
2. Choose the runner surface: GitHub Actions, a self-hosted runner, a local
   daemon, or an agent framework controlled by the organization.
3. Store secrets in the runner's own secret system:
   - `TOREVA_RELAY_AUTH_TOKEN` or `RELAY_AUTH_TOKEN` for Toreva relay access.
   - Your model provider credential or local AI-client auth for agent compute.
4. Install the connector the runner will use:
   - MCP: `npx -y @toreva/mcp`
   - SDK: `pnpm add @toreva/sdk @toreva/types`
   - CLI: `npm install -g @toreva/cli`
5. Make each job write back through `https://gateway.toreva.com/relay` and
   persist the returned `receipt_id` next to the job result.

## Runner MCP Stanza

Use a secret reference, not an inline token.

```json
{
  "mcpServers": {
    "toreva": {
      "command": "npx",
      "args": ["-y", "@toreva/mcp"],
      "env": {
        "RELAY_URL": "https://gateway.toreva.com",
        "RELAY_AUTH_TOKEN": "${RELAY_AUTH_TOKEN}"
      }
    }
  }
}
```

For GitHub Actions, keep both Toreva and model credentials in repository or
organization secrets:

```yaml
env:
  RELAY_URL: https://gateway.toreva.com
  RELAY_AUTH_TOKEN: ${{ secrets.TOREVA_RELAY_AUTH_TOKEN }}
  MODEL_API_KEY: ${{ secrets.MODEL_API_KEY }}
```

`MODEL_API_KEY` is a placeholder for the organization's own model credential.
Do not send it to Toreva and do not commit it to the repository.

## Dispatch Transport

The organization chooses its own dispatch transport. Common choices are
`workflow_dispatch`, a scheduled workflow, a repository-local queue, a webhook,
or a filesystem queue watched by a local daemon.

Each dispatch should be one bounded unit of work for one subject or scope. It
should include:

| Field | Purpose |
| --- | --- |
| `requestId` | Idempotency key for the relay request |
| `subject_ref` | External subject reference known to the organization |
| `object_kind` | Toreva object family being read or written |
| `operation` | Requested object operation |
| `run_id` | Runner or workflow run identifier for audit |

Do not build a loop that scans every user or repository on a timer. Trigger
work from an explicit user request, webhook, scheduled scoped job, or runner
event.

## Answer Landing

The agent's final answer is not complete until it lands on a Toreva object and
the gateway returns a receipt. For direct SDK or HTTP use, send the relay
envelope below. For an MCP surface that exposes the same tool, call
`toreva_governed_object_upsert` with the same payload.

```http
POST https://gateway.toreva.com/relay
Authorization: Bearer <relay-token>
Content-Type: application/json
```

```json
{
  "type": "governed_object.upsert",
  "toolName": "toreva_governed_object_upsert",
  "requestId": "org-run-001",
  "payload": {
    "contract_version": "work_surface.governed_object_upsert.v0",
    "operation": "create",
    "actor": {
      "surface_kind": "daemon_runner",
      "surface_name": "org-agent-runner",
      "agent_instance_id": "agent-01",
      "run_id": "github-run-123"
    },
    "object": {
      "object_kind": "statement_of_intent",
      "subject_ref": "org-subject-001",
      "fields": {
        "summary": "Agent-authored result for review."
      }
    },
    "lineage": {
      "human_grant_ref": "grant_01"
    },
    "idempotency_key": "org-run-001",
    "require_receipt": true,
    "nothing_should_move": true
  }
}
```

Treat HTTP success as transport success only. The usable proof is the returned
`receipt_id`.

## Readiness Checklist

A customer-owned fleet is ready when:

- GitHub org identity and admin control are established.
- The runner can start without Toreva-held model credentials.
- Toreva relay access is injected from the organization's secret store.
- The runner can call MCP, SDK, or CLI without committing secrets.
- Each dispatch is bounded to one subject or scope.
- Each write returns and stores a `receipt_id`.
- Hosted Toreva compute is not required for the path to work.

## Non-Goals

This guide does not define a Toreva-hosted fleet, Toreva-owned runner topology,
business logic, direct chain execution, or financial advice. It only describes
how an organization-owned runner connects its own compute to Toreva objects
through the gateway relay.
