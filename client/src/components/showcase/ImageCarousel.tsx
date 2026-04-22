import { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
  alt: string
}

function CarouselImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: 'var(--theme-bg-secondary)' }}
      >
        <ImageOff size={32} style={{ color: 'var(--theme-text-secondary)', opacity: 0.5 }} />
        <span className="text-xs" style={{ color: 'var(--theme-text-secondary)', opacity: 0.5 }}>
          Image unavailable
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="w-full h-full object-cover flex-shrink-0"
    />
  )
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0)
  const touchStart = useRef(0)
  const touchEnd = useRef(0)

  const goTo = useCallback(
    (index: number) => setCurrent(Math.max(0, Math.min(index, images.length - 1))),
    [images.length]
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.touches[0].clientX
  }
  const handleTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1)
    }
  }

  if (images.length === 0) {
    return (
      <div
        className="aspect-square flex items-center justify-center"
        style={{ backgroundColor: 'var(--theme-bg-secondary)' }}
      >
        <span style={{ color: 'var(--theme-text-secondary)' }}>No images</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className="aspect-square overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, i) => (
            <CarouselImage key={i} src={src} alt={`${alt} ${i + 1}`} />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          {current > 0 && (
            <button
              onClick={() => goTo(current - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {current < images.length - 1 && (
            <button
              onClick={() => goTo(current + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          )}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === current ? 'bg-white w-5' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
