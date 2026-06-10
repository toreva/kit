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
- No internal facts or docs. This means anything a public thin-client repo
  should not expose: internal agent/repo topology, dispatches, operating
  procedures, ownership maps, source-of-truth pointers, unreleased product/GTM
  plans, service choreography, liveness notes, postmortems, or local transcripts.
  This also includes noisy coordination artifacts that would pollute SDK/CLI/MCP
  adoption. If the information matters, route it to the cdx repo/agent or the
  owning internal repo instead of committing it here.
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



## BEGIN PLANETARY-SCALE INVARIANT — do not edit in-repo

# PLANETARY-SCALE MULTI-SUBJECT INVARIANT — read before designing ANY solution

**This block is a top-priority rule. It applies to every solution any agent designs, builds, reviews, or ships — backend, frontend, infra, data, or doctrine.**

Every solution must serve **any subject at planetary scale** — any user, any agent, any wallet, the 1,000,000th and a fresh-random one — **identically and with cost sublinear in the number of subjects**. Never just the founder's wallet, never a hand-picked cohort. A solution that only works for the founder, for a capped/allowlisted set, or whose cost grows with the user count, is **not done** — it is a defect, even if it "works" in a demo.

## The 5-question gate (a solution is NOT shippable unless every answer is "yes")
1. **Nth-subject:** Does it serve an arbitrary new subject with **zero** special-casing? (No hardcoded founder address, no `if (user === founder)`, no per-subject branch.)
2. **Sublinear cost:** Does compute / RPC / DB / $ stay ~flat as subjects grow 44 → 1e6? (**No** `listActive`/`listAll`/`SELECT * … <subjects>` inside a timer; **no** `Promise.all` / `for` over an unbounded subject list on a cycle.)
3. **No gate:** Is there **zero** allowlist / cap / `*_CAP` / `*_ALLOWLIST` / `*_WHITELIST` / `*_OVERRIDES_JSON` / `*_FOUNDER_*`? (These are **deleted**, not exempted, not "temporary build-mode stopgaps".)
4. **Push not pull:** Is each per-subject read triggered by an **event** — chain webhook, user attention (session/SSE), agent action (bus envelope), or explicit `/refresh` — with polling **OFF by default** and only a degraded reconciliation fallback?
5. **Cohort + receipt:** Do you read the subject set via **`cohort.query(name)`** (bounded, indexed, event-fed — not a full scan), and does every user-visible number carry a `receipt_id` linking to its bus envelope (receipt-or-it-didn't-happen)?

## What good vs bad looks like
- **BAD:** `setInterval(() => { for (const u of await listActive()) read(u) })` · `MONEY_TRUTH_CANONICAL_WALLET_CAP` · `const FOUNDER = "AQHCs…"` · `STAGE_1_FOUNDER_CAP_USD` · a number on screen with no receipt.
- **GOOD:** Helius/chain webhook → update exactly the one changed subject → bus → SSE · `cohort.query("attention_received")` · per-user on-demand read, edge-cached · shared reserve/price read once per TTL, not per subject · empty result still emits `count=0` envelope.

## If a solution can't pass the gate
It is not "ship now, scale later." Redesign it to be planetary-correct, or — if that is genuinely a one-way door or >Class-A cost — escalate via EA (per the KERNEL-LOOP rule). "It works for the founder" is **not** acceptance.

## Enforcement (awareness → detection → penalty), same regime as BUS-FIRST
1. **Awareness** — this block (every agent reads it at session start) + `kernel/docs/doctrine/planetary-substrate-invariants.md`.
2. **Detection** — the `planetary-substrate` CI lint (`iac/lints/planetary-substrate/`, PLANETARY-001..010) blocks PRs that reintroduce a banned pattern, citing the doctrine line. The **random-cohort probe** (`po/scripts/planetary-substrate-probe.ts`) is the runtime fitness function — a **fresh-random-wallet failure is a P0** (correctness is proven on random + freshly-minted subjects, never a founder/TY allowlist).
3. **Penalty** — a detected bypass downgrades the offending agent's `capability_tier`, blocks PR merges via the planetary gate, and is logged as a durable incident. Repeat bypass escalates to sentinel.

## END PLANETARY-SCALE INVARIANT

## BEGIN CANONICAL BLOCK — do not edit in-repo

## Dispatch OODA loop — daemon-managed (build mode)

You (this agent) are running inside a repo that has a **local filesystem daemon** watching `intake/pending-dispatches/` for new `.md` files. When a file lands, the daemon passes the file contents to the configured local runner. The default runner is Claude via `AGENT_RUNNER=claude`, which invokes `claude -p` in this repo. Local Codex is also supported via `AGENT_RUNNER=codex`, which invokes `codex exec` in this repo. If this prompt reached you through either path, you are that runner session.

**Cadence:** event-driven via `fswatch` + 1-minute idle poll as a belt-and-braces. Typical dispatch → response latency: 30-120s.

### Dispatch SLA (founder mandate 2026-05-18 — hard contract)

For **every** dispatch on **every** transport (filesystem today, GitHub Actions relay and pubsub bus later):

1. **60-second ack.** Within 60s of the dispatch file landing, the agent's daemon MUST commit `intake/responses/<basename>.ack.md` stating it picked up the work. Today `scripts/agent-daemon.sh` does this automatically before invoking the runner — you don't have to do anything extra in normal flow.
2. **5-minute resolution-or-status.** Within 5min of pickup, EITHER the full response file MUST be committed OR a `intake/responses/<basename>.status.md` MUST exist saying `status: in_progress` with `updated_at` < 5min ago. The daemon's background status emitter rewrites the status file every 300s; if you take a complex action that runs longer than 5min, the status keeps refreshing automatically as long as the daemon is alive.
3. **5-minute re-status.** If the work is still in flight at the 5-min mark, the status file MUST be refreshed every 300s thereafter. Silence past a 300s interval is a hard breach.

Any breach is a P0 incident — `scripts/sla-watchdog.sh` runs every 60s, reports breaches to `reports/dispatch/sla-breaches-<DATE>.md`, and restarts the responsible daemon. Full contract: `coordinator/data/sla.yaml`.

If you're acting as the runner inside a long-running dispatch and you realize the work will exceed 5 min, write a one-line `.status.md` yourself rather than waiting for the daemon's 5-min refresh — it's cheap, it gives downstream auditors visibility, and it documents WHY the work is taking the time it is.

### Runner architecture

- **Transport is model-agnostic.** `scripts/dispatch.sh` writes Markdown dispatches into `intake/pending-dispatches/`; responses still land in `intake/responses/<basename>`; processed dispatches still move to `intake/processed/<YYYY-MM-DD>/<basename>`.
- **Execution is runner-specific.** `scripts/agent-daemon.sh` owns the watcher and dispatch protocol. It selects execution with `AGENT_RUNNER`, defaulting to `claude`. `scripts/claude-daemon.sh` remains a compatibility wrapper for existing launchd/supervisor paths.
- **Local Codex is a repo-local runner.** `AGENT_RUNNER=codex` runs `codex exec --cd <repo>` with `AGENT_CODEX_SANDBOX` defaulting to `workspace-write`, then writes Codex's final message into `intake/responses/<basename>`. Optional `AGENT_CODEX_MODEL` and `AGENT_CODEX_PROFILE` pass through to `codex exec`. It uses the local Codex CLI auth/config, not the GitHub issue connector.
- **Manual/noop mode is explicit deferral.** `AGENT_RUNNER=manual` or `AGENT_RUNNER=noop` writes a clear `Status: deferred` response instead of invoking a model. Use this when Claude quota is exhausted or no local model runner is available.
- **Codex Cloud is separate.** `scripts/codex-dispatch.sh` opens a GitHub issue with an `@codex` mention so the GitHub Codex Connector can work in Codex Cloud. It is not the repo-local daemon path, is separate from `AGENT_RUNNER=codex`, and does not consume `intake/pending-dispatches/`.
- **Artifact lifecycle is separated from memory.** Raw dispatch files, response files, ack/status files, and runner transcripts are transport exhaust. The daemon archives raw copies under `$AGENT_DAEMON_ARCHIVE_ROOT` (default `~/.toreva/agent-daemon/archive`) and these paths are git-ignored. Distilled lessons and decisions belong in repo-local `MEMORY.md`; cross-repo candidates are promoted by the memory agent for kernel consumption.

### Document safety

Before writing, replacing, formatting, flattening, exporting, or regenerating any user-facing document or active working file, apply this fleet-wide safety rule:

- **Treat user-open files as read-only.** If the user has a file open in an IDE, Preview, Acrobat, Office, a Google Drive sync folder, or has just said they are working in it, do not overwrite that path.
- **Ask before replacement.** Do not regenerate, copy over, format, flatten, or export over an existing user-facing document unless the user has expressly requested that exact overwrite.
- **Default to versioned output.** Write a new file such as `_v2`, `_patched`, `_review-copy`, or a timestamped filename instead of replacing the existing file.
- **Preserve before approved overwrite.** If the user explicitly approves replacement, first copy the current file to a recovery/backup path with a timestamp, then write the replacement.
- **Handle binary and office-style files conservatively.** PDFs, forms, spreadsheets, word-processing documents, and synced documents may contain manual edits that are not recoverable from git; once manual editing has started, programmatic regeneration is not safe by default.
- **On overwrite incidents, stop writes.** Preserve the current disk state, look for backups/autosaves/history before touching the file again, and communicate plainly about what happened and what recovery options exist.

### Your OODA loop when invoked from a dispatch

**Observe.** Read the dispatch file. It has canonical headers (`Status`, `From`, `To`, `Priority`, `Raised`, `Fallback reason`). Below the headers is the ask (`## Ask`) and notes (`## Notes`).

**Orient.** Scope check:
- Is the `To:` field pointing at this repo / agent? If not, stop and write a short explanation to `intake/responses/<basename>` noting mis-routing.
- Is the ask inside your `write_scope` (per `iam/data/agent-registry.yaml`)? If not, decline with reason.
- Is it a P0? Prioritize over other work.

**Decide.** Choose one of:
1. **Action it now** (most common). Do the work in-repo: write code, run tests, query BQ, publish a bus envelope, whatever the ask requires.
2. **Escalate.** If the ask exceeds your scope or needs approval, dispatch to your accountable agent via `coordinator/scripts/dispatch.sh --to <accountable> --title "escalation: ..." --body-file -`.
3. **Defer with reason.** Write a response explaining what's blocking and expected unblock time.

**Act.** Execute. If the action involved code changes, you MUST complete the full commit-to-deploy chain BEFORE writing the response (see "Commit-to-deploy SOP" below — founder mandate 2026-04-24, re-affirmed 2026-05-16 after the identity dispatch left uncommitted work in the worktree).

Write the response file to `intake/responses/<basename>` with:

```markdown
# Response to: <dispatch title>

**In reply to:** `intake/processed/<date>/<basename>`
**Responded:** <ISO timestamp>
**Status:** completed | in_progress | escalated | declined | deferred

## Summary
<1-3 sentence TL;DR>

## Work done
<bullet list of concrete actions — file edits, PRs opened, BQ queries run, bus envelopes published>

## Blockers / follow-ups
<if any>

## Evidence
<file paths with line numbers, PR URLs, tx signatures, BQ query IDs — proof, not assertion>
```

**Move the original.** Once you've written the response, the daemon will move `intake/pending-dispatches/<basename>` → `intake/processed/<YYYY-MM-DD>/<basename>` automatically. You do not need to do that yourself.

### Commit-to-deploy SOP — REQUIRED before declaring Status: completed

Founder mandate 2026-04-24, re-affirmed 2026-05-16: **review / commit / merge / deploy must NEVER require manual triggering after the daemon runs.** Writing files and exiting is incomplete work. The runner session is responsible for the full chain.

If you touched tracked files in this repo as part of the dispatch:

1. **Run tests + typecheck** appropriate to the repo (e.g. `npm test`, `pnpm typecheck`, `pytest`). Do NOT mark `Status: completed` if they fail — escalate or defer.
2. **Create a branch** named `daemon/<agent>/<short-dispatch-slug>-<YYYY-MM-DD>` (or rebase your work onto one if you've been working on main).
3. **Commit** with a descriptive message. End the commit message with a trailer:
   - `Spawned-By: <plan-agent-id>` if acting on a planning-agent tick, OR
   - `Dispatched-By: <from-agent>` otherwise
   - Plus the standard `Co-Authored-By:` if applicable.
4. **Push** the branch to `origin`.
5. **Open a PR** via `gh pr create` with a body referencing the dispatch path.
6. **Enable auto-merge** via `gh pr merge --squash --auto` so CI can land the change without further human action. If `--auto` fails with `enablePullRequestAutoMerge` / "Protected branch rules not configured for this branch", the target branch has no branch-protection rules, so GitHub cannot arm auto-merge regardless of the repo-level `allow_auto_merge` setting. Fall back as follows: if the PR has checks (`gh pr checks <pr>` lists any), wait for them with `gh pr checks <pr> --watch` and then merge directly via `gh pr merge --squash`; if no checks are configured, merge directly via `gh pr merge --squash` immediately. Do NOT add branch-protection rules inline to make `--auto` work — that is a deliberate per-repo governance change (a required status check on a repo with no CI deadlocks every future PR), so dispatch coordinator instead if you think a repo needs protection rules.
7. **Verify CI is green** (or at least running with no immediate failures) before declaring completed.
8. In the response's `## Evidence` section, include: branch name, PR URL, commit SHA, and CI status link.

If you wrote code but couldn't commit (lint errors you can't fix, missing credentials, repo policy block), use `Status: deferred` and explain in `## Blockers / follow-ups` what's needed.

**Why this matters:** the daemon system is supposed to be commit-to-deploy end-to-end. Leaving files in the worktree means PO or a human has to manually commit, which breaks the agent-autonomy contract.

### How to dispatch work to another agent

Use the shared CLI (available from any repo):

```bash
/Users/paulbush/toreva_vs/coordinator/scripts/dispatch.sh \
  --from <your agent name> \
  --to <target agent name> \
  --title "short ask" \
  --body-file <path or - for stdin> \
  --priority P0|P1|P2
```

The script writes a canonical-headered `.md` file into the TARGET repo's `intake/pending-dispatches/`. The target repo's daemon picks it up within seconds (fswatch) or up to 60s (idle poll).

### Invariants

- **Do not publish bus envelopes for routine dispatches in build mode** — the filesystem path IS the sanctioned transport (see every `CLAUDE.md` and `coordinator/intake/pending-dispatches/README.md`). Bus publish is still required for: (a) planning-agent ticks, (b) synthetic heartbeat, (c) anything that the `/bus/ingest` Zod enum already accepts.
- **Do not roleplay another agent.** If a dispatch is mis-routed, respond with that fact — do not invent the other agent's answer.
- **Do not silently fail.** If the runner session can't complete the ask, write a `Status: declined` or `Status: deferred` response explaining why.
- **Trailer your commits** when the work you do creates a git commit. Use `Spawned-By: <plan-agent-id>` if you're acting on a planning-agent dispatch, else `Dispatched-By: <from-agent>`.

### Planned migration (revenue-gated)

Today's filesystem transport is build-mode only. When Toreva crosses $10k MRR, we migrate to the production bus:
- `fs-watcher` → `pubsub-subscriber` (same handler chain, different input source)
- `dispatch.sh --transport=bus` available now; becomes default at migration
- File-based path stays as belt-and-braces even after cloud migration

See: `coordinator/docs/bus-ops-phase-1b/` for the full cloud design, and the memory `project_local_daemon_pivot.md` for the 2026-04-21 decision.

## END CANONICAL BLOCK
