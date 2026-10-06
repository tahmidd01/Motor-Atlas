import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Plus, X } from 'lucide-react';
import { cars, carPath, carTitle, displayValue, hp } from '../data/catalog';
import { useGarage } from '../features/garage/GarageContext';
import { MediaImage } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Car } from '../types/automotive';

export const comparisonRows: {
  label: string;
  group: string;
  value: (c: Car, unit: string) => string;
}[] = [
  { label: 'Indexed year', group: 'Identity', value: (c) => String(c.year) },
  { label: 'Country', group: 'Identity', value: (c) => c.country.name },
  { label: 'Generation', group: 'Identity', value: (c) => c.generation.name },
  { label: 'Body style', group: 'Identity', value: (c) => c.bodyStyle },
  {
    label: 'Power',
    group: 'Performance',
    value: (c, u) =>
      displayValue(u === 'kW' ? c.performance.powerKw : hp(c.performance.powerKw), u),
  },
  {
    label: 'Torque',
    group: 'Performance',
    value: (c) => displayValue(c.performance.torqueNm, 'Nm'),
  },
  {
    label: '0–100 km/h',
    group: 'Performance',
    value: (c) => displayValue(c.performance.zeroTo100, 's'),
  },
  {
    label: 'Top speed',
    group: 'Performance',
    value: (c) => displayValue(c.performance.topSpeedKmh, 'km/h'),
  },
  { label: 'Powertrain', group: 'Engineering', value: (c) => c.powertrain },
  { label: 'Engine / motors', group: 'Engineering', value: (c) => c.engine.configuration },
  {
    label: 'Displacement',
    group: 'Engineering',
    value: (c) => displayValue(c.engine.displacementCc, 'cc'),
  },
  {
    label: 'Aspiration',
    group: 'Engineering',
    value: (c) => c.engine.aspiration ?? 'Not applicable',
  },
  { label: 'Drivetrain', group: 'Engineering', value: (c) => c.drivetrain },
  { label: 'Transmission', group: 'Engineering', value: (c) => c.transmission },
  {
    label: 'Weight',
    group: 'Dimensions',
    value: (c) =>
      c.dimensions.weightKg
        ? `${displayValue(c.dimensions.weightKg, 'kg')} · ${c.dimensions.weightStandard ?? 'reference'}`
        : 'Not available',
  },
  { label: 'Length', group: 'Dimensions', value: (c) => displayValue(c.dimensions.lengthMm, 'mm') },
  { label: 'Width', group: 'Dimensions', value: (c) => displayValue(c.dimensions.widthMm, 'mm') },
  { label: 'Height', group: 'Dimensions', value: (c) => displayValue(c.dimensions.heightMm, 'mm') },
  {
    label: 'Wheelbase',
    group: 'Dimensions',
    value: (c) => displayValue(c.dimensions.wheelbaseMm, 'mm'),
  },
  { label: 'Seats', group: 'Dimensions', value: (c) => String(c.seats) },
  { label: 'Doors', group: 'Dimensions', value: (c) => String(c.doors) },
  {
    label: 'Battery capacity',
    group: 'Electric',
    value: (c) => (c.battery ? `${c.battery.capacityKwh} kWh` : 'Not available'),
  },
  {
    label: 'Rated range',
    group: 'Electric',
    value: (c) =>
      c.battery?.rangeKm ? `${c.battery.rangeKm} km · ${c.battery.rangeCycle}` : 'Not available',
  },
  {
    label: 'DC charging peak',
    group: 'Electric',
    value: (c) => displayValue(c.battery?.chargingKw, 'kW'),
  },
];
export default function Compare() {
  const { comparison, setComparison, clearCompare } = useGarage();
  const [params, setParams] = useSearchParams();
  const [differences, setDifferences] = useState(false);
  const [unit, setUnit] = useState('hp');
  const [adding, setAdding] = useState(false);
  usePageMeta(
    'Compare machines',
    'Compare two to four vehicles side by side, with specification context and clear differences.',
  );
  const urlIds = params.get('cars');
  useEffect(() => {
    if (urlIds !== null)
      setComparison(
        urlIds
          .split(',')
          .filter((id) => cars.some((c) => c.id === id))
          .slice(0, 4),
      );
  }, [urlIds, setComparison]);
  const vehicles = comparison.map((id) => cars.find((c) => c.id === id)!).filter(Boolean);
  const update = (ids: string[]) => {
    setComparison(ids);
    setParams(ids.length ? { cars: ids.join(',') } : {}, { replace: true });
  };
  const rows = comparisonRows.filter(
    (r) =>
      (r.group !== 'Electric' || vehicles.some((c) => c.powertrain !== 'ICE')) &&
      (!differences || new Set(vehicles.map((c) => r.value(c, unit))).size > 1),
  );
  return (
    <div className="page-shell inner-page compare-page">
      <div className="page-intro">
        <p className="eyebrow">DIFFERENT MACHINES. A SHARED PERSPECTIVE.</p>
        <h1>
          Side by <em>side.</em>
        </h1>
        <p>Compare the engineering. Discover the differences. Draw your own conclusions.</p>
      </div>
      <div className="compare-toolbar">
        <label className="check-label">
          <input
            type="checkbox"
            checked={differences}
            onChange={(e) => setDifferences(e.target.checked)}
          />{' '}
          Show differences only
        </label>
        <div>
          <select aria-label="Power unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="hp">Power in hp</option>
            <option value="kW">Power in kW</option>
          </select>
          {vehicles.length > 0 && (
            <button
              className="text-button"
              onClick={() => {
                clearCompare();
                setParams({});
              }}
            >
              Clear comparison
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      {vehicles.length === 0 ? (
        <div className="compare-empty">
          <span className="eyebrow">START A CONVERSATION BETWEEN MACHINES</span>
          <h2>
            Some differences
            <br />
            <em>deserve a closer look.</em>
          </h2>
          <p>Add two to four cars from the archive or begin with the curator’s trio.</p>
          <button
            className="button button-light"
            onClick={() =>
              update(['porsche-911-992-gt3-rs', 'ferrari-f40', 'nissan-skyline-gtr-r34'])
            }
          >
            Compare three icons
            <ArrowUpRight size={18} />
          </button>
        </div>
      ) : (
        <>
          {vehicles.length === 1 && (
            <p className="compare-hint">Add one more machine to start a side-by-side comparison.</p>
          )}
          <p className="compare-scroll-note">
            Scroll sideways to see all machines. Vermilion dots mark differing values.
          </p>
          <div
            className="compare-scroll"
            tabIndex={0}
            role="region"
            aria-label="Vehicle comparison; scroll horizontally for all cars"
          >
            <table className="compare-table">
              <caption className="sr-only">Comparison of selected vehicles</caption>
              <thead>
                <tr>
                  <th scope="col" className="compare-label-cell">
                    <span className="eyebrow">{vehicles.length} / 4 MACHINES</span>
                    <p>
                      A study in
                      <br />
                      differences.
                    </p>
                  </th>
                  {vehicles.map((c) => (
                    <th scope="col" key={c.id}>
                      <div className="compare-car">
                        <button
                          className="icon-button"
                          aria-label={`Remove ${carTitle(c)} from comparison`}
                          onClick={() => update(comparison.filter((id) => id !== c.id))}
                        >
                          <X size={16} />
                        </button>
                        <MediaImage media={c.media[0]} alt={carTitle(c)} />
                        <p className="eyebrow">{c.manufacturer.name}</p>
                        <Link to={carPath(c)}>
                          <strong>{c.model.name}</strong>
                          <ArrowUpRight size={16} />
                        </Link>
                        <span>
                          {c.name} · {c.year}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const changed = new Set(vehicles.map((c) => row.value(c, unit))).size > 1;
                  return (
                    <tr
                      key={row.label}
                      className={`${i === 0 || rows[i - 1].group !== row.group ? 'new-spec-group' : ''} ${changed ? 'different-row' : ''}`}
                    >
                      <th scope="row">
                        {i === 0 || rows[i - 1].group !== row.group ? (
                          <span className="eyebrow">{row.group}</span>
                        ) : null}
                        <span>{row.label}</span>
                      </th>
                      {vehicles.map((c) => (
                        <td key={c.id}>
                          <span
                            className={
                              row.value(c, unit) === 'Not available' ? 'unknown-value' : ''
                            }
                          >
                            {row.value(c, unit)}
                          </span>
                          {changed && <span className="difference-dot" aria-hidden="true" />}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {differences && rows.length === 0 && (
            <p className="compare-hint">
              No differences to show. Add another car or turn off the differences filter.
            </p>
          )}
        </>
      )}
      {vehicles.length < 4 && (
        <div className="compare-add">
          <button
            className="button button-secondary"
            onClick={() => setAdding((v) => !v)}
            aria-expanded={adding}
          >
            <Plus size={18} />
            Add a machine
          </button>
          {adding && (
            <label className="compare-add-select">
              <span className="eyebrow">CHOOSE FROM THE ARCHIVE</span>
              <select
                aria-label="Choose a car to compare"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    update([...comparison, e.target.value]);
                    setAdding(false);
                  }
                }}
              >
                <option value="">Select a machine…</option>
                {cars
                  .filter((c) => !comparison.includes(c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {carTitle(c)} · {c.year}
                    </option>
                  ))}
              </select>
            </label>
          )}
        </div>
      )}
      <p className="spec-footnote">
        Unknown values remain unavailable. Dry and curb weights differ. WLTP and EPA ranges use
        different testing cycles. This comparison presents data without declaring an overall winner.
      </p>
    </div>
  );
}
