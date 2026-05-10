import { describe, it, expect, vi } from 'vitest';
import { earnCompare, type EarnCompareResult } from '../earn.js';
import { tokenReceive, type TokenReceiveResult } from '../tokens.js';
import {
  PerpsApi,
  openLong,
  openShort,
  closePosition,
  addMargin,
  removeMargin,
  cancelOrder,
} from '../perps.js';
import { TorevaClient } from '../client.js';

// ---------------------------------------------------------------------------
// Helpers — build a fake fetch that returns a JSON-RPC tools/call response.
// ---------------------------------------------------------------------------

function makeMockFetch<T>(structuredContent: T, opts: { ok?: boolean; isError?: boolean } = {}) {
  const ok = opts.ok ?? true;
  const isError = opts.isError ?? false;
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: async () => ({
      jsonrpc: '2.0',
      id: 1,
      result: { structuredContent, isError },
    }),
  } as unknown as Response);
}

// ---------------------------------------------------------------------------
// earnCompare
// ---------------------------------------------------------------------------

describe('earnCompare', () => {
  const baseResult: EarnCompareResult = {
    ok: true,
    venue: 'kamino',
    asset: 'USDC',
    apyPct: 4.36,
    apyBasePct: 4.36,
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

  it('returns the canonical EarnCompareResult shape for kamino USDC', async () => {
    const fetchImpl = makeMockFetch(baseResult);
    const r = await earnCompare(
      { asset: 'USDC', venue: 'kamino' },
      { fetchImpl: fetchImpl as unknown as typeof fetch }
    );

    expect(r.ok).toBe(true);
    expect(r.venue).toBe('kamino');
    expect(r.asset).toBe('USDC');
    expect(typeof r.apyPct).toBe('number');
    expect(r.source).toBe('defillama');
    expect(r.evidenceRef).toEqual({
      readEvidenceId: expect.stringContaining('NETSOL-READ'),
      venueIntelligenceReceiptId: expect.stringContaining('VS-'),
      sentinelReviewReceiptId: expect.stringContaining('SENT-REVIEW'),
    });
    expect(r.tool).toBe('toreva_earn_compare_kamino');
    expect(r.familyId).toBe('earn_lending');
  });

  it('returns marginfi shape when venue=marginfi', async () => {
    const marginfiResult: EarnCompareResult = {
      ...baseResult,
      venue: 'marginfi',
      project: 'marginfi',
      tool: 'toreva_earn_compare_marginfi',
    };
    const fetchImpl = makeMockFetch(marginfiResult);
    const r = await earnCompare(
      { asset: 'USDC', venue: 'marginfi' },
      { fetchImpl: fetchImpl as unknown as typeof fetch }
    );
    expect(r.venue).toBe('marginfi');
    expect(r.tool).toBe('toreva_earn_compare_marginfi');
  });

  it('rejects venues outside the admitted set at runtime', async () => {
    const fetchImpl = makeMockFetch(baseResult);
    await expect(
      earnCompare(
        // @ts-expect-error — TypeScript should also reject 'save'
        { asset: 'USDC', venue: 'save' },
        { fetchImpl: fetchImpl as unknown as typeof fetch }
      )
    ).rejects.toThrow(/venue "save" not in admitted set/);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rejects non-USDC assets at runtime', async () => {
    const fetchImpl = makeMockFetch(baseResult);
    await expect(
      earnCompare(
        // @ts-expect-error — only USDC is admitted in R1
        { asset: 'SOL', venue: 'kamino' },
        { fetchImpl: fetchImpl as unknown as typeof fetch }
      )
    ).rejects.toThrow(/asset "SOL" not supported/);
  });

  it('throws on HTTP error', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => ({}),
    } as unknown as Response);
    await expect(
      earnCompare(
        { asset: 'USDC', venue: 'kamino' },
        { fetchImpl: fetchImpl as unknown as typeof fetch }
      )
    ).rejects.toThrow(/HTTP 502/);
  });

  it('throws when MCP returns isError', async () => {
    const fetchImpl = makeMockFetch(baseResult, { isError: true });
    await expect(
      earnCompare(
        { asset: 'USDC', venue: 'kamino' },
        { fetchImpl: fetchImpl as unknown as typeof fetch }
      )
    ).rejects.toThrow(/error payload/);
  });

  it('uses the JSON-RPC tools/call envelope with the right tool name', async () => {
    const fetchImpl = makeMockFetch(baseResult);
    await earnCompare(
      { asset: 'USDC', venue: 'kamino' },
      { fetchImpl: fetchImpl as unknown as typeof fetch }
    );
    const call = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call?.[0]).toMatch(/\/mcp$/);
    const body = JSON.parse((call?.[1] as RequestInit)?.body as string);
    expect(body.jsonrpc).toBe('2.0');
    expect(body.method).toBe('tools/call');
    expect(body.params.name).toBe('toreva_earn_compare_kamino');
  });
});

// ---------------------------------------------------------------------------
// tokenReceive
// ---------------------------------------------------------------------------

describe('tokenReceive', () => {
  const baseResult: TokenReceiveResult = {
    ok: true,
    wallet: 'TestWallet1111111111111111111111111111111111',
    receives: [
      {
        signature: '4xF2...sig',
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        amount: 100,
        decimals: 6,
        fromWallet: 'Sender11111111111111111111111111111111111111',
        blockTime: '2026-05-10T11:50:00.000Z',
        slot: 418_488_700,
      },
    ],
    count: 1,
    source: 'solana-rpc',
    fetchedAt: '2026-05-10T12:20:09.082Z',
    evidenceRef: {
      readEvidenceId: 'NETSOL-READ-spl-token-receive-2026-05-08',
      venueIntelligenceReceiptId: 'VS-spl-token-receive-2026-05-08',
      sentinelReviewReceiptId: 'SENT-REVIEW-spl-token-receive-2026-05-08',
    },
    tool: 'toreva_token_receive_scan',
    familyId: 'token_ops',
    primitiveId: 'exec.receive',
    operation: 'scan',
    latencyMs: 600,
  };

  it('returns the canonical TokenReceiveResult shape', async () => {
    const fetchImpl = makeMockFetch(baseResult);
    const r = await tokenReceive(
      { wallet: baseResult.wallet, limit: 10 },
      { fetchImpl: fetchImpl as unknown as typeof fetch }
    );
    expect(r.ok).toBe(true);
    expect(r.wallet).toBe(baseResult.wallet);
    expect(Array.isArray(r.receives)).toBe(true);
    expect(r.evidenceRef.sentinelReviewReceiptId).toMatch(/SENT-REVIEW/);
    expect(r.familyId).toBe('token_ops');
    expect(r.tool).toBe('toreva_token_receive_scan');
  });

  it('rejects empty wallet', async () => {
    const fetchImpl = makeMockFetch(baseResult);
    await expect(
      tokenReceive(
        { wallet: '' },
        { fetchImpl: fetchImpl as unknown as typeof fetch }
      )
    ).rejects.toThrow(/wallet/);
  });

  it('rejects out-of-range limit', async () => {
    const fetchImpl = makeMockFetch(baseResult);
    await expect(
      tokenReceive(
        { wallet: baseResult.wallet, limit: 9999 },
        { fetchImpl: fetchImpl as unknown as typeof fetch }
      )
    ).rejects.toThrow(/limit/);
  });

  it('passes wallet + limit through to MCP arguments', async () => {
    const fetchImpl = makeMockFetch(baseResult);
    await tokenReceive(
      { wallet: baseResult.wallet, limit: 5 },
      { fetchImpl: fetchImpl as unknown as typeof fetch }
    );
    const call = (fetchImpl as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse((call?.[1] as RequestInit)?.body as string);
    expect(body.params.name).toBe('toreva_token_receive_scan');
    expect(body.params.arguments).toEqual({ wallet: baseResult.wallet, limit: 5 });
  });
});

// ---------------------------------------------------------------------------
// perps DISCOVERY_ONLY
// ---------------------------------------------------------------------------

describe('perps DISCOVERY_ONLY guard', () => {
  it('PerpsApi.call throws DISCOVERY_ONLY error', async () => {
    const client = new TorevaClient({ relayAuthToken: 'irrelevant' });
    const api = new PerpsApi(client);
    expect(() =>
      api.call('toreva_perps_open_long' as never, {} as never)
    ).toThrow(/DISCOVERY_ONLY/);
  });

  it('openLong throws DISCOVERY_ONLY', () => {
    expect(() => openLong({})).toThrow(/DISCOVERY_ONLY/);
  });

  it('openShort throws DISCOVERY_ONLY', () => {
    expect(() => openShort({})).toThrow(/DISCOVERY_ONLY/);
  });

  it('closePosition throws DISCOVERY_ONLY', () => {
    expect(() => closePosition({})).toThrow(/DISCOVERY_ONLY/);
  });

  it('addMargin / removeMargin / cancelOrder throw DISCOVERY_ONLY', () => {
    expect(() => addMargin({})).toThrow(/DISCOVERY_ONLY/);
    expect(() => removeMargin({})).toThrow(/DISCOVERY_ONLY/);
    expect(() => cancelOrder({})).toThrow(/DISCOVERY_ONLY/);
  });

  it('error message points to roadmap URL', () => {
    try {
      openLong({});
    } catch (err) {
      expect((err as Error).message).toMatch(/toreva\.com\/roadmap/);
    }
  });
});
