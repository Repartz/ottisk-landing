'use client';

// ============================================
// PRELOADER GATE: Клиентская обёртка над Preloader
// Управляет показом прелоадера и блокирует скролл, пока он активен.
// ============================================

import { useEffect, useState } from 'react';
import { Preloader } from './Preloader';

interface PreloaderGateProps {
  children: React.ReactNode;
}

export function PreloaderGate({ children }: PreloaderGateProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Блокировка скролла, пока прелоадер активен
  useEffect(() => {
    if (isLoading) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      {children}
    </>
  );
}
