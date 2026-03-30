import type { FeeSchedule } from './treasury.js';

export interface RelayRequest<TPayload = unknown> {
  type: string;
  toolName: string;
  requestId?: string;
  payload: TPayload;
}

export interface RelayMeta {
  requestId?: string;
  timestamp?: string;
}

export interface RelayResponse<TResult = unknown> {
  ok: boolean;
  result?: TResult;
  error?: string;
  meta?: RelayMeta;
}

export interface RelayTreasury {
  feeSchedule: FeeSchedule;
  feeWallet: string;
  mevWallet: string;
}
