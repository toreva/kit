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
