# toreva_skill_options

## When to use

Use this skill to inspect Toreva primitives in the Options family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "options"`
- Taxonomy access point: `taxonomy://primitive-family/options`
- Primary venue/provider: `psyoptions-psyfi`
- Secondary/watchlist: `none`

## Primitive entries

- `exec.options_buy` (value, external_value_transaction_2_bps)
- `exec.options_sell` (value, external_value_transaction_2_bps)
- `exec.options_close` (value, external_value_transaction_2_bps)
- `exec.options_exercise` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
