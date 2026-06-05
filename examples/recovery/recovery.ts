/**
 * recovery.ts — Toreva-independent custody recovery script (skeleton).
 *
 * Path: kit/examples/recovery/recovery.ts
 *
 * Purpose: prove that an integrator can withdraw margin and close perp
 * positions on Pacifica using ONLY their wallet keypair + Pacifica's
 * native API, with Toreva entirely offline. This is the artefact behind
 * prospect packet §2.3 ("pull-the-plug test").
 *
 * Bus-first note: this is engineering code, not a kit-agent claim.
 * Authoring + reviewing + merging follow standard PR flow. Risk-agent
 * audits the source post-merge to verify "no Toreva-side state required
 * to recover funds" before publishing risk.attestation.custody_recoverable.
 *
 * Status: SKELETON — not yet attested.
 * Blockers before attestation:
 *   - Replace PACIFICA_PROGRAM_ID with authoritative mainnet program ID
 *   - Implement authenticateWithPacifica per Pacifica's auth-challenge docs
 *   - Implement buildPacificaCloseInstruction using Pacifica's IDL/SDK
 *   - Implement buildPacificaWithdrawInstruction using Pacifica's IDL/SDK
 *   - Run pnpm typecheck + at least one dry-run trace against devnet
 * Once all TODOs are resolved, risk-agent reviews and sets attested_by
 * in kit/data/founder-narrative/rollback-path-schema.json.
 */

import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';

// ─── TODO(kit): replace with Pacifica's authoritative constants ──────────
// Pacifica program ID (Solana mainnet) — verify against Pacifica docs or on-chain
const PACIFICA_PROGRAM_ID = new PublicKey('REPLACE_WITH_PACIFICA_MAINNET_PROGRAM_ID');
// Pacifica's native HTTP API root (for off-chain queries — NOT Toreva)
const PACIFICA_API_URL = 'https://api.pacifica.fi';
// ─────────────────────────────────────────────────────────────────────────

export interface RecoveryConfig {
  /** User's wallet keypair — the ONLY signing authority */
  walletKeypair: Keypair;
  /** Solana RPC endpoint — public RPC works; user can supply their own */
  rpcUrl: string;
  /** Optional override for Pacifica API root (default: production) */
  pacificaApiUrl?: string;
}

export interface RecoveryResult {
  closedPositions: Array<{ positionId: string; closeTx: string }>;
  withdrawals: Array<{ token: string; amount: string; withdrawTx: string }>;
  /** All tx signatures, in chronological order */
  txSignatures: string[];
}

/**
 * Recover all funds + close all positions on Pacifica without Toreva.
 *
 * Steps:
 *   1. Connect directly to Pacifica's API (no Toreva intermediary)
 *   2. Authenticate by signing Pacifica's challenge with walletKeypair
 *   3. Query open positions for walletKeypair.publicKey
 *   4. For each position: build close instruction, sign locally, submit
 *   5. Query margin balances, build withdraw instructions, sign, submit
 *   6. Return all tx signatures for caller to verify on Solana explorer
 *
 * Failure modes:
 *   - Pacifica API down: throws PacificaUnavailableError; caller can retry
 *   - Insufficient SOL for tx fees: throws InsufficientFeeBalance (advise top-up)
 *   - Position cannot be closed (e.g. liquidated already): logged + skipped
 *
 * Does NOT call: any toreva.com endpoint. Verify with mitmproxy if desired.
 */
export async function recoverFromPacifica(config: RecoveryConfig): Promise<RecoveryResult> {
  const apiUrl = config.pacificaApiUrl ?? PACIFICA_API_URL;
  const connection = new Connection(config.rpcUrl, 'confirmed');
  const wallet = config.walletKeypair.publicKey;

  // ─── 1. Authenticate to Pacifica ────────────────────────────────────────
  // TODO(kit): implement Pacifica's actual auth challenge flow per their docs.
  // Typical pattern: GET /auth/challenge?wallet=<pubkey> → sign nonce → POST /auth/verify.
  const sessionToken = await authenticateWithPacifica(apiUrl, config.walletKeypair);

  // ─── 2. Query open positions ────────────────────────────────────────────
  const positions = await fetch(`${apiUrl}/v1/positions?wallet=${wallet.toBase58()}`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  }).then((r) => r.json() as Promise<Array<{ id: string; size: string; market: string }>>);

  // ─── 3. Close each position ─────────────────────────────────────────────
  const closedPositions: RecoveryResult['closedPositions'] = [];
  for (const pos of positions) {
    // TODO(kit): build the close-position instruction using Pacifica's IDL/program
    const closeInstruction = await buildPacificaCloseInstruction(connection, wallet, pos.id);
    const tx = new Transaction().add(closeInstruction);
    const blockhash = await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash.blockhash;
    tx.feePayer = wallet;
    tx.sign(config.walletKeypair); // sign LOCALLY — keypair never leaves caller's machine
    const sig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction({ signature: sig, ...blockhash }, 'confirmed');
    closedPositions.push({ positionId: pos.id, closeTx: sig });
  }

  // ─── 4. Query margin balances ───────────────────────────────────────────
  const balances = await fetch(`${apiUrl}/v1/balances?wallet=${wallet.toBase58()}`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  }).then((r) => r.json() as Promise<Array<{ token: string; amount: string }>>);

  // ─── 5. Withdraw each balance ───────────────────────────────────────────
  const withdrawals: RecoveryResult['withdrawals'] = [];
  for (const bal of balances) {
    if (BigInt(bal.amount) <= 0n) continue;
    const withdrawInstruction = await buildPacificaWithdrawInstruction(
      connection,
      wallet,
      bal.token,
      bal.amount,
    );
    const tx = new Transaction().add(withdrawInstruction);
    const blockhash = await connection.getLatestBlockhash('confirmed');
    tx.recentBlockhash = blockhash.blockhash;
    tx.feePayer = wallet;
    tx.sign(config.walletKeypair);
    const sig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction({ signature: sig, ...blockhash }, 'confirmed');
    withdrawals.push({ token: bal.token, amount: bal.amount, withdrawTx: sig });
  }

  return {
    closedPositions,
    withdrawals,
    txSignatures: [...closedPositions.map((c) => c.closeTx), ...withdrawals.map((w) => w.withdrawTx)],
  };
}

// ─── Helpers (TODO(kit): fill in with Pacifica's authoritative spec) ─────

async function authenticateWithPacifica(_apiUrl: string, _kp: Keypair): Promise<string> {
  throw new Error('TODO(kit): implement Pacifica auth-challenge per their docs');
}

async function buildPacificaCloseInstruction(
  _conn: Connection,
  _wallet: PublicKey,
  _positionId: string,
) {
  throw new Error('TODO(kit): build close-position instruction using Pacifica IDL');
}

async function buildPacificaWithdrawInstruction(
  _conn: Connection,
  _wallet: PublicKey,
  _token: string,
  _amount: string,
) {
  throw new Error('TODO(kit): build withdraw instruction using Pacifica IDL');
}
