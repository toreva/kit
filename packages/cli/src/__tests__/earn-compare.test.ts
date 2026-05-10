import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  parseEarnCompareArgs,
  formatEarnCompare,
  runEarnCompareCommand,
} from '../commands/earn-compare.js';
import type { EarnCompareResult } from '@toreva/sdk';

const baseResult: EarnCompareResult = {
  ok: true,
  venue: 'kamino',
  asset: 'USDC',
  apyPct: 4.3626,
  apyBasePct: 4.3626,
  apyRewardPct: null,
  tvlUsd: 7_799_705,
  underlyingTokens: ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'],
  chain: 'Solana',
  project: 'kamino-lend',
  poolId: 'd2141a59-c199-4be7-8d4b-c8223954836b',
  source: 'defillama',
  sourceUrl: 'https://yields.llama.fi/pools',
  fetchedAt: '2026-05-10T12:20:09.082Z',
  evidenceRef: {
    readEvidenceId: 'NETSOL-READ-kamino-earn-compare-2026-05-08-slot-418488624',
    venueIntelligenceReceiptId: 'VS-kamino-earn-compare-2026-05-08',
    sentinelReviewReceiptId: 'SENT-REVIEW-kamino-earn-compare-2026-05-08',
  },
  tool: 'toreva_earn_compare_kamino',
  familyId: 'earn_lending',
  primitiveId: 'exec.earn_compare',
  operation: 'compare',
  latencyMs: 1263,
};

vi.mock('@toreva/sdk', async () => {
  const actual = await vi.importActual<typeof import('@toreva/sdk')>('@toreva/sdk');
  return {
    ...actual,
    earnCompare: vi.fn(async () => baseResult),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('parseEarnCompareArgs', () => {
  it('accepts --asset=USDC --venue=kamino', () => {
    const r = parseEarnCompareArgs(['--asset=USDC', '--venue=kamino']);
    expect(r).toEqual({ asset: 'USDC', venue: 'kamino' });
  });

  it('accepts space-separated --asset USDC --venue marginfi', () => {
    const r = parseEarnCompareArgs(['--asset', 'USDC', '--venue', 'marginfi']);
    expect(r).toEqual({ asset: 'USDC', venue: 'marginfi' });
  });

  it('throws on missing --asset', () => {
    expect(() => parseEarnCompareArgs(['--venue=kamino'])).toThrow(/asset/);
  });

  it('throws on missing --venue', () => {
    expect(() => parseEarnCompareArgs(['--asset=USDC'])).toThrow(/venue/);
  });

  it('rejects unsupported asset', () => {
    expect(() => parseEarnCompareArgs(['--asset=SOL', '--venue=kamino'])).toThrow(/SOL/);
  });

  it('rejects unsupported venue', () => {
    expect(() => parseEarnCompareArgs(['--asset=USDC', '--venue=save'])).toThrow(/save/);
  });
});

describe('formatEarnCompare', () => {
  it('renders the canonical fields and the evidence triple', () => {
    const out = formatEarnCompare(baseResult);
    expect(out).toMatch(/Venue\s+kamino/);
    expect(out).toMatch(/Asset\s+USDC/);
    expect(out).toMatch(/APY\s+4\.3626%/);
    expect(out).toMatch(/Source\s+defillama/);
    expect(out).toMatch(/Pool ID\s+d2141a59/);
    expect(out).toMatch(/sentinel\s+SENT-REVIEW/);
    expect(out).toMatch(/venue intel\s+VS-/);
    expect(out).toMatch(/read\s+NETSOL-READ/);
  });

  it('omits null reward APY line', () => {
    const out = formatEarnCompare(baseResult);
    expect(out).not.toMatch(/APY \(reward\)/);
  });

  it('renders TVL with thousands separator', () => {
    const out = formatEarnCompare(baseResult);
    expect(out).toMatch(/TVL \(USD\)\s+\$7,799,705/);
  });
});

describe('runEarnCompareCommand', () => {
  it('calls earnCompare with parsed args and prints the table', async () => {
    const sdk = await import('@toreva/sdk');
    const mockedEarnCompare = vi.mocked(sdk.earnCompare);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await runEarnCompareCommand(['--asset=USDC', '--venue=kamino']);

    expect(mockedEarnCompare).toHaveBeenCalledWith({ asset: 'USDC', venue: 'kamino' });
    const printed = logSpy.mock.calls.flat().join('\n');
    expect(printed).toMatch(/kamino/);
    expect(printed).toMatch(/SENT-REVIEW/);
    logSpy.mockRestore();
  });
});
