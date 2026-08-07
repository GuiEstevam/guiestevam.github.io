/**
 * Spotlight nos cards de projeto — realce radial que segue o cursor.
 * Usa delegação de eventos: funciona para cards renderizados dinamicamente.
 */

const SPOTLIGHT_SELECTOR = '.featured-item-link';

export function initCardSpotlight() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.addEventListener(
    'pointermove',
    (event) => {
      const link = event.target.closest?.(SPOTLIGHT_SELECTOR);
      if (!link) return;

      const rect = link.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      link.style.setProperty('--spot-x', `${x}%`);
      link.style.setProperty('--spot-y', `${y}%`);
    },
    { passive: true }
  );
}
