import { z } from 'zod';

export const walletToolSchemas = {
  toreva_balance: z.object({ wallet: z.string() }),
  toreva_tokens: z.object({ wallet: z.string() }),
} as const;

export const WALLET_RELAY_TYPES = {
  toreva_balance: 'wallet.balance',
  toreva_tokens: 'wallet.tokens',
} as const;

export type WalletToolName = keyof typeof walletToolSchemas;
export type WalletRelayType = (typeof WALLET_RELAY_TYPES)[WalletToolName];
