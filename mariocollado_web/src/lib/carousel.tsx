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
      spacing: 12,
    },
    breakpoints: {
      "(min-width: 400px)": { slides: { perView: 5, spacing: 12 } },
      "(min-width: 768px)": { slides: { perView: 6, spacing: 12 } },
      "(min-width: 1024px)": { slides: { perView: 8, spacing: 12 } },
    },
  })

  useEffect(() => {
    if (loaded && instanceRef.current) {
      const timer = setInterval(() => {
        const currentIdx = instanceRef.current?.track.details.rel || 0
        const currentItem = media[currentIdx]
        
        if (currentItem && currentItem.type === 'photo') {
          instanceRef.current?.next()
        }
      }, 4000)
      
      return () => clearInterval(timer)
    }
  }, [loaded, instanceRef, media])

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative group">
        <div ref={sliderRef} className="keen-slider rounded-2xl overflow-hidden shadow-lg">
          {media.map((item, idx) => (
            <div key={idx} className="keen-slider__slide">
              <div className="relative w-auto h-[300px] md:h-[400px] flex items-center justify-center bg-gradient-to-br from-white/95 to-white/90 rounded-2xl border border-white/40 shadow-lg">
                {item.type === 'photo' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-contain rounded-xl"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-contain rounded-xl"
                    controls
                    preload="metadata"
                    autoPlay
                    muted
                    loop
                    playsInline
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

        {loaded && media.length > 1 && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white text-secondary-blue p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 border border-white/40"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm hover:bg-white text-secondary-blue p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 border border-white/40"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {loaded && media.length > 1 && (
        <div className="mt-6">
          <div ref={thumbnailRef} className="keen-slider">
            {media.map((item, idx) => (
              <div key={idx} className="keen-slider__slide">
                <button
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`relative w-full h-16 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                    currentSlide === idx
                      ? 'border-secondary-blue scale-105 shadow-lg bg-white/90'
                      : 'border-white/40 hover:border-secondary-blue/50 hover:scale-102 hover:shadow-md opacity-70 hover:opacity-100 bg-white/80'
                  }`}
                >
                  {item.type === 'photo' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-8xBnLkglFihNDAiJGmgK-5UK_CaKUC92Iw&s"
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-sm p-2 rounded-full border border-white/40">
                          <svg className="w-4 h-4 text-secondary-blue" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 5v10l8-5-8-5z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loaded && media.length > 1 && (
        <div className="text-center mt-4">
          <div className="inline-flex items-center bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-white/40">
            <span className="text-sm font-medium text-secondary-blue">
              {currentSlide + 1} / {media.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}