import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CANONICAL_TAGLINE } from '../branding.js';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

function readRootFile(path: string) {
  return readFileSync(resolve(rootDir, path), 'utf8');
}

describe('public MCP metadata', () => {
  it('uses the same license-envelope description in server and MCP package metadata', () => {
    const server = JSON.parse(readRootFile('server.json'));
    const mcpPackage = JSON.parse(readRootFile('packages/mcp/package.json'));
    const typesPackage = JSON.parse(readRootFile('packages/types/package.json'));

    expect(server.description).toBe(CANONICAL_TAGLINE);
    expect(mcpPackage.description).toBe(CANONICAL_TAGLINE);
    expect(typesPackage.description).toBe(CANONICAL_TAGLINE);
  });

  it('does not advertise excluded venues or product families in MCP metadata', () => {
    const publicText = [
      readRootFile('README.md'),
      readRootFile('server.json'),
      readRootFile('packages/mcp/package.json'),
      readRootFile('packages/types/package.json')
    ].join('\n');

    expect(publicText).not.toMatch(/Jupiter|Pacifica|Drift|Flash Trade/i);
    expect(publicText).not.toMatch(/perps|perpetual|earn|yield|staking/i);
    expect(publicText).not.toMatch(/best-execution/i);
  });

  it('public metadata does not include raw signer or secret material keys', () => {
    const publicText = [
      readRootFile('README.md'),
      readRootFile('server.json'),
      readRootFile('packages/mcp/package.json'),
      readRootFile('packages/types/package.json')
    ].join('\n');

    expect(publicText.toLowerCase()).not.toMatch(/privatekey|private_key|seedphrase|seed_phrase|apisecret|api_secret/);
  });

  it('makes the root README the compute-binding entry point', () => {
    const readme = readRootFile('README.md');

    expect(readme).toContain('## The Three Doors');
    expect(readme).toContain('### Door 1: MCP');
    expect(readme).toContain('### Door 2: Customer-Owned Fleet');
    expect(readme).toContain('### Door 3: Hosted Compute');
    expect(readme).toContain('[GitHub Org Agent Fleet](./docs/github-org-agent-fleet.md)');
    expect(readme).toContain('This door is deferred and is not documented as available');
    expect(readme).toContain('gateway returns a `receipt_id`');
  });
});
