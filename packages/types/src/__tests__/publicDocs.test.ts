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
  it('keeps package metadata canonical and Registry metadata within its contract', () => {
    const server = JSON.parse(readRootFile('server.json'));
    const mcpPackage = JSON.parse(readRootFile('packages/mcp/package.json'));
    const typesPackage = JSON.parse(readRootFile('packages/types/package.json'));

    // MCP Registry rejects descriptions longer than 100 chars (422), so server.json carries a short form.
    expect(server.description.length).toBeLessThanOrEqual(100);
    expect(mcpPackage.description).toBe(CANONICAL_TAGLINE);
    expect(typesPackage.description).toBe(CANONICAL_TAGLINE);
  });

  it('keeps the hosted goals connector Registry metadata within its contract and current vocabulary', () => {
    const goals = JSON.parse(readRootFile('server-goals.json'));

    // MCP Registry rejects descriptions longer than 100 chars (422).
    expect(goals.description.length).toBeLessThanOrEqual(100);
    // Plans was renamed to Goals on 2026-08-18; "plan" is retired as a user-facing label.
    expect(`${goals.title} ${goals.description}`).not.toMatch(/\bplans?\b/i);
    expect(JSON.stringify(goals)).not.toMatch(/solana|wallet|perps|perpetual|strateg/i);
  });

  it('does not advertise excluded venues or product families in MCP metadata', () => {
    const publicText = [
      readRootFile('README.md'),
      readRootFile('docs/work-surface-connector-primitives.md'),
      readRootFile('server.json'),
      readRootFile('packages/cli/package.json'),
      readRootFile('packages/mcp/package.json'),
      readRootFile('packages/sdk/package.json'),
      readRootFile('packages/sdk/README.md'),
      readRootFile('packages/types/package.json')
    ].join('\n');

    expect(publicText).not.toMatch(/Jupiter|Pacifica|Drift|Flash Trade/i);
    expect(publicText).not.toMatch(/perps|perpetual|earn|yield|staking/i);
    expect(publicText).not.toMatch(/best-execution/i);
  });

  it('public metadata does not include raw signer or secret material keys', () => {
    const publicText = [
      readRootFile('README.md'),
      readRootFile('docs/work-surface-connector-primitives.md'),
      readRootFile('server.json'),
      readRootFile('packages/cli/package.json'),
      readRootFile('packages/mcp/package.json'),
      readRootFile('packages/sdk/package.json'),
      readRootFile('packages/sdk/README.md'),
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
