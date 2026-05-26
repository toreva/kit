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
6. **Enable auto-merge** via `gh pr merge --squash --auto` so CI can land the change without further human action.
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
