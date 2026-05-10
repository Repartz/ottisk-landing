'use client';

// ============================================
// ADMIN TESTIMONIALS: CRUD отзывов
// - Список отзывов из Firestore (если коллекция пустая, на сайте используется fallback из content.json)
// - Добавление, редактирование, удаление
// - Авто-перевод RU → EN (как в портфолио)
// - Поле order для сортировки
// ============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Languages,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { isFirebaseConfigured, getDb } from '@/lib/firebase';
import { translateRuToEn } from '@/lib/translate';
import { useTranslations, useLocale } from 'next-intl';
import type { Testimonial } from '@/types';

interface TestimonialDoc extends Testimonial {
  order?: number;
  createdAt?: string;
}

interface FormState {
  name: string;
  location_ru: string;
  location_en: string;
  role_ru: string;
  role_en: string;
  text_ru: string;
  text_en: string;
  order: string;
}

const emptyForm: FormState = {
  name: '',
  location_ru: '',
  location_en: '',
  role_ru: '',
  role_en: '',
  text_ru: '',
  text_en: '',
  order: '',
};

export default function AdminTestimonials() {
  const router = useRouter();
  const t = useTranslations('admin');
  const locale = useLocale();
  const localePrefix = locale === 'ru' ? '' : '/en';

  const [items, setItems] = useState<TestimonialDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const db = getDb();
      if (!db) {
        setLoading(false);
        return;
      }
      const snap = await getDocs(collection(db, 'testimonials'));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TestimonialDoc[];
      data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setItems(data);
    } catch (err) {
      console.error('[Admin Testimonials] load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAutoTranslate = async () => {
    setError(null);
    if (!form.text_ru.trim() && !form.role_ru.trim() && !form.location_ru.trim()) {
      setError(locale === 'en' ? 'Fill RU fields first' : 'Сначала заполните русские поля');
      return;
    }
    setTranslating(true);
    try {
      const [textEn, roleEn, locationEn] = await Promise.all([
        form.text_ru.trim() ? translateRuToEn(form.text_ru) : Promise.resolve(form.text_en),
        form.role_ru.trim() ? translateRuToEn(form.role_ru) : Promise.resolve(form.role_en),
        form.location_ru.trim()
          ? translateRuToEn(form.location_ru)
          : Promise.resolve(form.location_en),
      ]);
      setForm((f) => ({ ...f, text_en: textEn, role_en: roleEn, location_en: locationEn }));
    } catch (err) {
      console.error('[Admin Testimonials] translate error', err);
      setError(
        locale === 'en' ? 'Translation failed. Try again.' : 'Перевод не удался. Попробуйте снова.'
      );
    } finally {
      setTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured()) {
      setError(t('firebase_not_configured'));
      return;
    }
    setSubmitting(true);
    try {
      const { collection, addDoc, updateDoc, doc } = await import('firebase/firestore');
      const db = getDb();
      if (!db) return;

      const orderNum = form.order.trim() ? Number(form.order) : items.length + 1;

      const data = {
        name: form.name.trim(),
        location_ru: form.location_ru.trim(),
        location_en: form.location_en.trim(),
        role_ru: form.role_ru.trim(),
        role_en: form.role_en.trim(),
        text_ru: form.text_ru.trim(),
        text_en: form.text_en.trim(),
        order: Number.isFinite(orderNum) ? orderNum : items.length + 1,
        createdAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'testimonials', editingId), data);
      } else {
        await addDoc(collection(db, 'testimonials'), data);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      const e = err as { message?: string };
      console.error('[Admin Testimonials] save error', err);
      setError(e.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isFirebaseConfigured()) return;
    if (!confirm(t('confirm_delete_testimonial'))) return;
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      const db = getDb();
      if (!db) return;
      await deleteDoc(doc(db, 'testimonials', id));
      await loadItems();
    } catch (err) {
      console.error('[Admin Testimonials] delete error', err);
    }
  };

  const openEdit = (item: TestimonialDoc) => {
    setEditingId(item.id);
    setError(null);
    setForm({
      name: item.name,
      location_ru: item.location_ru || '',
      location_en: item.location_en || '',
      role_ru: item.role_ru || '',
      role_en: item.role_en || '',
      text_ru: item.text_ru || '',
      text_en: item.text_en || '',
      order: item.order ? String(item.order) : '',
    });
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, order: String(items.length + 1) });
    setError(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Шапка */}
        <header className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push(`${localePrefix}/admin`)}
            >
              {locale === 'en' ? 'Back' : 'Назад'}
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{t('manage_testimonials')}</h1>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={openCreate}
            disabled={!isFirebaseConfigured()}
          >
            {t('add_testimonial')}
          </Button>
        </header>

        {!isFirebaseConfigured() && (
          <div className="mb-6 p-4 rounded-2xl bg-secondary-400 border border-primary/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{t('firebase_not_configured')}</p>
          </div>
        )}

        {/* Hint про fallback */}
        {isFirebaseConfigured() && !loading && items.length === 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground">
              <p className="mb-1">{t('no_testimonials')}</p>
              <p className="text-xs text-muted-foreground">{t('fallback_hint')}</p>
            </div>
          </div>
        )}

        {/* Список */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t('loading')}</div>
        ) : items.length === 0 ? null : (
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {items.map((item) => (
              <Card key={item.id} glow={false}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.location_ru} · {item.role_ru}
                    </p>
                    {typeof item.order === 'number' && (
                      <p className="text-xs text-primary/60 font-mono mt-1">#{item.order}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{item.text_ru}</p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Pencil className="h-4 w-4" />}
                    onClick={() => openEdit(item)}
                  >
                    {t('edit')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 className="h-4 w-4 text-red-500" />}
                    onClick={() => handleDelete(item.id)}
                  >
                    {t('delete')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Модалка формы */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? t('edit_testimonial') : t('new_testimonial')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Имя автора + order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                {t('field_author_name')}
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Иван Иванов"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                #
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
                placeholder="1"
                min="0"
              />
            </div>
          </div>

          {/* RU поля + кнопка перевода */}
          <div className="space-y-3 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase tracking-wider text-primary">RU</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={
                  translating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Languages className="h-4 w-4" />
                  )
                }
                onClick={handleAutoTranslate}
                disabled={translating}
              >
                {locale === 'en' ? 'Auto → EN' : 'Авто → EN'}
              </Button>
            </div>
            <Input
              placeholder={t('field_author_role_ru')}
              value={form.role_ru}
              onChange={(e) => setForm({ ...form, role_ru: e.target.value })}
              required
            />
            <Input
              placeholder={t('field_author_location_ru')}
              value={form.location_ru}
              onChange={(e) => setForm({ ...form, location_ru: e.target.value })}
              required
            />
            <textarea
              placeholder={t('field_text_ru')}
              value={form.text_ru}
              onChange={(e) => setForm({ ...form, text_ru: e.target.value })}
              className="w-full p-3 rounded-xl bg-muted border border-border text-foreground resize-none h-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </div>

          {/* EN поля */}
          <div className="space-y-3 p-3 rounded-xl bg-muted/30 border border-border">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">EN</span>
            <Input
              placeholder={t('field_author_role_en')}
              value={form.role_en}
              onChange={(e) => setForm({ ...form, role_en: e.target.value })}
              required
            />
            <Input
              placeholder={t('field_author_location_en')}
              value={form.location_en}
              onChange={(e) => setForm({ ...form, location_en: e.target.value })}
              required
            />
            <textarea
              placeholder={t('field_text_en')}
              value={form.text_en}
              onChange={(e) => setForm({ ...form, text_en: e.target.value })}
              className="w-full p-3 rounded-xl bg-muted border border-border text-foreground resize-none h-32 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" className="flex-1" isLoading={submitting}>
              {editingId ? t('save') : t('add')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
