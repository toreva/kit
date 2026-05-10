# toreva_skill_prediction_markets

## When to use

Use this skill to inspect Toreva primitives in the Prediction markets family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "prediction_markets"`
- Taxonomy access point: `taxonomy://primitive-family/prediction_markets`
- Primary venue/provider: `depredict`
- Secondary/watchlist: `solpreds-watchlist`, `dflow-watchlist`

## Primitive entries

- `exec.prediction_market_query` (read, data_transaction_0_bps)
- `exec.prediction_position_query` (read, data_transaction_0_bps)
- `exec.prediction_buy` (value, external_value_transaction_2_bps)
- `exec.prediction_sell` (value, external_value_transaction_2_bps)
- `exec.prediction_cancel_order` (value, external_value_transaction_2_bps)
- `exec.prediction_redeem` (value, external_value_transaction_2_bps)
- `exec.prediction_settle` (value, external_value_transaction_2_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
