/**
 * R1 GREEN primitive: read-only SPL token receive scan.
 *
 * Calls `mcp.toreva.com` JSON-RPC `tools/call` with `toreva_token_receive_scan`.
 * Returns recent inbound SPL Token + System Program receive events for a
 * given wallet (read-only, no execution, no signing).
 *
 * Family: token_ops. Operation: scan. Tier: T2 (read-only operational).
 */

export interface TokenReceiveParams {
  /** Solana wallet base58 address to scan. */
  wallet: string;
  /** Max number of recent signatures to inspect. Default 10. Capped at 25. */
  limit?: number;
}

export interface TokenReceiveEvent {
  signature?: string;
  mint?: string;
  amount?: number;
  decimals?: number;
  fromWallet?: string;
  blockTime?: string;
  slot?: number;
  /** Tool may attach additional fields per event type — pass through as unknown. */
  [extra: string]: unknown;
}

export interface TokenReceiveEvidenceRef {
  readEvidenceId: string;
  venueIntelligenceReceiptId: string;
  sentinelReviewReceiptId: string;
}

/**
 * Canonical response shape returned by `toreva_token_receive_scan`.
 *
 * Note the live tool reports inspection counts via `inspectedSignatureCount`
 * and `totalSignatureCountReturned`. The events array is `events`. We expose
 * `count` as a derived alias of `totalSignatureCountReturned` for ergonomics.
 */
export interface TokenReceiveResult {
  ok: boolean;
  /** Echo of the scanned wallet address (live tool uses `walletAddress`). */
  walletAddress: string;
  /** Convenience alias for `walletAddress`. */
  wallet: string;
  /** Number of signatures the tool inspected (`inspectedSignatureCount`). */
  inspectedSignatureCount: number;
  /** Number of receive events returned (`totalSignatureCountReturned`). */
  totalSignatureCountReturned: number;
  /** Convenience alias for `totalSignatureCountReturned`. */
  count: number;
  events: TokenReceiveEvent[];
  /** Convenience alias for `events`. */
  receives: TokenReceiveEvent[];
  splTokenProgramId?: string;
  splToken2022ProgramId?: string;
  systemProgramId?: string;
  source: string;
  sourceUrl?: string;
  fetchedAt?: string;
  evidenceRef: TokenReceiveEvidenceRef;
  tool: string;
  familyId: string;
  primitiveId: string;
  venue?: string;
  operation: string;
  latencyMs?: number;
}

export interface TokenReceiveOptions {
  mcpUrl?: string;
  apiKey?: string;
  fetchImpl?: typeof fetch;
}

const DEFAULT_MCP_URL = 'https://mcp.toreva.com';
const PUBLIC_SYNTHETIC_KEY = 'tk_litmus_r1_synthetic_3rd_party_trading_bot_demo_only';
const TOOL_NAME = 'toreva_token_receive_scan';
const MAX_LIMIT = 25;

/**
 * Scan a Solana wallet for recent inbound SPL Token + System Program
 * receive events.
 *
 * Read-only: never signs, never sends. The MCP tool reads from the Solana
 * RPC and returns a structured snapshot with the evidence triple for audit.
 *
 * @example
 * ```ts
 * const r = await tokenReceive({ wallet: '5N...abc', limit: 10 });
 * console.log(r.count, r.events[0]?.signature);
 * ```
 */
export async function tokenReceive(
  params: TokenReceiveParams,
  options: TokenReceiveOptions = {}
): Promise<TokenReceiveResult> {
  if (!params.wallet || typeof params.wallet !== 'string') {
    throw new Error('tokenReceive: wallet (string) is required');
  }
  if (params.limit !== undefined && (params.limit < 1 || params.limit > MAX_LIMIT)) {
    throw new Error(`tokenReceive: limit must be between 1 and ${MAX_LIMIT}`);
  }

  const mcpUrl = (options.mcpUrl ?? DEFAULT_MCP_URL).replace(/\/+$/, '');
  const apiKey = options.apiKey ?? process.env.TOREVA_API_KEY ?? PUBLIC_SYNTHETIC_KEY;
  const fetchImpl = options.fetchImpl ?? fetch;

  const args: Record<string, unknown> = { walletAddress: params.wallet };
  if (params.limit !== undefined) args.limit = params.limit;

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
      params: { name: TOOL_NAME, arguments: args },
    }),
  });

  if (!response.ok) {
    throw new Error(`tokenReceive: MCP call failed with HTTP ${response.status}`);
  }

  const body = (await response.json()) as {
    jsonrpc?: string;
    id?: number;
    result?: {
      structuredContent?: Partial<TokenReceiveResult> & { error?: string; code?: string };
      isError?: boolean;
    };
    error?: { code: number; message: string };
  };

  if (body.error) {
    throw new Error(`tokenReceive: MCP error ${body.error.code}: ${body.error.message}`);
  }

  const structured = body.result?.structuredContent;
  if (!structured) {
    throw new Error('tokenReceive: MCP response missing structuredContent');
  }
  if (body.result?.isError) {
    const errMsg = structured.error || 'tool returned error payload';
    throw new Error(`tokenReceive: ${errMsg}`);
  }

  // Normalise the shape: surface ergonomic aliases (`wallet`, `count`,
  // `receives`) alongside the canonical fields.
  return {
    ...structured,
    wallet: structured.walletAddress ?? params.wallet,
    walletAddress: structured.walletAddress ?? params.wallet,
    count: structured.totalSignatureCountReturned ?? 0,
    inspectedSignatureCount: structured.inspectedSignatureCount ?? 0,
    totalSignatureCountReturned: structured.totalSignatureCountReturned ?? 0,
    events: structured.events ?? [],
    receives: structured.events ?? [],
  } as TokenReceiveResult;
}
