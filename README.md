# OTTISK Landing

Лендинг-портфолио для команды веб-разработки **OTTISK**. Премиальный дизайн в тёплых тонах под влиянием [ORYZO](https://oryzo.ai).

## Стек

- **Next.js 14** (App Router) + **TypeScript 5**
- **Tailwind CSS 3** + CSS Variables (тёмная/светлая/системная темы)
- **GSAP 3** + ScrollTrigger (скролл-анимации)
- **Framer Motion 11** (Modal, transitions)
- **next-intl 3** (RU / EN, default RU)
- **Firebase 10** (Firestore — для портфолио и админки)
- **Яндекс.Метрика** (опционально)
- Шрифты: **Manrope** + **JetBrains Mono**

## Быстрый старт

```bash
# 1. Установка
make install
# или: npm install

# 2. Конфигурация
cp .env.example .env.local
# Заполните Firebase ключи и Яндекс.Метрика ID (можно позже)

# 3. Запуск
make dev
# Открыть http://localhost:3000
```

## Команды

```bash
make install   # npm install
make dev       # dev-сервер
make build     # production build
make start     # запуск собранного приложения
make lint      # eslint
make clean     # очистка .next и node_modules
make all       # install + build + start
```

## Структура

```
ottisk-site/
├── app/
│   ├── layout.tsx                   # Root: html/body, шрифты, темы, аналитика
│   ├── globals.css                  # Tailwind + CSS-переменные тем
│   ├── sitemap.ts / robots.ts       # SEO
│   ├── api/admin/login/route.ts     # API авторизации админки
│   └── [locale]/                    # Локализованные маршруты (ru/en)
│       ├── layout.tsx               # NextIntlClientProvider + Schema.org
│       ├── page.tsx                 # Главная страница
│       └── admin/                   # Админка (login / dashboard / CRUD)
├── components/
│   ├── ui/                          # Button, Card, Modal, Input, Logo
│   ├── layout/                      # Header (Smart), Footer, Container
│   ├── sections/                    # Hero, About, Services, Portfolio,
│   │                                # Process, Testimonials, FAQ
│   ├── animations/                  # Preloader, NumberCounter, PreloaderGate
│   └── effects/                     # ThemeProvider, GrainOverlay
├── config/
│   ├── theme.json                   # Цвета, шрифты, анимации
│   ├── content.json                 # Услуги (6), Отзывы (9), FAQ (9)
│   └── site.json                    # URL, Telegram, контакты
├── messages/
│   ├── ru.json                      # Русская локализация
│   └── en.json                      # Английская локализация
├── data/
│   └── portfolio.json               # Fallback (если Firebase недоступен)
├── lib/
│   ├── utils.ts                     # cn(), formatNumber, prefersReducedMotion
│   ├── firebase.ts                  # Lazy-инициализация (с проверкой ключей)
│   ├── gsap.ts                      # Регистрация ScrollTrigger
│   └── analytics.tsx                # Яндекс.Метрика + reachGoal
├── hooks/
│   └── useInView.ts                 # IntersectionObserver
├── public/
│   ├── videos/
│   │   ├── fingerprint-loop.mp4     # Видео-фон Hero
│   │   └── hero-background.mp4
│   ├── photos/
│   │   ├── logo.jpeg                # Оригинал
│   │   └── logo.png                 # PNG с прозрачным фоном (512x512)
│   ├── icons/
│   │   ├── logo.svg                 # Векторный логотип
│   │   ├── favicon.svg / .png       # Favicon
│   │   └── apple-touch-icon.png     # 180x180
│   └── og-image.jpg                 # 1200x630 для соцсетей
├── i18n.ts                          # next-intl config
├── middleware.ts                    # i18n + защита /admin
├── navigation.ts                    # Локализованный роутер
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── Makefile
```

## Темы

Сайт поддерживает 3 режима темы:
- **Dark** (по умолчанию) — тёплый антрацит `#141210`
- **Light** — светлый кремовый
- **System** — следует системным настройкам

Переключение через иконку солнце/луна в шапке, сохраняется в `localStorage` (`ottisk-theme`).

## Локализация

- **Default:** RU (URL без префикса: `/`)
- **EN:** `/en`

Переключение через кнопку **RU/EN** в шапке. Всё содержимое выводится из `messages/{locale}.json`.

## Админ-панель

Доступна по `/admin` (или `/en/admin`).

**Пароль:** хранится в `.env.local` под ключом `ADMIN_PASSWORD`.

### Возможности
- Dashboard со статистикой (количество проектов, отзывов, статус Firebase)
- CRUD управление портфолио (если Firebase подключён)
- Просмотр отзывов

### Безопасность
- HTTP-only cookie `admin_session`
- sameSite=lax + secure (в prod)
- Защита через middleware (нельзя обойти на клиенте)
- Срок действия сессии: 24 часа

## Firebase (опционально)

Сайт работает БЕЗ Firebase (заглушки и fallback). Для подключения:

1. Создайте проект в [Firebase Console](https://console.firebase.google.com)
2. Включите Firestore (test mode)
3. Скопируйте ключи в `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
4. Перезапустите dev-сервер
5. В админке появятся CRUD-функции

## Яндекс.Метрика (опционально)

В `.env.local`:
```
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678
```

Цели аналитики автоматически отправляются при кликах в Telegram (по разделам: hero, services, portfolio, testimonials, header, footer).

## Деплой на Vercel

```bash
# 1. Создайте репозиторий на GitHub и запушьте код
git init
git add .
git commit -m "Initial commit"
git remote add origin <repo-url>
git push -u origin main

# 2. Импортируйте в Vercel Dashboard
# 3. Добавьте Environment Variables из .env.local
# 4. Деплой автоматический при каждом push
```

## Видео для Hero

Файлы должны быть в `public/videos/`:
- `fingerprint-loop.mp4` — фон Hero (золотой отпечаток из частиц)
- `hero-background.mp4` — альтернативный фон (опционально)

Рекомендации: 1920×1080, H.264, 5-7 МБ, без звука. См. `VIDEO_SETUP.md`.

## Контакты

- **Telegram:** [@ottisk_lab](https://t.me/ottisk_lab)

---

Сделано с ♥ командой OTTISK
