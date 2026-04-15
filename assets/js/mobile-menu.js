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

  /**
   * Verifica se está em modo mobile
   */
  function isMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Scroll suave customizado
   * @param {number} targetPosition - Posição alvo em pixels
   * @param {number} duration - Duração da animação em ms
   */
  function smoothScrollTo(targetPosition, duration = 600) {
    // Não verificar prefersReducedMotion aqui porque o scroll é uma ação do usuário
    // (ele clicou no link), não uma animação automática
    
    const startPosition = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;
    
    // Se a distância for muito pequena, fazer scroll instantâneo
    if (Math.abs(distance) < 10) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'auto'
      });
      return;
    }
    
    let startTime = null;
    let animationFrameId = null;
    let frameCount = 0;

    function animation(currentTime) {
      if (startTime === null) {
        startTime = currentTime;
      }
      
      frameCount++;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (easeInOutCubic)
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentPosition = startPosition + (distance * ease);
      
      // Usar scrollTo direto (sem options) para animação manual suave
      window.scrollTo(0, Math.round(currentPosition));
      
      if (timeElapsed < duration) {
        animationFrameId = requestAnimationFrame(animation);
      } else {
        // Garantir que chegamos exatamente na posição final
        window.scrollTo({
          top: targetPosition,
          behavior: 'auto'
        });
      }
    }

    animationFrameId = requestAnimationFrame(animation);
    
    // Retornar função para cancelar se necessário
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
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

    // Se for link externo, não interferir - deixar o navegador processar
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('//')) {
      // Não prevenir comportamento padrão - deixar o link funcionar normalmente
      // Fechar menu após um pequeno delay para permitir que o clique seja processado
      setTimeout(() => {
        closeMenu();
      }, 150);
      return;
    }

    // Se for âncora, prevenir comportamento padrão e fazer scroll suave
    if (href.startsWith('#')) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Fechar menu primeiro
        closeMenu();
        
        // Aguardar um pequeno delay para o menu começar a fechar, depois fazer scroll suave
        setTimeout(() => {
          const headerHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
          const targetPosition = Math.max(0, targetElement.offsetTop - headerHeight);
          
          // Usar scroll suave customizado
          smoothScrollTo(targetPosition, 600);
          
          // Atualizar URL
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }, 150); // Delay pequeno para o menu começar a fechar
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

    // Event listener no toggle
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Event delegation no menu para links
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
        return;
      }
      
      // Verificar se é um link (a) ou botão dentro do menu
      const link = e.target.closest('a');
      const button = e.target.closest('button');
      
      // Se for um link ou botão dentro do menu, processar
      if (link || button) {
        handleLinkClick(e);
      }
    }, false);

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', handleKeyDown);

    // Fechar ao clicar fora do menu (sem capture phase para não interferir com links)
    document.addEventListener('click', (e) => {
      // Só processar se menu estiver aberto e estiver no mobile
      if (!isMenuOpen || !isMobile()) {
        return;
      }

      // Verificar se o clique foi dentro do menu ou no toggle
      const clickedInsideMenu = navMenu && navMenu.contains(e.target);
      const clickedOnToggle = menuToggle && (menuToggle === e.target || menuToggle.contains(e.target));

      // Se clicou dentro do menu ou no toggle, não fazer nada
      if (clickedInsideMenu || clickedOnToggle) {
        return;
      }

      // Se clicou fora, fechar menu
      closeMenu();
    }, false); // SEM capture phase - deixar links processarem primeiro

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
