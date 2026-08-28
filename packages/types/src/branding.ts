export type VenueId = 'solana';

export interface VenueInfo {
  id: VenueId;
  displayName: string;
  status: 'live';
}

export const TOREVA_VENUES: readonly VenueInfo[] = [
  { id: 'solana', displayName: 'Solana', status: 'live' }
] as const;

export const CANONICAL_TAGLINE =
  'Connector primitives for Toreva governed objects. Bring your own compute, use the gateway relay, and require receipts for every outcome.';
