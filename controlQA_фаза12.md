# Control QA: Фаза 12 — SEO, метрика, деплой

## Что реализовано

### Sitemap
- [x] `app/sitemap.ts` — `MetadataRoute.Sitemap` подход
  - `/` (RU, priority 1.0) с hreflang альтернативами
  - `/en` (EN, priority 0.9)
  - `lastModified` обновляется на каждом билде
  - Доступен по `/sitemap.xml`

### Robots
- [x] `app/robots.ts` — `MetadataRoute.Robots` подход
  - `Allow: /` (всё индексируется)
  - `Disallow: /admin`, `/admin/*`, `/en/admin`, `/en/admin/*`, `/api/`
  - `Sitemap: ...sitemap.xml`
  - `Host: ...`
  - Доступен по `/robots.txt`

### Schema.org
- [x] В `app/[locale]/layout.tsx` — JSON-LD `Organization`
  - `@type: Organization`
  - name, description (локализованное), url, logo
  - sameAs: [Telegram]
  - contactPoint с availableLanguage [Russian, English]
  - foundingDate из site.json

### Метаданные
- [x] `generateMetadata` в локализованном layout
  - title и description из `messages/{locale}.json` (metadata namespace)
  - alternates.canonical (`/` для RU, `/en` для EN)
  - alternates.languages с x-default
- [x] OG-теги, Twitter Card в root layout (Фаза 1)
- [x] Иконки (favicon SVG / 16 / 32 / Apple Touch) в root layout

### Метрика
- [x] `lib/analytics.tsx` — Яндекс.Метрика
  - Lazy: подключается только если `NEXT_PUBLIC_YANDEX_METRIKA_ID` задан
  - clickmap, trackLinks, accurateTrackBounce, webvisor включены
  - `<noscript>` fallback с пиксельным изображением
  - `reachGoal` хелпер используется во всех CTA
- [x] Цели аналитики:
  - `telegram_click_hero`
  - `telegram_click_services`
  - `telegram_click_portfolio`
  - `telegram_click_testimonials`
  - `telegram_click_header`
  - `telegram_click_footer`

## Проверки (smoke)

| URL | Содержимое |
|-----|-----------|
| `/sitemap.xml` | XML с urlset, alternate hreflang ✅ |
| `/robots.txt` | Allow + Disallow + Sitemap + Host ✅ |
| `/` HTML | Schema.org JSON-LD inlined ✅ |
| `npm run build` | sitemap.xml и robots.txt сгенерированы ✅ |

## Деплой

Подготовка к Vercel:
- [x] `next.config.js` готов (next-intl plugin)
- [x] Все env-переменные в `.env.example`
- [ ] `vercel.json` — не требуется (используем дефолты Next.js на Vercel)
- [x] Билд проходит без ошибок и warning'ов

### Инструкция по деплою
1. Создать репозиторий на GitHub
2. Подключить в Vercel Dashboard
3. Скопировать переменные из `.env.local` в Vercel Project Settings → Environment Variables (когда будут реальные ключи)
4. Деплой автоматический при push в main

## TODO для финальной фазы

- Подключить реальный Firebase (создать проект, скопировать ключи в .env)
- Подключить Яндекс.Метрика (создать счётчик, скопировать ID)
- Покупка домена и обновление NEXT_PUBLIC_SITE_URL
- Финальный QA-чеклист
