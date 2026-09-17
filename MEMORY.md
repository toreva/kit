# MEMORY — kit

**Layer-2 curated intelligence.** Read this at the START of every session. Append curated entries at the END of every session.

This file is distinct from:
- `CLAUDE.md` / `AGENTS.md` — instructions, conventions, rules
- Tool-specific auto-memory — Claude Code `.memory/`, Codex `~/.codex/memories/`, Cursor DB, Copilot workspace
- Org-wide memory — `/memory/objects/` (promoted from here)

Full spec: [`/memory/playbooks/layer-2-memory-file.md`](../memory/playbooks/layer-2-memory-file.md)

## Session-start protocol

1. Read **Active lessons** and **Open questions** below — apply them before acting.
2. Check **Recent decisions** for anything that supersedes your current direction.
3. At session end, distil learnings (not tasks done) and append qualifying entries to the appropriate section using the YAML template.

## Quality gate (all five must hold)

1. **Future-relevant** — useful beyond the current task
2. **Non-obvious** — not derivable from code, charters, or docs
3. **Actionable** — shapes a future decision or approach
4. **Traceable** — has a source (session ref, PR, doc)
5. **Durable** — half-life ≥ 7 days

Reject conversation context, one-off task state, things already documented elsewhere, PII/credentials, unreleased commercial strategy, opinions without evidence.

## Entry template

```yaml
- id: mem.kit.yyyymmdd.slug
  title: short title
  type: decision | pattern | lesson | constraint | assumption | anti-pattern
  captured: YYYY-MM-DD
  source: claude-code | codex | cursor | copilot | human
  session_ref: optional path/hash
  objectives: [OBJ-08, OBJ-14]
  summary: high-signal statement (not raw transcript)
  applies_when: trigger context cue for future sessions
  evidence: anecdotal | repeated | measured
  promote: local | candidate
```

Objective IDs: see `coordinator/bus/registries/system-objectives.v1.json` (OBJ-01..OBJ-20).

---

## Active lessons

Curated Pareto entries — keep top ~20 by utility. Overflow migrates to **Superseded / retired**.

- id: mem.kit.20260917.repo-frozen-is-not-one-cause
  title: "repo_frozen" detector must not assume the ai-engine phantom-check root cause
  type: lesson
  captured: 2026-09-17
  source: claude-code
  session_ref: intake/processed/2026-09-17/2026-09-17-po-kit-founder-proxy-finding-routed-by-po-repo-frozen-1-*.md
  objectives: [OBJ-08]
  summary: >
    kit was flagged repo_frozen (4 open PRs, 0 merges in ~14 days) with a prior
    from ai-engine's incident: a required status check with no reporting
    workflow. That specific cause did not reproduce here — kit's only required
    check ("build") passes on every open PR. The real causes were three
    unrelated things masquerading as one symptom: (1) two June PRs (#19, #20)
    proposing content (earn/perps skills, founder-narrative/rollback-path
    scaffolding) that later commits (#45, #46) deliberately purged from the
    repo's direction — stale-by-obsolescence, not stuck; (2) a July P0 PR
    (#29) genuinely blocked on an external npm-publish credential gap
    (ENEEDAUTH, no Trusted Publisher configured) that this repo cannot fix
    from inside its own tree; (3) one draft PR (#32) correctly, intentionally
    gated behind explicit release approval per its own PR body — not frozen,
    working as designed. Closed #19/#20, left #29 open with findings
    commented (also caught it silently removing the founder-mandated
    2026-05-10 litmus gate and reintroducing purged Solana-positioning
    copy — flagged as Class A, not merged unilaterally), left #32 alone.
  applies_when: any repo_frozen / stuck-PR finding, in this repo or elsewhere in the fleet
  evidence: measured
  promote: candidate

---

## Open questions

Live unknowns that should inform the next session's direction.

_No entries yet._

---

## Recent decisions

Decisions with rationale. Material decisions also emit `docs/decisions/DEC-*.md`.

_No entries yet._

---

## Superseded / retired

Entries moved out of Active — kept for history.

_No entries yet._
