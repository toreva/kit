import { describe, expect, it } from 'vitest';
import {
  TOREVA_INTENT_BOX_RENDER_CONTRACT_VERSION,
  TOREVA_INTENT_BOX_RENDER_STATE_SPECS,
  TOREVA_INTENT_BOX_STATES,
  buildAuthorityStateBox,
  buildIntentBoxFromCompileResponse,
  buildReceiptBoxFromCommittedStatement,
  intentBoxStateFromCompileResponse,
  summarizeStatementOfIntent,
  type TorevaIntentBoxState
} from '../intent-box.js';
import type {
  CommittedStatementOfIntentV0,
  CompileStatementOfIntentResponseV0,
  StatementOfIntentFieldKey,
  StatementOfIntentFieldProvenance,
  StatementOfIntentHash
} from '../statement-of-intent.js';
import { STATEMENT_OF_INTENT_FIELD_KEYS } from '../statement-of-intent.js';

const boxHash: StatementOfIntentHash = {
  canonicalization: 'jcs',
  hash_alg: 'sha-256',
  box_hash: `sha256:${'a'.repeat(64)}`,
  canonical_payload_ref: 'statement_of_intent.box_material.v0'
};

function provenance(): Record<StatementOfIntentFieldKey, StatementOfIntentFieldProvenance> {
  return Object.fromEntries(
    STATEMENT_OF_INTENT_FIELD_KEYS.map((field) => [
      field,
      {
        field,
        authorship: 'missing'
      }
    ])
  ) as Record<StatementOfIntentFieldKey, StatementOfIntentFieldProvenance>;
}

function compileResponse(
  overrides: Partial<CompileStatementOfIntentResponseV0> = {}
): CompileStatementOfIntentResponseV0 {
  return {
    contract_version: 'statement_of_intent.v0',
    primitive: 'toreva_compile_intent',
    response_id: 'res_123',
    correlation_id: 'corr_123',
    state: 'pending_review',
    human_summary: 'Review your Statement of Intent before anything happens.',
    structured_draft: {
      statement_of_intent_id: 'soi_123',
      version: 1,
      state: 'pending_review',
      artefact: 'StatementOfIntent',
      fields: {
        intent_verb: 'buy',
        asset: { asset_kind: 'symbol', symbol: 'SOL' },
        target_amount: '500',
        target_currency: 'AUD',
        max_contribution_amount: '500',
        contribution_currency: 'AUD',
        contribution_frequency: 'monthly'
      },
      provenance: provenance(),
      chain_context: {
        chain_id: 'solana:mainnet',
        chain_selected_by: 'user_authored'
      }
    },
    canonical_box_hash: boxHash,
    missing_fields: [],
    conflicts: [],
    provenance: provenance(),
    context: {
      disclosed: ['raw_expression', 'user_authored_fields'],
      withheld: ['wallet.balance', 'holdings', 'venue_quotes']
    },
    review_url: 'https://gateway.toreva.com/mcp/drafts/review-token',
    nothing_has_moved: true,
    nothing_has_moved_text: 'Nothing has moved.',
    ...overrides
  };
}

function committedStatement(): CommittedStatementOfIntentV0 {
  const compiled = compileResponse();
  return {
    contract_version: 'statement_of_intent.v0',
    statement_of_intent_id: 'soi_123',
    version: 1,
    state: 'committed',
    box_id: 'box_123',
    subject_id: 'subj_123',
    structured_draft: compiled.structured_draft!,
    canonical_box_hash: boxHash,
    receipt_id: 'receipt_123'
  };
}

describe('Toreva conversational box render contract', () => {
  it('names the five renderer states and grammar CSS hooks for Claude and ChatGPT', () => {
    expect(TOREVA_INTENT_BOX_RENDER_CONTRACT_VERSION).toBe('toreva_box.intent.v1');
    expect(TOREVA_INTENT_BOX_STATES).toEqual([
      'Intent-Draft',
      'Conflict',
      'Ready-for-Review',
      'Receipt',
      'Authority-state'
    ] satisfies TorevaIntentBoxState[]);

    expect(TOREVA_INTENT_BOX_RENDER_STATE_SPECS['Intent-Draft'].box_class).toBe('ibox ibox--draft');
    expect(TOREVA_INTENT_BOX_RENDER_STATE_SPECS.Conflict.box_class).toBe('ibox ibox--conflict');
    expect(TOREVA_INTENT_BOX_RENDER_STATE_SPECS['Ready-for-Review'].box_class).toBe('ibox ibox--ready');
    expect(TOREVA_INTENT_BOX_RENDER_STATE_SPECS.Receipt.box_class).toBe('ibox ibox--receipt');
    expect(TOREVA_INTENT_BOX_RENDER_STATE_SPECS['Authority-state'].box_class).toBe('ibox ibox--authority');
  });

  it('maps Gateway compile responses to draft, conflict, and ready boxes', () => {
    const ready = compileResponse();
    const conflict = compileResponse({
      state: 'pending_clarification',
      conflicts: [
        {
          conflict_code: 'target_contribution_shortfall',
          field_refs: ['target_amount', 'max_contribution_amount'],
          human_summary: 'A$4,000 short.',
          question: 'Do you want to fix it or keep the gap explicit?'
        }
      ]
    });
    const draft = compileResponse({
      state: 'pending_clarification',
      structured_draft: undefined,
      canonical_box_hash: undefined,
      missing_fields: [
        {
          field: 'asset',
          reason: 'required_decision_missing',
          question: 'Which asset have you chosen?'
        }
      ]
    });
    const refused = compileResponse({
      state: 'compile_refused',
      structured_draft: undefined,
      canonical_box_hash: undefined,
      review_url: undefined,
      refusal: {
        reason_code: 'regulated_financial_advice_request',
        human_reason: 'Toreva cannot choose an asset for you.'
      }
    });

    expect(intentBoxStateFromCompileResponse(ready)).toBe('Ready-for-Review');
    expect(intentBoxStateFromCompileResponse(conflict)).toBe('Conflict');
    expect(intentBoxStateFromCompileResponse(draft)).toBe('Intent-Draft');
    expect(intentBoxStateFromCompileResponse(refused)).toBeNull();
  });

  it('builds Claude and ChatGPT render payloads with no-movement receipts', () => {
    const box = buildIntentBoxFromCompileResponse(compileResponse(), { surface: 'claude' });

    expect(box?.surface).toBe('claude');
    expect(box?.state).toBe('Ready-for-Review');
    expect(box?.primary_text).toBe('Buy A$500 of SOL.');
    expect(box?.nothing_has_moved).toBe(true);
    expect(box?.nothing_has_moved_text).toBe('Nothing has moved.');
    expect(box?.cta.href).toBe('https://gateway.toreva.com/mcp/drafts/review-token');

    const chatgptBox = buildIntentBoxFromCompileResponse(compileResponse(), { surface: 'chatgpt' });
    expect(chatgptBox?.surface).toBe('chatgpt');
    expect(chatgptBox?.box_class).toBe('ibox ibox--ready');
  });

  it('builds receipt and authority-state boxes without introducing authority beyond none or ask-first', () => {
    const receipt = buildReceiptBoxFromCommittedStatement(committedStatement(), { surface: 'chatgpt' });
    expect(receipt.state).toBe('Receipt');
    expect(receipt.source?.receipt_id).toBe('receipt_123');
    expect(receipt.nothing_has_moved_text).toBe('Nothing has moved.');

    const noAuthority = buildAuthorityStateBox({ surface: 'claude', authority_state: 'none' });
    expect(noAuthority.state).toBe('Authority-state');
    expect(noAuthority.primary_text).toBe('No authority.');
    expect(noAuthority.nothing_has_moved_text).toBeUndefined();
    expect(noAuthority.detail_rows.map((row) => row.value)).toEqual(['Record only', 'No moves', 'No trades']);

    const askFirst = buildAuthorityStateBox({
      surface: 'chatgpt',
      authority_state: 'ask_first',
      permission_labels: ['Buy SOL']
    });
    expect(askFirst.primary_text).toBe('Ask first.');
    expect(askFirst.detail_rows).toEqual([{ label: 'Permission', value: 'Buy SOL' }]);
  });

  it('summarizes only user-provided statement fields for display', () => {
    expect(
      summarizeStatementOfIntent({
        intent_verb: 'buy',
        asset: { asset_kind: 'symbol', symbol: 'SOL' },
        target_amount: '500',
        target_currency: 'AUD'
      })
    ).toBe('Buy A$500 of SOL.');
  });
});
