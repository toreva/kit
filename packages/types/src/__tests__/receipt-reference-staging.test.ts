import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

function readRootFile(path: string) {
  return readFileSync(resolve(rootDir, path), 'utf8');
}

interface ReceiptVectorManifest {
  status: string;
  profileVersion: string;
  payloadPolicy: {
    includeSyntheticReceiptPayloads: boolean;
    payloadsDeferredUntilRealProductionReceiptExists: boolean;
  };
  vectors: Array<{
    id: string;
    authorityApplicability: string;
    authorityBasis: string;
    expectedConformance: string;
    releaseFixturePath: string;
    fieldAssertions: string[];
  }>;
}

describe('receipt reference library staging assets', () => {
  it('keeps the staged design explicitly non-launchable', () => {
    const design = readRootFile('docs/receipt-reference-library-s1.md');

    expect(design).toContain('Status: staged design only');
    expect(design).toContain('No fixture payloads were created');
    expect(design).toContain('No npm package was published');
    expect(design).toContain('Explicit release approval exists for publication');
  });

  it('stages exactly the eight authority test-vector scenarios without synthetic payloads', () => {
    const manifest = JSON.parse(
      readRootFile('docs/receipt-test-vector-manifest.v0.1.json')
    ) as ReceiptVectorManifest;

    expect(manifest.status).toBe('staged_design_only');
    expect(manifest.profileVersion).toBe('toreva-receipt/1.0');
    expect(manifest.payloadPolicy.includeSyntheticReceiptPayloads).toBe(false);
    expect(manifest.payloadPolicy.payloadsDeferredUntilRealProductionReceiptExists).toBe(true);

    expect(manifest.vectors.map((vector) => vector.id)).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
    ]);

    for (const vector of manifest.vectors) {
      expect(vector.authorityApplicability).toMatch(/^(applicable|not_applicable)$/);
      expect(vector.authorityBasis).not.toBe('none');
      expect(vector.expectedConformance).toBe('valid');
      expect(vector.releaseFixturePath).toMatch(/^test-vectors\/v0\.1\//);
      expect(vector.fieldAssertions.length).toBeGreaterThan(0);
    }
  });
});
