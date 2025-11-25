/**
 * Arquivo principal da aplicação
 * Entry point para Vite
 */

// Importar utilitários
import { loadGitHubRepos } from './github.js';

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

// Aguardar DOM estar pronto
function initApp() {
    // Inicializar carregamento de projetos do GitHub
    // Após carregar, observar novos elementos para animações
    if (document.querySelector('.posts')) {
        const loadPromise = loadGitHubRepos();
        if (loadPromise && typeof loadPromise.then === 'function') {
            loadPromise.then(() => {
                // Re-observar elementos após projetos serem carregados
                if (window.observeNewElements) {
                    setTimeout(() => {
                        window.observeNewElements();
                    }, 100);
                }
            }).catch(error => {
                console.error('Erro ao carregar projetos:', error);
            });
        } else {
            // Se não retornar Promise, observar após um delay
            setTimeout(() => {
                if (window.observeNewElements) {
                    window.observeNewElements();
                }
            }, 500);
        }
    }
}

// Aguardar DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM já está pronto
    initApp();
}

