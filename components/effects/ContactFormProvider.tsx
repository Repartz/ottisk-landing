'use client';

// ============================================
// CONTACT FORM PROVIDER: Глобальный контекст для модалки заявки
// Любая кнопка в проекте может вызвать openContactForm() через хук.
// Сама форма рендерится один раз в layout, исключая дубли DOM.
// ============================================

import { createContext, useCallback, useContext, useState } from 'react';
import { ContactForm } from '@/components/sections/ContactForm';
import { reachGoal } from '@/lib/analytics';

interface ContactFormContextValue {
  /** Открыть форму. Опционально — указать источник для аналитики. */
  open: (source?: string) => void;
  /** Закрыть форму. */
  close: () => void;
  /** Состояние формы. */
  isOpen: boolean;
}

const ContactFormContext = createContext<ContactFormContextValue | null>(null);

export function ContactFormProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((source?: string) => {
    if (source) reachGoal(`contact_form_open_${source}`);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContactFormContext.Provider value={{ open, close, isOpen }}>
      {children}
      <ContactForm isOpen={isOpen} onClose={close} />
    </ContactFormContext.Provider>
  );
}

/** Хук для доступа к открытию формы заявки из любой клиентской компоненты. */
export function useContactForm(): ContactFormContextValue {
  const ctx = useContext(ContactFormContext);
  if (!ctx) {
    throw new Error('useContactForm must be used within <ContactFormProvider />');
  }
  return ctx;
}
