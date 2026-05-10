'use client';

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
  const isRu = locale !== 'en';

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Небольшая задержка чтобы не мешать загрузке страницы
        const id = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(id);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="fixed bottom-0 left-0 right-0 z-[150] p-3 sm:p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="max-w-screen-lg mx-auto bg-card border border-border rounded-2xl shadow-glow-gold p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Текст */}
            <p className="flex-1 text-sm text-foreground leading-relaxed">
              {isRu
                ? 'Мы используем cookie для аналитики и сохранения настроек. Продолжая использование сайта, вы соглашаетесь с '
                : 'We use cookies for analytics and preferences. By continuing, you agree to our '}
              <Link
                href={privacyHref}
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              >
                {isRu ? 'политикой конфиденциальности' : 'privacy policy'}
              </Link>
              .
            </p>

            {/* Кнопки */}
            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
              <button
                onClick={handleAccept}
                className="px-4 py-2 rounded-xl bg-primary text-neutral-900 text-sm font-bold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                type="button"
              >
                {isRu ? 'Понятно' : 'Got it'}
              </button>
              <button
                onClick={handleAccept}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
