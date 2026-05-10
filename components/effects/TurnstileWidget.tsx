'use client';

// ============================================
// TURNSTILE WIDGET: Cloudflare Turnstile captcha
// Если NEXT_PUBLIC_TURNSTILE_SITE_KEY не задан — captcha пропускается (dev-режим).
// ============================================

import { useEffect, useRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

// Dev-заглушка: если ключ не задан — автоматически пропускаем captcha
function TurnstileDev({ onSuccess }: { onSuccess: (token: string) => void }) {
  useEffect(() => {
    const id = setTimeout(() => onSuccess('dev-token'), 0);
    return () => clearTimeout(id);
  }, [onSuccess]);
  return null;
}

export function TurnstileWidget({ onSuccess, onError, onExpire }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<TurnstileInstance>(null);

  // На localhost или если ключ не задан — пропускаем captcha автоматически
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (!siteKey || isLocalhost) {
    return <TurnstileDev onSuccess={onSuccess} />;
  }

  return (
    <Turnstile
      ref={ref}
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
      options={{
        theme: 'auto',
        language: 'auto',
        size: 'normal',
      }}
    />
  );
}
