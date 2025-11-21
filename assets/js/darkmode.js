/**
 * Sistema de Dark Mode com toggle manual
 * Salva a preferência do usuário no localStorage
 */

// Prevenir múltiplas execuções
if (window.darkModeScriptLoaded) {
    // Script já foi carregado, não executar novamente
    if (typeof console !== 'undefined') {
        console.warn('darkmode.js já foi carregado. Ignorando duplicata.');
    }
} else {
    window.darkModeScriptLoaded = true;

(function() {
    'use strict';

    const DARK_MODE_KEY = 'darkMode';
    const DARK_MODE_CLASS = 'dark-mode';
    let buttonCreated = false;
    
    // Verificar preferência salva ou preferência do sistema
    function initDarkMode() {
        const savedMode = localStorage.getItem(DARK_MODE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Se não houver preferência salva, usar a preferência do sistema
        if (savedMode === null) {
            if (prefersDark) {
                enableDarkMode(false); // false = não salvar (será salvo no primeiro toggle)
            }
        } else {
            // Usar preferência salva
            if (savedMode === 'true') {
                enableDarkMode(false);
            } else {
                disableDarkMode(false);
            }
        }
    }

    function enableDarkMode(save = true) {
        document.documentElement.classList.add(DARK_MODE_CLASS);
        document.body.classList.add(DARK_MODE_CLASS);
        
        if (save) {
            localStorage.setItem(DARK_MODE_KEY, 'true');
        }
        
        updateToggleButton(true);
    }

    function disableDarkMode(save = true) {
        document.documentElement.classList.remove(DARK_MODE_CLASS);
        document.body.classList.remove(DARK_MODE_CLASS);
        
        if (save) {
            localStorage.setItem(DARK_MODE_KEY, 'false');
        }
        
        updateToggleButton(false);
    }

    function toggleDarkMode() {
        const isDark = document.body.classList.contains(DARK_MODE_CLASS);
        
        if (isDark) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    function updateToggleButton(isDark) {
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            // Manter apenas as classes base, remover fa-moon e fa-sun
            toggleBtn.className = 'icon solid dark-mode-toggle';
            
            if (isDark) {
                // Modo escuro ativo - mostrar sol para voltar ao claro
                toggleBtn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i><span class="label">Modo Claro</span>';
                toggleBtn.setAttribute('aria-label', 'Ativar modo claro');
            } else {
                // Modo claro ativo - mostrar lua para ir ao escuro
                toggleBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i><span class="label">Modo Escuro</span>';
                toggleBtn.setAttribute('aria-label', 'Ativar modo escuro');
            }
        }
    }

    function createToggleButton() {
        // Verificação de segurança - evitar múltiplas criações
        if (buttonCreated || document.getElementById('dark-mode-toggle')) {
            return;
        }

        // Encontrar o container de ícones sociais
        // Prioridade: navbar desktop (.nav-icons .icons) se visível, senão menu mobile (.nav-menu-social)
        let iconsContainer = null;
        const desktopIcons = document.querySelector('.nav-icons .icons');
        const mobileIcons = document.querySelector('.nav-menu-social');
        
        // Verificar se estamos no desktop (largura >= 768px) e se o container desktop existe e está visível
        if (window.innerWidth >= 768 && desktopIcons) {
            const desktopIconsStyle = window.getComputedStyle(desktopIcons);
            const desktopNavIcons = desktopIcons.closest('.nav-icons');
            const desktopNavIconsStyle = desktopNavIcons ? window.getComputedStyle(desktopNavIcons) : null;
            
            // Verificar se não está escondido (display !== 'none')
            if (desktopNavIconsStyle && desktopNavIconsStyle.display !== 'none' && 
                desktopIconsStyle.display !== 'none') {
                iconsContainer = desktopIcons;
            }
        }
        
        // Se não encontrou no desktop ou está no mobile, usar menu mobile
        if (!iconsContainer) {
            iconsContainer = mobileIcons || 
                            desktopIcons || 
                            document.querySelector('#main-navigation .nav-icons .icons') ||
                            document.querySelector('#header .icons');
        }
        
        if (!iconsContainer) {
            // Tentar novamente após um pequeno delay se o container ainda não existir
            setTimeout(createToggleButton, 200);
            return;
        }

        // REMOVER TODOS os botões de dark mode existentes primeiro (limpeza completa)
        const existingButtons = iconsContainer.querySelectorAll('#dark-mode-toggle, .dark-mode-toggle, [aria-label*="modo escuro"], [aria-label*="modo claro"]');
        existingButtons.forEach(btn => {
            const parent = btn.closest('li');
            if (parent) {
                parent.remove();
            } else {
                btn.remove();
            }
        });

        // Verificação final antes de criar
        if (document.getElementById('dark-mode-toggle') || buttonCreated) {
            return;
        }

        // Marcar como criado ANTES de criar (evitar race condition)
        buttonCreated = true;

        // Criar novo item de lista para o toggle
        const listItem = document.createElement('li');
        listItem.setAttribute('aria-label', 'Alternar modo escuro/claro');
        
        const toggleBtn = document.createElement('a');
        toggleBtn.id = 'dark-mode-toggle';
        toggleBtn.href = '#';
        toggleBtn.className = 'icon solid dark-mode-toggle';
        toggleBtn.setAttribute('aria-label', 'Ativar modo escuro');
        toggleBtn.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i><span class="label">Modo Escuro</span>';
        
        // Adicionar listener com flag para evitar duplicatas
        // Usar uma função nomeada para poder remover depois se necessário
        function darkModeClickHandler(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleDarkMode();
        }
        
        // Adicionar listener em múltiplas fases para garantir que seja capturado
        toggleBtn.addEventListener('mousedown', darkModeClickHandler, true);
        toggleBtn.addEventListener('click', darkModeClickHandler, true);
        toggleBtn.dataset.listenerAdded = 'true';

        listItem.appendChild(toggleBtn);
        iconsContainer.appendChild(listItem);

        // Atualizar o botão com o estado inicial
        const isDark = document.body.classList.contains(DARK_MODE_CLASS);
        updateToggleButton(isDark);
    }

    // Verificar se já foi inicializado (evitar duplicação)
    if (window.darkModeInitialized) {
        console.warn('Dark mode já foi inicializado. Ignorando duplicata.');
        return;
    }
    window.darkModeInitialized = true;

    // Função de inicialização única - usando requestAnimationFrame para garantir execução única
    let initCalled = false;
    function init() {
        if (initCalled) {
            return;
        }
        initCalled = true;

        initDarkMode();
        
        // Usar requestAnimationFrame e setTimeout para garantir que o DOM está totalmente renderizado
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    createToggleButton();
                }, 100);
            });
        });
    }

    // Mover botão entre containers ao redimensionar a janela
    function handleResize() {
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (!toggleBtn) return;
        
        const btnListItem = toggleBtn.closest('li');
        if (!btnListItem) return;
        
        const desktopIcons = document.querySelector('.nav-icons .icons');
        const mobileIcons = document.querySelector('.nav-menu-social');
        const currentContainer = btnListItem.parentElement;
        
        // Verificar qual container deve ter o botão
        let targetContainer = null;
        if (window.innerWidth >= 768 && desktopIcons) {
            const desktopNavIcons = desktopIcons.closest('.nav-icons');
            const desktopNavIconsStyle = desktopNavIcons ? window.getComputedStyle(desktopNavIcons) : null;
            if (desktopNavIconsStyle && desktopNavIconsStyle.display !== 'none') {
                targetContainer = desktopIcons;
            }
        } else if (mobileIcons) {
            targetContainer = mobileIcons;
        }
        
        // Mover apenas se necessário e se o container de destino existe
        if (targetContainer && currentContainer !== targetContainer) {
            // Preservar o listener ao mover
            const listenerAdded = toggleBtn.dataset.listenerAdded;
            btnListItem.remove();
            targetContainer.appendChild(btnListItem);
            // Re-adicionar listener se necessário
            if (listenerAdded && !toggleBtn.dataset.listenerAdded) {
                toggleBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDarkMode();
                }, true);
                toggleBtn.dataset.listenerAdded = 'true';
            }
        }
    }

    // Inicializar quando o DOM estiver pronto - apenas uma vez
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        // DOM já está pronto, executar imediatamente
        init();
    }

    // Adicionar listener para redimensionamento da janela
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250); // Debounce de 250ms
    });

    // Exportar funções para uso global se necessário
    window.toggleDarkMode = toggleDarkMode;
    window.enableDarkMode = enableDarkMode;
    window.disableDarkMode = disableDarkMode;
})();
}
