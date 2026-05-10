# toreva-perps-query-position

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Read current perps position state for a wallet, optionally filtered by venue.
Use this in monitoring loops.

## Minimal payload

```json
{"walletAddress":"<wallet>","venue":"pacifica"}
```

## Response shape

Expect `ok`, position list/details, optional PnL/margin fields, and
`meta.requestId`.

## Common pitfalls

- This is read-only and does not close or modify a position.
- Omit `venue` only when querying all enabled venues.
- Use receipt data for historical truth; use this for current state.

Execution only — not financial advice.
