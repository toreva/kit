# toreva_skill_balance_simulate_compare

## When to use

Use this skill to inspect Toreva primitives in the Balance, simulate, and compare family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "balance_simulate_compare"`
- Taxonomy access point: `taxonomy://primitive-family/balance_simulate_compare`
- Primary venue/provider: `jupiter+venue-sol-feeds`
- Secondary/watchlist: `birdeye`, `pyth`

## Primitive entries

- `exec.balance` (read, data_transaction_0_bps)
- `exec.simulate` (read, data_transaction_0_bps)
- `exec.compare` (read, data_transaction_0_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
