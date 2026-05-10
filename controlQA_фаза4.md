# Control QA: Фаза 4 — О нас

## Что реализовано

- [x] `hooks/useInView.ts` — IntersectionObserver хук (опции: once, margin, threshold)
- [x] `components/animations/NumberCounter.tsx` — анимированный счётчик
  - easeOutExpo
  - Запуск при попадании в viewport (один раз)
  - prefers-reduced-motion: показ финального значения сразу
  - requestAnimationFrame с cleanup
- [x] `components/sections/About.tsx` — Kinetic Typography секция
  - 3 слова: МЫ → ОСТАВЛЯЕМ → ОТПЕЧАТОК (последнее золотое)
  - Stagger 0.25s между словами, scale 1.2 → 1, y 80 → 0
  - Подзаголовок моноширинный uppercase
  - Контент в 2 колонки (на lg+): описание + философия (с border-l золотой)
  - Статистика: 72 / 48 / ∞ с моноширинным символом бесконечности
  - Все анимации через ScrollTrigger с `once: true`
  - aria-labelledby + sr-only h2 для доступности

## Тесты

- [x] `npm run build` — 71.8 kB / 162 kB First Load JS
- [x] Все тексты из `messages/{ru,en}.json` (нет хардкода)

## a11y

- [x] h2 в sr-only (визуально скрыт, но доступен скринридерам)
- [x] aria-hidden на декоративных kinetic-словах (повторяется sr-only h2)
- [x] aria-labelledby ссылается на about-title
- [x] Контраст foreground/primary на neutral background
- [x] prefers-reduced-motion уважается (NumberCounter сразу показывает результат)
