import type { FeeSchedule } from './treasury.js';

export const RELAY_ERROR_CODES = [
  'AUTH_INVALID',
  'AUTH_EXPIRED',
  'AUTH_FORBIDDEN',
  'BAD_REQUEST',
  'VALIDATION_FAILED',
  'GUARDRAIL_REJECTED',
  'VENUE_UNAVAILABLE',
  'VENUE_REJECTED',
  'INSUFFICIENT_COLLATERAL',
  'SLIPPAGE_EXCEEDED',
  'IDEMPOTENT_REPLAY',
  'RATE_LIMITED',
  'RELAY_TIMEOUT',
  'INTERNAL_ERROR'
] as const;

export type RelayErrorCode = (typeof RELAY_ERROR_CODES)[number];

export interface RelayError {
  code: RelayErrorCode;
  message: string;
  retryable: boolean;
  category: 'auth' | 'validation' | 'guardrail' | 'venue' | 'idempotency' | 'rate_limit' | 'system';
  detail?: Record<string, unknown>;
}

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
  errorCode?: RelayErrorCode;
  errorDetail?: RelayError;
  meta?: RelayMeta;
}

export interface RelayTreasury {
  feeSchedule: FeeSchedule;
  feeWallet: string;
  mevWallet: string;
}
