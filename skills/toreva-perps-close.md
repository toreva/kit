# toreva-perps-close

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Close an open perps position. Closing is a lifecycle action and has no Toreva
fee.

## Minimal payload

```json
{"walletAddress":"<wallet>","venue":"pacifica","positionId":"<position-id>","token":"SOL","side":"long"}
```

## Response shape

Expect `ok`, optional `result.txSignature`, `result.receiptId`,
`result.positionId`, and `meta.requestId`.

## Common pitfalls

- Include the venue that owns the position.
- Closing should generally remain available even when new opens are blocked.
- Do not send raw venue signer material.

Execution only — not financial advice.
