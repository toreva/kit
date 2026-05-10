# toreva_skill_perps

## When to use

Use this skill to inspect Toreva primitives in the Perpetual futures family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "perps"`
- Taxonomy access point: `taxonomy://primitive-family/perps`
- Primary venue/provider: `pacifica`
- Secondary/watchlist: `drift-watchlist`

## Primitive entries

- `exec.perps_long` (value, external_value_transaction_2_bps) -> `toreva_perps_long`
- `exec.perps_short` (value, external_value_transaction_2_bps) -> `toreva_perps_short`
- `exec.perps_close` (value, external_value_transaction_2_bps) -> `toreva_perps_close`
- `exec.perps_add_margin` (value, external_value_transaction_2_bps) -> `toreva_perps_add_margin`
- `exec.perps_remove_margin` (value, external_value_transaction_2_bps) -> `toreva_perps_remove_margin`
- `exec.perps_cancel_order` (value, external_value_transaction_2_bps) -> `toreva_perps_cancel_order`
- `exec.perps_funding_settle` (value, external_value_transaction_2_bps) -> `toreva_perps_funding_settle`
- `exec.perps_submit_signed` (value, external_value_transaction_2_bps)
- `exec.perps_query_position` (read, data_transaction_0_bps) -> `toreva_perps_query_position`
- `exec.perps_query_funding` (read, data_transaction_0_bps) -> `toreva_perps_query_funding`
- `exec.perps_query_venues` (read, data_transaction_0_bps) -> `toreva_perps_query_venues`
- `exec.perps_query_markets` (read, data_transaction_0_bps) -> `toreva_perps_query_markets`
- `exec.perps_simulate` (read, data_transaction_0_bps) -> `toreva_perps_simulate`
- `exec.perps_explain` (read, data_transaction_0_bps) -> `toreva_perps_explain`

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
