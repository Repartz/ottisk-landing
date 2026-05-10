// ============================================
// SITEMAP: Карта сайта для поисковиков
// Генерируется на этапе билда. Доступна по /sitemap.xml
// ============================================

import { MetadataRoute } from 'next';
import siteConfig from '@/config/site.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          ru: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
