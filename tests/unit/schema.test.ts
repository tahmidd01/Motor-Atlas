import { describe, expect, it } from 'vitest';
import { importSchema } from '../../src/lib/schema';
import { vehicleSeeds } from '../../src/data/vehicles';
describe('Dataset integrity and ingestion', () => {
  it('accepts all curated seed records', () => {
    expect(importSchema.safeParse(vehicleSeeds).success).toBe(true);
  });
  it('rejects duplicate IDs', () => {
    expect(importSchema.safeParse([vehicleSeeds[0], vehicleSeeds[0]]).success).toBe(false);
  });
  it('rejects malformed values and unrecognised fields', () => {
    expect(importSchema.safeParse([{ ...vehicleSeeds[0], kw: 'fast' }]).success).toBe(false);
    expect(importSchema.safeParse([{ ...vehicleSeeds[0], inventedMetric: 1 }]).success).toBe(false);
  });
  it('rejects contradictory electric displacement and inverted production years', () => {
    expect(
      importSchema.safeParse([{ ...vehicleSeeds[0], fuel: 'Electric', cc: 4000 }]).success,
    ).toBe(false);
    expect(importSchema.safeParse([{ ...vehicleSeeds[0], years: [2025, 2020] }]).success).toBe(
      false,
    );
  });
});
