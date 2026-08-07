/**
 * Arquivo principal da aplicação
 * Entry point para Vite
 */

import { initProjectsGrid } from './projects-grid.js';
import { renderPortfolioMetrics } from './portfolio-metrics.js';
import { initCardSpotlight } from './card-spotlight.js';
import './toast.js';
import './scroll-animations.js';
import './mobile-menu.js';
import './darkmode.js';
import './back-to-top.js';
import { renderExperienceTimeline } from './experience.js';

function initCopyButtons() {
  document.querySelectorAll('[data-copy-text]').forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.getAttribute('data-copy-text');
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        if (window.showToast) {
          window.showToast('E-mail copiado!', 'success', 3000);
        }
      } catch (error) {
        console.error('Erro ao copiar texto:', error);
        if (window.showToast) {
          window.showToast('Não foi possível copiar o e-mail', 'error');
        }
      }
    });
  });
}

async function initApp() {
  renderPortfolioMetrics();
  renderExperienceTimeline();
  initProjectsGrid();
  initCopyButtons();
  initCardSpotlight();

  // Import dinamico do novo Showcase interativo do Hero
  try {
    const { initHeroShowcase } = await import('./hero-showcase.js');
    initHeroShowcase();
  } catch (err) {
    console.error('Erro ao iniciar o showcase do hero:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void initApp();
  });
} else {
  void initApp();
}

const handleLoad = () => {
  setTimeout(() => {
    document.body.classList.remove('is-preload');
  }, 100);
};

if (document.readyState === 'complete') {
  handleLoad();
} else {
  window.addEventListener('load', handleLoad, { once: true });
}

let resizeTimeout;
window.addEventListener(
  'resize',
  () => {
    document.body.classList.add('is-resizing');
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      document.body.classList.remove('is-resizing');
    }, 100);
  },
  { passive: true }
);
