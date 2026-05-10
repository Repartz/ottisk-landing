'use client';

// ============================================
// BUTTON: Универсальная кнопка
// Варианты: primary (золотая), secondary (graphite), ghost (прозрачная)
// Размеры: sm, md, lg
// ============================================

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Базовые стили
          'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-smooth',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',
          'rounded-full',
          'whitespace-nowrap',

          // Варианты
          variant === 'primary' && [
            'bg-primary text-neutral-500',
            'hover:bg-primary-300 hover:shadow-glow-gold',
          ],
          variant === 'secondary' && [
            'bg-secondary-400 text-foreground border border-border',
            'hover:border-primary/40 hover:text-primary',
          ],
          variant === 'ghost' && [
            'bg-transparent text-foreground',
            'hover:bg-muted hover:text-primary',
          ],

          // Размеры
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'md' && 'px-6 py-3 text-base',
          size === 'lg' && 'px-8 py-4 text-base lg:text-lg',

          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {!isLoading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
