import { describe, expect, it } from 'vitest';
import { assertNewVehicles } from '../../src/lib/importValidation';
import { vehicleSeeds } from '../../src/data/vehicles';

describe('catalog imports', () => {
  const source = vehicleSeeds[0];
  const newVariant = { ...source, id: 'porsche-911-992-new-variant', variant: 'New variant' };
  it('accepts a distinct variant within an existing generation', () => {
    expect(() => assertNewVehicles([newVariant], vehicleSeeds, ['porsche'])).not.toThrow();
  });
  it('rejects a duplicate public route even when the identifier differs', () => {
    expect(() =>
      assertNewVehicles([{ ...source, id: 'different-id' }], vehicleSeeds, ['porsche']),
    ).toThrow('route already exists');
  });
  it('rejects duplicate routes within the incoming batch', () => {
    expect(() =>
      assertNewVehicles([newVariant, { ...newVariant, id: 'another-id' }], vehicleSeeds, [
        'porsche',
      ]),
    ).toThrow('route already exists');
  });
  it('rejects contradictory generation years and unknown brands', () => {
    expect(() =>
      assertNewVehicles([{ ...newVariant, years: [2020, null] }], vehicleSeeds, ['porsche']),
    ).toThrow('Inconsistent');
    expect(() =>
      assertNewVehicles([{ ...newVariant, brand: 'unknown' }], vehicleSeeds, ['porsche']),
    ).toThrow('Unknown manufacturer');
  });
});
