// ============================================
// CARD: Карточка с hover glow эффектом
// Свечение — золотое (по DESIGN_RULES, никаких стандартных теней)
// ============================================

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, glow = true, hover = true, interactive = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl bg-card p-6 transition-all duration-500 ease-smooth',
          'border border-border',
          hover && 'hover:border-primary/30 hover:-translate-y-1',
          glow && 'hover:shadow-glow-gold',
          interactive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
