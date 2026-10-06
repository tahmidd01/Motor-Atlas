import { useSearchParams, Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { milestones } from '../data/editorial';
import { cars, carPath, decadeOf, eras } from '../data/catalog';
import { CarGrid, MediaImage, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
export default function Timeline() {
  const [params, setParams] = useSearchParams();
  const era = params.get('era') ?? '';
  const events = milestones.filter((e) => !era || decadeOf(e.year) === era);
  const vehicles = cars.filter((c) => !era || decadeOf(c.year) === era);
  usePageMeta(
    'The automotive timeline',
    'Travel through the eras, machines, and engineering milestones that shaped automotive history.',
  );
  return (
    <div className="page-shell inner-page">
      <div className="page-intro">
        <p className="eyebrow">THE LONG ROAD HERE</p>
        <h1>
          A century of
          <br />
          <em>moving forward.</em>
        </h1>
        <p>Breakthroughs. Beautiful mistakes. Ideas that changed everything.</p>
      </div>
      <div className="era-tabs" role="group" aria-label="Select an era">
        <button aria-pressed={!era} onClick={() => setParams({})}>
          All eras
        </button>
        {eras.map((e) => (
          <button key={e} aria-pressed={era === e} onClick={() => setParams({ era: e })}>
            {e}
          </button>
        ))}
      </div>
      <div className="history-timeline">
        {events.map((entry, i) => {
          const car = cars.find((c) => c.id === entry.carId);
          return (
            <article className="history-event" key={`${entry.year}-${entry.title}`}>
              <div className="history-date">
                <span>{entry.year}</span>
                <span className="history-dot" />
              </div>
              <div className="history-content">
                <p className="eyebrow">
                  {entry.theme} / CHAPTER {String(i + 1).padStart(2, '0')}
                </p>
                <h2>{entry.title}</h2>
                <p>{entry.description}</p>
                <div>
                  {car && (
                    <Link to={carPath(car)} className="arrow-link">
                      Explore the machine
                      <ArrowUpRight size={17} />
                    </Link>
                  )}
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-button"
                  >
                    Historical reference
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
              {car && (
                <Link to={carPath(car)} className="history-image">
                  <MediaImage media={car.media[0]} alt={car.model.name} />
                </Link>
              )}
            </article>
          );
        })}
      </div>
      {!events.length && (
        <p className="timeline-note">
          No editorial milestone is indexed for this era yet. Explore its machines below.
        </p>
      )}
      <section className="section related-section">
        <SectionHeading
          eyebrow="THE MACHINES OF THE ERA"
          title={era ? `Inside the ${era} chapter.` : 'History, in metal.'}
        />
        <CarGrid items={vehicles} />
      </section>
    </div>
  );
}
