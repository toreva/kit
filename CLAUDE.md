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
