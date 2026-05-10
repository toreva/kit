# Solana Primitive Metadata Dictionary

> Generated from Gateway primitive metadata. Do not edit by hand.

This is the full planning/discovery universe. It is not an operational or battle-tested claim; check readiness, greenState, and publicExecutable per primitive. Composition layers are vocabulary controls, not standalone execution proof.

- Schema: `toreva.primitive-metadata.v1`
- MCP catalog tool: `toreva_primitives`
- Executable/supporting primitives: `168`
- Primitive families: `18`
- Composition vocabulary terms: `45`

Every value-moving primitive needs a primary venue/provider before execution. A venue listed here is an integration target, not battle-tested evidence.

## Family Index

| Family | Count | Skill access point | Primary venue/provider | Readiness |
| --- | ---: | --- | --- | --- |
| Earn / lending | 16 | `toreva_skill_earn_lending` | kamino | `canonical` |
| Perpetual futures | 14 | `toreva_skill_perps` | pacifica | `integration_ready` |
| Options | 4 | `toreva_skill_options` | psyoptions-psyfi | `proposed` |
| Basic trade, swap, and routing | 9 | `toreva_skill_swap_route` | jupiter | `canonical` |
| Advanced orders and DCA | 7 | `toreva_skill_advanced_orders_dca` | jupiter | `canonical` |
| Basic commerce, token operations, issuance, and admin | 14 | `toreva_skill_token_ops` | spl-token+system-program | `canonical` |
| Wallet, session, and funding control | 13 | `toreva_skill_wallet_session_funding` | swig | `canonical` |
| Commerce and billing | 18 | `toreva_skill_commerce_billing` | solana-pay+spl-stablecoin-rails | `canonical` |
| Staking | 12 | `toreva_skill_staking` | jito | `canonical` |
| Prediction markets | 7 | `toreva_skill_prediction_markets` | depredict | `canonical` |
| NFTs and tokenized objects | 12 | `toreva_skill_nft` | magic-eden-or-tensor-pending-venue-intelligence | `proposed` |
| DAO and governance | 8 | `toreva_skill_governance` | realms-spl-governance | `proposed` |
| Claims and airdrops | 5 | `toreva_skill_claims_airdrops` | solana-merkle-distributor-pattern | `proposed` |
| Vault infrastructure | 4 | `toreva_skill_vault` | kamino-vaults | `canonical` |
| Liquidity provision | 5 | `toreva_skill_lp_liquidity` | orca-whirlpools | `proposed` |
| Bridge, wrap, and unwrap | 8 | `toreva_skill_bridge_wrap` | wormhole | `proposed` |
| Market data, discovery, and safety reads | 9 | `toreva_skill_market_data` | birdeye+rugcheck | `canonical` |
| Balance, simulate, and compare | 3 | `toreva_skill_balance_simulate_compare` | jupiter+venue-sol-feeds | `canonical` |

## Earn / lending

- Family id: `earn_lending`
- Taxonomy access: `taxonomy://primitive-family/earn_lending`
- Skill access: `toreva_skill_earn_lending`
- Kit skill: `skills/toreva-primitive-earn-lending.md`
- Primary venue/provider: `kamino`
- Secondary/watchlist: `marginfi`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.deposit_usdc_kamino` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.withdraw_usdc_kamino` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.deposit_usdc_marginfi` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.withdraw_usdc_marginfi` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.lend` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.withdraw` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.borrow` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.repay` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.collateral_add` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.collateral_remove` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.liquidate` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `current_ia_execution_catalog` |
| `exec.earn_compare` | `yield.compare`, `earn.compare` | `read` | `data_transaction_0_bps` | `false` | `toreva_earn` | kamino | `candidate_gap_map` |
| `exec.earn_deposit` | `earn.deposit` | `value` | `external_value_transaction_2_bps` | `false` | `toreva_earn` | kamino | `candidate_gap_map` |
| `exec.earn_withdraw` | `earn.withdraw` | `value` | `external_value_transaction_2_bps` | `false` | `toreva_earn` | kamino | `candidate_gap_map` |
| `exec.yield_claim` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `candidate_gap_map` |
| `exec.yield_harvest` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino | `candidate_gap_map` |

## Perpetual futures

- Family id: `perps`
- Taxonomy access: `taxonomy://primitive-family/perps`
- Skill access: `toreva_skill_perps`
- Kit skill: `skills/toreva-primitive-perps.md`
- Primary venue/provider: `pacifica`
- Secondary/watchlist: `drift-watchlist`
- Readiness: `integration_ready`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.perps_long` |  | `value` | `external_value_transaction_2_bps` | `true` | `toreva_perps_long` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_short` |  | `value` | `external_value_transaction_2_bps` | `true` | `toreva_perps_short` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_close` |  | `value` | `external_value_transaction_2_bps` | `true` | `toreva_perps_close` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_add_margin` |  | `value` | `external_value_transaction_2_bps` | `true` | `toreva_perps_add_margin` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_remove_margin` |  | `value` | `external_value_transaction_2_bps` | `true` | `toreva_perps_remove_margin` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_cancel_order` |  | `value` | `external_value_transaction_2_bps` | `true` | `toreva_perps_cancel_order` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_funding_settle` |  | `value` | `external_value_transaction_2_bps` | `true` | `toreva_perps_funding_settle` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_submit_signed` |  | `value` | `external_value_transaction_2_bps` | `false` |  | pacifica | `current_ia_execution_catalog` |
| `exec.perps_query_position` |  | `read` | `data_transaction_0_bps` | `true` | `toreva_perps_query_position` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_query_funding` |  | `read` | `data_transaction_0_bps` | `true` | `toreva_perps_query_funding` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_query_venues` |  | `read` | `data_transaction_0_bps` | `true` | `toreva_perps_query_venues` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_query_markets` |  | `read` | `data_transaction_0_bps` | `true` | `toreva_perps_query_markets` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_simulate` |  | `read` | `data_transaction_0_bps` | `true` | `toreva_perps_simulate` | pacifica | `current_ia_execution_catalog` |
| `exec.perps_explain` |  | `read` | `data_transaction_0_bps` | `true` | `toreva_perps_explain` | pacifica | `current_ia_execution_catalog` |

## Options

- Family id: `options`
- Taxonomy access: `taxonomy://primitive-family/options`
- Skill access: `toreva_skill_options`
- Kit skill: `skills/toreva-primitive-options.md`
- Primary venue/provider: `psyoptions-psyfi`
- Secondary/watchlist: `none`
- Readiness: `proposed`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.options_buy` | `options.buy` | `value` | `external_value_transaction_2_bps` | `false` |  | psyoptions-psyfi | `current_ia_execution_catalog` |
| `exec.options_sell` | `options.sell` | `value` | `external_value_transaction_2_bps` | `false` |  | psyoptions-psyfi | `current_ia_execution_catalog` |
| `exec.options_close` | `options.close` | `value` | `external_value_transaction_2_bps` | `false` |  | psyoptions-psyfi | `current_ia_execution_catalog` |
| `exec.options_exercise` |  | `value` | `external_value_transaction_2_bps` | `false` |  | psyoptions-psyfi | `current_ia_execution_catalog` |

## Basic trade, swap, and routing

- Family id: `swap_route`
- Taxonomy access: `taxonomy://primitive-family/swap_route`
- Skill access: `toreva_skill_swap_route`
- Kit skill: `skills/toreva-primitive-swap-route.md`
- Primary venue/provider: `jupiter`
- Secondary/watchlist: `orca-via-jupiter`, `raydium-via-jupiter`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.swap` | `basic_trade.swap`, `trade.swap` | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `current_ia_execution_catalog` |
| `exec.multi_swap` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `current_ia_execution_catalog` |
| `exec.buy` | `basic_trade.buy`, `trade.buy`, `swap.buy` | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.sell` | `basic_trade.sell`, `trade.sell`, `swap.sell` | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.swap_quote` |  | `read` | `data_transaction_0_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.swap_simulate` |  | `read` | `data_transaction_0_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.route_compare` |  | `read` | `data_transaction_0_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.route_best` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.route_execute` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `candidate_gap_map` |

## Advanced orders and DCA

- Family id: `advanced_orders_dca`
- Taxonomy access: `taxonomy://primitive-family/advanced_orders_dca`
- Skill access: `toreva_skill_advanced_orders_dca`
- Kit skill: `skills/toreva-primitive-advanced-orders-dca.md`
- Primary venue/provider: `jupiter`
- Secondary/watchlist: `phoenix-watchlist`, `openbook-watchlist`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.dca_create` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `current_ia_execution_catalog` |
| `exec.dca_cancel` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `current_ia_execution_catalog` |
| `exec.limit_order_create` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.limit_order_cancel` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.order_cancel` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.order_status` |  | `read` | `data_transaction_0_bps` | `false` |  | jupiter | `candidate_gap_map` |
| `exec.order_batch_cancel` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jupiter | `candidate_gap_map` |

## Basic commerce, token operations, issuance, and admin

- Family id: `token_ops`
- Taxonomy access: `taxonomy://primitive-family/token_ops`
- Skill access: `toreva_skill_token_ops`
- Kit skill: `skills/toreva-primitive-token-ops.md`
- Primary venue/provider: `spl-token+system-program`
- Secondary/watchlist: `token-2022`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.send` | `basic_commerce.send`, `payment.send` | `value` | `external_value_transaction_2_bps` | `false` |  | spl-token+system-program | `current_ia_execution_catalog` |
| `exec.receive` | `basic_commerce.receive`, `payment.receive` | `read` | `data_transaction_0_bps` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.transfer` | `basic_commerce.transfer`, `payment.transfer`, `token.transfer` | `value` | `external_value_transaction_2_bps` | `false` |  | spl-token+system-program | `current_ia_execution_catalog` |
| `exec.token_approve` |  | `authority` | `control_or_authority_gated` | `false` |  | spl-token+system-program | `current_ia_execution_catalog` |
| `exec.token_revoke` |  | `authority` | `control_or_authority_gated` | `false` |  | spl-token+system-program | `current_ia_execution_catalog` |
| `exec.token_deploy` |  | `value` | `external_value_transaction_2_bps` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.token_mint` |  | `admin` | `control_or_authority_gated` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.token_burn` |  | `admin` | `control_or_authority_gated` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.token_freeze` |  | `admin` | `control_or_authority_gated` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.token_thaw` |  | `admin` | `control_or_authority_gated` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.token_metadata_update` |  | `admin` | `control_or_authority_gated` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.token_authority_transfer` |  | `authority` | `control_or_authority_gated` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.token_account_create` |  | `value` | `external_value_transaction_2_bps` | `false` |  | spl-token+system-program | `candidate_gap_map` |
| `exec.token_account_close` |  | `value` | `external_value_transaction_2_bps` | `false` |  | spl-token+system-program | `candidate_gap_map` |

## Wallet, session, and funding control

- Family id: `wallet_session_funding`
- Taxonomy access: `taxonomy://primitive-family/wallet_session_funding`
- Skill access: `toreva_skill_wallet_session_funding`
- Kit skill: `skills/toreva-primitive-wallet-session-funding.md`
- Primary venue/provider: `swig`
- Secondary/watchlist: `native-solana-wallets`, `spl-token`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.wallet_establish` |  | `authority` | `control_or_authority_gated` | `false` | `toreva_establish` | swig | `candidate_gap_map` |
| `exec.wallet_fund` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.wallet_withdraw` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.agent_wallet_create` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.agent_wallet_bind` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.agent_wallet_revoke` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.session_grant` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.session_revoke` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.fee_sponsor_quote` |  | `read` | `data_transaction_0_bps` | `false` |  | swig | `candidate_gap_map` |
| `exec.fee_sponsor_authorize` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.transaction_build` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.transaction_submit` |  | `authority` | `control_or_authority_gated` | `false` |  | swig | `candidate_gap_map` |
| `exec.transaction_status` |  | `read` | `data_transaction_0_bps` | `false` |  | swig | `candidate_gap_map` |

## Commerce and billing

- Family id: `commerce_billing`
- Taxonomy access: `taxonomy://primitive-family/commerce_billing`
- Skill access: `toreva_skill_commerce_billing`
- Kit skill: `skills/toreva-primitive-commerce-billing.md`
- Primary venue/provider: `solana-pay+spl-stablecoin-rails`
- Secondary/watchlist: `mpp-watchlist`, `x402-watchlist`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.checkout_create` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.checkout_expire` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.payment_authorize` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.payment_capture` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.payment_cancel` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.payment_refund` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.invoice_create` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.invoice_send` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.invoice_pay` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.invoice_void` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.subscription_create` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.subscription_update` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.subscription_cancel` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.subscription_resume` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.transfer_split` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.transfer_reverse` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.payout_create` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |
| `exec.payout_reverse` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-pay+spl-stablecoin-rails | `candidate_gap_map` |

## Staking

- Family id: `staking`
- Taxonomy access: `taxonomy://primitive-family/staking`
- Skill access: `toreva_skill_staking`
- Kit skill: `skills/toreva-primitive-staking.md`
- Primary venue/provider: `jito`
- Secondary/watchlist: `marinade`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.stake_sol_marinade` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `current_ia_execution_catalog` |
| `exec.unstake_sol_marinade` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `current_ia_execution_catalog` |
| `exec.stake_sol_jito` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `current_ia_execution_catalog` |
| `exec.unstake_sol_jito` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `current_ia_execution_catalog` |
| `exec.stake` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `current_ia_execution_catalog` |
| `exec.unstake` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `current_ia_execution_catalog` |
| `exec.stake_compare` |  | `read` | `data_transaction_0_bps` | `false` |  | jito | `candidate_gap_map` |
| `exec.stake_delegate` |  | `authority` | `control_or_authority_gated` | `false` |  | jito | `candidate_gap_map` |
| `exec.stake_undelegate` |  | `authority` | `control_or_authority_gated` | `false` |  | jito | `candidate_gap_map` |
| `exec.stake_withdraw` |  | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `candidate_gap_map` |
| `exec.stake_pool_deposit` | `stake_pool.deposit` | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `candidate_gap_map` |
| `exec.stake_pool_withdraw` | `stake_pool.withdraw` | `value` | `external_value_transaction_2_bps` | `false` |  | jito | `candidate_gap_map` |

## Prediction markets

- Family id: `prediction_markets`
- Taxonomy access: `taxonomy://primitive-family/prediction_markets`
- Skill access: `toreva_skill_prediction_markets`
- Kit skill: `skills/toreva-primitive-prediction-markets.md`
- Primary venue/provider: `depredict`
- Secondary/watchlist: `solpreds-watchlist`, `dflow-watchlist`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.prediction_market_query` |  | `read` | `data_transaction_0_bps` | `false` |  | depredict | `candidate_gap_map` |
| `exec.prediction_position_query` |  | `read` | `data_transaction_0_bps` | `false` |  | depredict | `candidate_gap_map` |
| `exec.prediction_buy` |  | `value` | `external_value_transaction_2_bps` | `false` |  | depredict | `candidate_gap_map` |
| `exec.prediction_sell` |  | `value` | `external_value_transaction_2_bps` | `false` |  | depredict | `candidate_gap_map` |
| `exec.prediction_cancel_order` |  | `value` | `external_value_transaction_2_bps` | `false` |  | depredict | `candidate_gap_map` |
| `exec.prediction_redeem` |  | `value` | `external_value_transaction_2_bps` | `false` |  | depredict | `candidate_gap_map` |
| `exec.prediction_settle` |  | `value` | `external_value_transaction_2_bps` | `false` |  | depredict | `candidate_gap_map` |

## NFTs and tokenized objects

- Family id: `nft`
- Taxonomy access: `taxonomy://primitive-family/nft`
- Skill access: `toreva_skill_nft`
- Kit skill: `skills/toreva-primitive-nft.md`
- Primary venue/provider: `magic-eden-or-tensor-pending-venue-intelligence`
- Secondary/watchlist: `magic-eden`, `tensor`
- Readiness: `proposed`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.nft_buy` | `nft.buy` | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `current_ia_execution_catalog` |
| `exec.nft_sell` | `nft.sell` | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `current_ia_execution_catalog` |
| `exec.nft_list` |  | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `current_ia_execution_catalog` |
| `exec.nft_delist` |  | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `current_ia_execution_catalog` |
| `exec.nft_transfer` |  | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `current_ia_execution_catalog` |
| `exec.nft_bid` | `nft.bid` | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `current_ia_execution_catalog` |
| `exec.nft_sweep` |  | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `current_ia_execution_catalog` |
| `exec.nft_collection_create` |  | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `candidate_gap_map` |
| `exec.nft_mint` |  | `admin` | `control_or_authority_gated` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `candidate_gap_map` |
| `exec.nft_accept_bid` |  | `value` | `external_value_transaction_2_bps` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `candidate_gap_map` |
| `exec.nft_metadata_update` |  | `admin` | `control_or_authority_gated` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `candidate_gap_map` |
| `exec.nft_burn` |  | `admin` | `control_or_authority_gated` | `false` |  | magic-eden-or-tensor-pending-venue-intelligence | `candidate_gap_map` |

## DAO and governance

- Family id: `governance`
- Taxonomy access: `taxonomy://primitive-family/governance`
- Skill access: `toreva_skill_governance`
- Kit skill: `skills/toreva-primitive-governance.md`
- Primary venue/provider: `realms-spl-governance`
- Secondary/watchlist: `squads-watchlist`
- Readiness: `proposed`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.governance_vote` | `dao.vote` | `authority` | `control_or_authority_gated` | `false` |  | realms-spl-governance | `current_ia_execution_catalog` |
| `exec.governance_delegate` | `dao.delegate` | `authority` | `control_or_authority_gated` | `false` |  | realms-spl-governance | `current_ia_execution_catalog` |
| `exec.proposal_create` | `dao.proposal_create` | `authority` | `control_or_authority_gated` | `false` |  | realms-spl-governance | `current_ia_execution_catalog` |
| `exec.proposal_execute` |  | `authority` | `control_or_authority_gated` | `false` |  | realms-spl-governance | `current_ia_execution_catalog` |
| `exec.proposal_cancel` |  | `authority` | `control_or_authority_gated` | `false` |  | realms-spl-governance | `current_ia_execution_catalog` |
| `exec.governance_undelegate` |  | `authority` | `control_or_authority_gated` | `false` |  | realms-spl-governance | `candidate_gap_map` |
| `exec.governance_proposal_query` |  | `read` | `data_transaction_0_bps` | `false` |  | realms-spl-governance | `candidate_gap_map` |
| `exec.governance_treasury_transfer` |  | `authority` | `control_or_authority_gated` | `false` |  | realms-spl-governance | `candidate_gap_map` |

## Claims and airdrops

- Family id: `claims`
- Taxonomy access: `taxonomy://primitive-family/claims`
- Skill access: `toreva_skill_claims_airdrops`
- Kit skill: `skills/toreva-primitive-claims-airdrops.md`
- Primary venue/provider: `solana-merkle-distributor-pattern`
- Secondary/watchlist: `tokentable-watchlist`, `streamflow-watchlist`
- Readiness: `proposed`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.claim_rewards` |  | `value` | `external_value_transaction_2_bps` | `false` |  | solana-merkle-distributor-pattern | `current_ia_execution_catalog` |
| `exec.claim_airdrop` | `airdrop.claim` | `value` | `external_value_transaction_2_bps` | `false` |  | solana-merkle-distributor-pattern | `current_ia_execution_catalog` |
| `exec.airdrop_register` | `airdrop.register` | `value` | `external_value_transaction_2_bps` | `false` |  | solana-merkle-distributor-pattern | `current_ia_execution_catalog` |
| `exec.airdrop_interest` | `airdrop.interest` | `value` | `external_value_transaction_2_bps` | `false` |  | solana-merkle-distributor-pattern | `candidate_gap_map` |
| `exec.airdrop_screen` |  | `read` | `data_transaction_0_bps` | `false` |  | solana-merkle-distributor-pattern | `current_ia_execution_catalog` |

## Vault infrastructure

- Family id: `vault`
- Taxonomy access: `taxonomy://primitive-family/vault`
- Skill access: `toreva_skill_vault`
- Kit skill: `skills/toreva-primitive-vault.md`
- Primary venue/provider: `kamino-vaults`
- Secondary/watchlist: `marginfi-watchlist`, `kamino-variants`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.vault_deposit` | `vault.deposit` | `value` | `external_value_transaction_2_bps` | `false` |  | kamino-vaults | `candidate_gap_map` |
| `exec.vault_withdraw` | `vault.withdraw` | `value` | `external_value_transaction_2_bps` | `false` |  | kamino-vaults | `candidate_gap_map` |
| `exec.vault_harvest` | `vault.harvest` | `value` | `external_value_transaction_2_bps` | `false` |  | kamino-vaults | `current_ia_execution_catalog` |
| `exec.escape` |  | `value` | `external_value_transaction_2_bps` | `false` |  | kamino-vaults | `current_ia_execution_catalog` |

## Liquidity provision

- Family id: `lp_liquidity`
- Taxonomy access: `taxonomy://primitive-family/lp_liquidity`
- Skill access: `toreva_skill_lp_liquidity`
- Kit skill: `skills/toreva-primitive-lp-liquidity.md`
- Primary venue/provider: `orca-whirlpools`
- Secondary/watchlist: `raydium`, `meteora`
- Readiness: `proposed`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.lp_add` | `lp.add` | `value` | `external_value_transaction_2_bps` | `false` |  | orca-whirlpools | `current_ia_execution_catalog` |
| `exec.lp_remove` | `lp.remove` | `value` | `external_value_transaction_2_bps` | `false` |  | orca-whirlpools | `current_ia_execution_catalog` |
| `exec.lp_collect_fee` |  | `value` | `external_value_transaction_2_bps` | `false` |  | orca-whirlpools | `current_ia_execution_catalog` |
| `exec.lp_compound` |  | `value` | `external_value_transaction_2_bps` | `false` |  | orca-whirlpools | `current_ia_execution_catalog` |
| `exec.lp_create_position` | `lp.create_position` | `value` | `external_value_transaction_2_bps` | `false` |  | orca-whirlpools | `current_ia_execution_catalog` |

## Bridge, wrap, and unwrap

- Family id: `bridge_wrap`
- Taxonomy access: `taxonomy://primitive-family/bridge_wrap`
- Skill access: `toreva_skill_bridge_wrap`
- Kit skill: `skills/toreva-primitive-bridge-wrap.md`
- Primary venue/provider: `wormhole`
- Secondary/watchlist: `mayan-watchlist`, `debridge-watchlist`
- Readiness: `proposed`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.wrap` | `bridge.wrap`, `token.wrap` | `value` | `external_value_transaction_2_bps` | `false` |  | wormhole | `current_ia_execution_catalog` |
| `exec.unwrap` | `bridge.unwrap`, `token.unwrap` | `value` | `external_value_transaction_2_bps` | `false` |  | wormhole | `current_ia_execution_catalog` |
| `exec.bridge` | `bridge.execute` | `value` | `external_value_transaction_2_bps` | `false` |  | wormhole | `current_ia_execution_catalog` |
| `exec.bridge_quote` |  | `read` | `data_transaction_0_bps` | `false` |  | wormhole | `candidate_gap_map` |
| `exec.bridge_simulate` |  | `read` | `data_transaction_0_bps` | `false` |  | wormhole | `candidate_gap_map` |
| `exec.bridge_claim` |  | `value` | `external_value_transaction_2_bps` | `false` |  | wormhole | `candidate_gap_map` |
| `exec.bridge_refund` |  | `value` | `external_value_transaction_2_bps` | `false` |  | wormhole | `candidate_gap_map` |
| `exec.bridge_status` |  | `read` | `data_transaction_0_bps` | `false` |  | wormhole | `candidate_gap_map` |

## Market data, discovery, and safety reads

- Family id: `market_data`
- Taxonomy access: `taxonomy://primitive-family/market_data`
- Skill access: `toreva_skill_market_data`
- Kit skill: `skills/toreva-primitive-market-data.md`
- Primary venue/provider: `birdeye+rugcheck`
- Secondary/watchlist: `dexscreener`, `jupiter`, `pyth`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.token_info_query` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |
| `exec.price_query` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |
| `exec.market_trending_query` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |
| `exec.rug_check` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |
| `exec.venue_health_query` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |
| `exec.fee_estimate` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |
| `exec.webhook_register` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |
| `exec.name_resolve` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |
| `exec.name_register` |  | `read` | `data_transaction_0_bps` | `false` |  | birdeye+rugcheck | `candidate_gap_map` |

## Balance, simulate, and compare

- Family id: `balance_simulate_compare`
- Taxonomy access: `taxonomy://primitive-family/balance_simulate_compare`
- Skill access: `toreva_skill_balance_simulate_compare`
- Kit skill: `skills/toreva-primitive-balance-simulate-compare.md`
- Primary venue/provider: `jupiter+venue-sol-feeds`
- Secondary/watchlist: `birdeye`, `pyth`
- Readiness: `canonical`; green state: `not_green`

| Primitive | Aliases | Effect | Pricing | Public executable | Executable MCP tool | Venue/provider | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `exec.balance` | `balance.query`, `finance.balance`, `product.balance` | `read` | `data_transaction_0_bps` | `false` |  | jupiter+venue-sol-feeds | `current_ia_execution_catalog` |
| `exec.simulate` | `finance.simulate`, `strategy.simulate` | `read` | `data_transaction_0_bps` | `false` |  | jupiter+venue-sol-feeds | `candidate_gap_map` |
| `exec.compare` | `finance.compare`, `strategy.compare` | `read` | `data_transaction_0_bps` | `false` |  | jupiter+venue-sol-feeds | `candidate_gap_map` |

## Composition Layers

Composition terms are taxonomy/control vocabulary. They are not standalone venue-admitted execution primitives.

| Layer | Terms | Skill access point | Phase | Readiness |
| --- | --- | --- | --- | --- |
| Service catalog controls | `establish`, `scan`, `sweep`, `pool`, `partition`, `explain`, `reveal`, `configure` | `toreva_skill_service_catalog` | `phase_2` | `canonical` |
| Product catalog controls | `balance`, `collect`, `accumulate`, `switch` | `toreva_skill_product_catalog` | `phase_2` | `canonical` |
| Future agentic orchestration terms | `rebalance`, `capture`, `arb`, `trade`, `provide`, `hedge`, `recycle`, `boost`, `diversify`, `concentrate`, `leverage`, `regime_switch`, `time`, `discover`, `construct`, `set_goal`, `define_goal`, `generate`, `save`, `record`, `insure`, `borrow`, `manage`, `shop`, `consume`, `merchant`, `identify`, `authorise`, `disclose`, `identity_disclose`, `orchestrate`, `measure`, `calculate` | `toreva_skill_future_agentic_layer` | `phase_2` | `proposed` |
