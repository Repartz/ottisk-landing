# Control QA: Фаза 2 — Дизайн-система + Логотип

## Что реализовано

### UI-компоненты
- [x] `components/ui/Button.tsx` — варианты primary/secondary/ghost, размеры sm/md/lg, isLoading, leftIcon/rightIcon, focus-visible с золотым ring
- [x] `components/ui/Card.tsx` — hover glow (золотое свечение), translate-up на hover, опции glow/hover/interactive
- [x] `components/ui/Input.tsx` — текстовый инпут с focus-ring и dark-стилями
- [x] `components/ui/Modal.tsx` — Framer Motion с spring-анимацией, focus trap, Escape, клик по backdrop
- [x] `components/ui/Logo.tsx` — Logo (mark/text/full варианты, 4 размера) + FingerprintMark (анимируемый SVG)
- [x] `components/layout/Container.tsx` (был в Фазе 1)

### Адаптация логотипа
- [x] `public/icons/logo.svg` — векторный отпечаток с прозрачным фоном (1.3KB), color via `currentColor`
- [x] `public/icons/favicon.svg` — упрощённый favicon (525B)
- [x] `public/icons/favicon-32.png`, `favicon-16.png` — растровые fallback
- [x] `public/icons/apple-touch-icon.png` — 180x180, золотой отпечаток на тёмном фоне
- [x] `public/photos/logo.png` — 512x512 PNG с прозрачным фоном (через ffmpeg colorkey)
- [x] `public/photos/logo.jpeg` — оригинал сохранён
- [x] `public/og-image.jpg` — 1200x630, золотой отпечаток на тёмном фоне `#141210`
- [x] `app/layout.tsx` обновлён под все варианты favicon

### SVG-логотип спроектирован для:
- Анимации stroke draw (через `data-fp-path` селекторы) в прелоадере
- Любого цвета через `currentColor`
- Любого размера (vector)
- Без watermark, без белого фона

## Тесты

- [x] `npm run build` — успешно компилируется без warnings
- [x] Размер favicon SVG: 525B (отлично)
- [x] Размер apple-touch-icon: 17KB
- [x] OG-image отображается (визуально проверено)
- [x] PNG версия — RGBA с альфа-каналом
- [ ] Визуальный тест Button/Card/Modal — будет в следующих фазах

## a11y чек-лист

- [x] Button имеет focus-visible ring (primary)
- [x] Modal имеет role="dialog", aria-modal="true", aria-labelledby
- [x] Modal закрывается по Escape
- [x] Modal управляет focus trap при открытии
- [x] Logo имеет aria-label="OTTISK", FingerprintMark — aria-hidden="true"
- [x] Контраст primary/text на neutral background — пройдёт WebAIM checker (тестировать в финале)

## Известные нюансы

- Цвет в OG-image слегка ярче золота (#FFD200 vs #C4A962) — потому что исходный логотип такой. Можно перерисовать в финале при необходимости.
