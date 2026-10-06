import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { cars, countries, eras, generations, manufacturers, models } from '../data/catalog';
import { defaultFilters, filterCars, sortCars } from '../lib/discovery';
import { CarGrid, EmptyState } from '../components/ui/Primitives';
import type { Filters } from '../types/automotive';
import { usePageMeta } from '../hooks/usePageMeta';

const numericKeys = new Set([
  'minPower',
  'maxPower',
  'minTorque',
  'minSpeed',
  'maxAcceleration',
  'maxWeight',
]);
export function readFilters(params: URLSearchParams): Filters {
  const result = { ...defaultFilters };
  for (const key of Object.keys(result) as (keyof Filters)[]) {
    const value = params.get(key);
    if (value !== null) {
      if (numericKeys.has(key)) {
        const n = Number(value);
        if (Number.isFinite(n) && n >= 0) Object.assign(result, { [key]: n });
      } else Object.assign(result, { [key]: value });
    }
  }
  return result;
}
function FilterSelect({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: keyof Filters;
  value: string;
  options: { value: string; label: string }[];
  onChange: (name: keyof Filters, value: string) => void;
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select aria-label={label} value={value} onChange={(e) => onChange(name, e.target.value)}>
        <option value="">All {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
const strings = (items: string[]) =>
  [...new Set(items)].sort().map((value) => ({ value, label: value }));
export default function Explore() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params), [params]);
  const deferredQuery = useDeferredValue(filters.query);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const sort = params.get('sort') ?? 'name';
  const view = params.get('view') ?? 'grid';
  usePageMeta(
    'Explore the archive',
    'Find cars by manufacturer, country, era, engine, powertrain, and performance. Explore the curated Motor Atlas archive.',
  );
  const result = useMemo(
    () => sortCars(filterCars({ ...filters, query: deferredQuery }), sort),
    [filters, deferredQuery, sort],
  );
  const pendingParams = useRef(params);
  useEffect(() => {
    pendingParams.current = params;
  }, [params]);
  const change = (key: keyof Filters, value: string | number) => {
    const next = new URLSearchParams(pendingParams.current);
    if (value === '' || value === defaultFilters[key]) next.delete(key);
    else next.set(key, String(value));
    if (key === 'brand') {
      next.delete('model');
      next.delete('generation');
    }
    if (key === 'model') next.delete('generation');
    pendingParams.current = next;
    setParams(next, { replace: true });
  };
  const preference = (key: string, value: string) => {
    const next = new URLSearchParams(pendingParams.current);
    next.set(key, value);
    pendingParams.current = next;
    setParams(next, { replace: true });
  };
  const active = (Object.keys(filters) as (keyof Filters)[]).filter(
    (k) => filters[k] !== defaultFilters[k],
  );
  const labels = (key: keyof Filters) =>
    key === 'brand'
      ? manufacturers.find((b) => b.id === filters.brand)?.name
      : key === 'country'
        ? countries.find((c) => c.id === filters.country)?.name
        : key === 'model'
          ? models.find((m) => m.id === filters.model)?.name
          : key === 'generation'
            ? generations.find((g) => g.id === filters.generation)?.name
            : key === 'minPower'
              ? `${filters.minPower}+ hp`
              : key === 'maxPower'
                ? `Up to ${filters.maxPower} hp`
                : key === 'minTorque'
                  ? `${filters.minTorque}+ Nm`
                  : key === 'minSpeed'
                    ? `${filters.minSpeed}+ km/h`
                    : key === 'maxAcceleration'
                      ? `0–100 ≤ ${filters.maxAcceleration}s`
                      : key === 'maxWeight'
                        ? `Weight ≤ ${filters.maxWeight}kg`
                        : String(filters[key]);
  return (
    <div className="page-shell inner-page">
      <div className="page-intro">
        <p className="eyebrow">THE GLOBAL CAR EXPLORER</p>
        <h1>
          Find your <em>obsession.</em>
        </h1>
        <p>Different places. Different eras. One enduring fascination.</p>
      </div>
      <div className="explorer-search">
        <Search size={21} />
        <input
          aria-label="Search the vehicle archive"
          placeholder="Search a machine, an engine, an idea…"
          value={filters.query}
          onChange={(e) => change('query', e.target.value)}
        />
        {filters.query && (
          <button
            className="icon-button"
            onClick={() => change('query', '')}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        <span className="search-suggestion">Try “V12” or “Japanese AWD”</span>
      </div>
      <div className="explorer-layout">
        <aside
          className={`filter-panel ${mobileFilters ? 'filter-open' : ''}`}
          aria-label="Vehicle filters"
        >
          <div className="filter-heading">
            <p>
              <SlidersHorizontal size={16} /> Refine the archive
            </p>
            <button className="text-button" onClick={() => setParams({})}>
              Reset
            </button>
          </div>
          <FilterSelect
            label="Manufacturers"
            name="brand"
            value={filters.brand}
            options={[...manufacturers]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((b) => ({ value: b.id, label: b.name }))}
            onChange={change}
          />
          <FilterSelect
            label="Countries"
            name="country"
            value={filters.country}
            options={countries.map((c) => ({ value: c.id, label: c.name }))}
            onChange={change}
          />
          <FilterSelect
            label="Eras"
            name="decade"
            value={filters.decade}
            options={eras.map((e) => ({ value: e, label: e }))}
            onChange={change}
          />
          <FilterSelect
            label="Powertrains"
            name="powertrain"
            value={filters.powertrain}
            options={strings(cars.map((c) => c.powertrain))}
            onChange={change}
          />
          <FilterSelect
            label="Body styles"
            name="body"
            value={filters.body}
            options={strings(cars.map((c) => c.bodyStyle))}
            onChange={change}
          />
          <FilterSelect
            label="Categories"
            name="category"
            value={filters.category}
            options={strings(cars.map((c) => c.category))}
            onChange={change}
          />
          <label className="filter-field range-field">
            <span>
              Minimum power <strong>{filters.minPower} hp</strong>
            </span>
            <input
              aria-label="Minimum horsepower"
              type="range"
              min="0"
              max="1500"
              step="50"
              value={filters.minPower}
              onChange={(e) => change('minPower', Number(e.target.value))}
            />
            <div>
              <span>0 hp</span>
              <span>1,500 hp</span>
            </div>
          </label>
          <button
            className="advanced-toggle"
            aria-expanded={advanced}
            onClick={() => setAdvanced((v) => !v)}
          >
            {advanced ? 'Fewer' : 'More'} specifications <span>{advanced ? '−' : '+'}</span>
          </button>
          {advanced && (
            <div className="advanced-filters">
              <FilterSelect
                label="Models"
                name="model"
                value={filters.model}
                options={models
                  .filter((m) => !filters.brand || m.manufacturerId === filters.brand)
                  .map((m) => ({
                    value: m.id,
                    label: `${manufacturers.find((b) => b.id === m.manufacturerId)?.name} ${m.name}`,
                  }))}
                onChange={change}
              />
              <FilterSelect
                label="Generations"
                name="generation"
                value={filters.generation}
                options={generations
                  .filter((g) => !filters.model || g.modelId === filters.model)
                  .map((g) => ({
                    value: g.id,
                    label: `${models.find((m) => m.id === g.modelId)?.name} · ${g.name}`,
                  }))}
                onChange={change}
              />
              <FilterSelect
                label="Drivetrains"
                name="drivetrain"
                value={filters.drivetrain}
                options={strings(cars.map((c) => c.drivetrain))}
                onChange={change}
              />
              <FilterSelect
                label="Transmissions"
                name="transmission"
                value={filters.transmission}
                options={strings([
                  'Manual',
                  'DCT',
                  'Automated manual',
                  'Reduction',
                  'Multi-clutch',
                  'Planetary',
                ])}
                onChange={change}
              />
              <FilterSelect
                label="Engine configurations"
                name="configuration"
                value={filters.configuration}
                options={strings(cars.map((c) => c.engine.configuration))}
                onChange={change}
              />
              <FilterSelect
                label="Engine layouts"
                name="layout"
                value={filters.layout}
                options={strings(['Front', 'Mid', 'Rear'])}
                onChange={change}
              />
              <FilterSelect
                label="Aspiration"
                name="aspiration"
                value={filters.aspiration}
                options={strings(['Naturally aspirated', 'Turbocharged', 'Supercharged'])}
                onChange={change}
              />
              <FilterSelect
                label="Seats"
                name="seats"
                value={filters.seats}
                options={strings(cars.map((c) => String(c.seats)))}
                onChange={change}
              />
              <FilterSelect
                label="Doors"
                name="doors"
                value={filters.doors}
                options={strings(cars.map((c) => String(c.doors)))}
                onChange={change}
              />
              {[
                ['maxPower', 'Maximum power (hp)', 1600],
                ['minTorque', 'Minimum torque (Nm)', 2000],
                ['minSpeed', 'Minimum top speed (km/h)', 450],
                ['maxAcceleration', 'Maximum 0–100 (s)', 20],
                ['maxWeight', 'Maximum weight (kg)', 4000],
              ].map(([key, label, max]) => (
                <label className="filter-field" key={key}>
                  <span>{label}</span>
                  <input
                    type="number"
                    min="0"
                    max={Number(max)}
                    step={key === 'maxAcceleration' ? '.1' : '1'}
                    value={filters[key as keyof Filters]}
                    onChange={(e) =>
                      change(
                        key as keyof Filters,
                        Math.max(0, Math.min(Number(max), Number(e.target.value))),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          )}
          <p className="filter-note">
            Performance filters include records with known values. Specifications refer to the
            indexed variant.
          </p>
          <button className="button mobile-filter-done" onClick={() => setMobileFilters(false)}>
            Show {result.length} machines
            <ArrowRight size={16} />
          </button>
        </aside>
        <section className="explorer-results" aria-label="Search results">
          <div className="results-toolbar">
            <p aria-live="polite">
              <strong>{result.length}</strong>{' '}
              <span>{result.length === 1 ? 'machine' : 'machines'} found</span>
            </p>
            <div>
              <button
                className="filter-mobile-toggle"
                aria-expanded={mobileFilters}
                onClick={() => setMobileFilters((v) => !v)}
              >
                <SlidersHorizontal size={16} /> Filters
                {active.length > 0 && <span>{active.length}</span>}
              </button>
              <select
                aria-label="Sort vehicles"
                value={sort}
                onChange={(e) => preference('sort', e.target.value)}
              >
                <option value="name">Name, A–Z</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="power">Power, high to low</option>
                <option value="acceleration">0–100, low to high</option>
              </select>
              <div className="view-controls">
                <button
                  aria-label="Grid view"
                  aria-pressed={view === 'grid'}
                  onClick={() => preference('view', 'grid')}
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  aria-label="List view"
                  aria-pressed={view === 'list'}
                  onClick={() => preference('view', 'list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          {active.length > 0 && (
            <div className="filter-chips">
              {active.map((key) => (
                <button key={key} onClick={() => change(key, defaultFilters[key])}>
                  {labels(key)}
                  <X size={13} />
                </button>
              ))}
              <button className="clear-chips" onClick={() => setParams({})}>
                Clear all
              </button>
            </div>
          )}
          <div className={view === 'list' ? 'list-view' : ''}>
            {result.length ? (
              <CarGrid items={result} />
            ) : (
              <EmptyState
                title="No machines on this road."
                description="Try a broader search or remove a filter to explore another part of the archive."
              >
                <button className="button" onClick={() => setParams({})}>
                  Reset the filters
                  <ArrowRight size={18} />
                </button>
              </EmptyState>
            )}
          </div>
        </section>
      </div>
      <div className="archive-end">
        <span className="eyebrow">A CURATED STARTING POINT, NOT A COMPLETE ENCYCLOPEDIA</span>
        <Link to="/data">
          Explore the data and its context
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
