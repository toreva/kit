import type {
  CommittedStatementOfIntentV0,
  CompileStatementOfIntentResponseV0,
  StatementOfIntentSha256Hash,
  StatementOfIntentUserFields
} from './statement-of-intent.js';

export const TOREVA_INTENT_BOX_RENDER_CONTRACT_VERSION = 'toreva_box.intent.v1' as const;

export const TOREVA_INTENT_BOX_SURFACES = ['claude', 'chatgpt'] as const;

export type TorevaIntentBoxSurface = (typeof TOREVA_INTENT_BOX_SURFACES)[number];

export const TOREVA_INTENT_BOX_STATES = [
  'Intent-Draft',
  'Conflict',
  'Ready-for-Review',
  'Receipt',
  'Authority-state'
] as const;

export type TorevaIntentBoxState = (typeof TOREVA_INTENT_BOX_STATES)[number];

export const TOREVA_INTENT_BOX_CLASS_BY_STATE = {
  'Intent-Draft': 'ibox ibox--draft',
  Conflict: 'ibox ibox--conflict',
  'Ready-for-Review': 'ibox ibox--ready',
  Receipt: 'ibox ibox--receipt',
  'Authority-state': 'ibox ibox--authority'
} as const satisfies Record<TorevaIntentBoxState, string>;

export type TorevaIntentBoxClass = (typeof TOREVA_INTENT_BOX_CLASS_BY_STATE)[TorevaIntentBoxState];

export interface TorevaIntentBoxRenderStateSpec {
  state: TorevaIntentBoxState;
  box_class: TorevaIntentBoxClass;
  aria_label: string;
  badge: string;
  cta_label: string;
  app_surface: 'Home' | 'Plans' | 'Activity' | 'Control';
  shows_nothing_moved_tag: boolean;
}

export const TOREVA_INTENT_BOX_RENDER_STATE_SPECS = {
  'Intent-Draft': {
    state: 'Intent-Draft',
    box_class: TOREVA_INTENT_BOX_CLASS_BY_STATE['Intent-Draft'],
    aria_label: 'Toreva intent captured',
    badge: 'Intent captured',
    cta_label: 'Review in Toreva',
    app_surface: 'Home',
    shows_nothing_moved_tag: true
  },
  Conflict: {
    state: 'Conflict',
    box_class: TOREVA_INTENT_BOX_CLASS_BY_STATE.Conflict,
    aria_label: 'Toreva conflict detected',
    badge: 'Conflict',
    cta_label: 'Resolve in Toreva',
    app_surface: 'Plans',
    shows_nothing_moved_tag: true
  },
  'Ready-for-Review': {
    state: 'Ready-for-Review',
    box_class: TOREVA_INTENT_BOX_CLASS_BY_STATE['Ready-for-Review'],
    aria_label: 'Toreva intent ready for review',
    badge: 'Ready',
    cta_label: 'Review in Toreva',
    app_surface: 'Home',
    shows_nothing_moved_tag: true
  },
  Receipt: {
    state: 'Receipt',
    box_class: TOREVA_INTENT_BOX_CLASS_BY_STATE.Receipt,
    aria_label: 'Toreva decision saved receipt',
    badge: 'Decision saved',
    cta_label: 'View receipt',
    app_surface: 'Activity',
    shows_nothing_moved_tag: true
  },
  'Authority-state': {
    state: 'Authority-state',
    box_class: TOREVA_INTENT_BOX_CLASS_BY_STATE['Authority-state'],
    aria_label: 'Toreva authority state',
    badge: 'Authority',
    cta_label: 'Control in Toreva',
    app_surface: 'Control',
    shows_nothing_moved_tag: false
  }
} as const satisfies Record<TorevaIntentBoxState, TorevaIntentBoxRenderStateSpec>;

export interface TorevaIntentBoxDetailRow {
  label: string;
  value: string;
}

export interface TorevaIntentBoxSourceRef {
  primitive?: 'toreva_compile_intent';
  response_id?: string;
  statement_of_intent_id?: string;
  statement_version?: number;
  receipt_id?: string;
  box_hash?: StatementOfIntentSha256Hash;
}

export interface TorevaIntentBoxRenderPayloadV1 {
  contract_version: typeof TOREVA_INTENT_BOX_RENDER_CONTRACT_VERSION;
  surface: TorevaIntentBoxSurface;
  state: TorevaIntentBoxState;
  box_class: TorevaIntentBoxClass;
  aria_label: string;
  badge: string;
  primary_text: string;
  secondary_text?: string;
  cta: {
    label: string;
    href?: string;
  };
  detail_rows: TorevaIntentBoxDetailRow[];
  source?: TorevaIntentBoxSourceRef;
  nothing_has_moved?: true;
  nothing_has_moved_text?: 'Nothing has moved.';
}

export interface BuildTorevaIntentBoxOptions {
  surface: TorevaIntentBoxSurface;
  href?: string;
}

export type TorevaAuthorityBoxState = 'none' | 'ask_first';

export interface BuildTorevaAuthorityStateBoxInput extends BuildTorevaIntentBoxOptions {
  authority_state: TorevaAuthorityBoxState;
  permission_labels?: readonly string[];
  receipt_id?: string;
}

function specFor(state: TorevaIntentBoxState): TorevaIntentBoxRenderStateSpec {
  return TOREVA_INTENT_BOX_RENDER_STATE_SPECS[state];
}

function withNoMovementTag(
  payload: Omit<TorevaIntentBoxRenderPayloadV1, 'nothing_has_moved' | 'nothing_has_moved_text'>,
  state: TorevaIntentBoxState
): TorevaIntentBoxRenderPayloadV1 {
  if (!specFor(state).shows_nothing_moved_tag) return payload;
  return {
    ...payload,
    nothing_has_moved: true,
    nothing_has_moved_text: 'Nothing has moved.'
  };
}

function formatMoney(amount?: string, currency?: string): string | undefined {
  if (!amount || !currency) return undefined;
  if (currency === 'AUD') return `A$${amount}`;
  if (currency === 'USD') return `US$${amount}`;
  return `${amount} ${currency}`;
}

function assetLabel(fields: StatementOfIntentUserFields): string | undefined {
  return fields.asset?.symbol ?? fields.asset?.caip19;
}

function reopeningConditionLabel(fields: StatementOfIntentUserFields): string | undefined {
  return fields.intent_primitives?.entries.find(
    (entry) => entry.primitive_id === 'when.reopening_condition',
  )?.human_readable;
}

export function summarizeStatementOfIntent(fields: StatementOfIntentUserFields): string {
  const verb = fields.intent_verb ? fields.intent_verb.charAt(0).toUpperCase() + fields.intent_verb.slice(1) : undefined;
  const target = formatMoney(fields.target_amount, fields.target_currency);
  const asset = assetLabel(fields);
  const reopeningCondition = reopeningConditionLabel(fields);

  if (verb && target && asset) return `${verb} ${target} of ${asset}.`;
  if (verb && asset) return `${verb} ${asset}.`;
  if (target && asset) return `${target} of ${asset}.`;
  if (fields.goal_context) return fields.goal_context.endsWith('.') ? fields.goal_context : `${fields.goal_context}.`;
  if (reopeningCondition) return `Wait until ${reopeningCondition}.`;
  if (verb) return `${verb}.`;
  return 'Statement of Intent.';
}

function detailRowsFromFields(fields: StatementOfIntentUserFields): TorevaIntentBoxDetailRow[] {
  const rows: TorevaIntentBoxDetailRow[] = [];
  const target = formatMoney(fields.target_amount, fields.target_currency);
  const contribution = formatMoney(fields.max_contribution_amount, fields.contribution_currency);

  if (target) rows.push({ label: 'Target', value: target });
  if (contribution) rows.push({ label: 'Contribution max', value: contribution });
  if (fields.contribution_frequency) rows.push({ label: 'Frequency', value: fields.contribution_frequency });
  if (fields.target_date) rows.push({ label: 'Target date', value: fields.target_date });
  const reopeningCondition = reopeningConditionLabel(fields);
  if (reopeningCondition) rows.push({ label: 'Reopen when', value: reopeningCondition });

  return rows;
}

export function intentBoxStateFromCompileResponse(
  response: CompileStatementOfIntentResponseV0
): 'Intent-Draft' | 'Conflict' | 'Ready-for-Review' | null {
  if (response.state === 'compile_refused') return null;
  if (response.conflicts.length > 0) return 'Conflict';
  if (response.state === 'pending_review') return 'Ready-for-Review';
  return 'Intent-Draft';
}

export function buildIntentBoxFromCompileResponse(
  response: CompileStatementOfIntentResponseV0,
  options: BuildTorevaIntentBoxOptions
): TorevaIntentBoxRenderPayloadV1 | null {
  const state = intentBoxStateFromCompileResponse(response);
  if (!state) return null;

  const spec = specFor(state);
  const fields = response.structured_draft?.fields ?? {};
  const primaryText = state === 'Conflict'
    ? response.conflicts[0]?.human_summary ?? response.human_summary
    : summarizeStatementOfIntent(fields);

  return withNoMovementTag(
    {
      contract_version: TOREVA_INTENT_BOX_RENDER_CONTRACT_VERSION,
      surface: options.surface,
      state,
      box_class: spec.box_class,
      aria_label: spec.aria_label,
      badge: spec.badge,
      primary_text: primaryText,
      secondary_text: response.human_summary,
      cta: {
        label: spec.cta_label,
        href: response.review_url ?? response.draft?.review_url ?? options.href
      },
      detail_rows: detailRowsFromFields(fields),
      source: {
        primitive: response.primitive,
        response_id: response.response_id,
        statement_of_intent_id: response.structured_draft?.statement_of_intent_id,
        statement_version: response.structured_draft?.version,
        box_hash: response.canonical_box_hash?.box_hash
      }
    },
    state
  );
}

export function buildReceiptBoxFromCommittedStatement(
  statement: CommittedStatementOfIntentV0,
  options: BuildTorevaIntentBoxOptions
): TorevaIntentBoxRenderPayloadV1 {
  const state = 'Receipt';
  const spec = specFor(state);

  return withNoMovementTag(
    {
      contract_version: TOREVA_INTENT_BOX_RENDER_CONTRACT_VERSION,
      surface: options.surface,
      state,
      box_class: spec.box_class,
      aria_label: spec.aria_label,
      badge: spec.badge,
      primary_text: summarizeStatementOfIntent(statement.structured_draft.fields),
      secondary_text: 'Decision saved.',
      cta: {
        label: spec.cta_label,
        href: options.href
      },
      detail_rows: detailRowsFromFields(statement.structured_draft.fields),
      source: {
        statement_of_intent_id: statement.statement_of_intent_id,
        statement_version: statement.version,
        receipt_id: statement.receipt_id,
        box_hash: statement.canonical_box_hash.box_hash
      }
    },
    state
  );
}

export function buildAuthorityStateBox(input: BuildTorevaAuthorityStateBoxInput): TorevaIntentBoxRenderPayloadV1 {
  const state = 'Authority-state';
  const spec = specFor(state);
  const isAskFirst = input.authority_state === 'ask_first';

  return {
    contract_version: TOREVA_INTENT_BOX_RENDER_CONTRACT_VERSION,
    surface: input.surface,
    state,
    box_class: spec.box_class,
    aria_label: spec.aria_label,
    badge: spec.badge,
    primary_text: isAskFirst ? 'Ask first.' : 'No authority.',
    secondary_text: isAskFirst ? 'Toreva asks before acting.' : 'Record only. No moves. No trades.',
    cta: {
      label: spec.cta_label,
      href: input.href
    },
    detail_rows: isAskFirst
      ? (input.permission_labels ?? []).map((value) => ({ label: 'Permission', value }))
      : [
          { label: 'Mode', value: 'Record only' },
          { label: 'Moves', value: 'No moves' },
          { label: 'Trades', value: 'No trades' }
        ],
    source: input.receipt_id ? { receipt_id: input.receipt_id } : undefined
  };
}
