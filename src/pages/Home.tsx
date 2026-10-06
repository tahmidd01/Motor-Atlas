import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, Globe2, Shuffle } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import {
  cars,
  carOfDay,
  carPath,
  carTitle,
  countries,
  manufacturers,
  models,
  eras,
  studioMedia,
} from '../data/catalog';
import { collections } from '../lib/discovery';
import { ArrowLink, CarGrid, MediaImage, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta(
    'A world in motion',
    'Discover extraordinary machines, their engineering, and the eras that shaped them. An independent automotive archive.',
  );
  const navigate = useNavigate();
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const featured = ['porsche-911-992-gt3-rs', 'ferrari-f40', 'nissan-skyline-gtr-r34'].map((id) =>
    cars.find((c) => c.id === id)!,
  );
  const daily = carOfDay();
  return (
    <>
      <section className="home-hero" ref={hero}>
        <motion.div className="hero-photo" style={reduced ? undefined : { y }}>
          <MediaImage
            media={studioMedia}
            alt="Porsche 911 GT3 RS, edited studio treatment"
            priority
          />
        </motion.div>
        <div className="hero-shade" />
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="hero-content page-shell">
          <motion.p
            className="eyebrow hero-eyebrow"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="status-dot" /> AN INDEPENDENT AUTOMOTIVE ARCHIVE
          </motion.p>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            A world
            <br />
            in <span>motion.</span>
          </motion.h1>
          <motion.div
            className="hero-intro"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            <p>
              Some machines take you places.
              <br />
              Others take you somewhere else entirely.
            </p>
            <Link to="/cars" className="button button-light">
              Enter the atlas
              <ArrowUpRight size={20} />
            </Link>
          </motion.div>
        </div>
        <div className="hero-bottom page-shell">
          <a href="#featured" className="scroll-note">
            <ArrowDown size={16} />
            <span>SCROLL TO DISCOVER</span>
          </a>
          <Link to={carPath(featured[0])} className="hero-car-caption">
            <span>IN THE SPOTLIGHT</span>
            <strong>PORSCHE 911 GT3 RS</strong>
            <ArrowUpRight size={18} />
          </Link>
          <Link to="/credits" className="hero-coordinates">
            STUDIO TREATMENT
            <br />
            SOURCE & CREDIT ↗
          </Link>
        </div>
      </section>
      <div className="archive-stats page-shell">
        <p>
          <Globe2 size={17} />
          <span>A world worth exploring</span>
        </p>
        {[
          [cars.length, 'MACHINES'],
          [manufacturers.length, 'MARQUES'],
          [countries.length, 'COUNTRIES'],
          [
            eras.filter((e) =>
              cars.some((c) =>
                c.year < 1950 ? e === 'Pre-1950' : e === `${Math.floor(c.year / 10) * 10}s`,
              ),
            ).length,
            'ERAS',
          ],
        ].map(([n, label]) => (
          <div key={label}>
            <strong>{n}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <section id="featured" className="section page-shell">
        <SectionHeading eyebrow="01 / THE CURATOR’S SELECTION" title="Extraordinary by design.">
          <ArrowLink to="/cars">All {cars.length} machines</ArrowLink>
        </SectionHeading>
        <CarGrid items={featured} />
      </section>
      <section className="marque-section section page-shell">
        <SectionHeading
          eyebrow="02 / THE PEOPLE BEHIND THE MACHINES"
          title="Names that moved the world."
        >
          <ArrowLink to="/brands">Explore manufacturers</ArrowLink>
        </SectionHeading>
        <div className="marque-strip">
          {['porsche', 'ferrari', 'bmw', 'mclaren', 'nissan', 'lamborghini'].map((id) => {
            const brand = manufacturers.find((b) => b.id === id)!;
            return (
              <Link key={id} to={`/brands/${id}`}>
                <span className={`marque-word ${id}`}>{brand.name}</span>
                <small>{countries.find((c) => c.id === brand.countryId)?.name}</small>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="collection-section section page-shell">
        <SectionHeading eyebrow="03 / A FEW ROADS TO TAKE" title="Follow your curiosity.">
          <ArrowLink to="/collections">Explore all collections</ArrowLink>
        </SectionHeading>
        <div className="editorial-collections">
          {collections.slice(0, 4).map((collection, i) => {
            const vehicle = cars.find(collection.test)!;
            return (
              <Link
                to={`/collections/${collection.id}`}
                key={collection.id}
                className={`editorial-collection editorial-${i}`}
              >
                <MediaImage media={vehicle.media[0]} alt={collection.name} />
                <div>
                  <span className="eyebrow">
                    {String(i + 1).padStart(2, '0')} / {cars.filter(collection.test).length}{' '}
                    MACHINES
                  </span>
                  <h3>{collection.name}</h3>
                  <p>{collection.caption}</p>
                  <ArrowUpRight size={26} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="era-section section">
        <div className="page-shell">
          <SectionHeading eyebrow="04 / THE LONG ROAD HERE" title="Every era has its icons.">
            <ArrowLink to="/timeline">Travel through time</ArrowLink>
          </SectionHeading>
          <div className="era-rail">
            {eras.map((era, i) => (
              <Link key={era} to={`/cars?decade=${encodeURIComponent(era)}`}>
                <span className="era-dot" />
                <small>CHAPTER {String(i + 1).padStart(2, '0')}</small>
                <strong>{era === 'Pre-1950' ? 'The beginnings' : era}</strong>
                <span>
                  {era === '1990s'
                    ? 'The analogue heroes'
                    : era === '2020s'
                      ? 'A new kind of energy'
                      : era === '1960s'
                        ? 'The shape of speed'
                        : `${cars.filter((c) => (c.year < 1950 ? era === 'Pre-1950' : era === `${Math.floor(c.year / 10) * 10}s`)).length} machines in the archive`}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="daily-section section page-shell">
        <div className="daily-visual">
          <Link to={carPath(daily)}>
            <MediaImage media={daily.media[0]} alt={carTitle(daily)} />
          </Link>
          <span className="eyebrow">A DIFFERENT MACHINE. EVERY DAY.</span>
        </div>
        <div className="daily-content">
          <p className="eyebrow">05 / TODAY’S DISCOVERY</p>
          <h2>
            {daily.manufacturer.name}
            <br />
            <em>{daily.model.name}.</em>
          </h2>
          <p>{daily.overview}</p>
          <ArrowLink to={carPath(daily)}>Meet today’s machine</ArrowLink>
          <button
            className="text-button"
            onClick={() => navigate(carPath(cars[Math.floor(Math.random() * cars.length)]))}
          >
            <Shuffle size={16} /> Or surprise me
          </button>
        </div>
      </section>
      <section className="engineering-banner page-shell">
        <div>
          <p className="eyebrow">06 / UNDER THE SURFACE</p>
          <h2>
            Beautiful outside.
            <br />
            <em>Brilliant within.</em>
          </h2>
          <p>
            The engines, ideas, and engineering that make
            <br />
            every machine more than its silhouette.
          </p>
          <Link to="/technology" className="button button-light">
            Explore the engineering
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="engineering-drawing" aria-hidden="true">
          <svg viewBox="0 0 500 360">
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <ellipse cx="250" cy="180" rx="174" ry="75" transform="rotate(-24 250 180)" />
              <ellipse cx="250" cy="180" rx="174" ry="75" transform="rotate(24 250 180)" />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i} transform={`translate(${85 + i * 53} ${110 + i * 12})`}>
                  <path d="m0 0 38-20 38 20-38 20ZM0 0v82l38 20 38-20V0M38 20v82" />
                  <path d="m12 12 26 14 25-14M38 38v40" />
                </g>
              ))}
              <path d="M55 292 450 112M70 310 465 130" strokeDasharray="4 6" />
            </g>
          </svg>
          <span>ENGINEERING IS AN ART FORM.</span>
        </div>
      </section>
      <section className="closing-note section page-shell">
        <span className="eyebrow">THE ARCHIVE IS JUST THE BEGINNING</span>
        <h2>
          Stay curious.
          <br />
          There’s always another road.
        </h2>
        <ArrowLink to="/cars">Find your next obsession</ArrowLink>
        <small>{models.length} models. An independent perspective.</small>
      </section>
    </>
  );
}
