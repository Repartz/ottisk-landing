# Control QA: Фаза 1 — Базовая структура

## Что реализовано

- [x] `app/layout.tsx` — корневой layout с шрифтами Manrope + JetBrains Mono, метаданными, OG, Twitter, viewport, темой
- [x] `app/[locale]/layout.tsx` — локализованный layout с NextIntlClientProvider, generateStaticParams для RU/EN
- [x] `app/[locale]/page.tsx` — главная страница (сборка секций-заглушек)
- [x] `app/globals.css` — глобальные стили: CSS-переменные тем (dark/light), скроллбар, grain-overlay, link-underline, scrollbar-hidden, prefers-reduced-motion
- [x] `components/effects/ThemeProvider.tsx` — провайдер тёмной/светлой/системной темы с localStorage и предотвращением FOUC
- [x] `components/effects/GrainOverlay.tsx` — фиксированный шум поверх (с `mix-blend-mode: overlay`)
- [x] `lib/analytics.tsx` — Яндекс.Метрика (вставка только при наличии ID) + хелпер `reachGoal`
- [x] Заглушки секций: Hero, About, Services, Portfolio, Process, Testimonials, FAQ, Header, Footer
- [x] Container компонент (narrow / default / wide размеры)
- [x] `i18n.ts` обновлён под `requestLocale` (next-intl 3.22+)

## Тесты

- [x] `npm run build` — успешно компилируется
- [x] `npm run dev` запускается за 1.4с
- [x] `GET /` → HTTP 200 (RU дефолт)
- [x] `GET /en` → HTTP 200 (EN)
- [x] `GET /ru` → HTTP 307 → редирект на `/` (localePrefix: as-needed работает)
- [x] HTML рендерится с правильными meta-tags (title, description, OG)
- [x] `class="dark"` применён к `<html>` (тёмная тема по умолчанию)
- [x] Шрифты Manrope и JetBrains Mono инжектированы как CSS-переменные

## Деталях реализации

- Используется `localePrefix: 'as-needed'` — для дефолтной локали (RU) URL без префикса
- ThemeProvider предотвращает FOUC через `visibility: hidden` до hydration
- Аналитика lazy: если нет `NEXT_PUBLIC_YANDEX_METRIKA_ID` — script не вставляется
- Все API маршруты (`/api/*`) исключены из локализации в `middleware.ts`

## Известные нюансы / TODO для следующих фаз

- Заглушки секций нужно заполнить реальной функциональностью (Фазы 3-9)
- Header/Footer заглушки — функциональность в Фазе 10
- Favicon `/icons/favicon.svg` пока отсутствует — добавим в Фазе 12
- OG-image `/og-image.jpg` пока отсутствует — добавим в Фазе 12
