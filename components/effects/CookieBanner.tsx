'use client';

// ============================================
// COOKIE BANNER: Уведомление о cookie (Яндекс.Метрика)
// Показывается один раз, скрывается после принятия.
// Хранится в localStorage 'ottisk-cookie-accept'
// ============================================

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';

const STORAGE_KEY = 'ottisk-cookie-accept';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const privacyHref = locale === 'ru' ? '/privacy' : '/en/privacy';

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage недоступен
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    setVisible(false);
  };

  const isRu = locale !== 'en';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[150] w-full max-w-lg px-4"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-card border border-border rounded-2xl shadow-glow-gold p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-relaxed">
                {isRu
                  ? 'Мы используем cookie для аналитики (Яндекс.Метрика) и сохранения настроек. Продолжая использовать сайт, вы соглашаетесь с '
                  : 'We use cookies for analytics (Yandex.Metrica) and saving preferences. By using this site, you agree to our '}
                <Link
                  href={privacyHref}
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  {isRu ? 'политикой конфиденциальности' : 'privacy policy'}
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleAccept}
                className="px-3 py-1.5 rounded-xl bg-primary text-neutral-900 text-xs font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                type="button"
              >
                {isRu ? 'Понятно' : 'Got it'}
              </button>
              <button
                onClick={handleAccept}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                type="button"
                aria-label={isRu ? 'Закрыть' : 'Close'}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
