'use client';

// ============================================
// ADMIN DASHBOARD: Главная страница админки
// Авторизация полностью обеспечивается middleware (httpOnly cookie).
// Клиентская проверка не нужна и невозможна (cookie httpOnly).
// ============================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FolderOpen, MessageSquare, LogOut, Database, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { isFirebaseConfigured, getDb } from '@/lib/firebase';
import { useTranslations, useLocale } from 'next-intl';

interface Stats {
  portfolio: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ portfolio: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);
  const t = useTranslations('admin');
  const locale = useLocale();
  const localePrefix = locale === 'ru' ? '' : '/en';

  // Загрузка статистики
  useEffect(() => {
    async function loadStats() {
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
        const [portfolioSnap, testimonialsSnap] = await Promise.all([
          getDocs(collection(db, 'portfolio')),
          getDocs(collection(db, 'testimonials')),
        ]);
        setStats({
          portfolio: portfolioSnap.size,
          testimonials: testimonialsSnap.size,
        });
      } catch (err) {
        console.error('[Admin] stats error', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    // Hard navigation: сбрасываем cookie и перекидываем на главную
    window.location.href = locale === 'ru' ? '/' : `/${locale}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Шапка */}
        <header className="flex justify-between items-center mb-8 lg:mb-12 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Logo variant="full" size="md" />
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">{t('title')}</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-4 w-4" />}
            size="sm"
          >
            {t('logout')}
          </Button>
        </header>

        {/* Уведомление если Firebase не подключён */}
        {!isFirebaseConfigured() && (
          <div className="mb-6 p-4 rounded-2xl bg-secondary-400 border border-primary/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{t('firebase_not_configured')}</p>
          </div>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
          <Card glow={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">
                  {loading ? '…' : stats.portfolio}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                  {t('stats_portfolio')}
                </div>
              </div>
            </div>
          </Card>

          <Card glow={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">
                  {loading ? '…' : stats.testimonials}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                  {t('stats_testimonials')}
                </div>
              </div>
            </div>
          </Card>

          <Card glow={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-base font-bold text-foreground">
                  {isFirebaseConfigured() ? 'CONNECTED' : 'OFFLINE'}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                  Firebase
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Управление */}
        <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
          <Card
            interactive
            onClick={() => router.push(`${localePrefix}/admin/portfolio`)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg lg:text-xl font-bold mb-2 text-foreground">
                  {t('manage_portfolio')}
                </h3>
                <p className="text-sm text-muted-foreground">{t('manage_portfolio_desc')}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-primary flex-shrink-0" />
            </div>
          </Card>

          <Card
            interactive
            onClick={() => router.push(`${localePrefix}/admin/testimonials`)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg lg:text-xl font-bold mb-2 text-foreground">
                  {t('manage_testimonials')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('manage_testimonials_desc')}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary flex-shrink-0" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
