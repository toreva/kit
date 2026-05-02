# kit — Backup, restore, persistence

**Agent:** `kit-agent` · **Repo:** `kit` · **Domain:** `customer-external`

What's permanent for this agent, where it lives, and how it survives
catastrophic loss of the operator's laptop, local filesystem, or GitHub.

## Source-of-truth map

| Artefact | Permanent home | Ephemeral copy | Recoverable from |
|---|---|---|---|
| Code | GitHub `<github_org>/<home_repo>` | local `~/toreva_vs/<home_repo>` | GitHub remote |
| `MEMORY.md` | GitHub | local | GitHub + memory-archive sweep |
| `intake/processed/` (audit trail) | GitHub | local | GitHub remote |
| `intake/responses/` (working drafts) | local only (gitignored on `open-public`) | local | NOT recoverable — by design |
| Bus envelopes | `toreva-prod.coordinator_audit_prod.bus_events` (BigQuery) | none | BQ time-travel + GCS export |
| Runtime SA credentials | GCP Secret Manager | runtime SA key cache | IAC dispatch to re-issue |
| Per-agent GH identity | GitHub Org settings + GCP Secret Manager | runtime cache | IAC + IAM joint dispatch |

## Recovery scenarios

### Scenario A — operator laptop dies

1. Provision new device.
2. Re-clone `~/toreva_vs/<home_repo>` from GitHub.
3. `MEMORY.md` survives (GitHub-resident).
4. `intake/responses/` (work-in-progress drafts) is **not recoverable** for
   `open-public` tier (gitignored to prevent leakage); `normal`/`hardened`
   tier may be recoverable via GitHub if committed.
5. Re-launch supervisor: `coordinator/scripts/supervisor.sh restart kit-agent`.

### Scenario B — local filesystem corruption

Same as Scenario A.

### Scenario C — GitHub repo deleted / corrupted / org-level outage

1. IAC dispatches a restore from the most recent GitHub-org-level backup
   (target: GCS bucket `gs://toreva-prod-iam-backups/<github_org>/<home_repo>/`).
2. Frequency: nightly snapshot via IAC's GitHub-backup workflow. **Not yet
   provisioned for every agent — see G2.13.**
3. Re-push to a fresh GitHub repo if the original cannot be restored.

### Scenario D — Bus-history dataset corruption

Coordinator-owned. Out of this agent's scope. See coordinator's runbook.

## What is intentionally NOT permanent

- `intake/responses/` work-in-progress drafts for `open-public` tier
- Local `node_modules/`, `__pycache__/`, build outputs
- Anything in `*.local.md` files
