// ============================================
// I18N: Конфигурация next-intl
// Поддерживаемые локали: RU (default), EN
// ============================================

import { getRequestConfig } from 'next-intl/server';

export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale возвращает Promise<string | undefined>
  const requested = await requestLocale;
  const resolvedLocale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
    timeZone: 'Europe/Moscow',
    now: new Date(),
  };
});
