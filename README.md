<!-- BEGIN TOREVA GITHUB LOGO -->
<p align="center">
  <a href="https://github.com/toreva">
    <img src="https://raw.githubusercontent.com/toreva/.github/main/assets/toreva-logo-cyan-dark.png" alt="Toreva" width="96">
  </a>
</p>
<!-- END TOREVA GITHUB LOGO -->

# toreva kit

Non-custodial execution primitives for Solana.  
Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade.  
1 bps to open. Everything else is free.

Your agent decides. Toreva executes. Every action receipted.

## Establish your wallet

Use `toreva_establish` to attach a policy-controlled delegated authority to
your Solana wallet. Your wallet stays the root owner — Toreva creates a bounded
session key that enforces spend caps, allowed-token constraints, and revocation
policy. Non-custodial: Toreva never holds private key material. Every
establishment is receipted.

```bash
# Minimum — attach delegated authority to your wallet
toreva_establish({ walletAddress: "your-wallet-address" })
```

Once established, your agent can execute across all supported primitives —
earn, perps, and more — without re-authenticating for each operation.

## Earn

Deploy idle USDC to yield across supported venues with `toreva_earn`. Scan,
compare, and execute from a single tool.

```bash
npx toreva earn-compare --asset USDC --venue kamino
npx toreva earn-compare --asset USDC --venue marginfi
```

| Venue | Asset |
| --- | --- |
| Kamino Finance | USDC |
| Marginfi | USDC |

Every earn execution returns a read-evidence receipt, a venue-intelligence
receipt, and a sentinel review receipt.

## Install

The fastest path — wires Toreva into your MCP-aware client (Claude
Desktop, OpenClaw, Cursor) and authenticates you in two commands:

```bash
npx toreva init --client=claude-desktop   # or openclaw | cursor
npx toreva login
```

`toreva init` writes the Toreva MCP server stanza into your client's
config file. `toreva login` runs the gateway's device-code flow and
stores the resulting token at `~/.config/toreva/config.json` (chmod
600).

Restart your MCP client and verify:

```bash
npx toreva doctor
```

You should see three `[ OK ]` lines: `config_present`, `auth_token`,
`mcp_call`.

Per-client snippets live in [`examples/`](./examples/) — one folder per
supported client (`claude-desktop`, `openclaw`, `cursor`).

### Direct package installs (advanced)

```bash
npm install @toreva/sdk        # TypeScript client library
npm install -g @toreva/cli     # global `toreva` binary
```

### MCP server (stdio, run-it-yourself)

```bash
TOREVA_AUTH_TOKEN=your_token npx @toreva/mcp
```

### MCP server (remote, no install)

```
https://mcp.toreva.com
```

## Authentication

`toreva login` is the standard path. For CI / power users, set
`TOREVA_AUTH_TOKEN` directly to skip the device-code flow:

```bash
export TOREVA_AUTH_TOKEN=your_token
npx toreva login   # writes the token to ~/.config/toreva/config.json
```

Use `toreva login` for the standard device-code flow, or request an integration
token from your Toreva contact. The Kit repository is the public source of
truth for agent, SDK, CLI, Skills, and MCP integration details.

### Environment variables

| Var | Default | Purpose |
| --- | --- | --- |
| `TOREVA_MCP_URL` | `https://mcp.toreva.com` | Gateway URL |
| `TOREVA_AUTH_TOKEN` | — | Skip device-code flow, persist this token |
| `TOREVA_CONFIG_DIR` | `~/.config/toreva` | Override on-disk config dir |

## Perps tools

Run `toreva_establish` first to attach a delegated authority before execution.
For best fill, omit `venue` — Toreva compares enabled venues and routes by
estimated all-in cost. Set `venue` only when you intentionally want a specific
venue. Perps tools use fields: `walletAddress`, `token`, `sizeUsd`, `leverage`,
`collateralToken`, and `collateralAmount`.

The public integration packet lives in this repo:

- [Agentic perps integration patterns](./docs/agentic-perps-integration-patterns.md)
- [OpenAPI-style relay examples](./docs/toreva-perps.openapi.json)
- [Claude Code agent prompt](./docs/claude-code-agent-prompt.md)

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
| `toreva_establish` | Attach a delegated agent authority and child capabilities to a wallet |
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
