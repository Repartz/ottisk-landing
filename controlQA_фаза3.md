# Control QA: Фаза 3 — Прелоадер и Hero

## Что реализовано

### Прелоадер
- [x] `components/animations/Preloader.tsx` — SVG Fingerprint stroke reveal
  - Stroke draw анимация (stroke-dasharray + stroke-dashoffset)
  - Drop-shadow золотое свечение через filter
  - Elastic "постановка" (scale 0.95 → 1.0 с elastic.out)
  - Fade-out + zoom 1.4x при завершении
  - Минимальная длительность ~2.2с (первый визит) / ~600мс (повторный)
  - Уважение `prefers-reduced-motion` (мгновенное завершение)
  - sessionStorage `ottisk-visited` для пропуска повторного запуска
- [x] `components/animations/PreloaderGate.tsx` — обёртка, блокирует scroll body во время загрузки

### Hero
- [x] `components/sections/Hero.tsx` — полноэкранный первый экран
  - Видео-фон `public/videos/fingerprint-loop.mp4` (autoplay, muted, loop, playsInline, preload="metadata", poster=og-image)
  - Радиальный градиентный оверлей (затемнение к низу)
  - Гигантское "OTTISK" — clamp(4rem, 14vw, 11rem), kinetic typography по символам
  - Подзаголовок моноширинным шрифтом с tracking-[0.35em] uppercase
  - Описание (description из messages)
  - Две CTA: "Написать в Telegram" (primary) и "Смотреть портфолио" (ghost, скролл к about)
  - Скролл-индикатор: ArrowDown с animate-bounce, кликабельный
  - GSAP скролл-анимация: видео затухает, заголовок поднимается + сжимается, индикатор исчезает
  - Custom split (без платного SplitText): `text.split('').map(...)`
  - aria-hidden на видео и декоративных символах
  - Аналитика: `reachGoal('telegram_click_hero')` при клике
  - URL Telegram из `config/site.json`

## Тесты

- [x] `npm run build` — успешно
- [x] `npm run dev` — запускается, GET / возвращает 200
- [x] `/videos/fingerprint-loop.mp4` отдаётся (13.4 MB, video/mp4)
- [x] `/icons/logo.svg`, `/icons/favicon.svg` отдаются
- [x] HTML содержит OTTISK, Telegram, videos/fingerprint
- [x] Размер /[locale] увеличился до 70.7 kB (за счёт GSAP timeline + Framer Motion)

## Аспекты дизайна (по DESIGN_RULES)

- ✅ Только Manrope + JetBrains Mono (никаких других шрифтов)
- ✅ Цвета только из палитры (primary, neutral-500, t60, foreground)
- ✅ Заголовок UPPERCASE с letter-spacing -0.04em
- ✅ Скролл-индикатор золотой
- ✅ Видео затемнено (opacity 0.45)
- ✅ Кнопки — rounded-full (через Button component)

## a11y чек-лист

- [x] Hero h1 единственный на странице
- [x] sr-only содержит полный текст "OTTISK" для скринридеров
- [x] Видео имеет aria-hidden
- [x] Скролл-индикатор — кнопка с aria-label
- [x] Кнопки имеют визуальный focus (focus-visible ring)
- [x] prefers-reduced-motion уважается (анимации пропускаются)
- [x] Telegram открывается в новом окне с rel="noopener,noreferrer"

## Известные нюансы

- Видео большое (13.4 MB) — на медленном интернете может загружаться долго. На прод стоит сжать до 5-7 MB через ffmpeg или CDN.
- Прелоадер показывается каждую сессию (sessionStorage). Это специально — каждый раз эффект "wow".
