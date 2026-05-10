// ============================================
// API: Отправка заявки с сайта на ottiskcomp@gmail.com
// Поддерживает 2 транспорта:
//
// 1) Resend (HTTPS API, рекомендуется в РФ — не блокируется провайдерами)
//    ENV: RESEND_API_KEY=re_xxxxxxxxxxxxxxx
//         RESEND_FROM=onboarding@resend.dev  (опц., если не верифицирован домен)
//
// 2) Nodemailer + Gmail SMTP (App Password) — fallback
//    ENV: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
//
// Куда: CONTACT_TO=ottiskcomp@gmail.com (по умолчанию = SMTP_USER или RESEND_FROM)
// ============================================

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { ContactPayload, ContactServiceId } from '@/types';

export const runtime = 'nodejs';

// Карта названий услуг для письма (RU + EN)
const SERVICE_LABELS: Record<ContactServiceId, { ru: string; en: string }> = {
  telegram: { ru: 'Телеграм-боты', en: 'Telegram bots' },
  social: { ru: 'Чат-боты для соцсетей', en: 'Social media bots' },
  websites: { ru: 'Сайты и лендинги', en: 'Websites & landings' },
  apps: { ru: 'Приложения', en: 'Applications' },
  support: { ru: 'Поддержка', en: 'Support' },
  rework: { ru: 'Доработка', en: 'Rework' },
  other: { ru: 'Другое', en: 'Other' },
};

const CHANNEL_LABELS = {
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
} as const;

interface IncomingPayload extends ContactPayload {
  locale?: 'ru' | 'en';
  turnstileToken?: string;
}

/** Верификация Cloudflare Turnstile токена на сервере */
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Если ключ не задан — пропускаем (dev-режим)
  if (token === 'dev-token') return true; // dev-токен из TurnstileWidget

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function clean(s: unknown, max: number): string {
  if (typeof s !== 'string') return '';
  const trimmed = s.trim().slice(0, max);
  // Удаляем управляющие символы, кроме \n
  return trimmed.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '');
}

function buildPlainText(p: IncomingPayload): string {
  const lang = p.locale === 'en' ? 'en' : 'ru';
  const serviceLabel =
    p.service === 'other' && p.customService
      ? `${SERVICE_LABELS.other[lang]}: ${p.customService}`
      : SERVICE_LABELS[p.service][lang];

  return [
    'Новая заявка с сайта OTTISK',
    '──────────────────────────────',
    `ФИО:          ${p.name}`,
    `Телефон:      ${p.phone}`,
    `Email:        ${p.email}`,
    `Способ связи: ${CHANNEL_LABELS[p.channel]} → ${p.channelHandle}`,
    `Услуга:       ${serviceLabel}`,
    '──────────────────────────────',
    'Текст обращения:',
    '',
    p.message,
    '',
    `Источник: сайт OTTISK (${lang.toUpperCase()})`,
    `Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`,
  ].join('\n');
}

function buildHtml(p: IncomingPayload): string {
  const lang = p.locale === 'en' ? 'en' : 'ru';
  const serviceLabel =
    p.service === 'other' && p.customService
      ? `${SERVICE_LABELS.other[lang]}: ${escapeHtml(p.customService)}`
      : SERVICE_LABELS[p.service][lang];

  const channelTitle = CHANNEL_LABELS[p.channel];
  const channelLink =
    p.channel === 'telegram'
      ? p.channelHandle.replace(/^@/, '').match(/^[a-zA-Z0-9_]{4,}$/)
        ? `https://t.me/${p.channelHandle.replace(/^@/, '')}`
        : null
      : `https://wa.me/${p.channelHandle.replace(/\D/g, '')}`;

  const channelHtml = channelLink
    ? `<a href="${channelLink}" style="color:#C4A962;text-decoration:none">${escapeHtml(p.channelHandle)}</a>`
    : escapeHtml(p.channelHandle);

  return `<!DOCTYPE html>
<html lang="ru">
<body style="margin:0;padding:24px;background:#141210;color:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Manrope,sans-serif;line-height:1.6">
  <div style="max-width:560px;margin:0 auto;background:#1E1A16;border:1px solid #2A2520;border-radius:16px;padding:28px">
    <h1 style="margin:0 0 18px;color:#C4A962;font-size:22px;font-weight:800">OTTISK · Новая заявка</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#9A8B7A;width:140px">ФИО</td><td style="padding:8px 0;color:#F5F0E8;font-weight:600">${escapeHtml(p.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#9A8B7A">Телефон</td><td style="padding:8px 0"><a href="tel:${escapeHtml(p.phone.replace(/\D/g, ''))}" style="color:#C4A962;text-decoration:none">${escapeHtml(p.phone)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#9A8B7A">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(p.email)}" style="color:#C4A962;text-decoration:none">${escapeHtml(p.email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#9A8B7A">${channelTitle}</td><td style="padding:8px 0">${channelHtml}</td></tr>
      <tr><td style="padding:8px 0;color:#9A8B7A">Услуга</td><td style="padding:8px 0;color:#F5F0E8">${serviceLabel}</td></tr>
    </table>
    <div style="margin-top:24px;padding-top:18px;border-top:1px solid #2A2520">
      <div style="color:#9A8B7A;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:10px;font-family:'JetBrains Mono',monospace">Текст обращения</div>
      <div style="white-space:pre-wrap;color:#F5F0E8;background:#141210;border:1px solid #2A2520;border-radius:12px;padding:14px;font-size:14px">${escapeHtml(p.message)}</div>
    </div>
    <p style="margin:20px 0 0;color:#9A8B7A;font-size:12px;font-family:'JetBrains Mono',monospace">
      Сайт OTTISK · ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК
    </p>
  </div>
</body>
</html>`;
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

interface SendArgs {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo: string;
  fromName: string;
}

/** Отправка через Resend (HTTPS API). */
async function sendViaResend(args: SendArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY!;
  // Resend в sandbox без своего домена шлёт только с onboarding@resend.dev
  const fromEmail = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const from = `${args.fromName} <${fromEmail}>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject: args.subject,
      text: args.text,
      html: args.html,
      reply_to: args.replyTo,
    }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { name?: string; message?: string };
    throw new Error(`[resend] ${res.status} ${data.name || ''}: ${data.message || res.statusText}`);
  }
}

/** Отправка через Nodemailer (Gmail SMTP). */
async function sendViaSmtp(args: SendArgs): Promise<void> {
  const port = Number(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: process.env.SMTP_SECURE === 'true' ? true : port === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 12_000,
  });

  await transporter.sendMail({
    from: `"${args.fromName}" <${process.env.SMTP_USER}>`,
    to: args.to,
    replyTo: args.replyTo,
    subject: args.subject,
    text: args.text,
    html: args.html,
  });
}

export async function POST(request: Request) {
  // === Валидация входных данных ===
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const body = raw as Partial<IncomingPayload>;

  // === Проверка Turnstile (если настроен) ===
  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
    const valid = await verifyTurnstile(token);
    if (!valid) {
      return NextResponse.json({ ok: false, error: 'captcha_failed' }, { status: 400 });
    }
  }

  const payload: IncomingPayload = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 254),
    channel: body.channel === 'whatsapp' ? 'whatsapp' : 'telegram',
    channelHandle: clean(body.channelHandle, 80),
    service: ((): ContactServiceId => {
      const v = body.service;
      const valid: ContactServiceId[] = [
        'telegram',
        'social',
        'websites',
        'apps',
        'support',
        'rework',
        'other',
      ];
      return valid.includes(v as ContactServiceId) ? (v as ContactServiceId) : 'other';
    })(),
    customService: clean(body.customService, 140) || undefined,
    message: clean(body.message, 2000),
    locale: body.locale === 'en' ? 'en' : 'ru',
  };

  if (!payload.name || !payload.phone || !payload.email || !payload.channelHandle || !payload.message) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }
  if (!isValidEmail(payload.email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (payload.message.length < 10) {
    return NextResponse.json({ ok: false, error: 'message_too_short' }, { status: 400 });
  }
  if (payload.service === 'other' && !payload.customService) {
    return NextResponse.json({ ok: false, error: 'missing_custom_service' }, { status: 400 });
  }

  // === Проверка наличия хотя бы одного транспорта ===
  if (!isResendConfigured() && !isSmtpConfigured()) {
    console.warn('[Contact] No transport configured, payload received:', payload);
    return NextResponse.json(
      { ok: false, error: 'smtp_not_configured' },
      { status: 503 }
    );
  }

  // === Подготовка письма ===
  const to = process.env.CONTACT_TO || process.env.SMTP_USER || process.env.RESEND_FROM!;
  const subject =
    payload.locale === 'en'
      ? `[OTTISK] New request — ${payload.name}`
      : `[OTTISK] Новая заявка — ${payload.name}`;

  const sendArgs: SendArgs = {
    to,
    subject,
    text: buildPlainText(payload),
    html: buildHtml(payload),
    replyTo: `${payload.name} <${payload.email}>`,
    fromName: 'OTTISK Site',
  };

  // === Попытка 1: Resend (приоритет, не блокируется ISP) ===
  if (isResendConfigured()) {
    try {
      await sendViaResend(sendArgs);
      return NextResponse.json({ ok: true, transport: 'resend' });
    } catch (err) {
      const e = err as { message?: string };
      console.error('[Contact] Resend failed:', e.message);
      // Если SMTP не настроен — отдаём ошибку Resend
      if (!isSmtpConfigured()) {
        return NextResponse.json(
          { ok: false, error: e.message || 'resend_failed' },
          { status: 502 }
        );
      }
      // Иначе fallback на SMTP
      console.warn('[Contact] Falling back to SMTP…');
    }
  }

  // === Попытка 2: Nodemailer (Gmail SMTP) ===
  try {
    await sendViaSmtp(sendArgs);
    return NextResponse.json({ ok: true, transport: 'smtp' });
  } catch (err) {
    const e = err as { message?: string; code?: string };
    console.error('[Contact] sendMail error', err);
    return NextResponse.json(
      { ok: false, error: e.message || 'send_failed', code: e.code },
      { status: 500 }
    );
  }
}
