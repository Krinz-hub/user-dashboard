import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatRelativeTime } from '../lib/utils';

describe('DevOS Frontend Core Utilities', () => {
  describe('cn (Tailwind class merger)', () => {
    it('merges class names and handles conditionals', () => {
      expect(cn('px-2 py-1', 'bg-primary', false && 'hidden')).toBe('px-2 py-1 bg-primary');
    });

    it('resolves conflicting tailwind utilities', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });
  });

  describe('formatDate', () => {
    it('formats ISO dates into readable strings', () => {
      const formatted = formatDate('2026-09-13T10:00:00Z');
      expect(formatted).toContain('Sep 13');
    });

    it('handles undefined gracefully', () => {
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "just now" for very recent timestamps', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('just now');
    });

    it('returns minutes ago', () => {
      const fiveMinsAgo = new Date(Date.now() - 5 * 60000).toISOString();
      expect(formatRelativeTime(fiveMinsAgo)).toBe('5m ago');
    });
  });
});
