# toreva-establish-perps-agent

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps to open. Everything else is free.

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

Execution only — not financial advice.
