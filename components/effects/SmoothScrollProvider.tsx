'use client';

// ============================================
// SMOOTH SCROLL PROVIDER: Плавный скролл через Lenis
// - Уважает prefers-reduced-motion (отключается)
// - Синхронизация с GSAP ScrollTrigger (раз на каждом тике)
// - Сохраняет нативное поведение для якорей и form-фокуса
// - На coarse-указателях (touch) Lenis работает мягко (без агрессивного wheel-multiplier)
// ============================================

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refreshTimerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;

    let lenis: { raf: (t: number) => void; destroy: () => void; stop: () => void; start: () => void; scrollTo: (target: string | HTMLElement | number, options?: object) => void; on: (event: string, cb: () => void) => void } | null = null;
    let frameId = 0;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;

      const isTouch =
        typeof window !== 'undefined' &&
        window.matchMedia('(pointer: coarse)').matches;

      lenis = new Lenis({
        // Плавность: чуть мягче дефолта, не "ватный"
        duration: 1.05,
        // ease-out с лёгким отскоком (Apple-стиль)
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // На touch — позволяем нативному инерционному скроллу работать,
        // Lenis только сглаживает мышь
        smoothWheel: true,
        wheelMultiplier: isTouch ? 0.9 : 1.0,
        touchMultiplier: isTouch ? 1.0 : 1.5,
        // Не «ловим» нативный focus + scrollIntoView — браузер должен работать как ожидается
        autoResize: true,
      }) as unknown as typeof lenis;

      // Делаем доступным для якорей-кнопок: window.__lenis.scrollTo('#about')
      (window as unknown as { __lenis: typeof lenis }).__lenis = lenis;

      // Синхронизация Lenis → ScrollTrigger через GSAP ticker (единственный RAF-цикл)
      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // После загрузки всех картинок/шрифтов — refresh ScrollTrigger
      // (иначе позиции pin/scrub могут быть неточные)
      const refresh = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('load', refresh, { once: true });
      // Дополнительный refresh через 500мс для мобильных браузеров
      refreshTimerRef.current = window.setTimeout(refresh, 500);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
