// ============================================
// LOGO: Логотип OTTISK
// Варианты:
// - mark: только отпечаток (SVG, можно анимировать)
// - text: только текст "OTTISK"
// - full: отпечаток + текст
// ============================================

import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'mark' | 'text' | 'full';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Если задан id — добавится к стабильным id внутри SVG (для анимации stroke).
   * Полезно при множественной отрисовке логотипа на одной странице.
   */
  svgId?: string;
}

const sizeMap = {
  sm: { mark: 'h-6 w-6', text: 'text-base' },
  md: { mark: 'h-8 w-8', text: 'text-xl' },
  lg: { mark: 'h-12 w-12', text: 'text-2xl' },
  xl: { mark: 'h-24 w-24', text: 'text-4xl' },
};

export function Logo({ variant = 'full', className, size = 'md', svgId }: LogoProps) {
  const sizes = sizeMap[size];

  return (
    <span
      className={cn('inline-flex items-center gap-2 text-primary', className)}
      aria-label="OTTISK"
    >
      {variant !== 'text' && <FingerprintMark className={sizes.mark} svgId={svgId} />}
      {variant !== 'mark' && (
        <span className={cn('font-bold tracking-tight', sizes.text)}>OTTISK</span>
      )}
    </span>
  );
}

interface FingerprintMarkProps {
  className?: string;
  svgId?: string;
}

/**
 * SVG-отпечаток пальца — векторный, можно анимировать stroke-dashoffset.
 * Все path имеют data-fp-path для удобной выборки в анимации.
 */
export function FingerprintMark({ className, svgId }: FingerprintMarkProps) {
  const idPrefix = svgId ? `${svgId}-` : '';
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {/* Внешние дуги (верх отпечатка) */}
      <path id={`${idPrefix}fp-1`} data-fp-path d="M48 78 Q100 28 152 78" />
      <path id={`${idPrefix}fp-2`} data-fp-path d="M58 90 Q100 50 142 90" />
      {/* Боковые длинные дуги */}
      <path id={`${idPrefix}fp-3`} data-fp-path d="M30 110 Q30 65 75 50" />
      <path id={`${idPrefix}fp-4`} data-fp-path d="M170 110 Q170 65 125 50" />
      {/* Средние эллипсы */}
      <path
        id={`${idPrefix}fp-5`}
        data-fp-path
        d="M65 105 Q100 70 135 105 Q135 145 100 165 Q65 145 65 105 Z"
      />
      <path
        id={`${idPrefix}fp-6`}
        data-fp-path
        d="M78 110 Q100 88 122 110 Q122 138 100 152 Q78 138 78 110 Z"
      />
      {/* Центральная спираль */}
      <path
        id={`${idPrefix}fp-7`}
        data-fp-path
        d="M88 118 Q100 105 112 118 Q112 132 100 138 Q92 132 92 124 Q92 120 100 120"
      />
      {/* Нижние "ножки" */}
      <path id={`${idPrefix}fp-8`} data-fp-path d="M55 145 Q60 165 75 175" />
      <path id={`${idPrefix}fp-9`} data-fp-path d="M145 145 Q140 165 125 175" />
      <path id={`${idPrefix}fp-10`} data-fp-path d="M85 165 Q90 185 100 188" />
      <path id={`${idPrefix}fp-11`} data-fp-path d="M115 165 Q110 185 100 188" />
      <path id={`${idPrefix}fp-12`} data-fp-path d="M40 130 Q42 155 60 170" />
      <path id={`${idPrefix}fp-13`} data-fp-path d="M160 130 Q158 155 140 170" />
    </svg>
  );
}
