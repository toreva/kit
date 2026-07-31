export type StatementOfIntentState =
  | 'draft'
  | 'pending_clarification'
  | 'compile_refused'
  | 'pending_review'
  | 'committed'
  | 'amended'
  | 'archived';

export type StatementOfIntentClaimState = 'unclaimed' | 'claimed';

export type StatementOfIntentFieldKey =
  | 'intent_verb'
  | 'asset'
  | 'target_amount'
  | 'target_currency'
  | 'target_date'
  | 'max_contribution_amount'
  | 'contribution_currency'
  | 'contribution_frequency'
  | 'start_date'
  | 'chain_context'
  | 'goal_context'
  | 'risk_constraint'
  | 'liquidity_constraint';

export const STATEMENT_OF_INTENT_FIELD_KEYS: readonly StatementOfIntentFieldKey[] = [
  'intent_verb',
  'asset',
  'target_amount',
  'target_currency',
  'target_date',
  'max_contribution_amount',
  'contribution_currency',
  'contribution_frequency',
  'start_date',
  'chain_context',
  'goal_context',
  'risk_constraint',
  'liquidity_constraint'
] as const;

export type StatementOfIntentFieldAuthorship = 'user_authored' | 'missing';

export interface StatementOfIntentFieldProvenance {
  field: StatementOfIntentFieldKey;
  authorship: StatementOfIntentFieldAuthorship;
  source_ref?: string;
  authored_at?: string;
}

export interface StatementOfIntentAssetRef {
  asset_kind: 'native' | 'token' | 'symbol' | 'caip19';
  symbol?: string;
  caip19?: string;
  chain_id?: string;
}

export interface StatementOfIntentMoney {
  amount: string;
  currency: string;
}

export interface StatementOfIntentUserFields {
  intent_verb?: 'buy' | 'hold' | 'earn' | 'stake' | 'save' | 'accumulate' | 'other';
  asset?: StatementOfIntentAssetRef;
  target_amount?: string;
  target_currency?: string;
  target_date?: string;
  max_contribution_amount?: string;
  contribution_currency?: string;
  contribution_frequency?: 'once' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly';
  start_date?: string;
  chain_context?: string;
  goal_context?: string;
  risk_constraint?: string;
  liquidity_constraint?: string;
}

export interface CompileStatementOfIntentRequestV0 {
  contract_version: 'statement_of_intent.v0';
  primitive: 'toreva_compile_intent';
  request_id: string;
  correlation_id: string;
  idempotency_key: string;
  expressed_at: string;
  actor: {
    actor_type: 'user';
    external_subject_ref?: string;
  };
  raw_expression?: {
    content_type: 'text/plain';
    text: string;
    source_ref?: string;
  };
  fields: StatementOfIntentUserFields;
  provenance: Record<StatementOfIntentFieldKey, StatementOfIntentFieldProvenance>;
}

export interface StatementOfIntentDraftV0 {
  statement_of_intent_id: string;
  version: number;
  state: StatementOfIntentState;
  artefact: 'StatementOfIntent';
  fields: StatementOfIntentUserFields;
  provenance: Record<StatementOfIntentFieldKey, StatementOfIntentFieldProvenance>;
  chain_context: {
    chain_id: string | 'unspecified';
    chain_selected_by: 'user_authored' | 'missing';
  };
}

export interface StatementOfIntentMissingField {
  field: StatementOfIntentFieldKey;
  reason: 'required_decision_missing';
  question: string;
}

export interface StatementOfIntentConflict {
  conflict_code:
    | 'target_contribution_shortfall'
    | 'currency_mismatch'
    | 'date_before_start'
    | 'asset_chain_mismatch'
    | 'ambiguous_user_decision';
  field_refs: StatementOfIntentFieldKey[];
  human_summary: string;
  question: string;
  computed?: Record<string, string>;
}

export interface StatementOfIntentContextDisclosure {
  disclosed: string[];
  withheld: string[];
}

export type StatementOfIntentSha256Hash = `sha256:${string}`;

export const statementOfIntentSha256HashPattern = /^sha256:[0-9a-f]{64}$/;

export interface StatementOfIntentHash {
  canonicalization: 'jcs';
  hash_alg: 'sha-256';
  box_hash: StatementOfIntentSha256Hash;
  canonical_payload_ref: 'statement_of_intent.box_material.v0';
}

export interface StatementOfIntentDraftAccess {
  draft_id: string;
  single_use: true;
  claim_state: StatementOfIntentClaimState;
  expires_at: string;
  review_url?: string;
}

export interface CompileRefusal {
  reason_code:
    | 'regulated_financial_advice_request'
    | 'unsupported_intent'
    | 'unsafe_or_unparseable_expression';
  human_reason: string;
  receipt_id?: string;
}

export type CompileStatementOfIntentResponseState =
  | 'pending_clarification'
  | 'compile_refused'
  | 'pending_review';

export const COMPILE_STATEMENT_OF_INTENT_RESPONSE_STATES: readonly CompileStatementOfIntentResponseState[] = [
  'pending_clarification',
  'compile_refused',
  'pending_review'
] as const;

export interface CompileStatementOfIntentResponseV0 {
  contract_version: 'statement_of_intent.v0';
  primitive: 'toreva_compile_intent';
  response_id: string;
  correlation_id: string;
  state: CompileStatementOfIntentResponseState;
  human_summary: string;
  structured_draft?: StatementOfIntentDraftV0;
  canonical_box_hash?: StatementOfIntentHash;
  missing_fields: StatementOfIntentMissingField[];
  conflicts: StatementOfIntentConflict[];
  provenance: Record<StatementOfIntentFieldKey, StatementOfIntentFieldProvenance>;
  context: StatementOfIntentContextDisclosure;
  draft?: StatementOfIntentDraftAccess;
  review_url?: string;
  refusal?: CompileRefusal;
  receipt_preview?: {
    receipt_type:
      | 'statement_of_intent_compiled'
      | 'statement_of_intent_clarification_requested'
      | 'operation_refused';
    receipt_subtype?: 'compile_refused';
    payload_hash: StatementOfIntentSha256Hash;
  };
  nothing_has_moved: true;
  nothing_has_moved_text: 'Nothing has moved.';
}

export interface StatementOfIntentVersionRef {
  statement_of_intent_id: string;
  version: number;
  box_hash: StatementOfIntentSha256Hash;
  receipt_id: string;
}

export interface CommittedStatementOfIntentV0 {
  contract_version: 'statement_of_intent.v0';
  statement_of_intent_id: string;
  version: number;
  state: 'committed' | 'amended' | 'archived';
  box_id: string;
  subject_id: string;
  structured_draft: StatementOfIntentDraftV0;
  canonical_box_hash: StatementOfIntentHash;
  committed_at?: string;
  amended_at?: string;
  archived_at?: string;
  previous_version?: StatementOfIntentVersionRef;
  supersedes?: StatementOfIntentVersionRef;
  receipt_id: string;
}
