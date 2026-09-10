/**
 * Lógica do Showcase de Dispositivos (MacBook + iPhone) no Hero
 * Adiciona swipe no mobile, rotação paralaxe 3D no desktop,
 * rotação automática de slides e indicadores (dots).
 */

export function initHeroShowcase() {
  const showcase = document.getElementById('hero-device-showcase');
  if (!showcase) return;

  const devices = showcase.querySelectorAll('.device-mockup');
  const macbookSlides = showcase.querySelectorAll('.macbook-screen .screen-slide');
  const iphoneSlides = showcase.querySelectorAll('.iphone-screen .screen-slide');
  const dots = showcase.querySelectorAll('.showcase-dots .dot');
  const totalSlides = macbookSlides.length;

  let currentSlide = 0;
  let slideshowInterval = null;
  const slideDuration = 8000; // 8 segundos

  // --- AUTOMATIC SLIDESHOW LOGIC ---
  const changeSlide = (nextIndex) => {
    // Remove .active de todos os slides e dots
    macbookSlides.forEach(slide => slide.classList.remove('active'));
    iphoneSlides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => {
      dot.classList.remove('active');
      dot.setAttribute('aria-selected', 'false');
    });

    // Adiciona .active ao próximo slide e dot
    macbookSlides[nextIndex].classList.add('active');
    iphoneSlides[nextIndex].classList.add('active');
    if (dots[nextIndex]) {
      dots[nextIndex].classList.add('active');
      dots[nextIndex].setAttribute('aria-selected', 'true');
    }

    // Força o carregamento da imagem do slide ativo se for lazy
    const macbookImg = macbookSlides[nextIndex].querySelector('img');
    const iphoneImg = iphoneSlides[nextIndex].querySelector('img');
    if (macbookImg && macbookImg.loading === 'lazy') {
      macbookImg.loading = 'eager';
    }
    if (iphoneImg && iphoneImg.loading === 'lazy') {
      iphoneImg.loading = 'eager';
    }

    currentSlide = nextIndex;
  };

  const startSlideshow = () => {
    slideshowInterval = setInterval(() => {
      const nextIndex = (currentSlide + 1) % totalSlides;
      changeSlide(nextIndex);
    }, slideDuration);
  };

  const stopSlideshow = () => {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
  };

  const goToSlide = (index) => {
    const nextIndex = (index + totalSlides) % totalSlides;
    if (nextIndex === currentSlide) return;
    stopSlideshow();
    changeSlide(nextIndex);
    startSlideshow();
  };

  // --- DOTS INTERACTION LOGIC ---
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.currentTarget.dataset.index, 10);
      if (isNaN(targetIndex) || targetIndex === currentSlide) return;
      goToSlide(targetIndex);
    });
  });

  // --- SWIPE (mobile / touch) ---
  const SWIPE_THRESHOLD = 36;
  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeLocked = false;

  showcase.addEventListener(
    'pointerdown',
    (event) => {
      swipeStartX = event.clientX;
      swipeStartY = event.clientY;
      swipeLocked = false;
      if (showcase.setPointerCapture) {
        showcase.setPointerCapture(event.pointerId);
      }
    },
    { passive: true }
  );

  showcase.addEventListener(
    'pointerup',
    (event) => {
      if (swipeLocked) return;
      const dx = event.clientX - swipeStartX;
      const dy = event.clientY - swipeStartY;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      swipeLocked = true;
      goToSlide(dx < 0 ? currentSlide + 1 : currentSlide - 1);
    },
    { passive: true }
  );

  // Inicializa o temporizador
  startSlideshow();

  // --- 3D PARALLAX TILT LOGIC (só ponteiro fino; no touch atrapalha o swipe) ---
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) {
    window.addEventListener('beforeunload', stopSlideshow);
    return;
  }

  let request = null;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  const ease = 0.08;

  showcase.addEventListener('mousemove', (e) => {
    const rect = showcase.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    mouseX = (x / (rect.width / 2)) * 12;
    mouseY = -(y / (rect.height / 2)) * 12;

    if (!request) {
      request = requestAnimationFrame(updateTransforms);
    }
  });

  showcase.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
    if (!request) {
      request = requestAnimationFrame(updateTransforms);
    }
  });

  function updateTransforms() {
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    devices.forEach((device) => {
      if (device.classList.contains('macbook')) {
        device.style.transform = `translateZ(-30px) rotateX(${2 + currentY * 0.4}deg) rotateY(${4 + currentX * 0.4}deg)`;
      } else if (device.classList.contains('iphone')) {
        device.style.transform = `translateZ(60px) rotateX(${1 + currentY * 0.8}deg) rotateY(${-8 + currentX * 0.8}deg) scale(1.02)`;
      }
    });

    if (Math.abs(mouseX - currentX) > 0.01 || Math.abs(mouseY - currentY) > 0.01) {
      request = requestAnimationFrame(updateTransforms);
    } else {
      currentX = mouseX;
      currentY = mouseY;
      request = null;
    }
  }

  // --- CONTROLLER CLEANUP (Para SPA/Navigation) ---
  window.addEventListener('beforeunload', stopSlideshow);
}
