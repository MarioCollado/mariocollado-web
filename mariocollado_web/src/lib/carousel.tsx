import "keen-slider/keen-slider.min.css"
import { useKeenSlider } from "keen-slider/react"
import { useState, useEffect } from "react"

export interface MediaItem {
  url: string;
  name: string;
  type: 'photo' | 'video';
}

type CarouselProps = {
  media: MediaItem[]
}

export default function Carousel({ media }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 4,
      spacing: 10,
    },
    breakpoints: {
      "(min-width: 400px)": {
        slides: { perView: 5, spacing: 10 },
      },
      "(min-width: 768px)": {
        slides: { perView: 6, spacing: 10 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 8, spacing: 10 },
      },
    },
  })

  useEffect(() => {
    if (loaded && instanceRef.current) {
      // Auto-advance slides every 8 seconds
      const timer = setInterval(() => {
        instanceRef.current?.next()
      }, 14000)
      
      return () => clearInterval(timer)
    }
  }, [loaded, instanceRef])

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Main Carousel */}
      <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden">
        {media.map((item, idx) => (
          <div key={idx} className="keen-slider__slide">
            <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-cente">
              {item.type === 'photo' ? (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-contain rounded-lg"
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-contain rounded-lg"
                  controls
                  preload="metadata"
                >
                  <source src={item.url} type="video/mp4" />
                  <source src={item.url} type="video/webm" />
                  Tu navegador no soporta la reproducción de videos.
                </video>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnail Navigation */}
      {loaded && media.length > 1 && (
        <div
          ref={thumbnailRef}
          className="keen-slider thumbnail"
          style={{ marginTop: "20px" }}
        >
          {media.map((item, idx) => (
            <div key={idx} className="keen-slider__slide">
              <button
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx)
                }}
                className={`relative w-full h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  currentSlide === idx
                    ? 'border-white shadow-lg scale-105'
                    : 'border-gray-600 hover:border-gray-400'
                }`}
              >
                {item.type === 'photo' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l8-5-8-5z" />
                      </svg>
                    </div>
                  </div>
                )}
                {/* Active indicator */}
                {currentSlide === idx && (
                  <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Arrows for main carousel */}
      {loaded && media.length > 1 && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Counter */}
      {loaded && media.length > 1 && (
        <div className="text-center mt-3 text-gray-600">
          <span className="text-sm">
            {currentSlide + 1} / {media.length}
          </span>
        </div>
      )}

      <style>{`
        .thumbnail .keen-slider__slide {
          cursor: pointer;
        }
        .thumbnail .keen-slider__slide.active {
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  )
}
