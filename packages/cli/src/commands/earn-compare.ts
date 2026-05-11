import { earnCompare, type EarnCompareVenue } from '@toreva/sdk';

export interface EarnCompareCliArgs {
  asset: 'USDC';
  venue: EarnCompareVenue;
}

/**
 * Parse `toreva earn-compare --asset <asset> --venue <kamino|marginfi>`.
 *
 * Throws on missing or invalid args. Mirrors `init.ts` parser style.
 */
export function parseEarnCompareArgs(args: string[]): EarnCompareCliArgs {
  let asset: string | undefined;
  let venue: string | undefined;

  for (const arg of args) {
    if (arg.startsWith('--asset=')) {
      asset = arg.slice('--asset='.length);
    } else if (arg === '--asset') {
      const idx = args.indexOf('--asset');
      asset = args[idx + 1];
    } else if (arg.startsWith('--venue=')) {
      venue = arg.slice('--venue='.length);
    } else if (arg === '--venue') {
      const idx = args.indexOf('--venue');
      venue = args[idx + 1];
    }
  }

  if (!asset) {
    throw new Error('Missing required --asset flag (only USDC supported in R1)');
  }
  if (asset !== 'USDC') {
    throw new Error(`Unsupported asset: ${asset}. R1 supports USDC only.`);
  }
  if (!venue) {
    throw new Error('Missing required --venue flag (kamino|marginfi)');
  }
  if (venue !== 'kamino' && venue !== 'marginfi') {
    throw new Error(`Unsupported venue: ${venue}. R1 supports: kamino, marginfi.`);
  }

  return { asset: 'USDC', venue: venue as EarnCompareVenue };
}

/**
 * Format the earn-compare result as a human-readable table.
 */
export function formatEarnCompare(r: Awaited<ReturnType<typeof earnCompare>>): string {
  const lines: string[] = [];
  lines.push('');
  lines.push(`  Venue           ${r.venue}`);
  lines.push(`  Asset           ${r.asset}`);
  if (r.apyPct !== null && r.apyPct !== undefined) {
    lines.push(`  APY             ${r.apyPct.toFixed(4)}%`);
  } else {
    lines.push(`  APY             (unavailable)`);
    if (r.apyNote) lines.push(`  Note            ${r.apyNote}`);
  }
  if (r.apyBasePct !== undefined && r.apyBasePct !== null) {
    lines.push(`  APY (base)      ${r.apyBasePct.toFixed(4)}%`);
  }
  if (r.apyRewardPct !== undefined && r.apyRewardPct !== null) {
    lines.push(`  APY (reward)    ${r.apyRewardPct.toFixed(4)}%`);
  }
  if (r.tvlUsd !== undefined && r.tvlUsd !== null) {
    lines.push(`  TVL (USD)       $${r.tvlUsd.toLocaleString('en-US')}`);
  }
  if (r.project) lines.push(`  Project         ${r.project}`);
  if (r.poolId) lines.push(`  Pool ID         ${r.poolId}`);
  lines.push(`  Source          ${r.source}`);
  if (r.fetchedAt) lines.push(`  Fetched at      ${r.fetchedAt}`);
  lines.push('');
  lines.push('  Evidence:');
  lines.push(`    read           ${r.evidenceRef.readEvidenceId}`);
  lines.push(`    venue intel    ${r.evidenceRef.venueIntelligenceReceiptId}`);
  lines.push(`    sentinel       ${r.evidenceRef.sentinelReviewReceiptId}`);
  lines.push('');
  return lines.join('\n');
}

/**
 * Run the CLI earn-compare command.
 */
export async function runEarnCompareCommand(args: string[]): Promise<void> {
  const parsed = parseEarnCompareArgs(args);
  const result = await earnCompare(parsed);
  console.log(formatEarnCompare(result));
}
