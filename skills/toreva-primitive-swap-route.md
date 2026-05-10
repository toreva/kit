# toreva_skill_swap_route

## When to use

Use this skill to inspect Toreva primitives in the Basic trade, swap, and routing family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "swap_route"`
- Taxonomy access point: `taxonomy://primitive-family/swap_route`
- Primary venue/provider: `jupiter`
- Secondary/watchlist: `orca-via-jupiter`, `raydium-via-jupiter`

## Primitive entries

- `exec.swap` (value, external_value_transaction_2_bps)
- `exec.multi_swap` (value, external_value_transaction_2_bps)
- `exec.buy` (value, external_value_transaction_2_bps)
- `exec.sell` (value, external_value_transaction_2_bps)
- `exec.swap_quote` (read, data_transaction_0_bps)
- `exec.swap_simulate` (read, data_transaction_0_bps)
- `exec.route_compare` (read, data_transaction_0_bps)
- `exec.route_best` (value, external_value_transaction_2_bps)
- `exec.route_execute` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
