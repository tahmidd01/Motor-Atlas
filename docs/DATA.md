# Data authoring and ingestion

Edit `src/data/vehicles.ts` for curated seed records, or import a JSON array into `src/data/imported-vehicles.json` through the CLI. Do not edit the enriched catalog arrays. Add missing manufacturers and countries in `src/data/manufacturers.ts` first.

## Record contract

The complete TypeScript authoring contract is `VehicleSeed` in `src/data/vehicles.ts`; its runtime counterpart is the strict Zod schema in `src/lib/schema.ts`.

| Field group     | Required content                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Identity        | Unique slug `id`, existing `brand`, `model`, `generation`, `variant`, indexed `year`, generation `years: [start, end or null]` |
| Classification  | `body`, `category`, `fuel`, `seats`, `doors`, `tags`                                                                           |
| Engineering     | `engine`, `cc`, `layout`, `aspiration`, `drive`, `transmission`                                                                |
| Performance     | `kw`, `torque`, `acceleration`, `speed`, `weight`; all numeric measurements may be `null`                                      |
| Editorial       | Original `description` and `engineering` text                                                                                  |
| Provenance      | HTTPS `sourceUrl`, `sourceName`, optional `checked`, `note`                                                                    |
| Optional detail | `weightStandard`, `battery`, `dimensions`                                                                                      |

Copy an existing record as a structural reference, then replace its identity, facts, prose, and source with a distinct, verified variant. Use the enum values in the contract. Unknown is `null`, never a guessed zero. The importer rejects extra properties to catch misspelled fields.

```powershell
npm run data:import -- .\new-vehicles.json --dry-run
npm run data:import -- .\new-vehicles.json
npm run data:validate
npm test
```

Dry-run validates without changing files. Real import appends to `imported-vehicles.json`; Vite then recalculates every directory, filter, collection, detail route, and statistic. New media is optional: the UI provides a labelled fallback until licensed imagery is supplied. To reverse an import, remove its records from that JSON file and revalidate.

## Measurement rules

- Store power in kW. Displayed mechanical hp is rounded using `kW × 1.34102209`. PS/CV are metric horsepower and should be converted before storing; they are not numerically identical to mechanical hp.
- Acceleration means 0–100 km/h in seconds. Do not silently relabel 0–60 mph or omit manufacturer rollout/test-condition caveats.
- Keep dry, DIN, curb, and market-specific weight standards. Power/weight uses the record's declared weight; dry-to-curb comparisons need context.
- Do not combine engine and motor torque by simple addition. Store published system output only when the manufacturer states it clearly.
- EV battery energy uses kWh. Charging power uses kW and is a peak. Range retains EPA/WLTP cycle; it is not a real-world guarantee. Omit inequalities when the schema expects an exact measurement.
- A generation's year span describes the indexed generation record. All variants sharing that generation must use the same span. Do not imply complete generation coverage.

## Provenance

Each vehicle has a manufacturer/primary reference and original summary prose. Core references checked during the build are dated 2026-10-03. Unchecked records are labelled as such in the exhibit. The date is deliberately weaker than a claim that every field was independently audited.

`npm run data:sources` checks HTTP reachability; it cannot verify facts. Ferrari/Tesla may reject automated requests with HTTP 403 even when the page is reachable interactively. Source URLs can change. Read the primary document, confirm market/year/variant, and update the reference and notes manually.

Collections in `src/lib/discovery.ts` are predicates over tags, country, era, powertrain, and known measurements. Related cars use weighted shared metadata with deterministic tie-breaking. Statistics describe this local collection, not the global vehicle market.
