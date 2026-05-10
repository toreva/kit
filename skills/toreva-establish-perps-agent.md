# toreva-establish-perps-agent

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Use this skill when an agent needs to attach a delegated authority graph to a
human wallet before perps execution. Tool name can be `toreva_establish` or the
perps-family alias `toreva_perps_establish`; both map to `intent.establish`.

## Minimal payload

```json
{
  "walletAddress": "<human-wallet>",
  "prompt": "Create a Toreva perps agent capability for SOL and BTC with low notional limits.",
  "agent_authority": {
    "delegation_provider": "swig",
    "network": "solana",
    "signer_kind": "delegated_authority",
    "policy_id": "perps_agent_v1"
  },
  "capabilities": [
    {
      "capability_type": "perps",
      "delegation_provider": "venue_api",
      "network": "solana",
      "venue": "pacifica",
      "execution_adapter": "pacifica",
      "signer_kind": "venue_api_agent"
    }
  ]
}
```

Use this before perps execution when an agent needs a delegated authority graph.

Recommended pattern:

```text
human wallet
  -> Toreva/Swig master authority
  -> perps child capability
  -> Pacifica API agent wallet if Pacifica is selected
```

The human wallet remains root owner. The Pacifica API agent wallet is a
venue-specific child signer for Pacifica REST orders. It is governed by Toreva
policy, approvals, receipts, monitoring, and revocation.

For open-long/open-short, omit `venue` unless the user explicitly asks for one.
Toreva will compare enabled venues and route by estimated all-in cost.

Use Gateway MCP fields: `walletAddress` for the human wallet, and for opens
use `token`, `sizeUsd`, `leverage`, `collateralToken`, and `collateralAmount`.

## Response shape

Expect a relay receipt or typed error envelope. Keep the returned `requestId`
for correlation and replay checks.

## Common pitfalls

- Do not ask for private keys, seed phrases, or API secrets
- Do not omit `venue` when policy or the user explicitly selected one
- Do not publish internal authority choreography outside this repo
- Do not use `protocolId`; use `venue`

Execution only — not financial advice.
