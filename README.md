<!-- BEGIN TOREVA GITHUB LOGO -->
<p align="center">
  <a href="https://github.com/toreva">
    <img src="https://raw.githubusercontent.com/toreva/.github/main/assets/toreva-logo-cyan-dark.png" alt="Toreva" width="96">
  </a>
</p>
<!-- END TOREVA GITHUB LOGO -->

# toreva kit

Policy-checked Solana wallet actions for MCP clients.

Users set the limits. Toreva reads, simulates, prepares unsigned transactions,
explains, and receipts every outcome. The user signs elsewhere.

No money moves through this connector.

## Establish your wallet

Use `toreva_establish_agent_wallet` to set up an agent wallet with hard limits.
Your main wallet stays the root owner. Toreva does not hold a private key or a
key share. Every setup returns a receipt.

```bash
toreva_establish_agent_wallet({
  human_wallet_address: "your-wallet-address",
  policy_bounds: {
    daily_notional_lamports: 1000000,
    operations_per_day: 3,
    cooldown_seconds: 60,
    risk_tier_ceiling: "low",
    allowed_operations: ["read", "scan", "simulate", "prepare_unsigned_transaction"],
    valid_until: null
  }
})
```

## MCP Tools

| Tool | What it does |
| --- | --- |
| `toreva_establish_agent_wallet` | Create the agent wallet with hard limits |
| `toreva_read_or_scan` | Read or scan a main wallet or agent wallet |
| `toreva_simulate_action` | Test an action before anything is prepared |
| `toreva_prepare_unsigned_transaction` | Prepare an unsigned transaction after simulation |
| `toreva_explain_action` | Explain an action or receipt |
| `toreva_get_receipt` | Fetch one receipt |
| `toreva_refuse_action` | Refuse an unsafe action and return a refusal receipt |

## Install

The local package runs over stdio. Install and run it yourself:

```bash
npm install -g @toreva/mcp
RELAY_AUTH_TOKEN=your_token toreva-mcp
```

For local development:

```bash
pnpm install
pnpm --filter @toreva/mcp build
RELAY_AUTH_TOKEN=your_token node packages/mcp/dist/index.js
```

## Package

`@toreva/mcp` is the Rung-1 MCP package. Version `0.2.0` is stdio-local only.

The public metadata is `server.json` and `packages/mcp/package.json`.

## Packages

| Package | What |
| --- | --- |
| `@toreva/mcp` | MCP server for agent integration |
| `@toreva/types` | Shared schemas and types |
| `@toreva/sdk` | TypeScript client library |
| `@toreva/cli` | Command-line interface |

## Verify

```bash
pnpm test
pnpm --filter @toreva/mcp build
```

## Regulatory notice

This software provides tooling for interacting with the Toreva policy service.
It does not provide financial advice, investment advice, trading advice, or any
other form of advice. Use of this software does not create a fiduciary
relationship, advisory relationship, or any other professional relationship
between you and Toreva Pty Ltd.

Toreva Pty Ltd is not responsible for modifications made to this software by
third parties, including modifications that alter or remove compliance language,
disclaimers, or risk warnings. If you use a modified version of this software,
you do so at your own risk and are responsible for ensuring your use complies
with applicable law.

## License

MIT — see [LICENSE](./LICENSE)
