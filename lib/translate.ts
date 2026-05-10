// ============================================
// TRANSLATE: Авто-перевод RU → EN через MyMemory API
// Бесплатный сервис, без API-ключа.
// Лимит для незарегистрированных: ~5000 слов/день с одного IP.
// Документация: https://mymemory.translated.net/doc/spec.php
// ============================================

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match?: number;
  };
  responseStatus: number;
  responseDetails?: string;
}

/**
 * Переводит текст с русского на английский.
 * Возвращает переведённый текст или бросает Error.
 */
export async function translateRuToEn(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // MyMemory имеет лимит 500 символов за запрос для незарегистрированных
  if (trimmed.length > 500) {
    // Разбиваем на предложения и переводим частями, потом склеиваем
    const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [trimmed];
    const parts: string[] = [];
    for (const s of sentences) {
      const part = await fetchTranslation(s.trim());
      parts.push(part);
    }
    return parts.join(' ');
  }

  return fetchTranslation(trimmed);
}

async function fetchTranslation(text: string): Promise<string> {
  if (!text) return '';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=ru|en`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`MyMemory API HTTP ${res.status}`);
  }
  const data = (await res.json()) as MyMemoryResponse;
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'Translation failed');
  }
  return data.responseData.translatedText;
}
