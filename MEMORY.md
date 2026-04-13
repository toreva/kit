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

_No entries yet — file initialised 2026-04-13._

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
