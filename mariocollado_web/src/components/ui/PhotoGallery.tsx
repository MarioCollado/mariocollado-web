import { useEffect, useRef, useState } from "react";

export interface GalleryItem {
  type: "photo" | "video";
  src: string;
  alt: string;
  poster?: string;
}

interface Props {
  items: GalleryItem[];
  label: string;
  prevLabel: string;
  nextLabel: string;
}

export default function PhotoGallery({ items, label, prevLabel, nextLabel }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Progreso de la tira
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Arrastre con ratón (el táctil ya lo resuelve el navegador)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.dataset.dragging = "true";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const onUp = () => {
      dragging = false;
      delete el.dataset.dragging;
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Los vídeos solo se reproducen cuando están visibles
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const videos = Array.from(el.querySelectorAll("video"));
    if (videos.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }),
      { root: el, threshold: 0.6 }
    );
    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [items]);

  const page = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "auto" });
  };

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar flex cursor-grab gap-4 overflow-x-auto pb-2 select-none data-[dragging=true]:cursor-grabbing"
      >
        {items.map((item, index) => (
          <figure key={index} className="h-[60vh] min-h-[320px] shrink-0 bg-stone/20">
            {item.type === "photo" ? (
              <img
                src={item.src}
                alt={item.alt}
                draggable={false}
                loading={index < 2 ? "eager" : "lazy"}
                className="h-full w-auto object-contain"
              />
            ) : (
              <video
                src={item.src}
                poster={item.poster}
                aria-label={item.alt}
                muted
                loop
                playsInline
                preload="none"
                className="h-full w-auto object-contain"
              />
            )}
          </figure>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6">
        <button
          type="button"
          onClick={() => page(-1)}
          aria-label={prevLabel}
          className="font-mono text-sm underline underline-offset-4"
        >
          ←
        </button>
        <div className="relative h-px flex-1 bg-line" aria-hidden="true">
          <span
            className="absolute inset-y-0 left-0 w-full origin-left bg-fg"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <button
          type="button"
          onClick={() => page(1)}
          aria-label={nextLabel}
          className="font-mono text-sm underline underline-offset-4"
        >
          →
        </button>
      </div>
    </div>
  );
}
