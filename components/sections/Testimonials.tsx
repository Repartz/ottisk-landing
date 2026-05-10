'use client';

// ============================================
// TESTIMONIALS: Полноэкранные цитаты (ORYZO-стиль)
// - Загрузка из Firestore (если есть документы) → fallback на config/content.json
// - Не карточки, а одна большая цитата на экране
// - Слова появляются по очереди (blur+fade)
// - Переключение: dots / стрелки / автопрокрутка (5с)
// - Свайпы на мобильных
// ============================================

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useTranslations, useLocale } from 'next-intl';
import { Send, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { useContactForm } from '@/components/effects/ContactFormProvider';
import contentConfig from '@/config/content.json';
import { isFirebaseConfigured, getDb } from '@/lib/firebase';
import type { Testimonial } from '@/types';

const AUTOPLAY_INTERVAL = 6000;
const FALLBACK_ITEMS = contentConfig.testimonials.items as Testimonial[];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [items, setItems] = useState<Testimonial[]>(FALLBACK_ITEMS);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const contactForm = useContactForm();

  // Загрузка из Firestore с fallback на content.json
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isFirebaseConfigured()) return;
      try {
        const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
        const db = getDb();
        if (!db) return;
        let snap;
        try {
          snap = await getDocs(query(collection(db, 'testimonials'), orderBy('order', 'asc')));
        } catch {
          // Если нет поля order — без сортировки
          snap = await getDocs(collection(db, 'testimonials'));
        }
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Testimonial[];
        if (!cancelled && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.error('[Testimonials] firestore load error', err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % Math.max(items.length, 1));
  }, [items.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + items.length) % Math.max(items.length, 1));
  }, [items.length]);

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  // Автопрокрутка
  useEffect(() => {
    if (isPaused || items.length < 2) return;
    const id = window.setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [goNext, isPaused, items.length]);

  // Свайпы на мобильных
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || items.length < 2) return;
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) goNext();
      else goPrev();
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [goNext, goPrev, items.length]);

  // Если current вышел за пределы (после редактирования) — сбрасываем
  useEffect(() => {
    if (current >= items.length) setCurrent(0);
  }, [items.length, current]);

  const handleContactClick = () => contactForm.open('testimonials');

  // Empty state
  if (items.length === 0) {
    return (
      <section
        ref={sectionRef}
        id="testimonials"
        className="py-30 min-h-[60vh] flex items-center"
      >
        <Container>
          <div className="text-center">
            <h2
              className="font-bold text-foreground mb-4"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {t('title')}
            </h2>
            <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-primary mb-12">
              {t('subtitle')}
            </p>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-400 border border-primary/20 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-h3 font-bold text-foreground mb-3">{t('empty_title')}</h3>
            <p className="text-body text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('empty_text')}
            </p>
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Send className="h-5 w-5" />}
              onClick={handleContactClick}
            >
              {t('cta')}
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const item = items[current];
  const text = locale === 'en' ? item.text_en : item.text_ru;
  const role = locale === 'en' ? item.role_en : item.role_ru;
  const location = locale === 'en' ? item.location_en : item.location_ru;
  const name = locale === 'en' ? (item.name_en || item.name) : item.name;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-30 min-h-[80vh] flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <Container>
        {/* Заголовок */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="font-bold text-foreground mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {t('title')}
          </h2>
          <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Цитата с плавной сменой через AnimatePresence (blur + fade) */}
        <div
          className="max-w-4xl mx-auto text-center mb-12 relative min-h-[260px] sm:min-h-[300px] flex flex-col justify-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <Quote className="h-10 w-10 text-primary/40 mx-auto mb-6" aria-hidden="true" />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote
                className="font-medium text-foreground leading-relaxed mb-8 px-2 sm:px-0"
                style={{ fontSize: 'clamp(1.125rem, 2.4vw, 2rem)', lineHeight: 1.45 }}
              >
                {text}
              </blockquote>

              {/* Автор */}
              <footer className="not-italic">
                <div className="font-bold text-foreground text-base lg:text-lg">{name}</div>
                <div className="text-sm text-muted-foreground mt-1">{location}</div>
                <div className="text-sm text-primary mt-1 font-mono">{role}</div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Навигация: dots показываем только если 2+ отзывов */}
        {items.length > 1 && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-12">
            <button
              onClick={goPrev}
              className="p-3 rounded-full hover:bg-surface text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t('prev')}
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2 items-center" role="tablist">
              {items.map((it, i) => (
                <button
                  key={it.id}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`${i + 1} / ${items.length}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    i === current ? 'bg-primary w-8' : 'bg-primary/30 w-2 hover:bg-primary/60'
                  }`}
                  type="button"
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="p-3 rounded-full hover:bg-surface text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={t('next')}
              type="button"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Send className="h-5 w-5" />}
            onClick={handleContactClick}
          >
            {t('cta')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
