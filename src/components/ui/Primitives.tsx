import { ArrowUpRight, Heart, Plus, Check, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useGarage } from '../../features/garage/GarageContext';
import type { Car, Media } from '../../types/automotive';
import { carPath, carTitle, displayValue, hp } from '../../data/catalog';

export function ArrowLink({
  to,
  children,
  className = '',
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={`arrow-link ${className}`}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function MediaImage({
  media,
  alt,
  className = '',
  priority = false,
}: {
  media?: Media;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <MediaImageState
      key={media?.path ?? alt}
      media={media}
      alt={alt}
      className={className}
      priority={priority}
    />
  );
}
function MediaImageState({
  media,
  alt,
  className = '',
  priority = false,
}: {
  media?: Media;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (!media || failed)
    return (
      <div
        className={`image-fallback ${className}`}
        role="img"
        aria-label={`${alt} — photograph not available`}
      >
        <svg viewBox="0 0 440 180" aria-hidden="true">
          <path
            d="M45 121 85 106 134 68Q151 52 178 52h89q18 0 35 13l57 40 38 12 9 25H33Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="m113 103 35-35h115l48 35ZM196 68v35" fill="none" stroke="currentColor" />
          <circle cx="106" cy="139" r="27" fill="#161817" stroke="currentColor" strokeWidth="2" />
          <circle cx="336" cy="139" r="27" fill="#161817" stroke="currentColor" strokeWidth="2" />
          <path d="M87 139h38m-19-19v38m211-19h38m-19-19v38" stroke="currentColor" />
        </svg>
        <span>Photography forthcoming</span>
      </div>
    );
  return (
    <img
      key={media.path}
      src={priority ? media.path : (media.thumbnail ?? media.path)}
      alt={media.alt || alt}
      className={`media-image ${loaded ? 'loaded' : ''} ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );
}
export function FavoriteButton({ carId, large = false }: { carId: string; large?: boolean }) {
  const { favorites, toggleFavorite } = useGarage();
  const active = favorites.includes(carId);
  return (
    <button
      className={large ? 'button button-secondary favorite-large' : 'icon-button favorite-button'}
      aria-label={active ? 'Remove from collection' : 'Save to collection'}
      aria-pressed={active}
      onClick={() => toggleFavorite(carId)}
    >
      <Heart size={18} fill={active ? 'currentColor' : 'none'} />
      {large && (active ? 'Saved to collection' : 'Save to collection')}
    </button>
  );
}
export function CompareButton({ carId, large = false }: { carId: string; large?: boolean }) {
  const { comparison, toggleCompare } = useGarage();
  const active = comparison.includes(carId);
  return (
    <button
      className={large ? 'button button-secondary' : 'compare-button'}
      aria-label={active ? 'Remove from comparison' : 'Add to comparison'}
      aria-pressed={active}
      onClick={() => toggleCompare(carId)}
    >
      {active ? <Check size={16} /> : <Plus size={16} />}
      <span>{large ? (active ? 'In comparison' : 'Compare this car') : 'Compare'}</span>
    </button>
  );
}
export function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  return (
    <article className="car-card">
      <div className="car-card-image">
        <Link to={carPath(car)} aria-label={`Explore ${carTitle(car)}`}>
          <MediaImage media={car.media[0]} alt={carTitle(car)} />
        </Link>
        <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
        <FavoriteButton carId={car.id} />
        <span className="card-category">
          {car.powertrain === 'ICE' ? car.category : car.powertrain}
        </span>
      </div>
      <div className="car-card-body">
        <p className="eyebrow">
          {car.manufacturer.name}
          <span>{car.year}</span>
        </p>
        <Link to={carPath(car)} className="card-title">
          <h3>
            {car.model.name} <span>{car.name === car.model.name ? '' : car.name}</span>
          </h3>
          <ArrowUpRight size={20} />
        </Link>
        <p className="car-card-subtitle">
          {car.generation.name} <span>·</span> {car.engine.configuration} <span>·</span>{' '}
          {car.country.name}
        </p>
        <div className="car-card-bottom">
          <p>
            <strong>{displayValue(hp(car.performance.powerKw))}</strong> <span>hp</span>
          </p>
          <CompareButton carId={car.id} />
        </div>
      </div>
    </article>
  );
}
export function CarGrid({ items }: { items: Car[] }) {
  return (
    <div className="car-grid">
      {items.map((car, i) => (
        <CarCard key={car.id} car={car} index={i} />
      ))}
    </div>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Compass size={40} strokeWidth={1} />
      <h2>{title}</h2>
      <p>{description}</p>
      {children ?? (
        <Link to="/cars" className="button">
          Explore the archive
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link to="/">Atlas</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span aria-hidden="true">/</span>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
