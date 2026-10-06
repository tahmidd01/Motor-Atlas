import { describe, expect, it } from 'vitest';
import { cars, carOfDay, carPath, hp } from '../../src/data/catalog';
import {
  defaultFilters,
  filterCars,
  matchesQuery,
  relatedCars,
  sortCars,
  collections,
} from '../../src/lib/discovery';
describe('Automotive search and discovery', () => {
  it.each(['911', 'R34', 'E46', 'F40', 'Supra', 'V12', 'Japanese AWD'])(
    'matches an enthusiast query: %s',
    (query) => {
      expect(cars.filter((c) => matchesQuery(c, query)).length).toBeGreaterThan(0);
    },
  );
  it('matches all query tokens and understands nationality aliases', () => {
    const result = filterCars({ ...defaultFilters, query: 'Japanese AWD' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.country.id === 'japan' && c.drivetrain === 'AWD')).toBe(true);
  });
  it('combines structural and numeric filters', () => {
    const result = filterCars({
      ...defaultFilters,
      country: 'germany',
      minPower: 400,
      drivetrain: 'RWD',
    });
    expect(result.map((c) => c.id)).toEqual(['porsche-911-992-gt3-rs']);
  });
  it('excludes unknown acceleration only when an acceleration filter is active', () => {
    const unfiltered = filterCars(defaultFilters);
    expect(unfiltered.some((c) => c.performance.zeroTo100 === null)).toBe(true);
    const filtered = filterCars({ ...defaultFilters, maxAcceleration: 4 });
    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every((c) => c.performance.zeroTo100 !== null && c.performance.zeroTo100 <= 4),
    ).toBe(true);
  });
  it('places unavailable values last when sorting', () => {
    const result = sortCars(cars, 'acceleration');
    const firstUnknown = result.findIndex((c) => c.performance.zeroTo100 === null);
    expect(firstUnknown).toBeGreaterThan(0);
    expect(result.slice(firstUnknown).every((c) => c.performance.zeroTo100 === null)).toBe(true);
  });
  it('does not mutate the supplied catalog when sorting', () => {
    const before = cars.map((c) => c.id);
    sortCars(cars, 'newest');
    expect(cars.map((c) => c.id)).toEqual(before);
  });
  it('computes deterministic daily discovery across a Dhaka calendar day', () => {
    expect(carOfDay(new Date('2026-10-03T00:01:00+06:00')).id).toBe(
      carOfDay(new Date('2026-10-03T23:59:00+06:00')).id,
    );
  });
  it('creates unique semantic variant routes', () => {
    expect(new Set(cars.map(carPath)).size).toBe(cars.length);
    expect(carPath(cars[0])).toBe('/cars/porsche/911/992/gt3-rs');
  });
  it('converts SI power to mechanical hp and retains unknown values', () => {
    expect(hp(386)).toBe(518);
    expect(hp(null)).toBeNull();
  });
  it('produces deterministic related cars without recommending the current car', () => {
    const result = relatedCars(cars[0]);
    expect(result).toEqual(relatedCars(cars[0]));
    expect(result.some((c) => c.id === cars[0].id)).toBe(false);
  });
  it('builds nonempty curated collections from metadata', () => {
    expect(collections.every((collection) => cars.some(collection.test))).toBe(true);
  });
});
