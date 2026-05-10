// ============================================
// API: Курс USD/RUB от ЦБ РФ
// Кешируется на 1 час (revalidate: 3600)
// ============================================

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Fallback курс если API ЦБ недоступен
const FALLBACK_RATE = 90;

export async function GET() {
  try {
    const res = await fetch(
      'https://www.cbr-xml-daily.ru/daily_json.js',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error('CBR API error');
    const data = (await res.json()) as { Valute?: { USD?: { Value?: number } } };
    const rate = data?.Valute?.USD?.Value;
    if (!rate || typeof rate !== 'number') throw new Error('Invalid rate');
    return NextResponse.json({ rate: Math.round(rate) }, {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
    });
  } catch {
    return NextResponse.json({ rate: FALLBACK_RATE }, {
      headers: { 'Cache-Control': 'public, max-age=1800, s-maxage=1800' },
    });
  }
}
