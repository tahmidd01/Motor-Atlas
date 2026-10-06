import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Globe2 } from 'lucide-react';
import { cars, countries, manufacturers } from '../data/catalog';
import { Breadcrumbs, CarGrid, MediaImage, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';
export default function Countries() {
  const { country } = useParams();
  const selected = countries.find((c) => c.id === country);
  if (country && !selected) return <NotFound />;
  return <CountryIndex selected={selected} />;
}
function CountryIndex({ selected }: { selected?: (typeof countries)[number] }) {
  usePageMeta(
    selected?.name ?? 'Around the world',
    selected?.summary ??
      'Explore automotive cultures across the countries represented in the Motor Atlas archive.',
  );
  const vehicles = cars.filter((c) => !selected || c.country.id === selected.id);
  return (
    <div className="page-shell inner-page">
      {selected && (
        <Breadcrumbs
          items={[{ label: 'Around the world', to: '/countries' }, { label: selected.name }]}
        />
      )}
      <div className="page-intro">
        <p className="eyebrow">
          <Globe2 size={14} /> THE GEOGRAPHY OF AUTOMOTIVE CULTURE
        </p>
        <h1>
          {selected ? selected.name : 'Different origins.'}
          <br />
          <em>{selected ? 'A distinctive perspective.' : 'One shared obsession.'}</em>
        </h1>
        <p>{selected?.summary ?? 'Nine countries. Countless ways to interpret the open road.'}</p>
      </div>
      {selected ? (
        <>
          <div className="country-manufacturers">
            {manufacturers
              .filter((b) => b.countryId === selected.id)
              .map((b) => (
                <Link key={b.id} to={`/brands/${b.id}`}>
                  {b.name}
                  <ArrowUpRight size={18} />
                </Link>
              ))}
          </div>
          <section className="section related-section">
            <SectionHeading
              eyebrow="THE NATIONAL COLLECTION"
              title={`Machines from ${selected.name}.`}
            />
            <CarGrid items={vehicles} />
          </section>
        </>
      ) : (
        <div className="country-grid">
          {countries.map((c) => {
            const representative = cars.find((v) => v.country.id === c.id)!;
            return (
              <Link to={`/countries/${c.id}`} className="country-card" key={c.id}>
                <MediaImage media={representative.media[0]} alt={`${c.name} automotive culture`} />
                <div>
                  <span className="country-code">{c.code}</span>
                  <p className="eyebrow">{c.region}</p>
                  <h2>{c.name}</h2>
                  <p>
                    {manufacturers.filter((b) => b.countryId === c.id).length} marques ·{' '}
                    {cars.filter((v) => v.country.id === c.id).length} machines
                  </p>
                  <ArrowUpRight size={24} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
