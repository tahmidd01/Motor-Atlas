import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { cars, carPath, allSeeds, manufacturers, countries } from '../src/data/catalog';
import { importSchema } from '../src/lib/schema';
try {
  importSchema.parse(allSeeds);
  for (const brand of manufacturers) {
    if (!countries.some((c) => c.id === brand.countryId))
      throw new Error(`Unknown country on ${brand.id}`);
  }
  const paths = new Set<string>();
  for (const car of cars) {
    const path = carPath(car);
    if (paths.has(path)) throw new Error(`Duplicate vehicle route: ${path}`);
    paths.add(path);
    if (!car.manufacturer || !car.model || !car.generation)
      throw new Error(`Broken hierarchy on ${car.id}`);
    for (const media of car.media) {
      if (!existsSync(resolve('public', media.path.slice(1))))
        throw new Error(`Missing asset: ${media.path}`);
      if (media.thumbnail && !existsSync(resolve('public', media.thumbnail.slice(1))))
        throw new Error(`Missing thumbnail: ${media.thumbnail}`);
      if (!media.credit || !media.license || !media.sourceUrl)
        throw new Error(`Missing attribution: ${media.id}`);
    }
  }
  console.log(
    `Valid: ${cars.length} variants, ${manufacturers.length} manufacturers, ${paths.size} unique routes. All referenced media files and credits exist.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
