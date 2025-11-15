/**
 * Slider de Tecnologias - Transform translateX
 * Implementação usando transform para controle total sem conflitos com scroll
 */

(function () {
 'use strict';

 // Verificar preferência de movimento reduzido
 const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
 ).matches;

 // Elementos DOM
 let container = null;
 let track = null;
 let cards = null;
 let prevBtn = null;
 let nextBtn = null;
 let dotsContainer = null;
 let dots = [];

 // Estado
 let currentIndex = 0;
 let cardWidth = 0;
 let gap = 32; // Gap entre cards (deve corresponder ao CSS)
 let containerWidth = 0;
 let touchStartX = 0;
 let touchEndX = 0;
 let minSwipeDistance = 50;
 let lastClickTime = 0;
 let clickCooldown = 300; // Tempo em ms para considerar "cliques rápidos"

 /**
  * Calcula dimensões do slider
  */
 function calculateDimensions() {
  if (!container || !cards || cards.length === 0) return;

  containerWidth = container.offsetWidth;
  const firstCard = cards[0];
  cardWidth = firstCard.offsetWidth;
 }

 /**
  * Atualiza posição do slider via transform
  */
 function updatePosition(skipAnimation = false) {
  if (!track || !cards || cards.length === 0) return;

  const totalCards = cards.length;
  const maxIndex = totalCards - 1;

  // Limitar índice
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;

  // Calcular posição (centralizar no mobile, alinhar no desktop)
  const isMobile = window.innerWidth < 768;
  let offset = 0;

  if (isMobile) {
   // Mobile: centralizar o card
   offset = (containerWidth - cardWidth) / 2 - currentIndex * (cardWidth + gap);
  } else {
   // Desktop: alinhar à esquerda com padding
   const scrollPadding = window.innerWidth >= 1024 ? 100 : 80;
   offset = scrollPadding - currentIndex * (cardWidth + gap);
  }

  // Aplicar transform (instantâneo ou com transição)
  if (skipAnimation || prefersReducedMotion) {
   track.style.transition = 'none';
  } else {
   // Animação suave para cliques subsequentes
   track.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  track.style.transform = `translateX(${offset}px)`;

  // Atualizar UI
  updateUI();
 }

 /**
  * Vai para o card anterior
  */
 function goToPrev() {
  if (!cards || cards.length === 0) return;

  if (currentIndex > 0) {
   const now = Date.now();
   const timeSinceLastClick = now - lastClickTime;

   // Primeiro clique = instantâneo, cliques subsequentes rápidos = com animação
   const shouldAnimate =
    timeSinceLastClick < clickCooldown && timeSinceLastClick > 0;

   lastClickTime = now;
   currentIndex--;
   updatePosition(!shouldAnimate); // Instantâneo no primeiro clique, animado nos subsequentes
  }
 }

 /**
  * Vai para o próximo card
  */
 function goToNext() {
  if (!cards || cards.length === 0) return;

  if (currentIndex < cards.length - 1) {
   const now = Date.now();
   const timeSinceLastClick = now - lastClickTime;

   // Primeiro clique = instantâneo, cliques subsequentes rápidos = com animação
   const shouldAnimate =
    timeSinceLastClick < clickCooldown && timeSinceLastClick > 0;

   lastClickTime = now;
   currentIndex++;
   updatePosition(!shouldAnimate); // Instantâneo no primeiro clique, animado nos subsequentes
  }
 }

 /**
  * Vai para um card específico
  */
 function goToCard(index) {
  if (!cards || index < 0 || index >= cards.length) return;

  const now = Date.now();
  const timeSinceLastClick = now - lastClickTime;

  // Primeiro clique = instantâneo, cliques subsequentes rápidos = com animação
  const shouldAnimate =
   timeSinceLastClick < clickCooldown && timeSinceLastClick > 0;

  lastClickTime = now;
  currentIndex = index;
  updatePosition(!shouldAnimate); // Instantâneo no primeiro clique, animado nos subsequentes
 }

 /**
  * Atualiza UI (botões, dots)
  */
 function updateUI() {
  // Atualizar botões
  if (prevBtn) {
   prevBtn.disabled = currentIndex === 0;
   prevBtn.classList.toggle('disabled', currentIndex === 0);
   prevBtn.setAttribute('aria-disabled', currentIndex === 0 ? 'true' : 'false');
  }

  if (nextBtn) {
   nextBtn.disabled = currentIndex === cards.length - 1;
   nextBtn.classList.toggle('disabled', currentIndex === cards.length - 1);
   nextBtn.setAttribute(
    'aria-disabled',
    currentIndex === cards.length - 1 ? 'true' : 'false'
   );
  }

  // Atualizar dots
  dots.forEach((dot, index) => {
   dot.classList.toggle('active', index === currentIndex);
   dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
  });

  // Atualizar aria-live
  if (track) {
   const currentCard = cards[currentIndex];
   if (currentCard) {
    const cardTitle = currentCard.querySelector('h3')?.textContent || '';
    track.setAttribute('aria-label', `Slider de tecnologias - ${cardTitle}`);
   }
  }
 }

 /**
  * Cria dots de navegação
  */
 function createDots() {
  if (!dotsContainer || !cards || cards.length === 0) return;

  dotsContainer.innerHTML = '';
  dots = [];

  cards.forEach((card, index) => {
   const dot = document.createElement('button');
   dot.type = 'button';
   dot.className = 'slider-dot';
   dot.setAttribute('role', 'tab');
   dot.setAttribute('aria-label', `Ir para tecnologia ${index + 1}`);
   dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
   dot.setAttribute('tabindex', index === currentIndex ? '0' : '-1');

   if (index === currentIndex) {
    dot.classList.add('active');
   }

   dot.addEventListener('click', () => goToCard(index));

   dotsContainer.appendChild(dot);
   dots.push(dot);
  });
 }

 /**
  * Handlers de touch/swipe
  */
 function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
 }

 function handleTouchEnd(e) {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
 }

 function handleSwipe() {
  const swipeDistance = touchStartX - touchEndX;

  if (Math.abs(swipeDistance) > minSwipeDistance) {
   if (swipeDistance > 0) {
    // Swipe left - próximo
    goToNext();
   } else {
    // Swipe right - anterior
    goToPrev();
   }
  }
 }

 /**
  * Handler de keyboard navigation
  */
 function handleKeyDown(e) {
  if (!container || !container.contains(document.activeElement)) return;

  if (e.key === 'ArrowLeft') {
   e.preventDefault();
   goToPrev();
  } else if (e.key === 'ArrowRight') {
   e.preventDefault();
   goToNext();
  } else if (e.key === 'Home') {
   e.preventDefault();
   goToCard(0);
  } else if (e.key === 'End') {
   e.preventDefault();
   goToCard(cards.length - 1);
  }
 }

 /**
  * Handler de resize
  */
 let resizeTimeout;
 function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
   calculateDimensions();
   updatePosition(true); // Instantâneo no resize
  }, 150);
 }

 /**
  * Inicializa o slider
  */
 function init() {
  // Obter elementos DOM
  container = document.querySelector('.tech-slider-container');
  track = document.querySelector('.tech-slider-track');
  prevBtn = document.querySelector('.slider-btn-prev');
  nextBtn = document.querySelector('.slider-btn-next');
  dotsContainer = document.querySelector('.slider-dots');

  // Verificar se elementos existem
  if (!container || !track) {
   console.warn('Elementos do slider não encontrados');
   return;
  }

  // Obter cards
  cards = Array.from(track.querySelectorAll('.tech-card'));

  if (cards.length === 0) {
   console.warn('Nenhum card encontrado');
   return;
  }

  // Calcular dimensões
  calculateDimensions();

  // Criar dots
  createDots();

  // Event listeners dos botões
  if (prevBtn) {
   prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    goToPrev();
   });
  }

  if (nextBtn) {
   nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    goToNext();
   });
  }

  // Touch/swipe handlers
  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Keyboard navigation
  container.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleKeyDown);

  // Resize handler
  window.addEventListener('resize', handleResize);

  // Atualizar posição inicial
  updatePosition(true);

  // Aguardar carregamento completo antes de calcular novamente
  if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
     calculateDimensions();
     updatePosition(true);
    }, 100);
   });
  } else {
   setTimeout(() => {
    calculateDimensions();
    updatePosition(true);
   }, 100);
  }
 }

 // Inicializar quando DOM estiver pronto
 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
 } else {
  // DOM já está pronto
  setTimeout(init, 100);
 }
})();
