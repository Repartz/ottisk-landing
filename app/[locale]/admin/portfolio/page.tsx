'use client';

// ============================================
// ADMIN PORTFOLIO: CRUD проектов
// - Список проектов из Firestore
// - Загрузка нескольких фото через Uploadthing
// - Авто-перевод RU → EN через MyMemory
// - Поле link на готовый проект
// ============================================

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Plus, Pencil, Trash2, ArrowLeft, AlertCircle,
  Languages, Loader2, ExternalLink, X, ImagePlus,
} from 'lucide-react';
import type { PortfolioItem } from '@/types';
import { isFirebaseConfigured, getDb } from '@/lib/firebase';
import { translateRuToEn } from '@/lib/translate';
import { useTranslations, useLocale } from 'next-intl';
import { useUploadThing } from '@/lib/uploadthing';

interface FormState {
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  images: string[];
  tags: string;
  link: string;
}

const emptyForm: FormState = {
  title: { ru: '', en: '' },
  description: { ru: '', en: '' },
  images: [],
  tags: '',
  link: '',
};

export default function AdminPortfolio() {
  const router = useRouter();
  const t = useTranslations('admin');
  const locale = useLocale();
  const localePrefix = locale === 'ru' ? '' : '/en';

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Uploadthing хук
  const { startUpload, isUploading } = useUploadThing('portfolioImages', {
    onUploadProgress: (p) => setUploadProgress(p),
    onClientUploadComplete: (res) => {
      if (res) {
        const urls = res.map((f) => f.url);
        setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      }
      setUploading(false);
      setUploadProgress(0);
    },
    onUploadError: (err) => {
      setError(locale === 'en'
        ? `Upload failed: ${err.message}`
        : `Ошибка загрузки: ${err.message}`);
      setUploading(false);
      setUploadProgress(0);
    },
  });

  const loadItems = useCallback(async () => {
    if (!isFirebaseConfigured()) { setLoading(false); return; }
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const db = getDb();
      if (!db) { setLoading(false); return; }
      const snap = await getDocs(collection(db, 'portfolio'));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PortfolioItem[]);
    } catch (err) {
      console.error('[Admin Portfolio] load error', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleAutoTranslate = async () => {
    setError(null);
    if (!form.title.ru.trim() && !form.description.ru.trim()) {
      setError(locale === 'en' ? 'Fill RU fields first' : 'Сначала заполните русские поля');
      return;
    }
    setTranslating(true);
    try {
      const [titleEn, descEn] = await Promise.all([
        form.title.ru.trim() ? translateRuToEn(form.title.ru) : Promise.resolve(form.title.en),
        form.description.ru.trim() ? translateRuToEn(form.description.ru) : Promise.resolve(form.description.en),
      ]);
      setForm((f) => ({ ...f, title: { ...f.title, en: titleEn }, description: { ...f.description, en: descEn } }));
    } catch {
      setError(locale === 'en' ? 'Translation failed.' : 'Перевод не удался.');
    } finally {
      setTranslating(false);
    }
  };

  const handleFilesSelected = async (files: FileList) => {
    setError(null);
    const fileArr = Array.from(files);
    setUploading(true);
    setUploadProgress(0);
    await startUpload(fileArr);
  };

  const removeImage = (idx: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isFirebaseConfigured()) { setError(t('firebase_not_configured')); return; }
    setSubmitting(true);
    try {
      const { collection, addDoc, updateDoc, doc } = await import('firebase/firestore');
      const db = getDb();
      if (!db) return;
      const data = {
        title: form.title,
        description: form.description,
        image: form.images[0] || '',
        images: form.images,
        link: form.link.trim(),
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };
      if (editingId) {
        await updateDoc(doc(db, 'portfolio', editingId), data);
      } else {
        await addDoc(collection(db, 'portfolio'), data);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadItems();
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isFirebaseConfigured()) { alert(t('firebase_not_configured')); return; }
    if (!confirm(t('confirm_delete'))) return;
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      const db = getDb();
      if (!db) return;
      await deleteDoc(doc(db, 'portfolio', id));
      await loadItems();
    } catch (err) {
      console.error('[Admin Portfolio] delete error', err);
    }
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setError(null);
    const imgs: string[] = (item as { images?: string[] }).images?.length
      ? (item as { images?: string[] }).images!
      : item.image ? [item.image] : [];
    setForm({
      title: { ru: item.title.ru, en: item.title.en },
      description: { ru: item.description.ru, en: item.description.en },
      images: imgs,
      tags: item.tags?.join(', ') || '',
      link: item.link || '',
    });
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setIsModalOpen(true);
  };

  const busy = uploading || isUploading || submitting;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Шапка */}
        <header className="flex justify-between items-center mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push(`${localePrefix}/admin`)}>
              {locale === 'en' ? 'Back' : 'Назад'}
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{t('manage_portfolio')}</h1>
          </div>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}
            onClick={openCreate} disabled={!isFirebaseConfigured()}>
            {t('add_project')}
          </Button>
        </header>

        {!isFirebaseConfigured() && (
          <div className="mb-6 p-4 rounded-2xl bg-secondary-400 border border-primary/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{t('firebase_not_configured')}</p>
          </div>
        )}

        {/* Список проектов */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t('loading')}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {locale === 'en' ? 'No projects yet' : 'Пока нет проектов'}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} glow={false}>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.title.ru} className="w-full h-40 object-cover rounded-xl mb-4" />
                )}
                <h3 className="font-bold mb-2 text-foreground">{item.title.ru}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description.ru}</p>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-3">
                    <ExternalLink className="h-3 w-3" />{item.link}
                  </a>
                )}
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => openEdit(item)}>{t('edit')}</Button>
                  <Button variant="ghost" size="sm" leftIcon={<Trash2 className="h-4 w-4 text-red-500" />} onClick={() => handleDelete(item.id)}>{t('delete')}</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Модалка формы */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { if (!busy) { setIsModalOpen(false); } }}
        title={editingId ? t('edit_project') : t('new_project')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Загрузка фото */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              {locale === 'en' ? 'Project images (multiple allowed)' : 'Изображения проекта (можно несколько)'}
            </label>

            {/* Превью загруженных фото */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {form.images.map((url, idx) => (
                  <div key={url} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`photo ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-xl border border-border" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 text-[10px] bg-primary text-neutral-900 font-bold px-1.5 py-0.5 rounded-full">
                        {locale === 'en' ? 'main' : 'главное'}
                      </span>
                    )}
                    <button type="button" onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-neutral-500/80 hover:bg-red-600 text-white transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Зона загрузки */}
            <label className="block border-2 border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={busy}
                onChange={(e) => { if (e.target.files?.length) handleFilesSelected(e.target.files); e.target.value = ''; }}
              />
              {uploading || isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-7 w-7 text-primary animate-spin" />
                  <span className="text-sm text-foreground">
                    {locale === 'en' ? 'Uploading…' : 'Загрузка…'} {Math.round(uploadProgress)}%
                  </span>
                  {/* Прогресс-бар */}
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <ImagePlus className="h-7 w-7 text-primary" />
                  <span className="text-sm text-foreground">
                    {form.images.length > 0
                      ? (locale === 'en' ? 'Add more photos' : 'Добавить ещё фото')
                      : (locale === 'en' ? 'Click to upload images' : 'Нажмите чтобы загрузить')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    JPG, PNG, WEBP · max 8 MB · {locale === 'en' ? 'multiple files' : 'можно несколько'}
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* RU поля */}
          <div className="space-y-3 p-3 rounded-xl bg-muted/30 border border-border">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono uppercase tracking-wider text-primary">RU</span>
              <Button type="button" variant="ghost" size="sm"
                leftIcon={translating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                onClick={handleAutoTranslate} disabled={translating}>
                {locale === 'en' ? 'Auto → EN' : 'Авто → EN'}
              </Button>
            </div>
            <Input placeholder={t('title_ru')} value={form.title.ru}
              onChange={(e) => setForm({ ...form, title: { ...form.title, ru: e.target.value } })} required />
            <textarea placeholder={t('description_ru')} value={form.description.ru}
              onChange={(e) => setForm({ ...form, description: { ...form.description, ru: e.target.value } })}
              className="w-full p-3 rounded-xl bg-muted border border-border text-foreground resize-none h-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" required />
          </div>

          {/* EN поля */}
          <div className="space-y-3 p-3 rounded-xl bg-muted/30 border border-border">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">EN</span>
            <Input placeholder={t('title_en')} value={form.title.en}
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} required />
            <textarea placeholder={t('description_en')} value={form.description.en}
              onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })}
              className="w-full p-3 rounded-xl bg-muted border border-border text-foreground resize-none h-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" required />
          </div>

          {/* Ссылка + теги */}
          <Input type="url"
            placeholder={locale === 'en' ? 'Project URL (optional)' : 'Ссылка на проект (необязательно)'}
            value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          <Input placeholder={t('tags')} value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })} />

          {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1"
              onClick={() => setIsModalOpen(false)} disabled={busy}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" className="flex-1"
              isLoading={submitting} disabled={busy}>
              {(uploading || isUploading)
                ? (locale === 'en' ? 'Uploading…' : 'Загрузка…')
                : editingId ? t('save') : t('add')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
