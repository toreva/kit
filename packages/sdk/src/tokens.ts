/**
 * R1 GREEN primitive: read-only SPL token receive scan.
 *
 * Calls `mcp.toreva.com` JSON-RPC `tools/call` with `toreva_token_receive_scan`.
 * Returns recent inbound SPL token transfers for a given wallet (read-only,
 * no execution, no signing).
 *
 * Family: token_ops. Operation: scan. Tier: T2 (read-only operational).
 */

export interface TokenReceiveParams {
  /** Solana wallet address to scan. */
  wallet: string;
  /** Max number of recent receives to return (default: 25). */
  limit?: number;
}

export interface TokenReceiveEntry {
  /** Solana transaction signature. */
  signature?: string;
  /** SPL token mint address. */
  mint?: string;
  /** Token amount (UI units). */
  amount?: number;
  /** Token decimals. */
  decimals?: number;
  /** Sender wallet address. */
  fromWallet?: string;
  /** Block time (ISO). */
  blockTime?: string;
  /** Slot number. */
  slot?: number;
}

export interface TokenReceiveEvidenceRef {
  readEvidenceId: string;
  venueIntelligenceReceiptId: string;
  sentinelReviewReceiptId: string;
}

export interface TokenReceiveResult {
  ok: boolean;
  wallet: string;
  receives: TokenReceiveEntry[];
  count: number;
  source: string;
  sourceUrl?: string;
  fetchedAt?: string;
  evidenceRef: TokenReceiveEvidenceRef;
  tool: string;
  familyId: string;
  primitiveId: string;
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

/**
 * Scan a Solana wallet for recent inbound SPL token transfers.
 *
 * Read-only: never signs, never sends. The MCP tool reads from the Solana
 * RPC and returns a structured snapshot with the evidence triple for audit.
 *
 * @example
 * ```ts
 * const r = await tokenReceive({ wallet: '5N...abc', limit: 10 });
 * console.log(r.count, r.receives[0]?.signature);
 * ```
 */
export async function tokenReceive(
  params: TokenReceiveParams,
  options: TokenReceiveOptions = {}
): Promise<TokenReceiveResult> {
  if (!params.wallet || typeof params.wallet !== 'string') {
    throw new Error('tokenReceive: wallet (string) is required');
  }
  if (params.limit !== undefined && (params.limit < 1 || params.limit > 1000)) {
    throw new Error('tokenReceive: limit must be between 1 and 1000');
  }

  const mcpUrl = (options.mcpUrl ?? DEFAULT_MCP_URL).replace(/\/+$/, '');
  const apiKey = options.apiKey ?? process.env.TOREVA_API_KEY ?? PUBLIC_SYNTHETIC_KEY;
  const fetchImpl = options.fetchImpl ?? fetch;

  const args: Record<string, unknown> = { wallet: params.wallet };
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
    result?: { structuredContent?: TokenReceiveResult; isError?: boolean };
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
    throw new Error('tokenReceive: MCP tool returned error payload');
  }

  return structured;
}
