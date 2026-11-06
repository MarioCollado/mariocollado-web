import { useEffect, useRef, useState } from "react";

export interface Photo {
  src: string;
  alt: string;
}

interface CarouselProps {
  photos: Photo[];
  galleryLabel: string;
  pauseLabel: string;
  playLabel: string;
  emptyLabel: string;
}

const widths = ["narrow", "wide", "standard", "standard", "wide", "narrow"];

export default function Carousel({
  photos,
  galleryLabel,
  pauseLabel,
  playLabel,
  emptyLabel,
}: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerActiveRef = useRef(false);
  const dragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setIsPlaying(!motionPreference.matches);

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);
    return () => motionPreference.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!isPlaying || photos.length < 2) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    let frame = 0;
    let previousTime = 0;

    const advance = (time: number) => {
      if (previousTime && !pointerActiveRef.current && !document.hidden) {
        const elapsed = Math.min(time - previousTime, 40);
        const cycleWidth = viewport.scrollWidth / 2;
        viewport.scrollLeft += elapsed * 0.025;
        if (cycleWidth > 0 && viewport.scrollLeft >= cycleWidth) {
          viewport.scrollLeft -= cycleWidth;
        }
      }

      previousTime = time;
      frame = window.requestAnimationFrame(advance);
    };

    frame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(frame);
  }, [isPlaying, photos.length]);

  if (photos.length === 0) {
    return <p className="gallery-empty font-mono">{emptyLabel}</p>;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setIsPlaying(false);
    const viewport = viewportRef.current;
    viewport?.scrollBy({
      left: (event.key === "ArrowRight" ? 1 : -1) * viewport.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      pointerActiveRef.current = true;
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    pointerActiveRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.currentTarget.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
  };

  const finishPointerInteraction = () => {
    dragRef.current = null;
    pointerActiveRef.current = false;
  };

  const renderPhotos = (duplicate = false) => (
    <div className="archive-gallery__group" role="list" aria-hidden={duplicate || undefined}>
      {photos.map((photo, index) => (
        <figure
          className={`archive-gallery__item archive-gallery__item--${widths[index % widths.length]}${hoveredIndex === index ? " is-highlighted" : ""}`}
          role="listitem"
          key={`${duplicate ? "copy-" : ""}${photo.src}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img
            src={photo.src}
            alt={duplicate ? "" : photo.alt}
            loading={index === 0 && !duplicate ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="archive-gallery__image--cover"
          />
          <img
            src={photo.src}
            alt=""
            aria-hidden="true"
            loading={index === 0 && !duplicate ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className="archive-gallery__image--full"
          />
        </figure>
      ))}
    </div>
  );

  return (
    <div className="archive-gallery">
      <div className="archive-gallery__toolbar">
        <p className="archive-gallery__hint font-mono">{galleryLabel}</p>
        {photos.length > 1 && (
          <button
            className="archive-gallery__toggle font-mono"
            type="button"
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            {isPlaying ? pauseLabel : playLabel}
          </button>
        )}
      </div>

      <div
        ref={viewportRef}
        className={`archive-gallery__viewport${isPlaying ? " is-playing" : ""}`}
        role="region"
        aria-label={galleryLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerInteraction}
        onPointerCancel={finishPointerInteraction}
      >
        <div className="archive-gallery__track">
          {renderPhotos()}
          {renderPhotos(true)}
        </div>
      </div>
    </div>
  );
}
