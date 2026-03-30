# toreva kit

Non-custodial execution primitives for Solana.  
Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade.  
1 bps to open. Everything else is free.

Your agent decides. Toreva executes. Every action receipted.

## Install

```bash
npm install @toreva/sdk
npm install -g @toreva/cli
npx @smithery/cli install toreva/kit
```

## Perps tools

| Tool | Fee | What it does |
| --- | --- | --- |
| `toreva_perps_long` | 1 bps | Open long — routes to better fill |
| `toreva_perps_short` | 1 bps | Open short — routes to better fill |
| `toreva_perps_close` | Free | Close position at venue |
| `toreva_perps_add_margin` | Free | Add margin |
| `toreva_perps_remove_margin` | Free | Remove margin |
| `toreva_perps_cancel_order` | Free | Cancel order |
| `toreva_perps_funding_settle` | Free | Settle funding |
| `toreva_perps_simulate` | Free | Preview before execution |
| `toreva_perps_explain` | Free | Explain trade or position |
| `toreva_perps_query_*` | Free | Position, funding, venues, markets |

## Venues

| Venue | Fee | Model |
| --- | --- | --- |
| Jupiter Perps | 6.0 bps flat | Oracle-based |
| Pacifica | 4.0 bps (Tier 1) | Order book variant |
| Drift Protocol | 3.5 bps taker | Order book |
| Flash Trade | 4.0 bps (Tier 1) | Order book variant |

Trades routed to Drift via toreva receive a 5% fee discount.

## Strategy tools

| Tool | What it does |
| --- | --- |
| `toreva_strategies` | Browse strategy catalog with pricing |
| `toreva_earn` | Deploy USDC to yield across venues |
| `toreva_scan` | Survey portfolio state |
| `toreva_simulate` | Dry-run without execution |
| `toreva_execute` | Execute a strategy |
| `toreva_explain` | Narrate what happened |
| `toreva_configure` | Adjust settings |

## Packages

| Package | What |
| --- | --- |
| `@toreva/sdk` | TypeScript client library |
| `@toreva/cli` | Command-line interface |
| `@toreva/mcp` | MCP server for agent integration |
| `@toreva/types` | Shared schemas and types |

## Regulatory notice

This software provides tooling for interacting with the toreva execution service. It does not provide financial advice, investment advice, trading advice, or any other form of advice. Use of this software does not create a fiduciary relationship, advisory relationship, or any other professional relationship between you and Toreva Pty Ltd.

Toreva Pty Ltd is not responsible for any modifications made to this software by third parties, including modifications that alter or remove compliance language, disclaimers, or risk warnings. If you use a modified version of this software, you do so at your own risk and are responsible for ensuring your use complies with applicable law.

## License

MIT — see [LICENSE](./LICENSE)
