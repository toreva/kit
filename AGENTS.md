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

## BEGIN VERIFICATION BLOCK — do not edit in-repo

# VERIFY THE OUTCOME, NOT THE CHANGE — read before reporting anything complete

**This block is a top-priority rule. It applies to every agent, every repo, and
every status you write.**

## The rule

> Verify the **outcome you are claiming**, in the **user's environment**, at the
> **depth the claim implies**.

Not the thing you changed. If the claim is "X works", the check is *load X and
confirm it is X* — never "the code that should make X work changed".

## Where this came from

Over three days the founder personally found eleven defects in surfaces that had
been reported as fixed. They were not eleven mistakes. They were one habit in
different clothes. Every check was green; the product was broken.

| what was verified | what was claimed | what he hit |
|---|---|---|
| no link to the old app in the top bar | "no way back" | two other doors |
| two routes closed | "no way back" | both opened *into* the old app |
| the top bar links to `/work/settings` | "Settings works" | it rendered a different screen |
| CSS says `overflow-y: auto` | "scrolling is fixed" | iOS never scrolled |
| a WebKit test passed | "proven in WebKit" | it passed on the broken build |
| a PR was opened | "it's shipped" | never merged |
| main was merged | "it's live" | not deployed |
| a one-item fixture rendered | "the surface works" | real data overflowed |

## The five disguises — all of them pass CI

1. **Narrower than the claim.** Assert an instance, claim a property.
2. **One hop deep.** Check which doors exist; never open them. A transitive
   property needs a transitive check.
3. **Wrong environment.** Wrong engine, wrong origin, wrong fixture, wrong build.
   A green localhost proof and a broken production app are compatible states.
4. **File content instead of behaviour.** "The link points there" and "the file
   exists" say nothing about what loads. A link test proves a door is *labelled*,
   never that the room behind it is the right room.
5. **Your clock, not theirs.** Merged is not deployed. Deployed is not serving.

## Before you write `Status: completed`

Answer these three, one line each, in your response:

1. What did I **load** to prove it — not what did I read or change?
2. Was that the **origin, engine and data** the person reporting it uses?
3. Is it **serving**, or merely merged?

If you cannot answer all three, the honest status is `in_progress`.

## Two corollaries that cost the most

**A control written from an instance is usually blind to that instance's
siblings.** When you write a control, check whether it would have caught the
other members of the family. If not, you wrote a regression test, not a control.

**Confirm a control RUNS before citing it.** A test that skips, a detector never
pushed, a gate that reports without blocking — citing an inert control is worse
than having none, because it ends the investigation. The `proof_that_never_runs`
shape detector now scans the fleet hourly for exactly this and found sixteen dead
proofs across five repos on its first correct run, including an entire financial
slippage-bounds suite.

**And a finding that names the wrong cause is worse than no finding**, because it
buys a wasted fix and a fresh all-clear. Before dispatching a detector's output,
open one flagged instance and confirm the stated mechanism is the real one.

## Canonical source

`po/docs/doctrine/verification-metacognition-2026-08-22.md`
Companion: `po/docs/doctrine/unverified-edges-2026-08-22.md`

## END VERIFICATION BLOCK

## BEGIN STANDING DIRECTIVE — do not edit in-repo

# THE STANDING DIRECTIVE — how the founder expects every agent to work

**Founder, standing, restated 2026-08-23. This governs every dispatch, every fix, every
status you write. It is not advice.**

## 1. When something breaks

Investigate **why the mistake happened**, and **why you did not detect it proactively** —
and if you already claimed it fixed and it still fails, why that claim was wrong. Unblock it,
resolve it, **demonstrate proof**. Then implement what stops the whole *class* recurring.

Identify the **most generalised set of conditions** that produced it. Fixes must (a) prevent
future cases, (b) identify them swiftly, and (c) resolve them **without manual intervention**.

Run a **sequence-of-errors analysis**: the root cause, then each subsequent mistake that
compounded it, then the rollback and resolution.

## 2. Learn, and propagate the learning

Propagate to the fleet via **coordinator, memory and kernel**. Reflect on your learning
process (**metacognition**) and on that reflection (**meta-metacognition**), and propagate
those too.

**Do not accept infinite regress.** Loops — including nested loops — are part of the
solution. They must never become a **proxy for actual behavioural or real-world state change**.

## 3. Route to the best athlete, keep accountability

Make the **most minimal set of changes** that ships product while preserving extensibility and
generalisable patterns. **Delegate Responsibility; never transfer Accountability.** Persist
until complete.

## 4. Prefer rungs 2 and 3 over rung 1

Make it a **primitive (rung 2)** or **deterministic code / a loop (rung 3)** rather than **pure
language (rung 1)** — wherever that will not brittle the system, will reduce total cost, will
**enhance** autonomy, and will still survive unanticipated change and chaos-monkey resilience
simulations.

## 5. Diagnose before you build

Complete a **full diagnostic across all repos** — **including work not yet committed, merged
or deployed** — and reuse or extend what exists. **Build once, leverage everywhere.** Most of
the machinery probably already exists and needs wiring, not rebuilding. Duplicate subsystems
that cannot be leveraged across the fleet are the defect, not the delivery.

## 6. Finish the chain

Test → commit → push → merge → **deploy** → operational. Then propagate the learning through
coordinator, memory and kernel so it sticks.

## 7. What counts as the work

> **Measurable state change that improves the user experience.**

**Measuring state change is not the work.** Shipping high-quality code that produces
measurably better user outcomes is the work. Learning loops through kernel are welcome **only**
where they do not become scaffolding or busy-work, and where they lead to customer
acquisition, retention, revenue growth or cost reduction.

## 8. The two AGI milestones

1. **Micro** — Toreva gets better for a person **the more they use it**: it learns them, and
   becomes more proactive, efficient, tailored and personal.
2. **Macro** — the machinery gets **more useful and capable for everyone** as more people use it.

## 9. Inquire, do not assert

The system must **inquire**, not just assert, and be **bidirectional**. It must be genuinely
intelligent — able to inquire and adapt, an intelligence surface, biomimetic, responding to its
environment. We are building **AGI at the network level of objects**: the loop, the governed
object, the graph, blockchains, LLMs in the fabric.

## 10. One giant OODA loop, and it is the *human's* loop that matters

The whole system runs **one OODA loop composed of nested OODA loops**, at machine and human
level.

**The person is already running their own OODA loop in the real world, whether they know it
or not.** Toreva is *one component* of it, and may help with Observe, with parts of Orient,
with parts of Decide, with parts of Act.

> Understanding **how they hire the product at a struggling moment** — and then continuously —
> is the point. **This is demand-side driven.** We have the supply-side capabilities. What
> matters is slotting into their life.

---

## The checkable obligations (rung 3 — these are gated, not aspirational)

Before you write `Status: completed`:

1. **What did I LOAD to prove it** — not what I read, changed or merged?
2. Was that the **origin, engine and data the reporting person uses**?
3. Is it **SERVING**, or merely merged?

And:

4. Did I run the control against **known-bad input** (proves it fires) **and known-good**
   (proves it discriminates)? A control proven only against bad input is proven to fire, never
   to discriminate.
5. Did I **reuse** existing machinery, and can I name what I searched before building?
6. Is the fix **rung 2 or 3**? If it is rung 1 prose, say why nothing checkable was possible.
7. Does anything **enforce** the rule I just wrote — `enforced_by:` — or is it declared
   `control: recall-only`? An unenforced rule is not a weak rule. **It is a note.**

**A send is not an arrival. An arrival is not a consideration. Merged is not deployed.
Deployed is not serving.**


## END STANDING DIRECTIVE
