// ============================================
// GRAIN OVERLAY: Тонкий шум поверх всего сайта
// Создаёт ощущение "плёнки", фиксируется на экране
// Не перехватывает клики (pointer-events: none)
// ============================================

export function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
