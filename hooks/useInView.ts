// ============================================
// USE IN VIEW: Хук для отслеживания видимости элемента через IntersectionObserver
// ============================================

import { useEffect, useState, RefObject } from 'react';

interface UseInViewOptions {
  once?: boolean;
  margin?: string;
  threshold?: number | number[];
}

export function useInView(
  ref: RefObject<Element | null>,
  options: UseInViewOptions = {}
) {
  const { once = true, margin = '0px', threshold = 0 } = options;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin: margin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, once, margin, threshold]);

  return isInView;
}
