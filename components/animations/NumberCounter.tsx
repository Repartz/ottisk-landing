'use client';

// ============================================
// NUMBER COUNTER: Анимированный счётчик
// Запускается при появлении в viewport (один раз)
// Easing: easeOutExpo (быстрое начало, плавный конец)
// Использование: <NumberCounter end={72} suffix="ч" />
// ============================================

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { prefersReducedMotion } from '@/lib/utils';

interface NumberCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function NumberCounter({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
}: NumberCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px', threshold: 0 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (prefersReducedMotion()) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    let raf = 0;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
