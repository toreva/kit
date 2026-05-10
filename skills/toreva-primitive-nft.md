# toreva_skill_nft

## When to use

Use this skill to inspect Toreva primitives in the NFTs and tokenized objects family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "nft"`
- Taxonomy access point: `taxonomy://primitive-family/nft`
- Primary venue/provider: `magic-eden-or-tensor-pending-venue-intelligence`
- Secondary/watchlist: `magic-eden`, `tensor`

## Primitive entries

- `exec.nft_buy` (value, external_value_transaction_2_bps)
- `exec.nft_sell` (value, external_value_transaction_2_bps)
- `exec.nft_list` (value, external_value_transaction_2_bps)
- `exec.nft_delist` (value, external_value_transaction_2_bps)
- `exec.nft_transfer` (value, external_value_transaction_2_bps)
- `exec.nft_bid` (value, external_value_transaction_2_bps)
- `exec.nft_sweep` (value, external_value_transaction_2_bps)
- `exec.nft_collection_create` (value, external_value_transaction_2_bps)
- `exec.nft_mint` (admin, control_or_authority_gated)
- `exec.nft_accept_bid` (value, external_value_transaction_2_bps)
- `exec.nft_metadata_update` (admin, control_or_authority_gated)
- `exec.nft_burn` (admin, control_or_authority_gated)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
