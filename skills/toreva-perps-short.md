# toreva-perps-short

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps to open. Everything else is free.

Omit `venue` for best-execution routing. Set `venue` only when the user
explicitly chooses a venue. If Pacifica is selected, Toreva uses the
policy-bound Pacifica API agent wallet attached through `toreva_establish`.

Use Gateway MCP fields: `walletAddress`, `token`, `sizeUsd`, `leverage`,
`collateralToken`, and `collateralAmount`.

Execution only — not financial advice.
