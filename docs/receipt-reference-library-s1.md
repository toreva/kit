# Toreva Receipt Reference Library S1

Status: staged design only. Do not publish, announce, or present this as a launched package.

This note stages the public surface for a future MIT reference library and CLI for verified-work receipts. It is intentionally not a receipt format specification. The implemented format must be generated from the canonical Toreva Receipt Profile v0.1, with Toreva vocabulary limited to `objectiveRef`, `authorityRef`, and `progressRef` over adopted standards.

Public positioning sentence for the wider kit remains:

"Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps to open. Everything else is free."

## One Sentence

Toreva Receipts is a small TypeScript library and CLI for issuing and verifying receipts that prove an agent did requested work within authority.

## Public API Surface

Package name recommendation: `@toreva/receipts`.

The API should fit in one sitting:

```ts
import {
  issueReceipt,
  verifyReceipt,
  loadReceiptTestVector,
  type TorevaReceipt,
  type ReceiptIssueInput,
  type ReceiptIssueOptions,
  type ReceiptVerificationResult,
  type ReceiptVerificationOptions,
  type ReceiptViolation,
  type ReceiptTestVector,
} from '@toreva/receipts';
```

Proposed functions:

- `issueReceipt(input, options)` builds a receipt from profile-compliant input, derives idempotency material, hashes evidence bytes supplied by the caller, and optionally signs the result with a caller-provided signer. It does not route, score, enforce fees, or infer authority.
- `verifyReceipt(receipt, options)` validates the receipt against the canonical profile, recomputes embedded digests from caller-supplied evidence material, checks signatures/proofs when supplied, and returns a structured result instead of throwing by default.
- `assertReceiptVerified(receipt, options)` wraps `verifyReceipt` and throws an error containing named violation fields.
- `loadReceiptTestVector(id)` loads a bundled vector by scenario id once the vector payloads are approved for release.

Minimum types:

- `TorevaReceipt` is a re-export or generated type from the canonical Toreva Receipt Profile v0.1. It must not fork the schema.
- `ReceiptIssueInput` is the minimal input needed to construct a profile-compliant receipt: subject, objective reference, authority reference, progress reference when applicable, causation, evidence kind/class, states, idempotency key, and optional evidence bytes.
- `ReceiptVerificationResult` returns `{ ok, receiptId, profileVersion, violations, evidence, authority, progress }`.
- `ReceiptViolation` uses stable `field`, `code`, and `message` properties so other implementations can compare failures.
- `ReceiptTestVector` describes the input file, expected outcome, and named assertions for conformance suites.

Network rule: verification is offline by default. Any future network lookup must go through `https://gateway.toreva.com` using the relay protocol. Direct chain RPC, direct provider API calls, internal URLs, and secrets do not belong in kit.

## CLI Surface

Binary recommendation: `toreva-receipts`.

Commands:

```bash
toreva-receipts issue --input issue.json --out receipt.json
toreva-receipts verify receipt.json
toreva-receipts verify receipt.json --evidence evidence/
toreva-receipts vectors list
toreva-receipts vectors run ./implementation-command
```

Later, only after gateway exposes a public receipt lookup, add:

```bash
toreva-receipts verify receipt_<id> --gateway https://gateway.toreva.com
```

The first public worked example must verify a real production receipt. Until then, the README may show command shape and redacted output shape, but not a fabricated success transcript.

## Format Boundary

The library implements the canonical Toreva Receipt Profile v0.1. It does not re-specify that profile.

Required alignment:

- CloudEvents 1.0 for envelope shape.
- VC 2.0 compatible proof attachment points, without claiming VC standard ownership.
- CAIP identifiers for chain and account references.
- AP2-style mandate chain concepts for authority mapping.
- Toreva-only vocabulary stays thin: `objectiveRef`, `authorityRef`, `progressRef`.

The target domain is verified work: proving an agent did what it was asked to do, within authority. The README should avoid positioning against commerce, payments, or identity standards.

## Test Vector Design

The release suite should contain eight runnable scenarios, one directory per vector:

```text
test-vectors/v0.1/
  A-direct-user-owner-direct/
    receipt.json
    evidence/
    expected.json
  B-agent-one-time-approval/
  C-agent-standing-rule/
  D-threshold-consent-obtained/
  E-prohibited-action-cancelled/
  F-failed-action-authority-preserved/
  G-refund-or-reversal-correction-link/
  H-non-financial-system-duty/
```

Each vector should include:

- `receipt.json`: a profile-compliant receipt payload.
- `evidence/`: raw evidence bytes or an empty directory with an explicit reason when unavailable.
- `expected.json`: expected verification result, required field assertions, and stable violation codes if the vector is negative.
- `README.md`: a short human explanation of the scenario and the authority/progress link under test.

The staged manifest lives at `docs/receipt-test-vector-manifest.v0.1.json`. It lists the eight scenarios but intentionally contains no synthetic receipt payloads. Payloads should be copied from production-safe or profile-owned fixtures only after the release gate is cleared.

## README Structure

The future package README should be the public specification:

1. Top-level heading: `Toreva Receipts`
2. One-sentence verified-work description.
3. Status line: production-ready only after the real receipt example exists.
4. Install:
   - `npm install @toreva/receipts`
   - `npx @toreva/receipts verify <receipt.json>`
5. Worked example:
   - command
   - real production receipt id
   - verification output
   - no account or token required for verification
6. API:
   - `issueReceipt`
   - `verifyReceipt`
   - minimum types
7. Test vectors:
   - how to run them against this library
   - how to run them against another implementation
8. Format boundary:
   - implements the canonical profile
   - no new industry standard claim
9. Scope:
   - verified work only
   - offline verification by default
   - gateway-only network access
10. Security and privacy:
   - no secrets
   - evidence digests instead of hidden inputs
   - no private keys in fixtures
11. License.

## License Recommendation

MIT. The repository already uses MIT, and the goal is broad copying and implementation compatibility. Do not add a more restrictive license unless legal review identifies a specific reason.

## Publication Gate

Publication is not safe until all of the following exist:

- At least one real production receipt that is public, stable, and safe to show.
- A fresh clone can run one command and verify that receipt without a Toreva account.
- The canonical Toreva Receipt Profile v0.1 is exported as a stable dependency or generated artifact for kit.
- The eight vector payloads are frozen and runnable against an independent implementation.
- Gateway receipt retrieval, if used, is public, unauthenticated for that receipt, and limited to `gateway.toreva.com`.
- The README worked example uses the real production receipt and real output.
- The package has CI coverage for issue, verify, vector loading, and gateway-only network compliance.
- Explicit release approval exists for publication.

## Not Built

- No receipt library implementation was built in this stage because the canonical profile remains the source of truth.
- No CLI command was wired because there is not yet a public production receipt to verify.
- No fixture payloads were created because fabricated receipt examples would undermine the publication gate.
- No npm package was published or versioned.
- No root README launch copy was added.
- No schema fork, new standard, direct chain verifier, business logic, routing logic, scoring logic, fee enforcement, or internal endpoint was introduced.
