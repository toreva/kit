import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  WORK_SURFACE_MINIMUM_PRIMITIVES,
  WORK_SURFACE_UPSERT_RELAY_TYPE,
  WORK_SURFACE_UPSERT_TOOL_NAME,
  type WorkSurfaceGovernedObjectUpsertRequestV0,
  type WorkSurfaceGovernedObjectUpsertResponseV0,
  type WorkSurfaceInstallConfigV0,
} from '../work-surface.js';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

function readRootFile(path: string) {
  return readFileSync(resolve(rootDir, path), 'utf8');
}

describe('work-surface connector primitives', () => {
  it('records the minimum install, invoke, and receipt primitive set', () => {
    expect(WORK_SURFACE_MINIMUM_PRIMITIVES.map((primitive) => primitive.id)).toEqual([
      'install_connector',
      'configure_relay_auth',
      'verify_connector',
      'discover_capabilities',
      'upsert_governed_object',
      'get_receipt',
    ]);
  });

  it('keeps unattended install configuration gateway-only and token-reference based', () => {
    const config: WorkSurfaceInstallConfigV0 = {
      contract_version: 'work_surface.install_config.v0',
      surface: {
        kind: 'daemon_runner',
        name: 'example-runner',
      },
      relay: {
        url: 'https://gateway.toreva.com',
        auth_token_env: 'RELAY_AUTH_TOKEN',
      },
      mcp: {
        serverKey: 'toreva',
        command: 'npx',
        args: ['-y', '@toreva/mcp'],
        env: {
          RELAY_URL: 'https://gateway.toreva.com',
          RELAY_AUTH_TOKEN: '${RELAY_AUTH_TOKEN}',
        },
      },
    };

    expect(config.relay.url).toBe('https://gateway.toreva.com');
    expect(config.mcp?.env.RELAY_AUTH_TOKEN).toBe('${RELAY_AUTH_TOKEN}');
  });

  it('defines the unattended governed-object relay request shape', () => {
    const request: WorkSurfaceGovernedObjectUpsertRequestV0 = {
      type: WORK_SURFACE_UPSERT_RELAY_TYPE,
      toolName: WORK_SURFACE_UPSERT_TOOL_NAME,
      requestId: 'runner-job-001',
      payload: {
        contract_version: 'work_surface.governed_object_upsert.v0',
        operation: 'create',
        actor: {
          surface_kind: 'daemon_runner',
          surface_name: 'example-runner',
          run_id: 'run-001',
        },
        object: {
          object_kind: 'statement_of_intent',
          subject_ref: 'external-subject-ref',
          walletAddress: '11111111111111111111111111111111',
          fields: {
            goal_context: 'Record a user-authored intent for later review.',
          },
        },
        lineage: {
          human_grant_ref: 'grant_01',
          parent_delegation_ref: 'delegation_01',
        },
        idempotency_key: 'runner-job-001',
        require_receipt: true,
        nothing_should_move: true,
      },
    };

    expect(request.type).toBe('governed_object.upsert');
    expect(request.toolName).toBe('toreva_governed_object_upsert');
    expect(request.payload.lineage.human_grant_ref).toBe('grant_01');
    expect(request.payload.object.venue).toBeUndefined();
  });

  it('requires receipt-bearing responses for accepted, pending, and refused writes', () => {
    const response: WorkSurfaceGovernedObjectUpsertResponseV0 = {
      ok: true,
      result: {
        contract_version: 'work_surface.governed_object_upsert.v0',
        operation: 'create',
        status: 'pending_review',
        object_ref: {
          object_kind: 'statement_of_intent',
          object_id: 'soi_01',
          subject_ref: 'external-subject-ref',
        },
        receipt_id: 'rct_01',
        lineage_ref: 'lineage_01',
        human_grant_ref: 'grant_01',
        write_boundary: 'gateway',
        nothing_has_moved: true,
      },
      meta: {
        requestId: 'runner-job-001',
      },
    };

    expect(response.result?.receipt_id).toBe('rct_01');
    expect(response.result?.write_boundary).toBe('gateway');
    expect(response.result?.nothing_has_moved).toBe(true);
  });
});

describe('work-surface primitive documentation', () => {
  it('records install, invocation, receipt, readiness, and non-execution sections', () => {
    const doc = readRootFile('docs/work-surface-connector-primitives.md');

    expect(doc).toContain('## Minimum Primitive Set');
    expect(doc).toContain('## Compute Binding Doors');
    expect(doc).toContain('## Install And Configure Shape');
    expect(doc).toContain('## Invocation Shape');
    expect(doc).toContain('## Receipt Return Shape');
    expect(doc).toContain('## Connector Readiness Checklist');
    expect(doc).toContain('## Non-Execution Boundary');
    expect(doc).toContain('The front door is the object store');
    expect(doc).toContain('do not require Toreva to hold a per-user AI API key');
    expect(doc).toContain('[GitHub Org Agent Fleet](./github-org-agent-fleet.md)');
    expect(doc).toContain('does not add');
    expect(doc).toContain('execution business logic');
    expect(doc).toContain('do not route orders');
    expect(doc).toContain('gateway returns a `receipt_id`');
    expect(doc).toContain('legacy venue aliases');
    expect(doc).not.toContain('launch-gated');
    expect(doc).not.toContain('Recommended W1 Path');
    expect(doc).not.toContain('Launch Gate');
    expect(doc).not.toContain('OpenClaw');
  });

  it('documents the customer-owned GitHub fleet path', () => {
    const doc = readRootFile('docs/github-org-agent-fleet.md');

    expect(doc).toContain('GitHub is entity identity only');
    expect(doc).toContain('Toreva does not need, receive, or hold those model');
    expect(doc).toContain('## Dispatch Transport');
    expect(doc).toContain('## Answer Landing');
    expect(doc).toContain('POST https://gateway.toreva.com/relay');
    expect(doc).toContain('toreva_governed_object_upsert');
    expect(doc).toContain('The usable proof is the returned');
    expect(doc).toContain('Hosted Toreva compute is not required');
    expect(doc).not.toContain('protocolId');
  });
});
