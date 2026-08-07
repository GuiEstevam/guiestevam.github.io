/**
 * Lógica do Showcase de Dispositivos (MacBook + iPhone) no Hero
 * Adiciona rotação paralaxe 3D, rotação automática de slides (slideshow)
 * e indicadores interativos (dots).
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

  // --- DOTS INTERACTION LOGIC ---
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.dataset.index, 10);
      if (isNaN(targetIndex) || targetIndex === currentSlide) return;

      stopSlideshow();
      changeSlide(targetIndex);
      startSlideshow();
    });
  });

  // Inicializa o temporizador
  startSlideshow();

  // --- 3D PARALLAX TILT LOGIC ---
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
