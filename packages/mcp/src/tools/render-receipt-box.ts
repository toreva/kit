/**
 * Tier-1 receipt Box renderer for the ChatGPT surface.
 *
 * Named consumer of grammar's Box render contract (toreva-box-grammar.v1.1.0).
 * Token values are sourced from grammar/data/toreva-receipt-wallet-v1-tokens.json.
 * No external CSS is loaded; all styles are inline.
 *
 * Spec: grammar/design-system/toreva-box-grammar-v1.md §5 (rw-box-receipt), §8 (Kit Contract)
 * Doctrine: po/docs/doctrine/receipts-are-the-signature-object.md
 */

import type { TorevaIntentBoxRenderPayloadV1 } from '@toreva/types';

// Token values from grammar/data/toreva-receipt-wallet-v1-tokens.json (schema v1.1.0)
const T = {
  canvas:       '#F4EAD9',
  surface:      '#FFF9EF',
  ink:          '#0E0E0E',
  inkMuted:     'rgba(14,14,14,0.54)',
  hairline:     'rgba(14,14,14,0.12)',
  blackCta:     '#0E0E0E',
  onBlackCta:   '#FFFFFF',
  orange:       '#FF6A2C',
  teal:         '#00B5A5',
  tealInk:      '#003D38',
  tealDivider:  'rgba(0,61,56,0.32)',
} as const;

// App routes per grammar §1
const APP_ROUTES = {
  plans:    'https://app.toreva.com/intent/plans',
  activity: 'https://app.toreva.com/intent/activity',
  control:  'https://app.toreva.com/intent/control',
  home:     'https://app.toreva.com/intent/home',
} as const;

// Frozen vocabulary per grammar §3
const LABEL = {
  draft:      'DRAFT',
  conflict:   'NEEDS REVIEW',
  ready:      'READY FOR REVIEW',
  receipt:    'DECISION SAVED',
  authority:  'AUTHORITY',
  movement:   'NOTHING MOVED',
} as const;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Flat orange squircle with tilted black square outline — canonical Toreva mark (flat, no 3D mascot)
function markSvg(): string {
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="6" fill="${T.orange}"/><rect x="5.5" y="5.5" width="13" height="13" rx="2" stroke="${T.ink}" stroke-width="1.5" fill="none" transform="rotate(-8 12 12)"/></svg>`;
}

// Dot + "NOTHING MOVED" status chip (grammar §3 — movement status)
function nothingMovedChip(tealSurface: boolean): string {
  const color = tealSurface ? T.tealInk : T.inkMuted;
  const dotFill = tealSurface ? T.tealInk : T.ink;
  return `<span role="status" aria-live="polite" style="display:inline-flex;align-items:center;gap:6px;color:${color};font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase"><svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true"><circle cx="4" cy="4" r="4" fill="${dotFill}"/></svg>${LABEL.movement}</span>`;
}

// Black pill CTA — primary action button (grammar §8 — black primary CTA)
function ctaButton(label: string, href: string): string {
  return `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" style="min-height:34px;border-radius:9999px;background:${T.blackCta};color:${T.onBlackCta};display:inline-flex;align-items:center;justify-content:center;padding:0 16px;text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap">${esc(label)}</a>`;
}

/**
 * Render a Tier-1 receipt Box for the ChatGPT surface.
 *
 * Tier-1 (Glance): canonical mark · ONE hero fact · badge/finding ·
 * NOTHING MOVED · clear CTA · exact app.toreva.com link.
 *
 * Returns an HTML string with inline styles; safe for MCP content type: 'text'.
 * Returns empty string if payload.surface !== 'chatgpt'.
 */
export function renderTier1Box(payload: TorevaIntentBoxRenderPayloadV1): string {
  if (payload.surface !== 'chatgpt') return '';

  const isReceipt   = payload.state === 'Receipt';
  const isReady     = payload.state === 'Ready-for-Review';
  const isAuthority = payload.state === 'Authority-state';

  // Grammar §5: receipt shell is teal; ready header is teal; others use canvas
  const shellBg      = isReceipt ? T.teal : T.canvas;
  const shellBorder  = isReceipt ? '0' : `1px solid ${T.hairline}`;
  const headerBg     = isReady   ? T.teal : 'transparent';
  const headerBorder = (isReceipt || isReady) ? T.tealDivider : T.hairline;
  const footerBorder = (isReceipt || isReady) ? T.tealDivider : T.hairline;
  const labelColor   = (isReceipt || isReady) ? T.tealInk : T.inkMuted;

  // Badge copy (frozen vocabulary §3)
  const badgeCopy: Record<typeof payload.state, string> = {
    'Intent-Draft':    LABEL.draft,
    'Conflict':        LABEL.conflict,
    'Ready-for-Review': LABEL.ready,
    'Receipt':         LABEL.receipt,
    'Authority-state': LABEL.authority,
  };
  const badge = badgeCopy[payload.state] ?? esc(payload.badge);

  // CTA href — fall back to canonical app route per grammar §1
  const defaultHref: Record<typeof payload.state, string> = {
    'Intent-Draft':    APP_ROUTES.home,
    'Conflict':        APP_ROUTES.plans,
    'Ready-for-Review': APP_ROUTES.plans,
    'Receipt':         APP_ROUTES.activity,
    'Authority-state': APP_ROUTES.control,
  };
  const ctaHref = payload.cta.href ?? defaultHref[payload.state] ?? APP_ROUTES.home;

  const heroText   = esc(payload.primary_text);
  const secondary  = payload.secondary_text ? `<p style="margin:0;color:${labelColor};font-size:13px;line-height:1.35">${esc(payload.secondary_text)}</p>` : '';
  const footer     = payload.nothing_has_moved
    ? `${nothingMovedChip(isReceipt || isReady)}&nbsp;&nbsp;${ctaButton(payload.cta.label, ctaHref)}`
    : ctaButton(payload.cta.label, ctaHref);

  return `<article role="article" aria-label="Toreva — ${badge}" style="max-width:420px;box-sizing:border-box;border:${shellBorder};border-radius:24px;background:${shellBg};color:${T.ink};font-family:'DM Sans',system-ui,sans-serif;overflow:hidden">
  <header style="display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;padding:16px;background:${headerBg};border-bottom:1px solid ${headerBorder}">
    ${markSvg()}
    <span style="color:${T.ink};font-family:'Space Grotesk',system-ui,sans-serif;font-size:14px;font-weight:700;letter-spacing:-0.01em">Toreva</span>
    <span style="color:${labelColor};font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase">${badge}</span>
  </header>
  <div style="display:flex;flex-direction:column;gap:12px;padding:16px">
    <p style="margin:0;color:${T.ink};font-family:'Space Grotesk',system-ui,sans-serif;font-size:24px;font-weight:700;line-height:1.08;letter-spacing:-0.03em">${heroText}</p>
    ${secondary}
  </div>
  <footer style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px;border-top:1px solid ${footerBorder}">
    ${footer}
  </footer>
</article>`.trim();
}

/**
 * True if the relay response result is a grammar Box render payload.
 * Used by server.ts to decide whether to trigger visual rendering.
 */
export function isBoxPayload(value: unknown): value is TorevaIntentBoxRenderPayloadV1 {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>)['contract_version'] === 'toreva_box.intent.v1'
  );
}
