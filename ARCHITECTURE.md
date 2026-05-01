# kit — Architecture

**Agent:** `kit-agent` · **Repo:** `kit` · **Domain:** `customer-external`

> **TODO (kit-agent):** This file is a stub. Fill it before promoting
> from `dormant` to `active`. The fleet audit checks for stub-level
> content and flags it as a G2.3 gap.

## What this system does

> One paragraph, ELI10. What problem does this agent solve? Who is it for?

## How it fits into Toreva

> Diagram or bullet list. Upstream inputs (other agents this consumes from).
> Downstream outputs (other agents this produces for). Bus topics published.
> Bus topics subscribed.

## Internal shape

> Module / package / service breakdown. Where does state live? What's
> permanent (in DB / GCS / GitHub)? What's ephemeral (in memory / tmp)?

## Invariants

> Things that MUST be true. E.g. "We never sign on behalf of a user."
> "Every action publishes a receipt envelope." "Air-gap = zero, ever."

## Failure modes

> Known failure scenarios + how the system degrades. Fail-open vs fail-closed.

## External dependencies

> Third-party services, GCP services, on-chain programs.

## Decisions log

See [`docs/decisions/`](./docs/decisions/) for material architectural
decisions (DEC- or ADR- documents).
