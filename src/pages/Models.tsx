import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cars, generations, manufacturers, models } from '../data/catalog';
import { Breadcrumbs, CarGrid, MediaImage, SectionHeading } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';
export default function Models() {
  const params = useParams();
  const brand = manufacturers.find((b) => b.id === params.brand);
  const model = models.find((m) => m.manufacturerId === params.brand && m.slug === params.model);
  const generation = params.generation
    ? generations.find((g) => g.modelId === model?.id && g.slug === params.generation)
    : undefined;
  if (!brand || !model || (params.generation && !generation)) return <NotFound />;
  return <ModelExhibit brand={brand} model={model} generation={generation} />;
}
function ModelExhibit({
  brand,
  model,
  generation,
}: {
  brand: (typeof manufacturers)[number];
  model: (typeof models)[number];
  generation?: (typeof generations)[number];
}) {
  const family = cars.filter((c) => c.model.id === model.id);
  const visible = generation ? family.filter((c) => c.generation.id === generation.id) : family;
  const lineage = generations
    .filter((g) => g.modelId === model.id)
    .sort((a, b) => a.start - b.start);
  usePageMeta(
    `${brand.name} ${model.name}${generation ? ` · ${generation.name}` : ''}`,
    `Explore the indexed generations and variants of the ${brand.name} ${model.name}.`,
  );
  return (
    <div className="page-shell inner-page">
      <Breadcrumbs
        items={[
          { label: 'Manufacturers', to: '/brands' },
          { label: brand.name, to: `/brands/${brand.id}` },
          { label: model.name, to: generation ? `/models/${brand.id}/${model.slug}` : undefined },
          ...(generation ? [{ label: generation.name }] : []),
        ]}
      />
      <div className="model-header">
        <div className="page-intro">
          <p className="eyebrow">{brand.name} / THE MODEL FAMILY</p>
          <h1>
            {model.name}
            <br />
            <em>{generation ? generation.name : 'Through the years.'}</em>
          </h1>
          <p>
            {lineage.length} indexed {lineage.length === 1 ? 'generation' : 'generations'}. A story
            told in its machines.
          </p>
        </div>
        <div className="model-header-image">
          <MediaImage media={visible[0]?.media[0]} alt={`${brand.name} ${model.name}`} priority />
        </div>
      </div>
      <section className="model-lineage">
        <SectionHeading eyebrow="FOLLOW THE LINEAGE" title="Continuity. Reinvention." />
        <div className="generation-timeline">
          <Link to={`/models/${brand.id}/${model.slug}`} className={!generation ? 'active' : ''}>
            <span className="generation-point" />
            <p className="eyebrow">THE FULL INDEX</p>
            <h3>All generations</h3>
            <p>{family.length} machines</p>
          </Link>
          {lineage.map((g) => (
            <Link
              key={g.id}
              to={`/models/${brand.id}/${model.slug}/${g.slug}`}
              className={generation?.id === g.id ? 'active' : ''}
            >
              <span className="generation-point" />
              <p className="eyebrow">
                {g.start} {g.end ? `— ${g.end}` : '—'}
              </p>
              <h3>{g.name}</h3>
              <p>{cars.filter((c) => c.generation.id === g.id).length} indexed variants</p>
            </Link>
          ))}
        </div>
        <p className="spec-footnote">
          This timeline includes generations represented by curated records. It is not the full
          production history.
        </p>
      </section>
      <section className="section related-section">
        <SectionHeading
          eyebrow="THE INDIVIDUAL MACHINES"
          title={generation ? `Inside the ${generation.name} chapter.` : 'Explore the family.'}
        >
          <Link to={`/brands/${brand.id}`} className="arrow-link">
            More from {brand.name}
            <ArrowUpRight size={18} />
          </Link>
        </SectionHeading>
        <CarGrid items={visible} />
      </section>
    </div>
  );
}
