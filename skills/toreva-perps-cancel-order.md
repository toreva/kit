# toreva-perps-cancel-order

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Cancel an open perps order. This is order-scoped; data/control fee treatment is 0 bps unless the venue charges network costs.

## Minimal payload

```json
{"walletAddress":"<wallet>","venue":"pacifica","positionId":"<position-id>","orderId":"<order-id>"}
```

## Response shape

Expect `ok`, optional `result.orderId`, `result.receiptId`, and
`meta.requestId`.

## Common pitfalls

- Use the `orderId` from the open result or venue monitor.
- Include `positionId` when the venue links cancel scope to a position.
- Do not use this to close a filled position; use `toreva_perps_close`.

Execution only — not financial advice.
