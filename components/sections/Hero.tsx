'use client';

// ============================================
// HERO: Первый экран
// - Видео-фон: отпечаток из частиц (loop, muted, playsInline)
// - Гигантское "OTTISK" (kinetic typography по символам)
// - Подзаголовок моноширинным шрифтом
// - CTA: "Оставить заявку" (открывает ContactForm)
// - Скролл-индикатор
// - Скролл-анимация: видео затухает, заголовок смещается
// ============================================

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Button } from '@/components/ui/Button';
import { ArrowDown, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useContactForm } from '@/components/effects/ContactFormProvider';
import { scrollToId } from '@/lib/scroll';
import { prefersReducedMotion } from '@/lib/utils';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('hero');
  const contactForm = useContactForm();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Kinetic typography: символы появляются по очереди
      const chars = titleRef.current?.querySelectorAll('.hero-char');
      if (chars && chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 100 });
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.07,
          ease: 'power4.out',
          delay: 0.4,
        });
      }

      // Подзаголовок
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.0,
      });

      // Описание
      gsap.from(descRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: 'power3.out',
        delay: 1.2,
      });

      // CTA
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 14,
        duration: 0.6,
        ease: 'power3.out',
        delay: 1.4,
      });

      // Скролл-индикатор
      gsap.from(scrollIndicatorRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: 1.8,
      });

      // Скролл-анимация: видео затухает, заголовок поднимается и сжимается
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          if (videoRef.current) {
            videoRef.current.style.opacity = String(0.45 - p * 0.45);
          }
          if (titleRef.current) {
            gsap.to(titleRef.current, {
              y: -p * 80,
              scale: 1 - p * 0.08,
              duration: 0.1,
              overwrite: 'auto',
            });
          }
          if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.opacity = String(1 - p * 1.5);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleContactClick = () => contactForm.open('hero');

  const handleScrollDown = () => scrollToId('about');

  const handleScrollToPortfolio = () => scrollToId('portfolio');

  // Разбиение заголовка на символы (кастомный split — без платного SplitText плагина)
  const titleText = t('title');
  const titleChars = titleText.split('').map((char, i) => (
    <span
      key={i}
      className="hero-char inline-block"
      style={{ willChange: 'transform, opacity' }}
      aria-hidden="true"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-dark relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-500"
    >
      {/* Видео-фон: отпечаток из частиц */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/og-image.jpg"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.45 }}
        aria-hidden="true"
      >
        <source src="/videos/fingerprint-loop.mp4" type="video/mp4" />
      </video>

      {/* Градиентный оверлей: затемнение к низу */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(20,18,16,0.2) 0%, rgba(20,18,16,0.55) 55%, rgba(20,18,16,0.95) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Контент */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Гигантский заголовок */}
        <h1
          ref={titleRef}
          className="font-bold text-primary mb-6 select-none"
          style={{
            fontSize: 'clamp(4rem, 14vw, 11rem)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          <span className="sr-only">{titleText}</span>
          {titleChars}
        </h1>

        {/* Подзаголовок — моноширинный */}
        <p
          ref={subtitleRef}
          className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-t60 mb-6"
        >
          {t('subtitle')}
        </p>

        {/* Описание */}
        <p
          ref={descRef}
          className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('description')}
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Send className="h-5 w-5" />}
            onClick={handleContactClick}
          >
            {t('cta_primary')}
          </Button>
          <Button variant="ghost" size="lg" onClick={handleScrollToPortfolio}>
            {t('cta_secondary')}
          </Button>
        </div>
      </div>

      {/* Скролл-индикатор */}
      <button
        ref={scrollIndicatorRef}
        type="button"
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 p-2 group"
        aria-label={t('scroll')}
      >
        <ArrowDown className="h-6 w-6 text-primary/70 group-hover:text-primary transition-colors animate-bounce" />
      </button>
    </section>
  );
}
