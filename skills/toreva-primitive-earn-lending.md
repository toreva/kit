# toreva_skill_earn_lending

## When to use

Use this skill to inspect Toreva primitives in the Earn / lending family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "earn_lending"`
- Taxonomy access point: `taxonomy://primitive-family/earn_lending`
- Primary venue/provider: `kamino`
- Secondary/watchlist: `marginfi`

## Primitive entries

- `exec.deposit_usdc_kamino` (value, external_value_transaction_2_bps)
- `exec.withdraw_usdc_kamino` (value, external_value_transaction_2_bps)
- `exec.deposit_usdc_marginfi` (value, external_value_transaction_2_bps)
- `exec.withdraw_usdc_marginfi` (value, external_value_transaction_2_bps)
- `exec.lend` (value, external_value_transaction_2_bps)
- `exec.withdraw` (value, external_value_transaction_2_bps)
- `exec.borrow` (value, external_value_transaction_2_bps)
- `exec.repay` (value, external_value_transaction_2_bps)
- `exec.collateral_add` (value, external_value_transaction_2_bps)
- `exec.collateral_remove` (value, external_value_transaction_2_bps)
- `exec.liquidate` (value, external_value_transaction_2_bps)
- `exec.earn_compare` (read, data_transaction_0_bps) -> `toreva_earn`
- `exec.earn_deposit` (value, external_value_transaction_2_bps) -> `toreva_earn`
- `exec.earn_withdraw` (value, external_value_transaction_2_bps) -> `toreva_earn`
- `exec.yield_claim` (value, external_value_transaction_2_bps)
- `exec.yield_harvest` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
