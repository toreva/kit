# Agentic Perps Integration Patterns

This repo is the public source of truth for Toreva agent integrations while the
consumer website keeps Day-1 surfaces intentionally narrow.

Toreva provides non-custodial execution primitives for Solana with
best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade.
Perps opens are charged at 1 bps by Toreva. Lifecycle verbs are free.

This page is for builders integrating through API, CLI, SDK, Skills, or MCP.
It is execution infrastructure, not financial advice or strategy advice.

## Capability Model

```text
human wallet
  -> Toreva/Swig master authority
  -> venue-specific child capability
  -> Pacifica API agent wallet when Pacifica is selected
```

The human wallet is the root owner. The Swig authority is the policy and
capital-management control layer. It can fund or withdraw from attached
satellite wallets within user-approved policy.

Pacifica requires a separate API agent wallet because Pacifica REST orders
require an on-curve Ed25519 signer. A Swig PDA does not sign Pacifica REST
orders. Toreva binds the Pacifica API agent wallet into the same identity and
capability graph, then routes, monitors, receipts, and can revoke that
capability from Toreva surfaces. The user does not need to open Pacifica.

## Canonical Relay Envelope

All direct API examples use the same relay envelope:

```http
POST https://gateway.toreva.com/relay
Authorization: Bearer <relay-token>
Content-Type: application/json
```

```json
{
  "type": "<relay-type>",
  "toolName": "<tool-name>",
  "requestId": "<idempotency-key>",
  "payload": {}
}
```

MCP clients call the same `toolName` with the same payload. SDK clients call
`client.relay(...)` or `perps.call(...)` and the SDK creates this envelope.

Do not use old field aliases for perps. Use these Gateway MCP fields:

| Old alias | Canonical field |
| --- | --- |
| `wallet` | `walletAddress` |
| `market` | `token` plus optional `venue` |
| `notionalUsd` | `sizeUsd` |

Never ask a user for raw private keys, seed phrases, API secrets, or signer
material. Public keys, signer references, and receipt IDs are acceptable.

## Required Workflow

1. Establish the human wallet's delegated authority and child perps capability.
2. Query venues and markets.
3. Simulate the trade.
4. Ask for human approval when policy expands, funding moves, signer binding is
   created, or execution would use real funds.
5. Execute the chosen perps verb.
6. Monitor positions, fills, funding, receipts, balances, and revocation state.
7. Close, cancel, settle, withdraw, or revoke as directed by policy.

## Exact Payloads

### 1. Establish Swig Master And Pacifica Child Capability

```json
{
  "type": "intent.establish",
  "toolName": "toreva_establish",
  "requestId": "establish-perps-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "prompt": "Create a Toreva perps agent capability for SOL and BTC with low notional limits.",
    "agent_authority": {
      "delegation_provider": "swig",
      "network": "solana",
      "signer_kind": "delegated_authority",
      "policy_id": "perps_agent_v1"
    },
    "capabilities": [
      {
        "capability_type": "perps",
        "delegation_provider": "venue_api",
        "network": "solana",
        "venue": "pacifica",
        "execution_adapter": "pacifica",
        "signer_kind": "venue_api_agent",
        "guardrails": {
          "max_notional_usd": 500,
          "max_leverage": 1.5,
          "markets": ["SOL-PERP", "BTC-PERP"],
          "collateral_tokens": ["USDC"],
          "requires_human_approval_for_funding": true,
          "requires_human_approval_for_leverage_increase": true
        },
        "provider_metadata": {
          "agent_wallet_public_key": "<pacifica-agent-wallet-public-key-after-bind>"
        }
      }
    ]
  }
}
```

`provider_metadata` may include public identifiers and opaque receipt
references. It must not include private keys, seed phrases, API secrets, or raw
signer material.

### 2. Query Venues

```json
{
  "type": "perps.query_venues",
  "toolName": "toreva_perps_query_venues",
  "requestId": "query-venues-001",
  "payload": {}
}
```

### 3. Simulate

```json
{
  "type": "perps.simulate",
  "toolName": "toreva_perps_simulate",
  "requestId": "simulate-sol-long-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "token": "SOL",
    "direction": "long",
    "sizeUsd": 180,
    "leverage": 1.2,
    "collateralToken": "USDC",
    "collateralAmount": 150
  }
}
```

### 4. Open Long

Omit `venue` to let Toreva route by estimated all-in cost. Set `venue` only
when the human or policy explicitly chooses a venue.

```json
{
  "type": "perps.open_long",
  "toolName": "toreva_perps_long",
  "requestId": "open-sol-long-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "token": "SOL",
    "sizeUsd": 180,
    "leverage": 1.2,
    "collateralToken": "USDC",
    "collateralAmount": 150,
    "maxSlippageBps": 50,
    "clientRequestId": "strategy-run-2026-05-06-001"
  }
}
```

### 5. Open Short

```json
{
  "type": "perps.open_short",
  "toolName": "toreva_perps_short",
  "requestId": "open-btc-short-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "token": "BTC",
    "sizeUsd": 200,
    "leverage": 1.1,
    "collateralToken": "USDC",
    "collateralAmount": 182,
    "venue": "pacifica",
    "maxSlippageBps": 50,
    "clientRequestId": "strategy-run-2026-05-06-002"
  }
}
```

### 6. Close

Position lifecycle verbs require the venue that owns the position.

```json
{
  "type": "perps.close",
  "toolName": "toreva_perps_close",
  "requestId": "close-sol-long-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "venue": "pacifica",
    "positionId": "<position-id>",
    "token": "SOL",
    "side": "long",
    "maxSlippageBps": 50,
    "clientRequestId": "strategy-run-2026-05-06-003"
  }
}
```

### 7. Cancel Order

```json
{
  "type": "perps.cancel_order",
  "toolName": "toreva_perps_cancel_order",
  "requestId": "cancel-order-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "venue": "pacifica",
    "positionId": "<position-id>",
    "orderId": "<order-id>",
    "clientRequestId": "strategy-run-2026-05-06-004"
  }
}
```

### 8. Funding Settle

```json
{
  "type": "perps.funding_settle",
  "toolName": "toreva_perps_funding_settle",
  "requestId": "funding-settle-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "venue": "pacifica",
    "positionId": "<position-id>",
    "token": "SOL",
    "side": "long",
    "clientRequestId": "strategy-run-2026-05-06-005"
  }
}
```

## Additional Lifecycle Payloads

### Add Margin

```json
{
  "type": "perps.add_margin",
  "toolName": "toreva_perps_add_margin",
  "requestId": "add-margin-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "venue": "pacifica",
    "positionId": "<position-id>",
    "token": "USDC",
    "amount": 25,
    "clientRequestId": "strategy-run-2026-05-06-006"
  }
}
```

### Remove Margin

```json
{
  "type": "perps.remove_margin",
  "toolName": "toreva_perps_remove_margin",
  "requestId": "remove-margin-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "venue": "pacifica",
    "positionId": "<position-id>",
    "token": "USDC",
    "amount": 25,
    "clientRequestId": "strategy-run-2026-05-06-007"
  }
}
```

### Query Position

```json
{
  "type": "perps.query_position",
  "toolName": "toreva_perps_query_position",
  "requestId": "query-position-001",
  "payload": {
    "walletAddress": "<human-wallet>",
    "venue": "pacifica"
  }
}
```

## CLI Pattern

```bash
toreva perps toreva_perps_query_venues '{}'
toreva perps toreva_perps_simulate '{"walletAddress":"<human-wallet>","token":"SOL","direction":"long","sizeUsd":180,"leverage":1.2,"collateralToken":"USDC","collateralAmount":150}'
toreva perps toreva_perps_long '{"walletAddress":"<human-wallet>","token":"SOL","sizeUsd":180,"leverage":1.2,"collateralToken":"USDC","collateralAmount":150}'
```

## SDK Pattern

```ts
import { PerpsApi, TorevaClient } from '@toreva/sdk';

const client = new TorevaClient({
  relayAuthToken: process.env.TOREVA_AUTH_TOKEN!
});

await client.relay({
  type: 'intent.establish',
  toolName: 'toreva_establish',
  requestId: 'establish-perps-001',
  payload: {
    walletAddress: '<human-wallet>',
    agent_authority: {
      delegation_provider: 'swig',
      network: 'solana',
      signer_kind: 'delegated_authority',
      policy_id: 'perps_agent_v1'
    },
    capabilities: [
      {
        capability_type: 'perps',
        delegation_provider: 'venue_api',
        network: 'solana',
        venue: 'pacifica',
        execution_adapter: 'pacifica',
        signer_kind: 'venue_api_agent',
        guardrails: {
          max_notional_usd: 500,
          max_leverage: 1.5,
          markets: ['SOL-PERP', 'BTC-PERP'],
          collateral_tokens: ['USDC']
        }
      }
    ]
  }
});

const perps = new PerpsApi(client);

await perps.call('toreva_perps_long', {
  walletAddress: '<human-wallet>',
  token: 'SOL',
  sizeUsd: 180,
  leverage: 1.2,
  collateralToken: 'USDC',
  collateralAmount: 150
});
```

## MCP / Agent Operating Rule

Give MCP-aware agents this rule:

```text
Use Toreva Kit as the source of truth. Use toreva_establish before perps
execution when no perps capability is attached. Use walletAddress, token,
sizeUsd, leverage, collateralToken, and collateralAmount for opens. Omit venue
unless the user explicitly chooses one. Never request raw private keys, seed
phrases, API secrets, or signer material. Ask for approval before funding,
signer binding, policy expansion, leverage expansion, or real-funds execution.
```

## Why Route Through Toreva Instead Of Venue-Direct

Toreva is the agentic execution layer. Venue-direct integrations can open a
position, but they do not provide a provider-neutral authority graph, policy
scoping across attached wallets, best-execution routing, unified receipts,
approval-gated funding, revocation handling, and cross-venue monitoring in one
place.

For Pacifica specifically, Toreva treats the Pacifica API agent wallet as a
child capability bound to the human wallet and Swig master authority. The
strategy agent can ask Toreva to route or execute, but the policy boundary and
funding authority remain with the Toreva identity/capability graph.

## Skill Pattern

Use `skills/toreva-establish-perps-agent.md` during setup and the perps verb
skills for execution. The skill boundary is the same as the API boundary:
establish the authority graph first, then use best-execution perps verbs.

## Product Boundary

This public packet is integration guidance for agent builders. Consumer perps
availability, production limits, venue enablement, and real-funds canaries are
controlled by Toreva policy, approvals, and deployment state. Do not claim that
a strategy is battle-tested, mainnet operational, or safe for customer funds
unless the corresponding receipts and approval records exist.
