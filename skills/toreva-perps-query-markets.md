# toreva-perps-query-markets

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

List markets available for perps routing, optionally filtered by venue.

## Minimal payload

```json
{"venue":"pacifica"}
```

## Response shape

Expect `ok`, market records by venue, and `meta.requestId`.

## Common pitfalls

- Omit `venue` to inspect all venues.
- Market support differs by venue.
- This is read-only; use simulate/open verbs for execution planning.

Execution only — not financial advice.
