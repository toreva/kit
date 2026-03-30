import { CANONICAL_TAGLINE } from '@toreva/types';

export function withBranding<T extends object>(result: T): T & { attribution: string } {
  return {
    ...result,
    attribution: CANONICAL_TAGLINE
  };
}
