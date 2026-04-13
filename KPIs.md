# KPIs — kit

Canonical measurement definitions owned by **analytics**. Thresholds, ownership, and interventions owned by **coo**. This repo authors and exposes the signal.

The 20% of KPIs that drive 80% of this repo's charter outcomes and time-to-revenue.

## Pareto KPIs

### kpi.kit.build-and-test-pass-rate

- **Measures:** Percentage of CI runs (main branch) where all packages (@toreva/sdk, @toreva/cli, @toreva/mcp, @toreva/types) build and all Vitest tests pass
- **Charter outcome:** "All packages build and pass Vitest tests"
- **Time-to-revenue link:** A red main blocks any third-party developer or AI-agent integration release; kit is the acquisition surface for the AI-agent distribution channel
- **Type:** leading
- **Target:** `>= 99%`
- **Cadence:** weekly
- **Source:** CI pipeline logs
- **Owner:** kit agent (accountable) — analytics agent (measurement) — coo agent (threshold)
- **Intervention trigger:** any red main unresolved more than 4 hours

### kpi.kit.gateway-contract-parity

- **Measures:** Percentage of gateway tool names, relay types, and schema fields that match canonical kit type definitions (@toreva/types)
- **Charter outcome:** "Tool names and relay types are canonical (match gateway contract)" and "never use `protocolId` — always use `venue`"
- **Time-to-revenue link:** Contract drift causes silent integration breakage for third-party agents and developers — every broken integration loses an inbound user and erodes trust
- **Type:** leading
- **Target:** `100%`
- **Cadence:** weekly
- **Source:** schema diff between gateway contract and @toreva/types
- **Owner:** kit agent (accountable) — analytics agent (measurement) — coo agent (threshold)
- **Intervention trigger:** any drift detected, or any use of forbidden field `protocolId`

### kpi.kit.gateway-only-communication-compliance

- **Measures:** Count of detected network calls from any kit package to endpoints other than `gateway.toreva.com`
- **Charter outcome:** "SDK, CLI, and MCP server all communicate exclusively through gateway.toreva.com" and "Zero secrets or internal URLs in published code"
- **Time-to-revenue link:** Non-gateway calls leak internal surface area and create security/compliance risks that directly threaten licensing and third-party trust
- **Type:** leading
- **Target:** `0`
- **Cadence:** weekly
- **Source:** static analysis of published packages + network audit in tests
- **Owner:** kit agent (accountable) — analytics agent (measurement) — coo agent (threshold)
- **Intervention trigger:** any occurrence

### kpi.kit.mcp-server-smoke-test-success

- **Measures:** Percentage of scheduled MCP server smoke tests (stdio and remote modes) that complete all declared skill invocations successfully
- **Charter outcome:** "MCP server works in both stdio and remote modes"
- **Time-to-revenue link:** MCP is the primary AI-agent acquisition surface (Claude, Codex, Grok); smoke test failures silently cut off inbound AI-agent developer users
- **Type:** leading
- **Target:** `>= 99%`
- **Cadence:** weekly
- **Source:** MCP smoke test job logs
- **Owner:** kit agent (accountable) — analytics agent (measurement) — coo agent (threshold)
- **Intervention trigger:** any failed skill invocation unresolved within 12 hours

### kpi.kit.disclaimer-and-notice-presence

- **Measures:** Percentage of published packages where required regulatory notices and disclaimers are present and unmodified
- **Charter outcome:** "Include proper regulatory notices and disclaimers in public-facing packages" and "Never modify or remove regulatory notices"
- **Time-to-revenue link:** Missing disclaimers on a public-facing package in the AUSTRAC/ASIC window is a direct compliance event that can block the license path
- **Type:** leading
- **Target:** `100%`
- **Cadence:** weekly
- **Source:** published package content audit vs canonical disclaimer templates
- **Owner:** kit agent (accountable) — analytics agent (measurement) — coo agent (threshold)
- **Intervention trigger:** any package missing or modified disclaimer

### kpi.kit.business-logic-leakage-count

- **Measures:** Count of detected business logic primitives (routing, scoring, fee enforcement, strategy execution) in any kit package after static analysis
- **Charter outcome:** "Zero business logic in any package (routing, scoring, fee enforcement)"
- **Time-to-revenue link:** Business logic in the thin client violates the gateway-first architecture, creates divergence risk between kit and gateway, and puts unaudited code in front of regulators
- **Type:** leading
- **Target:** `0`
- **Cadence:** weekly
- **Source:** static analysis linter over kit packages
- **Owner:** kit agent (accountable) — analytics agent (measurement) — coo agent (threshold)
- **Intervention trigger:** any occurrence

## Registry

Canonical index: `/analytics/kpis/registry/README.md`
