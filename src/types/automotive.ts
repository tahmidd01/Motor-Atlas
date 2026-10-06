export type Powertrain = 'ICE' | 'Hybrid' | 'Electric' | 'Hydrogen';
export type BodyStyle =
  'Coupe' | 'Convertible' | 'Sedan' | 'SUV' | 'Hatchback' | 'Pickup' | 'Roadster' | 'Touring';
export type Drivetrain = 'RWD' | 'AWD' | 'FWD' | '4WD';
export interface Source {
  name: string;
  url: string;
  checkedOn: string | null;
  status: 'primary-reference' | 'secondary-reference' | 'needs-review';
  note?: string;
}
export interface Country {
  id: string;
  name: string;
  code: string;
  region: string;
  summary: string;
}
export interface Manufacturer {
  id: string;
  name: string;
  countryId: string;
  founded: number;
  headquarters: string;
  founder?: string;
  history: string;
  innovations: string[];
}
export interface Model {
  id: string;
  manufacturerId: string;
  name: string;
  slug: string;
}
export interface Generation {
  id: string;
  modelId: string;
  name: string;
  slug: string;
  start: number;
  end: number | null;
}
export interface Engine {
  configuration: string;
  displacementCc: number | null;
  layout: 'Front' | 'Mid' | 'Rear' | null;
  aspiration: 'Naturally aspirated' | 'Turbocharged' | 'Supercharged' | null;
  code?: string;
  cylinders?: number;
  valvetrain?: string;
}
export interface Performance {
  powerKw: number | null;
  torqueNm: number | null;
  zeroTo100: number | null;
  topSpeedKmh: number | null;
}
export interface Dimensions {
  weightKg: number | null;
  weightStandard?: string;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  wheelbaseMm?: number;
}
export interface Battery {
  capacityKwh: number;
  rangeKm?: number;
  rangeCycle?: 'WLTP' | 'EPA';
  chargingKw?: number;
  motors?: number;
}
export interface Media {
  id: string;
  path: string;
  thumbnail?: string;
  alt: string;
  caption: string;
  credit: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  type: 'exterior' | 'interior' | 'engine' | 'detail';
  changes: string;
}
export interface VehicleVariant {
  id: string;
  generationId: string;
  name: string;
  slug: string;
  year: number;
  bodyStyle: BodyStyle;
  category: string;
  powertrain: Powertrain;
  drivetrain: Drivetrain;
  transmission: string;
  gears?: number;
  seats: number;
  doors: number;
  engine: Engine;
  performance: Performance;
  dimensions: Dimensions;
  battery?: Battery;
  tags: string[];
  nicknames: string[];
  overview: string;
  engineering: string;
  legacy: string;
  source: Source;
  specificationNote?: string;
  mediaId: string;
  model3d?: { path: string; credit: string; license: string };
}
export interface Car extends VehicleVariant {
  manufacturer: Manufacturer;
  country: Country;
  model: Model;
  generation: Generation;
  media: Media[];
}
export interface Filters {
  query: string;
  brand: string;
  country: string;
  body: string;
  category: string;
  powertrain: string;
  decade: string;
  drivetrain: string;
  transmission: string;
  configuration: string;
  aspiration: string;
  layout: string;
  model: string;
  generation: string;
  minPower: number;
  maxPower: number;
  minTorque: number;
  minSpeed: number;
  maxAcceleration: number;
  maxWeight: number;
  seats: string;
  doors: string;
}
