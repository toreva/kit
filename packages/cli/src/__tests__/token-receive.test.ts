import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  parseTokenReceiveArgs,
  formatTokenReceive,
  runTokenReceiveCommand,
} from '../commands/token-receive.js';
import type { TokenReceiveResult } from '@toreva/sdk';

const event = {
  signature: '4xF2abcd9876sig',
  mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  amount: 100,
  decimals: 6,
  fromWallet: 'Sender11111111111111111111111111111111111111',
  blockTime: '2026-05-10T11:50:00.000Z',
  slot: 418_488_700,
};
const baseResult: TokenReceiveResult = {
  ok: true,
  walletAddress: 'TestWallet1111111111111111111111111111111111',
  wallet: 'TestWallet1111111111111111111111111111111111',
  inspectedSignatureCount: 1,
  totalSignatureCountReturned: 1,
  count: 1,
  events: [event],
  receives: [event],
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

vi.mock('@toreva/sdk', async () => {
  const actual = await vi.importActual<typeof import('@toreva/sdk')>('@toreva/sdk');
  return {
    ...actual,
    tokenReceive: vi.fn(async () => baseResult),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('parseTokenReceiveArgs', () => {
  it('accepts --wallet=<addr>', () => {
    const r = parseTokenReceiveArgs(['--wallet=ABC123']);
    expect(r).toEqual({ wallet: 'ABC123' });
  });

  it('accepts --wallet <addr> --limit 25', () => {
    const r = parseTokenReceiveArgs(['--wallet', 'ABC123', '--limit', '25']);
    expect(r).toEqual({ wallet: 'ABC123', limit: 25 });
  });

  it('throws on missing --wallet', () => {
    expect(() => parseTokenReceiveArgs([])).toThrow(/wallet/);
  });

  it('rejects out-of-range limit (low)', () => {
    expect(() => parseTokenReceiveArgs(['--wallet=ABC', '--limit=0'])).toThrow(/limit/);
  });

  it('rejects out-of-range limit (high — capped at 25 by live MCP)', () => {
    expect(() => parseTokenReceiveArgs(['--wallet=ABC', '--limit=9999'])).toThrow(/limit/);
  });

  it('rejects non-numeric limit', () => {
    expect(() => parseTokenReceiveArgs(['--wallet=ABC', '--limit=abc'])).toThrow(/limit/);
  });
});

describe('formatTokenReceive', () => {
  it('renders the wallet, count, source, and evidence triple', () => {
    const out = formatTokenReceive(baseResult);
    expect(out).toMatch(/Wallet\s+TestWallet/);
    expect(out).toMatch(/Receives\s+1/);
    expect(out).toMatch(/Source\s+solana-rpc/);
    expect(out).toMatch(/sentinel\s+SENT-REVIEW/);
    expect(out).toMatch(/venue intel\s+VS-/);
    expect(out).toMatch(/read\s+NETSOL-READ/);
  });

  it('renders a row per receive entry with truncated mint and signature', () => {
    const out = formatTokenReceive(baseResult);
    expect(out).toMatch(/2026-05-10T11:50:00\.000Z/);
    expect(out).toMatch(/amount=100/);
    expect(out).toMatch(/mint=EPjFWdd5/);
    expect(out).toMatch(/sig=4xF2abcd/);
  });

  it('renders a friendly empty-state message when no receives', () => {
    const empty: TokenReceiveResult = {
      ...baseResult,
      receives: [],
      events: [],
      count: 0,
      totalSignatureCountReturned: 0,
    };
    const out = formatTokenReceive(empty);
    expect(out).toMatch(/no recent inbound SPL token transfers/);
  });
});

describe('runTokenReceiveCommand', () => {
  it('calls tokenReceive with parsed args and prints the table', async () => {
    const sdk = await import('@toreva/sdk');
    const mockedTokenReceive = vi.mocked(sdk.tokenReceive);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    await runTokenReceiveCommand(['--wallet=ABC123', '--limit=10']);

    expect(mockedTokenReceive).toHaveBeenCalledWith({ wallet: 'ABC123', limit: 10 });
    const printed = logSpy.mock.calls.flat().join('\n');
    expect(printed).toMatch(/TestWallet/);
    expect(printed).toMatch(/SENT-REVIEW/);
    logSpy.mockRestore();
  });
});
