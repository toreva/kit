# toreva_skill_lp_liquidity

## When to use

Use this skill to inspect Toreva primitives in the Liquidity provision family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "lp_liquidity"`
- Taxonomy access point: `taxonomy://primitive-family/lp_liquidity`
- Primary venue/provider: `orca-whirlpools`
- Secondary/watchlist: `raydium`, `meteora`

## Primitive entries

- `exec.lp_add` (value, external_value_transaction_2_bps)
- `exec.lp_remove` (value, external_value_transaction_2_bps)
- `exec.lp_collect_fee` (value, external_value_transaction_2_bps)
- `exec.lp_compound` (value, external_value_transaction_2_bps)
- `exec.lp_create_position` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
