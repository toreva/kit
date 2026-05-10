import { tokenReceive } from '@toreva/sdk';

export interface TokenReceiveCliArgs {
  wallet: string;
  limit?: number;
}

/**
 * Parse `toreva token-receive --wallet <address> [--limit <n>]`.
 */
export function parseTokenReceiveArgs(args: string[]): TokenReceiveCliArgs {
  let wallet: string | undefined;
  let limitRaw: string | undefined;

  for (const arg of args) {
    if (arg.startsWith('--wallet=')) {
      wallet = arg.slice('--wallet='.length);
    } else if (arg === '--wallet') {
      const idx = args.indexOf('--wallet');
      wallet = args[idx + 1];
    } else if (arg.startsWith('--limit=')) {
      limitRaw = arg.slice('--limit='.length);
    } else if (arg === '--limit') {
      const idx = args.indexOf('--limit');
      limitRaw = args[idx + 1];
    }
  }

  if (!wallet) {
    throw new Error('Missing required --wallet flag');
  }
  let limit: number | undefined;
  if (limitRaw !== undefined) {
    const parsed = Number(limitRaw);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 25) {
      throw new Error(`Invalid --limit: ${limitRaw} (must be 1..25, capped by mcp.toreva.com)`);
    }
    limit = parsed;
  }
  return { wallet, ...(limit !== undefined ? { limit } : {}) };
}

/**
 * Format the token-receive result as a human-readable table.
 */
export function formatTokenReceive(r: Awaited<ReturnType<typeof tokenReceive>>): string {
  const lines: string[] = [];
  lines.push('');
  lines.push(`  Wallet          ${r.wallet}`);
  lines.push(`  Receives        ${r.count}`);
  lines.push(`  Source          ${r.source}`);
  if (r.fetchedAt) lines.push(`  Fetched at      ${r.fetchedAt}`);
  lines.push('');
  if (r.receives.length === 0) {
    lines.push('  (no recent inbound SPL token transfers)');
  } else {
    lines.push('  Recent receives:');
    for (const e of r.receives) {
      const amt = e.amount !== undefined ? e.amount.toString() : '?';
      const mint = e.mint ? `${e.mint.slice(0, 8)}…` : '?';
      const sig = e.signature ? `${e.signature.slice(0, 8)}…` : '?';
      const when = e.blockTime ?? '?';
      lines.push(`    ${when}  amount=${amt}  mint=${mint}  sig=${sig}`);
    }
  }
  lines.push('');
  lines.push('  Evidence:');
  lines.push(`    read           ${r.evidenceRef.readEvidenceId}`);
  lines.push(`    venue intel    ${r.evidenceRef.venueIntelligenceReceiptId}`);
  lines.push(`    sentinel       ${r.evidenceRef.sentinelReviewReceiptId}`);
  lines.push('');
  return lines.join('\n');
}

/**
 * Run the CLI token-receive command.
 */
export async function runTokenReceiveCommand(args: string[]): Promise<void> {
  const parsed = parseTokenReceiveArgs(args);
  const result = await tokenReceive(parsed);
  console.log(formatTokenReceive(result));
}
