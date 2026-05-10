'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  closeAriaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  closeAriaLabel = 'Закрыть',
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleEscape);
    // Запоминаем позицию и блокируем скролл страницы
    const y = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, y);
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Контейнер со скроллом — поверх backdrop */}
          <div
            key="modal-scroll"
            className="fixed inset-0 z-[201] overflow-y-scroll"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="flex min-h-full items-center justify-center p-4 py-10">
              <motion.div
                key="modal-content"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'relative w-full max-w-2xl',
                  'bg-card rounded-2xl sm:rounded-3xl border border-border',
                  'p-5 sm:p-7 lg:p-8 shadow-glow-gold',
                  className
                )}
              >
                <button
                  onClick={onClose}
                  type="button"
                  aria-label={closeAriaLabel}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="h-5 w-5" />
                </button>

                {title && (
                  <h2
                    id="modal-title"
                    className="text-xl sm:text-2xl lg:text-h3 font-bold mb-4 sm:mb-6 pr-10 sm:pr-12 text-foreground"
                  >
                    {title}
                  </h2>
                )}

                {children}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
