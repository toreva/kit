# toreva-perps-explain

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Explain a perps position, receipt, transaction signature, or venue choice in
plain language.

## Minimal payload

```json
{"walletAddress":"<wallet>","venue":"pacifica","positionId":"<position-id>"}
```

## Response shape

Expect `ok`, explanation text or structured explanation fields, and
`meta.requestId`.

## Common pitfalls

- This is read-only and does not modify positions.
- Use `txSignature` when explaining a completed on-chain action.
- Use `positionId` when explaining current position state.

Execution only — not financial advice.
