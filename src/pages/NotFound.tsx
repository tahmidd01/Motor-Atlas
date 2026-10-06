import { Link } from 'react-router-dom';
import { ArrowLeft, Route } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
export default function NotFound() {
  usePageMeta(
    'Wrong turn',
    'This road is not in the archive. Return to Motor Atlas to discover another machine.',
  );
  return (
    <section className="not-found page-shell">
      <p className="eyebrow">ROUTE 404 / UNCHARTED TERRITORY</p>
      <div className="not-found-number" aria-hidden="true">
        4<Route strokeWidth={0.6} />4
      </div>
      <h1>
        Wrong <em>turn.</em>
      </h1>
      <p>
        Even the best journeys take an unexpected road.
        <br />
        This one isn’t in our atlas.
      </p>
      <Link to="/" className="button button-light">
        <ArrowLeft size={18} />
        Return to the garage
      </Link>
    </section>
  );
}
