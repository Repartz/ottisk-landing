// ============================================
// SCROLL: Утилиты плавного скролла
// Используют Lenis (если доступен), иначе нативный scrollIntoView.
// ============================================

interface LenisLike {
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }) => void;
}

function getLenis(): LenisLike | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { __lenis?: LenisLike }).__lenis ?? null;
}

/**
 * Прокручивает к элементу по id (без #).
 * Учитывает прилипшую шапку: вычитаем её высоту из offset.
 */
export function scrollToId(id: string, options?: { offset?: number }) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;

  // Высота прилипшей шапки (16 на mobile / 20 на lg)
  const headerOffset =
    options?.offset ??
    (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
      ? 80
      : 64);

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -headerOffset, duration: 1.0 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/** Прокрутка наверх. */
export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
