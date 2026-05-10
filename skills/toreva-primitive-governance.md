# toreva_skill_governance

## When to use

Use this skill to inspect Toreva primitives in the DAO and governance family, including venue/provider plan, readiness, pricing class, and public executable status.

## Access

- MCP catalog tool: `toreva_primitives` with `familyId: "governance"`
- Taxonomy access point: `taxonomy://primitive-family/governance`
- Primary venue/provider: `realms-spl-governance`
- Secondary/watchlist: `squads-watchlist`

## Primitive entries

- `exec.governance_vote` (authority, control_or_authority_gated)
- `exec.governance_delegate` (authority, control_or_authority_gated)
- `exec.proposal_create` (authority, control_or_authority_gated)
- `exec.proposal_execute` (authority, control_or_authority_gated)
- `exec.proposal_cancel` (authority, control_or_authority_gated)
- `exec.governance_undelegate` (authority, control_or_authority_gated)
- `exec.governance_proposal_query` (read, data_transaction_0_bps)
- `exec.governance_treasury_transfer` (authority, control_or_authority_gated)

## Common pitfalls

- Do not infer battle-tested status from catalog presence.
- Do not execute candidate primitives unless a public executable MCP/API tool is listed.
- Do not bypass venue admission, risk approval, receipts, monitoring, or revocation evidence.
