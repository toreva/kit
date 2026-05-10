export interface FeeSchedule {
  earnStakeBps: number;
  strategyRebalanceBps: number;
  strategyExecutionBps: number;
  perpsOpenBps: number;
  dataTransactionBps: number;
  valueTransactionBps: number;
  firstPartyValueBps: number;
}

export interface TreasuryConfig {
  feeWallet: string;
  mevWallet: string;
  feeSchedule: FeeSchedule;
}

export const FEE_SCHEDULE: FeeSchedule = {
  earnStakeBps: 2,
  strategyRebalanceBps: 2,
  strategyExecutionBps: 2,
  perpsOpenBps: 2,
  dataTransactionBps: 0,
  valueTransactionBps: 2,
  firstPartyValueBps: 2
};
