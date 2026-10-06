import { cars, carTitle } from '../data/catalog';
import { usePageMeta } from '../hooks/usePageMeta';
export default function Credits() {
  usePageMeta(
    'Sources & credits',
    'Source references, image attribution, and license context for the Motor Atlas archive.',
  );
  return (
    <div className="page-shell inner-page credits-page">
      <div className="page-intro">
        <p className="eyebrow">A SHARED ARCHIVE</p>
        <h1>
          Credit where
          <br />
          <em>it belongs.</em>
        </h1>
        <p>Independent design. Shared knowledge. Proper attribution.</p>
      </div>
      <div className="credits-intro">
        <p>
          Motor Atlas is an independent educational portfolio project. Manufacturer and model names
          identify the vehicles; their trademarks remain with their owners. No affiliation or
          endorsement is implied.
        </p>
        <p>
          Photographs sourced from Wikimedia Commons retain their individual licenses. Local files
          are resized, converted to WebP, and may be cropped in the interface. Adapted photographs
          remain under their original applicable licenses. Follow the individual license links when
          reusing an asset.
        </p>
        <p>
          Manufacturer source references support the records and historical context. Unchecked
          references may change over time; consult the source and the specification notes for a
          particular vehicle.
        </p>
      </div>
      <h2>Vehicle sources & photography</h2>
      <div className="credits-list">
        {cars.map((c) => (
          <article key={c.id}>
            <h3>{carTitle(c)}</h3>
            <a href={c.source.url} target="_blank" rel="noreferrer">
              Specification reference: {c.source.name} ↗
            </a>
            <p>
              {c.source.checkedOn
                ? `Core reference checked ${c.source.checkedOn}`
                : 'Reference supplied · further review encouraged'}
            </p>
            {c.media.length ? (
              c.media.map((m) => (
                <div key={m.id}>
                  <a href={m.sourceUrl} target="_blank" rel="noreferrer">
                    {m.credit} · Wikimedia Commons ↗
                  </a>
                  <p>{m.caption}</p>
                  <a href={m.licenseUrl} target="_blank" rel="noreferrer">
                    {m.license} ↗
                  </a>
                  <small>{m.changes}</small>
                </div>
              ))
            ) : (
              <small>Photography forthcoming. Original abstract placeholder used.</small>
            )}
          </article>
        ))}
      </div>
      <p className="spec-footnote">
        Typography: DM Sans and Manrope, distributed under the SIL Open Font License. Icons: Lucide,
        ISC license. The procedural engineering study is original project geometry.
      </p>
    </div>
  );
}
