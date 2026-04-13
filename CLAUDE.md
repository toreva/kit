<!-- TOREVA-KERNEL-LOOP-INVARIANT -->
# KERNEL LOOP INVARIANT — READ BEFORE ESCALATING ANY DECISION

**This is a LOCAL loop. You run it yourself. Do not route through kernel.**

## The rule

When you hit a decision point:

1. **Decide locally.** If your own evidence, data, memory, and scope are enough — decide, act, write the rule to your memory, move on. This is the default.
2. **A/B test via experimentation agent** only if step 1 genuinely cannot resolve the ambiguity. You are the caller; kernel is not.
3. **Escalate to EA → founder only if Class A.** Class A = >$1k/day cost, >$10k one-off, material revenue shift, reputational risk, unethical, illegal, one-way door, **any app change / product-model change** (what the customer sees/does/experiences — Connect, Select, earn/stake/balance, onboarding, recovery, agent wallet), or **accountability transfer** (see RACI below).

## RACI — accountability is non-delegable

- **Accountable** — own the work AND check the work. Sits with whoever was FIRST given the task. One agent only.
- **Responsible** — do the work. May be many; may be delegated by the Accountable.
- **Consulted / Informed** — input / notification, not ownership.

You may delegate Responsibility. You may NOT transfer Accountability without founder approval via EA (Class A).

If you catch yourself "passing this to X" to shed ownership — stop. Either do it, delegate Responsibility while keeping Accountability, or publish `founder.action_required.accountability_transfer` to EA.

## What this is not

- **Not a route through kernel.** Kernel supplied the doctrine first, which is why shorthand is "the Kernel Loop". Kernel is not a router, not a broker, not step 0.
- **Not a reason to escalate.** "I don't know which is better" is not Class A. Decide locally or run the A/B.
- **Not a reason to wait.** Paul explicitly rejected the pattern of agents queueing ambiguous decisions for him. The whole point is to take work off his plate.

## If you were going to ask Paul

First ask: is it truly Class A? If not, close it locally. If yes, send it through EA (not directly to Paul).

## Canonical source

`kernel/docs/doctrine/continuous-ab-decisioning.md` — founder clarification 2026-04-13 is at the top of that file.
<!-- /TOREVA-KERNEL-LOOP-INVARIANT -->

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


<!-- TOREVA-MEMORY-PROTOCOL -->
# Session protocol

## Start of every session

1. Read [`MEMORY.md`](./MEMORY.md) — this repo's curated Layer-2 intelligence. Apply active lessons, open questions, and recent decisions before acting.
2. Read [`REPO_CHARTER.md`](./REPO_CHARTER.md) and [`AGENT_CHARTER.md`](./AGENT_CHARTER.md) if the task touches scope boundaries.
3. Read [`KPIs.md`](./KPIs.md) if the task will move a measured outcome.

## End of every session

1. Distil **learnings** (not tasks done) from this session.
2. Apply the five-gate quality filter in `MEMORY.md`.
3. Append qualifying entries to `MEMORY.md` using its YAML template.
4. Tag each entry with relevant `OBJ-XX` IDs from `coordinator/bus/registries/system-objectives.v1.json`.
5. Mark cross-repo-relevant entries with `promote: candidate` so the memory agent can pick them up for Layer-3 curation.

## What goes where

- **Instructions, conventions, rules** → this file (`CLAUDE.md` / `AGENTS.md`)
- **Curated intelligence from sessions** → `MEMORY.md`
- **Material decisions** → `docs/decisions/DEC-*.md`
- **KPI ownership, thresholds, interventions** → `coo/data/metrics/`
- **Cross-repo memory objects** → `memory/objects/`

Full Layer-2 spec: [`memory/playbooks/layer-2-memory-file.md`](../memory/playbooks/layer-2-memory-file.md)
<!-- /TOREVA-MEMORY-PROTOCOL -->
