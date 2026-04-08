import { z } from 'zod';

export const stakingToolSchemas = {
  toreva_stake: z.object({ wallet: z.string(), amount: z.number().positive() }),
  toreva_unstake: z.object({ wallet: z.string() }),
} as const;

export const STAKING_RELAY_TYPES = {
  toreva_stake: 'staking.stake',
  toreva_unstake: 'staking.unstake',
} as const;

export type StakingToolName = keyof typeof stakingToolSchemas;
export type StakingRelayType = (typeof STAKING_RELAY_TYPES)[StakingToolName];
