// ============================================
// CONTAINER: Ограничение ширины контента
// Размеры: narrow (672px), default (1440px), wide (1600px)
// ============================================

import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 xl:px-12',
        size === 'narrow' && 'max-w-3xl',
        size === 'default' && 'max-w-container',
        size === 'wide' && 'max-w-[1600px]',
        className
      )}
    >
      {children}
    </div>
  );
}
