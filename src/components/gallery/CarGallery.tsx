import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Expand, Minus, Plus, X } from 'lucide-react';
import type { Media } from '../../types/automotive';
import { MediaImage } from '../ui/Primitives';

function Lightbox({
  media,
  initial,
  onClose,
}: {
  media: Media[];
  initial: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initial);
  const [zoom, setZoom] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const current = media[index];
  const opener = useRef(document.activeElement as HTMLElement);
  useEffect(() => {
    const modal = ref.current;
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
  const next = (direction: number) => {
    setIndex((i) => (i + direction + media.length) % media.length);
    setZoom(false);
  };
  return createPortal(
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Vehicle photo gallery"
      onCancel={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          next(1);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          next(-1);
        }
      }}
    >
      <div className="lightbox-toolbar">
        <span className="eyebrow">
          THE PHOTOGRAPHIC ARCHIVE · {index + 1} / {media.length}
        </span>
        <div>
          <button
            className="icon-button"
            onClick={() => setZoom((v) => !v)}
            aria-label={zoom ? 'Zoom out' : 'Zoom in'}
            aria-pressed={zoom}
          >
            {zoom ? <Minus size={21} /> : <Plus size={21} />}
          </button>
          <button className="icon-button" aria-label="Close gallery" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
      </div>
      <div className={`lightbox-image ${zoom ? 'zoomed' : ''}`}>
        <img src={current.path} alt={current.alt} />
      </div>
      <div className="lightbox-caption">
        <div>
          <p>{current.caption}</p>
          <a href={current.sourceUrl} target="_blank" rel="noreferrer">
            {current.credit} · {current.license}
          </a>
        </div>
        {media.length > 1 && (
          <div>
            <button className="icon-button" aria-label="Previous photo" onClick={() => next(-1)}>
              <ChevronLeft />
            </button>
            <button className="icon-button" aria-label="Next photo" onClick={() => next(1)}>
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  );
}
export default function CarGallery({ media, title }: { media: Media[]; title: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = media[active];
  return (
    <div className="gallery">
      <div className="gallery-main">
        <MediaImage media={current} alt={title} priority />
        {current && (
          <button className="gallery-expand" onClick={() => setOpen(true)}>
            <Expand size={18} /> View fullscreen
          </button>
        )}
      </div>
      {media.length > 1 && (
        <div className="gallery-thumbnails" role="group" aria-label="Gallery thumbnails">
          {media.map((m, i) => (
            <button
              key={m.id}
              className={active === i ? 'active' : ''}
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={active === i}
            >
              <MediaImage media={m} alt={m.alt} />
            </button>
          ))}
        </div>
      )}
      <div className="gallery-credit">
        {current ? (
          <>
            <p>{current.caption}</p>
            <a href={current.sourceUrl} target="_blank" rel="noreferrer">
              Photography: {current.credit} · {current.license} ↗
            </a>
          </>
        ) : (
          <p>Licensed photography is not yet available for this record.</p>
        )}
      </div>
      {open && <Lightbox media={media} initial={active} onClose={() => setOpen(false)} />}
    </div>
  );
}
