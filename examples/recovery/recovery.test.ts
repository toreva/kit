import { afterEach, describe, expect, it, vi } from 'vitest';
import { recoverFromPacifica, type SolanaKeypair } from './recovery.js';

const TEST_ACCOUNT = 'Recovery111111111111111111111111111111111111';

const keypair: SolanaKeypair = {
  seed: new Uint8Array(32),
  publicKeyBytes: new Uint8Array(32),
  publicKey: TEST_ACCOUNT,
};

describe('recoverFromPacifica account query contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('has fake Pacifica readers for each account query producer', async () => {
    const observed = new Map<string, string | null>();

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = new URL(String(input));
        observed.set(url.pathname, url.searchParams.get('account'));

        if (url.pathname === '/positions') {
          return jsonResponse({ positions: [] });
        }

        if (url.pathname === '/account/balances') {
          return jsonResponse({ balances: [] });
        }

        return jsonResponse({ error: 'unexpected path' }, 404);
      }),
    );

    const result = await recoverFromPacifica({
      keypair,
      pacificaApiUrl: 'https://api.pacifica.example',
    });

    expect(result).toEqual({
      closedPositions: [],
      withdrawals: [],
      txSignatures: [],
    });
    expect(observed).toEqual(
      new Map([
        ['/positions', TEST_ACCOUNT],
        ['/account/balances', TEST_ACCOUNT],
      ]),
    );
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
