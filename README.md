<!-- BEGIN TOREVA GITHUB LOGO -->
<p align="center">
  <a href="https://github.com/toreva">
    <img src="https://raw.githubusercontent.com/toreva/.github/main/assets/toreva-logo-cyan-dark.png" alt="Toreva" width="96">
  </a>
</p>
<!-- END TOREVA GITHUB LOGO -->

# toreva kit

Kit is the public client layer for connecting user-owned compute to Toreva
governed objects.

The front door is the object store. MCP clients, SDK callers, CLI users, and
customer-owned agent fleets all read and write the same Toreva objects through
the gateway relay, and every accepted, pending, or refused outcome returns a
receipt.

GitHub can prove which organization and admin are acting. It is not the
transport for Toreva work messages. Compute is bound per scope, and the live
paths put model execution on the developer's own account.

No money moves through this connector.

## The Three Doors

### Door 1: MCP

Use this first. Your AI client connects the Toreva MCP server, your own client
subscription does the work, and Toreva receives only the object reads and writes
you authorize.

```bash
npx toreva init --client=claude-desktop
npx toreva login
npx toreva doctor
```

Restart the client, then ask it about your Toreva objects or receipts. Supported
client config targets are `claude-desktop`, `cursor`, and `openclaw`.

### Door 2: Customer-Owned Fleet

Use this when you need unattended or scheduled agents. A GitHub organization
admin runs agents in their own org, on their own runners, with their own model
credentials. The agents call Toreva through MCP, SDK, or CLI and land answers
back on Toreva objects with `receipt_id` proof.

Start here: [GitHub Org Agent Fleet](./docs/github-org-agent-fleet.md).

### Door 3: Hosted Compute

Hosted compute means Toreva runs the agents and carries the marginal model
cost. This door is deferred and is not documented as available. Use MCP or a
customer-owned fleet today.

## How Answers Land

The object store is the receiving system. A work surface prepares a relay
request, sends it to `https://gateway.toreva.com/relay`, and treats the result
as accepted only when the gateway returns a `receipt_id`.

For the shared install, invoke, and receipt shapes, see
[Work-Surface Connector Primitives](./docs/work-surface-connector-primitives.md).

## MCP Tools

| Tool | What it does |
| --- | --- |
| `toreva_establish_agent_wallet` | Create the agent wallet with hard limits |
| `toreva_read_or_scan` | Read or scan a main wallet or agent wallet |
| `toreva_simulate_action` | Test an action before anything is prepared |
| `toreva_prepare_unsigned_transaction` | Prepare an unsigned transaction after simulation |
| `toreva_explain_action` | Explain an action or receipt |
| `toreva_get_receipt` | Fetch one receipt |
| `toreva_refuse_action` | Refuse an unsafe action and return a refusal receipt |

## Install

The local package runs over stdio. Use either the token written by
`toreva login` or an explicit `RELAY_AUTH_TOKEN` from your own secret store.

```bash
npm install -g @toreva/mcp
toreva login
toreva-mcp
```

For runner-owned environments:

```bash
RELAY_AUTH_TOKEN=your_token toreva-mcp
```

For local development:

```bash
pnpm install
pnpm --filter @toreva/mcp build
RELAY_AUTH_TOKEN=your_token node packages/mcp/dist/index.js
```

## Package

`@toreva/mcp` is the Rung-1 MCP package. Version `0.2.0` is stdio-local only.

The public metadata is `server.json` and `packages/mcp/package.json`.

## Packages

| Package | What |
| --- | --- |
| `@toreva/mcp` | MCP server for agent integration |
| `@toreva/types` | Shared schemas and types |
| `@toreva/sdk` | TypeScript client library |
| `@toreva/cli` | Command-line interface |

## Verify

```bash
pnpm test
pnpm --filter @toreva/mcp build
```

## Regulatory notice

This software provides tooling for interacting with the Toreva policy service.
It does not provide financial advice, investment advice, trading advice, or any
other form of advice. Use of this software does not create a fiduciary
relationship, advisory relationship, or any other professional relationship
between you and Toreva Pty Ltd.

Toreva Pty Ltd is not responsible for modifications made to this software by
third parties, including modifications that alter or remove compliance language,
disclaimers, or risk warnings. If you use a modified version of this software,
you do so at your own risk and are responsible for ensuring your use complies
with applicable law.

## License

MIT — see [LICENSE](./LICENSE)
