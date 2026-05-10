'use client';

// ============================================
// FAQ: Accordion с spring-физикой
// - 9 вопросов из config/content.json
// - Один открытый за раз (можно отдельно открывать/закрывать)
// - Spring transition (cubic-bezier) для max-height
// ============================================

import { useState, useEffect, useRef, useId } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Container } from '@/components/layout/Container';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn, prefersReducedMotion } from '@/lib/utils';
import contentConfig from '@/config/content.json';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const panelId = useId();
  const buttonId = useId();

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, answer]);

  return (
    <div className="border-b border-border last:border-b-0">
      <h3>
        <button
          id={buttonId}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-6 py-6 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-md"
          aria-expanded={isOpen}
          aria-controls={panelId}
          type="button"
        >
          <span className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground pr-2 group-hover:text-primary transition-colors duration-300">
            {question}
          </span>
          <ChevronDown
            className={cn(
              'h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-primary transition-transform duration-500',
              isOpen && 'rotate-180'
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-all duration-500"
        style={{
          height,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div ref={contentRef} className="pb-6 pr-8">
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('faq');
  const locale = useLocale();
  const items = contentConfig.faq.items;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const elements = listRef.current?.querySelectorAll('.faq-item');
      if (!elements || elements.length === 0) return;

      gsap.from(elements, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="py-30">
      <Container size="narrow">
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

        {/* Список вопросов */}
        <div ref={listRef}>
          {items.map((item) => {
            const question = locale === 'en' ? item.question_en : item.question_ru;
            const answer = locale === 'en' ? item.answer_en : item.answer_ru;
            return (
              <div key={item.id} className="faq-item">
                <FAQItem
                  question={question}
                  answer={answer}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
