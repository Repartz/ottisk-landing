'use client';

// ============================================
// PORTFOLIO: Презентабельная секция портфолио
// - Загрузка из Firebase Firestore (если настроен)
// - Карточки с premium hover-эффектами (parallax image, glow, reveal текста)
// - GSAP horizontal scroll внутри pinned section (только на десктопе при 2+ карточках)
// - Stagger reveal при появлении в viewport
// - Если есть link — карточка кликабельна (новая вкладка)
// ============================================

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useTranslations, useLocale } from 'next-intl';
import { Send, Plus, ArrowUpRight, FolderOpen, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reachGoal } from '@/lib/analytics';
import { useContactForm } from '@/components/effects/ContactFormProvider';
import type { PortfolioItem } from '@/types';
import portfolioFallback from '@/data/portfolio.json';
import { getDb, isFirebaseConfigured } from '@/lib/firebase';
import { prefersReducedMotion } from '@/lib/utils';

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<PortfolioItem[]>(portfolioFallback as PortfolioItem[]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const t = useTranslations('portfolio');
  const locale = useLocale();
  const contactForm = useContactForm();

  // Загрузка из Firebase
  useEffect(() => {
    let cancelled = false;
    async function loadPortfolio() {
      if (!isFirebaseConfigured()) {
        setIsLoaded(true);
        return;
      }
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const db = getDb();
        if (!db) {
          setIsLoaded(true);
          return;
        }
        const snapshot = await getDocs(collection(db, 'portfolio'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PortfolioItem[];
        if (!cancelled && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.error('[Portfolio] Firebase load error', err);
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    }
    loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, []);

  // Анимация заголовка
  useEffect(() => {
    if (prefersReducedMotion() || !headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Stagger reveal карточек при появлении
  useEffect(() => {
    if (prefersReducedMotion() || items.length === 0 || !scrollRef.current) return;
    const ctx = gsap.context(() => {
      const cards = scrollRef.current!.querySelectorAll<HTMLElement>('.portfolio-card');
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: scrollRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [items]);

  // Horizontal scroll с pin: только если 2+ карточки и контент шире viewport
  useEffect(() => {
    if (
      items.length === 0 ||
      !triggerRef.current ||
      !scrollRef.current ||
      prefersReducedMotion()
    ) {
      return;
    }
    const mq = window.matchMedia('(min-width: 768px)');
    if (!mq.matches) return;

    const scrollEl = scrollRef.current;
    const distance = scrollEl.scrollWidth - window.innerWidth;
    if (items.length < 2 || distance < 100) return;

    const ctx = gsap.context(() => {
      gsap.to(scrollEl, {
        x: () => -(scrollEl.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => `+=${scrollEl.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [items]);

  const handleContactClick = () => contactForm.open('portfolio');

  const handleProjectClick = (item: PortfolioItem) => {
    reachGoal('portfolio_project_click', { id: item.id });
    setSelectedItem(item);
  };

  const getTitle = (item: PortfolioItem) =>
    locale === 'en' ? item.title.en : item.title.ru;
  const getDesc = (item: PortfolioItem) =>
    locale === 'en' ? item.description.en : item.description.ru;

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="py-30 overflow-hidden"
      aria-labelledby="portfolio-title"
    >
      <Container className="mb-12 lg:mb-16">
        <div ref={headerRef} className="text-center">
          <h2
            id="portfolio-title"
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
      </Container>

      <div ref={triggerRef} className="relative">
        {items.length > 0 ? (
          <div
            ref={scrollRef}
            className={
              items.length >= 2
                ? 'flex gap-8 px-4 sm:px-8 lg:px-16 will-change-transform'
                : 'flex gap-8 justify-center px-4 sm:px-8 lg:px-16 flex-wrap'
            }
            style={items.length >= 2 ? { width: 'max-content' } : undefined}
          >
            {items.map((item, index) => (
              <PortfolioCard
                key={item.id}
                item={item}
                index={index}
                title={getTitle(item)}
                description={getDesc(item)}
                openLabel={t('open_project')}
                onClick={() => handleProjectClick(item)}
              />
            ))}
          </div>
        ) : (
          <Container>
            <div className="text-center py-16 lg:py-24" aria-busy={!isLoaded}>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-secondary-400 border border-primary/20 mb-8">
                <Plus className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-h3 lg:text-h2 font-bold text-foreground mb-3">
                {t('empty_title')}
              </h3>
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
        )}
      </div>

      {/* Модалка детального просмотра кейса */}
      <PortfolioModal
        item={selectedItem}
        locale={locale}
        onClose={() => setSelectedItem(null)}
        onContact={() => { setSelectedItem(null); contactForm.open('portfolio'); }}
        t={t}
      />
    </section>
  );
}

// ============================================
// PortfolioCard: одна карточка проекта с премиум hover-эффектами
// - Зум изображения (scale 1.08) с медленным easing
// - Парallax overlay с тегами
// - Glow border при hover
// - "→" бейдж если есть link
// ============================================
interface PortfolioCardProps {
  item: PortfolioItem;
  index: number;
  title: string;
  description: string;
  openLabel: string;
  onClick: () => void;
}

function PortfolioCard({ item, title, description, openLabel, onClick }: PortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt-эффект на mousemove (только для устройств с тонким контролем)
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer || prefersReducedMotion()) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--tilt-x', `${y * -6}deg`);
      el.style.setProperty('--tilt-y', `${x * 6}deg`);
    };
    const handleLeave = () => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const InnerCard = (
    <div
      ref={cardRef}
      className="portfolio-card w-full sm:w-[420px] lg:w-[520px] max-w-[600px] flex-shrink-0 group"
      style={{
        transform: 'perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s ease-out',
      }}
    >
      <div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-secondary border border-border transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-glow-gold"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.08]"
            loading="lazy"
            style={{ transform: 'translateZ(20px)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-secondary-400 via-tertiary to-neutral-500">
            <FolderOpen className="h-20 w-20 opacity-20" />
          </div>
        )}

        {/* Тёмный градиент снизу — всегда виден легко, при hover усиливается */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(180deg, transparent 40%, rgba(20,18,16,0.4) 70%, rgba(20,18,16,0.85) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Бейдж "Открыть проект" при hover (если есть link) */}
        {item.link && (
          <div
            className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-neutral-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>{openLabel}</span>
          </div>
        )}

        {/* Теги поверх изображения снизу */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-mono bg-neutral-500/80 backdrop-blur-md text-primary rounded-full border border-primary/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Текст под карточкой */}
      <div className="px-1">
        <h3 className="text-h3 font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300 flex items-baseline gap-2">
          <span>{title}</span>
          {item.link && (
            <ArrowUpRight
              className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
              aria-hidden="true"
            />
          )}
        </h3>
        <p className="text-body text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );

  // Карточка всегда открывает модалку детального просмотра
  return (
    <button
      type="button"
      onClick={onClick}
      className="block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
      aria-label={title}
    >
      {InnerCard}
    </button>
  );
}

// ============================================
// PortfolioModal: детальный просмотр кейса
// Галерея фото с переключением, полный текст, теги, ссылка
// ============================================
function PortfolioModal({
  item,
  locale,
  onClose,
  onContact,
  t,
}: {
  item: PortfolioItem | null;
  locale: string;
  onClose: () => void;
  onContact: () => void;
  t: ReturnType<typeof useTranslations<'portfolio'>>;
}) {
  const [photoIdx, setPhotoIdx] = useState(0);

  // Сброс индекса при открытии нового кейса
  useEffect(() => { setPhotoIdx(0); }, [item?.id]);

  // Собираем все фото: images[] если есть, иначе image
  const photos: string[] = item?.images?.length ? item.images : item?.image ? [item.image] : [];
  const photosLen = photos.length;

  // Блокируем скролл страницы + клавиши навигации
  useEffect(() => {
    if (!item) return;
    const y = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && photosLen > 1) setPhotoIdx((i) => (i + 1) % photosLen);
      if (e.key === 'ArrowLeft' && photosLen > 1) setPhotoIdx((i) => (i - 1 + photosLen) % photosLen);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, y);
      document.removeEventListener('keydown', onKey);
    };
  }, [item, onClose, photosLen]);

  if (!item) return null;

  const title = locale === 'en' ? item.title.en : item.title.ru;
  const description = locale === 'en' ? item.description.en : item.description.ru;

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Скроллящийся контейнер */}
          <div
            className="fixed inset-0 z-[201] overflow-y-scroll"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="flex min-h-full items-start justify-center p-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.97 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-card rounded-2xl sm:rounded-3xl border border-border shadow-glow-gold overflow-hidden"
              >
                {/* Кнопка закрыть */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-neutral-500/60 hover:bg-neutral-500 text-white transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Галерея фото */}
                {photos.length > 0 && (
                  <div className="relative aspect-[16/9] bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photos[photoIdx]}
                      alt={`${title} — фото ${photoIdx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Стрелки навигации — только если фото > 1 */}
                    {photos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                          aria-label="Предыдущее фото"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                          aria-label="Следующее фото"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Счётчик и точки */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                          {photos.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setPhotoIdx(i)}
                              className={`h-1.5 rounded-full transition-all ${i === photoIdx ? 'bg-primary w-5' : 'bg-white/50 w-1.5 hover:bg-white/80'}`}
                              aria-label={`Фото ${i + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Миниатюры */}
                    {photos.length > 1 && (
                      <div className="absolute bottom-0 left-0 right-0 flex gap-2 px-4 pb-10 pt-2 overflow-x-auto scrollbar-hidden">
                        {photos.map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setPhotoIdx(i)}
                            className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === photoIdx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Контент */}
                <div className="p-6 sm:p-8">
                  {/* Теги */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{title}</h2>

                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap mb-6">
                    {description}
                  </p>

                  {/* Кнопки */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      leftIcon={<Send className="h-4 w-4" />}
                      onClick={onContact}
                      className="flex-1"
                    >
                      {t('cta')}
                    </Button>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-foreground hover:border-primary/40 hover:text-primary transition-all text-base font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t('open_project')}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
