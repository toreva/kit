# toreva-perps-query-funding

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Read current funding context for a token across enabled perps venues.

## Minimal payload

```json
{"token":"SOL"}
```

## Response shape

Expect `ok`, funding-rate records by venue/market, and `meta.requestId`.

## Common pitfalls

- Funding rates can change quickly; refresh before execution.
- Estimated funding is not realized funding.
- Use `toreva_perps_funding_settle` for settlement actions.

Execution only — not financial advice.
