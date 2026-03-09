'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';

const VIDEO_URL = '/assets/hero-video.mp4';

const SLIDES = [
  {
    type: 'image' as const,
    bg: '/assets/banner04.webp',
    bgPosition: 'left center',
    headline: 'Mental Health',
    subheadline: 'Range',
    description: 'Find the light and set your mind free with Botanical Aid.',
    link: '/products?category=mental-health',
  },
  {
    type: 'image' as const,
    bg: '/assets/banner02.webp',
    bgPosition: 'center center',
    headline: 'Post Treatment',
    subheadline: 'Skincare',
    description: 'Comfort for today, confidence tomorrow.',
    link: '/products?category=post-treatment',
  },
  {
    type: 'video' as const,
    bg: VIDEO_URL,
    bgPosition: 'center center',
    headline: '',
    subheadline: '',
    description: '',
    link: '',
  },
];

const SLIDE_INTERVAL = 6000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = SLIDES.length;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (SLIDES[current]?.type === 'video') {
      // onEnded / onError handle normal advancement; this is a last-resort fallback
      // in case the video is blocked (e.g. CORS on production) and neither fires
      timerRef.current = setTimeout(() => {
        setIsAnimating(true);
        setCurrent((prev) => (prev + 1) % total);
      }, 15000) as unknown as ReturnType<typeof setInterval>;
      return;
    }
    timerRef.current = setInterval(() => {
      setIsAnimating(true);
      setCurrent((prev) => (prev + 1) % total);
    }, SLIDE_INTERVAL);
  }, [total, current]);

  useEffect(() => {
    if (!isHovered) startTimer();
    else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHovered, startTimer]);

  useEffect(() => {
    const t = setTimeout(() => setIsAnimating(false), 700);
    return () => clearTimeout(t);
  }, [current]);

  const goNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % total);
    startTimer();
  }, [isAnimating, total, startTimer]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + total) % total);
    startTimer();
  }, [isAnimating, total, startTimer]);

  const goTo = useCallback((i: number) => {
    if (i === current || isAnimating) return;
    setIsAnimating(true);
    setCurrent(i);
    startTimer();
  }, [current, isAnimating, startTimer]);

  const touchStart = useRef<number | null>(null);

  return (
    <section
      className="relative w-full overflow-hidden transition-[height] duration-700 ease-in-out"
      style={{ height: SLIDES[current]?.type === 'video' ? '320px' : '520px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return;
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
        touchStart.current = null;
      }}
      aria-roledescription="carousel"
    >
      {/* Background slides */}
      {SLIDES.map((slide, i) =>
        slide.type === 'video' ? (
          /* Video slide — autoplay loop muted, same as real site */
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center bg-white"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <video
              key={i === current ? `vid-active-${current}` : `vid-idle-${i}`}
              src={i === current ? slide.bg : undefined}
              autoPlay={i === current}
              muted
              playsInline
              className="h-full w-auto object-contain"
              onEnded={goNext}
              onError={goNext}
            />
          </div>
        ) : (
          // Outer div: stable key so opacity cross-fade works
          <div
            key={i}
            className="absolute inset-0 overflow-hidden transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            {/* Inner div: key resets when this slide becomes active → restarts Ken Burns */}
            <div
              key={i === current ? `kb-${current}` : `kb-idle-${i}`}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${slide.bg})`,
                backgroundSize: 'cover',
                backgroundPosition: slide.bgPosition,
                backgroundRepeat: 'no-repeat',
                animation: i === current
                  ? `hero-ken-burns ${SLIDE_INTERVAL + 1500}ms ease-out forwards`
                  : 'none',
              }}
            />
          </div>
        )
      )}

      {/* Dark overlay — only on image slides */}
      {SLIDES[current]?.type !== 'video' && (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)' }} />
      )}

      {/* Text content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-xl">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className="transition-all duration-600 ease-in-out"
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  top: i === 0 ? undefined : 0,
                  opacity: i === current ? 1 : 0,
                  transform: i === current ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
                  pointerEvents: i === current ? 'auto' : 'none',
                  visibility: i === current ? 'visible' : 'hidden',
                }}
                role="group"
                aria-roledescription="slide"
                aria-hidden={i !== current}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold text-white leading-[1.1] tracking-tight drop-shadow-lg">
                  {slide.headline}
                  <br />
                  {slide.subheadline}
                </h1>
                <p className="mt-4 text-base sm:text-lg text-white/90 drop-shadow max-w-sm">
                  {slide.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex w-10 h-10 rounded-full bg-black/20 border border-white/20 items-center justify-center text-white hover:bg-black/35 transition-all cursor-pointer"
        aria-label="Previous slide"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex w-10 h-10 rounded-full bg-black/20 border border-white/20 items-center justify-center text-white hover:bg-black/35 transition-all cursor-pointer"
        aria-label="Next slide"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
            aria-label={`Slide ${i + 1}`}
          >
            {i === current && !isHovered && (
              <span
                className="block h-full rounded-full bg-white/50 origin-left"
                style={{ animation: `hero-dot-progress ${SLIDE_INTERVAL}ms linear forwards` }}
                key={`p-${current}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Bottom CTA bar — hidden on video slide */}
      {SLIDES[current]?.type !== 'video' && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 lg:px-6 pb-8 flex items-end">
            <div className="flex gap-3">
              <Link
                href={SLIDES[current]?.link || '/products'}
                className="px-6 py-2.5 rounded text-sm font-bold text-white transition-all hover:brightness-110 shadow"
                style={{ backgroundColor: '#1a3a8f' }}
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
