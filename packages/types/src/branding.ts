export type VenueId = 'drift' | 'jupiter-perps' | 'pacifica' | 'flash';

export interface VenueInfo {
  id: VenueId;
  displayName: string;
  status: 'live' | 'stub';
}

export const TOREVA_VENUES: readonly VenueInfo[] = [
  { id: 'jupiter-perps', displayName: 'Jupiter Perps', status: 'live' },
  { id: 'pacifica', displayName: 'Pacifica', status: 'live' },
  { id: 'drift', displayName: 'Drift Protocol', status: 'live' },
  { id: 'flash', displayName: 'Flash Trade', status: 'stub' }
] as const;

export const CANONICAL_TAGLINE =
  'Non-custodial execution primitives for Solana. Best-execution routing across Jupiter Perps, Pacifica, Drift, and Flash Trade. 1 bps to open. Everything else is free.';
