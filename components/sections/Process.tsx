'use client';

// ============================================
// PROCESS: Временная шкала с "горящими" точками
// - SVG-линия рисуется при скролле (stroke-dashoffset)
// - 5 точек загораются по очереди при попадании в viewport
// - Шаги слева/справа поочерёдно
// - Цифры моноширинные, как на старых плёнках
// ============================================

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/layout/Container';
import { useTranslations } from 'next-intl';
import { prefersReducedMotion } from '@/lib/utils';

const STEPS = ['1', '2', '3', '4', '5'] as const;

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(SVGCircleElement | null)[]>([]);
  const t = useTranslations('process');

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // SVG линия рисуется при скролле всей секции
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 1,
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 0.6,
          },
        });
      }

      // Точки загораются по очереди при появлении соответствующего шага
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        const dot = dotsRef.current[i];

        gsap.from(step, {
          opacity: 0,
          x: i % 2 === 0 ? -50 : 50,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            once: true,
          },
        });

        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0, opacity: 0, transformOrigin: 'center center' },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: step,
                start: 'top 78%',
                once: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative py-30 overflow-hidden">
      {/* Видео-фон: руки на клавиатуре с подсветкой */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block"
        style={{ opacity: 0.18 }}
        aria-hidden="true"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Градиентный оверлей: затемнение для читаемости */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,18,16,0.92) 0%, rgba(20,18,16,0.78) 50%, rgba(20,18,16,0.95) 100%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* Заголовок */}
        <div className="text-center mb-16 lg:mb-20">
          <h2
            className="font-bold text-foreground mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {t('title')}
          </h2>
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Timeline */}
        <div ref={wrapRef} className="relative max-w-4xl mx-auto">
          {/* SVG линия + точки (по центру, под каждый шаг) */}
          <svg
            className="absolute left-8 md:left-1/2 -translate-x-1/2 top-0 bottom-0 h-full"
            width="16"
            viewBox="0 0 16 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              ref={lineRef}
              x1="8"
              y1="0"
              x2="8"
              y2="100"
              stroke="#C4A962"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Шаги */}
          <ol className="space-y-16 lg:space-y-24 list-none">
            {STEPS.map((stepNum, i) => (
              <li key={stepNum} className="relative">
                <div
                  ref={(el) => {
                    stepsRef.current[i] = el;
                  }}
                  className={`relative flex items-start gap-6 md:gap-12 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Контентный блок */}
                  <div
                    className={`flex-1 ${
                      i % 2 === 0
                        ? 'md:text-right md:pr-12 pl-16 md:pl-0'
                        : 'md:text-left md:pl-12 pl-16 md:pr-0'
                    }`}
                  >
                    <span className="font-mono text-3xl lg:text-5xl font-bold text-primary/30 block mb-2 leading-none">
                      0{stepNum}
                    </span>
                    <h3 className="text-h3 lg:text-h2 font-bold text-foreground mb-3">
                      {t(`steps.${stepNum}.title`)}
                    </h3>
                    <p className="text-body text-muted-foreground max-w-md md:inline-block">
                      {t(`steps.${stepNum}.description`)}
                    </p>
                  </div>

                  {/* Точка SVG (отдельный SVG, чтобы поверх линии) */}
                  <svg
                    className="absolute left-0 top-2 md:left-1/2 md:-translate-x-1/2 md:top-3 w-4 h-4"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <circle
                      ref={(el) => {
                        dotsRef.current[i] = el;
                      }}
                      cx="8"
                      cy="8"
                      r="6"
                      fill="#141210"
                      stroke="#C4A962"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
