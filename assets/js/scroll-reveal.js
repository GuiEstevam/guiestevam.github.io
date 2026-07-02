// scroll-reveal.js – vanilla IntersectionObserver for scroll animations
export function initScrollReveal() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const anim = el.dataset.reveal || 'fade';
        el.classList.add(`reveal-${anim}`);
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.add('reveal-hidden');
    observer.observe(el);
  });
}
