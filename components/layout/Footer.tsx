'use client';

// ============================================
// FOOTER: Подвал
// - Логотип + копирайт
// - Карта сайта (якоря, плавный скролл через Lenis)
// - 3 контакта: Telegram, WhatsApp, Email — каждый клик ведёт прямо в нужную соцсеть
// - Большая CTA-кнопка "Оставить заявку" → открывает ContactForm
// - Скрытый вход в админку: двойной клик по ♥
// ============================================

import { useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/navigation';
import Link from 'next/link';
import { Send, Heart, Mail } from 'lucide-react';
import { reachGoal } from '@/lib/analytics';
import { scrollToId } from '@/lib/scroll';
import { useContactForm } from '@/components/effects/ContactFormProvider';
import siteConfig from '@/config/site.json';

const SITEMAP_KEYS = ['about', 'services', 'portfolio', 'process', 'testimonials', 'faq'] as const;

const ADMIN_DOUBLECLICK_MS = 600;

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tContacts = useTranslations('contacts');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const locale = useLocale();
  const contactForm = useContactForm();
  const privacyHref = locale === 'ru' ? '/privacy' : '/en/privacy';

  const heartClicksRef = useRef(0);
  const heartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSitemapClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    scrollToId(hash);
  };

  const handleTelegramClick = () => {
    reachGoal('telegram_click_footer');
    window.open(siteConfig.telegram, '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = () => {
    reachGoal('email_click_footer');
    window.location.href = siteConfig.email_link;
  };

  const handleHeartClick = () => {
    heartClicksRef.current += 1;
    if (heartTimerRef.current) clearTimeout(heartTimerRef.current);
    if (heartClicksRef.current >= 2) {
      heartClicksRef.current = 0;
      router.push('/admin/login');
      return;
    }
    heartTimerRef.current = setTimeout(() => {
      heartClicksRef.current = 0;
    }, ADMIN_DOUBLECLICK_MS);
  };

  return (
    <footer id="contact" className="border-t border-border py-12 lg:py-16 mt-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-10">
          {/* Бренд */}
          <div>
            <Logo variant="full" size="lg" svgId="footer" />
            <p className="text-sm text-muted-foreground mt-4 max-w-xs">{t('copyright')}</p>
            <Button
              variant="primary"
              size="md"
              className="mt-6"
              leftIcon={<Send className="h-4 w-4" />}
              onClick={() => contactForm.open('footer_cta')}
            >
              {t('cta_primary')}
            </Button>
          </div>

          {/* Sitemap */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider font-mono">
              {t('sitemap')}
            </h4>
            <nav className="grid grid-cols-2 gap-2">
              {SITEMAP_KEYS.map((key) => (
                <a
                  key={key}
                  href={`#${key}`}
                  onClick={(e) => handleSitemapClick(e, key)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {tNav(key)}
                </a>
              ))}
            </nav>
          </div>

          {/* Контакты: 3 канала, прямые переходы */}
          <div>
            <h4 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider font-mono">
              {t('contact')}
            </h4>
            <ul className="flex flex-col gap-3 items-start">
              <li className="w-full">
                <button
                  onClick={handleTelegramClick}
                  className="group flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded text-left"
                  type="button"
                  aria-label={tCommon('open_telegram')}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-left">
                    <span className="block text-xs text-muted-foreground font-mono uppercase tracking-wider">
                      {tContacts('telegram_label')}
                    </span>
                    <span className="block">{siteConfig.telegram_handle}</span>
                  </span>
                </button>
              </li>
              <li className="w-full">
                <button
                  onClick={handleEmailClick}
                  className="group flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded text-left"
                  type="button"
                  aria-label={tCommon('open_email')}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-left">
                    <span className="block text-xs text-muted-foreground font-mono uppercase tracking-wider">
                      {tContacts('email_label')}
                    </span>
                    <span className="block break-all">{siteConfig.email_address}</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <p className="text-xs sm:text-sm text-muted-foreground inline-flex items-center gap-1.5">
              {t('made_with')}{' '}
              <button
                type="button"
                onClick={handleHeartClick}
                title="."
                aria-label="."
                className="inline-flex items-center justify-center align-middle rounded-sm transition-transform duration-300 hover:scale-125 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
              >
                <Heart className="h-3 w-3 text-primary fill-primary transition-all duration-300 hover:drop-shadow-[0_0_6px_rgba(196,169,98,0.7)]" />
              </button>{' '}
              {t('by')}
            </p>
            <Link
              href={privacyHref}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              {t('privacy')}
            </Link>
          </div>
          <a
            href="#hero"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={(e) => handleSitemapClick(e, 'hero')}
          >
            ↑ Top
          </a>
        </div>
      </Container>
    </footer>
  );
}
