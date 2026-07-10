/**
 * Arquivo principal da aplicação
 * Entry point para Vite
 */

// Importar utilitários
import { initProjectsSlider } from './projects-slider.js';

// Importar toast system
import './toast.js';

// Importar scroll animations (será carregado automaticamente)
import './scroll-animations.js';

// Importar tech slider
import './technologies.js';

// Importar menu mobile
import './mobile-menu.js';

// Importar dark mode
import './darkmode.js';

// Importar botão voltar ao topo
import './back-to-top.js';

// Importar experiência (toggle de descrição no mobile)
import './experience.js';

// Importar terminal interativo
import { initInteractiveTerminal } from './interactive-terminal.js';

// Aguardar DOM estar pronto
function initApp() {
    initInteractiveTerminal();
    initProjectsSlider();
}

// Aguardar DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM já está pronto
    initApp();
}

// Controlar classe 'is-preload' no body após o carregamento completo da página
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

// Adicionar temporariamente a classe 'is-resizing' no body ao redimensionar a janela
let resizeTimeout;
window.addEventListener('resize', () => {
    document.body.classList.add('is-resizing');
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        document.body.classList.remove('is-resizing');
    }, 100);
}, { passive: true });


