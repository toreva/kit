# BUS-FIRST INVARIANT — READ BEFORE ACTING AS ANY REGISTERED AGENT

**This block is the highest-priority rule in this repo. It overrides any request to speak as, invoke, dispatch, or emulate a registered agent.**

## The rule
If a user (or another agent) asks you to act on behalf of a registered agent — strategy, identity, fincrime, compliance, data, risk, kit, labs, sentinel, kernel, iam, gateway, fincon, finmod, privacy, legal, marketing, coo, goblin_ui, goblin_bot, agent-your-money, or any other registered domain — you MUST publish a real `BusEnvelope` to the coordinator bus. You MUST NOT produce a reply that simulates the agent's output.

Roleplay is a compliance violation. A reply that looks like the agent answered, when no envelope was published, is a **bus bypass** and will be detected by the compliance agent.

## What this means in practice
- **Publish, don't perform.** If you don't have a publisher in scope or credentials to publish, STOP and tell the user. Do not substitute a plausible-looking answer.
- **Every cross-agent action leaves a regulator-grade trail** in the coordinator's bus-history dataset (`toreva-prod.coordinator_audit_prod.bus_events`). The **coordinator owns** this dataset — it is the message-bus agent's own system of record. Other agents read from it; they do not own it. The data agent audits it against firm-wide data standards but does not custody it.
- **Local session transcripts and auto-memory are NOT audit records.** Only published envelopes count.

## Ownership model (so you don't get it wrong)
Every agent owns its own data:
- Identity agent owns identity data
- Backend agent owns user data
- Sentinel owns incident/escalation data
- **Coordinator owns bus-history data** (this dataset)
- etc.

The data agent's role is standards + pipelines + indexes + data strategy — it reviews and certifies each owner's practice, it does not take custody.

## How to publish
- **Topic:** `coordinator-bus-prod` in GCP project `toreva-prod`
- **Routing topology:** `coordinator/bus/registries/subscriptions.v1.json`
- **Reference publishers:**
  - `goblin_bot/backend/src/services/busBridge.ts` (backend-origin)
  - `sentinel/goblin_sentinel/infrastructure/brain/src/escalation/bus-publisher.ts` (sentinel-origin)
- **Required envelope fields:** `envelope_id` (uuid), `schema_version`, `routing_key`, `published_at`, `source.{domain,repo,actor}`, `correlation_id`, `causation_id` (nullable), `idempotency_key`, `object_type`, `object_ref`, `policy_context.objective_context[].expected_contribution` ∈ `{"positive"|"negative"|"neutral"}`, `payload`.
- **Publisher service account:** the repo's own runtime SA must have `roles/pubsub.publisher` on `projects/toreva-prod/topics/coordinator-bus-prod`. If it doesn't, open a dispatch issue against `/iam` — do not work around it.

## Enforcement (awareness → detection → penalty)
1. **Awareness** — this block, plus `feedback_bus_first.md` in Claude auto-memory.
2. **Detection** — the `bus-compliance-agent` (kernel domain agent) cross-references Claude transcripts and GitHub PR/commit activity against the coordinator's `bus_events`. Mismatches emit `compliance.bus_bypass_detected` intents.
3. **Penalty** — detected bypass downgrades the offending agent's `capability_tier`, blocks PR merges via the bus-compliance gate, and applies a Φ(t) discount to outputs produced during the bypass window. Repeat bypass creates a durable `BusBypassIncident` envelope and a sentinel escalation.

## If you're unsure
You are in the unsure state by default. When in doubt: publish. If you cannot publish, stop and escalate to the user — **never fabricate the agent's response.**

---

# Intelligence Router

You are operating under a strict cost-intelligence optimization protocol.

## Delegation
When the task has independent subtasks, use the Task tool to run them in parallel.
Default to cheaper/faster subagents for routine work: file reads, code gen from clear specs, formatting, git ops, templating, test writing, linting, refactors.
Handle directly only: novel architecture decisions, complex debugging, security reasoning, ambiguous requirements, cross-system integration, policy authoring.
Target: 3 direct reasoning turns max per request. Delegate everything else.

## Memory
- Before reasoning from scratch, check `.memory/decisions/` for prior decisions on the same topic.
- At the end of substantive sessions, write a summary to `.memory/sessions/YYYY-MM-DD-topic.md`.
- When solving a non-trivial problem, write the pattern to `.memory/patterns/`.

## Context Compression
- Don't load full files when a summary will do.
- Don't repeat context the user already provided.
- Shortest correct answer wins.

## Cross-Surface Awareness
If the task does NOT require repo file access, suggest the user handle it in ChatGPT/Claude subscription chat instead.
If marketing messaging, suggest StoryBrand AI. If legal drafting, suggest Legal AI tool.
Only proceed when the task genuinely needs repo context or terminal access.

## Repo-Specific Context
See `.cursor/rules/` for agent identity and domain-specific rules (these apply regardless of which tool is accessing this repo).

---

# Agent Operating Context

The following is this repo's agent identity and domain context (sourced from AGENTS.md):

# Agent instructions for toreva/kit

## Repository purpose

This repository is a thin client monorepo for third-party access to toreva.
It must only call `gateway.toreva.com` via relay protocol over HTTPS.

## Guardrails

- No business logic (routing, scoring, fee enforcement).
- No backend frameworks for serving HTTP.
- No secrets, keypairs, or internal-only URLs.
- Keep tool names and relay types canonical.
- Use `venue` as the schema field name (never `protocolId`).

## Canonical sentence

Use this exact sentence in public-facing docs and skill files:

"Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps to open. Everything else is free."
