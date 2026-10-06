import { cars } from '../src/data/catalog';
import { milestones, technologies } from '../src/data/editorial';

const records = [
  ...cars.map((car) => ({ url: car.source.url, name: car.source.name })),
  ...milestones.map((event) => ({ url: event.sourceUrl, name: event.title })),
  ...technologies.map((topic) => ({ url: topic.sourceUrl, name: topic.name })),
];
const sources = [...new Map(records.map((record) => [record.url, record])).values()];
let index = 0;
let broken = 0;
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (index < sources.length) {
      const source = sources[index++];
      try {
        const response = await fetch(source.url, {
          signal: AbortSignal.timeout(15000),
          headers: { 'User-Agent': 'Mozilla/5.0 MotorAtlasLocalSourceReview' },
        });
        await response.body?.cancel();
        if (response.status === 404 || response.status === 410) broken++;
        console.log(`${response.status} ${source.name} ${source.url}`);
      } catch (error) {
        console.log(
          `UNREACHABLE ${source.name}: ${error instanceof Error ? error.message : 'network issue'}`,
        );
      }
    }
  }),
);
console.log(
  `${sources.length} unique sources checked; ${broken} returned 404/410. A 403 is an automated-access restriction, not proof of a dead page. Reachability does not verify facts.`,
);
if (process.argv.includes('--fail-on-broken') && broken) process.exitCode = 1;
