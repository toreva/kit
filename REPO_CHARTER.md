# REPO CHARTER — kit

## Purpose
Thin-client monorepo providing third-party developer access to Toreva governed
objects through the gateway relay. Publishes the SDK, CLI, MCP server, shared
types, and onboarding docs that let developers bind their own compute to Toreva
objects.

## Scope
In scope:
- @toreva/sdk — TypeScript client library for programmatic access
- @toreva/cli — Command-line interface for terminal-based interaction
- @toreva/mcp — MCP server for AI agent integration (stdio and remote modes)
- @toreva/types — Shared schemas and type definitions
- Work-surface connector primitives for MCP, SDK, CLI, and relay consumers
- Documentation for the three compute doors: MCP, customer-owned fleet, and
  hosted compute marked deferred until available
- GitHub organization fleet setup guidance for customer-owned agents
- Examples for developer onboarding and connector verification

Out of scope:
- Business logic (routing, scoring, fee enforcement, strategy execution)
- Backend server code or HTTP serving frameworks
- Secrets, keypairs, or internal-only URLs
- Holding or brokering per-user model credentials by default
- Treating GitHub as a Toreva work-message transport; GitHub is identity and
  repository control only
- Internal facts or docs: cross-repo/agent topology, dispatches, operating
  procedures, ownership maps, source-of-truth pointers, unreleased product/GTM
  plans, service choreography, liveness notes, postmortems, local transcripts,
  and coordination artifacts. Important internal material belongs in cdx or the
  owning internal repo, not this public thin-client repo.
- Direct blockchain interaction (all execution goes through gateway)
- Internal platform services or infrastructure
- Product-family education, venue intelligence gathering, or market data
  production

## Responsibilities
- Provide developer-friendly SDK for TypeScript/JavaScript consumers
- Provide CLI for terminal-based interaction with Toreva services
- Provide MCP server for AI agent integration (Claude, Codex, Grok, etc.)
- Publish shared type definitions for consistent API contract consumption
- Make MCP the shortest live setup path for a person's own AI client
- Document how GitHub organization admins run customer-owned agents against
  their own orgs and return receipt-bearing object writes to Toreva
- Keep hosted compute described as deferred until it is actually available
- Maintain canonical tool names and relay types across all packages
- Keep all external communication routed through gateway.toreva.com only
- Include proper regulatory notices and disclaimers in public-facing packages

## Non-goals
- Implementing execution logic or financial decision-making
- Serving as a backend or processing transactions
- Storing user credentials or private keys
- Storing or operating customer model credentials for live MCP or fleet paths
- Running customer-owned agents on Toreva infrastructure
- Providing financial, investment, or trading advice
- Supporting non-Solana chains (Day 1 scope)

## Key inputs
- Gateway API responses (auth, intents, receipts, pricing, strategies, perps)
- RELAY_AUTH_TOKEN for authentication
- User commands (CLI), function calls (SDK), or tool invocations (MCP)

## Key outputs
- SDK: Typed API client for @toreva/sdk consumers
- CLI: Terminal output and interactive commands for @toreva/cli users
- MCP: Tool responses for AI agent consumers via @toreva/mcp
- Types: Shared TypeScript type definitions via @toreva/types
- npm packages published to registry

## Dependencies
- gateway (gateway.toreva.com — sole API endpoint, relay protocol)
- No other internal services (thin client boundary)

## Success criteria
- All packages build and pass Vitest tests
- TypeScript compiles without errors
- SDK, CLI, and MCP server all communicate exclusively through gateway.toreva.com
- Zero business logic in any package (routing, scoring, fee enforcement)
- Zero secrets or internal URLs in published code
- Zero internal facts/docs or coordination artifacts in committed content
- Tool names and relay types are canonical (match gateway contract)
- MCP server works in both stdio and remote modes
- README presents MCP, customer-owned fleet, and deferred hosted compute in that
  order
- A GitHub organization admin can follow Kit docs to connect an organization
  runner to Toreva objects without Toreva-held model credentials
