# toreva_skill_wallet_session_funding

## When to use

Use this skill to inspect Toreva primitives in the Wallet, session, and funding control family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "wallet_session_funding"`
- Taxonomy access point: `taxonomy://primitive-family/wallet_session_funding`
- Primary venue/provider: `swig`
- Secondary/watchlist: `native-solana-wallets`, `spl-token`

## Primitive entries

- `exec.wallet_establish` (authority, control_or_authority_gated) -> `toreva_establish`
- `exec.wallet_fund` (authority, control_or_authority_gated)
- `exec.wallet_withdraw` (authority, control_or_authority_gated)
- `exec.agent_wallet_create` (authority, control_or_authority_gated)
- `exec.agent_wallet_bind` (authority, control_or_authority_gated)
- `exec.agent_wallet_revoke` (authority, control_or_authority_gated)
- `exec.session_grant` (authority, control_or_authority_gated)
- `exec.session_revoke` (authority, control_or_authority_gated)
- `exec.fee_sponsor_quote` (read, data_transaction_0_bps)
- `exec.fee_sponsor_authorize` (authority, control_or_authority_gated)
- `exec.transaction_build` (authority, control_or_authority_gated)
- `exec.transaction_submit` (authority, control_or_authority_gated)
- `exec.transaction_status` (read, data_transaction_0_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
