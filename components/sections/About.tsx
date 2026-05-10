'use client';

import { useEffect, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { NumberCounter } from '@/components/animations/NumberCounter';
import { useTranslations } from 'next-intl';
import { prefersReducedMotion } from '@/lib/utils';

// Универсальный хук анимации через IntersectionObserver (работает на всех устройствах)
function useRevealOnScroll(ref: React.RefObject<HTMLElement | null>, onEnter: () => void) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Без анимации — сразу показываем
      onEnter();
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEnter();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const kineticRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const codeRainRef = useRef<HTMLVideoElement>(null);
  const t = useTranslations('about');

  // Kinetic words анимация
  useRevealOnScroll(kineticRef, () => {
    const words = kineticRef.current?.querySelectorAll<HTMLElement>('.kinetic-word');
    if (!words) return;
    words.forEach((word, i) => {
      word.style.transition = `opacity 0.7s ease ${i * 0.22}s, transform 0.7s ease ${i * 0.22}s`;
      word.style.opacity = '1';
      word.style.transform = 'translateY(0) scale(1)';
    });
    // Видео фон после слов
    if (codeRainRef.current) {
      const delay = words.length * 0.22 + 0.5;
      setTimeout(() => {
        if (codeRainRef.current) {
          codeRainRef.current.style.transition = 'opacity 1.4s ease';
          codeRainRef.current.style.opacity = '0.28';
        }
      }, delay * 1000);
    }
  });

  // Контент анимация
  useRevealOnScroll(contentRef, () => {
    if (!contentRef.current) return;
    contentRef.current.style.transition = 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s';
    contentRef.current.style.opacity = '1';
    contentRef.current.style.transform = 'translateY(0)';
  });

  // Статистика — анимируем весь блок целиком (не отдельные items)
  useRevealOnScroll(statsRef, () => {
    if (!statsRef.current) return;
    statsRef.current.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    statsRef.current.style.opacity = '1';
    statsRef.current.style.transform = 'translateY(0)';
  });

  const noAnim = prefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-dark relative py-30 overflow-hidden bg-neutral-500"
      aria-labelledby="about-title"
    >
      {/* Видео-фон code-rain */}
      <video
        ref={codeRainRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block"
        style={{ opacity: 0, transition: 'none' }}
        aria-hidden="true"
      >
        <source src="/videos/code-rain.mp4" type="video/mp4" />
      </video>

      {/* Градиентный оверлей */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,18,16,0.95) 0%, rgba(20,18,16,0.78) 50%, rgba(20,18,16,0.92) 100%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* Kinetic Typography */}
        <div
          ref={kineticRef}
          className="min-h-[40vh] flex flex-col items-center justify-center mb-16 lg:mb-24 text-center"
        >
          <h2 id="about-title" className="sr-only">{t('title')}</h2>
          {(['kinetic_1', 'kinetic_2', 'kinetic_3'] as const).map((key, i) => (
            <span
              key={key}
              className={`kinetic-word block font-bold ${key === 'kinetic_3' ? 'text-primary' : 'text-foreground'}`}
              style={{
                fontSize: 'clamp(3rem, 10vw, 8rem)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                opacity: noAnim ? 1 : 0,
                transform: noAnim ? 'none' : 'translateY(60px) scale(1.1)',
                willChange: 'transform, opacity',
              }}
              aria-hidden="true"
            >
              {t(key)}
            </span>
          ))}
        </div>

        {/* Подзаголовок */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Контент */}
        <div
          ref={contentRef}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20"
          style={{
            opacity: noAnim ? 1 : 0,
            transform: noAnim ? 'none' : 'translateY(40px)',
          }}
        >
          <div className="space-y-6">
            <p className="text-body text-muted-foreground leading-relaxed">
              {t('description')}
            </p>
            <p className="text-body text-foreground font-medium leading-relaxed border-l-2 border-primary pl-6">
              {t('philosophy')}
            </p>
          </div>

          {/* Статистика */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8 lg:gap-10"
          >
            {[
              { end: 72, label: t('stats.testing_label') },
              { end: 48, label: t('stats.support_label') },
              { end: null, label: t('stats.team_label') },
            ].map(({ end, label }, idx) => (
              <div
                key={idx}
                className="stat-item"
              >
                <div
                  className="font-bold text-primary mb-2 leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                >
                  {end !== null ? <NumberCounter end={end} /> : <span className="font-mono">∞</span>}
                </div>
                <p className="text-small text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
