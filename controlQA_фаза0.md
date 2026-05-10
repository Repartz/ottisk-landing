# Control QA: Фаза 0 — Архитектура и конфигурация

## Что реализовано

- [x] `package.json` с актуальными зависимостями (Next.js 14, React 18, TypeScript 5)
- [x] Установлены: gsap, framer-motion, three, @react-three/fiber, @react-three/drei, next-intl, firebase, lucide-react, clsx, tailwind-merge
- [x] `tsconfig.json` со strict-режимом
- [x] `tailwind.config.ts` с полной палитрой OTTISK (тёплые тона, primary `#C4A962`)
- [x] `postcss.config.js`
- [x] `next.config.js` с `next-intl` плагином
- [x] `.env.example` и `.env.local` (Firebase + Yandex.Metrika — пока пустые, подключим в финале)
- [x] `.gitignore`
- [x] `Makefile` (install / dev / build / start / lint / clean / all)
- [x] `i18n.ts` (RU default, EN опциональная)
- [x] `middleware.ts` с `localePrefix: 'as-needed'`
- [x] `navigation.ts` (createSharedPathnamesNavigation)
- [x] `messages/ru.json` и `messages/en.json` (полные)
- [x] `config/theme.json`, `config/site.json`, `config/content.json` (с _comment полями)
- [x] `types/index.ts` (Service, Testimonial, FAQItem, PortfolioItem, ProcessStep, SiteConfig, Theme, Locale)
- [x] `lib/utils.ts` (cn, formatNumber, delay, prefersReducedMotion)
- [x] `lib/gsap.ts` (регистрация ScrollTrigger; SplitText заменён кастомной реализацией)
- [x] `lib/firebase.ts` (lazy-инициализация, fallback при отсутствии ключей)
- [x] Создана структура директорий: `app/[locale]/`, `app/api/admin/login/`, `components/{ui,layout,sections,animations,effects,admin}/`, `hooks/`, `lib/`, `config/`, `messages/`, `data/`, `types/`, `public/{photos,videos,icons}/`

## Уточнения от заказчика учтены

- ✅ FAQ оставлен (Phase 9)
- ✅ DESIGN_RULES имеет приоритет: только Manrope + JetBrains Mono, никакого `font-serif italic`
- ✅ Видео для Hero (fingerprint-loop.mp4 + hero-background.mp4) — на месте в `public/videos/`
- ✅ Проект внутри `ottisk-site/`
- ✅ Firebase + Яндекс.Метрика — плейсхолдеры, подключим в финале
- ✅ SplitText заменён кастомным split (избегаем платный плагин)
- ✅ Логотип в `public/photos/logo.jpeg` — будет адаптирован

## Тесты

- [ ] `npm run build` (запустим после Фазы 1 — нужны page.tsx и layout.tsx)
- [ ] `npm run dev` (то же)

## Известные нюансы

- Next.js 14.2.18 имеет security warning. Обновим до 14.2.x latest в финальной фазе.
- `lib/firebase.ts` корректно обрабатывает отсутствие ключей (возвращает null) — компоненты должны использовать `getDb()` и проверять на null.
