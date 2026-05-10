// ============================================
// PHONE: Маска ввода и валидация телефонных номеров
// Принцип: пользователь вводит что угодно — мы фильтруем только цифры
// и форматируем как +7 (XXX) XXX-XX-XX (стандарт RU/KZ).
// Если номер не RU/KZ — оставляем как +<digits> без форматирования.
// ============================================

/** Возвращает только цифры из произвольной строки. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Форматирует телефон под международный +7 (XXX) XXX-XX-XX.
 * Если первая цифра 8 — заменяется на 7.
 * Если введено 0 цифр — возвращается пустая строка.
 */
export function formatPhone(value: string): string {
  let digits = digitsOnly(value);
  if (!digits) return '';

  // Нормализация: 8XXXXXXXXXX → 7XXXXXXXXXX
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  // Если первая цифра не 7 — добавляем 7 в начало (для удобства)
  if (!digits.startsWith('7')) digits = '7' + digits;
  // Обрезаем до 11 цифр (RU-стандарт)
  digits = digits.slice(0, 11);

  const parts: string[] = ['+7'];
  if (digits.length > 1) parts.push(' (' + digits.slice(1, 4));
  if (digits.length >= 4) parts[1] += ')';
  if (digits.length > 4) parts.push(' ' + digits.slice(4, 7));
  if (digits.length > 7) parts.push('-' + digits.slice(7, 9));
  if (digits.length > 9) parts.push('-' + digits.slice(9, 11));

  return parts.join('');
}

/** Проверяет, что в номере 11 цифр (RU-стандарт). */
export function isValidPhone(value: string): boolean {
  return digitsOnly(value).length === 11;
}

/** Возвращает полный номер с + (для tel: и WhatsApp ссылок). */
export function toE164(value: string): string {
  let d = digitsOnly(value);
  if (d.startsWith('8')) d = '7' + d.slice(1);
  return '+' + d;
}
