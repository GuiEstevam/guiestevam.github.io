/**
 * Renderiza métricas do portfólio a partir da fonte única
 */

import { HERO_METRICS, getTerminalMetricsLine } from './data/metrics.js';

const COUNT_UP_DURATION_MS = 1200;

/**
 * Preenche métricas do hero (a seção sobre usa trajetória estática)
 */
export function renderPortfolioMetrics() {
 renderMetricsGrid('hero-stats-grid', HERO_METRICS, 'hero-stat');
 updateTerminalMetricsLine();
}

function renderMetricsGrid(containerId, metrics, prefix) {
 const container = document.getElementById(containerId);
 if (!container || !Array.isArray(metrics)) return;

 container.innerHTML = '';

 metrics.forEach((metric) => {
  const item = document.createElement('div');
  item.className = `${prefix}-item`;
  item.setAttribute('role', 'listitem');

  const number = document.createElement('span');
  number.className = `${prefix}-number font-mono`;
  number.setAttribute('aria-label', metric.ariaLabel);
  number.textContent = metric.value;

  const label = document.createElement('span');
  label.className = `${prefix}-label`;
  label.textContent = metric.label;

  item.appendChild(number);
  item.appendChild(label);
  container.appendChild(item);
 });

 initCountUp(container, `${prefix}-number`);
}

/**
 * Anima os números das métricas (count-up) quando entram no viewport.
 * O valor final permanece no aria-label, então leitores de tela não são afetados.
 */
function initCountUp(container, numberClass) {
 const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
 ).matches;
 if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

 const numbers = Array.from(container.querySelectorAll(`.${numberClass}`));
 const targets = numbers
  .map((el) => {
   const match = /^(\D*)(\d+)(\D*)$/.exec(el.textContent.trim());
   if (!match) return null;
   return { el, prefix: match[1], value: Number(match[2]), suffix: match[3] };
  })
  .filter(Boolean);

 if (targets.length === 0) return;

 const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
   if (!entry.isIntersecting) return;
   observer.unobserve(entry.target);
   const target = targets.find((item) => item.el === entry.target);
   if (target) animateCountUp(target);
  });
 }, { threshold: 0.4 });

 targets.forEach(({ el, prefix, suffix }) => {
  el.textContent = `${prefix}0${suffix}`;
  observer.observe(el);
 });
}

function animateCountUp({ el, prefix, value, suffix }) {
 const start = performance.now();

 const tick = (now) => {
  const progress = Math.min((now - start) / COUNT_UP_DURATION_MS, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  el.textContent = `${prefix}${Math.round(value * eased)}${suffix}`;
  if (progress < 1) requestAnimationFrame(tick);
 };

 requestAnimationFrame(tick);
}

function updateTerminalMetricsLine() {
 const line = getTerminalMetricsLine();
 const terminalLine = document.querySelector(
  '.hero-terminal-body .hero-code-str[data-metrics-line="true"]'
 );

 if (terminalLine) {
  terminalLine.textContent = `"${line}\\n"`;
 }
}
