import { lazy, Suspense, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Box, Share2 } from 'lucide-react';
import { cars, carPath, carTitle, displayValue, hp } from '../data/catalog';
import { relatedCars } from '../lib/discovery';
import {
  Breadcrumbs,
  CarGrid,
  CompareButton,
  FavoriteButton,
  MediaImage,
  SectionHeading,
} from '../components/ui/Primitives';
import CarGallery from '../components/gallery/CarGallery';
import Specifications, { PerformanceBars } from '../components/cars/Specifications';
import { useGarage } from '../features/garage/GarageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';
const ModelViewer = lazy(() => import('../components/three/ModelViewer'));
export default function CarDetail() {
  const params = useParams();
  const car = cars.find(
    (c) =>
      c.manufacturer.id === params.brand &&
      c.model.slug === params.model &&
      c.generation.slug === params.generation &&
      c.slug === params.variant,
  );
  if (!car) return <NotFound />;
  return <VehicleExhibit key={car.id} car={car} />;
}
function VehicleExhibit({ car }: { car: (typeof cars)[number] }) {
  usePageMeta(carTitle(car), car.overview);
  const { notify } = useGarage();
  const [viewer, setViewer] = useState(false);
  const relatives = relatedCars(car);
  const siblings = cars
    .filter((c) => c.model.id === car.model.id)
    .sort((a, b) => a.generation.start - b.generation.start);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify('Exhibit link copied');
    } catch {
      notify('Copy the exhibit address from your browser to share it.');
    }
  };
  return (
    <>
      <div className="page-shell exhibit-breadcrumb">
        <Breadcrumbs
          items={[
            { label: 'Archive', to: '/cars' },
            { label: car.manufacturer.name, to: `/brands/${car.manufacturer.id}` },
            { label: car.model.name, to: `/models/${car.manufacturer.id}/${car.model.slug}` },
            {
              label: car.generation.name,
              to: `/models/${car.manufacturer.id}/${car.model.slug}/${car.generation.slug}`,
            },
            { label: car.name },
          ]}
        />
      </div>
      <section className="vehicle-hero">
        <div className="vehicle-hero-image">
          <MediaImage media={car.media[0]} alt={carTitle(car)} priority />
        </div>
        <div className="vehicle-hero-shade" />
        <div className="page-shell vehicle-hero-copy">
          <p className="eyebrow">
            {car.manufacturer.name} <span>·</span> {car.country.name} <span>·</span> {car.year}
          </p>
          <h1>
            {car.model.name}
            <br />
            <em>{car.name === car.model.name ? 'An icon.' : car.name}</em>
          </h1>
          <p>
            {car.generation.name} <span>/</span> {car.category} <span>/</span> {car.powertrain}
          </p>
          <div className="vehicle-hero-stats">
            {[
              [displayValue(hp(car.performance.powerKw)), 'POWER / HP'],
              [displayValue(car.performance.zeroTo100), '0–100 / SECONDS'],
              [displayValue(car.performance.topSpeedKmh), 'TOP SPEED / KM/H'],
            ].map(([value, label]) => (
              <div key={label}>
                <strong className={value === 'Not available' ? 'unknown-stat' : ''}>
                  {value === 'Not available' ? '—' : value}
                </strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="exhibit-action-bar page-shell">
        <nav aria-label="Exhibit sections">
          <a href="#story">The story</a>
          <a href="#gallery">Gallery</a>
          <a href="#specifications">Specifications</a>
          <a href="#lineage">The lineage</a>
        </nav>
        <div>
          <FavoriteButton carId={car.id} large />
          <CompareButton carId={car.id} large />
          <button className="icon-button" aria-label="Copy exhibit link" onClick={share}>
            <Share2 size={18} />
          </button>
        </div>
      </div>
      <section id="story" className="section page-shell story-section">
        <div>
          <p className="eyebrow">01 / THE MACHINE, IN CONTEXT</p>
          <h2>
            More than
            <br />
            <em>a silhouette.</em>
          </h2>
          <div className="exhibit-facts">
            <span>{car.country.code}</span>
            <p>
              {car.country.name}
              <br />
              <small>
                {car.bodyStyle} · {car.year}
              </small>
            </p>
          </div>
        </div>
        <div className="story-copy">
          <p className="story-lead">{car.overview}</p>
          <h3>Engineering intent</h3>
          <p>{car.engineering}</p>
          <h3>Its place in the archive</h3>
          <p>{car.legacy}</p>
          <Link to={`/brands/${car.manufacturer.id}`} className="arrow-link">
            The {car.manufacturer.name} story
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section id="gallery" className="section page-shell">
        <SectionHeading eyebrow="02 / A CLOSER LOOK" title="Every angle tells a story." />
        <CarGallery media={car.media} title={carTitle(car)} />
      </section>
      <section id="specifications" className="section page-shell specifications-section">
        <SectionHeading
          eyebrow="03 / THE DETAILS THAT DEFINE IT"
          title="Engineering, by the numbers."
        />
        <PerformanceBars car={car} />
        <Specifications car={car} />
        <div className="source-note">
          <div>
            <p className="eyebrow">SPECIFICATION CONTEXT</p>
            <p>
              {car.specificationNote ??
                'Specifications refer to this indexed year and variant. Unavailable measurements are left empty rather than estimated.'}
            </p>
            <small>
              {car.source.checkedOn
                ? `Core reference checked ${car.source.checkedOn}.`
                : 'Reference record · further specification review encouraged.'}{' '}
              {car.source.note}
            </small>
          </div>
          <a href={car.source.url} target="_blank" rel="noreferrer" className="arrow-link">
            {car.source.name}
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
      <section id="lineage" className="section page-shell">
        <SectionHeading eyebrow="04 / PART OF A BIGGER STORY" title="The family line.">
          <Link className="arrow-link" to={`/models/${car.manufacturer.id}/${car.model.slug}`}>
            Explore {car.model.name}
            <ArrowUpRight size={18} />
          </Link>
        </SectionHeading>
        <div className="generation-timeline">
          {siblings.map((s) => (
            <Link to={carPath(s)} key={s.id} className={s.id === car.id ? 'active' : ''}>
              <span className="generation-point" />
              <p className="eyebrow">
                {s.generation.start} {s.generation.end ? `— ${s.generation.end}` : '—'}
              </p>
              <h3>{s.generation.name}</h3>
              <p>{s.name}</p>
              {s.id === car.id && <span className="generation-current">YOU ARE HERE</span>}
            </Link>
          ))}
        </div>
      </section>
      <section className="section page-shell interactive-section">
        <div>
          <p className="eyebrow">05 / THE INTERACTIVE WORKSHOP</p>
          <h2>
            Turn an idea
            <br />
            <em>in your hands.</em>
          </h2>
          <p>
            {car.model3d
              ? 'Explore this licensed vehicle model with orbit and zoom controls.'
              : 'Explore an abstract wheel assembly in our 3D engineering study. A licensed 3D model of this vehicle is not yet in the archive.'}
          </p>
          <button className="button button-secondary" onClick={() => setViewer((v) => !v)}>
            <Box size={19} />
            {viewer
              ? 'Close interactive exhibit'
              : car.model3d
                ? 'Open vehicle viewer'
                : 'Open engineering study'}
          </button>
        </div>
        <div className="viewer-container">
          {viewer ? (
            <Suspense fallback={<div className="viewer-placeholder">Opening the workshop…</div>}>
              <ModelViewer model={car.model3d} />
            </Suspense>
          ) : (
            <div className="viewer-placeholder">
              <Box size={65} strokeWidth={0.6} />
              <span className="eyebrow">
                {car.model3d ? 'LICENSED VEHICLE ASSET' : 'ABSTRACT ENGINEERING EXHIBIT'}
              </span>
              <p>Drag to orbit. Scroll to inspect.</p>
            </div>
          )}
        </div>
      </section>
      <section className="section page-shell related-section">
        <SectionHeading eyebrow="06 / KEEP EXPLORING" title="Another road to take.">
          <Link to="/cars" className="arrow-link">
            Back to the atlas
            <ArrowRight size={18} />
          </Link>
        </SectionHeading>
        <CarGrid items={relatives} />
      </section>
    </>
  );
}
