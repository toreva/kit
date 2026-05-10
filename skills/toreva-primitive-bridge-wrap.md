# toreva_skill_bridge_wrap

## When to use

Use this skill to inspect Toreva primitives in the Bridge, wrap, and unwrap family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "bridge_wrap"`
- Taxonomy access point: `taxonomy://primitive-family/bridge_wrap`
- Primary venue/provider: `wormhole`
- Secondary/watchlist: `mayan-watchlist`, `debridge-watchlist`

## Primitive entries

- `exec.wrap` (value, external_value_transaction_2_bps)
- `exec.unwrap` (value, external_value_transaction_2_bps)
- `exec.bridge` (value, external_value_transaction_2_bps)
- `exec.bridge_quote` (read, data_transaction_0_bps)
- `exec.bridge_simulate` (read, data_transaction_0_bps)
- `exec.bridge_claim` (value, external_value_transaction_2_bps)
- `exec.bridge_refund` (value, external_value_transaction_2_bps)
- `exec.bridge_status` (read, data_transaction_0_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
