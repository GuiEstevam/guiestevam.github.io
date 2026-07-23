/**
 * Métricas centralizadas do portfólio (hero, sobre, terminal)
 */

import { getLiveSitesMetricValue, getPortfolioStats } from './projects.js';

function buildHeroMetrics() {
 const { liveSites } = getPortfolioStats();

 return [
  {
   value: '3+',
   label: 'anos de experiência',
   ariaLabel: '3 ou mais anos de experiência',
  },
  {
   value: getLiveSitesMetricValue(),
   label: 'sites no ar',
   ariaLabel: `${liveSites} ou mais sites no ar`,
  },
  {
   value: '12+',
   label: 'tecnologias',
   ariaLabel: '12 ou mais tecnologias',
  },
 ];
}

export const HERO_METRICS = buildHeroMetrics();

export function getTerminalStackLine() {
 return 'Laravel · Vue.js · PHP · MySQL';
}

export function getTerminalFocusLine() {
 return 'Do backend ao deploy.';
}

/** Linha dinâmica do echo de stack no HTML do terminal */
export function getTerminalMetricsLine() {
 return getTerminalStackLine();
}
