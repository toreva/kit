# Claude Code Agent Prompt

Use this prompt when asking a coding agent to integrate Toreva perps.

```text
Use the public Toreva Kit repo as the source of truth:

- https://github.com/toreva/kit
- docs/agentic-perps-integration-patterns.md
- docs/toreva-perps.openapi.json
- examples/agentic-perps-workflow/

Do not use toreva.com/docs as the integration source. The consumer website is
intentionally narrow for the current launch phase; Kit is the public SDK,
MCP, Skills, CLI, and API contract surface.

Build a Toreva integration that:

1. Calls toreva_establish to bind a human wallet to a Toreva/Swig master
   authority and a Pacifica child perps capability.
2. Calls toreva_perps_query_venues and toreva_perps_simulate before execution.
3. Opens positions with toreva_perps_long or toreva_perps_short using:
   walletAddress, token, sizeUsd, leverage, collateralToken, collateralAmount.
4. Uses toreva_perps_close, toreva_perps_cancel_order, and
   toreva_perps_funding_settle for lifecycle management.
5. Omits venue for best-execution routing unless the user explicitly chooses a
   venue. If Pacifica is selected, treat the Pacifica API agent wallet as a
   child capability bound to the human wallet through Toreva.
6. Never asks for raw private keys, seed phrases, API secrets, or signer
   material. Use only public keys, signer references, approvals, receipts, and
   relay tokens.
7. Requires explicit human approval before funding moves, signer binding,
   leverage increases, policy expansion, or real-funds execution.

Validate all payloads against docs/toreva-perps.openapi.json and the schemas in
packages/types/src/intents.ts and packages/types/src/perps.ts. Then run:

pnpm test
pnpm typecheck
pnpm build
```
