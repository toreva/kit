# toreva-earn

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps to open. Everything else is free.

Use this skill to scan, compare, and deploy idle USDC into yield positions across supported venues.

**Operations**

- `scan` — survey current USDC yield positions
- `simulate` — preview expected yield before execution
- `execute` — deploy USDC to the selected venue

**Supported venues**

| Venue | Asset |
| --- | --- |
| Kamino Finance | USDC |
| Marginfi | USDC |

**Read-only compare** — use `toreva earn-compare` in the CLI or call `toreva_earn`
with `operation: scan` to compare live APYs before committing capital.

Every execution returns a receipt triple: a read-evidence ID, a
venue-intelligence receipt, and a sentinel review receipt.

Execution only — not financial advice.
