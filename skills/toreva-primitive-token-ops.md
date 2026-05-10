# toreva_skill_token_ops

## When to use

Use this skill to inspect Toreva primitives in the Basic commerce, token operations, issuance, and admin family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "token_ops"`
- Taxonomy access point: `taxonomy://primitive-family/token_ops`
- Primary venue/provider: `spl-token+system-program`
- Secondary/watchlist: `token-2022`

## Primitive entries

- `exec.send` (value, external_value_transaction_2_bps)
- `exec.receive` (read, data_transaction_0_bps)
- `exec.transfer` (value, external_value_transaction_2_bps)
- `exec.token_approve` (authority, control_or_authority_gated)
- `exec.token_revoke` (authority, control_or_authority_gated)
- `exec.token_deploy` (value, external_value_transaction_2_bps)
- `exec.token_mint` (admin, control_or_authority_gated)
- `exec.token_burn` (admin, control_or_authority_gated)
- `exec.token_freeze` (admin, control_or_authority_gated)
- `exec.token_thaw` (admin, control_or_authority_gated)
- `exec.token_metadata_update` (admin, control_or_authority_gated)
- `exec.token_authority_transfer` (authority, control_or_authority_gated)
- `exec.token_account_create` (value, external_value_transaction_2_bps)
- `exec.token_account_close` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
