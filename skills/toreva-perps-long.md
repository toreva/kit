# toreva-perps-long

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

Omit `venue` for best-execution routing. Set `venue` only when the user
explicitly chooses a venue. If Pacifica is selected, Toreva uses the
policy-bound Pacifica API agent wallet attached through `toreva_establish`.

Use Gateway MCP fields: `walletAddress`, `token`, `sizeUsd`, `leverage`,
`collateralToken`, and `collateralAmount`.

## When to use

Open a long perps position after `toreva_perps_simulate` passes and policy
allows real execution.

## Minimal payload

```json
{"walletAddress":"<wallet>","token":"SOL","sizeUsd":180,"leverage":1.2,"collateralToken":"USDC","collateralAmount":150}
```

## Response shape

Expect `ok`, optional `result.positionId`, `result.orderId`, `result.venue`,
`result.receiptId`, and `meta.requestId`.

## Common pitfalls

- Do not use `wallet`, `market`, or `notionalUsd`.
- Reuse `requestId` only for exact retries.
- Use `clientRequestId` inside the payload for downstream order correlation.

Execution only — not financial advice.
