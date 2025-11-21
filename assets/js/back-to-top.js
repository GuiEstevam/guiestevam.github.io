/**
 * Botão "Voltar ao Topo"
 * Aparece quando o usuário rola a página para baixo
 * Segue padrões ES6+ e regras do projeto
 */

(function () {
  'use strict';

  let backToTopButton = null;
  let scrollTimeout = null;
  let isInitialized = false;
  let initAttempts = 0;
  const MAX_INIT_ATTEMPTS = 10;
  const SCROLL_THRESHOLD = 300; // Mostrar após 300px de scroll

  /**
   * Throttle para eventos de scroll (melhor performance)
   */
  function throttle(func, wait) {
    let timeout = null;
    let previous = 0;

    return function executedFunction(...args) {
      const now = Date.now();
      const remaining = wait - (now - previous);

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func(...args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          previous = Date.now();
          timeout = null;
          func(...args);
        }, remaining);
      }
    };
  }

  /**
   * Verifica se está em modo mobile
   */
  function isMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Verifica posição do scroll e mostra/esconde botão
   */
  function handleScroll() {
    if (!backToTopButton) {
      return;
    }

    try {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

      if (scrollY > SCROLL_THRESHOLD) {
        backToTopButton.classList.add('visible');
        backToTopButton.setAttribute('aria-hidden', 'false');
        backToTopButton.removeAttribute('tabindex');
      } else {
        backToTopButton.classList.remove('visible');
        backToTopButton.setAttribute('aria-hidden', 'true');
        backToTopButton.setAttribute('tabindex', '-1');
      }
    } catch (error) {
      console.error('Back-to-top: erro ao processar scroll', error);
    }
  }

  /**
   * Scroll suave ao topo
   */
  function scrollToTop(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });

      // Focar no elemento hero após scroll para acessibilidade
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const delay = prefersReducedMotion ? 100 : 500;
        setTimeout(() => {
          try {
            heroSection.setAttribute('tabindex', '-1');
            heroSection.focus();
          } catch (error) {
            // Se não conseguir focar, continuar normalmente
            console.warn('Back-to-top: não foi possível focar no hero', error);
          }
        }, delay);
      }
    } catch (error) {
      console.error('Back-to-top: erro ao fazer scroll para o topo', error);
    }
  }

  /**
   * Ajusta z-index dinamicamente baseado no estado do menu mobile
   */
  function updateZIndex() {
    if (!backToTopButton) {
      return;
    }

    try {
      // Verificar se menu mobile está aberto
      const navMenu = document.querySelector('.nav-menu');
      const isMenuOpen = navMenu && navMenu.classList.contains('active');

      // Z-index: quando menu mobile está aberto (z-index 10010), botão deve ficar abaixo
      if (isMobile() && isMenuOpen) {
        // Menu aberto: z-index muito menor e esconder o botão
        backToTopButton.style.zIndex = '1000';
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
        backToTopButton.style.pointerEvents = 'none';
      } else {
        // Menu fechado ou desktop: z-index normal e restaurar visibilidade
        backToTopButton.style.zIndex = '1003';
        // Restaurar visibilidade se estava visível antes
        if (backToTopButton.classList.contains('visible')) {
          backToTopButton.style.opacity = '';
          backToTopButton.style.visibility = '';
          backToTopButton.style.pointerEvents = '';
        }
      }
    } catch (error) {
      console.warn('Back-to-top: erro ao atualizar z-index', error);
    }
  }

  /**
   * Observa mudanças no menu mobile para ajustar z-index
   */
  function observeMenuState() {
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navMenu) {
      return;
    }

    // Observer para mudanças na classe 'active' do menu
    const observer = new MutationObserver(() => {
      updateZIndex();
    });

    observer.observe(navMenu, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Também verificar em resize
    window.addEventListener('resize', () => {
      updateZIndex();
    }, { passive: true });
  }

  /**
   * Inicializa o botão
   */
  function init() {
    // Evitar inicialização duplicada
    if (isInitialized) {
      return;
    }

    initAttempts++;

    try {
      // Verificar se botão já existe (evitar duplicatas)
      const existingButton = document.getElementById('back-to-top');
      if (existingButton) {
        backToTopButton = existingButton;
        isInitialized = true;
        return;
      }

      // Verificar se o body existe
      if (!document.body) {
        if (initAttempts < MAX_INIT_ATTEMPTS) {
          setTimeout(init, 200);
        } else {
          console.warn('Back-to-top: body não encontrado após', MAX_INIT_ATTEMPTS, 'tentativas');
        }
        return;
      }

      // Criar botão
      backToTopButton = document.createElement('button');
      backToTopButton.id = 'back-to-top';
      backToTopButton.className = 'back-to-top-button';
      backToTopButton.setAttribute('aria-label', 'Voltar ao topo da página');
      backToTopButton.setAttribute('aria-hidden', 'true');
      backToTopButton.setAttribute('tabindex', '-1');
      backToTopButton.setAttribute('type', 'button');
      backToTopButton.innerHTML =
        '<i class="icon solid fa-chevron-up" aria-hidden="true"></i>';
      
      document.body.appendChild(backToTopButton);

      // Throttle no scroll para melhor performance
      const throttledHandleScroll = throttle(handleScroll, 100);
      
      // Remover listeners antigos se existirem
      window.removeEventListener('scroll', handleScroll);
      
      // Adicionar event listeners
      window.addEventListener('scroll', throttledHandleScroll, { passive: true });
      backToTopButton.addEventListener('click', scrollToTop);

      // Observar estado do menu mobile para ajustar z-index
      observeMenuState();

      // Verificar posição inicial
      handleScroll();
      updateZIndex();

      isInitialized = true;
    } catch (error) {
      console.error('Back-to-top: erro na inicialização', error);
      if (initAttempts < MAX_INIT_ATTEMPTS) {
        setTimeout(init, 200);
      }
    }
  }

  /**
   * Inicializar quando DOM estiver pronto
   */
  function start() {
    // Aguardar um pouco para garantir que o DOM está totalmente renderizado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // Pequeno delay para garantir que todos os elementos estão no DOM
        setTimeout(() => {
          init();
        }, 150);
      });
    } else {
      // DOM já está pronto, mas aguardar um pouco para garantir renderização completa
      // Usar múltiplos requestAnimationFrame para garantir que o DOM está totalmente renderizado
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            init();
          }, 50);
        });
      });
    }
  }

  // Sempre executar - a função start() já verifica se o DOM está pronto
  start();

  // API pública
  window.backToTop = {
    show: () => {
      if (backToTopButton) {
        backToTopButton.classList.add('visible');
        backToTopButton.setAttribute('aria-hidden', 'false');
      }
    },
    hide: () => {
      if (backToTopButton) {
        backToTopButton.classList.remove('visible');
        backToTopButton.setAttribute('aria-hidden', 'true');
      }
    },
    scroll: scrollToTop,
    init: init, // Exportar init para ser chamado manualmente se necessário
  };
})();

