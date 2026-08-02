import { describe, it, expect } from 'vitest';
import type { TorevaIntentBoxRenderPayloadV1 } from '@toreva/types';
import { isBoxPayload, renderTier1Box } from '../tools/render-receipt-box.js';

// Real example — DECISION SAVED receipt for ChatGPT surface
const exampleReceipt: TorevaIntentBoxRenderPayloadV1 = {
  contract_version: 'toreva_box.intent.v1',
  surface: 'chatgpt',
  state: 'Receipt',
  box_class: 'ibox ibox--receipt',
  aria_label: 'Toreva decision saved receipt',
  badge: 'Decision saved',
  primary_text: 'Buy A$500 of SOL.',
  secondary_text: 'Decision saved.',
  cta: { label: 'View receipt', href: 'https://app.toreva.com/intent/activity' },
  detail_rows: [
    { label: 'Authority', value: 'None' },
    { label: 'Evidence', value: 'Toreva record' },
  ],
  source: {
    statement_of_intent_id: 'soi_example_001',
    statement_version: 1,
    receipt_id: 'receipt_example_001',
    box_hash: `sha256:${'a'.repeat(64)}` as `sha256:${string}`,
  },
  nothing_has_moved: true,
  nothing_has_moved_text: 'Nothing has moved.',
};

describe('renderTier1Box — ChatGPT receipt surface', () => {
  it('renders a real example DECISION SAVED receipt Box', () => {
    const html = renderTier1Box(exampleReceipt);

    // Outer shell — receipt article with correct aria label
    expect(html).toContain('role="article"');
    expect(html).toContain('DECISION SAVED');

    // Canonical Toreva mark (orange squircle SVG)
    expect(html).toContain('#FF6A2C');  // orange token
    expect(html).toContain('<svg');

    // Teal receipt surface (grammar §5 — rw-box-receipt shell is teal)
    expect(html).toContain('#00B5A5');

    // ONE hero fact — primary_text verbatim
    expect(html).toContain('Buy A$500 of SOL.');

    // The finding — secondary_text
    expect(html).toContain('Decision saved.');

    // NOTHING MOVED chip (grammar §3 — frozen vocabulary)
    expect(html).toContain('NOTHING MOVED');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');

    // Clear CTA with exact app.toreva.com link
    expect(html).toContain('View receipt');
    expect(html).toContain('https://app.toreva.com/intent/activity');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');

    // No barcode, no merchant treatment, no Amount/Fee/Flow
    expect(html).not.toContain('barcode');
    expect(html).not.toContain('Amount');
    expect(html).not.toContain('Fee');
  });

  it('returns empty string for non-chatgpt surfaces', () => {
    const claudePayload: TorevaIntentBoxRenderPayloadV1 = { ...exampleReceipt, surface: 'claude' };
    expect(renderTier1Box(claudePayload)).toBe('');
  });

  it('falls back to canonical app.toreva.com routes when cta.href is absent', () => {
    const noHref: TorevaIntentBoxRenderPayloadV1 = {
      ...exampleReceipt,
      cta: { label: 'View receipt' },
    };
    const html = renderTier1Box(noHref);
    expect(html).toContain('https://app.toreva.com/intent/activity');
  });

  it('renders READY FOR REVIEW box with teal header, not teal shell', () => {
    const ready: TorevaIntentBoxRenderPayloadV1 = {
      ...exampleReceipt,
      state: 'Ready-for-Review',
      box_class: 'ibox ibox--ready',
      badge: 'Ready',
      primary_text: 'Buy A$500 of SOL.',
      secondary_text: 'Ready for review. Nothing moves until you keep it.',
      cta: { label: 'Review in Toreva', href: 'https://app.toreva.com/intent/plans' },
    };
    const html = renderTier1Box(ready);
    expect(html).toContain('READY FOR REVIEW');
    expect(html).toContain('Review in Toreva');
    expect(html).toContain('https://app.toreva.com/intent/plans');
    expect(html).toContain('NOTHING MOVED');
    // Canvas background (not teal shell) — cream canvas
    expect(html).toContain('#F4EAD9');
  });

  it('renders AUTHORITY box without NOTHING MOVED chip', () => {
    const authority: TorevaIntentBoxRenderPayloadV1 = {
      ...exampleReceipt,
      state: 'Authority-state',
      box_class: 'ibox ibox--authority',
      badge: 'Authority',
      primary_text: 'No authority.',
      secondary_text: 'Record only. No moves. No trades.',
      cta: { label: 'Open Control', href: 'https://app.toreva.com/intent/control' },
      nothing_has_moved: undefined,
      nothing_has_moved_text: undefined,
    };
    const html = renderTier1Box(authority);
    expect(html).toContain('AUTHORITY');
    expect(html).toContain('No authority.');
    expect(html).not.toContain('NOTHING MOVED');
  });
});

describe('isBoxPayload', () => {
  it('recognises a grammar Box render payload by contract_version', () => {
    expect(isBoxPayload(exampleReceipt)).toBe(true);
  });

  it('returns false for plain relay responses and non-objects', () => {
    expect(isBoxPayload({ ok: true, result: 'something' })).toBe(false);
    expect(isBoxPayload(null)).toBe(false);
    expect(isBoxPayload('string')).toBe(false);
    expect(isBoxPayload(undefined)).toBe(false);
  });
});
