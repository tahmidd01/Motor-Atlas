import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cars } from '../data/catalog';
import { collections } from '../lib/discovery';
import { useGarage } from '../features/garage/GarageContext';
import { Breadcrumbs, CarGrid, EmptyState, MediaImage } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';
export default function Collections() {
  const { collection } = useParams();
  const selected = collections.find((c) => c.id === collection);
  if (collection && !selected) return <NotFound />;
  return <CuratedCollections selected={selected} />;
}
function CuratedCollections({ selected }: { selected?: (typeof collections)[number] }) {
  usePageMeta(
    selected?.name ?? 'Curated collections',
    selected?.caption ??
      'Follow your curiosity through themed collections computed from the Motor Atlas archive.',
  );
  return (
    <div className="page-shell inner-page">
      {selected && (
        <Breadcrumbs
          items={[{ label: 'Collections', to: '/collections' }, { label: selected.name }]}
        />
      )}
      <div className="page-intro">
        <p className="eyebrow">A FEW ROADS TO TAKE</p>
        <h1>
          {selected ? selected.name : 'Follow your'}
          {!selected && (
            <>
              <br />
              <em>curiosity.</em>
            </>
          )}
        </h1>
        <p>{selected?.caption ?? 'Thematic journeys through engineering, culture, and time.'}</p>
      </div>
      {selected ? (
        <div className="related-section">
          <CarGrid items={cars.filter(selected.test)} />
        </div>
      ) : (
        <div className="editorial-collections collections-index">
          {collections.map((c, i) => {
            const vehicle = cars.find(c.test)!;
            return (
              <Link to={`/collections/${c.id}`} key={c.id} className="editorial-collection">
                <MediaImage media={vehicle.media[0]} alt={c.name} />
                <div>
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, '0')} / {cars.filter(c.test).length} MACHINES
                  </p>
                  <h3>{c.name}</h3>
                  <p>{c.caption}</p>
                  <ArrowUpRight size={25} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
export function MyCollection() {
  const { favorites } = useGarage();
  const vehicles = cars.filter((c) => favorites.includes(c.id));
  usePageMeta(
    'My collection',
    'Your personal collection of extraordinary machines, saved locally on this device.',
  );
  return (
    <div className="page-shell inner-page collection-page">
      <div className="page-intro">
        <p className="eyebrow">YOUR PERSONAL GARAGE / {vehicles.length} MACHINES</p>
        <h1>
          A collection
          <br />
          <em>of obsessions.</em>
        </h1>
        <p>The machines you keep coming back to. Saved on this device.</p>
      </div>
      {vehicles.length ? (
        <CarGrid items={vehicles} />
      ) : (
        <EmptyState
          title="Every collection starts somewhere."
          description="Save a machine with the heart icon. It will be waiting here when you return."
        />
      )}
      <p className="storage-note">
        Your collection stays in this browser’s local storage. No account required. Clearing browser
        data removes your saved cars.
      </p>
    </div>
  );
}
