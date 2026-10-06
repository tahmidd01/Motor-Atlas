import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { importSchema } from '../src/lib/schema';
import { manufacturers } from '../src/data/manufacturers';
import { allSeeds } from '../src/data/catalog';
import { assertNewVehicles } from '../src/lib/importValidation';
const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run data:import -- path/to/vehicles.json [--dry-run]');
  process.exit(1);
}
try {
  const content = JSON.parse(await readFile(resolve(input), 'utf8'));
  const parsed = importSchema.parse(content);
  assertNewVehicles(
    parsed,
    allSeeds,
    manufacturers.map((b) => b.id),
  );
  if (process.argv.includes('--dry-run')) {
    console.log(`Validated ${parsed.length} vehicles. No files changed.`);
    process.exit(0);
  }
  const destination = resolve('src/data/imported-vehicles.json');
  const existing = JSON.parse(await readFile(destination, 'utf8'));
  await writeFile(destination, JSON.stringify([...existing, ...parsed], null, 2) + '\n');
  console.log(
    `Imported ${parsed.length} vehicles. They now participate in every catalog view. Run npm run data:validate.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
