export type VenueId = 'drift' | 'jupiter-perps' | 'flash';

export interface VenueInfo {
  id: VenueId;
  displayName: string;
  status: 'live' | 'stub';
}

export const TOREVA_VENUES: readonly VenueInfo[] = [
  { id: 'drift', displayName: 'Drift Protocol', status: 'live' },
  { id: 'jupiter-perps', displayName: 'Jupiter Perps', status: 'stub' },
  { id: 'flash', displayName: 'Flash Trade', status: 'stub' }
] as const;

export const CANONICAL_TAGLINE =
  'Non-custodial execution primitives for Solana. Best-execution routing across Drift, Jupiter Perps, and Flash Trade. 1 bps to open. Everything else is free.';
