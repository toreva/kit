# toreva_skill_claims_airdrops

## When to use

Use this skill to inspect Toreva primitives in the Claims and airdrops family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "claims"`
- Taxonomy access point: `taxonomy://primitive-family/claims`
- Primary venue/provider: `solana-merkle-distributor-pattern`
- Secondary/watchlist: `tokentable-watchlist`, `streamflow-watchlist`

## Primitive entries

- `exec.claim_rewards` (value, external_value_transaction_2_bps)
- `exec.claim_airdrop` (value, external_value_transaction_2_bps)
- `exec.airdrop_register` (value, external_value_transaction_2_bps)
- `exec.airdrop_interest` (value, external_value_transaction_2_bps)
- `exec.airdrop_screen` (read, data_transaction_0_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
