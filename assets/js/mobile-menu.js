/**
 * Menu Mobile - Hambúrguer
 * Controla abertura/fechamento do menu drawer no mobile
 */

(function () {
  'use strict';

  // Verificar preferência de movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let menuToggle = null;
  let navMenu = null;
  let navOverlay = null;
  let navLinks = null;
  let isMenuOpen = false;

  /**
   * Toggle do menu
   */
  function toggleMenu() {
    if (!navMenu || !menuToggle) return;

    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  /**
   * Abre o menu
   */
  function openMenu() {
    if (!navMenu || !menuToggle) return;

    navMenu.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu');

    // Criar overlay se não existir
    if (!navOverlay) {
      navOverlay = document.createElement('div');
      navOverlay.className = 'nav-overlay';
      navOverlay.setAttribute('aria-hidden', 'true');
      navOverlay.addEventListener('click', closeMenu);
      document.body.appendChild(navOverlay);
    }
    navOverlay.classList.add('active');

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';

    // Focar primeiro link
    if (navLinks && navLinks.length > 0) {
      setTimeout(() => {
        navLinks[0].focus();
      }, 100);
    }
  }

  /**
   * Fecha o menu
   */
  function closeMenu() {
    if (!navMenu || !menuToggle) return;

    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');

    if (navOverlay) {
      navOverlay.classList.remove('active');
    }

    // Restaurar scroll do body
    document.body.style.overflow = '';

    // Focar botão toggle
    menuToggle.focus();
  }

  /**
   * Fecha menu ao clicar em link
   */
  function handleLinkClick(e) {
    // Verificar se estamos no mobile
    if (window.innerWidth < 768 && isMenuOpen) {
      closeMenu();
    }
  }

  /**
   * Fecha menu ao pressionar ESC
   */
  function handleKeyDown(e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }

  /**
   * Fecha menu ao redimensionar para desktop
   */
  function handleResize() {
    if (window.innerWidth >= 768 && isMenuOpen) {
      closeMenu();
    }
  }

  /**
   * Inicializa o menu
   */
  function init() {
    menuToggle = document.querySelector('.menu-toggle');
    navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) {
      return;
    }

    navLinks = Array.from(navMenu.querySelectorAll('.nav-link'));

    // Event listeners
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Fechar ao clicar nos links
    navLinks.forEach((link) => {
      link.addEventListener('click', handleLinkClick);
    });

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', handleKeyDown);

    // Fechar ao redimensionar
    window.addEventListener('resize', handleResize);

    // Atualizar overlay quando necessário
    if (window.innerWidth < 768) {
      if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        navOverlay.setAttribute('aria-hidden', 'true');
        navOverlay.addEventListener('click', closeMenu);
        document.body.appendChild(navOverlay);
      }
    }
  }

  // Inicializar quando DOM estiver pronto
  function start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  start();

  // API pública
  window.mobileMenu = {
    open: openMenu,
    close: closeMenu,
    toggle: toggleMenu,
  };
})();

