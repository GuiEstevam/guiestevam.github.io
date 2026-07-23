/**
 * Arquivo principal da aplicação
 * Entry point para Vite
 */

import { initProjectsSlider } from './projects-slider.js';
import { renderPortfolioMetrics } from './portfolio-metrics.js';
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
  initProjectsSlider();
  initCopyButtons();

  // Import dinamico: falha no terminal nao derruba metricas/cards
  try {
    const { initInteractiveTerminal } = await import('./interactive-terminal.js');
    initInteractiveTerminal();
  } catch (err) {
    console.error('Erro ao iniciar o terminal interativo:', err);
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
