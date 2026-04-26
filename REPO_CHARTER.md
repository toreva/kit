# REPO CHARTER — kit

## Purpose
Thin-client monorepo providing third-party developer access to the Toreva execution service. Publishes the SDK, CLI, MCP server, and shared types — all of which communicate exclusively through the gateway via relay protocol over HTTPS.

## Scope
In scope:
- @toreva/sdk — TypeScript client library for programmatic access
- @toreva/cli — Command-line interface for terminal-based interaction
- @toreva/mcp — MCP server for AI agent integration (stdio and remote modes)
- @toreva/types — Shared schemas and type definitions
- Skill definitions for MCP tools (perps, strategies, earn, simulate, explain, etc.)
- Documentation for perps tools, strategy tools, and venue information
- Examples for developer onboarding

Out of scope:
- Business logic (routing, scoring, fee enforcement, strategy execution)
- Backend server code or HTTP serving frameworks
- Secrets, keypairs, or internal-only URLs
- Internal facts or docs: cross-repo/agent topology, dispatches, operating
  procedures, ownership maps, source-of-truth pointers, unreleased product/GTM
  plans, service choreography, liveness notes, postmortems, local transcripts,
  and coordination artifacts. Important internal material belongs in cdx or the
  owning internal repo, not this public thin-client repo.
- Direct blockchain interaction (all execution goes through gateway)
- Internal platform services or infrastructure
- Venue intelligence gathering or market data production

## Responsibilities
- Provide developer-friendly SDK for TypeScript/JavaScript consumers
- Provide CLI for terminal-based interaction with Toreva services
- Provide MCP server for AI agent integration (Claude, Codex, Grok, etc.)
- Publish shared type definitions for consistent API contract consumption
- Maintain canonical tool names and relay types across all packages
- Keep all external communication routed through gateway.toreva.com only
- Include proper regulatory notices and disclaimers in public-facing packages

## Non-goals
- Implementing execution logic or financial decision-making
- Serving as a backend or processing transactions
- Storing user credentials or private keys
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
