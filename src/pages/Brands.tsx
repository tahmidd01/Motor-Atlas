import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { cars, carPath, countries, manufacturers, models } from '../data/catalog';
import {
  Breadcrumbs,
  CarGrid,
  EmptyState,
  MediaImage,
  SectionHeading,
} from '../components/ui/Primitives';
import { normalize } from '../lib/discovery';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

export default function Brands() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [letter, setLetter] = useState('');
  usePageMeta(
    'The manufacturers',
    'Discover the people, places, and engineering cultures behind the Motor Atlas archive.',
  );
  const results = [...manufacturers]
    .filter(
      (b) =>
        normalize(b.name).includes(normalize(query)) &&
        (!country || b.countryId === country) &&
        (!region || countries.find((c) => c.id === b.countryId)?.region === region) &&
        (!letter || b.name.startsWith(letter)),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="page-shell inner-page">
      <div className="page-intro">
        <p className="eyebrow">THE MANUFACTURER DIRECTORY</p>
        <h1>
          The names.
          <br />
          <em>The visionaries.</em>
        </h1>
        <p>Behind every machine, a different way of seeing the world.</p>
      </div>
      <div className="directory-toolbar">
        <label className="directory-search">
          <Search size={18} />
          <input
            aria-label="Search manufacturers"
            placeholder="Find a manufacturer…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Filter manufacturers by country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter manufacturers by region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">All regions</option>
          {['Europe', 'Asia', 'Americas'].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="alphabet" role="group" aria-label="Browse by first letter">
        <button aria-pressed={!letter} onClick={() => setLetter('')}>
          All
        </button>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => (
          <button
            key={l}
            disabled={!manufacturers.some((b) => b.name.startsWith(l))}
            aria-pressed={letter === l}
            onClick={() => setLetter(l === letter ? '' : l)}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="directory-count" aria-live="polite">
        {results.length} manufacturers in the archive
      </p>
      <div className="brand-directory">
        {results.map((b) => (
          <Link to={`/brands/${b.id}`} className="brand-directory-row" key={b.id}>
            <span className="brand-initial">{b.name.slice(0, 1)}</span>
            <div>
              <h2>{b.name}</h2>
              <p>
                {countries.find((c) => c.id === b.countryId)?.name} <span>·</span> Est. {b.founded}
              </p>
            </div>
            <span className="brand-model-count">
              {models.filter((m) => m.manufacturerId === b.id).length}{' '}
              {models.filter((m) => m.manufacturerId === b.id).length === 1 ? 'model' : 'models'}{' '}
              indexed
            </span>
            <ArrowUpRight size={24} />
          </Link>
        ))}
      </div>
      {!results.length && (
        <EmptyState
          title="A different direction."
          description="No manufacturers match these filters."
        >
          <button
            className="button"
            onClick={() => {
              setQuery('');
              setCountry('');
              setRegion('');
              setLetter('');
            }}
          >
            Clear filters
            <ArrowRight size={18} />
          </button>
        </EmptyState>
      )}
    </div>
  );
}
export function BrandDetail() {
  const { brand } = useParams();
  const data = manufacturers.find((b) => b.id === brand);
  if (!data) return <NotFound />;
  return <BrandExhibit brand={data} />;
}
function BrandExhibit({ brand }: { brand: (typeof manufacturers)[number] }) {
  const vehicles = cars.filter((c) => c.manufacturer.id === brand.id);
  const country = countries.find((c) => c.id === brand.countryId)!;
  const brandModels = models.filter((m) => m.manufacturerId === brand.id);
  usePageMeta(brand.name, brand.history);
  return (
    <>
      <section className="brand-hero">
        <div className="brand-hero-photo">
          <MediaImage media={vehicles[0]?.media[0]} alt={brand.name} priority />
        </div>
        <div className="brand-hero-shade" />
        <div className="page-shell">
          <Breadcrumbs items={[{ label: 'Manufacturers', to: '/brands' }, { label: brand.name }]} />
          <p className="eyebrow">
            {country.name} / EST. {brand.founded}
          </p>
          <h1>
            {brand.name}
            <span>.</span>
          </h1>
          <p className="brand-hero-description">{brand.history}</p>
        </div>
      </section>
      <div className="brand-facts page-shell">
        {[
          ['Origin', country.name],
          ['Founded', String(brand.founded)],
          ['Headquarters', brand.headquarters],
          ['Archive', `${vehicles.length} machines`],
        ].map(([k, v]) => (
          <div key={k}>
            <span className="eyebrow">{k}</span>
            <p>{v}</p>
          </div>
        ))}
      </div>
      <section className="section page-shell brand-story">
        <div>
          <p className="eyebrow">THE MARQUE, IN CONTEXT</p>
          <h2>
            A point
            <br />
            <em>of view.</em>
          </h2>
        </div>
        <div>
          <p className="story-lead">{brand.history}</p>
          <p className="founder-note">Origins: {brand.founder}</p>
          <h3>Notable engineering themes</h3>
          <ul className="innovation-list">
            {brand.innovations.map((x, i) => (
              <li key={x}>
                <span>0{i + 1}</span>
                {x}
              </li>
            ))}
          </ul>
          <Link to={`/countries/${country.id}`} className="arrow-link">
            Explore {country.name}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="section page-shell">
        <SectionHeading eyebrow="THE MODEL FAMILIES" title="An evolving vocabulary." />
        <div className="model-family-grid">
          {brandModels.map((m) => (
            <Link key={m.id} to={`/models/${brand.id}/${m.slug}`}>
              <h3>{m.name}</h3>
              <span>{cars.filter((c) => c.model.id === m.id).length} indexed variants</span>
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section page-shell related-section">
        <SectionHeading eyebrow="MACHINES IN THE ARCHIVE" title={`The ${brand.name} collection.`} />
        <CarGrid items={vehicles} />
      </section>
      <div className="archive-end page-shell">
        <Link to={carPath(vehicles[0])}>
          Begin with {vehicles[0].model.name}
          <ArrowRight size={17} />
        </Link>
      </div>
    </>
  );
}
