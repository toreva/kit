# toreva-establish-wallet

Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps to open. Everything else is free.

Use `toreva_establish` to attach a policy-controlled delegated authority to a
Solana wallet before execution. The wallet holder remains the root owner; Toreva
creates a bounded session key constrained by spend caps, allowed-token lists, and
expiry policy. Non-custodial: Toreva never holds private key material. Every
establishment is receipted and revocable.

**Minimum call**

Provide `walletAddress`. Capabilities and authority options are optional and
default to a safe base policy.

**With earn**

After establishment, use `toreva_earn` to deploy USDC yield across Kamino and
Marginfi without repeated authority setup.

**With perps**

For agents that need a separate on-curve signer (Pacifica REST orders require
an Ed25519 signer), pass a capability for the venue. The recommended pattern:

```text
human wallet
  -> Toreva delegated authority
  -> perps child capability
  -> Pacifica API agent wallet if Pacifica is selected
```

The human wallet remains root owner. The Pacifica API agent wallet is a
venue-specific child signer governed by Toreva policy and revocable at any time.

For open-long/open-short, omit `venue` unless the user explicitly requests one.
Toreva compares enabled venues and routes by estimated all-in cost.

Use Gateway MCP fields: `walletAddress` for the human wallet; for opens use
`token`, `sizeUsd`, `leverage`, `collateralToken`, and `collateralAmount`.

Execution only — not financial advice.
