import { useState } from 'react';
import { Search } from 'lucide-react';
import { glossary } from '../data/editorial';
import { normalize } from '../lib/discovery';
import { usePageMeta } from '../hooks/usePageMeta';
export default function Glossary() {
  const [query, setQuery] = useState('');
  usePageMeta(
    'The automotive glossary',
    'Plain-language explanations of automotive engineering terms, from AWD to wheelbase.',
  );
  const terms = glossary.filter(([term, definition]) =>
    normalize(`${term} ${definition}`).includes(normalize(query)),
  );
  return (
    <div className="page-shell inner-page">
      <div className="page-intro">
        <p className="eyebrow">A SHARED LANGUAGE</p>
        <h1>
          Understand
          <br />
          <em>the vocabulary.</em>
        </h1>
        <p>A few useful words for a world of moving parts.</p>
      </div>
      <label className="directory-search glossary-search">
        <Search size={20} />
        <input
          aria-label="Search the glossary"
          placeholder="Find a term…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="directory-count" aria-live="polite">
        {terms.length} terms
      </p>
      <dl className="glossary-list">
        {terms.map(([term, definition]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{definition}</dd>
          </div>
        ))}
      </dl>
      {!terms.length && (
        <p className="timeline-note">No matching terms. Try a broader word or abbreviation.</p>
      )}
    </div>
  );
}
