// ============================================
// ROBOTS.TXT: Настройка индексации
// Главная — индексируется. /admin и /api — закрыты.
// ============================================

import { MetadataRoute } from 'next';
import siteConfig from '@/config/site.json';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/en/admin', '/en/admin/*', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
