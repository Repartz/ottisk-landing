// ============================================
// КОРНЕВОЙ LAYOUT: html/body, шрифты, ThemeProvider, аналитика
// Локализованный контент рендерится через app/[locale]/layout.tsx
// ============================================

import type { Metadata, Viewport } from 'next';
import { Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/effects/ThemeProvider';
import { GrainOverlay } from '@/components/effects/GrainOverlay';
import { Analytics } from '@/lib/analytics';
import siteConfig from '@/config/site.json';

// Основной шрифт — современный гротеск
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Моноширинный — для технических акцентов
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#141210' },
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'OTTISK — Оставляем отпечаток в истории',
    template: '%s | OTTISK',
  },
  description:
    'Команда веб-разработки. Чистый код, честное отношение, результат. Телеграм-боты, сайты, приложения.',
  keywords: [
    'веб-разработка',
    'телеграм боты',
    'сайты',
    'лендинги',
    'приложения',
    'OTTISK',
    'чистый код',
  ],
  authors: [{ name: 'OTTISK Team' }],
  creator: 'OTTISK',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: 'en_US',
    url: '/',
    siteName: 'OTTISK',
    title: 'OTTISK — Оставляем отпечаток в истории',
    description: 'Команда веб-разработки. Чистый код, честное отношение, результат.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OTTISK — команда веб-разработки',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTTISK — Оставляем отпечаток в истории',
    description: 'Команда веб-разработки. Чистый код, честное отношение, результат.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${jetbrainsMono.variable} dark`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <GrainOverlay />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
