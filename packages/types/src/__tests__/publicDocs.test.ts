import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INTENT_RELAY_TYPES, intentToolSchemas } from '../intents.js';
import { PERPS_RELAY_TYPES, perpsToolSchemas } from '../perps.js';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

function readRootFile(path: string) {
  return readFileSync(resolve(rootDir, path), 'utf8');
}

function collectKeys(value: unknown): string[] {
  if (!value || typeof value !== 'object') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectKeys);
  }

  return Object.entries(value).flatMap(([key, child]) => [key, ...collectKeys(child)]);
}

describe('public perps docs', () => {
  it('OpenAPI relay examples validate against the exported tool schemas', () => {
    const doc = JSON.parse(readRootFile('docs/toreva-perps.openapi.json'));
    const examples = doc.paths['/relay'].post.requestBody.content['application/json'].examples;

    expect(Object.keys(examples)).toEqual(expect.arrayContaining([
      'establish',
      'perps_establish',
      'query_venues',
      'simulate',
      'perps_long',
      'perps_short',
      'close',
      'cancel_order',
      'funding_settle',
      'add_margin',
      'remove_margin'
    ]));

    for (const example of Object.values(examples)) {
      const value = (example as { value: { toolName: string; type: string; payload: unknown } }).value;

      if (value.toolName in intentToolSchemas) {
        const toolName = value.toolName as keyof typeof intentToolSchemas;
        expect(value.type).toBe(INTENT_RELAY_TYPES[toolName]);
        expect(intentToolSchemas[toolName].safeParse(value.payload).success).toBe(true);
        continue;
      }

      const toolName = value.toolName as keyof typeof perpsToolSchemas;
      expect(value.type).toBe(PERPS_RELAY_TYPES[toolName]);
      expect(perpsToolSchemas[toolName].safeParse(value.payload).success).toBe(true);
    }
  });

  it('OpenAPI documents relay error and result response schemas', () => {
    const doc = JSON.parse(readRootFile('docs/toreva-perps.openapi.json'));
    const schemas = doc.components.schemas;

    expect(schemas.RelayResponse.properties.errorCode.$ref).toBe('#/components/schemas/RelayErrorCode');
    expect(schemas.RelayResponse.properties.errorDetail.$ref).toBe('#/components/schemas/RelayError');
    expect(schemas.RelayResponse.properties.result.oneOf.map((entry: { $ref?: string }) => entry.$ref)).toEqual(
      expect.arrayContaining([
        '#/components/schemas/EstablishResult',
        '#/components/schemas/PerpsExecutionResult',
        '#/components/schemas/PerpsQueryResult'
      ])
    );
    expect(schemas.RelayErrorCode.enum).toEqual(expect.arrayContaining([
      'GUARDRAIL_REJECTED',
      'VENUE_UNAVAILABLE',
      'IDEMPOTENT_REPLAY'
    ]));
    expect(schemas.PerpsExecutionResult.properties).toHaveProperty('averagePrice');
  });

  it('public examples do not publish legacy perps aliases', () => {
    const files = [
      readRootFile('examples/open-perps-position/index.ts'),
      readRootFile('examples/agentic-perps-workflow/index.ts'),
      JSON.stringify(JSON.parse(readRootFile('docs/toreva-perps.openapi.json')))
    ].join('\n');

    expect(files).not.toMatch(/\bwallet\s*:/);
    expect(files).not.toMatch(/\bmarket\s*:/);
    expect(files).not.toMatch(/\bnotionalUsd\s*:/);
  });

  it('public relay examples do not include raw signer or secret material keys', () => {
    const doc = JSON.parse(readRootFile('docs/toreva-perps.openapi.json'));
    const examples = doc.paths['/relay'].post.requestBody.content['application/json'].examples;
    const keys = Object.values(examples).flatMap((example) => collectKeys((example as { value: unknown }).value));

    expect(keys.map((key) => key.toLowerCase())).not.toEqual(expect.arrayContaining([
      'privatekey',
      'private_key',
      'seedphrase',
      'seed_phrase',
      'apisecret',
      'api_secret'
    ]));
  });

  it('public docs keep the canonical public discovery pointers in repo-local guidance', () => {
    const doc = readRootFile('docs/public-discovery.md');

    expect(doc).toContain('https://mcp.toreva.com');
    expect(doc).toContain('https://gateway.toreva.com/openapi.json');
    expect(doc).toContain('https://gateway.toreva.com/.well-known/toreva-kit.json');
    expect(doc).toContain('https://gateway.toreva.com/relay/tools');
  });
});
