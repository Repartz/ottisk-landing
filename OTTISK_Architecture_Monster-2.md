# 🏗️ АРХИТЕКТУРНЫЙ ФАЙЛ-МОНСТР: OTTISK LANDING
## Техническое задание для AI-кодера (Claude Opus 4.7 / Claude Sonnet 4.6)
### Версия: 1.0 | Дата: 2026-05-05 | Режим: Экстремальный + Полный аудит

---

# 📋 СОДЕРЖАНИЕ

1. [Ресурсы проекта / Подготовка активов](#1-ресурсы-проекта--подготовка-активов)
2. [Общее описание проекта](#2-общее-описание-проекта)
3. [Анализ референсов](#3-анализ-референсов)
4. [Глобальные зависимости и установки](#4-глобальные-зависимости-и-установки)
5. [Рекомендации по интеграции с Obsidian](#5-рекомендации-по-интеграции-с-obsidian)
6. [Общие инструкции для AI-кодера](#6-общие-инструкции-для-ai-кодера)
7. [Фаза 0: Архитектура и конфигурация](#7-фаза-0-архитектура-и-конфигурация)
8. [Фаза 1: Базовая структура проекта](#8-фаза-1-базовая-структура-проекта)
9. [Фаза 2: Дизайн-система и темы](#9-фаза-2-дизайн-система-и-темы)
10. [Фаза 3: Прелоадер и Hero-секция](#10-фаза-3-прелоадер-и-hero-секция)
11. [Фаза 4: О нас и философия](#11-фаза-4-о-нас-и-философия)
12. [Фаза 5: Услуги и модальные окна](#12-фаза-5-услуги-и-модальные-окна)
13. [Фаза 6: Портфолио](#13-фаза-6-портфолио)
14. [Фаза 7: Процесс работы](#14-фаза-7-процесс-работы)
15. [Фаза 8: Отзывы](#15-фаза-8-отзывы)
16. [Фаза 9: FAQ](#16-фаза-9-faq)
17. [Фаза 10: Footer и навигация](#17-фаза-10-footer-и-навигация)
18. [Фаза 11: Админ-панель](#18-фаза-11-админ-панель)
19. [Фаза 12: SEO, метрика, деплой](#19-фаза-12-seo-метрика-деплой)
20. [Фаза 13: Финальная сборка и QA](#20-фаза-13-финальная-сборка-и-qa)
21. [Трекер выполнения](#21-трекер-выполнения)

---

# 1. РЕСУРСЫ ПРОЕКТА / ПОДГОТОВКА АКТИВОВ

## 1.1 Предоставленные ресурсы

| Ресурс | Тип | Статус | Путь в проекте |
|--------|-----|--------|----------------|
| Тексты (Описание, FAQ, Отзывы) | `.txt` | ✅ Готов | Вшиты в `config/content.json` |
| Логотип (текстовый "OTTISK") | Текст | ✅ Готов | `components/Logo.tsx` (текстовый) |
| Палитра цветов | Скриншот | ✅ Готов | `config/theme.json` |
| Отзывы (9 штук) | Текст | ✅ Готов | `config/content.json` → `testimonials` |
| Файлы скиллов | — | ⏳ Будут позже | `assets/images/skills/` + `config/skills.json` |
| Референс 1: oryzo.ai | URL | ✅ Проанализирован | Секция [Анализ референсов](#3-анализ-референсов) |
| Референс 2: gyongy.framer.website | URL | ✅ Проанализирован | Секция [Анализ референсов](#3-анализ-референсов) |
| Ссылка Telegram | URL | ✅ Готов | `https://t.me/ottisk_lab` |
| Пароль админ-панели | Строка | ✅ Готов | `GHEYNJK35ifj@` (хранить в `.env.local`) |

## 1.2 Палитра цветов (обновлена — тёплые тона под ORYZO-стиль)

```json
// config/theme.json — ПРИМЕР структуры, полная версия в Фазе 2
{
  "colors": {
    "primary": "#C4A962",
    "primary_warm": "#D4A574",
    "accent": "#B87333",
    "secondary": "#2A2520",
    "tertiary": "#1E1A16",
    "neutral": "#141210",
    "text": "#F5F0E8",
    "text_muted": "#9A8B7A",
    "surface": "#1E1A16",
    "border": "#2A2520",
    "t60": "#9A8B7A"
  }
}
```

**Primary `#C4A962`** — золотистый/песочный, акцентный цвет для CTA, hover-эффектов, свечения.
**Primary Warm `#D4A574`** — тёплый охристый для градиентов и glow-эффектов.
**Accent `#B87333`** — терракота, дополнительный акцент для контраста.
**Secondary `#2A2520`** — тёплый графит, фон карточек, модальных окон.
**Tertiary `#1E1A16`** — глубокий тёплый тёмный, фон секций, градиенты.
**Neutral `#141210`** — тёплый антрацит (НЕ чистый чёрный), основной фон сайта.
**Text `#F5F0E8`** — тёплый белый, основной текст.
**Text Muted `#9A8B7A`** — тёплый серо-бежевый, вторичный текст.
**Surface `#1E1A16`** — поверхности, карточки.
**Border `#2A2520`** — разделители, границы.

> **Примечание:** Фон изменён с `#0D0D0D` (холодный чёрный) на `#141210` (тёплый антрацит) для соответствия ORYZO-стилю.

## 1.3 Система централизованной замены контента

**ПРАВИЛО ЖЕЛЕЗНОЕ:** ВСЕ изменяемые данные вынесены из кода в конфигурационные файлы. Каждый параметр сопровождается комментарием на русском языке.

**Файлы конфигурации:**
- `config/theme.json` — цвета, шрифты, отступы, breakpoints, параметры анимаций
- `config/content.json` — все тексты, заголовки, описания, цены, FAQ, отзывы
- `config/site.json` — URL сайта, ссылки, метаданные, SEO
- `config/skills.json` — иконки технологий (когда будут предоставлены)
- `data/portfolio.json` — проекты портфолио (через Firebase)
- `data/testimonials.json` — отзывы (через Firebase)

## 1.4 Заглушки для отсутствующих ресурсов

**КОДЕР:** Создать файл `assets_placeholder.md` со следующим содержимым:

```markdown
# Заглушки активов проекта OTTISK

## Иконки скиллов (assets/images/skills/)
- Формат: SVG или PNG (64x64px, 128x128px @2x)
- Название: [technology-name].svg (например: react.svg, nodejs.svg)
- Список ожидаемых: React, Next.js, TypeScript, Node.js, Python, Telegram Bot API,
  VK API, Firebase, Tailwind CSS, GSAP, Three.js, Framer Motion
- Замена: отредактировать config/skills.json, указать новый путь

## Аватарки отзывов (assets/images/avatars/)
- Формат: JPG или PNG (200x200px)
- Название: [client-name].jpg (например: alexey-krasnodar.jpg)
- Замена: заменить файл в папке, имя не менять

## Изображения портфолио (assets/images/portfolio/)
- Формат: JPG или WebP (1200x800px)
- Название: [project-slug].jpg
- Замена: загрузить через админ-панель или заменить файл

## Фавикон (assets/favicon/)
- Текущий: буква "O" (сгенерирован программно)
- Замена: заменить файлы favicon.ico, apple-touch-icon.png, favicon-32x32.png

## Логотип (assets/images/)
- Текущий: текстовый "OTTISK" (рендерится шрифтом)
- Замена: заменить config/logo.svg
```

---

# 2. ОБЩЕЕ ОПИСАНИЕ ПРОЕКТА

## 2.1 Назначение

Лендинг-портфолио для команды веб-разработки **OTTISK** (произносится: "От-тиск"). Сайт должен транслировать энергию молодой команды с "горящими глазами", компенсировать отсутствие массивного портфолио через визуальную смелость и доверие через социальные доказательства.

## 2.2 Целевая аудитория

- Владельцы бизнеса, желающие автоматизировать процессы
- Предприниматели, нуждающиеся в чат-ботах и воронках
- Клиенты, ищущие кастомную веб-разработку без посредников
- Инфобизнесмены, блогеры, владельцы онлайн-школ

## 2.3 Ключевые цели (KPI)

1. **Конверсия:** Клик по "Написать в Telegram" — главная цель
2. **Вовлечённость:** Время на сайте > 2 минуты
3. **Доверие:** Просмотр отзывов и FAQ
4. **Охват:** SEO-оптимизация для органического трафика

## 2.4 Главные призывы к действию (CTA)

| CTA | Тип | Расположение | Действие |
|-----|-----|--------------|----------|
| "Написать в Telegram" | PRIMARY | Hero, Услуги, Footer | Открыть `https://t.me/ottisk_lab` |
| "Смотреть портфолио" | SECONDARY | Hero, Навигация | Скролл к секции Портфолио |

## 2.5 Структура страницы (одностраничный лендинг)

```
1. Прелоадер (SVG Fingerprint stroke animation)
2. Навигация (Smart Header — скрывается/показывается)
3. Hero-секция (Видео-фон отпечатка + OTTISK + CTA)
4. О нас / Философия (Kinetic Typography — слова появляются по очереди)
5. Услуги (Таблица спецификаций ORYZO-стиль)
6. Портфолио (Horizontal scroll + Firebase CMS)
7. Процесс работы (SVG Timeline с "горящими" точками)
8. Отзывы (Цитаты на весь экран, переключение свайпом)
9. FAQ (Accordion с spring-физикой)
10. Footer (©, ссылки, карта сайта)
11. Админ-панель (/admin — отдельный маршрут)
```

## 2.6 Многоязычность

- **Языки:** Русский (default), Английский
- **Переключатель:** Текст "RU / EN" в шапке
- **Библиотека:** `next-intl`
- **Файлы переводов:** `messages/ru.json`, `messages/en.json`

## 2.7 Темы оформления

- **Тёмная** (default) — Neutral `#0D0D0D` фон
- **Светлая** — светлый фон, инвертированные цвета
- **Системная** — автоопределение через `prefers-color-scheme`
- **Переключатель:** Иконка солнце/луна в шапке

---

# 3. АНАЛИЗ РЕФЕРЕНСОВ

## 3.1 ORYZO (oryzo.ai) — от Lusion

### Что взять:
- **Гигантская типографика:** Название бренда на весь экран, текст как архитектурный элемент
- **Parallax-скроллинг:** Продукт вращается, масштабируется, реагирует на скролл
- **Юмор в копирайтинге:** Лёгкий, запоминающийся тон (адаптировать для B2B)
- **Карточки с характером:** Отзывы с уникальными аватарками, не сток
- **Таблица спецификаций:** Чистая, техническая, с характером
- **Градиентные фоны:** Тёплые охристые/терракотовые тона
- **Sticky-элементы и reveal-анимации:** Секции появляются по мере скролла
- **Видео-hero:** Полноэкранное видео с кнопкой PLAY
- **Grain/noise overlay:** Тонкий шум для текстуры "плёнки"
- **Видео-отпечаток:** AI-сгенерированное видео золотого отпечатка пальца как фон Hero

### Чего избегать:
- Слишком product-focused (у нас услуги, не физический товар)
- Избыточный 3D (тяжёлый для мобильных)
- Юмор, неуместный в B2B-контексте

## 3.2 Gyöngy Gora (gyongy.framer.website) — Designer Portfolio

### Что взять:
- **Микросайты с нарративным скроллом:** Каждый проект — история
- **Scroll-trigger анимации:** Элементы появляются, трансформируются
- **Крупная типографика + whitespace:** Воздух и масштаб
- **Hover-эффекты с depth:** Карточки "поднимаются", тени усиливаются
- **Секционная структура:** Чёткое разделение на блоки

### Чего избегать:
- Слишком "дизайнерская" абстрактность (нужна ясность для коммерции)
- Избыточные анимации, отвлекающие от CTA

## 3.3 Сводная таблица влияния на архитектуру

| Элемент | ORYZO | Gyöngy | OTTISK |
|---------|-------|--------|--------|
| Типографика | Гигантская | Крупная | Гигантская + моноширинный |
| Анимации | 3D + Parallax | Scroll-trigger | GSAP + SVG |
| Фон | Градиенты | Чистый | Видео отпечатка + градиент |
| Карточки | Характер | Depth | Таблица спецификаций |
| Навигация | Минимальная | Стандартная | Smart header |
| Тон | Юмор | Профессиональный | Уверенность + честность |

---

# 4. ГЛОБАЛЬНЫЕ ЗАВИСИМОСТИ И УСТАНОВКИ

## 4.1 Технологический стек

| Категория | Технология | Версия | Назначение |
|-----------|-----------|--------|------------|
| Фреймворк | Next.js | 14.x | SSR, App Router, оптимизация |
| Язык | TypeScript | 5.x | Типизация |
| Стили | Tailwind CSS | 3.x | Утилитарные стили |
| Анимации | GSAP | 3.x | ScrollTrigger, timelines |
| Анимации | Framer Motion | 11.x | React-компоненты, жесты |
| 3D/WebGL | React Three Fiber | 8.x | Фон с частицами кода |
| 3D | Three.js | 0.16x | Движок (зависимость R3F) |
| i18n | next-intl | 3.x | Многоязычность |
| Бэкенд | Firebase | 10.x | Firestore, Auth, Analytics |
| Метрика | Яндекс.Метрика | — | Веб-аналитика |
| Шрифты | next/font | — | Оптимизация шрифтов |
| Иконки | Lucide React | latest | SVG-иконки |
| Утилиты | clsx + tailwind-merge | latest | Условные классы |

## 4.2 Установка зависимостей

**КОДЕР (Claude Opus 4.7):** Выполнить в терминале:

```bash
# Создание проекта
npx create-next-app@latest ottisk-landing --typescript --tailwind --app --no-src-dir

# Переход в директорию
cd ottisk-landing

# Установка зависимостей
npm install gsap @gsap/react framer-motion three @react-three/fiber @react-three/drei next-intl firebase lucide-react clsx tailwind-merge

# Установка dev-зависимостей
npm install -D @types/three
```

## 4.3 Makefile / start.sh

**КОДЕР (Claude Opus 4.7):** Создать `Makefile` в корне проекта:

```makefile
# Makefile для проекта OTTISK Landing
# Запуск одной командой: make all

.PHONY: install build start all dev

# Установка зависимостей
install:
	npm install

# Сборка production
build:
	npm run build

# Запуск production-сервера
start:
	npm start

# Запуск dev-сервера
dev:
	npm run dev

# Полный цикл: установка + сборка + запуск
all: install build start
```

**Альтернатива для Windows:** Создать `start.bat`:

```batch
@echo off
echo [OTTISK] Installing dependencies...
call npm install
echo [OTTISK] Building production...
call npm run build
echo [OTTISK] Starting server...
call npm start
```

## 4.4 Структура директорий

**КОДЕР (Claude Opus 4.7):** Создать следующую структуру:

```
ottisk-landing/
├── .env.local                    # Переменные окружения (НЕ коммитить!)
├── .env.example                  # Шаблон переменных (коммитить)
├── .gitignore
├── Makefile                      # Команды сборки
├── next.config.js                # Конфигурация Next.js
├── tailwind.config.ts            # Конфигурация Tailwind
├── tsconfig.json
├── package.json
├── README.md                     # Быстрый старт
├── CREDITS.md                    # Благодарности и контакты
├── GLOSSARY.md                   # Глоссарий терминов
├── ASSETS_PLACEHOLDER.md         # Заглушки активов
│
├── app/                          # App Router Next.js 14
│   ├── layout.tsx                # Корневой layout (шрифты, метаданные)
│   ├── page.tsx                  # Главная страница (лендинг)
│   ├── globals.css               # Глобальные стили
│   ├── admin/                    # Админ-панель (отдельный маршрут)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   └── [locale]/                 # i18n маршруты
│       ├── layout.tsx
│       └── page.tsx
│
├── components/                   # React-компоненты
│   ├── ui/                       # Базовые UI-компоненты
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── layout/                   # Компоненты раскладки
│   │   ├── Header.tsx            # Smart header
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Container.tsx
│   ├── sections/                 # Секции лендинга
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Process.tsx
│   │   ├── Testimonials.tsx
│   │   └── FAQ.tsx
│   ├── animations/               # Анимационные компоненты
│   │   ├── Preloader.tsx         # Прелоадер с отпечатком
│   │   ├── FingerprintReveal.tsx
│   │   ├── KineticText.tsx
│   │   ├── ParallaxLayer.tsx
│   │   ├── StickySection.tsx
│   │   ├── HorizontalScroll.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── NumberCounter.tsx
│   │   ├── SpringAccordion.tsx
│   │   └── GlowCard.tsx
│   ├── effects/                  # Визуальные эффекты
│   │   ├── CodeParticles.tsx     # WebGL-фон с частицами
│   │   ├── GrainOverlay.tsx      # Шум/зернистость
│   │   └── ThemeProvider.tsx     # Провайдер тем
│   └── admin/                    # Компоненты админки
│       ├── LoginForm.tsx
│       ├── Dashboard.tsx
│       ├── PortfolioManager.tsx
│       ├── TestimonialsManager.tsx
│       ├── StatsWidget.tsx
│       └── ContentEditor.tsx
│
├── hooks/                        # Кастомные хуки
│   ├── useScrollProgress.ts
│   ├── useInView.ts
│   ├── useMousePosition.ts
│   ├── useTheme.ts
│   ├── useLocale.ts
│   └── useAuth.ts
│
├── lib/                          # Утилиты и хелперы
│   ├── utils.ts                  # cn() и прочее
│   ├── firebase.ts               # Инициализация Firebase
│   ├── gsap.ts                   # Регистрация GSAP плагинов
│   └── analytics.ts              # Яндекс.Метрика
│
├── config/                       # Конфигурационные файлы
│   ├── theme.json                # Цвета, шрифты, анимации
│   ├── content.json              # Тексты, цены, FAQ
│   ├── site.json                 # URL, метаданные, SEO
│   ├── skills.json               # Иконки технологий
│   └── logo.svg                  # SVG-логотип (будущий)
│
├── messages/                     # Файлы переводов (i18n)
│   ├── ru.json                   # Русский (default)
│   └── en.json                   # Английский
│
├── data/                         # Локальные данные (fallback)
│   ├── portfolio.json
│   └── testimonials.json
│
├── types/                        # TypeScript типы
│   ├── index.ts
│   ├── portfolio.ts
│   ├── testimonial.ts
│   └── service.ts
│
├── public/                       # Статические файлы
│   ├── favicon.ico
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── og-image.jpg              # Open Graph изображение
│   ├── sitemap.xml
│   └── robots.txt
│
└── assets/                       # Активы проекта
    ├── images/
    │   ├── skills/               # Иконки технологий
    │   ├── avatars/              # Аватарки отзывов
    │   ├── portfolio/            # Скриншоты проектов
    │   └── team/                 # Фото команды (будущее)
    └── fonts/                    # Локальные шрифты (если нужны)
```

---

# 5. РЕКОМЕНДАЦИИ ПО ИНТЕГРАЦИИ С OBSIDIAN

> **Примечание:** Клиент указал "пока нет, возможно позже". Данная секция — для будущего использования.

## 5.1 Необходимые плагины Obsidian

1. **Local REST API** — API для доступа к заметкам Obsidian
2. **Obsidian MCP Server** — интеграция с AI-ассистентами

## 5.2 Структура хранения артефактов

```
Obsidian Vault/
└── OTTISK_Project/
    ├── TechTask/
    │   └── architecture.md       # Этот файл
    ├── Reports/
    │   ├── phase_1_report.md
    │   ├── phase_2_report.md
    │   └── ...
    ├── Configs/
    │   ├── theme_backup.json
    │   └── content_backup.json
    ├── Assets/
    │   └── references/
    └── Meetings/
        └── meeting_notes.md
```

## 5.3 Базовый чек-лист настройки

- [ ] Установить плагин Local REST API
- [ ] Настроить порт и токен авторизации
- [ ] Установить Obsidian MCP Server
- [ ] Настроить Devin на чтение/запись в vault
- [ ] Создать шаблоны для отчётов по фазам

---

# 6. ОБЩИЕ ИНСТРУКЦИИ ДЛЯ AI-КОДЕРА

## 6.1 Распределение моделей

**ГЛОБАЛЬНОЕ ПРАВИЛО:**

- **Claude Opus 4.7** — Фаза 0 (архитектура, конфигурации, Makefile, глобальные зависимости, Firebase-настройка)
- **Claude Sonnet 4.6** — Фазы 1-13 (дизайн, анимации, портфолио, отзывы, админка, деплой)
- **Claude Opus 4.7** — При возникновении сложных архитектурных решений в любой фазе

## 6.2 Система конфигурации

**ЖЕЛЕЗНОЕ ПРАВИЛО:** ВСЕ изменяемые данные вынесены из кода. Примеры:

```typescript
// ❌ ПЛОХО: хардкод в компоненте
<h1>OTTISK — оставляем отпечаток</h1>

// ✅ ХОРОШО: данные из конфига
import siteConfig from '@/config/site.json';
<h1>{siteConfig.hero.title}</h1>
```

**Каждый JSON-файл должен содержать комментарии на русском языке** (через поле `_comment`):

```json
{
  "_comment": "Этот файл содержит все тексты сайта. Меняйте значения, но не удаляйте ключи!",
  "hero": {
    "_comment": "Секция первого экрана — главное впечатление",
    "title": "OTTISK",
    "subtitle": "Оставляем отпечаток в истории"
  }
}
```

## 6.3 Быстрый старт для кодера

```bash
# 1. Клонировать репозиторий
git clone [URL-репозитория]
cd ottisk-landing

# 2. Установить зависимости
make install

# 3. Настроить переменные окружения
cp .env.example .env.local
# Отредактировать .env.local (см. Фазу 0)

# 4. Запустить dev-сервер
make dev

# 5. Открыть http://localhost:3000
```

## 6.4 Создание контрольных файлов QA

**КОДЕР (каждая фаза):** После завершения фазы создать `controlQA_фазаN.md`:

```markdown
# Control QA: Фаза N — [Название фазы]

## Что реализовано
- [ ] Пункт 1
- [ ] Пункт 2

## Тесты
- [ ] Проходит на десктопе (1920x1080)
- [ ] Проходит на планшете (768x1024)
- [ ] Проходит на мобильном (375x667)
- [ ] 60fps на всех устройствах
- [ ] Нет ошибок в консоли

## Известные проблемы
- Проблема X: решение Y

## Скриншоты
[Приложить скриншоты ключевых состояний]
```

## 6.5 Создание финальных файлов

**КОДЕР (после Фазы 13):** Создать:

- `GLOSSARY.md` — Глоссарий терминов проекта
- `README.md` — Полная документация по запуску
- `CREDITS.md` — Благодарности (см. 6.6)
- `ASSETS_PLACEHOLDER.md` — Инструкции по замене активов

## 6.6 Файл благодарности (CREDITS.md)

**КОДЕР:** Создать `CREDITS.md` на русском языке:

```markdown
# Благодарности

## Автор идеи
[Имя клиента] — основатель команды OTTISK

## Технологии
- Next.js 14 (Vercel)
- Tailwind CSS
- GSAP + ScrollTrigger
- Framer Motion
- React Three Fiber
- Firebase
- Яндекс.Метрика

## Референсы
- ORYZO (oryzo.ai) — Lusion
- Gyöngy Gora (gyongy.framer.website)

## Шрифты
- Manrope (Google Fonts)
- JetBrains Mono (Google Fonts)
- Playfair Display (Google Fonts)

## Контакты
- Telegram: https://t.me/ottisk_lab
- Сайт: [URL после деплоя]
```

## 6.7 Режим быстрой правки фазы

**Если клиент скажет:** "Правка фазы N: [описание изменений]"

**ДЕЙСТВИЯ КОДЕРА:**
1. Обновить содержимое указанной фазы в этом документе
2. Скорректировать `controlQA_фазаN.md`
3. Обновить трекер выполнения (раздел 21)
4. НЕ трогать остальные фазы

## 6.8 Доступность (a11y) — базовый чек-лист

**КАЖДАЯ ФАЗА должна включать:**

- [ ] Все интерактивные элементы доступны с клавиатуры (Tab, Enter, Escape)
- [ ] Цветовой контраст минимум 4.5:1 для текста
- [ ] Атрибуты `aria-label` для иконок и кнопок без текста
- [ ] `aria-expanded` для аккордеонов и модалок
- [ ] `aria-hidden="true"` для декоративных элементов
- [ ] Пропуск анимаций при `prefers-reduced-motion: reduce`
- [ ] Фокус-стили видимы и контрастны
- [ ] Язык страницы указан в `<html lang="ru">`
- [ ] Заголовки иерархичны (h1 → h2 → h3)
- [ ] Alt-тексты для всех изображений

---

# 7. ФАЗА 0: АРХИТЕКТУРА И КОНФИГУРАЦИЯ

> **Рекомендуемая модель:** Claude Opus 4.7
> **Обоснование:** Фундаментальная фаза. Требуется идеальная архитектура, типизация, конфигурация Firebase, настройка i18n, SEO-база. Ошибки здесь каскадируют во все фазы.

## 7.1 Создание проекта Next.js

**КОДЕР (Opus 4.7):**

```bash
npx create-next-app@latest ottisk-landing --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd ottisk-landing
```

## 7.2 Установка зависимостей

```bash
npm install gsap @gsap/react framer-motion three @react-three/fiber @react-three/drei next-intl firebase lucide-react clsx tailwind-merge
npm install -D @types/three
```

## 7.3 Конфигурация TypeScript

**Файл:** `tsconfig.json` (должен быть создан Next.js, проверить/дополнить):

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 7.4 Конфигурация Tailwind CSS

**Файл:** `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Обновлённая палитра — тёплые тона под ORYZO-стиль
        primary: {
          DEFAULT: '#C4A962',
          50: '#F5F0E3',
          100: '#EDE5D0',
          200: '#DDD0A8',
          300: '#CDBB80',
          400: '#C4A962', // основной
          500: '#B0943A',
          600: '#8A732D',
          700: '#645221',
          800: '#3E3214',
          900: '#181208',
        },
        secondary: {
          DEFAULT: '#2A2520',
          50: '#E8E5E0',
          100: '#D1CCC4',
          200: '#A39989',
          300: '#756B5E',
          400: '#2A2520', // основной — тёплый графит
          500: '#24201C',
          600: '#1E1A16',
          700: '#181410',
          800: '#120F0C',
          900: '#0C0A08',
        },
        tertiary: {
          DEFAULT: '#1E1A16',
          50: '#E8E5E0',
          100: '#D1CCC4',
          200: '#A39989',
          300: '#756B5E',
          400: '#1E1A16', // основной — тёплый тёмный
          500: '#1A1714',
          600: '#161310',
          700: '#120F0C',
          800: '#0E0C08',
          900: '#0A0806',
        },
        neutral: {
          DEFAULT: '#141210',
          50: '#E8E8E8',
          100: '#D1D1D1',
          200: '#A3A3A3',
          300: '#757575',
          400: '#474747',
          500: '#141210', // основной — тёплый антрацит (НЕ чистый чёрный)
          600: '#11100E',
          700: '#0E0D0C',
          800: '#0B0A09',
          900: '#080706',
        },
        t60: '#9A8B7A', // тёплый серо-бежевый для вторичного текста
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        // serif УДАЛЁН — Playfair Display больше не используется
      },
      fontSize: {
        'display': ['clamp(4rem, 12vw, 10rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3' }],
        'body': ['clamp(1rem, 1.2vw, 1.125rem)', { lineHeight: '1.7' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'container': '1440px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

## 7.5 Глобальные стили

**Файл:** `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================
   ГЛОБАЛЬНЫЕ СТИЛИ OTTISK
   ============================================ */

@layer base {
  :root {
    /* Светлая тема (переменные CSS для динамической смены) */
    --background: #FAFAFA;
    --foreground: #0D0D0D;
    --card: #FFFFFF;
    --card-foreground: #0D0D0D;
    --primary: #C4A962;
    --primary-foreground: #0D0D0D;
    --secondary: #E8ECF0;
    --secondary-foreground: #2C3E50;
    --muted: #F1F5F9;
    --muted-foreground: #8592a3;
    --border: #E2E8F0;
    --input: #E2E8F0;
    --ring: #C4A962;
    --radius: 1rem;
  }

  .dark {
    /* Тёмная тема (default) — тёплые тона */
    --background: #141210;
    --foreground: #F5F0E8;
    --card: #1E1A16;
    --card-foreground: #F5F0E8;
    --primary: #C4A962;
    --primary-foreground: #141210;
    --secondary: #2A2520;
    --secondary-foreground: #F5F0E8;
    --muted: #1E1A16;
    --muted-foreground: #9A8B7A;
    --border: #2A2520;
    --input: #2A2520;
    --ring: #C4A962;
    --radius: 1rem;
  }

  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-background text-foreground font-sans;
    overflow-x: hidden;
  }

  /* Скрытие скроллбара, но сохранение функциональности */
  body::-webkit-scrollbar {
    width: 8px;
  }

  body::-webkit-scrollbar-track {
    background: var(--background);
  }

  body::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
  }

  /* Уважение к prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer components {
  /* Контейнер с ограничением ширины */
  .container-ottisk {
    @apply mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12;
  }

  /* Градиентный текст (золотой) */
  .text-gradient-gold {
    @apply bg-gradient-to-r from-primary via-primary-300 to-primary bg-clip-text text-transparent;
  }

  /* Свечение для hover-эффектов */
  .glow-gold {
    box-shadow: 0 0 20px rgba(196, 169, 98, 0.15),
                0 0 40px rgba(196, 169, 98, 0.1),
                0 0 60px rgba(196, 169, 98, 0.05);
  }

  /* Шум/зернистость поверх */
  .grain-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
}

@layer utilities {
  /* Утилита для скрытия элементов, но доступности для скринридеров */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
}
```

## 7.6 Конфигурация Next.js

**Файл:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n настройки (next-intl управляет маршрутизацией)
  images: {
    domains: ['firebasestorage.googleapis.com'], // для изображений из Firebase
    formats: ['image/webp', 'image/avif'],
  },
  // Оптимизация для production
  swcMinify: true,
  reactStrictMode: true,
  // Экспериментальные функции
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
```

## 7.7 Переменные окружения

**Файл:** `.env.example` (коммитить в репозиторий)

```bash
# ============================================
# ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ OTTISK
# Скопируйте в .env.local и заполните реальными значениями
# ============================================

# Firebase Configuration (взять из Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin (для серверных операций — опционально)
# FIREBASE_ADMIN_SDK_KEY=path/to/serviceAccountKey.json

# Яндекс.Метрика
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678

# URL сайта (заменить после покупки домена)
NEXT_PUBLIC_SITE_URL=https://ottisk.vercel.app

# Админ-панель (хранить только на сервере!)
ADMIN_PASSWORD=GHEYNJK35ifj@
```

**Файл:** `.env.local` (НЕ коммитить! Создать локально)

```bash
# Скопировать из .env.example и заполнить
```

**Файл:** `.gitignore` (дополнить)

```gitignore
# Environment variables
.env.local
.env.*.local

# Firebase
serviceAccountKey.json

# Build
.next/
out/
dist/
```

## 7.8 Инициализация Firebase

**Файл:** `lib/firebase.ts`

```typescript
// ============================================
// FIREBASE: Инициализация и конфигурация
// Здесь настраивается подключение к Firestore
// ============================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Инициализация (предотвращение двойной инициализации в Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore — основная база данных
export const db = getFirestore(app);

// Analytics — только на клиенте
export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export default app;
```

## 7.9 Утилиты

**Файл:** `lib/utils.ts`

```typescript
// ============================================
// УТИЛИТЫ: Вспомогательные функции
// ============================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет Tailwind-классы с правильным приоритетом
 * Использование: cn('class1', condition && 'class2', 'class3')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирование числа с разделителями тысяч
 * Пример: 60000 → "60 000"
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Задержка (для анимаций)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Проверка prefers-reduced-motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

## 7.10 Регистрация GSAP плагинов

**Файл:** `lib/gsap.ts`

```typescript
// ============================================
// GSAP: Регистрация плагинов
// Все плагины должны быть зарегистрированы один раз
// ============================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // требует Club GSAP (бесплатно для некоммерческого)

// Регистрация плагинов (только на клиенте)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  // SplitText — опционально, можно заменить кастомной реализацией
}

export { gsap, ScrollTrigger };
```

## 7.11 TypeScript типы

**Файл:** `types/index.ts`

```typescript
// ============================================
// ТИПЫ: Глобальные TypeScript интерфейсы
// ============================================

export interface Service {
  id: string;
  slug: string;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  priceRange: { min: number; max: number; currency: string };
  features: { ru: string[]; en: string[] };
  icon: string; // название иконки Lucide
}

export interface PortfolioItem {
  id: string;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  image: string;
  tags: string[];
  link?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: { ru: string; en: string };
  text: { ru: string; en: string };
  avatar?: string;
  rating: number; // 1-5
}

export interface FAQItem {
  id: string;
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
}

export interface ProcessStep {
  id: number;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  duration?: string;
}

export interface SiteConfig {
  name: string;
  description: { ru: string; en: string };
  url: string;
  telegram: string;
  email?: string;
  phone?: string;
}

export type Theme = 'light' | 'dark' | 'system';
export type Locale = 'ru' | 'en';
```

## 7.12 Состояния и сценарии данных

**Сценарий 1: Первый запуск (нет данных в Firebase)**
- Загрузить fallback-данные из `data/portfolio.json` и `data/testimonials.json`
- Показать заглушки портфолио с призывом "Станьте первым"
- Отзывы загрузить из `config/content.json`

**Сценарий 2: Данные в Firebase есть**
- Загрузить из Firestore
- Fallback на локальные данные при ошибке сети

**Сценарий 3: Оффлайн**
- Показать кэшированные данные (Next.js ISR)
- Индикатор "Оффлайн-режим"

## 7.13 Возможные риски и узкие места

| Риск | Вероятность | Влияние | Решение |
|------|-------------|---------|---------|
| Firebase лимиты (Spark-план) | Средняя | Среднее | Мониторинг, переход на Blaze при необходимости |
| GSAP + R3F конфликт | Низкая | Высокое | Изолировать контексты, использовать refs |
| next-intl + App Router | Средняя | Среднее | Следовать официальной документации |
| WebGL на мобильных | Высокая | Среднее | Fallback на CSS-градиент |
| Cumulative Layout Shift | Средняя | Высокое | Резервировать место под изображения |

## 7.14 Чего следует избегать

- ❌ Хардкод данных в компонентах
- ❌ Использование `any` в TypeScript
- ❌ Синхронная инициализация Firebase (только lazy)
- ❌ Импорт всей библиотеки Lucide (tree-shaking!)
- ❌ Отсутствие fallback для WebGL

## 7.15 Опциональные улучшения

- [ ] PWA (Progressive Web App) — манифест, service worker
- [ ] Кэширование Firebase через React Query / SWR
- [ ] Image optimization через next/image с blur placeholder
- [ ] Critical CSS extraction

---

# 8. ФАЗА 1: БАЗОВАЯ СТРУКТУРА ПРОЕКТА

> **Рекомендуемая модель:** Claude Opus 4.7
> **Обоснование:** Корневой layout, шрифты, i18n-провайдер, ThemeProvider — всё должно быть идеально с первого раза.

## 8.1 Корневой layout с шрифтами

**Файл:** `app/layout.tsx`

```typescript
// ============================================
// КОРНЕВОЙ LAYOUT: Шрифты, метаданные, провайдеры
// ============================================

import type { Metadata } from 'next';
import { Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/effects/ThemeProvider';
import { CustomCursor } from '@/components/animations/CustomCursor';
import { GrainOverlay } from '@/components/effects/GrainOverlay';
import { Analytics } from '@/lib/analytics';

// Основной шрифт — современный гротеск
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Моноширинный — для code-style акцентов
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '700'],
});

// Playfair Display УДАЛЁН — курсивный serif ломает минималистичную эстетику ORYZO
// Используем только Manrope (все веса) + JetBrains Mono (технический текст)

export const metadata: Metadata = {
  title: {
    default: 'OTTISK — Оставляем отпечаток в истории',
    template: '%s | OTTISK',
  },
  description: 'Команда веб-разработки. Чистый код, честное отношение, результат. Телеграм-боты, сайты, приложения.',
  keywords: ['веб-разработка', 'телеграм боты', 'сайты', 'лендинги', 'приложения', 'OTTISK', 'чистый код'],
  authors: [{ name: 'OTTISK Team' }],
  creator: 'OTTISK',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ottisk.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: 'en_US',
    url: '/',
    siteName: 'OTTISK',
    title: 'OTTISK — Оставляем отпечаток в истории',
    description: 'Команда веб-разработки. Чистый код, честное отношение, результат.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OTTISK — команда веб-разработки',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OTTISK — Оставляем отпечаток в истории',
    description: 'Команда веб-разработки. Чистый код, честное отношение, результат.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // yandex: 'yandex-verification-code', // добавить после настройки Я.Вебмастер
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Analytics />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <CustomCursor />
          <GrainOverlay />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## 8.2 Theme Provider

**Файл:** `components/effects/ThemeProvider.tsx`

```typescript
'use client';

// ============================================
// THEME PROVIDER: Управление светлой/тёмной темой
// Поддерживает: light, dark, system (auto)
// ============================================

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Theme } from '@/types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ottisk-theme') as Theme | null;
    if (saved) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    let resolved: 'light' | 'dark';

    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = theme;
    }

    setResolvedTheme(resolved);
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    localStorage.setItem('ottisk-theme', theme);
  }, [theme, mounted]);

  // Слушатель изменения системной темы
  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Предотвращение FOUC (flash of unstyled content)
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## 8.3 Яндекс.Метрика

**Файл:** `lib/analytics.tsx`

```typescript
// ============================================
// ЯНДЕКС.МЕТРИКА: Вставка счётчика
// ============================================

'use client';

import Script from 'next/script';

export function Analytics() {
  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  if (!metrikaId) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(${metrikaId}, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
        });
      `}
    </Script>
  );
}

// Хелпер для отправки целей
export function reachGoal(goal: string) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
    if (metrikaId) {
      (window as any).ym(metrikaId, 'reachGoal', goal);
    }
  }
}
```

## 8.4 i18n конфигурация

**Файл:** `i18n.ts` (в корне проекта)

```typescript
// ============================================
// I18N: Конфигурация next-intl
// ============================================

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Europe/Moscow',
    now: new Date(),
  };
});
```

**Файл:** `middleware.ts` (в корне проекта)

```typescript
// ============================================
// MIDDLEWARE: Перенаправление на локаль
// ============================================

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // не добавлять /ru для дефолтного языка
});

export const config = {
  matcher: ['/((?!api|_next|.*\..*).*)'],
};
```

## 8.5 Файлы переводов

**Файл:** `messages/ru.json`

```json
{
  "_comment": "Русская локализация сайта OTTISK. Меняйте тексты, но сохраняйте структуру!",
  "metadata": {
    "title": "OTTISK — Оставляем отпечаток в истории",
    "description": "Команда веб-разработки. Чистый код, честное отношение, результат."
  },
  "nav": {
    "about": "О нас",
    "services": "Услуги",
    "portfolio": "Портфолио",
    "process": "Процесс",
    "testimonials": "Отзывы",
    "faq": "FAQ",
    "contact": "Контакты"
  },
  "hero": {
    "title": "OTTISK",
    "subtitle": "Оставляем отпечаток в истории",
    "description": "Мы не просто делаем сайты и ботов — мы переворачиваем представление о веб-разработке. Чистый код, честное отношение, результат.",
    "cta_primary": "Написать в Telegram",
    "cta_secondary": "Смотреть портфолио"
  },
  "about": {
    "title": "О нас",
    "subtitle": "Кто мы",
    "description": "OTTISK — это команда, которая оставляет отпечаток в истории. Мы не просто делаем сайты и ботов, мы переворачиваем представление о веб-разработке.",
    "philosophy": "Наша философия проста: чистый код, честное отношение и результат, за который не стыдно.",
    "stats": {
      "testing": "72 часа",
      "testing_label": "тестирование перед запуском",
      "support": "48 часов",
      "support_label": "на исправление ошибок",
      "team": "Распределённая",
      "team_label": "команда профессионалов"
    }
  },
  "services": {
    "title": "Услуги",
    "subtitle": "Чем занимаемся",
    "disclaimer": "Средний диапазон цен. Точная стоимость после обсуждения всех деталей. Работаем по предоплате.",
    "items": {
      "telegram": {
        "title": "Телеграм-боты",
        "description": "От простых визиток до сложных автоворонок, магазинов и сервисных ассистентов.",
        "price": "5–60 тыс ₽"
      },
      "social": {
        "title": "Чат-боты для соцсетей",
        "description": "ВКонтакте, VK Mini Apps, Senler и любые платформы с API. Интеграция с CRM и платёжками.",
        "price": "10–70 тыс ₽"
      },
      "apps": {
        "title": "Приложения",
        "description": "Нативные и веб-приложения. Пишем руками, без конструкторного мусора.",
        "price": "150–500 тыс ₽"
      },
      "websites": {
        "title": "Сайты и лендинги",
        "description": "Вёрстка с нуля чистым кодом. Никаких Tilda/Webflow. Всё кастомное.",
        "price": "25–120 тыс ₽"
      },
      "support": {
        "title": "Поддержка",
        "description": "Если наша разработка упала — чиним за 48 часов бесплатно. Долгосрочная дружба приветствуется.",
        "price": "5–50 тыс ₽"
      },
      "rework": {
        "title": "Доработка",
        "description": "Берёмся за готовые проекты. Разберём чужой код, исправим баги и доведём до ума.",
        "price": "5–50 тыс ₽"
      }
    },
    "cta": "Обсудить проект"
  },
  "portfolio": {
    "title": "Портфолио",
    "subtitle": "Наши работы",
    "empty": "Скоро здесь появятся первые кейсы. Хотите стать первым?",
    "cta": "Написать в Telegram"
  },
  "process": {
    "title": "Процесс",
    "subtitle": "Как мы работаем",
    "steps": {
      "1": { "title": "Брифинг", "description": "Созвон или чат. Обсуждаем задачу, фиксируем хотелки, сроки, бюджет." },
      "2": { "title": "Onboarding", "description": "Формализуем требования. Пишем ТЗ, согласовываем макеты и архитектуру." },
      "3": { "title": "Разработка", "description": "Пишем код с промежуточными отчётами. Вы видите прогресс в реальном времени." },
      "4": { "title": "Тестирование", "description": "3 дня гоняем проект тестами на разных устройствах и нагрузках." },
      "5": { "title": "Запуск", "description": "Передача проекта + инструкция. Гарантия: 48 часов на исправление критичных багов." }
    }
  },
  "testimonials": {
    "title": "Отзывы",
    "subtitle": "Что говорят клиенты",
    "cta": "Стать следующим"
  },
  "faq": {
    "title": "FAQ",
    "subtitle": "Частые вопросы"
  },
  "footer": {
    "copyright": "© 2026 OTTISK. Все права защищены.",
    "telegram": "Telegram",
    "sitemap": "Карта сайта",
    "privacy": "Политика конфиденциальности",
    "made_with": "Сделано с",
    "by": "командой OTTISK"
  },
  "admin": {
    "title": "Админ-панель",
    "login": "Вход",
    "password": "Пароль",
    "submit": "Войти",
    "logout": "Выйти",
    "portfolio": "Портфолио",
    "testimonials": "Отзывы",
    "stats": "Статистика",
    "visitors": "Посетители",
    "add": "Добавить",
    "edit": "Редактировать",
    "delete": "Удалить",
    "save": "Сохранить",
    "cancel": "Отмена"
  }
}
```

**Файл:** `messages/en.json` (аналогичная структура с английскими переводами)

```json
{
  "_comment": "English localization for OTTISK website",
  "metadata": {
    "title": "OTTISK — Leaving a Mark in History",
    "description": "Web development team. Clean code, honest approach, results."
  },
  "nav": {
    "about": "About",
    "services": "Services",
    "portfolio": "Portfolio",
    "process": "Process",
    "testimonials": "Testimonials",
    "faq": "FAQ",
    "contact": "Contact"
  },
  "hero": {
    "title": "OTTISK",
    "subtitle": "Leaving a Mark in History",
    "description": "We don't just make websites and bots — we redefine web development. Clean code, honest approach, results.",
    "cta_primary": "Message on Telegram",
    "cta_secondary": "View Portfolio"
  },
  "about": {
    "title": "About",
    "subtitle": "Who we are",
    "description": "OTTISK is a team that leaves a mark in history. We don't just make websites and bots, we redefine web development.",
    "philosophy": "Our philosophy is simple: clean code, honest approach, and results we're proud of.",
    "stats": {
      "testing": "72 hours",
      "testing_label": "testing before launch",
      "support": "48 hours",
      "support_label": "to fix critical bugs",
      "team": "Distributed",
      "team_label": "team of professionals"
    }
  },
  "services": {
    "title": "Services",
    "subtitle": "What we do",
    "disclaimer": "Average price range. Exact cost after discussing all details. Prepayment required.",
    "items": {
      "telegram": {
        "title": "Telegram Bots",
        "description": "From simple business cards to complex funnels, shops, and service assistants.",
        "price": "5–60k RUB"
      },
      "social": {
        "title": "Social Chatbots",
        "description": "VKontakte, VK Mini Apps, Senler, and any API-enabled platforms. CRM and payment integration.",
        "price": "10–70k RUB"
      },
      "apps": {
        "title": "Applications",
        "description": "Native and web applications. Hand-coded, no constructor garbage.",
        "price": "150–500k RUB"
      },
      "websites": {
        "title": "Websites & Landings",
        "description": "Hand-coded from scratch. No Tilda/Webflow. Fully custom.",
        "price": "25–120k RUB"
      },
      "support": {
        "title": "Support",
        "description": "If our work breaks — we fix it within 48 hours for free. Long-term friendship welcome.",
        "price": "5–50k RUB"
      },
      "rework": {
        "title": "Rework",
        "description": "We take on existing projects. We'll analyze someone else's code, fix bugs, and polish it.",
        "price": "5–50k RUB"
      }
    },
    "cta": "Discuss Project"
  },
  "portfolio": {
    "title": "Portfolio",
    "subtitle": "Our Work",
    "empty": "First cases will appear here soon. Want to be the first?",
    "cta": "Message on Telegram"
  },
  "process": {
    "title": "Process",
    "subtitle": "How We Work",
    "steps": {
      "1": { "title": "Briefing", "description": "Call or chat. We discuss the task, fix requirements, deadlines, and budget." },
      "2": { "title": "Onboarding", "description": "We formalize requirements. Write specs, agree on designs and architecture." },
      "3": { "title": "Development", "description": "We code with progress reports. You see real-time progress." },
      "4": { "title": "Testing", "description": "3 days of testing on different devices and loads." },
      "5": { "title": "Launch", "description": "Project handover + manual. Guarantee: 48 hours to fix critical bugs." }
    }
  },
  "testimonials": {
    "title": "Testimonials",
    "subtitle": "What Clients Say",
    "cta": "Be Next"
  },
  "faq": {
    "title": "FAQ",
    "subtitle": "Frequently Asked Questions"
  },
  "footer": {
    "copyright": "© 2026 OTTISK. All rights reserved.",
    "telegram": "Telegram",
    "sitemap": "Sitemap",
    "privacy": "Privacy Policy",
    "made_with": "Made with",
    "by": "by OTTISK team"
  },
  "admin": {
    "title": "Admin Panel",
    "login": "Login",
    "password": "Password",
    "submit": "Sign In",
    "logout": "Logout",
    "portfolio": "Portfolio",
    "testimonials": "Testimonials",
    "stats": "Statistics",
    "visitors": "Visitors",
    "add": "Add",
    "edit": "Edit",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

## 8.6 Главная страница

**Файл:** `app/page.tsx`

```typescript
// ============================================
// ГЛАВНАЯ СТРАНИЦА: Сборка всех секций
// ============================================

import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Portfolio } from '@/components/sections/Portfolio';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Process />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
```

## 8.7 Состояния и сценарии

**Сценарий 1: Первый визит**
- Показать прелоадер
- Загрузить тему из localStorage или system preference
- Загрузить язык из URL или localStorage

**Сценарий 2: Возвращение пользователя**
- Пропустить прелоадер (или сократить до 0.5с)
- Применить сохранённые настройки темы/языка

**Сценарий 3: Переключение языка**
- Обновить URL (`/en` или `/`)
- Перезагрузить сообщения next-intl
- Сохранить выбор в localStorage

**Сценарий 4: Переключение темы**
- Мгновенное применение без перезагрузки
- Анимация перехода (0.3s ease)
- Сохранение в localStorage

## 8.8 Возможные риски и узкие места

| Риск | Вероятность | Влияние | Решение |
|------|-------------|---------|---------|
| FOUC при смене темы | Средняя | Среднее | suppressHydrationWarning, скрытие до mount |
| next-intl + App Router конфликт | Низкая | Высокое | Строго следовать документации v3 |
| Шрифты FOUT | Средняя | Низкое | font-display: swap, предзагрузка |
| Я.Метрика блокируется AdBlock | Высокая | Низкое | Не критично, fallback на Firebase Analytics |

## 8.9 Чего следует избегать

- ❌ Рендеринг на сервере с localStorage (гидратация!)
- ❌ Синхронный импорт тяжёлых библиотек
- ❌ Отсутствие `suppressHydrationWarning` для темы
- ❌ Хардкод локали в компонентах

## 8.10 Опциональные улучшения

- [ ] Предзагрузка критических шрифтов через `<link rel="preload">`
- [ ] Service Worker для оффлайн-кэширования
- [ ] Intersection Observer для ленивой загрузки секций

---

# 9. ФАЗА 2: ДИЗАЙН-СИСТЕМА И ТЕМЫ

> **Рекомендуемая модель:** Claude Opus 4.7
> **Обоснование:** Дизайн-система — фундамент. Ошибки в типографике, цветах или отступах каскадируют во все компоненты.

## 9.1 UI-компоненты

### Button

**Файл:** `components/ui/Button.tsx`

```typescript
'use client';

// ============================================
// BUTTON: Универсальная кнопка
// Варианты: primary, secondary, ghost
// Размеры: sm, md, lg
// ============================================

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Базовые стили
          'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',

          // Варианты
          variant === 'primary' && [
            'bg-primary text-neutral-900',
            'hover:bg-primary-300 hover:shadow-lg hover:shadow-primary/20',
            'rounded-full',
          ],
          variant === 'secondary' && [
            'bg-secondary text-white border border-secondary-300',
            'hover:bg-secondary-300 hover:border-primary/30',
            'rounded-full',
          ],
          variant === 'ghost' && [
            'bg-transparent text-foreground',
            'hover:bg-muted',
            'rounded-full',
          ],

          // Размеры
          size === 'sm' && 'px-4 py-2 text-sm',
          size === 'md' && 'px-6 py-3 text-base',
          size === 'lg' && 'px-8 py-4 text-lg',

          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

### Card

**Файл:** `components/ui/Card.tsx`

```typescript
// ============================================
// CARD: Карточка с hover glow эффектом
// ============================================

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = false, hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl bg-card p-6 transition-all duration-500',
          'border border-border',
          hover && 'hover:border-primary/30 hover:-translate-y-1',
          glow && 'hover:shadow-[0_0_30px_rgba(196,169,98,0.15)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
```

### Modal

**Файл:** `components/ui/Modal.tsx`

```typescript
'use client';

// ============================================
// MODAL: Модальное окно для услуг
// Анимация: fade + scale с spring-физикой
// ============================================

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  // Закрытие по Escape
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto',
              'bg-card rounded-3xl border border-border p-8',
              'shadow-2xl',
              className
            )}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>

            {title && (
              <h2 id="modal-title" className="text-h3 font-bold mb-6 pr-8">
                {title}
              </h2>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

## 9.2 Layout-компоненты

### Container

**Файл:** `components/layout/Container.tsx`

```typescript
// ============================================
// CONTAINER: Ограничение ширины контента
// ============================================

import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        size === 'narrow' && 'max-w-4xl',
        size === 'default' && 'max-w-container',
        size === 'wide' && 'max-w-[1600px]',
        className
      )}
    >
      {children}
    </div>
  );
}
```

## 9.3 Состояния и сценарии

**Сценарий 1: Hover на кнопке**
- Scale 0.98 при active
- Тень с цветом primary при hover
- Плавный переход 300ms

**Сценарий 2: Фокус с клавиатуры**
- Кольцо focus-visible с цветом primary
- Отступ ring-offset-2

**Сценарий 3: Disabled состояние**
- Opacity 50%
- Cursor not-allowed
- Нет hover-эффектов

## 9.4 Возможные риски

| Риск | Решение |
|------|---------|
| Неконсистентные отступы | Строгое следование spacing-scale |
| Цвета вне палитры | Использование только tailwind-config |
| Недостаточный контраст | Проверка через WebAIM Contrast Checker |

## 9.5 a11y чек-лист

- [ ] Кнопки имеют visible focus
- [ ] Модалка ловит фокус (focus trap)
- [ ] Закрытие модалки по Escape
- [ ] aria-label для иконок
- [ ] Контраст кнопок ≥ 4.5:1

---

# 10. ФАЗА 3: ПРЕЛОАДЕР И HERO-СЕКЦИЯ

> **Рекомендуемая модель:** Claude Opus 4.7
> **Обоснование:** Прелоадер с Fingerprint reveal — флагманская анимация проекта. Требует точной синхронизации GSAP timeline. Hero — первое впечатление, должно быть идеально.

## 10.1 Прелоадер (Fingerprint SVG Reveal)

**Файл:** `components/animations/Preloader.tsx`

```typescript
'use client';

// ============================================
// PRELOADER: Анимация "Отпечаток пальца"
// SVG-отпечаток рисуется stroke animation, затем загорается золотым
// 1. Линии отпечатка рисуются (stroke-dasharray) 
// 2. Золотое свечение заполняет линии
// 3. "Постановка" — elastic scale (1 → 0.95 → 1)
// 4. Fade to black + zoom (имитация "провала")
// ============================================

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsComplete(true);
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const paths = svgRef.current?.querySelectorAll('path');
      if (!paths) return;

      const tl = gsap.timeline({
        onComplete: () => {
          // Fade to black + zoom (имитация провала)
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.5,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
              setIsComplete(true);
              onComplete();
            },
          });
        },
      });

      // Начальное состояние: все пути скрыты
      gsap.set(paths, {
        strokeDasharray: 1000,
        strokeDashoffset: 1000,
        opacity: 0,
      });

      // Шаг 1: Линии рисуются
      tl.to(paths, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.05,
        ease: 'power2.out',
      })
      // Шаг 2: Золотое свечение
      .to(paths, {
        stroke: '#C4A962',
        strokeWidth: 2,
        duration: 0.5,
        ease: 'power2.out',
      })
      // Шаг 3: "Постановка" — elastic bounce
      .to(svgRef.current, {
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in',
      })
      .to(svgRef.current, {
        scale: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      })
      // Пауза перед transition
      .to({}, { duration: 0.5 });

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral"
      aria-hidden="true"
    >
      {/* SVG Отпечаток */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="w-48 h-48 sm:w-64 sm:h-64"
        style={{ willChange: 'transform' }}
      >
        {/* Центральная спираль */}
        <path
          d="M100 100 m-60 0 a60 60 0 1 0 120 0 a60 60 0 1 0 -120 0"
          fill="none"
          stroke="#3A3530"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M100 100 m-50 0 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0"
          fill="none"
          stroke="#3A3530"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M100 100 m-40 0 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0"
          fill="none"
          stroke="#3A3530"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M100 100 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0"
          fill="none"
          stroke="#3A3530"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M100 100 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0"
          fill="none"
          stroke="#3A3530"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M100 100 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0"
          fill="none"
          stroke="#3A3530"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* Радиальные линии */}
        <path d="M100 20 Q100 100 100 180" fill="none" stroke="#3A3530" strokeWidth="1" />
        <path d="M20 100 Q100 100 180 100" fill="none" stroke="#3A3530" strokeWidth="1" />
        <path d="M43 43 Q100 100 157 157" fill="none" stroke="#3A3530" strokeWidth="1" />
        <path d="M157 43 Q100 100 43 157" fill="none" stroke="#3A3530" strokeWidth="1" />
      </svg>

      {/* Подпись */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <p className="text-t60 text-sm tracking-[0.3em] uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
```

## 10.2 Hero-секция (с видео-фоном)

**Файл:** `components/sections/Hero.tsx`

> **ВАЖНО:** Видео-файлы должны быть размещены в `public/videos/`:
> - `fingerprint-loop.mp4` — видео отпечатка из частиц (loop, затемнённое)
> - `hero-background.mp4` — видео рук на клавиатуре (loop, затемнённое)
>
> См. инструкцию по подготовке видео в `VIDEO_SETUP.md`

```typescript
'use client';

// ============================================
// HERO: Первый экран с видео-фоном
// Элементы:
// - Видео-фон: отпечаток из частиц (loop, opacity 0.4)
// - Гигантское OTTISK (uppercase, tight letter-spacing)
// - Подзаголовок моноширинным
// - Одна CTA-кнопка (Telegram)
// - Scroll indicator
// ============================================

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/Button';
import { ArrowDown, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { reachGoal } from '@/lib/analytics';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('hero');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kinetic typography: буквы собираются
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.char');
        gsap.set(chars, { opacity: 0, y: 100 });
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.05,
          ease: 'power4.out',
          delay: 0.5,
        });
      }

      // Подзаголовок
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1.0,
      });

      // CTA
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        delay: 1.3,
      });

      // При скролле: видео затемняется, текст уходит
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (videoRef.current) {
            videoRef.current.style.opacity = String(0.4 - progress * 0.4);
          }
          if (titleRef.current) {
            gsap.set(titleRef.current, {
              y: -progress * 100,
              scale: 1 - progress * 0.1,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTelegramClick = () => {
    reachGoal('telegram_click');
    window.open('https://t.me/ottisk_lab', '_blank');
  };

  // Разбиение заголовка на символы
  const titleText = 'OTTISK';
  const titleChars = titleText.split('').map((char, i) => (
    <span key={i} className="char inline-block" style={{ willChange: 'transform, opacity' }}>
      {char}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Видео-фон: отпечаток из частиц */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.4 }}
      >
        <source src="/videos/fingerprint-loop.mp4" type="video/mp4" />
      </video>

      {/* Градиентный оверлей */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(20,18,16,0.3) 0%, rgba(20,18,16,0.6) 50%, rgba(20,18,16,0.9) 100%)'
        }}
      />

      {/* Контент */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Заголовок — гигантский, uppercase */}
        <h1
          ref={titleRef}
          className="text-display font-bold text-primary mb-6"
          style={{ letterSpacing: '-0.03em' }}
          aria-label="OTTISK"
        >
          {titleChars}
        </h1>

        {/* Подзаголовок — моноширинный */}
        <p
          ref={subtitleRef}
          className="font-mono text-sm tracking-[0.3em] uppercase text-text-muted mb-12"
        >
          {t('subtitle')}
        </p>

        {/* CTA — одна кнопка, как PLAY у ORYZO */}
        <div ref={ctaRef}>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Send className="h-5 w-5" />}
            onClick={handleTelegramClick}
            className="rounded-full px-10 py-5 text-lg"
          >
            {t('cta_primary')}
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-primary/60" />
      </div>
    </section>
  );
}
```

## 10.3 WebGL-фон с частицами кода

**Файл:** `components/effects/CodeParticles.tsx`

```typescript
'use client';

// ============================================
// CODE PARTICLES: WebGL-фон с плавающими символами кода
// Символы: { } // <> 01
// Fallback: CSS-градиент для мобильных и при ошибке WebGL
// ============================================

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Символы кода для отображения
const CODE_SYMBOLS = ['{', '}', '//', '<', '>', '01', '[]', '()', '=>', '&&', '||', '==='];

interface ParticleProps {
  position: [number, number, number];
  symbol: string;
  speed: number;
}

function CodeParticle({ position, symbol, speed }: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    // Плавающее движение по синусоиде
    meshRef.current.position.y = initialY + Math.sin(time * speed) * 0.5;
    meshRef.current.position.x = position[0] + Math.cos(time * speed * 0.5) * 0.3;
    // Медленное вращение
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    // Пульсация прозрачности
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.1 + Math.sin(time * speed * 2) * 0.05;
  });

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={0.3}
      color="#C4A962"
      anchorX="center"
      anchorY="middle"
    >
      {symbol}
    </Text>
  );
}

function ParticlesField() {
  const particles = useMemo(() => {
    const items: ParticleProps[] = [];
    for (let i = 0; i < 50; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10 - 5,
        ],
        symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
        speed: 0.2 + Math.random() * 0.5,
      });
    }
    return items;
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <CodeParticle key={i} {...p} />
      ))}
    </>
  );
}

// Fallback для мобильных и ошибок WebGL
function CSSFallback() {
  return (
    <div
      className="absolute inset-0 opacity-20"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(196, 169, 98, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 50%, rgba(44, 62, 80, 0.2) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, rgba(196, 169, 98, 0.1) 0%, transparent 50%)
        `,
      }}
    />
  );
}

export function CodeParticles() {
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверка мобильного устройства
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // На мобильных показываем CSS fallback
  if (isMobile || hasError) {
    return <CSSFallback />;
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        onError={() => setHasError(true)}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]} // Ограничение pixel ratio для производительности
      >
        <ambientLight intensity={0.5} />
        <ParticlesField />
      </Canvas>
    </div>
  );
}
```

## 10.4 Состояния и сценарии

**Сценарий 1: Первый визит**
- Показать прелоадер (2.5с)
- Затем показать Hero с анимациями

**Сценарий 2: Повторный визит**
- Пропустить прелоадер или сократить до 0.5с
- Проверка через localStorage (`ottisk-visited`)

**Сценарий 3: prefers-reduced-motion**
- Пропустить все анимации
- Мгновенное отображение контента

**Сценарий 4: Ошибка WebGL**
- Автоматический fallback на CSS-градиент
- Нет ошибок в консоли

## 10.5 Возможные риски

| Риск | Решение |
|------|---------|
| WebGL не поддерживается | CSS fallback |
| Прелоадер блокирует LCP | Максимум 3 секунды, затем force complete |
| Мерцание текста (FOIT) | font-display: swap |
| Низкий FPS на слабых устройствах | Уменьшение количества частиц, dpr limit |

## 10.6 a11y чек-лист

- [ ] Прелоадер имеет `aria-hidden="true"`
- [ ] Hero заголовок — единственный h1 на странице
- [ ] Кнопки имеют доступные имена
- [ ] Контраст текста на фоне ≥ 4.5:1
- [ ] Анимации уважают `prefers-reduced-motion`

## 10.7 Опциональные улучшения

- [ ] Прелоадер с прогресс-баром (загрузка шрифтов/ассетов)
- [ ] Интерактивные частицы (реакция на мышь)
- [ ] Видео-фон вместо WebGL (как в ORYZO)

---

# 11. ФАЗА 4: О НАС И ФИЛОСОФИЯ

> **Рекомендуемая модель:** Claude Sonnet 4.6
> **Обоснование:** Стандартная секция с parallax и kinetic typography. Sonnet справится быстро и качественно.

## 11.1 Секция "О нас" (Kinetic Typography)

**Файл:** `components/sections/About.tsx`

```typescript
'use client';

// ============================================
// ABOUT: Секция "О нас" — Kinetic Typography
// Анимации:
// - Слова появляются по одному, сдвигая предыдущие
// - "МЫ" → "ОСТАВЛЯЕМ" → "ОТПЕЧАТОК" (золотой)
// - Потом всё масштабируется в заголовок секции
// ============================================

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/layout/Container';
import { NumberCounter } from '@/components/animations/NumberCounter';
import { useTranslations } from 'next-intl';

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const kineticRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('about');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kinetic typography: слова появляются последовательно
      if (kineticRef.current) {
        const words = kineticRef.current.querySelectorAll('.kinetic-word');
        gsap.set(words, { opacity: 0, y: 100, scale: 1.5 });

        ScrollTrigger.create({
          trigger: kineticRef.current,
          start: 'top 80%',
          onEnter: () => {
            const tl = gsap.timeline();

            // "МЫ" — первое слово, гигантское
            tl.to(words[0], {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power4.out',
            })
            // "ОСТАВЛЯЕМ" — второе, сдвигает первое
            .to(words[1], {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power4.out',
            }, '-=0.4')
            // "ОТПЕЧАТОК" — третье, золотое
            .to(words[2], {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power4.out',
            }, '-=0.4')
            // Все слова масштабируются в заголовок
            .to(words, {
              scale: 0.6,
              y: -50,
              duration: 0.6,
              ease: 'power2.inOut',
            })
            .to(kineticRef.current, {
              opacity: 0,
              duration: 0.3,
            });
          },
          once: true,
        });
      }

      // Контент появляется после kinetic
      if (contentRef.current) {
        gsap.from(contentRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      }

      // Статистика
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.stat-item');
        gsap.from(items, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-30 overflow-hidden"
    >
      <Container>
        {/* Kinetic Typography */}
        <div ref={kineticRef} className="min-h-[50vh] flex items-center justify-center mb-16">
          <div className="text-center">
            <span className="kinetic-word block text-display font-bold text-foreground" style={{ willChange: 'transform, opacity' }}>
              МЫ
            </span>
            <span className="kinetic-word block text-display font-bold text-foreground" style={{ willChange: 'transform, opacity' }}>
              ОСТАВЛЯЕМ
            </span>
            <span className="kinetic-word block text-display font-bold text-primary" style={{ willChange: 'transform, opacity' }}>
              ОТПЕЧАТОК
            </span>
          </div>
        </div>

        {/* Контент */}
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-6">
            <p className="text-body text-muted-foreground leading-relaxed">
              {t('description')}
            </p>
            <p className="text-body text-foreground font-medium leading-relaxed border-l-2 border-primary pl-6">
              {t('philosophy')}
            </p>
          </div>

          {/* Статистика */}
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="stat-item text-center sm:text-left">
              <div className="text-display-sm font-bold text-primary mb-2">
                <NumberCounter end={72} suffix="" />
              </div>
              <p className="text-small text-muted-foreground">
                {t('stats.testing_label')}
              </p>
            </div>

            <div className="stat-item text-center sm:text-left">
              <div className="text-display-sm font-bold text-primary mb-2">
                <NumberCounter end={48} suffix="" />
              </div>
              <p className="text-small text-muted-foreground">
                {t('stats.support_label')}
              </p>
            </div>

            <div className="stat-item text-center sm:text-left">
              <div className="text-display-sm font-bold text-primary mb-2">
                <span className="font-mono">∞</span>
              </div>
              <p className="text-small text-muted-foreground">
                {t('stats.team_label')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

## 11.2 Number Counter

**Файл:** `components/animations/NumberCounter.tsx`

```typescript
'use client';

// ============================================
// NUMBER COUNTER: Цифры "крутятся" при появлении
// Использование: <NumberCounter end={72} suffix="ч" />
// ============================================

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';

interface NumberCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function NumberCounter({ end, duration = 2, suffix = '', prefix = '' }: NumberCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
```

## 11.3 Хук useInView

**Файл:** `hooks/useInView.ts`

```typescript
// ============================================
// USE IN VIEW: Хук для отслеживания видимости элемента
// ============================================

import { useEffect, useState, RefObject } from 'react';

interface UseInViewOptions {
  once?: boolean;
  margin?: string;
}

export function useInView(ref: RefObject<Element>, options: UseInViewOptions = {}) {
  const { once = true, margin = '0px' } = options;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { rootMargin: margin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, once, margin]);

  return isInView;
}
```

## 11.4 Состояния и сценарии

**Сценарий 1: Скролл до секции**
- Заголовок собирается из слов
- Контент появляется с parallax
- Счётчики запускаются при входе в viewport

**Сценарий 2: Быстрый скролл мимо**
- Анимации запускаются, но не мешают
- ScrollTrigger `once: true` предотвращает повтор

## 11.5 a11y чек-лист

- [ ] Статистика доступна для скринридеров (aria-label с полным текстом)
- [ ] Заголовок h2 иерархичен
- [ ] Контраст текста ≥ 4.5:1

---

# 12. ФАЗА 5: УСЛУГИ И МОДАЛЬНЫЕ ОКНА

> **Рекомендуемая модель:** Claude Sonnet 4.6
> **Обоснование:** Карточки с hover glow + модальные окна — типовые компоненты. Sonnet справится эффективно.

## 12.1 Секция "Услуги" (Таблица спецификаций ORYZO-стиль)

**Файл:** `components/sections/Services.tsx`

```typescript
'use client';

// ============================================
// SERVICES: Секция услуг — Таблица спецификаций
// НЕ карточки, а чистая техническая таблица как у ORYZO
// Линии рисуются при скролле, данные появляются по ячейкам
// ============================================

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import { reachGoal } from '@/lib/analytics';

const services = [
  { id: 'telegram', icon: 'Bot', duration: '3–14 дн', price: '5–60 тыс ₽', stack: 'Node.js, Bot API' },
  { id: 'social', icon: 'MessageCircle', duration: '5–21 дн', price: '10–70 тыс ₽', stack: 'VK API, Senler' },
  { id: 'websites', icon: 'Globe', duration: '7–30 дн', price: '25–120 тыс ₽', stack: 'Next.js, Tailwind' },
  { id: 'apps', icon: 'Smartphone', duration: '30–90 дн', price: '150–500 тыс ₽', stack: 'React Native' },
  { id: 'support', icon: 'Wrench', duration: '∞', price: '5–50 тыс ₽', stack: 'Любой стек' },
  { id: 'rework', icon: 'Code2', duration: '1–14 дн', price: '5–50 тыс ₽', stack: 'Анализ + фикс' },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('services');

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (tableRef.current) {
        // Линии таблицы рисуются сверху вниз
        const rows = tableRef.current.querySelectorAll('.spec-row');
        const lines = tableRef.current.querySelectorAll('.spec-line');

        gsap.from(lines, {
          scaleX: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 80%',
            once: true,
          },
        });

        // Данные появляются по ячейкам
        gsap.from(rows, {
          opacity: 0,
          x: -20,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: tableRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTelegramClick = () => {
    reachGoal('telegram_click_services');
    window.open('https://t.me/ottisk_lab', '_blank');
  };

  return (
    <section ref={sectionRef} id="services" className="py-30">
      <Container>
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h2 className="text-display-sm font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="font-mono text-sm tracking-[0.2em] uppercase text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Таблица спецификаций */}
        <div ref={tableRef} className="max-w-4xl mx-auto mb-12">
          {/* Заголовок таблицы */}
          <div className="spec-line h-px bg-border mb-4" />
          <div className="grid grid-cols-12 gap-4 px-4 mb-2 text-small font-mono text-muted-foreground uppercase tracking-wider">
            <div className="col-span-4">Услуга</div>
            <div className="col-span-2 text-center">Срок</div>
            <div className="col-span-3 text-center">Цена</div>
            <div className="col-span-3 text-right">Стек</div>
          </div>
          <div className="spec-line h-px bg-border mb-4" />

          {/* Строки */}
          {services.map((service) => (
            <div key={service.id}>
              <div className="spec-row grid grid-cols-12 gap-4 px-4 py-4 hover:bg-surface/50 transition-colors group cursor-pointer">
                <div className="col-span-4">
                  <span className="text-foreground font-bold group-hover:text-primary transition-colors">
                    {t(`items.${service.id}.title`)}
                  </span>
                </div>
                <div className="col-span-2 text-center font-mono text-muted-foreground">
                  {service.duration}
                </div>
                <div className="col-span-3 text-center font-mono text-primary font-bold">
                  {service.price}
                </div>
                <div className="col-span-3 text-right font-mono text-small text-muted-foreground">
                  {service.stack}
                </div>
              </div>
              <div className="spec-line h-px bg-border/50" />
            </div>
          ))}
        </div>

        {/* Дисклеймер */}
        <p className="text-center text-small text-muted-foreground max-w-2xl mx-auto mb-8 font-mono">
          {t('disclaimer')}
        </p>

        {/* CTA */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Send className="h-5 w-5" />}
            onClick={handleTelegramClick}
          >
            {t('cta')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
```

## 12.2 Состояния и сценарии

**Сценарий 1: Клик по карточке**
- Открывается модальное окно с деталями
- Фон блокируется (overflow: hidden)
- Фокус перемещается в модалку

**Сценарий 2: Закрытие модалки**
- Клик по backdrop
- Кнопка X
- Нажатие Escape
- Фокус возвращается на карточку

**Сценарий 3: Hover на карточке**
- Золотое свечение по границе
- Иконка масштабируется
- Стрелка сдвигается вправо

## 12.3 a11y чек-лист

- [ ] Карточки — кликабельные (role="button", tabIndex)
- [ ] Модалка — focus trap
- [ ] Закрытие по Escape
- [ ] aria-label для карточек
- [ ] Контраст цен ≥ 4.5:1

---

# 13. ФАЗА 6: ПОРТФОЛИО

> **Рекомендуемая модель:** Claude Sonnet 4.6
> **Обоснование:** Horizontal scroll + Firebase интеграция. Sonnet справится, при сложностях с R3D — переключиться на Opus.

## 13.1 Секция "Портфолио"

**Файл:** `components/sections/Portfolio.tsx`

```typescript
'use client';

// ============================================
// PORTFOLIO: Горизонтальный скролл внутри вертикального
// - Загрузка из Firebase Firestore
// - Fallback на локальные данные
// - Заглушки если нет данных
// ============================================

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { Send, FolderOpen, Plus } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { PortfolioItem } from '@/types';
import { reachGoal } from '@/lib/analytics';

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('portfolio');

  // Загрузка из Firebase
  useEffect(() => {
    async function loadPortfolio() {
      try {
        const snapshot = await getDocs(collection(db, 'portfolio'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as PortfolioItem[];

        if (data.length > 0) {
          setItems(data);
        } else {
          // Fallback: заглушки
          setItems([]);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  // Horizontal scroll animation
  useEffect(() => {
    if (items.length === 0 || !triggerRef.current || !scrollRef.current) return;

    const scrollWidth = scrollRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(scrollRef.current, {
        x: -(scrollWidth - viewportWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth - viewportWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items]);

  const handleTelegramClick = () => {
    reachGoal('telegram_click_portfolio');
    window.open('https://t.me/ottisk_lab', '_blank');
  };

  return (
    <section ref={sectionRef} id="portfolio" className="py-30">
      <Container className="mb-12">
        <div className="text-center">
          <h2 className="text-display-sm font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="font-serif italic text-h3 text-primary">
            {t('subtitle')}
          </p>
        </div>
      </Container>

      {/* Horizontal scroll container */}
      <div ref={triggerRef} className="relative">
        {items.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-6 px-4 sm:px-8 lg:px-12"
            style={{ width: 'max-content' }}
          >
            {items.map((item) => (
              <article
                key={item.id}
                className="w-[350px] sm:w-[450px] lg:w-[550px] flex-shrink-0 group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-secondary">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title.ru}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <FolderOpen className="h-16 w-16 opacity-30" />
                    </div>
                  )}

                  {/* Оверлей при hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3 className="text-h3 font-bold text-foreground mb-2">
                  {item.title.ru}
                </h3>

                <p className="text-body text-muted-foreground line-clamp-2">
                  {item.description.ru}
                </p>

                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-mono bg-secondary text-primary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          /* Заглушка если нет проектов */
          <Container>
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Plus className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-h2 font-bold text-foreground mb-4">
                {t('empty')}
              </h3>
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Send className="h-5 w-5" />}
                onClick={handleTelegramClick}
              >
                {t('cta')}
              </Button>
            </div>
          </Container>
        )}
      </div>
    </section>
  );
}
```

## 13.2 Состояния и сценарии

**Сценарий 1: Есть проекты в Firebase**
- Горизонтальный скролл с pin
- Карточки с изображениями и тегами

**Сценарий 2: Нет проектов**
- Показать заглушку с призывом
- Кнопка "Написать в Telegram"

**Сценарий 3: Ошибка загрузки**
- Показать заглушку
- Лог ошибки в консоль

## 13.3 a11y чек-лист

- [ ] Карточки проектов — article с заголовком
- [ ] Alt-тексты для изображений
- [ ] Горизонтальный скролл доступен с клавиатуры (Tab)
- [ ] Контраст тегов ≥ 4.5:1

---

# 14. ФАЗА 7: ПРОЦЕСС РАБОТЫ

> **Рекомендуемая модель:** Claude Sonnet 4.6
> **Обоснование:** Sticky section transitions — стандартный GSAP паттерн.

## 14.1 Секция "Процесс" (SVG Timeline)

**Файл:** `components/sections/Process.tsx`

```typescript
'use client';

// ============================================
// PROCESS: Временная шкала с "горящими" точками
// SVG-линия рисуется при скролле, точки загораются по очереди
// Цифры — моноширинные, как на старых плёнках
// ============================================

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/layout/Container';
import { useTranslations } from 'next-intl';

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<SVGSVGElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const t = useTranslations('process');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SVG линия рисуется
      if (timelineRef.current) {
        const line = timelineRef.current.querySelector('.timeline-line');
        if (line) {
          gsap.from(line, {
            strokeDashoffset: 1000,
            duration: 2,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: true,
            },
          });
        }

        // Точки загораются
        const dots = timelineRef.current.querySelectorAll('.timeline-dot');
        dots.forEach((dot, i) => {
          gsap.from(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: stepsRef.current[i],
              start: 'top 80%',
              once: true,
            },
          });
        });
      }

      // Шаги появляются
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        gsap.from(step, {
          opacity: 0,
          x: i % 2 === 0 ? -50 : 50,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 75%',
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = ['1', '2', '3', '4', '5'];

  return (
    <section ref={sectionRef} id="process" className="py-30">
      <Container>
        {/* Заголовок */}
        <div className="text-center mb-20">
          <h2 className="text-display-sm font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="font-mono text-sm tracking-[0.2em] uppercase text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Timeline SVG */}
        <div className="relative max-w-3xl mx-auto">
          <svg
            ref={timelineRef}
            className="absolute left-1/2 -translate-x-1/2 h-full w-4"
            viewBox="0 0 16 500"
            preserveAspectRatio="none"
          >
            <line
              className="timeline-line"
              x1="8" y1="0" x2="8" y2="500"
              stroke="#C4A962"
              strokeWidth="2"
              strokeDasharray="1000"
              strokeDashoffset="0"
              opacity="0.3"
            />
            {steps.map((_, i) => (
              <circle
                key={i}
                className="timeline-dot"
                cx="8"
                cy={50 + i * 100}
                r="6"
                fill="#141210"
                stroke="#C4A962"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Шаги */}
          <div className="space-y-24">
            {steps.map((stepNum, i) => (
              <div
                key={stepNum}
                ref={(el) => { stepsRef.current[i] = el; }}
                className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                  <span className="font-mono text-4xl font-bold text-primary/30 block mb-2">
                    0{stepNum}
                  </span>
                  <h3 className="text-h2 font-bold text-foreground mb-4">
                    {t(`steps.${stepNum}.title`)}
                  </h3>
                  <p className="text-body text-muted-foreground max-w-md">
                    {t(`steps.${stepNum}.description`)}
                  </p>
                </div>
                <div className="w-4" /> {/* Spacer для SVG */}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
```

## 14.2 a11y чек-лист

- [ ] Нумерация шагов — визуально и семантически понятна
- [ ] Контраст номеров ≥ 4.5:1
- [ ] Иконки имеют aria-hidden

---

# 15. ФАЗА 8: ОТЗЫВЫ

> **Рекомендуемая модель:** Claude Sonnet 4.6
> **Обоснование:** Карточки отзывов с аватарками — типовая задача. Sonnet справится.

## 15.1 Секция "Отзывы" (Цитаты на весь экран)

**Файл:** `components/sections/Testimonials.tsx`

```typescript
'use client';

// ============================================
// TESTIMONIALS: Цитаты на весь экран (как у ORYZO)
// НЕ карточки, а полноэкранные цитаты
// Слова появляются по одному, автор — после паузы
// Переключение свайпом или автоматически
// ============================================

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { reachGoal } from '@/lib/analytics';

const testimonialsData = [
  {
    id: '1',
    name: 'Алексей',
    location: 'г. Краснодар',
    role: 'Владелец онлайн-школы по йоге',
    text: 'Пацаны из Ottisk сделали мне Телеграм-бота за копейки относительно студий. Я если честно боялся — думал новички, накосячат. Но они три дня гоняли бота тестами, звонили по любому чиху. В итоге ученики теперь автоматом получают уроки, а я забыл, что такое ручная рассылка. Пацаны оставляют отпечаток, реально!',
  },
  {
    id: '2',
    name: 'Марина',
    location: 'г. Новосибирск',
    role: 'Инфобизнес',
    text: 'Мне нужен был лендинг с нуля, не на Тильде, потому что дизайн сложный. Ребята написали чистый код, всё адаптивно, скорость загрузки — пушка. Сказали, если упадет — 48 часов на починку. Пока не падало, но я спокойна. Отпечаток в истории? Они его оставили у меня в продажах.',
  },
  {
    id: '3',
    name: 'Екатерина',
    location: 'г. Сочи',
    role: 'Владелица кофейни',
    text: 'Искала простого бота для записи на каппинги. В крупных студиях отмахивались от мелкого заказа. Ottisk взялись с энтузиазмом: брифинг, вопросы, пробный запуск через 4 дня. Теперь бариста освобождены от телефона, а гости записываются в пару кликов. Рекомендую.',
  },
  {
    id: '4',
    name: 'Анжела',
    location: 'г. Екатеринбург',
    role: 'Блогер-миллионник',
    text: 'Нужен был бот-визитка с мультиссылками и автоприёмом донатов. Обратилась к Ottisk по рекомендации. Договорная цена, хотя сначала смутило. Но в итоге я получила даже больше функций, чем планировала, и всё уложилось в оговорённую сумму. Теперь мои админы отдыхают.',
  },
  {
    id: '5',
    name: 'Сергей',
    location: 'г. Владивосток',
    role: 'Основатель сети автосервисов',
    text: 'Заказывал лендинг для новой услуги. Сроки горели, ребята вошли в положение и сдали за 5 дней. Код без говна, не стыдно показать SEO-специалисту. Упавший сайт? Не слышал. Но знаю, что если что — бегом починят. Молодцы!',
  },
  {
    id: '6',
    name: 'Максим',
    location: 'г. Ростов-на-Дону',
    role: 'Менеджер event-агентства',
    text: 'Сделали телегу-бота для регистрации участников фестиваля. У нас 3000 человек прошло, ни одного глюка. Ребята протестировали нагрузку заранее. Потом еще и спасибо сказали, что мы их первые большие — теперь этот кейс себе в портфолио добавили. Мне не жалко, респект.',
  },
  {
    id: '7',
    name: 'Ольга',
    location: 'г. Тюмень',
    role: 'Преподаватель английского',
    text: 'Заказала простой бот для выдачи PDF-уроков. В процессе поняли, что можно добавить викторину. Ottisk быстро пересогласовали цену (договорная, помните?) и сделали конфетку. Теперь ученики вовлечены, а я получаю лиды без рекламы.',
  },
  {
    id: '8',
    name: 'Дамир',
    location: 'г. Уфа',
    role: 'Предприниматель по аренде авто',
    text: 'Нашёл ребят в чате предпринимателей. Кричали «новички», но я рискнул. Итог: система бронирования на сайте + бот в Телеграм. 48 часов на исправление? У них проблема решилась за 4 часа, когда хост лёг. Просто решают вопросы, а не прячутся. Теперь я их постоянный клиент.',
  },
  {
    id: '9',
    name: 'Вика',
    location: 'г. Омск',
    role: 'Хозяйка интернет-магазина бижутерии',
    text: 'Написала ребятам в Telegram, долго объясняла, что хочу чат-бота с каталогом. Парни не поленились созвониться, нарисовали схему на доске. Через неделю тестировали уже на моих подписчиках. Впервые бот не тупит, а продаёт на автомате. Очень человечный подход.',
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const quoteRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('testimonials');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Автопереключение каждые 8 секунд
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % testimonialsData.length);
      }, 8000);

      return () => clearInterval(interval);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Анимация при смене цитаты
  useEffect(() => {
    if (quoteRef.current) {
      const words = quoteRef.current.querySelectorAll('.quote-word');
      gsap.from(words, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power3.out',
      });
    }
  }, [current]);

  const handleTelegramClick = () => {
    reachGoal('telegram_click_testimonials');
    window.open('https://t.me/ottisk_lab', '_blank');
  };

  const testimonial = testimonialsData[current];
  const words = testimonial.text.split(' ');

  return (
    <section ref={sectionRef} id="testimonials" className="py-30 min-h-screen flex items-center">
      <Container>
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h2 className="text-display-sm font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="font-mono text-sm tracking-[0.2em] uppercase text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Цитата на весь экран */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div ref={quoteRef}>
            <blockquote className="text-h2 font-medium text-foreground leading-relaxed mb-8">
              "{words.map((word, i) => (
                <span key={i} className="quote-word inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}"
            </blockquote>
          </div>

          {/* Автор */}
          <div className="mt-8">
            <div className="font-bold text-foreground text-lg">
              {testimonial.name}
            </div>
            <div className="text-small text-muted-foreground">
              {testimonial.location}
            </div>
            <div className="text-small text-primary">
              {testimonial.role}
            </div>
          </div>
        </div>

        {/* Навигация */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)}
            className="p-2 rounded-full hover:bg-surface transition-colors"
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>

          <div className="flex gap-2">
            {testimonialsData.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-primary w-6' : 'bg-primary/30'
                }`}
                aria-label={`Отзыв ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrent((prev) => (prev + 1) % testimonialsData.length)}
            className="p-2 rounded-full hover:bg-surface transition-colors"
            aria-label="Следующий отзыв"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<Send className="h-5 w-5" />}
            onClick={handleTelegramClick}
          >
            {t('cta')}
          </Button>
        </div>
      </Container>
    </section>
  );
}
```

## 15.2 a11y чек-лист

- [ ] Blockquote семантически корректен
- [ ] Рейтинг — aria-label с текстовым описанием
- [ ] Аватарки имеют alt-текст (или aria-hidden)

---

# 16. ФАЗА 9: FAQ

> **Рекомендуемая модель:** Claude Sonnet 4.6
> **Обоснование:** Accordion с spring-физикой — стандартный компонент.

## 16.1 Секция "FAQ"

**Файл:** `components/sections/FAQ.tsx`

```typescript
'use client';

// ============================================
// FAQ: Аккордеон с spring-физикой
// 9 вопросов, загрузка из config/content.json
// ============================================

import { useState, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container } from '@/components/layout/Container';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqData = [
  {
    id: '1',
    question: 'Вы новички, какой у вас опыт? Почему я должен доверять?',
    answer: 'Мы в начале пути, но наш багаж — это реальное умение писать чистый код и огромное желание расти. Мы компенсируем отсутствие портфолио тройным контролем: брифинг, тестирование 72 часа перед запуском и бесплатным ремонтом в течение 48 часов. Вы получаете не «кот в мешке», а проект, который прошёл проверку огнём.',
  },
  {
    id: '2',
    question: 'Какие чат-боты вы делаете и для каких платформ?',
    answer: 'Делаем ботов для Telegram и любых соцсетей, где есть API — ВКонтакте, VK Mini Apps, Senler и других. Можем написать кастомного бота под специфическую платформу. Всё зависит от вашей задачи: от простого автоответчика до полноценного магазина с приёмом платежей.',
  },
  {
    id: '3',
    question: 'Вы делаете только под ключ или можете доделать начатое?',
    answer: 'Берёмся и за готовые проекты при наличии исходных файлов кода. Разберём чужой код, исправим баги и доведём до ума.',
  },
  {
    id: '4',
    question: 'Как строится сотрудничество?',
    answer: '1. Созвон/чат — обсуждаем задачу. 2. Onboarding-бриф: фиксируем все хотелки, сроки, бюджет. 3. Разработка с промежуточными отчётами. 4. Тестирование 3 дня силами команды. 5. Передача проекта + инструкция (если нужна). 6. Поддержка: упало — чиним 48 часов.',
  },
  {
    id: '5',
    question: 'Какие гарантии, что бот/сайт не ляжет?',
    answer: 'Мы тестируем на разных устройствах, нагрузках и сценариях. Плюс гарантия: в течение оговорённого срока после запуска любые критичные ошибки исправляются бесплатно.',
  },
  {
    id: '6',
    question: 'Цены — почему договорные?',
    answer: 'Каждый проект уникален. Мы не берём фикс с потолка, а оцениваем трудозатраты. Вы платите за реальный объём кода и логики, а не за красивую презентацию.',
  },
  {
    id: '7',
    question: 'Вы работаете только по предоплате?',
    answer: 'Обычно 50/50 или разбивка по этапам — это обсуждается на брифе. Главное — чтобы обе стороны чувствовали себя в безопасности.',
  },
  {
    id: '8',
    question: 'Есть ли у вас специализация по автоворонкам?',
    answer: 'Да. Мы можем запрограммировать бота под выстроенную маркетинговую схему: выдачу лид-магнитов, квизы, мультишаговые прогревы, интеграцию с CRM и платёжками.',
  },
  {
    id: '9',
    question: 'Берёте ли доработки и поддержку после сдачи?',
    answer: 'Конечно. Тариф на поддержку после завершения гарантийного срока обговаривается отдельно, но мы всегда открыты к долгосрочной дружбе.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-h3 font-medium text-foreground pr-8 group-hover:text-primary transition-colors">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'h-6 w-6 flex-shrink-0 text-primary transition-transform duration-500',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-500"
        style={{
          height,
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // spring
        }}
      >
        <div ref={contentRef} className="pb-6">
          <p className="text-body text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('faq');

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (listRef.current) {
        const items = listRef.current.querySelectorAll('.faq-item');
        gsap.from(items, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="py-30">
      <Container size="narrow">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h2 className="text-display-sm font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="font-serif italic text-h3 text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Список вопросов */}
        <div ref={listRef}>
          {faqData.map((item) => (
            <div key={item.id} className="faq-item">
              <FAQItem
                question={item.question}
                answer={item.answer}
                isOpen={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
```

## 16.2 a11y чек-лист

- [ ] Кнопка аккордеона имеет aria-expanded
- [ ] Один открытый вопрос за раз (или несколько — обсудить)
- [ ] Фокус виден на кнопке
- [ ] Контраст текста вопроса ≥ 4.5:1

---

# 17. ФАЗА 10: FOOTER И НАВИГАЦИЯ

> **Рекомендуемая модель:** Claude Sonnet 4.6
> **Обоснование:** Smart header + footer — стандартные компоненты.

## 17.1 Smart Header

**Файл:** `components/layout/Header.tsx`

```typescript
'use client';

// ============================================
// HEADER: Smart header
// - Скрывается при скролле вниз
// - Появляется при скролле вверх
// - Переключатель темы
// - Переключатель языка
// - Навигация по якорям
// ============================================

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/effects/ThemeProvider';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/navigation';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Monitor,
  Send 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { reachGoal } from '@/lib/analytics';

const navItems = [
  { href: '#about', label: 'about' },
  { href: '#services', label: 'services' },
  { href: '#portfolio', label: 'portfolio' },
  { href: '#process', label: 'process' },
  { href: '#testimonials', label: 'testimonials' },
  { href: '#faq', label: 'faq' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Показать/скрыть в зависимости от направления скролла
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTelegramClick = () => {
    reachGoal('telegram_click_header');
    window.open('https://t.me/ottisk_lab', '_blank');
  };

  const toggleLocale = () => {
    const newLocale = locale === 'ru' ? 'en' : 'ru';
    // next-intl перенаправит автоматически
    window.location.href = `/${newLocale}${pathname}`;
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isVisible ? 'translate-y-0' : '-translate-y-full',
          isScrolled && 'bg-background/80 backdrop-blur-xl border-b border-border'
        )}
      >
        <div className="container-ottisk flex items-center justify-between h-16 lg:h-20">
          {/* Логотип */}
          <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="text-xl font-bold text-primary">
            OTTISK
          </a>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-small text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(item.label)}
              </a>
            ))}
          </nav>

          {/* Правые элементы */}
          <div className="flex items-center gap-4">
            {/* Переключатель темы */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Переключить тему"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Переключатель языка */}
            <button
              onClick={toggleLocale}
              className="text-small font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Переключить язык"
            >
              {locale === 'ru' ? 'RU' : 'EN'}
            </button>

            {/* CTA */}
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:flex"
              leftIcon={<Send className="h-4 w-4" />}
              onClick={handleTelegramClick}
            >
              Telegram
            </Button>

            {/* Мобильное меню */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
              aria-label="Меню"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background transition-transform duration-500 lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-h2 font-bold text-foreground hover:text-primary transition-colors"
            >
              {t(item.label)}
            </a>
          ))}

          <Button
            variant="primary"
            size="lg"
            leftIcon={<Send className="h-5 w-5" />}
            onClick={handleTelegramClick}
          >
            Telegram
          </Button>
        </div>
      </div>
    </>
  );
}
```

## 17.2 Footer (стандартный)

**Файл:** `components/layout/Footer.tsx`

```typescript
// ============================================
// FOOTER: Стандартный подвал
// - © OTTISK
// - Ссылка на Telegram
// - Карта сайта
// - Политика конфиденциальности
// ============================================

import { Container } from '@/components/layout/Container';
import { useTranslations } from 'next-intl';
import { Send, Heart } from 'lucide-react';
import { reachGoal } from '@/lib/analytics';

export function Footer() {
  const t = useTranslations('footer');

  const handleTelegramClick = () => {
    reachGoal('telegram_click_footer');
    window.open('https://t.me/ottisk_lab', '_blank');
  };

  return (
    <footer className="border-t border-border py-12">
      <Container>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Бренд */}
          <div>
            <div className="text-2xl font-bold text-primary mb-4">OTTISK</div>
            <p className="text-small text-muted-foreground">
              {t('copyright')}
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="font-bold text-foreground mb-4">{t('sitemap')}</h4>
            <nav className="space-y-2">
              {['about', 'services', 'portfolio', 'process', 'testimonials', 'faq'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="block text-small text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-bold text-foreground mb-4">{t('contact')}</h4>
            <button
              onClick={handleTelegramClick}
              className="flex items-center gap-2 text-small text-primary hover:text-primary-300 transition-colors"
            >
              <Send className="h-4 w-4" />
              {t('telegram')}
            </button>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-small text-muted-foreground">
            {t('made_with')} <Heart className="h-3 w-3 inline text-red-500" /> {t('by')}
          </p>
          <a
            href="#"
            className="text-small text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('privacy')}
          </a>
        </div>
      </Container>
    </footer>
  );
}
```

## 17.3 a11y чек-лист

- [ ] Header — фокус на навигации виден
- [ ] Мобильное меню — закрытие по Escape
- [ ] Footer — семантические заголовки
- [ ] Ссылки имеют hover-стили

---

# 18. ФАЗА 11: АДМИН-ПАНЕЛЬ

> **Рекомендуемая модель:** Claude Opus 4.7
> **Обоснование:** Firebase интеграция, аутентификация, CRUD-операции. Требуется архитектурная точность.

## 18.1 Структура админ-панели

**Маршрут:** `/admin`
**Защита:** Пароль `GHEYNJK35ifj@` (хранится в `.env.local`)
**Функционал:**
- Статистика посетителей (счётчик из Firebase)
- Управление портфолио (CRUD)
- Управление отзывами (CRUD)
- Редактирование информации

## 18.2 Страница входа

**Файл:** `app/admin/login/page.tsx`

```typescript
'use client';

// ============================================
// ADMIN LOGIN: Страница входа в админ-панель
// Пароль проверяется на сервере через API
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Установка cookie сессии
        document.cookie = 'admin_session=true; path=/; max-age=86400';
        router.push('/admin');
      } else {
        setError('Неверный пароль');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border">
        <div className="text-center mb-8">
          <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-h2 font-bold text-foreground">Админ-панель</h1>
          <p className="text-muted-foreground">OTTISK</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loading}
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
```

## 18.3 API для входа

**Файл:** `app/api/admin/login/route.ts`

```typescript
// ============================================
// API: Проверка пароля админ-панели
// ============================================

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
```

## 18.4 Dashboard

**Файл:** `app/admin/page.tsx`

```typescript
'use client';

// ============================================
// ADMIN DASHBOARD: Главная страница админки
// - Статистика посетителей
// - Быстрые ссылки на управление
// ============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  FolderOpen, 
  MessageSquare, 
  LogOut,
  TrendingUp 
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    visitors: 0,
    portfolio: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверка авторизации
    const isAuth = document.cookie.includes('admin_session=true');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }

    loadStats();
  }, [router]);

  async function loadStats() {
    try {
      const [portfolioSnap, testimonialsSnap] = await Promise.all([
        getDocs(collection(db, 'portfolio')),
        getDocs(collection(db, 'testimonials')),
      ]);

      setStats({
        visitors: 0, // Будет обновляться через Firebase Analytics
        portfolio: portfolioSnap.size,
        testimonials: testimonialsSnap.size,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral p-8">
      <div className="max-w-6xl mx-auto">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-h1 font-bold text-foreground">Админ-панель OTTISK</h1>
          <Button variant="ghost" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
            Выйти
          </Button>
        </div>

        {/* Статистика */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="text-h2 font-bold">{stats.visitors}</div>
                <div className="text-small text-muted-foreground">Посетители</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <FolderOpen className="h-8 w-8 text-primary" />
              <div>
                <div className="text-h2 font-bold">{stats.portfolio}</div>
                <div className="text-small text-muted-foreground">Проекты</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <div className="text-h2 font-bold">{stats.testimonials}</div>
                <div className="text-small text-muted-foreground">Отзывы</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Управление */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => router.push('/admin/portfolio')}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-h3 font-bold mb-2">Портфолио</h3>
                <p className="text-muted-foreground">Добавляйте, редактируйте и удаляйте проекты</p>
              </div>
              <FolderOpen className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="cursor-pointer hover:border-primary/50" onClick={() => router.push('/admin/testimonials')}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-h3 font-bold mb-2">Отзывы</h3>
                <p className="text-muted-foreground">Управляйте отзывами клиентов</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## 18.5 Управление портфолио

**Файл:** `app/admin/portfolio/page.tsx`

```typescript
'use client';

// ============================================
// ADMIN PORTFOLIO: CRUD для проектов
// - Список проектов
// - Добавление/редактирование/удаление
// ============================================

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { PortfolioItem } from '@/types';

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: { ru: '', en: '' },
    description: { ru: '', en: '' },
    image: '',
    tags: '',
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const snapshot = await getDocs(collection(db, 'portfolio'));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PortfolioItem[];
    setItems(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    if (editingItem) {
      await updateDoc(doc(db, 'portfolio', editingItem.id), data);
    } else {
      await addDoc(collection(db, 'portfolio'), data);
    }

    setIsModalOpen(false);
    setEditingItem(null);
    loadItems();
  }

  async function handleDelete(id: string) {
    if (confirm('Удалить проект?')) {
      await deleteDoc(doc(db, 'portfolio', id));
      loadItems();
    }
  }

  return (
    <div className="min-h-screen bg-neutral p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-h1 font-bold">Управление портфолио</h1>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditingItem(null);
              setFormData({ title: { ru: '', en: '' }, description: { ru: '', en: '' }, image: '', tags: '' });
              setIsModalOpen(true);
            }}
          >
            Добавить проект
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id}>
              {item.image && (
                <img src={item.image} alt={item.title.ru} className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
              <h3 className="font-bold mb-2">{item.title.ru}</h3>
              <p className="text-small text-muted-foreground mb-4 line-clamp-2">{item.description.ru}</p>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Pencil className="h-4 w-4" />}
                  onClick={() => {
                    setEditingItem(item);
                    setFormData({
                      title: item.title,
                      description: item.description,
                      image: item.image,
                      tags: item.tags?.join(', ') || '',
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 className="h-4 w-4 text-red-500" />}
                  onClick={() => handleDelete(item.id)}
                >
                  Удалить
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Модалка формы */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Редактировать проект' : 'Новый проект'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Название (RU)"
            value={formData.title.ru}
            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ru: e.target.value } })}
          />
          <Input
            placeholder="Название (EN)"
            value={formData.title.en}
            onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
          />
          <textarea
            placeholder="Описание (RU)"
            value={formData.description.ru}
            onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ru: e.target.value } })}
            className="w-full p-3 rounded-xl bg-muted border border-border text-foreground resize-none h-24"
          />
          <Input
            placeholder="URL изображения"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
          <Input
            placeholder="Теги (через запятую)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
          <Button type="submit" variant="primary" className="w-full">
            {editingItem ? 'Сохранить' : 'Добавить'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
```

## 18.6 a11y чек-лист

- [ ] Формы имеют label
- [ ] Кнопки удаления — с подтверждением
- [ ] Ошибки форм отображаются
- [ ] Загрузка состояний показываются

---

# 19. ФАЗА 12: SEO, МЕТРИКА, ДЕПЛОЙ

> **Рекомендуемая модель:** Claude Sonnet 4.6
> **Обоснование:** Стандартные задачи — sitemap, robots, OG-теги, деплой на Vercel.

## 19.1 Sitemap

**Файл:** `app/sitemap.ts`

```typescript
// ============================================
// SITEMAP: Генерация карты сайта
// ============================================

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ottisk.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];
}
```

## 19.2 Robots.txt

**Файл:** `app/robots.ts`

```typescript
// ============================================
// ROBOTS: Настройка индексации
// ============================================

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ottisk.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## 19.3 Schema.org разметка

**Добавить в `app/layout.tsx` внутри `<head>`:**

```typescript
// Schema.org Organization
const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OTTISK',
  description: 'Команда веб-разработки',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  sameAs: ['https://t.me/ottisk_lab'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['Russian', 'English'],
  },
};

// Внутри <head>:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
/>
```

## 19.4 Деплой на Vercel

**КОДЕР:** Следовать инструкциям:

1. Создать репозиторий на GitHub
2. Запушить код
3. Подключить репозиторий в Vercel Dashboard
4. Добавить Environment Variables из `.env.local`
5. Деплой автоматический при каждом пуше

**Файл:** `vercel.json` (опционально)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

---

# 20. ФАЗА 13: ФИНАЛЬНАЯ СБОРКА И QA

> **Рекомендуемая модель:** Claude Opus 4.7
> **Обоснование:** Финальная проверка всех фаз, создание QA-файлов, README, CREDITS.

## 20.1 Контрольный чек-лист

### Производительность
- [ ] Lighthouse Performance > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] 60fps на всех анимациях

### Функциональность
- [ ] Все CTA ведут в Telegram
- [ ] Модальные окна открываются/закрываются
- [ ] FAQ accordion работает
- [ ] Переключатель темы работает
- [ ] Переключатель языка работает
- [ ] Админ-панель доступна по /admin
- [ ] Firebase чтение/запись работает

### Адаптивность
- [ ] Desktop (1920x1080)
- [ ] Laptop (1440x900)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile landscape

### Доступность
- [ ] Все a11y чек-листы пройдены
- [ ] Тест с клавиатуры (Tab, Enter, Escape)
- [ ] Тест с скринридером (NVDA/VoiceOver)
- [ ] Контраст проверен

### SEO
- [ ] Мета-теги заполнены
- [ ] OG-теги работают
- [ ] Sitemap.xml доступен
- [ ] Robots.txt настроен
- [ ] Schema.org разметка валидна

## 20.2 Создание финальных файлов

### README.md

```markdown
# OTTISK Landing

Лендинг-портфолио для команды веб-разработки OTTISK.

## Быстрый старт

```bash
make all
```

Или пошагово:

```bash
make install  # Установка зависимостей
make build    # Сборка production
make start    # Запуск сервера
```

## Структура проекта

См. [Архитектурный файл](architecture.md)

## Конфигурация

1. Скопируйте `.env.example` в `.env.local`
2. Заполните Firebase и Яндекс.Метрика ключи
3. Настройте админ-пароль

## Деплой

Автоматический деплой на Vercel при пуше в main.

## Админ-панель

Доступна по `/admin`. Пароль в `.env.local`.
```

### CREDITS.md

```markdown
# Благодарности

## Автор идеи
Основатель команды OTTISK

## Технологии
- Next.js 14 (Vercel)
- Tailwind CSS
- GSAP + ScrollTrigger
- Framer Motion
- React Three Fiber
- Firebase Firestore
- Яндекс.Метрика

## Референсы
- ORYZO (oryzo.ai) — Lusion
- Gyöngy Gora (gyongy.framer.website)

## Шрифты
- Manrope (Google Fonts)
- JetBrains Mono (Google Fonts)
- Playfair Display (Google Fonts)

## Контакты
- Telegram: https://t.me/ottisk_lab
```

### GLOSSARY.md

```markdown
# Глоссарий

- **OTTISK** — название команды (произносится "От-тиск")
- **Fingerprint reveal** — анимация появления текста как отпечаток
- **Kinetic typography** — анимированная типографика
- **Parallax** — эффект глубины при скролле
- **Sticky section** — секция, прилипающая к экрану
- **Spring-физика** — анимация с эластичным замедлением
- **Hover glow** — золотое свечение при наведении
- **WebGL** — веб-графика для 3D-эффектов
```

---

# 21. ТРЕКЕР ВЫПОЛНЕНИЯ

## Фазы

- [ ] **Фаза 0:** Архитектура и конфигурация (Opus 4.7)
  - [ ] Next.js проект создан
  - [ ] Зависимости установлены
  - [ ] Tailwind настроен
  - [ ] TypeScript типы созданы
  - [ ] Firebase инициализирован
  - [ ] Makefile создан
  - [ ] `controlQA_фаза0.md`

- [ ] **Фаза 1:** Базовая структура (Opus 4.7)
  - [ ] Корневой layout
  - [ ] ThemeProvider
  - [ ] i18n конфигурация
  - [ ] Яндекс.Метрика
  - [ ] Главная страница
  - [ ] `controlQA_фаза1.md`

- [ ] **Фаза 2:** Дизайн-система (Opus 4.7)
  - [ ] Button
  - [ ] Card
  - [ ] Modal
  - [ ] Container
  - [ ] `controlQA_фаза2.md`

- [ ] **Фаза 3:** Прелоадер и Hero (Opus 4.7)
  - [ ] Fingerprint reveal
  - [ ] Kinetic typography
  - [ ] WebGL-фон
  - [ ] CTA кнопки
  - [ ] `controlQA_фаза3.md`

- [ ] **Фаза 4:** О нас (Sonnet 4.6)
  - [ ] Parallax layers
  - [ ] Number counter
  - [ ] Статистика
  - [ ] `controlQA_фаза4.md`

- [ ] **Фаза 5:** Услуги (Sonnet 4.6)
  - [ ] Карточки услуг
  - [ ] Hover glow
  - [ ] Модальные окна
  - [ ] Цены и дисклеймер
  - [ ] `controlQA_фаза5.md`

- [ ] **Фаза 6:** Портфолио (Sonnet 4.6)
  - [ ] Horizontal scroll
  - [ ] Firebase интеграция
  - [ ] Заглушки
  - [ ] `controlQA_фаза6.md`

- [ ] **Фаза 7:** Процесс (Sonnet 4.6)
  - [ ] Sticky transitions
  - [ ] 5 шагов
  - [ ] Иконки
  - [ ] `controlQA_фаза7.md`

- [ ] **Фаза 8:** Отзывы (Sonnet 4.6)
  - [ ] 9 карточек
  - [ ] Аватарки-заглушки
  - [ ] Анимация появления
  - [ ] `controlQA_фаза8.md`

- [ ] **Фаза 9:** FAQ (Sonnet 4.6)
  - [ ] Accordion
  - [ ] Spring-физика
  - [ ] 9 вопросов
  - [ ] `controlQA_фаза9.md`

- [ ] **Фаза 10:** Footer и навигация (Sonnet 4.6)
  - [ ] Smart header
  - [ ] Footer
  - [ ] Мобильное меню
  - [ ] `controlQA_фаза10.md`

- [ ] **Фаза 11:** Админ-панель (Opus 4.7)
  - [ ] Страница входа
  - [ ] API авторизации
  - [ ] Dashboard
  - [ ] CRUD портфолио
  - [ ] CRUD отзывов
  - [ ] `controlQA_фаза11.md`

- [ ] **Фаза 12:** SEO и деплой (Sonnet 4.6)
  - [ ] Sitemap
  - [ ] Robots.txt
  - [ ] Schema.org
  - [ ] OG-теги
  - [ ] Деплой на Vercel
  - [ ] `controlQA_фаза12.md`

- [ ] **Фаза 13:** Финальная сборка (Opus 4.7)
  - [ ] QA чек-лист
  - [ ] README.md
  - [ ] CREDITS.md
  - [ ] GLOSSARY.md
  - [ ] ASSETS_PLACEHOLDER.md
  - [ ] `controlQA_фаза13.md`

## Финальные файлы

- [ ] `README.md`
- [ ] `CREDITS.md`
- [ ] `GLOSSARY.md`
- [ ] `ASSETS_PLACEHOLDER.md`

---

*Архитектурный файл создан: 2026-05-05*
*Версия: 1.0*
*Режим: Экстремальный + Полный аудит*
