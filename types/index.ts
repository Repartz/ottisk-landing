// ============================================
// ТИПЫ: Глобальные TypeScript интерфейсы OTTISK
// ============================================

export interface Service {
  id: string;
  icon: string;
  duration_ru: string;
  duration_en: string;
  price_ru: string;
  price_en: string;
  stack: string;
}

export interface PortfolioItem {
  id: string;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  image?: string;
  images?: string[];
  tags?: string[];
  link?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  name_en?: string;
  location_ru: string;
  location_en: string;
  role_ru: string;
  role_en: string;
  text_ru: string;
  text_en: string;
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question_ru: string;
  question_en: string;
  answer_ru: string;
  answer_en: string;
}

export interface ProcessStep {
  id: number;
  key: string;
}

export interface SiteConfig {
  name: string;
  url: string;
  telegram: string;
  telegram_handle: string;
  whatsapp_number: string;
  whatsapp_link: string;
  email_address: string;
  email_link: string;
}

export type Theme = 'light' | 'dark' | 'system';
export type Locale = 'ru' | 'en';

// ============================================
// Способы связи в форме заявки
// ============================================
export type ContactChannel = 'telegram' | 'whatsapp';

// ============================================
// Услуга, выбранная в форме (id из content.json или 'other')
// ============================================
export type ContactServiceId =
  | 'telegram'
  | 'social'
  | 'websites'
  | 'apps'
  | 'support'
  | 'rework'
  | 'other';

// ============================================
// Полезная нагрузка формы заявки
// ============================================
export interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  channel: ContactChannel;
  channelHandle: string;
  service: ContactServiceId;
  customService?: string;
  message: string;
}
