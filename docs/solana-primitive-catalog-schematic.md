# Solana Primitive Catalog Schematic

> Generated from Gateway primitive metadata. This schematic is discovery and taxonomy, not operational evidence.

```mermaid
flowchart LR
  MCP["MCP tool: toreva_primitives"]
  API["Gateway discovery: /primitive-catalog"]
  KIT["Kit docs + Skills"]
  MCP --> API
  API --> KIT
  KIT --> earn_lending["Earn / lending<br/>16 primitives<br/>toreva_skill_earn_lending"]
  earn_lending --> earn_lending_venue["kamino"]
  KIT --> perps["Perpetual futures<br/>14 primitives<br/>toreva_skill_perps"]
  perps --> perps_venue["pacifica"]
  KIT --> options["Options<br/>4 primitives<br/>toreva_skill_options"]
  options --> options_venue["psyoptions-psyfi"]
  KIT --> swap_route["Basic trade, swap, and routing<br/>9 primitives<br/>toreva_skill_swap_route"]
  swap_route --> swap_route_venue["jupiter"]
  KIT --> advanced_orders_dca["Advanced orders and DCA<br/>7 primitives<br/>toreva_skill_advanced_orders_dca"]
  advanced_orders_dca --> advanced_orders_dca_venue["jupiter"]
  KIT --> token_ops["Basic commerce, token operations, issuance, and admin<br/>14 primitives<br/>toreva_skill_token_ops"]
  token_ops --> token_ops_venue["spl-token+system-program"]
  KIT --> wallet_session_funding["Wallet, session, and funding control<br/>13 primitives<br/>toreva_skill_wallet_session_funding"]
  wallet_session_funding --> wallet_session_funding_venue["swig"]
  KIT --> commerce_billing["Commerce and billing<br/>18 primitives<br/>toreva_skill_commerce_billing"]
  commerce_billing --> commerce_billing_venue["solana-pay+spl-stablecoin-rails"]
  KIT --> staking["Staking<br/>12 primitives<br/>toreva_skill_staking"]
  staking --> staking_venue["jito"]
  KIT --> prediction_markets["Prediction markets<br/>7 primitives<br/>toreva_skill_prediction_markets"]
  prediction_markets --> prediction_markets_venue["depredict"]
  KIT --> nft["NFTs and tokenized objects<br/>12 primitives<br/>toreva_skill_nft"]
  nft --> nft_venue["magic-eden-or-tensor-pending-venue-intelligence"]
  KIT --> governance["DAO and governance<br/>8 primitives<br/>toreva_skill_governance"]
  governance --> governance_venue["realms-spl-governance"]
  KIT --> claims["Claims and airdrops<br/>5 primitives<br/>toreva_skill_claims_airdrops"]
  claims --> claims_venue["solana-merkle-distributor-pattern"]
  KIT --> vault["Vault infrastructure<br/>4 primitives<br/>toreva_skill_vault"]
  vault --> vault_venue["kamino-vaults"]
  KIT --> lp_liquidity["Liquidity provision<br/>5 primitives<br/>toreva_skill_lp_liquidity"]
  lp_liquidity --> lp_liquidity_venue["orca-whirlpools"]
  KIT --> bridge_wrap["Bridge, wrap, and unwrap<br/>8 primitives<br/>toreva_skill_bridge_wrap"]
  bridge_wrap --> bridge_wrap_venue["wormhole"]
  KIT --> market_data["Market data, discovery, and safety reads<br/>9 primitives<br/>toreva_skill_market_data"]
  market_data --> market_data_venue["birdeye+rugcheck"]
  KIT --> balance_simulate_compare["Balance, simulate, and compare<br/>3 primitives<br/>toreva_skill_balance_simulate_compare"]
  balance_simulate_compare --> balance_simulate_compare_venue["jupiter+venue-sol-feeds"]
```

## Counts

- Executable/supporting primitive entries: `168`
- Families: `18`
- Composition vocabulary terms: `45`

## Claim Boundary

This is the full planning/discovery universe. It is not an operational or battle-tested claim; check readiness, greenState, and publicExecutable per primitive. Composition layers are vocabulary controls, not standalone execution proof.

