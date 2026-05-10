# toreva-strategies

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Use this skill to browse the public strategy catalog before choosing a path.

## Minimal payload

```json
{}
```

## Response shape

Expect a catalog of supported strategy families, descriptions, and pricing
tiers.

## Common pitfalls

- Do not treat the catalog as execution logic
- Do not infer internal venue policy from catalog metadata alone
- Do not use `protocolId`; use `venue`

Execution only — not financial advice.
