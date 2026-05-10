# toreva kit

Non-custodial execution primitives for Solana.  
Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade.  
Data transactions are free. External value transactions are 2 bps.

Your agent decides. Toreva executes. Every action receipted.

| Capability | Toreva | Pacifica direct | Drift direct | Jupiter Perps direct | Flash direct |
| --- | --- | --- | --- | --- | --- |
| External value fee | 2 bps | 4 bps | 3.5 bps | 6 bps | 4 bps |
| Multi-venue routing | Yes | No | No | No | No |
| Unified receipts | Yes | DIY | DIY | DIY | DIY |
| Policy-scoped agent wallet | Yes | DIY | DIY | DIY | DIY |
| Revocation workflow | Yes | DIY | DIY | DIY | DIY |
| Cross-venue monitoring | Yes | DIY | DIY | DIY | DIY |

See the static [perps fee calculator](./docs/pricing-calculator.html) for a
quick open-fee comparison.

## Agentic perps setup

Use `toreva_establish` or the perps-family alias `toreva_perps_establish`
before perps execution when an agent needs delegated authority for a human
wallet. The standard perps pattern is:

```text
human wallet
  -> Toreva/Swig master authority
  -> venue-specific child capability
  -> Pacifica API agent wallet when Pacifica is selected
```

The human wallet remains the root owner. The Swig authority is the policy and
capital-management control layer. Pacifica uses a separate API agent wallet
because Pacifica REST orders require an on-curve Ed25519 signer. Toreva can
create, bind, fund, route, monitor, and revoke that child capability through
Toreva surfaces; the user does not need to open Pacifica.

For best execution, omit `venue` on `toreva_perps_long` or
`toreva_perps_short`. Toreva will compare enabled venues and route by estimated
all-in cost. Set `venue` only when you intentionally want a specific venue.
Perps tools use the Gateway MCP field contract: `walletAddress`, `token`,
`sizeUsd`, `leverage`, `collateralToken`, and `collateralAmount`.

The public integration packet lives in this repo:

- [Agentic perps integration patterns](./docs/agentic-perps-integration-patterns.md)
- [OpenAPI-style relay examples](./docs/toreva-perps.openapi.json)
- [Claude Code agent prompt](./docs/claude-code-agent-prompt.md)
- [Discovery manifest guidance](./docs/public-discovery.md)
- [Primitive readiness catalog](./docs/primitive-readiness.json)
- [Primitive metadata dictionary](./docs/solana-primitive-metadata-dictionary.md)
- [Primitive catalog schematic](./docs/solana-primitive-catalog-schematic.md)

## Quickstart: Server-Side Relay

Use this path for bots, daemons, hosted agents, and server workloads.

```bash
export TOREVA_AUTH_TOKEN=your_token

curl https://gateway.toreva.com/relay \
  -H "Authorization: Bearer $TOREVA_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"perps.query_venues","toolName":"toreva_perps_query_venues","requestId":"quickstart-query-venues","payload":{}}'
```

For raw HTTP, `requestId` is the relay-level idempotency key. For venue-order
payloads, `clientRequestId` is forwarded to the downstream adapter or venue
when supported. Use both for execution: `requestId` deduplicates the Toreva
relay call, while `clientRequestId` lets downstream monitoring correlate the
venue request.

`requestId` is the caller-owned idempotency key for the relay envelope. It
should stay stable across retries of the same logical action. `clientRequestId`
is a downstream correlation id for venue or adapter observability; it is
optional on read-only flows and useful on venue-changing flows.

## Quickstart: Remote MCP

The zero-install MCP endpoint is:

```text
https://mcp.toreva.com
```

Add it to an MCP-aware client and authenticate with your Toreva token.

For browser-less or service integrations, prefer `https://mcp.toreva.com`
before the stdio package path. The remote endpoint is the shortest route for
agent builders.

## Quickstart: Local MCP Client

The fastest path — wires Toreva into your MCP-aware client (Claude
Desktop, OpenClaw, Cursor) and authenticates you in two commands:

```bash
npx toreva init --client=claude-desktop   # or openclaw | cursor
npx toreva login
```

`toreva init` writes the Toreva MCP server stanza into your client's
config file. `toreva login` runs the gateway's device-code flow and
stores the resulting token at `~/.config/toreva/config.json` (chmod
600).

Restart your MCP client and verify:

```bash
npx toreva doctor
```

You should see three `[ OK ]` lines: `config_present`, `auth_token`,
`mcp_call`.

Per-client snippets live in [`examples/`](./examples/) — one folder per
supported client (`claude-desktop`, `openclaw`, `cursor`).

## Direct Package Installs

```bash
npm install @toreva/sdk        # TypeScript client library
npm install -g @toreva/cli     # global `toreva` binary
```

### MCP server (stdio, run-it-yourself)

```bash
TOREVA_AUTH_TOKEN=your_token npx @toreva/mcp
```

### MCP server (remote, no install)

```
https://mcp.toreva.com
```

## Authentication

`toreva login` is the standard path. For CI / power users, set
`TOREVA_AUTH_TOKEN` directly to skip the device-code flow:

```bash
export TOREVA_AUTH_TOKEN=your_token
npx toreva login   # writes the token to ~/.config/toreva/config.json
```

Use `toreva login` for the standard device-code flow, or request an integration
token from your Toreva contact. The Kit repository is the public source of
truth for agent, SDK, CLI, Skills, and MCP integration details.

For real-funds enablement, keep the canary/live path high level in public
docs: a human-approved policy boundary, a funded wallet, venue access, and
receipt-backed execution. Do not publish operational runbooks, internal
approvals, or internal service choreography here.

### Environment variables

| Var | Default | Purpose |
| --- | --- | --- |
| `TOREVA_MCP_URL` | `https://mcp.toreva.com` | Gateway URL |
| `TOREVA_AUTH_TOKEN` | — | Skip device-code flow, persist this token |
| `TOREVA_CONFIG_DIR` | `~/.config/toreva` | Override on-disk config dir |

## Error Handling

Relay responses use a stable envelope:

```ts
type RelayResponse<TResult> = {
  ok: boolean;
  result?: TResult;
  error?: string;
  errorCode?: RelayErrorCode;
  errorDetail?: {
    code: RelayErrorCode;
    message: string;
    retryable: boolean;
    category: "auth" | "validation" | "guardrail" | "venue" | "idempotency" | "rate_limit" | "system";
  };
  meta?: { requestId?: string; timestamp?: string };
};
```

Retry only when `errorDetail.retryable` is true. Treat guardrail, auth, and
validation failures as human/actionable configuration issues, not transient
network errors.

Perps execution responses are typed in `@toreva/types` as
`perpsExecutionResultSchema`; opens and closes may return `positionId`,
`orderId`, `venue`, `averagePrice`, `txSignature`, `receiptId`, `requestHash`,
and `responseHash`. Read-only perps responses use `perpsQueryResultSchema`
for venues, positions, funding, markets, simulation, and explanation data.

Common retry guidance:

- `IDEMPOTENT_REPLAY` is safe to treat as a duplicate acknowledgement.
- `RATE_LIMITED` may be retried with backoff.
- `VENUE_UNAVAILABLE` is usually transient, but only retry if the action is
  still valid for the current market state.
- `AUTH_*`, `VALIDATION_FAILED`, and `GUARDRAIL_REJECTED` should not be
  retried blindly.

## Perps tools

| Tool | Fee | What it does |
| --- | --- | --- |
| `toreva_perps_long` | 2 bps | Open long — routes to better fill |
| `toreva_perps_short` | 2 bps | Open short — routes to better fill |
| `toreva_perps_close` | 2 bps when value moves | Close position at venue |
| `toreva_perps_add_margin` | 2 bps when value moves | Add margin |
| `toreva_perps_remove_margin` | 2 bps when value moves | Remove margin |
| `toreva_perps_cancel_order` | 0 bps control | Cancel order |
| `toreva_perps_funding_settle` | 2 bps when value moves | Settle funding |
| `toreva_perps_simulate` | 0 bps data | Preview before execution |
| `toreva_perps_explain` | 0 bps data | Explain trade or position |
| `toreva_perps_query_*` | 0 bps data | Position, funding, venues, markets |

## Venues

| Venue | Fee | Model |
| --- | --- | --- |
| Jupiter Perps | 6.0 bps flat | Oracle-based |
| Pacifica | 4.0 bps (Tier 1) | Order book variant |
| Drift Protocol | 3.5 bps taker | Order book |
| Flash Trade | 4.0 bps (Tier 1) | Order book variant |

Trades routed to Drift via toreva receive a 5% fee discount.

## Strategy tools

| Tool | What it does |
| --- | --- |
| `toreva_strategies` | Browse strategy catalog with pricing |
| `toreva_establish` | Attach a delegated agent authority and child capabilities to a wallet |
| `toreva_earn` | Deploy USDC to yield across venues |
| `toreva_scan` | Survey portfolio state |
| `toreva_simulate` | Dry-run without execution |
| `toreva_execute` | Execute a strategy |
| `toreva_explain` | Narrate what happened |
| `toreva_configure` | Adjust settings |

## Public Surface Readiness

Perps is the reference public platform pattern in this repo. Keep it as the
reference for naming, relay-envelope shape, receipts, and public documentation,
but do not treat perps readiness as proof for other families.

The public readiness ladder is:

```text
proposed -> canonical -> integration_ready -> canary_ready -> battle_tested
```

The machine-readable catalog is `docs/primitive-readiness.json` and the Gateway
projection is
`https://gateway.toreva.com/.well-known/toreva-primitive-readiness.json`.
The full primitive metadata dictionary is `docs/primitive-metadata.json` and
the Gateway projection is
`https://gateway.toreva.com/.well-known/toreva-primitive-catalog.json`.
Agents can discover the full primitive universe through the remote MCP tool
`toreva_primitives`; filter by `familyId` to get a family-specific skill access
point and venue/provider plan.

Do not add new public verb names until IA locks canonical ids and alias policy.
For now, public-facing docs should describe readiness by family rather than
promise implemented verbs.

The next families should be prepared in this order:

1. Earn and pre-Earn
2. Basic trade and swap
3. Staking
4. Options
5. Commerce and token movement
6. Prediction markets
7. NFTs
8. Advanced trading
9. DAO
10. Token ops, DCA, and claims
11. Vaults
12. LP
13. Bridge and wrap

Integration-ready wording is only allowed when Gateway, Network, Venue, Risk,
and Receipt evidence all exist. Public docs must not claim live-funds readiness
without PO evidence.

## Packages

| Package | What |
| --- | --- |
| `@toreva/sdk` | TypeScript client library |
| `@toreva/cli` | Command-line interface |
| `@toreva/mcp` | MCP server for agent integration |
| `@toreva/types` | Shared schemas and types |

## Regulatory notice

This software provides tooling for interacting with the toreva execution service. It does not provide financial advice, investment advice, trading advice, or any other form of advice. Use of this software does not create a fiduciary relationship, advisory relationship, or any other professional relationship between you and Toreva Pty Ltd.

Toreva Pty Ltd is not responsible for any modifications made to this software by third parties, including modifications that alter or remove compliance language, disclaimers, or risk warnings. If you use a modified version of this software, you do so at your own risk and are responsible for ensuring your use complies with applicable law.

## License

MIT — see [LICENSE](./LICENSE)
