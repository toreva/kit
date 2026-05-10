# toreva-perps-query-venues

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps.

## When to use

Use this skill to inspect the currently available venues before an open-long or
open-short action.

## Minimal payload

```json
{}
```

## Response shape

Expect a read-only venue list with fee and availability metadata.

## Common pitfalls

- Do not treat this as a trade execution tool
- Do not assume venue names imply identical market coverage
- Do not use `protocolId`; use `venue`

Execution only — not financial advice.
