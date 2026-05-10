'use client';

// ============================================
// ABOUT: Секция "О нас" — Kinetic Typography
// 1. Слова появляются по очереди: "МЫ" → "ОСТАВЛЯЕМ" → "ОТПЕЧАТОК" (золотой)
// 2. После kinetic — фоном плавно появляется code-rain.mp4
// 3. Описание + философия + статистика поверх
// ============================================

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/layout/Container';
import { NumberCounter } from '@/components/animations/NumberCounter';
import { useTranslations } from 'next-intl';
import { prefersReducedMotion } from '@/lib/utils';

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const kineticRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const codeRainRef = useRef<HTMLVideoElement>(null);
  const t = useTranslations('about');

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Kinetic typography: слова появляются последовательно,
      // ПОСЛЕ их появления плавно проявляется code-rain видео-фон
      const words = kineticRef.current?.querySelectorAll('.kinetic-word');
      if (words && words.length > 0) {
        gsap.set(words, { opacity: 0, y: 80, scale: 1.2 });
        if (codeRainRef.current) {
          gsap.set(codeRainRef.current, { opacity: 0 });
        }

        ScrollTrigger.create({
          trigger: kineticRef.current,
          start: 'top 75%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();
            tl.to(words, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: 0.25,
              ease: 'power4.out',
            });
            // После последнего слова "ОТПЕЧАТОК" плавно проявляем фон-видео
            if (codeRainRef.current) {
              tl.to(
                codeRainRef.current,
                {
                  opacity: 0.28,
                  duration: 1.4,
                  ease: 'power2.out',
                },
                '-=0.2'
              );
            }
          },
        });
      }

      // Контент появляется после kinetic
      gsap.from(contentRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      // Статистика — каждый item с задержкой
      const items = statsRef.current?.querySelectorAll('.stat-item');
      if (items && items.length > 0) {
        gsap.from(items, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-dark relative py-30 overflow-hidden bg-neutral-500"
      aria-labelledby="about-title"
    >
      {/* Видео-фон code-rain: появляется после kinetic typography (только md+) */}
      <video
        ref={codeRainRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <source src="/videos/code-rain.mp4" type="video/mp4" />
      </video>

      {/* Градиентный оверлей: затемнение для читаемости текста */}
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
          <h2 id="about-title" className="sr-only">
            {t('title')}
          </h2>
          <span
            className="kinetic-word block font-bold text-foreground"
            style={{
              willChange: 'transform, opacity',
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
            aria-hidden="true"
          >
            {t('kinetic_1')}
          </span>
          <span
            className="kinetic-word block font-bold text-foreground"
            style={{
              willChange: 'transform, opacity',
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
            aria-hidden="true"
          >
            {t('kinetic_2')}
          </span>
          <span
            className="kinetic-word block font-bold text-primary"
            style={{
              willChange: 'transform, opacity',
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
            aria-hidden="true"
          >
            {t('kinetic_3')}
          </span>
        </div>

        {/* Подзаголовок */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Контент: текст + статистика */}
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
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
            <div className="stat-item">
              <div className="font-bold text-primary mb-2 leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                <NumberCounter end={72} />
              </div>
              <p className="text-small text-muted-foreground">{t('stats.testing_label')}</p>
            </div>

            <div className="stat-item">
              <div className="font-bold text-primary mb-2 leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                <NumberCounter end={48} />
              </div>
              <p className="text-small text-muted-foreground">{t('stats.support_label')}</p>
            </div>

            <div className="stat-item">
              <div className="font-bold text-primary mb-2 leading-none font-mono" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                ∞
              </div>
              <p className="text-small text-muted-foreground">{t('stats.team_label')}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
