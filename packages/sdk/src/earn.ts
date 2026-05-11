/**
 * R1 GREEN primitive: read-only USDC lending APY compare.
 *
 * Calls `mcp.toreva.com` JSON-RPC `tools/call` with the venue-specific tool
 * name (`toreva_earn_compare_kamino` or `toreva_earn_compare_marginfi`).
 *
 * This is a thin, type-safe wrapper around the canonical MCP endpoint.
 * Production traffic must call mcp.toreva.com directly; tests mock fetch.
 *
 * Family: earn_lending. Operation: compare. Tier: T2 (read-only operational).
 *
 * Truthfulness rule: every response includes the `evidenceRef` triple
 * (readEvidenceId, venueIntelligenceReceiptId, sentinelReviewReceiptId)
 * so the caller can audit the chain back to the admission decision.
 */

export type EarnCompareAsset = 'USDC';
export type EarnCompareVenue = 'kamino' | 'marginfi';

export interface EarnCompareParams {
  asset: EarnCompareAsset;
  venue: EarnCompareVenue;
}

export interface EarnCompareEvidenceRef {
  readEvidenceId: string;
  venueIntelligenceReceiptId: string;
  sentinelReviewReceiptId: string;
}

export interface EarnCompareResult {
  ok: boolean;
  venue: EarnCompareVenue;
  asset: EarnCompareAsset;
  /**
   * Annualised yield percentage. May be `null` for venues whose on-chain
   * APY decoding is pending — see `apyNote`. Caller should handle `null`
   * before formatting.
   */
  apyPct: number | null;
  apyBasePct?: number | null;
  apyRewardPct?: number | null;
  apyNote?: string;
  tvlUsd?: number | null;
  underlyingTokens?: string[];
  chain?: string;
  project?: string;
  poolId?: string;
  source: string;
  sourceUrl?: string;
  fetchedAt?: string;
  evidenceRef: EarnCompareEvidenceRef;
  tool: string;
  familyId: string;
  primitiveId: string;
  operation: string;
  latencyMs?: number;
  // Marginfi-specific fields (optional):
  bankAccount?: string;
  bankOwner?: string;
  bankExecutable?: boolean;
  bankLamports?: number;
  bankRentEpoch?: number;
  bankDataByteLen?: number;
  bankDataSha256?: string;
  slot?: number;
}

export interface EarnCompareOptions {
  /** Override MCP base URL (default: https://mcp.toreva.com). */
  mcpUrl?: string;
  /** Override API bearer token (default: TOREVA_API_KEY env, else public synthetic key). */
  apiKey?: string;
  /** Override fetch (test seam). */
  fetchImpl?: typeof fetch;
}

const DEFAULT_MCP_URL = 'https://mcp.toreva.com';
const PUBLIC_SYNTHETIC_KEY = 'tk_litmus_r1_synthetic_3rd_party_trading_bot_demo_only';

const TOOL_NAMES: Record<EarnCompareVenue, string> = {
  kamino: 'toreva_earn_compare_kamino',
  marginfi: 'toreva_earn_compare_marginfi',
};

/**
 * Compare current APY for `asset` on a single admitted lending `venue`.
 *
 * Throws if `venue` is not in the admitted set ({'kamino' | 'marginfi'}) or
 * if the MCP call fails. On success returns the structured APY snapshot
 * plus the evidence triple required for downstream audit.
 *
 * @example
 * ```ts
 * const r = await earnCompare({ asset: 'USDC', venue: 'kamino' });
 * console.log(r.apyPct, r.evidenceRef.sentinelReviewReceiptId);
 * ```
 */
export async function earnCompare(
  params: EarnCompareParams,
  options: EarnCompareOptions = {}
): Promise<EarnCompareResult> {
  const toolName = TOOL_NAMES[params.venue];
  if (!toolName) {
    throw new Error(
      `earnCompare: venue "${params.venue}" not in admitted set. R1 supports: ${Object.keys(TOOL_NAMES).join(', ')}.`
    );
  }
  if (params.asset !== 'USDC') {
    throw new Error(
      `earnCompare: asset "${params.asset}" not supported. R1 supports USDC only.`
    );
  }

  const mcpUrl = (options.mcpUrl ?? DEFAULT_MCP_URL).replace(/\/+$/, '');
  const apiKey = options.apiKey ?? process.env.TOREVA_API_KEY ?? PUBLIC_SYNTHETIC_KEY;
  const fetchImpl = options.fetchImpl ?? fetch;

  const response = await fetchImpl(`${mcpUrl}/mcp`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: { asset: params.asset },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`earnCompare: MCP call failed with HTTP ${response.status}`);
  }

  const body = (await response.json()) as {
    jsonrpc?: string;
    id?: number;
    result?: { structuredContent?: EarnCompareResult; isError?: boolean };
    error?: { code: number; message: string };
  };

  if (body.error) {
    throw new Error(`earnCompare: MCP error ${body.error.code}: ${body.error.message}`);
  }

  const structured = body.result?.structuredContent;
  if (!structured) {
    throw new Error('earnCompare: MCP response missing structuredContent');
  }
  if (body.result?.isError) {
    throw new Error(`earnCompare: MCP tool returned error payload`);
  }

  return structured;
}
