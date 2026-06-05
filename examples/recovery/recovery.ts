/**
 * recovery.ts — Toreva-independent custody recovery script.
 *
 * Path: kit/examples/recovery/recovery.ts
 *
 * Purpose: prove that an integrator can withdraw margin and close perp
 * positions on Pacifica using ONLY their wallet keypair + Pacifica's
 * native API, with Toreva entirely offline. This is the artefact behind
 * prospect packet §2.3 ("pull-the-plug test").
 *
 * Requirements: Node.js 18+ (native fetch + node:crypto Ed25519 support).
 * Zero external npm dependencies — everything runs with the standard library.
 *
 * Usage:
 *   npx tsx examples/recovery/recovery.ts
 *   (set WALLET_KEYPAIR_JSON and PACIFICA_API_BASE env vars — see bottom of file)
 *
 * Bus-first note: this is engineering code, not a kit-agent claim.
 * Authoring + reviewing + merging follow standard PR flow. Risk-agent
 * audits the source post-merge to verify "no Toreva-side state required
 * to recover funds" before publishing risk.attestation.custody_recoverable.
 *
 * Custody note: Pacifica's close and withdraw operations are initiated via
 * Pacifica's own REST API (signed with the user's keypair). Pacifica's backend
 * submits the resulting on-chain transaction. Toreva is NOT in the loop, but
 * Pacifica's API must be reachable. The non-custodial guarantee is specifically:
 * Toreva never holds private keys and is not required for fund recovery.
 *
 * Does NOT call: any toreva.com endpoint. Verify with mitmproxy if desired.
 */

import { createPrivateKey, sign as cryptoSign } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Pacifica mainnet program ID — verified on Solana mainnet:
//   executable: true, owner: BPFLoaderUpgradeab1e11111111111111111111111
// Source: pacifica-fi/python-sdk (github.com/pacifica-fi/python-sdk), official Pacifica GitHub org.
// Verify yourself: solana program show PCFA5iYgmqK6MqPhWNKg7Yv7auX7VZ4Cx7T1eJyrAMH
export const PACIFICA_PROGRAM_ID = 'PCFA5iYgmqK6MqPhWNKg7Yv7auX7VZ4Cx7T1eJyrAMH';

// Pacifica REST API roots — NOT Toreva endpoints.
// Testnet: https://test-api.pacifica.fi/api/v1
export const PACIFICA_API_BASE = 'https://api.pacifica.fi/api/v1';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SolanaKeypair {
  /** 32-byte Ed25519 private seed (first half of Solana secretKey array) */
  seed: Uint8Array;
  /** 32-byte Ed25519 public key (second half of Solana secretKey array) */
  publicKeyBytes: Uint8Array;
  /** Base58-encoded public key — the Solana wallet address */
  publicKey: string;
}

export interface RecoveryConfig {
  /** Wallet keypair — the ONLY signing authority. Use loadKeypairFromFile(). */
  keypair: SolanaKeypair;
  /** Override Pacifica API base URL — useful for testnet dry-runs. */
  pacificaApiUrl?: string;
}

export interface RecoveryResult {
  closedPositions: Array<{ positionId: string; closeTx: string }>;
  withdrawals: Array<{ token: string; amount: string; withdrawTx: string }>;
  /** All transaction identifiers, in chronological order. */
  txSignatures: string[];
}

// ─── Main recovery function ────────────────────────────────────────────────────

/**
 * Recover all funds + close all positions on Pacifica without Toreva.
 *
 * Steps:
 *   1. Query open positions via Pacifica's REST API (wallet pubkey in query param)
 *   2. For each position: send a signed reduce-only market order to close it
 *   3. Query margin balances
 *   4. For each non-zero balance: send a signed withdrawal request
 *   5. Return all tx identifiers for verification on Solana explorer
 *
 * Failure modes:
 *   - Pacifica API unreachable: throws PacificaError; caller should retry
 *   - Position already liquidated: Pacifica returns an error; logged + skipped
 */
export async function recoverFromPacifica(config: RecoveryConfig): Promise<RecoveryResult> {
  const base = (config.pacificaApiUrl ?? PACIFICA_API_BASE).replace(/\/$/, '');
  const { keypair } = config;

  // ─── 1. Query open positions ──────────────────────────────────────────────
  const positionsJson = await pacificaGet(base, `/positions?account=${keypair.publicKey}`);
  const positions = (positionsJson as { positions?: PacificaPosition[] }).positions ?? [];

  // ─── 2. Close each open position ─────────────────────────────────────────
  // Pacifica has no dedicated close endpoint; pass reduce_only=true on a market order.
  // Source: Pacifica API docs — pacifica.gitbook.io/docs/api-documentation/api/rest-api/orders
  const closedPositions: RecoveryResult['closedPositions'] = [];
  for (const pos of positions) {
    const closeSide: 'buy' | 'sell' = pos.side === 'long' ? 'sell' : 'buy';
    let result: Record<string, unknown>;
    try {
      result = (await pacificaPost(base, '/orders/create_market', keypair, {
        amount: pos.size,
        client_order_id: `recovery-close-${pos.id}`,
        reduce_only: true,
        side: closeSide,
        slippage_percent: '1',
        symbol: pos.symbol,
        type: 'create_market_order',
      })) as Record<string, unknown>;
    } catch (err) {
      // Position may already be closed/liquidated — log and continue
      console.error(`Skipping position ${pos.id} (${pos.symbol}): ${err}`);
      continue;
    }
    const closeTx = String(result.tx_hash ?? result.order_id ?? `close-${pos.id}`);
    closedPositions.push({ positionId: pos.id, closeTx });
  }

  // ─── 3. Query margin balances ─────────────────────────────────────────────
  const balancesJson = await pacificaGet(base, `/account/balances?account=${keypair.publicKey}`);
  const balances = (balancesJson as { balances?: PacificaBalance[] }).balances ?? [];

  // ─── 4. Withdraw each non-zero balance ───────────────────────────────────
  // Source: Pacifica API docs — pacifica.gitbook.io/docs/api-documentation/api/rest-api/account
  const withdrawals: RecoveryResult['withdrawals'] = [];
  for (const bal of balances) {
    if (!bal.amount || BigInt(bal.amount) <= 0n) continue;
    const result = (await pacificaPost(base, '/account/withdraw', keypair, {
      amount: bal.amount,
      token: bal.token,
      type: 'withdraw_from_lake',
    })) as Record<string, unknown>;
    const withdrawTx = String(result.tx_hash ?? result.withdrawal_id ?? `withdraw-${bal.token}`);
    withdrawals.push({ token: bal.token, amount: bal.amount, withdrawTx });
  }

  return {
    closedPositions,
    withdrawals,
    txSignatures: [
      ...closedPositions.map((c) => c.closeTx),
      ...withdrawals.map((w) => w.withdrawTx),
    ],
  };
}

// ─── Pacifica authentication ─────────────────────────────────────────────────

// Pacifica uses stateless Ed25519 per-request signing — no session token is issued.
// Each POST body includes: all request fields + account + timestamp + expiry_window.
// The combined object is sorted alphabetically, serialised as compact JSON, and
// signed with the wallet's Ed25519 private key. The base64 signature is appended.
//
// Source: pacifica-fi/python-sdk (github.com/pacifica-fi/python-sdk) +
//         Pacifica API docs (pacifica.gitbook.io/docs/api-documentation).
function buildSignedBody(
  keypair: SolanaKeypair,
  fields: Record<string, unknown>,
): Record<string, unknown> {
  const timestamp = Date.now();
  const body: Record<string, unknown> = {
    ...fields,
    account: keypair.publicKey,
    expiry_window: 5000,
    timestamp,
  };
  const sorted = Object.fromEntries(
    Object.entries(body).sort(([a], [b]) => a.localeCompare(b)),
  );
  const msgBytes = new TextEncoder().encode(JSON.stringify(sorted));
  const sigBytes = ed25519Sign(keypair.seed, msgBytes);
  return { ...body, signature: Buffer.from(sigBytes).toString('base64') };
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function pacificaGet(base: string, path: string): Promise<unknown> {
  const res = await fetch(`${base}${path}`);
  if (!res.ok) {
    throw new PacificaError(`GET ${path} → ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function pacificaPost(
  base: string,
  path: string,
  keypair: SolanaKeypair,
  fields: Record<string, unknown>,
): Promise<unknown> {
  const body = buildSignedBody(keypair, fields);
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new PacificaError(`POST ${path} → ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

// ─── Ed25519 signing via node:crypto (Node.js 15+) ───────────────────────────

// Signs arbitrary bytes using a 32-byte Ed25519 seed.
// node:crypto requires the seed wrapped in PKCS#8 DER format.
// PKCS#8 header bytes: 302e020100300506032b657004220420 (ASN.1 for Ed25519 OID 1.3.101.112)
function ed25519Sign(seed: Uint8Array, message: Uint8Array): Uint8Array {
  const pkcs8Header = Buffer.from('302e020100300506032b657004220420', 'hex');
  const pkcs8Der = Buffer.concat([pkcs8Header, Buffer.from(seed.slice(0, 32))]);
  const privKey = createPrivateKey({ key: pkcs8Der, format: 'der', type: 'pkcs8' });
  return new Uint8Array(cryptoSign(null, Buffer.from(message), privKey));
}

// ─── Keypair loader ──────────────────────────────────────────────────────────

/**
 * Load a Solana keypair from a JSON file (e.g. ~/.config/solana/id.json).
 * The file must contain a JSON array of 64 numbers: [seed(32 bytes) | pubkey(32 bytes)].
 */
export function loadKeypairFromFile(filePath: string): SolanaKeypair {
  const raw = JSON.parse(readFileSync(filePath, 'utf8')) as number[];
  if (!Array.isArray(raw) || raw.length !== 64) {
    throw new Error(`Expected a 64-element number array in ${filePath}`);
  }
  const seed = Uint8Array.from(raw.slice(0, 32));
  const publicKeyBytes = Uint8Array.from(raw.slice(32, 64));
  return { seed, publicKeyBytes, publicKey: base58Encode(publicKeyBytes) };
}

// ─── Minimal base58 encoder (for Solana public keys) ─────────────────────────

const B58_ALPHA = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(bytes: Uint8Array): string {
  const digits = [0];
  for (const byte of bytes) {
    let carry = byte;
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i]! << 8;
      digits[i] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let result = '';
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) result += '1';
  for (let i = digits.length - 1; i >= 0; i--) result += B58_ALPHA[digits[i]!];
  return result;
}

// ─── Error types ─────────────────────────────────────────────────────────────

export class PacificaError extends Error {
  constructor(detail: string) {
    super(`Pacifica API error: ${detail}`);
    this.name = 'PacificaError';
  }
}

// ─── Internal types ──────────────────────────────────────────────────────────

interface PacificaPosition {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: string;
}

interface PacificaBalance {
  token: string;
  amount: string;
}

// ─── CLI entry point ─────────────────────────────────────────────────────────

// When run directly (npx tsx recovery.ts), reads env vars and executes recovery.
// Set WALLET_KEYPAIR_JSON to your Solana keypair file path.
// Set PACIFICA_API_BASE to override the API root (e.g. for testnet dry-run).
if (process.argv[1] && new URL(process.argv[1], 'file://').pathname === new URL(import.meta.url).pathname) {
  const keypairPath = process.env.WALLET_KEYPAIR_JSON ?? `${process.env.HOME}/.config/solana/id.json`;
  const keypair = loadKeypairFromFile(keypairPath);
  console.log(`Recovering funds for wallet: ${keypair.publicKey}`);
  console.log(`Pacifica program ID (reference): ${PACIFICA_PROGRAM_ID}`);
  recoverFromPacifica({
    keypair,
    pacificaApiUrl: process.env.PACIFICA_API_BASE,
  })
    .then((result) => {
      console.log('Recovery complete:', JSON.stringify(result, null, 2));
    })
    .catch((err) => {
      console.error('Recovery failed:', err);
      process.exit(1);
    });
}
