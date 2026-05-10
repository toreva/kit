# toreva_skill_vault

## When to use

Use this skill to inspect Toreva primitives in the Vault infrastructure family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "vault"`
- Taxonomy access point: `taxonomy://primitive-family/vault`
- Primary venue/provider: `kamino-vaults`
- Secondary/watchlist: `marginfi-watchlist`, `kamino-variants`

## Primitive entries

- `exec.vault_deposit` (value, external_value_transaction_2_bps)
- `exec.vault_withdraw` (value, external_value_transaction_2_bps)
- `exec.vault_harvest` (value, external_value_transaction_2_bps)
- `exec.escape` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
