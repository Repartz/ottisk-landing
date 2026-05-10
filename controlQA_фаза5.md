# Control QA: Фаза 5 — Услуги (Таблица спецификаций)

## Что реализовано

- [x] `components/sections/Services.tsx` — таблица спецификаций ORYZO-стиль
  - Десктоп (md+): 12-колоночная грид-таблица (Услуга 5 / Срок 2 / Цена 2 / Стек 3)
  - Мобильный: стек карточек с метками
  - 6 услуг из `config/content.json`: telegram, social, websites, apps, support, rework
  - Заголовок гигантский (clamp 2.5-4.5rem), uppercase, моноширинный подзаголовок
  - GSAP анимации:
    - `.spec-line` — рисуются scaleX 0 → 1 (transform-origin: left)
    - `.spec-row` — opacity 0 → 1, x -16 → 0 со stagger
  - Hover на строке: подсветка фона + золотое название
  - Дисклеймер моноширинный
  - CTA "Обсудить проект" → Telegram с reachGoal
  - Локализация цен/сроков (RU: "5–60 тыс ₽", EN: "5–60k RUB")

## Тесты

- [x] `npm run build` — успешно (73 kB / 163 kB First Load)
- [x] Цены и сроки берутся из config (не хардкод в TSX)
- [x] Адаптация к моб./десктопу

## a11y

- [x] h2 семантический
- [x] Кнопка CTA с focus-visible
- [x] Контраст cells/foreground

## Дизайн (DESIGN_RULES)

- ✅ Моноширинный шрифт для технических данных (срок, цена, стек, дисклеймер)
- ✅ Цена золотая (`text-primary`)
- ✅ Тонкие линии `bg-border/40`
- ✅ Никаких карточек с тенями — только хайлайт фона при hover
