import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  assertNoPrimitiveReadinessOverclaim,
  primitiveReadinessCatalogSchema
} from '../primitive-readiness.js';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

function readRootFile(path: string) {
  return readFileSync(resolve(rootDir, path), 'utf8');
}

describe('primitive readiness catalog', () => {
  it('parses the public primitive readiness catalog', () => {
    const catalog = primitiveReadinessCatalogSchema.parse(
      JSON.parse(readRootFile('docs/primitive-readiness.json'))
    );

    expect(catalog.safePlatformClaim).toBe(
      "Access Toreva's growing catalog of gated Solana agent primitives at low cost."
    );
    expect(catalog.greenDefinition).toContain(
      'every primitive in the family is battle-tested with real mainnet funds'
    );
    expect(catalog.greenDefinition).toContain('Kit, API, MCP, CLI, Skills, and SDK');
    expect(catalog.readinessLadder).toEqual([
      'proposed',
      'canonical',
      'integration_ready',
      'canary_ready',
      'battle_tested'
    ]);
    expect(catalog.families).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ familyId: 'earn', readiness: 'canonical' }),
        expect.objectContaining({ familyId: 'perps', readiness: 'integration_ready' }),
        expect.objectContaining({ familyId: 'swap_route', readiness: 'canonical' }),
        expect.objectContaining({ familyId: 'options', readiness: 'proposed' })
      ])
    );
    expect(catalog.greenRequiredEvidence).toEqual(
      expect.arrayContaining([
        'allFamilyPrimitivesBattleTested',
        'kitSurface',
        'apiSurface',
        'mcpSurface',
        'cliSurface',
        'skillsSurface',
        'sdkSurface',
        'docsSurface',
        'mainnetRealFunds'
      ])
    );
  });

  it('does not label any family green or battle-tested without required evidence', () => {
    const catalog = primitiveReadinessCatalogSchema.parse(
      JSON.parse(readRootFile('docs/primitive-readiness.json'))
    );

    expect(catalog.families.some((family) => family.readiness === 'battle_tested')).toBe(false);
    expect(catalog.families.some((family) => family.greenState === 'green')).toBe(false);
    expect(() => assertNoPrimitiveReadinessOverclaim(catalog)).not.toThrow();
  });

  it('rejects green labels that are not backed by battle-tested readiness', () => {
    const catalog = primitiveReadinessCatalogSchema.parse(
      JSON.parse(readRootFile('docs/primitive-readiness.json'))
    );
    const invalid = {
      ...catalog,
      families: [
        {
          ...catalog.families[0],
          greenState: 'green' as const
        }
      ]
    };

    expect(() => assertNoPrimitiveReadinessOverclaim(invalid)).toThrow(
      /cannot be green unless readiness is battle_tested/
    );
  });

  it('public docs point agents to the readiness catalog and Gateway projection', () => {
    const discovery = readRootFile('docs/public-discovery.md');
    const readme = readRootFile('README.md');

    expect(discovery).toContain('https://gateway.toreva.com/.well-known/toreva-primitive-readiness.json');
    expect(discovery).toContain('docs/primitive-readiness.json');
    expect(readme).toContain('Primitive readiness catalog');
    expect(readme).toContain('integration_ready');
  });
});
