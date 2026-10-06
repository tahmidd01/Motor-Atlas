import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cars } from '../data/catalog';
import { technologies } from '../data/editorial';
import { matchesQuery } from '../lib/discovery';
import { Breadcrumbs, CarGrid, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

function TechnicalDrawing({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 300 180" className="technical-drawing" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {id === 'electric' || id === 'hybrid' || id === 'hydrogen' ? (
          <>
            <rect x="60" y="45" width="170" height="95" rx="5" />
            {Array.from({ length: 7 }, (_, i) => (
              <g key={i}>
                <rect x={72 + i * 21} y="57" width="14" height="70" rx="2" />
                <path d={`M${79 + i * 21} 63v12m-5-6h10`} />
              </g>
            ))}
            <path d="M232 75h10v35h-10M45 35h-10v110h10m205-110h10v110h-10" strokeDasharray="3 5" />
          </>
        ) : id === 'rotary' ? (
          <>
            <path d="M85 45Q150 5 215 45Q260 90 215 135Q150 175 85 135Q40 90 85 45Z" />
            <path d="M150 40Q210 75 203 122Q130 139 96 90Q111 53 150 40Z" />
            <circle cx="150" cy="90" r="22" />
          </>
        ) : id === 'aerodynamics' ? (
          <>
            <path d="M40 115 75 105l43-32h63l40 35 39 7" />
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M20 ${40 + i * 15}Q80 ${30 + i * 15} 135 ${35 + i * 12}T280 ${50 + i * 18}`}
                strokeDasharray="4 4"
              />
            ))}
          </>
        ) : (
          <>
            {Array.from({ length: 4 }, (_, i) => (
              <g
                key={i}
                transform={`translate(${54 + i * 48} ${id === 'v-engine' ? 35 + Math.abs(i - 1.5) * 18 : 42})`}
              >
                <path d="m0 0 23-12 23 12-23 12ZM0 0v75l23 12 23-12V0M23 12v75" />
                <path d="M9 19v36l14 9 14-9V19M23 64v42" />
              </g>
            ))}
            <path d="M40 145h215M35 159h225" strokeDasharray="5 6" />
          </>
        )}
      </g>
    </svg>
  );
}
export default function Technology() {
  const { topic } = useParams();
  const selected = technologies.find((t) => t.id === topic);
  if (topic && topic !== 'engines' && !selected) return <NotFound />;
  return <TechnologyExhibit selected={selected} />;
}
function TechnologyExhibit({ selected }: { selected?: (typeof technologies)[number] }) {
  usePageMeta(
    selected?.name ?? 'The engineering archive',
    selected?.description ??
      'Explore engines, powertrains, aerodynamics, and the engineering ideas behind extraordinary cars.',
  );
  const examples = selected
    ? cars.filter((c) =>
        selected.id === 'v-engine'
          ? /^V\d/.test(c.engine.configuration)
          : selected.query
            ? matchesQuery(c, selected.query)
            : false,
      )
    : [];
  return (
    <div className="page-shell inner-page">
      {selected && (
        <Breadcrumbs
          items={[{ label: 'Engineering', to: '/technology' }, { label: selected.name }]}
        />
      )}
      <div className="page-intro">
        <p className="eyebrow">THE ENGINEERING ARCHIVE</p>
        <h1>
          {selected ? selected.name : 'The ideas behind'}
          {!selected && (
            <>
              <br />
              <em>the extraordinary.</em>
            </>
          )}
        </h1>
        <p>{selected?.subtitle ?? 'A closer look at the systems that turn energy into emotion.'}</p>
      </div>
      {selected ? (
        <>
          <section className="technology-story">
            <div className="technology-exhibit">
              <TechnicalDrawing id={selected.id} />
              <span className="eyebrow">SCHEMATIC STUDY / NOT TO SCALE</span>
            </div>
            <div>
              <p className="story-lead">{selected.description}</p>
              <p>{selected.explanation}</p>
              <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="arrow-link">
                Explore a primary reference
                <ArrowUpRight size={18} />
              </a>
              <Link to="/glossary" className="arrow-link">
                Look up a term
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </section>
          {examples.length > 0 ? (
            <section className="section related-section">
              <SectionHeading eyebrow="THE IDEA, IN PRACTICE" title="Meet the machines." />
              <CarGrid items={examples} />
            </section>
          ) : (
            <p className="technology-no-cars">
              No vehicle-specific examples are indexed for this topic. Explore the reference or
              continue through the engineering archive.
            </p>
          )}
        </>
      ) : (
        <div className="technology-index">
          {[...new Set(technologies.map((t) => t.kind))].map((kind) => (
            <section key={kind}>
              <SectionHeading
                eyebrow={kind}
                title={
                  kind === 'Combustion layouts'
                    ? 'Different paths to the same spark.'
                    : kind === 'Air & energy'
                      ? 'A matter of pressure.'
                      : kind === 'New powertrains'
                        ? 'The next chapters.'
                        : 'Engineering beyond the engine.'
                }
              />
              <div className="technology-grid">
                {technologies
                  .filter((t) => t.kind === kind)
                  .map((t) => (
                    <Link to={`/technology/${t.id}`} key={t.id} className="technology-card">
                      <TechnicalDrawing id={t.id} />
                      <div>
                        <h3>{t.name}</h3>
                        <p>{t.description}</p>
                        <ArrowUpRight size={20} />
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
