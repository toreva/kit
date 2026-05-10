# toreva_skill_market_data

## When to use

Use this skill to inspect Toreva primitives in the Market data, discovery, and safety reads family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "market_data"`
- Taxonomy access point: `taxonomy://primitive-family/market_data`
- Primary venue/provider: `birdeye+rugcheck`
- Secondary/watchlist: `dexscreener`, `jupiter`, `pyth`

## Primitive entries

- `exec.token_info_query` (read, data_transaction_0_bps)
- `exec.price_query` (read, data_transaction_0_bps)
- `exec.market_trending_query` (read, data_transaction_0_bps)
- `exec.rug_check` (read, data_transaction_0_bps)
- `exec.venue_health_query` (read, data_transaction_0_bps)
- `exec.fee_estimate` (read, data_transaction_0_bps)
- `exec.webhook_register` (read, data_transaction_0_bps)
- `exec.name_resolve` (read, data_transaction_0_bps)
- `exec.name_register` (read, data_transaction_0_bps)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
