# CLASS-011 remediation: Pacifica recovery account queries

## Finding

- `account` at `examples/recovery/recovery.ts:91`
- `account` at `examples/recovery/recovery.ts:121`

## Triage

True positive. The recovery example produced Pacifica `account` query
parameters with raw inline strings, and no local reader probe proved a consumer
read those fields.

## Producer/Consumer Contract

Contract family: `kit.examples.recovery.pacifica_account_query.v1`

| Producer | Consumer | Endpoint | Field |
| --- | --- | --- | --- |
| `kit.examples.recovery.recoverFromPacifica` | `pacifica.recovery.positions.by_account.v1` | `/positions` | `account` |
| `kit.examples.recovery.recoverFromPacifica` | `pacifica.recovery.balances.by_account.v1` | `/account/balances` | `account` |

The producer now builds both query strings through
`buildPacificaAccountQueryPath(...)`, using `URLSearchParams` and the named
contract table in `examples/recovery/recovery.ts`.

## Reader Probe

`examples/recovery/recovery.test.ts` installs a fake Pacifica `fetch` reader,
runs `recoverFromPacifica`, and fails unless both `/positions` and
`/account/balances` read the expected `account` value.

## CI Gate

Vitest now includes `examples/**/*.test.ts`, and GitHub Actions runs
`pnpm test` after build and typecheck.

## Broken-Window Backdating

- `introduced_at`: pre-existing before the 2026-08-24 Kernel CLASS-011 sweep.
- `detected_at`: 2026-08-24T14:45:11Z.
- `fixed_at`: 2026-08-25.
- `affected_population`: developers using
  `examples/recovery/recovery.ts` as the Pacifica custody-recovery example.
- `remediation_status`: repaired by named contract, reader probe, and CI gate.

## Remediation Receipts

| Receipt | Evidence |
| --- | --- |
| `kit:class-011:pacifica-recovery-account:contract` | `examples/recovery/recovery.ts` named contract table |
| `kit:class-011:pacifica-recovery-account:reader-probe` | `examples/recovery/recovery.test.ts` |
| `kit:class-011:pacifica-recovery-account:ci-gate` | `.github/workflows/ci.yml` and `vitest.config.ts` |
