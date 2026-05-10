# toreva-perps-add-margin

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Add collateral margin to an existing perps position. This is a value action;
the founder-approved 2 bps value-transaction fee applies when value moves.

## Minimal payload

```json
{"walletAddress":"<wallet>","venue":"pacifica","positionId":"<position-id>","token":"USDC","amount":25}
```

## Response shape

Expect `ok`, optional margin update details, `result.receiptId`, and
`meta.requestId`.

## Common pitfalls

- `token` is the margin token, not necessarily the market token.
- Funding the venue wallet may require a separate human approval.
- Do not use this when a venue requires close/reopen instead of native margin.

Execution only — not financial advice.
