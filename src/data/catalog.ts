import { countries, manufacturers } from './manufacturers';
import { seedToVariant, slugify, vehicleSeeds } from './vehicles';
import mediaManifest from './media.json';
import importedVehicles from './imported-vehicles.json';
import type { VehicleSeed } from './vehicles';
import type { Car, Generation, Media, Model } from '../types/automotive';

const media = mediaManifest as Record<string, Media[]>;
export const studioMedia: Media = {
  id: 'porsche-studio-treatment',
  path: '/media/hero-studio.webp',
  alt: 'Porsche 911 GT3 RS — AI-edited studio treatment of an original photograph',
  caption:
    'Studio visual treatment. The background and lighting were edited with imagegen; this is not documentary photography.',
  credit: 'Original photo: Alexander Migl. Studio treatment: Motor Atlas / imagegen.',
  sourceUrl:
    'https://commons.wikimedia.org/wiki/File:Porsche_992_GT3_RS_MYLE_Festival_2025_DSC_9586_(cropped).jpg',
  license: 'CC BY-SA 4.0 (adaptation)',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  type: 'exterior',
  changes:
    'Background and lighting replaced with imagegen; optimized to WebP. Adaptation distributed under CC BY-SA 4.0.',
};
export const allSeeds = [...vehicleSeeds, ...(importedVehicles as VehicleSeed[])];
export const models: Model[] = [
  ...new Map(
    allSeeds.map((s) => {
      const id = `${s.brand}-${slugify(s.model)}`;
      return [id, { id, manufacturerId: s.brand, name: s.model, slug: slugify(s.model) }];
    }),
  ).values(),
];
export const generations: Generation[] = [
  ...new Map(
    allSeeds.map((s) => {
      const modelId = `${s.brand}-${slugify(s.model)}`;
      const id = `${modelId}-${slugify(s.generation)}`;
      return [
        id,
        {
          id,
          modelId,
          name: s.generation,
          slug: slugify(s.generation),
          start: s.years[0],
          end: s.years[1],
        },
      ];
    }),
  ).values(),
];
export const variants = allSeeds.map(seedToVariant);
export const cars: Car[] = variants.map((v) => {
  const generation = generations.find((g) => g.id === v.generationId)!;
  const model = models.find((m) => m.id === generation.modelId)!;
  const manufacturer = manufacturers.find((m) => m.id === model.manufacturerId)!;
  const country = countries.find((c) => c.id === manufacturer.countryId)!;
  return {
    ...v,
    generation,
    model,
    manufacturer,
    country,
    media:
      v.id === 'porsche-911-992-gt3-rs'
        ? [...(media[v.mediaId] ?? []), studioMedia]
        : (media[v.mediaId] ?? []),
  };
});
export { countries, manufacturers };
export const carPath = (car: Car) =>
  `/cars/${car.manufacturer.id}/${car.model.slug}/${car.generation.slug}/${car.slug}`;
export const carTitle = (car: Car) =>
  `${car.manufacturer.name} ${car.model.name}${car.name === car.model.name ? '' : ` ${car.name}`}`;
export const eras = [
  'Pre-1950',
  '1950s',
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  '2000s',
  '2010s',
  '2020s',
];
export const decadeOf = (year: number) =>
  year < 1950 ? 'Pre-1950' : `${Math.floor(year / 10) * 10}s`;
export const hp = (kw: number | null) => (kw === null ? null : Math.round(kw * 1.34102209));
export const displayValue = (value: number | null | undefined, unit = '') =>
  value == null ? 'Not available' : `${value.toLocaleString('en-US')}${unit ? ` ${unit}` : ''}`;
export const carOfDay = (date = new Date()) => {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  const hash = [...day].reduce((sum, c) => (Math.imul(sum, 31) + c.charCodeAt(0)) | 0, 0);
  return cars[Math.abs(hash) % cars.length];
};
