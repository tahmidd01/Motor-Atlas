import type { Car } from '../../types/automotive';
import { displayValue, hp } from '../../data/catalog';
export function SpecificationGroup({
  title,
  rows,
}: {
  title: string;
  rows: [string, string | number | null | undefined][];
}) {
  return (
    <section className="spec-group">
      <h3>{title}</h3>
      <dl>
        {rows
          .filter(([, value]) => value != null)
          .map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}
export default function Specifications({ car }: { car: Car }) {
  return (
    <>
      <div className="spec-grid">
        <SpecificationGroup
          title="Power & performance"
          rows={[
            ['Power', displayValue(hp(car.performance.powerKw), 'hp')],
            ['Power (SI)', displayValue(car.performance.powerKw, 'kW')],
            ['Torque', displayValue(car.performance.torqueNm, 'Nm')],
            ['0–100 km/h', displayValue(car.performance.zeroTo100, 's')],
            ['Top speed', displayValue(car.performance.topSpeedKmh, 'km/h')],
          ]}
        />
        <SpecificationGroup
          title="Engine & drivetrain"
          rows={[
            ['Powertrain', car.powertrain],
            ['Configuration', car.engine.configuration],
            [
              'Displacement',
              car.engine.displacementCc ? displayValue(car.engine.displacementCc, 'cc') : null,
            ],
            ['Engine position', car.engine.layout],
            ['Aspiration', car.engine.aspiration],
            ['Drivetrain', car.drivetrain],
            ['Transmission', car.transmission],
          ]}
        />
        <SpecificationGroup
          title="Body & dimensions"
          rows={[
            ['Body style', car.bodyStyle],
            ['Seats', car.seats],
            ['Doors', car.doors],
            [
              'Weight',
              car.dimensions.weightKg
                ? `${displayValue(car.dimensions.weightKg, 'kg')} (${car.dimensions.weightStandard ?? 'reference'})`
                : 'Not available',
            ],
            [
              'Length',
              car.dimensions.lengthMm ? displayValue(car.dimensions.lengthMm, 'mm') : null,
            ],
            ['Width', car.dimensions.widthMm ? displayValue(car.dimensions.widthMm, 'mm') : null],
            [
              'Height',
              car.dimensions.heightMm ? displayValue(car.dimensions.heightMm, 'mm') : null,
            ],
            [
              'Wheelbase',
              car.dimensions.wheelbaseMm ? displayValue(car.dimensions.wheelbaseMm, 'mm') : null,
            ],
          ]}
        />
        {car.battery && (
          <SpecificationGroup
            title="Electric architecture"
            rows={[
              ['Battery capacity', `${car.battery.capacityKwh} kWh`],
              [
                'Rated range',
                car.battery.rangeKm
                  ? `${car.battery.rangeKm} km (${car.battery.rangeCycle})`
                  : null,
              ],
              ['DC charging peak', car.battery.chargingKw ? `${car.battery.chargingKw} kW` : null],
              ['Electric motors', car.battery.motors],
            ]}
          />
        )}
      </div>
      <p className="spec-footnote">
        Mechanical horsepower is converted from kW and rounded. Published values vary by market and
        testing conditions. Dry and curb weights use different measurement standards.
      </p>
    </>
  );
}
export function PerformanceBars({ car }: { car: Car }) {
  const values = [
    { label: 'Power', value: hp(car.performance.powerKw), max: 1600, unit: 'hp' },
    { label: 'Torque', value: car.performance.torqueNm, max: 1800, unit: 'Nm' },
    { label: 'Top speed', value: car.performance.topSpeedKmh, max: 450, unit: 'km/h' },
  ];
  return (
    <div className="performance-bars">
      {values
        .filter((v) => v.value !== null)
        .map((v) => (
          <div key={v.label}>
            <div>
              <span>{v.label}</span>
              <strong>{displayValue(v.value, v.unit)}</strong>
            </div>
            <div className="performance-track">
              <span style={{ width: `${Math.min(100, ((v.value ?? 0) / v.max) * 100)}%` }} />
            </div>
            <small>
              Scale 0–{v.max.toLocaleString()} {v.unit}
            </small>
          </div>
        ))}
      {car.dimensions.weightKg && car.performance.powerKw && (
        <div className="power-weight">
          <span>Power / weight</span>
          <strong>
            {Math.round(hp(car.performance.powerKw)! / (car.dimensions.weightKg / 1000))}
            <small> hp / tonne</small>
          </strong>
          <p>Based on {car.dimensions.weightStandard?.toLowerCase() ?? 'reference'} weight.</p>
        </div>
      )}
    </div>
  );
}
