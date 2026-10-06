import { z } from 'zod';
const nullableNumber = z.number().nonnegative().nullable();
export const vehicleSeedSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    brand: z.string().min(1),
    model: z.string().min(1),
    generation: z.string().min(1),
    variant: z.string().min(1),
    year: z.number().int().min(1886).max(2100),
    years: z.tuple([z.number().int().min(1886), z.number().int().nullable()]),
    body: z.enum([
      'Coupe',
      'Convertible',
      'Sedan',
      'SUV',
      'Hatchback',
      'Pickup',
      'Roadster',
      'Touring',
    ]),
    category: z.string().min(1),
    fuel: z.enum(['ICE', 'Hybrid', 'Electric', 'Hydrogen']),
    engine: z.string().min(1),
    cc: nullableNumber,
    layout: z.enum(['Front', 'Mid', 'Rear']).nullable(),
    aspiration: z.enum(['Naturally aspirated', 'Turbocharged', 'Supercharged']).nullable(),
    kw: nullableNumber,
    torque: nullableNumber,
    acceleration: nullableNumber,
    speed: nullableNumber,
    weight: nullableNumber,
    weightStandard: z.string().optional(),
    drive: z.enum(['RWD', 'AWD', 'FWD', '4WD']),
    transmission: z.string().min(1),
    seats: z.number().int().positive().max(20),
    doors: z.number().int().positive().max(6),
    tags: z.array(z.string()),
    description: z.string().min(20),
    engineering: z.string().min(20),
    sourceUrl: z.url().refine((url) => url.startsWith('https://'), 'Source must use HTTPS'),
    sourceName: z.string().min(1),
    checked: z.boolean().optional(),
    note: z.string().optional(),
    battery: z
      .object({
        capacityKwh: z.number().positive(),
        rangeKm: z.number().positive().optional(),
        rangeCycle: z.enum(['WLTP', 'EPA']).optional(),
        chargingKw: z.number().positive().optional(),
        motors: z.number().int().positive().optional(),
      })
      .optional(),
    dimensions: z
      .object({
        lengthMm: z.number().positive(),
        widthMm: z.number().positive(),
        heightMm: z.number().positive(),
        wheelbaseMm: z.number().positive(),
      })
      .optional(),
  })
  .strict()
  .superRefine((seed, context) => {
    if (seed.years[1] !== null && seed.years[1] < seed.years[0])
      context.addIssue({
        code: 'custom',
        message: 'Generation end precedes start',
        path: ['years'],
      });
    if (seed.year < seed.years[0] || (seed.years[1] !== null && seed.year > seed.years[1]))
      context.addIssue({
        code: 'custom',
        message: 'Indexed year must fall within generation years',
        path: ['year'],
      });
    if (seed.fuel === 'Electric' && seed.cc !== null)
      context.addIssue({
        code: 'custom',
        message: 'Battery-electric vehicles must not have engine displacement',
        path: ['cc'],
      });
    if (seed.fuel === 'ICE' && seed.battery)
      context.addIssue({
        code: 'custom',
        message: 'ICE vehicles cannot have a traction battery specification',
        path: ['battery'],
      });
  });
export const importSchema = z
  .array(vehicleSeedSchema)
  .min(1)
  .superRefine((seeds, context) => {
    const seen = new Set<string>();
    seeds.forEach((s, i) => {
      if (seen.has(s.id))
        context.addIssue({
          code: 'custom',
          message: `Duplicate identifier: ${s.id}`,
          path: [i, 'id'],
        });
      seen.add(s.id);
    });
  });
