import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { cars, carPath, carTitle, countries, manufacturers, generations } from '../../data/catalog';
import { matchesQuery, normalize } from '../../lib/discovery';
import { MediaImage } from '../ui/Primitives';
interface Result {
  key: string;
  label: string;
  subtitle: string;
  group: string;
  to: string;
  carId?: string;
}
export default function SearchCommand({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const opener = useRef(document.activeElement as HTMLElement);
  useEffect(() => {
    const modal = dialog.current;
    const previous = opener.current;
    modal?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      modal?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  const results = useMemo(() => {
    const q = normalize(query);
    const found: Result[] = cars
      .filter((c) => !q || matchesQuery(c, q))
      .slice(0, q ? 7 : 4)
      .map((c) => ({
        key: c.id,
        label: carTitle(c),
        subtitle: `${c.year} · ${c.generation.name} · ${c.country.name}`,
        group: q ? 'Cars' : 'Start exploring',
        to: carPath(c),
        carId: c.id,
      }));
    if (q) {
      found.push(
        ...manufacturers
          .filter((b) => normalize(b.name).includes(q))
          .slice(0, 3)
          .map((b) => ({
            key: b.id,
            label: b.name,
            subtitle: 'Manufacturer',
            group: 'Manufacturers',
            to: `/brands/${b.id}`,
          })),
        ...generations
          .filter((g) => normalize(g.name).includes(q))
          .slice(0, 3)
          .map((g) => {
            const c = cars.find((c) => c.generation.id === g.id)!;
            return {
              key: g.id,
              label: `${c.manufacturer.name} ${c.model.name} · ${g.name}`,
              subtitle: 'Generation',
              group: 'Generations',
              to: `/models/${c.manufacturer.id}/${c.model.slug}/${g.slug}`,
            };
          }),
        ...countries
          .filter((c) => normalize(c.name).includes(q))
          .map((c) => ({
            key: c.id,
            label: c.name,
            subtitle: c.region,
            group: 'Countries',
            to: `/countries/${c.id}`,
          })),
        ...[...new Set(cars.map((c) => c.category))]
          .filter((c) => normalize(c).includes(q))
          .map((c) => ({
            key: c,
            label: c,
            subtitle: 'Vehicle category',
            group: 'Categories',
            to: `/cars?category=${encodeURIComponent(c)}`,
          })),
      );
    }
    if (q === 'open road')
      found.unshift({
        key: 'secret-detour',
        label: 'The road less expected.',
        subtitle: 'A little discovery for the curious.',
        group: 'A secret passage',
        to: carPath(cars[(q.length * 7) % cars.length]),
      });
    return found;
  }, [query]);
  useEffect(() => {
    setActive(0);
  }, [query]);
  useEffect(() => {
    dialog.current
      ?.querySelector(`[data-result="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);
  const choose = (result: Result) => {
    navigate(result.to);
    onClose();
  };
  return createPortal(
    <dialog
      className="search-dialog"
      ref={dialog}
      aria-label="Search Motor Atlas"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActive((i) => Math.min(i + 1, results.length - 1));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActive((i) => Math.max(i - 1, 0));
        }
        if (e.key === 'Enter' && results[active]) {
          e.preventDefault();
          choose(results[active]);
        }
      }}
    >
      <div className="search-input-row">
        <Search size={22} />
        <input
          autoFocus
          aria-label="Search cars, brands, generations, countries"
          placeholder="A car. An era. An obsession."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          role="combobox"
          aria-expanded="true"
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={results[active] ? `search-result-${active}` : undefined}
        />
        <button className="icon-button" onClick={onClose} aria-label="Close search">
          <X size={20} />
        </button>
      </div>
      <div
        id="search-results"
        className="search-results"
        role="listbox"
        aria-label="Search results"
      >
        {results.length === 0 ? (
          <div className="search-empty">
            <p>No machines on this road.</p>
            <span>Try “R34”, “V12”, or “Japanese AWD”.</span>
          </div>
        ) : (
          results.map((r, i) => (
            <div key={`${r.group}-${r.key}`}>
              {(i === 0 || results[i - 1].group !== r.group) && (
                <p className="eyebrow search-group">{r.group}</p>
              )}
              <button
                id={`search-result-${i}`}
                data-result={i}
                type="button"
                className={`search-result ${active === i ? 'selected' : ''}`}
                role="option"
                aria-selected={active === i}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(r)}
              >
                {r.carId && (
                  <MediaImage media={cars.find((c) => c.id === r.carId)?.media[0]} alt={r.label} />
                )}
                <span>
                  <strong>{r.label}</strong>
                  <small>{r.subtitle}</small>
                </span>
                <ArrowUpRight size={18} />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="search-footer">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> to navigate
        </span>
        <span>
          <kbd>↵</kbd> to explore
        </span>
        <span>
          <kbd>esc</kbd> to close
        </span>
      </div>
    </dialog>,
    document.body,
  );
}
