'use client';

// ============================================
// PRELOADER: SVG Fingerprint stroke reveal
// 1. Линии отпечатка рисуются (stroke-dasharray)
// 2. Лёгкое золотое свечение
// 3. Elastic "постановка" — bounce
// 4. Fade-out + zoom (имитация "провала")
// ============================================

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { FingerprintMark } from '@/components/ui/Logo';
import { prefersReducedMotion } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface PreloaderProps {
  onComplete: () => void;
  /** Минимальная длительность прелоадера (мс), даже если первый раз */
  minDuration?: number;
}

const SESSION_KEY = 'ottisk-visited';

export function Preloader({ onComplete, minDuration = 2200 }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const t = useTranslations('preloader');

  useEffect(() => {
    // Уважение к prefers-reduced-motion
    if (prefersReducedMotion()) {
      const t1 = window.setTimeout(() => {
        setIsComplete(true);
        onComplete();
      }, 200);
      return () => window.clearTimeout(t1);
    }

    // Если уже посещали — короткий прелоадер
    const visited =
      typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';
    const targetDuration = visited ? 600 : minDuration;

    const ctx = gsap.context(() => {
      const paths = svgWrapRef.current?.querySelectorAll<SVGPathElement>('[data-fp-path]');
      if (!paths || paths.length === 0) return;

      // Длины для stroke-dash
      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.opacity = '0';
      });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.4,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem(SESSION_KEY, '1');
              }
              setIsComplete(true);
              onComplete();
            },
          });
        },
      });

      // Шаг 1: линии рисуются
      tl.to(paths, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: visited ? 0.6 : 1.4,
        stagger: visited ? 0.02 : 0.06,
        ease: 'power2.out',
      });

      // Шаг 2: золотое свечение через filter (опционально)
      tl.to(
        svgWrapRef.current,
        {
          filter: 'drop-shadow(0 0 16px rgba(196,169,98,0.6))',
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // Шаг 3: elastic "постановка"
      tl.to(svgWrapRef.current, {
        scale: 0.95,
        duration: 0.18,
        ease: 'power2.in',
      }).to(svgWrapRef.current, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });

      // Гарантия минимальной длительности
      const elapsed = tl.duration() * 1000;
      if (elapsed < targetDuration) {
        tl.to({}, { duration: (targetDuration - elapsed) / 1000 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, minDuration]);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-neutral-500"
      aria-hidden="true"
    >
      <div ref={svgWrapRef} className="text-primary" style={{ willChange: 'transform, filter' }}>
        <FingerprintMark className="h-40 w-40 sm:h-56 sm:w-56" svgId="preloader" />
      </div>

      {/* Подпись */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <p className="font-mono text-xs tracking-[0.4em] uppercase text-t60 animate-pulse">
          {t('loading')}
        </p>
      </div>
    </div>
  );
}
