'use client';

// ============================================
// HEADER: Smart Header
// - Скрывается при скролле вниз, появляется при скролле вверх
// - Прозрачный сверху, blur на скролле
// - Переключатель темы (sun/moon)
// - Переключатель языка (RU / EN)
// - Десктоп: горизонтальная навигация
// - Мобильный: full-screen меню
// ============================================

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { Menu, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { scrollToId } from '@/lib/scroll';
import { useContactForm } from '@/components/effects/ContactFormProvider';

const NAV_ITEMS = [
  { href: 'about', labelKey: 'about' },
  { href: 'services', labelKey: 'services' },
  { href: 'portfolio', labelKey: 'portfolio' },
  { href: 'process', labelKey: 'process' },
  { href: 'testimonials', labelKey: 'testimonials' },
  { href: 'faq', labelKey: 'faq' },
] as const;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const contactForm = useContactForm();

  // Smart header: скрытие при скролле вниз, показ при скролле вверх
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY && y > 100 && !isMobileMenuOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setIsScrolled(y > 50);
      setLastScrollY(y);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  // Закрытие моб. меню по Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileMenuOpen]);

  // Ctrl+Shift+A → переход в админку (скрытая комбинация)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const adminPath = locale === 'ru' ? '/admin' : `/${locale}/admin`;
        window.location.href = adminPath;
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [locale]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    scrollToId(hash);
    // Обновим hash без перезагрузки
    window.history.replaceState(null, '', `#${hash}`);
  };

  const handleContactClick = () => {
    setIsMobileMenuOpen(false);
    contactForm.open('header');
  };

  const toggleLocale = () => {
    const next = locale === 'ru' ? 'en' : 'ru';
    router.replace(pathname, { locale: next });
  };



  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
        )}
      >
        <div className="container-ottisk flex items-center justify-between h-16 lg:h-20">
          {/* Логотип */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            aria-label="OTTISK"
          >
            <Logo variant="full" size="md" svgId="header" />
          </a>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className="link-underline text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-primary"
              >
                {t(item.labelKey)}
              </a>
            ))}
          </nav>

          {/* Правые элементы */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Переключатель языка */}
            <button
              onClick={toggleLocale}
              className="px-3 py-1.5 text-xs font-mono font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              aria-label={tCommon('toggle_locale')}
              type="button"
            >
              {locale === 'ru' ? 'RU/EN' : 'EN/RU'}
            </button>

            {/* CTA "Оставить заявку" */}
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:flex"
              leftIcon={<Send className="h-4 w-4" />}
              onClick={handleContactClick}
            >
              {tCommon('cta_contact')}
            </Button>

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={tCommon('menu')}
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-opacity duration-500 lg:hidden',
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-6 px-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-2xl sm:text-3xl font-bold text-foreground hover:text-primary transition-colors"
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              {t(item.labelKey)}
            </a>
          ))}
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Send className="h-5 w-5" />}
            onClick={handleContactClick}
            tabIndex={isMobileMenuOpen ? 0 : -1}
            className="mt-4"
          >
            {tCommon('cta_contact')}
          </Button>
        </nav>
      </div>
    </>
  );
}
