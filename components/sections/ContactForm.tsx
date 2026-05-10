'use client';

// ============================================
// CONTACT FORM: Модалка заявки
// Поля: ФИО, телефон (маска +7), email, способ связи (Telegram/WhatsApp + handle),
// услуга (dropdown из content.json + "Другое"), текст обращения.
// Отправка: POST /api/contact → Nodemailer → ottiskcomp@gmail.com
// Анимация: spring-модалка из Modal + плавное появление полей через Framer Motion.
// ============================================

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Send, Loader2, Check, AlertCircle, Phone } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPhone, isValidPhone } from '@/lib/phone';
import { reachGoal } from '@/lib/analytics';
import contentConfig from '@/config/content.json';
import type { ContactPayload, ContactServiceId } from '@/types';
import { TurnstileWidget } from '@/components/effects/TurnstileWidget';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  channelHandle: string;
  service: ContactServiceId;
  customService: string;
  message: string;
  agreed: boolean;
}

const INITIAL_STATE: FormState = {
  name: '',
  phone: '',
  email: '',
  channelHandle: '',
  service: 'websites',
  customService: '',
  message: '',
  agreed: false,
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const t = useTranslations('contact_form');
  const locale = useLocale();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Сброс при открытии/закрытии
  useEffect(() => {
    if (!isOpen) {
      // Чистим только если успешно отправили — иначе сохраняем введённое
      if (status === 'success') {
        setForm(INITIAL_STATE);
        setStatus('idle');
        setErrorMessage(null);
        setValidationErrors({});
      }
    } else {
      // При открытии: фокус на первое поле
      const id = window.setTimeout(() => firstFieldRef.current?.focus(), 200);
      return () => window.clearTimeout(id);
    }
  }, [isOpen, status]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePhoneChange = (raw: string) => {
    updateField('phone', formatPhone(raw));
  };

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) errors.name = t('errors.name_required');
    if (!form.phone.trim()) errors.phone = t('errors.phone_required');
    else if (!isValidPhone(form.phone)) errors.phone = t('errors.phone_invalid');
    if (!form.email.trim()) errors.email = t('errors.email_required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t('errors.email_invalid');
    if (!form.channelHandle.trim()) errors.channelHandle = t('errors.channel_required');
    if (form.service === 'other' && !form.customService.trim())
      errors.customService = t('errors.custom_service_required');
    if (!form.message.trim() || form.message.trim().length < 10)
      errors.message = t('errors.message_required');
    if (!form.agreed) errors.agreed = t('errors.agree_required');
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validate()) return;

    setStatus('submitting');

    const payload: ContactPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      channel: 'telegram',
      channelHandle: form.channelHandle.trim(),
      service: form.service,
      customService: form.service === 'other' ? form.customService.trim() : undefined,
      message: form.message.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, locale, turnstileToken }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }
      reachGoal('contact_form_submit');
      setStatus('success');
    } catch (err) {
      const e = err as { message?: string };
      console.error('[ContactForm] submit error', err);
      setStatus('error');
      setErrorMessage(e.message || t('errors.submit_failed'));
    }
  };

  const services = contentConfig.services.items;

  return (
    <Modal
      isOpen={isOpen}
      onClose={status === 'submitting' ? () => undefined : onClose}
      title={status === 'success' ? t('success_title') : t('title')}
      closeAriaLabel={t('close')}
      className="max-w-xl sm:max-w-2xl"
    >
      {status === 'success' ? (
        <SuccessView t={t} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
          {/* ФИО */}
          <FormRow
            index={0}
            label={t('field_name')}
            error={validationErrors.name}
            id="cf-name"
          >
            <Input
              id="cf-name"
              ref={firstFieldRef}
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder={t('placeholder_name')}
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(validationErrors.name)}
              required
            />
          </FormRow>

          {/* Телефон */}
          <FormRow
            index={1}
            label={t('field_phone')}
            error={validationErrors.phone}
            id="cf-phone"
          >
            <Input
              id="cf-phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              autoComplete="tel"
              aria-invalid={Boolean(validationErrors.phone)}
              required
            />
          </FormRow>

          {/* Email */}
          <FormRow
            index={2}
            label={t('field_email')}
            error={validationErrors.email}
            id="cf-email"
          >
            <Input
              id="cf-email"
              type="email"
              inputMode="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(validationErrors.email)}
              required
            />
          </FormRow>

          {/* Telegram username */}
          <FormRow
            index={3}
            label={t('field_channel')}
            error={validationErrors.channelHandle}
            id="cf-channel-handle"
          >
            <Input
              id="cf-channel-handle"
              value={form.channelHandle}
              onChange={(e) => {
                let val = e.target.value;
                // Маска: всегда начинается с @
                if (val && !val.startsWith('@')) val = '@' + val;
                // Убираем лишние @ в середине
                val = val.replace(/(?!^)@/g, '');
                updateField('channelHandle', val);
              }}
              placeholder={t('placeholder_telegram')}
              autoComplete="username"
              maxLength={33}
              aria-invalid={Boolean(validationErrors.channelHandle)}
              required
            />
          </FormRow>

          {/* Услуга */}
          <FormRow index={4} label={t('field_service')} id="cf-service">
            <select
              id="cf-service"
              value={form.service}
              onChange={(e) => updateField('service', e.target.value as ContactServiceId)}
              className="w-full px-4 py-3 rounded-2xl bg-muted border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-all"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(`services.${s.id}`)}
                </option>
              ))}
              <option value="other">{t('services.other')}</option>
            </select>
            {form.service === 'other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2"
              >
                <Input
                  value={form.customService}
                  onChange={(e) => updateField('customService', e.target.value)}
                  placeholder={t('placeholder_custom_service')}
                  aria-invalid={Boolean(validationErrors.customService)}
                  maxLength={140}
                />
                {validationErrors.customService && (
                  <p className="text-xs text-red-400 mt-1" role="alert">
                    {validationErrors.customService}
                  </p>
                )}
              </motion.div>
            )}
          </FormRow>

          {/* Текст обращения */}
          <FormRow
            index={5}
            label={t('field_message')}
            error={validationErrors.message}
            id="cf-message"
          >
            <textarea
              id="cf-message"
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder={t('placeholder_message')}
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-2xl bg-muted border border-border text-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 transition-all"
              aria-invalid={Boolean(validationErrors.message)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              {form.message.length}/2000
            </p>
          </FormRow>

          {/* Согласие с политикой конфиденциальности */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3"
          >
            <input
              id="cf-agree"
              type="checkbox"
              checked={form.agreed}
              onChange={(e) => setForm((f) => ({ ...f, agreed: e.target.checked }))}
              className="mt-0.5 w-4 h-4 rounded border-border accent-primary flex-shrink-0 cursor-pointer"
            />
            <label htmlFor="cf-agree" className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none">
              {t('agree_prefix')}{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {t('agree_link')}
              </a>
            </label>
          </motion.div>
          {validationErrors.agreed && (
            <p className="text-xs text-red-400 -mt-2" role="alert">
              {validationErrors.agreed}
            </p>
          )}

          {/* Ошибка отправки */}
          {status === 'error' && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-red-400"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Turnstile captcha */}
          <div className="flex justify-center">
            <TurnstileWidget
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>

          {/* Кнопки */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col-reverse sm:flex-row gap-3 pt-2"
          >
            <Button
              type="button"
              variant="ghost"
              className="sm:flex-1"
              onClick={onClose}
              disabled={status === 'submitting'}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="sm:flex-1"
              leftIcon={
                status === 'submitting' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )
              }
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? t('submitting') : t('submit')}
            </Button>
          </motion.div>

          {/* Подсказка про прямую связь */}
          <p className="text-xs text-muted-foreground text-center pt-2">
            {t('hint')}
          </p>
        </form>
      )}
    </Modal>
  );
}

// ============================================
// Подкомпоненты
// ============================================

function FormRow({
  index,
  label,
  id,
  error,
  children,
}: {
  index: number;
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <label htmlFor={id} className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 mt-1" role="alert">
          {error}
        </p>
      )}
    </motion.div>
  );
}

function SuccessView({
  t,
  onClose,
}: {
  t: ReturnType<typeof useTranslations<'contact_form'>>;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', damping: 12, stiffness: 200 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 border border-primary/30 mb-5"
      >
        <Check className="h-7 w-7 text-primary" />
      </motion.div>
      <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-md mx-auto">
        {t('success_text')}
      </p>
      <Button
        variant="primary"
        size="md"
        onClick={onClose}
        leftIcon={<Phone className="h-4 w-4" />}
      >
        {t('success_close')}
      </Button>
    </motion.div>
  );
}
