import { describe, expect, it, vi, afterEach } from 'vitest';
import { readStoredIds, validIds, writeStoredIds } from '../../src/features/garage/storage';
const allowed = new Set(['one', 'two', 'three', 'four', 'five']);
afterEach(() => vi.unstubAllGlobals());
describe('Persistent local garage', () => {
  it('discards invalid IDs, nonstrings, duplicates, and excess comparison entries', () => {
    expect(
      validIds(['one', 'unknown', 'two', 'one', 9, 'three', 'four', 'five'], allowed, 4),
    ).toEqual(['one', 'two', 'three', 'four']);
  });
  it('recovers safely from malformed or unavailable browser storage', () => {
    vi.stubGlobal('localStorage', { getItem: () => '{bad' });
    expect(readStoredIds('garage', allowed)).toEqual([]);
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
    });
    expect(readStoredIds('garage', allowed)).toEqual([]);
  });
  it('round-trips saved IDs', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    });
    expect(writeStoredIds('garage', ['one', 'two'])).toBe(true);
    expect(readStoredIds('garage', allowed)).toEqual(['one', 'two']);
  });
  it('reports write failures without crashing navigation', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('full');
      },
    });
    expect(writeStoredIds('garage', ['one'])).toBe(false);
  });
});
