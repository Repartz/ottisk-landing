'use client';

// ============================================
// SERVICES: Таблица спецификаций (ORYZO-стиль)
// - Чистая техническая таблица, не карточки
// - Линии рисуются при скролле (scaleX 0 → 1)
// - Строки появляются с stagger
// - Hover: подсветка строки + золотое название
// - Адаптив: на мобильных — стек карточек
// ============================================

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useTranslations, useLocale } from 'next-intl';
import { Send } from 'lucide-react';
import { useContactForm } from '@/components/effects/ContactFormProvider';
import contentConfig from '@/config/content.json';
import { prefersReducedMotion } from '@/lib/utils';
import { useExchangeRate, formatUsdPrice } from '@/hooks/useExchangeRate';

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('services');
  const locale = useLocale();
  const services = contentConfig.services.items;
  const contactForm = useContactForm();
  const exchangeRate = useExchangeRate();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = tableRef.current?.querySelectorAll('.spec-line');
      const rows = tableRef.current?.querySelectorAll('.spec-row');

      if (lines && lines.length > 0) {
        gsap.from(lines, {
          scaleX: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }

      if (rows && rows.length > 0) {
        gsap.from(rows, {
          opacity: 0,
          x: -16,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 78%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleContactClick = () => contactForm.open('services');

  // Локализованные значения
  const getDuration = (s: (typeof services)[number]) =>
    locale === 'en' ? s.duration_en : s.duration_ru;
  const getPrice = (s: (typeof services)[number]) => {
    if (locale === 'en') {
      // Конвертируем рублёвую цену в доллары по актуальному курсу
      return formatUsdPrice(s.price_ru, exchangeRate);
    }
    return s.price_ru;
  };

  return (
    <section ref={sectionRef} id="services" className="py-30">
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

        {/* Таблица спецификаций (десктоп) + список (мобильный) */}
        <div ref={tableRef} className="max-w-5xl mx-auto mb-10">
          {/* Заголовок таблицы — только на md+ */}
          <div className="hidden md:block">
            <div className="spec-line h-px bg-border mb-3" />
            <div className="grid grid-cols-12 gap-4 px-4 mb-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <div className="col-span-5">{t('table.service')}</div>
              <div className="col-span-2 text-center">{t('table.duration')}</div>
              <div className="col-span-2 text-center">{t('table.price')}</div>
              <div className="col-span-3 text-right">{t('table.stack')}</div>
            </div>
            <div className="spec-line h-px bg-border mb-2" />
          </div>

          {/* Строки */}
          {services.map((service) => (
            <div key={service.id}>
              {/* Десктоп: грид-таблица */}
              <div className="spec-row hidden md:grid grid-cols-12 gap-4 px-4 py-5 hover:bg-surface/40 transition-colors group">
                <div className="col-span-5">
                  <div className="text-foreground font-bold mb-1 group-hover:text-primary transition-colors">
                    {t(`items.${service.id}.title`)}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {t(`items.${service.id}.description`)}
                  </div>
                </div>
                <div className="col-span-2 text-center font-mono text-sm text-muted-foreground self-center">
                  {getDuration(service)}
                </div>
                <div className="col-span-2 text-center font-mono text-primary font-bold self-center">
                  {getPrice(service)}
                </div>
                <div className="col-span-3 text-right font-mono text-xs text-muted-foreground self-center">
                  {service.stack}
                </div>
              </div>

              {/* Мобильный: карточка */}
              <div className="spec-row md:hidden py-5 px-2">
                <div className="text-foreground font-bold mb-2">
                  {t(`items.${service.id}.title`)}
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {t(`items.${service.id}.description`)}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground uppercase tracking-wider">
                      {t('table.duration')}:{' '}
                    </span>
                    <span className="text-foreground">{getDuration(service)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground uppercase tracking-wider">
                      {t('table.price')}:{' '}
                    </span>
                    <span className="text-primary font-bold">{getPrice(service)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground uppercase tracking-wider">
                      {t('table.stack')}:{' '}
                    </span>
                    <span className="text-foreground">{service.stack}</span>
                  </div>
                </div>
              </div>
              <div className="spec-line h-px bg-border/40" />
            </div>
          ))}
        </div>

        {/* Дисклеймер */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto mb-10 font-mono leading-relaxed">
          {t('disclaimer')}
        </p>

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
