'use client';

// ============================================
// SCROLL PROVIDER: Синхронизация GSAP ScrollTrigger
// Lenis убран — используем нативный скролл браузера
// На мобильных: refresh при изменении размера + скролл
// ============================================

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Синхронизируем ScrollTrigger с нативным скроллом
    ScrollTrigger.refresh();

    // На мобильных resize часто меняет высоту (появление/скрытие адресной строки)
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize, { passive: true });

    // Refresh после полной загрузки шрифтов и изображений
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad, { once: true });
    const timer = setTimeout(() => ScrollTrigger.refresh(), 800);

    // Для мобильных: ScrollTrigger нужно уведомлять о скролле
    // при prefersReducedMotion анимации отключены
    if (!prefersReducedMotion()) {
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);

  return <>{children}</>;
}
