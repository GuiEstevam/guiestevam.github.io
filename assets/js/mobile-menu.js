/**
 * Menu Mobile - Hambúrguer
 * Versão refatorada do zero - simples e funcional
 * Controla abertura/fechamento do menu drawer no mobile
 */

(function () {
  'use strict';

  // Estado
  let isMenuOpen = false;
  let menuToggle = null;
  let navMenu = null;
  let navOverlay = null;

  /**
   * Verifica se está em modo mobile
   */
  function isMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Cria o overlay se não existir
   */
  function createOverlay() {
    if (navOverlay) {
      return navOverlay;
    }

    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    navOverlay.setAttribute('aria-hidden', 'true');
    navOverlay.setAttribute('role', 'button');
    navOverlay.setAttribute('tabindex', '-1');
    
    // Fechar menu ao clicar fora do menu (usar document em vez do overlay)
    // Isso funciona porque o overlay tem pointer-events: none quando o menu está ativo
    document.addEventListener('click', (e) => {
      // Verificar se o menu está aberto
      if (!isMenuOpen || !navMenu) {
        return;
      }
      
      // Verificar se o clique foi dentro do menu
      const clickedInsideMenu = navMenu.contains(e.target);
      const clickedOnToggle = menuToggle && menuToggle.contains(e.target);
      
      // Se clicou fora do menu e não no toggle, fechar o menu
      if (!clickedInsideMenu && !clickedOnToggle) {
        closeMenu();
      }
    }, true); // Usar capture phase para garantir que execute antes
    
    // Prevenir que cliques dentro do menu fechem o menu
    if (navMenu) {
      navMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      }, true);
    }
    
    document.body.appendChild(navOverlay);
    return navOverlay;
  }

  /**
   * Abre o menu
   */
  function openMenu() {
    if (!navMenu || !menuToggle) {
      return;
    }

    isMenuOpen = true;
    navMenu.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');

    // Criar e ativar overlay
    const overlay = createOverlay();
    overlay.classList.add('active');

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
  }

  /**
   * Fecha o menu
   */
  function closeMenu() {
    if (!navMenu || !menuToggle) {
      return;
    }

    isMenuOpen = false;
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');

    // Desativar overlay
    if (navOverlay) {
      navOverlay.classList.remove('active');
    }

    // Restaurar scroll do body
    document.body.style.overflow = '';

    // Focar botão toggle
    try {
      menuToggle.focus();
    } catch (error) {
      // Ignorar erro de foco
    }
  }

  /**
   * Toggle do menu
   */
  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /**
   * Handler para cliques nos links do menu
   */
  function handleLinkClick(e) {
    // Apenas processar se estiver no mobile e menu estiver aberto
    if (!isMobile() || !isMenuOpen) {
      return;
    }

    // Verificar se é o botão de dark mode - não processar aqui
    // O darkmode.js já tem seu próprio handler, apenas fechar o menu depois
    const darkModeToggle = e.target.closest('#dark-mode-toggle');
    if (darkModeToggle) {
      // Não fazer nada aqui, deixar o darkmode.js processar o clique
      // O menu será fechado pelo listener acima
      return;
    }

    // Verificar se é um link do menu (nav-link) ou qualquer link dentro do menu
    const link = e.target.closest('.nav-link') || e.target.closest('a');
    if (!link || !navMenu || !navMenu.contains(link)) {
      return;
    }

    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) {
      // Se for apenas # ou javascript:, não fazer nada mas fechar o menu
      if (href === '#') {
        e.preventDefault();
      }
      closeMenu();
      return;
    }

    // Fechar menu primeiro
    closeMenu();

    // Se for âncora, fazer scroll suave após menu fechar
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        setTimeout(() => {
          const headerHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight;
          
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          
          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
          
          // Atualizar URL
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }, 300);
      }
    }
  }

  /**
   * Handler para tecla ESC
   */
  function handleKeyDown(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      e.preventDefault();
      closeMenu();
    }
  }

  /**
   * Handler para resize - fechar menu ao redimensionar para desktop
   */
  function handleResize() {
    if (!isMobile() && isMenuOpen) {
      closeMenu();
    }
  }

  /**
   * Inicializa o menu
   */
  function init() {
    // Buscar elementos
    menuToggle = document.querySelector('.menu-toggle');
    navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) {
      return;
    }

    // Event listener no toggle - usar event delegation no menu para links
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Event delegation no menu para links - mais eficiente e não interfere com outros scripts
    // Capturar TODOS os cliques dentro do menu, não apenas nav-link
    navMenu.addEventListener('click', (e) => {
      // Verificar se é o botão de dark mode - não processar aqui, deixar o darkmode.js processar
      const darkModeToggle = e.target.closest('#dark-mode-toggle');
      if (darkModeToggle) {
        // Não fazer nada aqui, deixar o darkmode.js processar o clique
        // O menu será fechado após um delay para dar tempo do toggle funcionar
        setTimeout(() => {
          if (isMenuOpen) {
            closeMenu();
          }
        }, 300);
        // Não retornar aqui, deixar o evento propagar para o darkmode.js
        return;
      }
      
      // Verificar se é um link (a) ou botão dentro do menu
      const link = e.target.closest('a');
      const button = e.target.closest('button');
      
      // Se for um link ou botão dentro do menu, processar
      if (link || button) {
        handleLinkClick(e);
      }
    }); // Não usar capture phase aqui para não interferir com o dark mode

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', handleKeyDown);

    // Fechar ao redimensionar
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 150);
    }, { passive: true });
  }

  /**
   * Inicializar quando DOM estiver pronto
   */
  function start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      // DOM já está pronto
      setTimeout(init, 100);
    }
  }

  start();

  // API pública
  window.mobileMenu = {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu,
    isOpen: () => isMenuOpen,
  };
})();
