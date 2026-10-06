import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  cars,
  countries,
  manufacturers,
  models,
  generations,
  hp,
  decadeOf,
  eras,
} from '../data/catalog';
import { usePageMeta } from '../hooks/usePageMeta';
import { SectionHeading } from '../components/ui/Primitives';
export default function Data() {
  usePageMeta(
    'Inside the data',
    'Explore the scope, source context, and calculated statistics of the local Motor Atlas dataset.',
  );
  const distribution = ['ICE', 'Hybrid', 'Electric'].map((type) => ({
    label: type,
    value: cars.filter((c) => c.powertrain === type).length,
  }));
  const horsepower = eras.map((era) => {
    const values = cars
      .filter((c) => decadeOf(c.year) === era && c.performance.powerKw !== null)
      .map((c) => hp(c.performance.powerKw)!);
    return {
      era,
      count: values.length,
      average: values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0,
    };
  });
  return (
    <div className="page-shell inner-page data-page">
      <div className="page-intro">
        <p className="eyebrow">THE ARCHIVE, WITH CONTEXT</p>
        <h1>
          Small enough to curate.
          <br />
          <em>Built to grow.</em>
        </h1>
        <p>A transparent look at the dataset behind the experience.</p>
      </div>
      <div className="data-stat-grid">
        {[
          [cars.length, 'Vehicle variants'],
          [manufacturers.length, 'Manufacturers'],
          [countries.length, 'Countries'],
          [models.length, 'Model families'],
          [generations.length, 'Generations'],
          [cars.filter((c) => c.source.checkedOn).length, 'Core references checked'],
        ].map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="data-charts">
        <section>
          <SectionHeading eyebrow="POWERTRAIN MIX" title="Three kinds of energy." />
          <div className="distribution-bars">
            {distribution.map((d) => (
              <div key={d.label}>
                <div>
                  <span>{d.label}</span>
                  <strong>{d.value} machines</strong>
                </div>
                <span className="data-bar" style={{ width: `${(d.value / cars.length) * 100}%` }} />
              </div>
            ))}
          </div>
          <p className="spec-footnote">
            Counts from the current curated dataset; not global market share.
          </p>
        </section>
        <section>
          <SectionHeading eyebrow="AVERAGE POWER BY INDEXED YEAR" title="Ambition over time." />
          <div
            className="decade-chart"
            role="img"
            aria-label={horsepower
              .map((h) => `${h.era}: ${h.average} average hp from ${h.count} records`)
              .join('. ')}
          >
            {horsepower.map((h) => (
              <div key={h.era}>
                <span>{h.average}</span>
                <div>
                  <span
                    style={{
                      height: `${(h.average / Math.max(...horsepower.map((v) => v.average))) * 100}%`,
                    }}
                  />
                </div>
                <small>{h.era === 'Pre-1950' ? '1900s' : h.era}</small>
              </div>
            ))}
          </div>
          <p className="spec-footnote">
            Mechanical hp, arithmetic mean. Curator selection strongly influences the result.
          </p>
        </section>
      </div>
      <section className="data-methodology">
        <p className="eyebrow">HOW TO READ THIS ARCHIVE</p>
        <h2>
          Context is part
          <br />
          <em>of the specification.</em>
        </h2>
        <div>
          <p>
            Every record identifies a particular variant and indexed year. A model family may span
            many engines, markets, and revisions; one record cannot speak for all of them.
          </p>
          <p>
            Power is stored in kW and converted to mechanical horsepower. Acceleration is always
            labelled by its measurement. Dry, DIN, and curb weights retain their published context.
            Range includes its testing cycle when known.
          </p>
          <p>
            Source links are supplied for every seeded vehicle. A checked date means its core
            reference was reviewed, not that every individual field has been independently audited.
            Records without a checked date explicitly remain reference records.
          </p>
          <p>
            Unknown measurements remain unavailable. Photographs have separate source and license
            metadata, and can represent a different trim or model year. No manufacturer affiliation
            is implied.
          </p>
          <Link to="/credits" className="arrow-link">
            Sources and media credits
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
