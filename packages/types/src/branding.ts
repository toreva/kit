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
  'Policy-checked Solana wallet actions. Users set the limits. Toreva checks, executes only when allowed, explains, and receipts every outcome.';
