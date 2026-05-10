# toreva_skill_advanced_orders_dca

## When to use

Use this skill to inspect Toreva primitives in the Advanced orders and DCA family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "advanced_orders_dca"`
- Taxonomy access point: `taxonomy://primitive-family/advanced_orders_dca`
- Primary venue/provider: `jupiter`
- Secondary/watchlist: `phoenix-watchlist`, `openbook-watchlist`

## Primitive entries

- `exec.dca_create` (value, external_value_transaction_2_bps)
- `exec.dca_cancel` (value, external_value_transaction_2_bps)
- `exec.limit_order_create` (value, external_value_transaction_2_bps)
- `exec.limit_order_cancel` (value, external_value_transaction_2_bps)
- `exec.order_cancel` (value, external_value_transaction_2_bps)
- `exec.order_status` (read, data_transaction_0_bps)
- `exec.order_batch_cancel` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
