# @toreva/sdk

MCP-native Solana primitive platform — TypeScript SDK.

> **Truthfulness rule.** This README is generated against the gateway's
> [operational definition-of-done matrix](https://github.com/toreva/gateway/blob/main/docs/operational-definition-of-done-matrix.v1.md).
> Every row maps to live evidence in that matrix. If a primitive is not in
> the table, it does not exist. If it says `DISCOVERY_ONLY`, the SDK call
> throws — by design — until the underlying admission gates close.

## Install

```bash
pnpm add @toreva/sdk
# or
npm install @toreva/sdk
```

## Quick start (R1 — read-only)

```ts
import { earnCompare, tokenReceive } from '@toreva/sdk';

// Compare current Kamino USDC lending APY (calls live mcp.toreva.com)
const r = await earnCompare({ asset: 'USDC', venue: 'kamino' });
console.log(r.apyPct, r.evidenceRef.sentinelReviewReceiptId);

// Scan a wallet for recent inbound SPL token transfers
const t = await tokenReceive({ wallet: 'YOUR_WALLET_PUBKEY', limit: 10 });
console.log(t.count, t.receives[0]?.signature);
```

Default endpoint is `https://mcp.toreva.com`. Override with `mcpUrl` or set
`TOREVA_API_KEY` (defaults to a public synthetic litmus key for read-only).

## Per-family operational matrix (live state)

Source of truth: gateway `docs/operational-definition-of-done-matrix.v1.md`.
Last regenerated: 2026-05-10.

| Family                    | Tier | SDK status                        | Notes                                                           |
| ------------------------- | ---- | --------------------------------- | --------------------------------------------------------------- |
| earn_lending              | T1→T2| `earnCompare` (read-only, R1)     | Kamino + Marginfi USDC compare live on mcp.toreva.com           |
| token_ops                 | T1→T2| `tokenReceive` (read-only, R1)    | SPL token receive scan live on mcp.toreva.com                   |
| perps                     | T0   | DISCOVERY_ONLY                    | SDK throws on call. Execution lands in R3.                      |
| options                   | T0   | NOT YET OPERATIONAL               | No venue admitted.                                              |
| swap_route                | T0   | NOT YET OPERATIONAL               | Jupiter venue plan only.                                        |
| advanced_orders_dca       | T0   | NOT YET OPERATIONAL               | Jupiter venue plan only.                                        |
| wallet_session_funding    | T0   | NOT YET OPERATIONAL               | No venue admitted.                                              |
| commerce_billing          | T0   | NOT YET OPERATIONAL               | Solana Pay venue plan only.                                     |
| staking                   | T0   | NOT YET OPERATIONAL               | Jito venue plan only.                                           |
| prediction_markets        | T0   | NOT YET OPERATIONAL               | DePredict venue plan only.                                      |
| nft                       | T0   | NOT YET OPERATIONAL               | No venue admitted.                                              |
| governance                | T0   | NOT YET OPERATIONAL               | Realms venue plan only.                                         |
| claims                    | T0   | NOT YET OPERATIONAL               | No venue admitted.                                              |
| vault                     | T0   | NOT YET OPERATIONAL               | Kamino-vaults venue plan only.                                  |
| lp_liquidity              | T0   | NOT YET OPERATIONAL               | Orca-whirlpools venue plan only.                                |
| bridge_wrap               | T0   | NOT YET OPERATIONAL               | Wormhole venue plan only.                                       |
| market_data               | T0   | NOT YET OPERATIONAL               | Birdeye + Rugcheck venue plan only.                             |
| balance_simulate_compare  | T0   | NOT YET OPERATIONAL               | Jupiter feeds venue plan only.                                  |

Tier definitions:

- **T0** — catalogued only (venue plan exists; admission gates not closed)
- **T1** — venue admitted (sentinel + risk + venue intelligence all pass)
- **T2** — read-only operational (this is where R1 lands earn_lending +
  token_ops)
- **T3** — write-operational on mainnet
- **T4** — first-party + machine-marketed
- **T5** — full GREEN (all 21 actionable gates pass)

## R1 — what's live today

R1 ships exactly three primitives that pass all admission gates:

1. **`earnCompare({ asset: 'USDC', venue: 'kamino' })`** — calls
   `toreva_earn_compare_kamino` MCP tool. Returns current APY snapshot from
   DefiLlama for the Kamino USDC pool, with the evidence triple
   (`readEvidenceId`, `venueIntelligenceReceiptId`,
   `sentinelReviewReceiptId`) for downstream audit.
2. **`earnCompare({ asset: 'USDC', venue: 'marginfi' })`** — same, Marginfi
   pool.
3. **`tokenReceive({ wallet, limit })`** — calls
   `toreva_token_receive_scan` MCP tool. Returns recent inbound SPL token
   transfers for a wallet, evidence-attached.

Every other call surface throws `DISCOVERY_ONLY` or is absent from the SDK.

## R2-R5 roadmap (truthful, per-family)

R2-R5 unlock follows the per-family matrix. Each family advances tier-by-tier
as its admission gates close:

- **R2** — read-only adapters for the next 3-5 families
  (likely staking, swap_route, market_data candidates depending on venue
  intelligence ETA). Read primitives only — no signing, no state changes.
- **R3** — first write-operational family on mainnet, with first-party use
  flag and Class A canary approval. Perps execution candidate.
- **R4** — first family at full GREEN (T5) — all 21 gates closed, including
  affiliate program, brand announce, friendly-prospect feedback, treasury
  receives funds.
- **R5** — all 18 families at T5.

Live tier rollup: see gateway `pnpm tier-rollup`.

## Authentication

R1 uses bearer-token auth against `mcp.toreva.com/mcp`. Default key (public
synthetic, read-only):

```
tk_litmus_r1_synthetic_3rd_party_trading_bot_demo_only
```

Set `TOREVA_API_KEY` env var to override. Production keys are provisioned
via the IAM agent on a per-consumer basis.

## Discovery & introspection

The MCP endpoint is fully introspectable:

```bash
curl -X POST https://mcp.toreva.com/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

`GET https://mcp.toreva.com/health` returns the service banner with the
list of admitted primitives.

## Why MCP-native

Toreva is built for AI agents first. Every primitive is exposed as an MCP
tool that any MCP-aware client (Claude Desktop, Cursor, OpenClaw) can call.
The SDK is a typed wrapper around those tools — same wire format, stronger
ergonomics for TypeScript apps.

## License

MIT.
