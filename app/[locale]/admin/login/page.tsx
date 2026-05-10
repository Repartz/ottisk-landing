'use client';

// ============================================
// ADMIN LOGIN: Страница входа в админ-панель
// Пароль проверяется на сервере через /api/admin/login
// При успехе сервер ставит HTTP-only cookie admin_session
// ============================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useTranslations, useLocale } from 'next-intl';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('admin');
  const locale = useLocale();
  // Учёт локали в редиректе после успешного входа
  const adminPath = locale === 'ru' ? '/admin' : `/${locale}/admin`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Hard navigation, чтобы middleware увидел новую cookie
        window.location.href = adminPath;
      } else {
        setError(t('wrong_password'));
      }
    } catch {
      setError(t('connection_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-glow-gold">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-400 border border-primary/20 mb-6">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
              {t('title')}
            </h1>
            <Logo variant="text" size="md" className="text-primary" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="sr-only">{t('password')}</span>
              <Input
                type="password"
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                required
              />
            </label>

            {error && (
              <p className="text-red-500 text-sm" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
              disabled={!password.length || loading}
            >
              {t('submit')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
