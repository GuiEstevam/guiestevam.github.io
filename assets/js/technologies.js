/**
 * Grid de Tecnologias - Refatorado do Zero
 * Funcionalidade mostrar mais/menos com animações suaves
 */

(function () {
  'use strict';

  // Verificar preferência de movimento reduzido
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Configuração
  const INITIAL_CARDS = 4; // Cards iniciais a mostrar (1 linha de 4 cards)

  // Estado
  let grid = null;
  let cards = [];
  let btnMore = null;
  let btnLess = null;
  let visibleCount = INITIAL_CARDS;
  let columnsPerRow = 1;

  /**
   * Inicialização
   */
  function init() {
    grid = document.getElementById('technologies-grid');
    btnMore = document.getElementById('btn-show-more');
    btnLess = document.getElementById('btn-show-less');

    if (!grid) {
      console.warn('Grid de tecnologias não encontrado');
      return;
    }

    cards = Array.from(grid.querySelectorAll('.technology-card'));

    if (cards.length === 0) {
      console.warn('Nenhum card de tecnologia encontrado');
      return;
    }

    // Calcular colunas por linha
    calculateColumns();

    // Configurar visibilidade inicial
    setupInitialVisibility();

    // Event listeners
    if (btnMore) {
      btnMore.addEventListener('click', handleShowMore);
    }

    if (btnLess) {
      btnLess.addEventListener('click', handleShowLess);
    }

    // Resize listener
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const oldColumns = columnsPerRow;
        calculateColumns();

        if (oldColumns !== columnsPerRow) {
          // Recalcular visibilidade se colunas mudaram
          // Manter a mesma quantidade de cards visíveis, ajustando para múltiplos de 4
          const currentRows = Math.ceil(visibleCount / 4);
          visibleCount = Math.min(currentRows * 4, cards.length);
          updateVisibility();
        }
      }, 150);
    });
  }

  /**
   * Calcula quantas colunas o grid tem atualmente
   */
  function calculateColumns() {
    if (!grid) return;

    const computedStyle = window.getComputedStyle(grid);
    const gridTemplateColumns = computedStyle.gridTemplateColumns;

    if (gridTemplateColumns && gridTemplateColumns !== 'none') {
      const columns = gridTemplateColumns.split(' ').filter(
        (val) => val && val.trim() !== ''
      ).length;

      if (columns > 0) {
        columnsPerRow = columns;
      } else {
        // Fallback baseado na largura da tela
        const width = window.innerWidth;
        columnsPerRow = width >= 1024 ? 4 : width >= 768 ? 2 : 1;
      }
    } else {
      // Fallback baseado na largura da tela
      const width = window.innerWidth;
      columnsPerRow = width >= 1024 ? 4 : width >= 768 ? 2 : 1;
    }

    columnsPerRow = Math.max(1, columnsPerRow);
  }

  /**
   * Configura visibilidade inicial dos cards
   */
  function setupInitialVisibility() {
    // Sempre mostrar exatamente 4 cards inicialmente (independente do número de colunas)
    visibleCount = Math.min(INITIAL_CARDS, cards.length);
    updateVisibility();
  }

  /**
   * Atualiza visibilidade dos cards
   */
  function updateVisibility() {
    cards.forEach((card, index) => {
      const isVisible = index < visibleCount;
      const wasHidden = card.classList.contains('is-hidden');

      if (isVisible) {
        // Mostrar card
        if (wasHidden) {
          // Revelar com animação
          card.classList.remove('is-hidden');
          card.classList.add('is-revealing');

          // Delay escalonado para animação em cascata (sempre usando 4 como base para linhas)
          // Delay baseado na posição na linha atual (0-3) e linha (0, 4, 8, etc.)
          const rowIndex = Math.floor(index / 4);
          const positionInRow = index % 4;
          
          // Delay mais pronunciado para efeito cascata mais visível
          const delay = (rowIndex * 0.08) + (positionInRow * 0.05);

          card.style.animationDelay = prefersReducedMotion ? '0s' : `${delay}s`;

          // Forçar reflow para garantir que o estado inicial seja aplicado
          void card.offsetHeight;

          // Remover classe de animação após concluir
          setTimeout(() => {
            card.classList.remove('is-revealing');
            card.style.animationDelay = '';
          }, prefersReducedMotion ? 0 : 600 + delay * 1000);
        }
      } else {
        // Esconder card
        card.classList.remove('is-revealing');
        card.classList.add('is-hidden');
        card.style.animationDelay = '';
      }

      card.setAttribute('aria-hidden', !isVisible);
    });

    updateButtons();
  }

  /**
   * Handler para mostrar mais
   */
  function handleShowMore() {
    // Sempre adicionar 4 cards por vez (uma linha completa)
    const cardsToAdd = 4;
    visibleCount = Math.min(visibleCount + cardsToAdd, cards.length);
    updateVisibility();

    // Scroll suave para o botão para mostrar os novos cards e manter o controle visível
    // Usar o container dos botões para garantir que ambos os botões sejam visíveis
    const actionsContainer = btnMore?.parentElement;
    const targetElement = actionsContainer || btnMore;
    
    if (targetElement && !prefersReducedMotion) {
      // Delay para garantir que as animações dos cards começaram antes do scroll
      setTimeout(() => {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'nearest'
        });
      }, 300); // Delay um pouco maior para a animação dos cards começar
    } else if (targetElement && prefersReducedMotion) {
      // Sem animação, scroll imediato
      setTimeout(() => {
        targetElement.scrollIntoView({ 
          behavior: 'auto', 
          block: 'nearest',
          inline: 'nearest'
        });
      }, 100);
    }
  }

  /**
   * Handler para mostrar menos
   */
  function handleShowLess() {
    // Voltar para exatamente 4 cards (estado inicial)
    visibleCount = Math.min(INITIAL_CARDS, cards.length);
    updateVisibility();

    // Scroll suave para o topo da seção
    const section = document.getElementById('tecnologias');
    if (section && !prefersReducedMotion) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  /**
   * Atualiza visibilidade dos botões
   */
  function updateButtons() {
    const isFullyExpanded = visibleCount >= cards.length;
    const hasMoreCards = visibleCount < cards.length;
    const hasMoreThanInitial = visibleCount > INITIAL_CARDS;

    if (isFullyExpanded) {
      // Expandido completamente: mostrar apenas "mostrar menos"
      if (btnMore) {
        btnMore.classList.add('is-hidden');
        btnMore.setAttribute('aria-expanded', 'false');
      }
      if (btnLess) {
        btnLess.classList.remove('is-hidden');
        btnLess.setAttribute('aria-expanded', 'true');
      }
    } else if (hasMoreCards) {
      // Há mais cards: mostrar "mostrar mais" e "mostrar menos" sempre que houver mais de 4 cards
      if (btnMore) {
        btnMore.classList.remove('is-hidden');
        btnMore.setAttribute('aria-expanded', 'false');
      }
      if (btnLess) {
        // "Mostrar menos" sempre visível quando há mais de 4 cards
        if (hasMoreThanInitial) {
          btnLess.classList.remove('is-hidden');
          btnLess.setAttribute('aria-expanded', 'true');
        } else {
          btnLess.classList.add('is-hidden');
          btnLess.setAttribute('aria-expanded', 'false');
        }
      }
    } else {
      // Não há mais cards: esconder ambos
      if (btnMore) {
        btnMore.classList.add('is-hidden');
      }
      if (btnLess) {
        btnLess.classList.add('is-hidden');
      }
    }
  }

  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM já está pronto
    init();
  }
})();
