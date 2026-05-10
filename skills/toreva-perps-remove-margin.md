# toreva-perps-remove-margin

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Remove collateral margin from an existing perps position when policy and venue
risk checks allow it. Value transactions carry the founder-approved 2 bps fee when value moves.

## Minimal payload

```json
{"walletAddress":"<wallet>","venue":"pacifica","positionId":"<position-id>","token":"USDC","amount":25}
```

## Response shape

Expect `ok`, optional margin update details, `result.receiptId`, and
`meta.requestId`.

## Common pitfalls

- Removing margin can increase liquidation risk; simulate or check policy first.
- `token` is the margin token.
- Withdrawals back to Swig/cash management may require separate approval.

Execution only — not financial advice.
