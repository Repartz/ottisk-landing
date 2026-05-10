# Control QA: Фазы 6-10

## Фаза 6: Портфолио

- [x] `components/sections/Portfolio.tsx`
  - Загрузка из Firebase Firestore (lazy, через `isFirebaseConfigured()`)
  - Fallback: `data/portfolio.json` (пустой массив)
  - Если данных нет — заглушка с CTA "Стать первым"
  - Horizontal scroll (GSAP pin + scrub) — только на md+ и без reduced-motion
  - Локализация title/description через locale из next-intl
- [x] `data/portfolio.json` создан (пустой массив)

## Фаза 7: Процесс

- [x] `components/sections/Process.tsx`
  - 5 шагов из `messages/{locale}.json` (process.steps.1-5)
  - Вертикальный SVG line с stroke draw анимацией (scrub)
  - Точки загораются с back.out(2)
  - Шаги слева/справа поочерёдно (на md+); на mobile — все слева
  - Семантический `<ol>` с `<li>` и нумерованными цифрами 01-05 моноширинным

## Фаза 8: Отзывы

- [x] `components/sections/Testimonials.tsx`
  - 9 отзывов из `config/content.json`
  - Полноэкранные цитаты, не карточки (ORYZO-стиль)
  - Анимация: слова появляются с stagger 0.015s
  - Автопрокрутка 9с (пауза при hover/focus)
  - Стрелки + dots + свайпы (touchstart/touchend)
  - aria-live="polite", role="tab" на dots
  - Локализация: text/role/location переключаются по locale

## Фаза 9: FAQ

- [x] `components/sections/FAQ.tsx`
  - 9 вопросов из `config/content.json`
  - Accordion: один открытый за раз (можно закрыть все)
  - Spring transition (cubic-bezier 0.34, 1.56, 0.64, 1) для height и chevron rotate
  - aria-expanded, aria-controls, aria-labelledby (useId)
  - h3 над button (правильная иерархия)
  - Локализация question/answer

## Фаза 10: Header + Footer

- [x] `components/layout/Header.tsx`
  - Smart Header: скрывается при скролле вниз, показывается при вверх
  - Прозрачный сверху, blur+border при scroll > 50px
  - Логотип `<Logo>` (отпечаток + текст "OTTISK")
  - Десктопная навигация (6 пунктов с link-underline)
  - Переключатель темы (dark → light → system → dark)
  - Переключатель языка (RU/EN, через next-intl router.replace)
  - CTA Telegram (только на sm+)
  - Мобильное меню: full-screen overlay, Escape, body scroll lock, animation
  - aria-expanded, aria-label на всех кнопках
- [x] `components/layout/Footer.tsx`
  - 3 колонки: бренд / sitemap / контакты
  - Логотип `<Logo size="lg">`
  - Sitemap с якорями и smooth scroll
  - Telegram-handle отображается из site.json
  - "Сделано с ♥ командой OTTISK"
  - Кнопка ↑ Top для возврата к Hero

## Тесты

- [x] `npm run build` — все 5 страниц генерируются (3 routes: _not-found, /ru (default), /en)
- [x] First Load JS: 275 kB (включая GSAP timelines, Framer Motion, все секции)
- [x] Исправлен баг: ThemeProvider теперь всегда оборачивает в Context (даже до hydration)

## Известные нюансы

- При первом рендере ThemeProvider использует дефолт `dark` → нет FOUC, тема корректна.
- Локализация: `next-intl` requestLocale — для статики все 2 локали prerender.
- Размер бандла можно сократить через code-splitting секций (lazy load), но пока это OK.
