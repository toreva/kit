# kit Architecture

Kit is Toreva's public thin-client surface for agents and builders. It contains
SDK, CLI, MCP server, shared schemas, examples, public Skills, and public
integration docs. It does not route trades, score venues, hold funds, sign
transactions, or store user state.

## How It Fits

```text
agent / daemon / CLI / MCP client
  -> Kit package or direct HTTP
  -> https://gateway.toreva.com/relay
  -> Toreva Coordinator and owning internal services
```

Kit publishes only client-side contracts. Gateway remains the only public
network endpoint, and internal services remain behind the gateway air gap.

## Internal Shape

| Path | Role |
| --- | --- |
| `packages/types` | Zod schemas, relay type maps, response/error types |
| `packages/sdk` | TypeScript relay client wrappers |
| `packages/cli` | Local CLI setup, login, doctor, and perps relay calls |
| `packages/mcp` | Local MCP server exposing Toreva tools over stdio |
| `skills` | Public machine-readable verb guidance |
| `examples` | Minimal integration examples |
| `docs` | Public source-of-truth integration docs |

No persistent state lives in Kit. The CLI may write a local auth token to the
developer's machine during login. Runtime execution state, authorization state,
receipts, venue monitoring, and audit records live behind Gateway.

## Invariants

- Kit only calls `gateway.toreva.com` over HTTPS relay protocol.
- Kit never asks for or stores private keys, seed phrases, API secrets, or raw
  signer material.
- Kit does not contain business logic for routing, pricing, guardrails,
  execution, venue selection, or policy enforcement.
- Public perps opens use `walletAddress`, `token`, `sizeUsd`, `leverage`,
  `collateralToken`, and `collateralAmount`.
- `requestId` is the relay-level idempotency key; `clientRequestId` is an
  optional downstream execution correlation key.
- `toreva_establish` and `toreva_perps_establish` both map to
  `intent.establish`.
- Every public example must validate against the exported schemas.
- Execution guidance is execution-only and not financial advice.

## Failure Modes

| Failure | Kit behavior | Caller action |
| --- | --- | --- |
| Missing auth token | CLI/MCP fails before relay call | Run `toreva login` or set `TOREVA_AUTH_TOKEN` |
| Schema validation failure | Request rejected locally or by Gateway | Fix payload fields; do not retry unchanged |
| Auth failure | Gateway returns auth error | Refresh token or contact Toreva |
| Guardrail rejection | Gateway/internal service refuses action | Ask human to adjust policy/caps |
| Venue unavailable | Relay returns venue/system error | Retry only if `retryable` is true, otherwise simulate or wait |
| Idempotent replay | Gateway reports duplicate request | Treat as completed/replayed, then inspect receipt/result |

## External Dependencies

- Gateway relay: `https://gateway.toreva.com/relay`
- Remote MCP: `https://mcp.toreva.com`
- Public repo: `https://github.com/toreva/kit`
- npm packages: `@toreva/sdk`, `@toreva/cli`, `@toreva/mcp`, `@toreva/types`

## Trust Boundary

Kit is public and intentionally low-trust. It should help an agent form correct
requests, but all custody, authorization, policy, execution, and receipt truth
is enforced server-side by Toreva systems behind Gateway.
