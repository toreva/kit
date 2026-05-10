# toreva_skill_commerce_billing

## When to use

Use this skill to inspect Toreva primitives in the Commerce and billing family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "commerce_billing"`
- Taxonomy access point: `taxonomy://primitive-family/commerce_billing`
- Primary venue/provider: `solana-pay+spl-stablecoin-rails`
- Secondary/watchlist: `mpp-watchlist`, `x402-watchlist`

## Primitive entries

- `exec.checkout_create` (value, external_value_transaction_2_bps)
- `exec.checkout_expire` (value, external_value_transaction_2_bps)
- `exec.payment_authorize` (value, external_value_transaction_2_bps)
- `exec.payment_capture` (value, external_value_transaction_2_bps)
- `exec.payment_cancel` (value, external_value_transaction_2_bps)
- `exec.payment_refund` (value, external_value_transaction_2_bps)
- `exec.invoice_create` (value, external_value_transaction_2_bps)
- `exec.invoice_send` (value, external_value_transaction_2_bps)
- `exec.invoice_pay` (value, external_value_transaction_2_bps)
- `exec.invoice_void` (value, external_value_transaction_2_bps)
- `exec.subscription_create` (value, external_value_transaction_2_bps)
- `exec.subscription_update` (value, external_value_transaction_2_bps)
- `exec.subscription_cancel` (value, external_value_transaction_2_bps)
- `exec.subscription_resume` (value, external_value_transaction_2_bps)
- `exec.transfer_split` (value, external_value_transaction_2_bps)
- `exec.transfer_reverse` (value, external_value_transaction_2_bps)
- `exec.payout_create` (value, external_value_transaction_2_bps)
- `exec.payout_reverse` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
