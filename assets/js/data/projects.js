/**
 * Fonte única de metadados de projetos (GitHub + externos + destaques)
 */

const PROJECT_CATALOG = [
 {
  id: 'nerdola-miner',
  name: 'Nerdola Miner',
  category: 'E-commerce',
  description:
   'Loja especializada em ASICs com calculadoras de rentabilidade, suporte e conteúdo para mineração de Bitcoin.',
  image: 'images/nerdolaminer.png',
  demoUrl: 'https://nerdolaminer.com.br/',
  repoUrl: 'https://nerdolaminer.com.br/',
  stack: ['PHP', 'Laravel', 'MySQL', 'Blade'],
  language: 'PHP',
  topics: ['laravel', 'blade', 'sql', 'php'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  isExternal: true,
 },
 {
  id: 'ponto-corte',
  name: 'PontoCorte',
  category: 'SaaS',
  description:
   'Sistema completo de gestão de barbearia com agendamento integrado, envio de mensagens via WhatsApp, controle financeiro e relatórios de desempenho.',
  image: 'images/pontocorte.png',
  demoUrl: 'https://app.pontocorte.com.br/',
  repoUrl: 'https://app.pontocorte.com.br/',
  stack: ['PHP', 'Laravel', 'MySQL', 'Livewire', 'TailwindCSS'],
  language: 'PHP',
  topics: ['laravel', 'livewire', 'barbershop', 'saas', 'whatsapp'],
  updatedAt: '2026-07-01T00:00:00Z',
  featured: true,
  isExternal: true,
 },
 {
  id: 'skyfashion',
  name: 'SkyFashion',
  category: 'E-commerce',
  description:
   'E-commerce de moda esportiva com catálogo, categorias e carrinho de compras.',
  image: 'images/skyfashion.png',
  demoUrl: 'https://skyfashion.pt/',
  repoUrl: 'https://skyfashion.pt/',
  stack: ['PHP', 'Laravel', 'MySQL', 'Blade'],
  language: 'PHP',
  topics: ['laravel', 'blade', 'sql', 'php', 'ecommerce'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  isExternal: true,
 },
 {
  id: 'lgf-contabilidade',
  name: 'LGF Contabilidade',
  category: 'Institucional',
  description:
   'Landing page institucional de contabilidade e consultoria para empresas.',
  image: 'images/lgf-contabilidade.png',
  demoUrl: 'https://lgfcontabilidade.com.br/',
  repoUrl: 'https://lgfcontabilidade.com.br/',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['html', 'css', 'javascript', 'institucional'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  isExternal: true,
 },
 {
  id: 'transcende',
  name: 'Transcende',
  description:
   'Site institucional para yoga, massagens, terapias e locação de espaços em São Paulo.',
  image: 'images/transcende.png',
  demoUrl: 'https://transcende.vercel.app/',
  repoUrl: 'https://transcende.vercel.app/',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['html', 'css', 'javascript', 'landing-page'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: false,
  isExternal: true,
 },
 {
  id: 'ntinformatica',
  name: 'Ntinformatica',
  description:
   'Site institucional da NT Informática com foco em suporte técnico e soluções completas em TI.',
  image: 'images/ntinformatica.png',
  demoUrl: 'https://nt-informatica.vercel.app/',
  repoUrl: 'https://nt-informatica.vercel.app/',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['html', 'css', 'javascript', 'institucional'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: false,
  isExternal: true,
 },
];

/** Repositórios GitHub com metadados customizados (fora do catálogo externo) */
const GITHUB_REPO_OVERRIDES = {
 Syncfinance: {
  image: 'images/syncfinance.png',
  description:
   'Aplicação web para organização e acompanhamento de finanças pessoais com Laravel.',
  stack: ['PHP', 'Laravel', 'MySQL'],
  language: 'PHP',
  topics: ['laravel', 'php', 'finance'],
 },
 Horientando: {
  image: 'images/horientando.png',
  description:
   'Trabalho de conclusão de curso com sistema completo desenvolvido em Laravel.',
  stack: ['PHP', 'Laravel', 'MySQL'],
  language: 'PHP',
  topics: ['laravel', 'tcc', 'php'],
 },
 Guicodex: {
  image: 'images/guicodex.png',
  description:
   'Portfólio interativo em estilo Pokédex para exibir projetos e habilidades de desenvolvedor.',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['portfolio', 'javascript', 'css'],
 },
};

/** Repositórios que não devem aparecer no carrossel / listagem */
export const EXCLUDED_PROJECT_NAMES = [
 'guiestevam.github.io',
 'guiestevam',
 'riftfinder',
];

export const FEATURED_PROJECTS = PROJECT_CATALOG.filter(
 (project) => project.featured
);

const FEATURED_NAMES = new Set(
 FEATURED_PROJECTS.map((project) => project.name.toLowerCase())
);

function findProjectByName(name) {
 if (!name) return null;
 const normalized = name.toLowerCase();
 return (
  PROJECT_CATALOG.find((project) => project.name.toLowerCase() === normalized) ||
  null
 );
}

function findGithubOverride(name) {
 if (!name) return null;
 if (GITHUB_REPO_OVERRIDES[name]) {
  return GITHUB_REPO_OVERRIDES[name];
 }
 const normalized = name.toLowerCase();
 const entry = Object.entries(GITHUB_REPO_OVERRIDES).find(
  ([key]) => key.toLowerCase() === normalized
 );
 return entry ? entry[1] : null;
}

export function isFeaturedProject(name) {
 if (!name) return false;
 return FEATURED_NAMES.has(name.toLowerCase());
}

export function getProjectCategory(name) {
 const project = findProjectByName(name);
 return project?.category || null;
}

export function resolveProjectImage(name) {
 const project = findProjectByName(name);
 if (project?.image) return project.image;

 const override = findGithubOverride(name);
 if (override?.image) return override.image;

 return null;
}

export function resolveProjectHomepage(name, githubHomepage = null) {
 const project = findProjectByName(name);
 if (project?.demoUrl) return project.demoUrl;

 const override = findGithubOverride(name);
 if (override?.demoUrl) return override.demoUrl;

 return githubHomepage || null;
}

export function resolveProjectDescription(name, apiDescription = '') {
 if (apiDescription?.trim()) return apiDescription.trim();

 const project = findProjectByName(name);
 if (project?.description) return project.description;

 const override = findGithubOverride(name);
 if (override?.description) return override.description;

 return '';
}

export function resolveProjectStack(name, fallbackLanguages = []) {
 const project = findProjectByName(name);
 if (project?.stack?.length) return [...project.stack];

 const override = findGithubOverride(name);
 if (override?.stack?.length) return [...override.stack];

 if (!Array.isArray(fallbackLanguages)) return [];

 return fallbackLanguages
  .filter((lang) => lang && typeof lang === 'string')
  .map((lang) => lang.trim())
  .filter(Boolean)
  .slice(0, 5);
}

export function isProductionProject(name, htmlUrl = '', homepage = null) {
 const project = findProjectByName(name);
 if (project?.isExternal) return true;

 const resolvedHomepage = resolveProjectHomepage(name, homepage);
 if (resolvedHomepage && !resolvedHomepage.includes('github.com')) return true;

 if (htmlUrl && !htmlUrl.includes('github.com')) return true;

 return false;
}

export function toGitHubRepoShape(project) {
 return {
  name: project.name,
  description: project.description,
  html_url: project.repoUrl || project.demoUrl,
  homepage: project.demoUrl,
  stargazers_count: 0,
  forks_count: 0,
  language: project.language,
  topics: project.topics || [],
  updated_at: project.updatedAt || new Date().toISOString(),
  fork: false,
  private: false,
 };
}

export const EXTERNAL_PROJECTS = PROJECT_CATALOG.filter(
 (project) => project.isExternal
).map(toGitHubRepoShape);

const GITHUB_USERNAME = 'GuiEstevam';

/**
 * Monta shape de repositório GitHub para fallback offline
 */
function buildGithubFallbackRepo(name, extras = {}) {
 return {
  name,
  description: extras.description || '',
  html_url: `https://github.com/${GITHUB_USERNAME}/${name}`,
  homepage: extras.demoUrl || extras.homepage || null,
  stargazers_count: extras.stargazers_count ?? 0,
  forks_count: extras.forks_count ?? 0,
  language: extras.language || null,
  topics: extras.topics || [],
  updated_at: extras.updatedAt || '2024-06-01T00:00:00Z',
  fork: false,
  private: false,
 };
}

/** Repositórios GitHub conhecidos para exibição sem API */
export const LOCAL_GITHUB_REPOS = Object.entries(GITHUB_REPO_OVERRIDES).map(
 ([name, override]) => buildGithubFallbackRepo(name, override)
);

/**
 * Contagens do portfólio para métricas do hero (fonte única)
 */
export function getPortfolioStats() {
 const catalogNames = new Set(
  PROJECT_CATALOG.map((project) => project.name.toLowerCase())
 );

 const githubOnlyCount = LOCAL_GITHUB_REPOS.filter(
  (repo) => !catalogNames.has(repo.name.toLowerCase())
 ).length;

 const portfolioTotal = PROJECT_CATALOG.length + githubOnlyCount;

 const liveSites = PROJECT_CATALOG.filter(
  (project) =>
   project.isExternal &&
   project.demoUrl &&
   !project.demoUrl.includes('github.com')
 ).length;

 return {
  portfolioTotal,
  liveSites,
  featuredCount: FEATURED_PROJECTS.length,
 };
}

function formatMetricValue(count) {
 if (count >= 10) return `${count}+`;
 return String(count);
}

export function getPortfolioMetricValue() {
 return formatMetricValue(getPortfolioStats().portfolioTotal);
}

export function getLiveSitesMetricValue() {
 return formatMetricValue(getPortfolioStats().liveSites);
}

function mergeReposByName(...repoGroups) {
 const byName = new Map();

 repoGroups.flat().forEach((repo) => {
  if (!repo?.name) return;
  byName.set(repo.name.toLowerCase(), repo);
 });

 return Array.from(byName.values());
}

/**
 * Catálogo local usado quando a API do GitHub não responde
 */
export function getPortfolioProjectsFallback() {
 return mergeReposByName(LOCAL_GITHUB_REPOS, EXTERNAL_PROJECTS);
}
