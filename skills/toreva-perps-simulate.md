# toreva-perps-simulate

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Preview a perps open before calling `toreva_perps_long` or
`toreva_perps_short`. Simulation is a 0 bps data transaction and should run
before every open.

## Minimal payload

```json
{"walletAddress":"<wallet>","token":"SOL","direction":"long","sizeUsd":180,"leverage":1.2,"collateralToken":"USDC","collateralAmount":150}
```

## Response shape

Expect `ok`, route/venue comparison, estimated fees, estimated slippage,
funding context, and `meta.requestId`.

## Common pitfalls

- A simulation is not execution approval.
- Re-simulate if price, venue health, leverage, or collateral changes.
- Do not use `market`, `side`, or `notionalUsd`.

Execution only — not financial advice.
