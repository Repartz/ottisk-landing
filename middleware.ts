// ============================================
// MIDDLEWARE: Перенаправление по локалям + защита /admin
// localePrefix: 'as-needed' — / для RU (default), /en для EN
// /admin/* (кроме /admin/login) защищён через cookie admin_session
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

// Проверка путей, требующих админ-сессии (любая локаль)
const ADMIN_PATH_REGEX = /^\/(?:en\/)?admin(?:\/(.*))?$/;
const ADMIN_LOGIN_PATH_REGEX = /^\/(?:en\/)?admin\/login\/?$/;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Защита /admin/*
  if (ADMIN_PATH_REGEX.test(pathname) && !ADMIN_LOGIN_PATH_REGEX.test(pathname)) {
    const isAuth = request.cookies.get('admin_session')?.value === '1';
    if (!isAuth) {
      const loginUrl = pathname.startsWith('/en')
        ? new URL('/en/admin/login', request.url)
        : new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Игнорируем API и статику. Всё остальное — обрабатываем (локали + защита админки).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
