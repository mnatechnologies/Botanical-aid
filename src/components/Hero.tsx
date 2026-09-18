'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';

const VIDEO_URL = '/assets/hero-video.mp4';

const SLIDES = [
  {
    type: 'image' as const,
    bg: '/assets/banner04.webp',
    mobileBg: '/assets/banner04mobile.png',
    bgPosition: 'left center',
    headline: "Healing Through ",
    subheadline: "Nature's Touch",
    description: 'Soothe your soul and skin with our plant-based care.',
    link: '/mental-health-range',
  },
  {
    type: 'image' as const,
    bg: '/assets/banner02.webp',
    mobileBg: '/assets/banner02mobile.png',
    bgPosition: 'center center',
    headline: 'Botanical Aid. Pure',
    subheadline: 'Care. Naturally',
    description: 'Soothe your soul and skin with our plant-based care.',
    link: '/post-treatment-skincare',
  },
  {
    type: 'video' as const,
    bg: VIDEO_URL,
    mobileBg: '',
    bgPosition: 'center center',
    headline: 'Pure Care,',
    subheadline: 'Naturally',
    description: 'Homeopathic blends and botanical oils, made in Australia.',
    link: '/products',
  },
];

const SLIDE_INTERVAL = 6000;

export type HeroCopy = Partial<{
  hero_slide1_headline: string;
  hero_slide1_subheadline: string;
  hero_slide1_description: string;
  hero_slide2_headline: string;
  hero_slide2_subheadline: string;
  hero_slide2_description: string;
  hero_slide3_headline: string;
  hero_slide3_subheadline: string;
  hero_slide3_description: string;
  hero_cta_label: string;
  images_hero_slide1_image: string;
  images_hero_slide1_mobile_image: string;
  images_hero_slide2_image: string;
  images_hero_slide2_mobile_image: string;
}>;

export default function Hero({ copy = {} }: { copy?: HeroCopy }) {
  const slides = SLIDES.map((slide, i) => {
    const n = i + 1;
    return {
      ...slide,
      headline: copy[`hero_slide${n}_headline` as keyof HeroCopy] || slide.headline,
      subheadline: copy[`hero_slide${n}_subheadline` as keyof HeroCopy] || slide.subheadline,
      description: copy[`hero_slide${n}_description` as keyof HeroCopy] || slide.description,
      bg: slide.type === 'video' ? slide.bg : copy[`images_hero_slide${n}_image` as keyof HeroCopy] || slide.bg,
      mobileBg: copy[`images_hero_slide${n}_mobile_image` as keyof HeroCopy] || slide.mobileBg,
    };
  });

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = SLIDES.length;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (SLIDES[current]?.type === 'video') {
      timerRef.current = setTimeout(() => {
        setIsAnimating(true);
        setCurrent((prev) => (prev + 1) % total);
      }, 9000) as unknown as ReturnType<typeof setInterval>;
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
      className="relative w-full overflow-hidden"
      style={{ height: '520px' }}
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
      {/* Background slides — Desktop */}
      {slides.map((slide, i) =>
        slide.type === 'video' ? (
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
          <div
            key={i}
            className="absolute inset-0 overflow-hidden transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            {/* Desktop background */}
            <div
              key={i === current ? `kb-${current}` : `kb-idle-${i}`}
              className="absolute inset-0 hidden md:block"
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
            {/* Mobile background — uses baked-in text banner */}
            {slide.mobileBg && (
              <div
                className="absolute inset-0 md:hidden"
                style={{
                  backgroundImage: `url(${slide.mobileBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
          </div>
        )
      )}

      {/* Dark overlay — only on image slides, desktop only */}
      {SLIDES[current]?.type !== 'video' && (
        <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)' }} />
      )}

      {/* Text content — desktop only (mobile text is baked into banner images) */}
      <div className={`absolute inset-0 z-10 items-center ${SLIDES[current]?.type === 'video' ? 'flex' : 'hidden md:flex'}`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="relative max-w-xl">
            {slides.map((slide, i) => (
              <div
                key={i}
                style={{
                  position: i === current ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
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
                <h1 className={`text-4xl sm:text-5xl lg:text-[60px] font-bold leading-[1.1] tracking-tight ${slide.type === 'video' ? 'text-[#1a3a8f]' : 'text-white drop-shadow-lg'}`}>
                  {slide.headline}
                  <br />
                  {slide.subheadline}
                </h1>
                <p className={`mt-4 text-base sm:text-lg max-w-m ${slide.type === 'video' ? 'text-[#1a3a8f]/80' : 'text-white/90 drop-shadow'}`}>
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

      {/* Bottom CTA bar — mobile image slides bake the CTA into the banner art */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 ${SLIDES[current]?.type === 'video' ? 'block' : 'hidden md:block'}`}>
          <div className="container mx-auto px-4 lg:px-6 pb-8 flex items-end">
            <div className="flex gap-3">
              <Link
                href={slides[current]?.link || '/products'}
                className="px-6 py-2.5 rounded text-sm font-bold text-white transition-all hover:brightness-110 shadow"
                style={{ backgroundColor: '#1a3a8f' }}
              >
                {copy.hero_cta_label || 'SHOP NOW'}
              </Link>
            </div>
          </div>
        </div>
    </section>
  );
}
