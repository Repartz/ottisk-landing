// ============================================
// NAVIGATION: Локализованные ссылки и роутер для next-intl
// ============================================

import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from './i18n';

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix: 'as-needed' });
