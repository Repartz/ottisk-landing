# 🎨 Design Rules для Claude Code (Devin)

## Установка

1. Создай файл `.cursorrules` в корне проекта
2. Или добавь в `claude.md` / `design_rules.md`
3. Claude Code прочитает автоматически

## Правила дизайна

### Цвета (строго!)
```
Background:    #141210 (тёплый антрацит, НЕ чёрный)
Primary:       #C4A962 (золотой)
Primary Warm:  #D4A574 (охристый для градиентов)
Accent:        #B87333 (терракота)
Secondary:     #2A2520 (тёплый графит)
Text:          #F5F0E8 (тёплый белый)
Text Muted:    #9A8B7A (тёплый серый)
Surface:       #1E1A16 (поверхности)
Border:        #2A2520 (разделители)
```

### Шрифты (2 шрифта!)
```
Display + Body:  Manrope (400, 500, 600, 700, 800)
Technical/Mono:  JetBrains Mono (400, 500, 700)

УДАЛЕН: Playfair Display (курсивный serif ломает минимализм)
```

### Типографика
```
Hero title:     clamp(4rem, 12vw, 10rem), weight 800, letter-spacing -0.03em, UPPERCASE
Section title:  clamp(3rem, 8vw, 6rem), weight 700, letter-spacing -0.02em
Body:           clamp(1rem, 1.2vw, 1.125rem), weight 400, line-height 1.7
Technical:      JetBrains Mono, uppercase, tracking-wide
```

### Анимации (GSAP)
```
Easing default:   power3.out
Easing elastic:   elastic.out(1, 0.5)
Easing spring:    cubic-bezier(0.34, 1.56, 0.64, 1)
Duration fast:    0.3s
Duration normal:  0.6s
Duration slow:    1.0s
Stagger:          0.05-0.1s
```

### Отступы
```
Section padding:  py-30 (7.5rem)
Container:        max-w-container (1440px), px-4 sm:px-6 lg:px-8 xl:px-12
Gap:              gap-6 (1.5rem) стандарт
```

### Эффекты
```
Grain overlay:    opacity 0.05, fixed, pointer-events-none
Glow:             box-shadow 0 0 30px rgba(196,169,98,0.15)
Border radius:    rounded-2xl (1rem) для карточек
                 rounded-full для кнопок
```

## Запрещено ❌
- Чистый чёрный (#000000) — только #141210
- Холодные синие оттенки
- Playfair Display или любой курсивный serif
- Стандартные карточки с тенями — только glow
- Более 2 шрифтов
- Яркие цвета вне палитры

## Обязательно ✅
- Все цвета из theme.json
- Все отступы из tailwind.config
- prefers-reduced-motion уважать
- aria-label для иконок
- Контраст ≥ 4.5:1
