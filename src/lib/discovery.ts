import { cars, decadeOf, hp } from '../data/catalog';
import type { Car, Filters } from '../types/automotive';

export const defaultFilters: Filters = {
  query: '',
  brand: '',
  country: '',
  body: '',
  category: '',
  powertrain: '',
  decade: '',
  drivetrain: '',
  transmission: '',
  configuration: '',
  aspiration: '',
  layout: '',
  model: '',
  generation: '',
  minPower: 0,
  maxPower: 1600,
  minTorque: 0,
  minSpeed: 0,
  maxAcceleration: 20,
  maxWeight: 4000,
  seats: '',
  doors: '',
};
export const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const aliases: Record<string, string> = {
  japanese: 'japan',
  german: 'germany',
  italian: 'italy',
  american: 'united states',
  british: 'united kingdom',
  ev: 'electric',
  bev: 'electric',
  boxer: 'flat',
  manual: 'manual',
  v12: 'v12',
  godzilla: 'skyline gt r',
};
export function matchesQuery(car: Car, query: string) {
  const haystack = normalize(
    [
      carTitleParts(car),
      car.country.name,
      car.country.region,
      car.generation.name,
      car.name,
      car.year,
      car.engine.configuration,
      car.engine.code,
      car.engine.displacementCc,
      car.drivetrain,
      car.powertrain,
      car.transmission,
      car.bodyStyle,
      car.category,
      car.engine.aspiration,
      ...car.nicknames,
      ...car.tags,
    ].join(' '),
  );
  return normalize(query)
    .split(' ')
    .filter(Boolean)
    .every((token) => haystack.includes(aliases[token] ?? token));
}
function carTitleParts(car: Car) {
  return `${car.manufacturer.name} ${car.model.name}`;
}
export function filterCars(filters: Filters, input: Car[] = cars) {
  return input.filter(
    (c) =>
      matchesQuery(c, filters.query) &&
      (!filters.brand || c.manufacturer.id === filters.brand) &&
      (!filters.country || c.country.id === filters.country) &&
      (!filters.body || c.bodyStyle === filters.body) &&
      (!filters.category || c.category === filters.category) &&
      (!filters.powertrain || c.powertrain === filters.powertrain) &&
      (!filters.decade || decadeOf(c.year) === filters.decade) &&
      (!filters.drivetrain || c.drivetrain === filters.drivetrain) &&
      (!filters.transmission || c.transmission.includes(filters.transmission)) &&
      (!filters.configuration || c.engine.configuration === filters.configuration) &&
      (!filters.aspiration || c.engine.aspiration === filters.aspiration) &&
      (!filters.layout || c.engine.layout === filters.layout) &&
      (!filters.model || c.model.id === filters.model) &&
      (!filters.generation || c.generation.id === filters.generation) &&
      (!filters.seats || c.seats === Number(filters.seats)) &&
      (!filters.doors || c.doors === Number(filters.doors)) &&
      (filters.minPower === 0 ||
        (hp(c.performance.powerKw) != null && hp(c.performance.powerKw)! >= filters.minPower)) &&
      (filters.maxPower === 1600 ||
        (hp(c.performance.powerKw) != null && hp(c.performance.powerKw)! <= filters.maxPower)) &&
      (filters.minTorque === 0 ||
        (c.performance.torqueNm != null && c.performance.torqueNm >= filters.minTorque)) &&
      (filters.minSpeed === 0 ||
        (c.performance.topSpeedKmh != null && c.performance.topSpeedKmh >= filters.minSpeed)) &&
      (filters.maxAcceleration === 20 ||
        (c.performance.zeroTo100 != null && c.performance.zeroTo100 <= filters.maxAcceleration)) &&
      (filters.maxWeight === 4000 ||
        (c.dimensions.weightKg != null && c.dimensions.weightKg <= filters.maxWeight)),
  );
}
export function sortCars(input: Car[], sort: string) {
  const result = [...input];
  const knownLast = (a: number | null, b: number | null, descending = false) =>
    a == null ? (b == null ? 0 : 1) : b == null ? -1 : descending ? b - a : a - b;
  return result.sort((a, b) =>
    sort === 'power'
      ? knownLast(a.performance.powerKw, b.performance.powerKw, true)
      : sort === 'acceleration'
        ? knownLast(a.performance.zeroTo100, b.performance.zeroTo100)
        : sort === 'oldest'
          ? a.year - b.year
          : sort === 'newest'
            ? b.year - a.year
            : carTitleParts(a).localeCompare(carTitleParts(b)),
  );
}
export function relatedCars(car: Car, limit = 3) {
  return cars
    .filter((c) => c.id !== car.id)
    .map((c) => ({
      car: c,
      score:
        (c.manufacturer.id === car.manufacturer.id ? 4 : 0) +
        (c.category === car.category ? 3 : 0) +
        (c.powertrain === car.powertrain ? 1 : 0) +
        (decadeOf(c.year) === decadeOf(car.year) ? 2 : 0) +
        (c.engine.configuration === car.engine.configuration ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.car.id.localeCompare(b.car.id))
    .slice(0, limit)
    .map((x) => x.car);
}
export const collections = [
  {
    id: 'japanese-icons',
    name: 'The Japanese masters',
    caption: 'Precision. Obsession. A different kind of performance.',
    query: 'Japanese',
    test: (c: Car) => c.country.id === 'japan',
  },
  {
    id: 'italian-exotics',
    name: 'Made of passion',
    caption: 'Sculpted in Italy. Remembered everywhere.',
    query: 'Italian',
    test: (c: Car) => c.country.id === 'italy',
  },
  {
    id: '90s-icons',
    name: 'The analogue years',
    caption: 'The machines that made a generation fall in love.',
    query: '',
    test: (c: Car) => c.year >= 1990 && c.year < 2000,
  },
  {
    id: 'electric-performance',
    name: 'A different energy',
    caption: 'A new chapter in the pursuit of performance.',
    query: 'Electric',
    test: (c: Car) => c.powertrain === 'Electric',
  },
  {
    id: 'v12-legends',
    name: 'Twelve cylinders. No compromise.',
    caption: 'A mechanical language all its own.',
    query: 'V12',
    test: (c: Car) => c.engine.configuration === 'V12',
  },
  {
    id: 'classic-icons',
    name: 'Before they were legends',
    caption: 'Forms and ideas that outlived their era.',
    query: 'Classic',
    test: (c: Car) => c.tags.includes('classic'),
  },
  {
    id: 'german-engineering',
    name: 'The precision school',
    caption: 'Continuity, competition, and engineering intent.',
    query: 'German',
    test: (c: Car) => c.country.id === 'germany',
  },
  {
    id: 'american-muscle',
    name: 'American expression',
    caption: 'Big ideas. An unmistakable attitude.',
    query: 'American',
    test: (c: Car) => c.tags.includes('american'),
  },
  {
    id: 'naturally-aspirated',
    name: 'Without forced induction',
    caption: 'Response, revs, and the unassisted engine.',
    query: 'Naturally aspirated',
    test: (c: Car) => c.engine.aspiration === 'Naturally aspirated',
  },
  {
    id: 'turbo-icons',
    name: 'Under pressure',
    caption: 'The many forms of turbocharged performance.',
    query: 'Turbo',
    test: (c: Car) => c.engine.aspiration === 'Turbocharged',
  },
  {
    id: 'track-focused',
    name: 'Built for the apex',
    caption: 'Road cars informed by the circuit.',
    query: 'Track',
    test: (c: Car) => c.tags.includes('track'),
  },
  {
    id: 'modern-hypercars',
    name: 'Beyond the ordinary',
    caption: 'Ambition at the edges of road-car engineering.',
    query: 'Hypercar',
    test: (c: Car) => c.category === 'Hypercar',
  },
];
