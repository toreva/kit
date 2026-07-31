import { createHash } from 'node:crypto';
import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  COMPILE_STATEMENT_OF_INTENT_RESPONSE_STATES,
  STATEMENT_OF_INTENT_FIELD_KEYS,
  statementOfIntentSha256HashPattern,
  type CompileStatementOfIntentResponseState,
  type CompileStatementOfIntentResponseV0,
  type StatementOfIntentFieldAuthorship,
  type StatementOfIntentFieldKey,
  type StatementOfIntentFieldProvenance,
  type StatementOfIntentHash,
  type StatementOfIntentUserFields
} from '../statement-of-intent.js';

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue | undefined };

const sourceRef = 'chat_message_123';

function provenance(overrides: Partial<Record<StatementOfIntentFieldKey, StatementOfIntentFieldAuthorship>> = {}) {
  return Object.fromEntries(
    STATEMENT_OF_INTENT_FIELD_KEYS.map((field) => [
      field,
      {
        field,
        authorship: overrides[field] ?? 'missing',
        ...(overrides[field] === 'user_authored' ? { source_ref: sourceRef } : {})
      }
    ])
  ) as Record<StatementOfIntentFieldKey, StatementOfIntentFieldProvenance>;
}

function jcs(value: JsonValue): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => jcs(item)).join(',')}]`;
  }

  return `{${Object.keys(value)
    .filter((key) => value[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${jcs(value[key] as JsonValue)}`)
    .join(',')}}`;
}

function sha256Jcs(value: JsonValue) {
  return `sha256:${createHash('sha256').update(jcs(value)).digest('hex')}` as const;
}

describe('Statement of Intent v0 contract types', () => {
  it('limits financial field provenance to user authored or missing', () => {
    expectTypeOf<StatementOfIntentFieldAuthorship>().toEqualTypeOf<'user_authored' | 'missing'>();

    const field: StatementOfIntentFieldProvenance = {
      field: 'target_amount',
      authorship: 'user_authored',
      source_ref: sourceRef
    };

    expect(field.authorship).toBe('user_authored');

    // @ts-expect-error v0 does not represent model-inferred financial choices.
    const inferred: StatementOfIntentFieldAuthorship = 'model_inferred';
    expect(inferred).toBe('model_inferred');
  });

  it('limits compile responses to clarification, refusal, or review states', () => {
    expect(COMPILE_STATEMENT_OF_INTENT_RESPONSE_STATES).toEqual([
      'pending_clarification',
      'compile_refused',
      'pending_review'
    ]);
    expectTypeOf<CompileStatementOfIntentResponseState>().toEqualTypeOf<
      'pending_clarification' | 'compile_refused' | 'pending_review'
    >();

    // @ts-expect-error committed is a lifecycle state, not a compile response state.
    const committed: CompileStatementOfIntentResponseState = 'committed';
    expect(committed).toBe('committed');
  });

  it('keeps the no-movement receipt text literal', () => {
    const response = {
      contract_version: 'statement_of_intent.v0',
      primitive: 'toreva_compile_intent',
      response_id: 'res_123',
      correlation_id: 'corr_123',
      state: 'pending_review',
      human_summary: 'Review your Statement of Intent before anything happens.',
      missing_fields: [],
      conflicts: [],
      provenance: provenance(),
      context: {
        disclosed: ['raw_expression', 'user_authored_fields'],
        withheld: ['wallet.balance', 'holdings', 'venue_quotes']
      },
      nothing_has_moved: true,
      nothing_has_moved_text: 'Nothing has moved.'
    } satisfies CompileStatementOfIntentResponseV0;

    expect(response.nothing_has_moved).toBe(true);
    expect(response.nothing_has_moved_text).toBe('Nothing has moved.');
    expectTypeOf(response.nothing_has_moved).toEqualTypeOf<true>();
    expectTypeOf(response.nothing_has_moved_text).toEqualTypeOf<'Nothing has moved.'>();
  });

  it('uses sha256 lowercase hex hashes over JCS canonical material', () => {
    const fields = {} satisfies StatementOfIntentUserFields;
    const material = {
      artefact: 'StatementOfIntent',
      contract_version: 'statement_of_intent.v0',
      fields,
      provenance: {},
      statement_of_intent_id: 'soi_123',
      version: 1
    };
    const boxHash = sha256Jcs(material);

    const hash = {
      canonicalization: 'jcs',
      hash_alg: 'sha-256',
      box_hash: boxHash,
      canonical_payload_ref: 'statement_of_intent.box_material.v0'
    } satisfies StatementOfIntentHash;

    expect(hash.box_hash).toMatch(statementOfIntentSha256HashPattern);
    expect(hash.box_hash).toBe('sha256:6555559793f7ca26d8128f0bba45dd4529c4c0ecdbeff716dda1dec3229d066b');
    expect(statementOfIntentSha256HashPattern.test('sha256:' + 'A'.repeat(64))).toBe(false);
    expect(statementOfIntentSha256HashPattern.test('sha256:' + 'a'.repeat(63))).toBe(false);
  });

  it('represents the target contribution shortfall acceptance fixture', () => {
    const authoredFields = provenance({
      intent_verb: 'user_authored',
      asset: 'user_authored',
      target_amount: 'user_authored',
      target_currency: 'user_authored',
      max_contribution_amount: 'user_authored',
      contribution_currency: 'user_authored',
      contribution_frequency: 'user_authored',
      start_date: 'user_authored',
      target_date: 'user_authored',
      chain_context: 'user_authored'
    });

    const response = {
      contract_version: 'statement_of_intent.v0',
      primitive: 'toreva_compile_intent',
      response_id: 'res_shortfall',
      correlation_id: 'corr_shortfall',
      state: 'pending_clarification',
      human_summary: 'Your chosen contribution limit does not reach your target by the target date.',
      missing_fields: [],
      conflicts: [
        {
          conflict_code: 'target_contribution_shortfall',
          field_refs: [
            'target_amount',
            'max_contribution_amount',
            'contribution_frequency',
            'start_date',
            'target_date'
          ],
          human_summary: 'Your contributions add up to A$6,000, which is A$4,000 short of the A$10,000 target.',
          question: 'Do you want to increase the contribution, extend the target date, lower the target, or keep the gap explicit?',
          computed: {
            target_amount: '10000 AUD',
            contribution_total: '6000 AUD',
            gap: '4000 AUD'
          }
        }
      ],
      provenance: authoredFields,
      context: {
        disclosed: ['raw_expression', 'user_authored_fields'],
        withheld: ['wallet.balance', 'holdings', 'venue_quotes']
      },
      nothing_has_moved: true,
      nothing_has_moved_text: 'Nothing has moved.'
    } satisfies CompileStatementOfIntentResponseV0;

    expect(response.state).toBe('pending_clarification');
    expect(response.conflicts[0]?.conflict_code).toBe('target_contribution_shortfall');
    expect(response.conflicts[0]?.computed?.gap).toBe('4000 AUD');
  });

  it('represents missing required decisions as pending clarification', () => {
    const response = {
      contract_version: 'statement_of_intent.v0',
      primitive: 'toreva_compile_intent',
      response_id: 'res_missing',
      correlation_id: 'corr_missing',
      state: 'pending_clarification',
      human_summary: 'More decisions are needed before review.',
      missing_fields: [
        {
          field: 'asset',
          reason: 'required_decision_missing',
          question: 'Which asset have you chosen?'
        }
      ],
      conflicts: [],
      provenance: provenance({ intent_verb: 'user_authored' }),
      context: {
        disclosed: ['raw_expression', 'user_authored_fields'],
        withheld: ['wallet.balance', 'holdings', 'venue_quotes']
      },
      nothing_has_moved: true,
      nothing_has_moved_text: 'Nothing has moved.'
    } satisfies CompileStatementOfIntentResponseV0;

    expect(response.state).toBe('pending_clarification');
    expect(response.missing_fields[0]?.reason).toBe('required_decision_missing');
  });

  it('represents advice-seeking expressions as compile refusals', () => {
    const response = {
      contract_version: 'statement_of_intent.v0',
      primitive: 'toreva_compile_intent',
      response_id: 'res_refusal',
      correlation_id: 'corr_refusal',
      state: 'compile_refused',
      human_summary: 'This request asks Toreva to choose an asset.',
      missing_fields: [],
      conflicts: [],
      provenance: provenance(),
      context: {
        disclosed: ['raw_expression'],
        withheld: ['wallet.balance', 'holdings', 'venue_quotes']
      },
      refusal: {
        reason_code: 'regulated_financial_advice_request',
        human_reason:
          "I can't choose or recommend the crypto most likely to double. Tell Toreva the asset and limits you have chosen, and I can compile that into a Statement of Intent."
      },
      nothing_has_moved: true,
      nothing_has_moved_text: 'Nothing has moved.'
    } satisfies CompileStatementOfIntentResponseV0;

    expect(response.state).toBe('compile_refused');
    expect(response.refusal?.reason_code).toBe('regulated_financial_advice_request');
  });
});
