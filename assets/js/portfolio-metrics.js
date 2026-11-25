/**
 * Renderiza métricas do portfólio a partir da fonte única
 */

import { HERO_METRICS, getTerminalMetricsLine } from './data/metrics.js';
import { getPortfolioStats } from './data/projects.js';

/**
 * Preenche métricas do hero (a seção sobre usa trajetória estática)
 */
export function renderPortfolioMetrics() {
 renderMetricsGrid('hero-stats-grid', HERO_METRICS, 'hero-stat');
 updateTerminalMetricsLine();
 updateLiveSitesCount();
}

/** Mantém o número de projetos no ar igual ao catálogo (o HTML traz o valor estático) */
function updateLiveSitesCount() {
 const { liveSites } = getPortfolioStats();
 document.querySelectorAll('[data-metric="live-sites"]').forEach((el) => {
  el.textContent = String(liveSites);
 });
}

function renderMetricsGrid(containerId, metrics, prefix) {
 const container = document.getElementById(containerId);
 if (!container || !Array.isArray(metrics)) return;

 container.textContent = '';

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
