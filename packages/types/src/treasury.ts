export interface FeeSchedule {
  earnStakeBps: number;
  strategyRebalanceBps: number;
  strategyExecutionBps: number;
  perpsOpenBps: number;
}

export interface TreasuryConfig {
  feeWallet: string;
  mevWallet: string;
  feeSchedule: FeeSchedule;
}

export const FEE_SCHEDULE: FeeSchedule = {
  earnStakeBps: 5,
  strategyRebalanceBps: 37.5,
  strategyExecutionBps: 75,
  perpsOpenBps: 1
};
