'use client';

// ============================================
// HOOK: Актуальный курс USD/RUB от ЦБ РФ
// Загружается один раз, кешируется в памяти сессии
// ============================================

import { useEffect, useState } from 'react';

let cachedRate: number | null = null;

export function useExchangeRate(): number {
  const [rate, setRate] = useState<number>(cachedRate ?? 90);

  useEffect(() => {
    if (cachedRate !== null) {
      setRate(cachedRate);
      return;
    }
    fetch('/api/exchange-rate')
      .then((r) => r.json())
      .then((data: { rate?: number }) => {
        const r = data.rate ?? 90;
        cachedRate = r;
        setRate(r);
      })
      .catch(() => {
        // Используем fallback
      });
  }, []);

  return rate;
}

/**
 * Конвертирует рублёвое значение в доллары и округляет в большую сторону.
 * Пример: 2300.9 → 2301$, 1998.89 → 1999$
 */
export function rubToUsd(rubValue: number, rate: number): number {
  return Math.ceil(rubValue / rate);
}

/**
 * Парсит строку цены вида "5–60 тыс ₽" → { from: 5000, to: 60000 }
 * или "150–500 тыс ₽" → { from: 150000, to: 500000 }
 */
export function parseRubPrice(priceRu: string): { from: number; to: number } | null {
  // Формат: "5–60 тыс ₽" или "25–120 тыс ₽"
  const match = priceRu.match(/(\d+)[–-](\d+)\s*тыс/);
  if (!match) return null;
  return {
    from: parseInt(match[1]) * 1000,
    to: parseInt(match[2]) * 1000,
  };
}

/**
 * Форматирует цену в долларах для отображения.
 * Пример: from=5000, to=60000, rate=90 → "$56–$667"
 */
export function formatUsdPrice(priceRu: string, rate: number): string {
  const parsed = parseRubPrice(priceRu);
  if (!parsed) return priceRu; // fallback — оставляем оригинал
  const fromUsd = rubToUsd(parsed.from, rate);
  const toUsd = rubToUsd(parsed.to, rate);
  return `$${fromUsd.toLocaleString('en-US')}–$${toUsd.toLocaleString('en-US')}`;
}
