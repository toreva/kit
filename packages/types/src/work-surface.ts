import type { RelayRequest, RelayResponse } from './relay.js';

export const WORK_SURFACE_PRIMITIVE_SET_ID = 'work_surface.connector_primitives.v0';

export type WorkSurfacePrimitiveId =
  | 'install_connector'
  | 'configure_relay_auth'
  | 'verify_connector'
  | 'discover_capabilities'
  | 'upsert_governed_object'
  | 'get_receipt';

export interface WorkSurfacePrimitive {
  id: WorkSurfacePrimitiveId;
  required: true;
}

export const WORK_SURFACE_MINIMUM_PRIMITIVES: readonly WorkSurfacePrimitive[] = [
  { id: 'install_connector', required: true },
  { id: 'configure_relay_auth', required: true },
  { id: 'verify_connector', required: true },
  { id: 'discover_capabilities', required: true },
  { id: 'upsert_governed_object', required: true },
  { id: 'get_receipt', required: true },
] as const;

export const WORK_SURFACE_UPSERT_RELAY_TYPE = 'governed_object.upsert';
export const WORK_SURFACE_UPSERT_TOOL_NAME = 'toreva_governed_object_upsert';

export type WorkSurfaceKind =
  | 'coding_tool'
  | 'daemon_runner'
  | 'scheduled_agent'
  | 'agent_framework';

export type WorkSurfaceGovernedObjectKind =
  | 'agent_wallet_policy'
  | 'delegation_grant'
  | 'statement_of_intent'
  | 'receipt_index';

export type WorkSurfaceUpsertOperation = 'create' | 'update';
export type WorkSurfaceUpsertStatus = 'accepted' | 'pending_review' | 'refused';

export interface WorkSurfaceInstallConfigV0 {
  contract_version: 'work_surface.install_config.v0';
  surface: {
    kind: WorkSurfaceKind;
    name: string;
    instance_id?: string;
  };
  relay: {
    url: 'https://gateway.toreva.com' | string;
    auth_token_env: 'RELAY_AUTH_TOKEN' | string;
  };
  mcp?: {
    serverKey: string;
    command: 'npx' | string;
    args: readonly string[];
    env: Record<string, string>;
  };
  cli?: {
    install: string;
    configure: readonly string[];
  };
  sdk?: {
    package: '@toreva/sdk';
    relayUrl: 'https://gateway.toreva.com' | string;
  };
}

export interface WorkSurfaceActorV0 {
  surface_kind: WorkSurfaceKind;
  surface_name: string;
  agent_instance_id?: string;
  run_id?: string;
}

export interface WorkSurfaceGovernedObjectRefV0 {
  object_kind: WorkSurfaceGovernedObjectKind;
  object_id?: string;
  subject_ref: string;
  walletAddress?: string;
  venue?: string;
}

export interface WorkSurfaceGovernedObjectPatchV0 extends WorkSurfaceGovernedObjectRefV0 {
  fields: Record<string, unknown>;
}

export interface WorkSurfaceLineageV0 {
  human_grant_ref: string;
  delegator_ref?: string;
  parent_delegation_ref?: string;
  attenuation_refs?: readonly string[];
}

export interface WorkSurfaceGovernedObjectUpsertPayloadV0 {
  contract_version: 'work_surface.governed_object_upsert.v0';
  operation: WorkSurfaceUpsertOperation;
  actor: WorkSurfaceActorV0;
  object: WorkSurfaceGovernedObjectPatchV0;
  lineage: WorkSurfaceLineageV0;
  idempotency_key: string;
  require_receipt: true;
  nothing_should_move: true;
}

export interface WorkSurfaceGovernedObjectUpsertRequestV0
  extends RelayRequest<WorkSurfaceGovernedObjectUpsertPayloadV0> {
  type: typeof WORK_SURFACE_UPSERT_RELAY_TYPE;
  toolName: typeof WORK_SURFACE_UPSERT_TOOL_NAME;
  requestId: string;
}

export interface WorkSurfaceRefusalV0 {
  reason_code:
    | 'missing_lineage'
    | 'missing_grant'
    | 'outside_policy'
    | 'paused_or_revoked'
    | 'unsupported_object'
    | 'write_boundary_unavailable';
  human_reason: string;
}

export interface WorkSurfaceGovernedObjectReceiptV0 {
  contract_version: 'work_surface.governed_object_upsert.v0';
  operation: WorkSurfaceUpsertOperation;
  status: WorkSurfaceUpsertStatus;
  object_ref: WorkSurfaceGovernedObjectRefV0;
  receipt_id: string;
  lineage_ref?: string;
  human_grant_ref: string;
  write_boundary: 'gateway';
  refusal?: WorkSurfaceRefusalV0;
  nothing_has_moved: true;
}

export type WorkSurfaceGovernedObjectUpsertResponseV0 =
  RelayResponse<WorkSurfaceGovernedObjectReceiptV0>;
