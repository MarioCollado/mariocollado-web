import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState } from "react";

export interface Photo {
  src: string;
  alt: string;
}

export default function Carousel({ photos }: { photos: Photo[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative group">
        <div ref={sliderRef} className="keen-slider rounded-2xl overflow-hidden">
          {photos.map((photo, idx) => (
            <div key={idx} className="keen-slider__slide">
              <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center bg-stone/20">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-contain"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>

        {loaded && photos.length > 1 && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-bg p-3 rounded-full shadow z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-bg p-3 rounded-full shadow z-10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              aria-label="Foto siguiente"
            >
              ›
            </button>
          </>
        )}
      </div>

      {loaded && photos.length > 1 && (
        <p className="text-center mt-4 text-sm text-muted" aria-live="polite">
          {currentSlide + 1} / {photos.length}
        </p>
      )}
    </div>
  );
}
