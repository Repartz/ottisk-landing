// ============================================
// LOCALE LAYOUT: Обёртка для локализованных маршрутов
// Подгружает messages из messages/{locale}.json
// и оборачивает в NextIntlClientProvider
// ============================================

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales } from '@/i18n';
import siteConfig from '@/config/site.json';
import { ContactFormProvider } from '@/components/effects/ContactFormProvider';
import { CookieBanner } from '@/components/effects/CookieBanner';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'ru' ? '/' : `/${locale}`,
      languages: {
        ru: '/',
        en: '/en',
        'x-default': '/',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // Включает статический рендеринг (если возможно)
  setRequestLocale(locale);

  const messages = await getMessages();

  // Schema.org: Organization
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description:
      locale === 'en'
        ? siteConfig.company.description_en
        : siteConfig.company.description_ru,
    url: process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url}/icons/logo.svg`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Russian', 'English'],
        url: siteConfig.telegram,
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: siteConfig.phone,
        email: siteConfig.email_address,
        availableLanguage: ['Russian', 'English'],
        url: siteConfig.whatsapp_link,
      },
    ],
    sameAs: [siteConfig.telegram, siteConfig.whatsapp_link],
    email: siteConfig.email_address,
    telephone: siteConfig.phone,
    foundingDate: siteConfig.company.founded,
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <ContactFormProvider>{children}</ContactFormProvider>
      <CookieBanner />
    </NextIntlClientProvider>
  );
}
