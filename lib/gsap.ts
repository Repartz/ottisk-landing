// ============================================
// GSAP: Регистрация плагинов
// Используем только бесплатные плагины (ScrollTrigger).
// SplitText заменён на кастомную реализацию (см. components/animations/SplitText)
// ============================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
