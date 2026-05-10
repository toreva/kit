# Public Discovery Guidance

This repo is the public source of truth for Toreva Kit documentation and
integration examples.

The intended discovery surfaces are:

- `https://github.com/toreva/kit` for docs, skills, SDK, CLI, and examples
- `https://mcp.toreva.com` for remote MCP access
- `https://gateway.toreva.com/openapi.json` for the stable public relay schema
- `https://gateway.toreva.com/.well-known/toreva-kit.json` for machine-readable
  package and endpoint pointers
- `https://gateway.toreva.com/.well-known/toreva-primitive-readiness.json` for
  evidence-gated primitive family readiness
- `https://gateway.toreva.com/.well-known/toreva-primitive-catalog.json` for
  the full primitive metadata dictionary
- `https://gateway.toreva.com/relay/tools` for the public tool catalog
- `docs/primitive-readiness.json` for the repo-local readiness fixture used by
  SDK, MCP, CLI, skills, and docs tests
- `docs/primitive-metadata.json` for the repo-local primitive dictionary used by
  agents and generated skill access points

This file is informational only. It does not define a server implementation or
internal operating procedure.

## Suggested manifest shape

The `.well-known/toreva-kit.json` payload should keep the public pointers small
and stable:

```json
{
  "version": "1",
  "repo_url": "https://github.com/toreva/kit",
  "openapi_url": "https://gateway.toreva.com/openapi.json",
  "mcp_remote_url": "https://mcp.toreva.com",
  "skills_url": "https://github.com/toreva/kit/tree/main/skills",
  "primitive_readiness_url": "https://gateway.toreva.com/.well-known/toreva-primitive-readiness.json",
  "primitive_catalog_url": "https://gateway.toreva.com/.well-known/toreva-primitive-catalog.json",
  "sdk_packages": [
    "@toreva/sdk",
    "@toreva/cli",
    "@toreva/mcp",
    "@toreva/types"
  ]
}
```

## Public doc baseline

Public-facing docs should lead with:

"Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. Data transactions are free. External value transactions are 2 bps."

They should also explain the request envelope clearly:

- `requestId` is the relay idempotency key
- `clientRequestId` is the downstream correlation id when supported
- `venue` is the canonical schema field name

## Surface readiness rules

- Treat perps as the public reference pattern for tools, receipts, and relay
  examples.
- Do not introduce new public verb names until IA locks canonical ids and
  alias policy.
- Prepare future family docs in this order: Earn/pre-Earn, basic trade/swap,
  staking, options, commerce/token movement, prediction markets, NFTs,
  advanced trading, DAO, token ops/DCA/claims, vaults, LP, bridge/wrap.
- Call a family integration-ready only when Gateway, Network, Venue, Risk, and
  Receipt evidence all exist.
- Do not claim live-funds readiness without PO evidence.
- Use `integration_ready`, `canary_ready`, and `battle_tested` exactly as
  defined in the primitive readiness catalog. Taxonomy alone is never
  operational proof.
- Use `toreva_primitives` over MCP for the full primitive dictionary, including
  family skill access points and primary venue/provider mappings.
