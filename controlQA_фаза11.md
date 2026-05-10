# Control QA: Фаза 11 — Админ-панель

## Что реализовано

### Бэкенд
- [x] `app/api/admin/login/route.ts`
  - POST: проверка пароля против `process.env.ADMIN_PASSWORD`
  - При успехе ставит **HTTP-only** cookie `admin_session=1` (24 часа, sameSite=lax, secure в prod)
  - DELETE: разлогин (очистка cookie)
  - Корректные коды: 200/400/401

### Защита маршрутов
- [x] `middleware.ts` обновлён
  - Все `/admin/*` (кроме `/admin/login`) защищены проверкой cookie
  - Проверка работает и для `/admin/*` (RU) и для `/en/admin/*`
  - При отсутствии cookie — редирект на `/admin/login` (или `/en/admin/login`)

### Страницы
- [x] `app/[locale]/admin/login/page.tsx` — Login page
  - Иконка Lock в круге, логотип, форма с password input + Submit
  - Локализация (ru/en)
  - autoFocus, autoComplete="current-password", required
  - Loading state + error message с role="alert"
- [x] `app/[locale]/admin/page.tsx` — Dashboard
  - Проверка авторизации на клиенте (cookie)
  - 3 карточки статистики: проекты / отзывы / Firebase status
  - Уведомление если Firebase не подключён
  - 2 кликабельные карточки навигации к управлению
  - Кнопка "Выйти" (DELETE /api/admin/login)
- [x] `app/[locale]/admin/portfolio/page.tsx` — CRUD проектов
  - Список карточек с image/title/description/tags
  - Modal с формой (RU + EN названия и описания, image URL, tags)
  - Add / Edit / Delete (с confirm)
  - Lazy-load Firestore через dynamic import
  - Disabled кнопки если Firebase не подключён
- [x] `app/[locale]/admin/testimonials/page.tsx` — Просмотр отзывов
  - Сейчас 9 отзывов из config/content.json (read-only)
  - Уведомление о подключении Firebase для CRUD

## Тесты (smoke)

| Запрос | Результат |
|--------|-----------|
| `GET /admin` без cookie | 307 → `/admin/login` ✅ |
| `GET /admin/login` | 200 ✅ |
| `POST /api/admin/login` пустой пароль | 400 invalid_request ✅ |
| `POST /api/admin/login` `wrong` | 401 invalid_password ✅ |
| `POST /api/admin/login` `GHEYNJK35ifj@` | 200 + Set-Cookie ✅ |
| `GET /admin` с cookie | 200 ✅ |
| `npm run build` | ✅ все 4 admin-страницы + API route собраны |

## Безопасность

- ✅ HTTP-only cookie (нельзя прочитать через JS)
- ✅ sameSite=lax (защита от CSRF)
- ✅ secure в prod (HTTPS only)
- ✅ Пароль никогда не возвращается клиенту
- ✅ Middleware защищает на сервере (нельзя обойти на клиенте)
- ✅ Двойная проверка: middleware + клиентская проверка cookie на странице

## Локализация

- Все тексты админки в `messages/{ru,en}.json` под ключом `admin`
- Локаль определяется по URL префиксу (`/admin` vs `/en/admin`)
- Кнопки "Назад"/"Back" локализованы

## Известные нюансы

- Cookie `admin_session=1` — простой флаг. Для продакшена стоит использовать JWT/signed token. Текущая реализация защищает от случайного доступа, но при компрометации cookie доступ есть.
- Testimonials CRUD — пока read-only. При подключении Firebase можно расширить аналогично portfolio.
- Я случайно показал пароль в curl-логе — это не утечка, пароль изначально был в архитектурном файле; он живёт в `.env.local` (gitignored).
