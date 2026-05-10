# toreva_skill_staking

## When to use

Use this skill to inspect Toreva primitives in the Staking family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "staking"`
- Taxonomy access point: `taxonomy://primitive-family/staking`
- Primary venue/provider: `jito`
- Secondary/watchlist: `marinade`

## Primitive entries

- `exec.stake_sol_marinade` (value, external_value_transaction_2_bps)
- `exec.unstake_sol_marinade` (value, external_value_transaction_2_bps)
- `exec.stake_sol_jito` (value, external_value_transaction_2_bps)
- `exec.unstake_sol_jito` (value, external_value_transaction_2_bps)
- `exec.stake` (value, external_value_transaction_2_bps)
- `exec.unstake` (value, external_value_transaction_2_bps)
- `exec.stake_compare` (read, data_transaction_0_bps)
- `exec.stake_delegate` (authority, control_or_authority_gated)
- `exec.stake_undelegate` (authority, control_or_authority_gated)
- `exec.stake_withdraw` (value, external_value_transaction_2_bps)
- `exec.stake_pool_deposit` (value, external_value_transaction_2_bps)
- `exec.stake_pool_withdraw` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
