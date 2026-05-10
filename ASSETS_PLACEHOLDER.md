# Активы проекта OTTISK

Документация по замене активов сайта.

## Логотип

### `public/photos/logo.jpeg` (оригинал)
- Формат: JPEG
- Цвет: жёлтый отпечаток на белом фоне
- Заменить: положите новый файл с тем же именем

### `public/photos/logo.png` (PNG с прозрачным фоном)
- Формат: PNG RGBA, 512×512
- Создан из jpeg через `ffmpeg colorkey` (удалён белый фон)
- Пересоздать: см. инструкцию ниже

### `public/icons/logo.svg` (векторный)
- Формат: SVG
- Цвет: `currentColor` (наследуется от родителя)
- Использование: компонент `<Logo>` (`components/ui/Logo.tsx`)
- Размер файла: 1.3 KB
- Особенность: каждый `path` имеет атрибут `data-fp-path` для GSAP анимации stroke draw
- Заменить: после изменения `logo.svg` обновите также SVG в `Logo.tsx` (`FingerprintMark`)

### `public/icons/favicon.svg` (упрощённый)
- Формат: SVG
- Размер: 525 B, viewBox 32×32
- Цвет: `#C4A962` (фиксированный)
- Заменить: положите новый SVG-файл

### Иконки (PNG)
- `public/icons/favicon-16.png` (16×16)
- `public/icons/favicon-32.png` (32×32)
- `public/icons/apple-touch-icon.png` (180×180, золотой на тёмном)
- `public/og-image.jpg` (1200×630, для шаринга в соцсетях)

### Регенерация PNG из обновлённого логотипа

```bash
cd public
# 1. Обновите photos/logo.jpeg
# 2. Перегенерируйте PNG с прозрачным фоном:
ffmpeg -y -i photos/logo.jpeg -vf "colorkey=0xFFFFFF:0.30:0.10,scale=512:512:flags=lanczos,format=rgba" -frames:v 1 photos/logo.png

# 3. Обновите все иконки:
ffmpeg -y -i photos/logo.png -vf "scale=32:32:flags=lanczos" icons/favicon-32.png
ffmpeg -y -i photos/logo.png -vf "scale=16:16:flags=lanczos" icons/favicon-16.png

ffmpeg -y -f lavfi -i "color=c=0x141210:s=180x180" -i photos/logo.png -filter_complex "[1:v]scale=140:140[fp];[0:v][fp]overlay=(W-w)/2:(H-h)/2" -frames:v 1 icons/apple-touch-icon.png

# 4. OG-image:
ffmpeg -y -f lavfi -i "color=c=0x141210:s=1200x630" -i photos/logo.png -filter_complex "[1:v]scale=400:400[fp];[0:v][fp]overlay=(W-w)/2:(H-h)/2" -frames:v 1 og-image.jpg
```

## Видео

### `public/videos/fingerprint-loop.mp4`
- **Назначение:** Фон Hero-секции (отпечаток из частиц)
- **Размер:** ~13 МБ (можно сжать до 5-7 МБ для прода)
- **Формат:** MP4 H.264, 1920×1080, ~5-10с loop, без звука
- **Замена:** положите новый файл с тем же именем

### `public/videos/hero-background.mp4`
- **Назначение:** Альтернативный фон (опционально)
- **Сейчас:** не используется в коде (заготовка на будущее)

### Сжатие видео
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -vf "fps=24,scale=1920:1080" -an output.mp4
```

## Изображения портфолио

### Через админ-панель (рекомендуется)
1. Откройте `/admin` (пароль в `.env.local`)
2. Перейдите в "Портфолио" → "Добавить проект"
3. URL изображения вставьте в поле — изображения хранятся вне проекта (например, Firebase Storage, Cloudinary, ваш CDN)

### Локально (для разработки)
- Положите изображения в `public/portfolio/`
- В админке используйте URL вида `/portfolio/your-image.jpg`

## Аватары отзывов

Сейчас отзывы не имеют аватаров (по дизайну ORYZO — только цитаты).
Если нужно добавить:
- Папка: `public/avatars/`
- Формат: JPG/PNG, 200×200
- Имя: `[client-name].jpg`
- В коде: расширить тип `Testimonial` в `types/index.ts` (поле `avatar` уже есть)

## Open Graph изображение

`public/og-image.jpg` — превью при шаринге в Telegram, Twitter, Facebook.
- Размер: 1200×630 (рекомендация)
- Сейчас: золотой отпечаток на тёмном фоне
- Можно перерисовать в Figma и заменить файл

## Robots.txt и Sitemap.xml

Генерируются автоматически:
- `/robots.txt` — `app/robots.ts`
- `/sitemap.xml` — `app/sitemap.ts`

Для добавления страниц в sitemap — отредактируйте `app/sitemap.ts`.
