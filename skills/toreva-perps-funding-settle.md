# toreva-perps-funding-settle

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Settle or claim funding on an existing perps position when the venue supports a
settle action. Value transactions carry the founder-approved 2 bps fee when value moves.

## Minimal payload

```json
{"walletAddress":"<wallet>","venue":"pacifica","positionId":"<position-id>","token":"SOL","side":"long"}
```

## Response shape

Expect `ok`, optional funding settlement details, `result.receiptId`, and
`meta.requestId`.

## Common pitfalls

- Query funding first when deciding whether settlement is worth doing.
- Do not treat estimated funding as realized funding until receipted.
- Include the position venue.

Execution only — not financial advice.
