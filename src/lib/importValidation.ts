import { slugify, type VehicleSeed } from '../data/vehicles';

const routeKey = (seed: VehicleSeed) =>
  [seed.brand, seed.model, seed.generation, seed.variant].map(slugify).join('/');

export function assertNewVehicles(
  incoming: VehicleSeed[],
  existing: VehicleSeed[],
  brandIds: string[],
) {
  const ids = new Set(existing.map((s) => s.id));
  const routes = new Set(existing.map(routeKey));
  const generationYears = new Map(
    existing.map((s) => [
      `${s.brand}/${slugify(s.model)}/${slugify(s.generation)}`,
      JSON.stringify(s.years),
    ]),
  );
  for (const seed of incoming) {
    if (!brandIds.includes(seed.brand))
      throw new Error(`Unknown manufacturer: ${seed.brand}. Add it to manufacturers.ts first.`);
    if (ids.has(seed.id)) throw new Error(`Vehicle already exists: ${seed.id}`);
    if (routes.has(routeKey(seed)))
      throw new Error(`Exhibit route already exists: ${routeKey(seed)}. Use a distinct variant.`);
    const key = `${seed.brand}/${slugify(seed.model)}/${slugify(seed.generation)}`;
    const years = JSON.stringify(seed.years);
    if (generationYears.has(key) && generationYears.get(key) !== years)
      throw new Error(`Inconsistent generation years: ${key}`);
    ids.add(seed.id);
    routes.add(routeKey(seed));
    generationYears.set(key, years);
  }
}
