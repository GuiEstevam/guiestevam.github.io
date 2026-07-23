/**
 * Fonte única de metadados de projetos (GitHub + externos + destaques)
 *
 * featuredOrder: ordem no carrossel (menor = primeiro)
 * ready: false = ainda não exibir (ex.: sem screenshot)
 */

const PROJECT_CATALOG = [
 {
  id: 'ponto-corte',
  name: 'PontoCorte',
  category: 'SaaS',
  description:
   'Agenda, mensagens e financeiro da barbearia estavam espalhados. Entreguei um SaaS em Laravel e Livewire com WhatsApp, agendamento e painel financeiro unificados.',
  outcome: 'Agendamento, WhatsApp e financeiro em um só painel.',
  image: 'images/pontocorte.png',
  demoUrl: 'https://app.pontocorte.com.br/',
  repoUrl: 'https://app.pontocorte.com.br/',
  stack: ['PHP', 'Laravel', 'MySQL', 'Livewire', 'TailwindCSS'],
  language: 'PHP',
  topics: ['laravel', 'livewire', 'barbershop', 'saas', 'whatsapp'],
  updatedAt: '2026-07-01T00:00:00Z',
  featured: true,
  featuredOrder: 1,
  isExternal: true,
 },
 {
  id: 'nerdola-miner',
  name: 'Nerdola Miner',
  category: 'E-commerce',
  description:
   'Loja de ASICs precisava de catálogo, conteúdo técnico e calculadoras de rentabilidade. Desenvolvi o e-commerce em Laravel, em produção.',
  outcome: 'Catálogo + calculadoras de rentabilidade em produção.',
  image: 'images/nerdolaminer.png',
  demoUrl: 'https://nerdolaminer.com.br/',
  repoUrl: 'https://nerdolaminer.com.br/',
  stack: ['PHP', 'Laravel', 'MySQL', 'Blade'],
  language: 'PHP',
  topics: ['laravel', 'blade', 'sql', 'php'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  featuredOrder: 2,
  isExternal: true,
 },
 {
  id: 'skyfashion',
  name: 'SkyFashion',
  category: 'E-commerce',
  description:
   'As vendas aconteciam pelo Instagram; o projeto deu à marca uma vitrine própria e presença digital mais sólida, com catálogo, categorias e carrinho.',
  outcome: 'Loja online com catálogo, categorias e carrinho.',
  image: 'images/skyfashion.png',
  demoUrl: 'https://skyfashion.pt/',
  repoUrl: 'https://skyfashion.pt/',
  stack: ['PHP', 'Laravel', 'MySQL', 'Blade'],
  language: 'PHP',
  topics: ['laravel', 'blade', 'sql', 'php', 'ecommerce'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  featuredOrder: 3,
  isExternal: true,
 },
 {
  id: 'ntinformatica',
  name: 'Ntinformatica',
  category: 'Institucional',
  description:
   'A empresa precisava de um site institucional claro, com caminho direto para a plataforma de suporte.',
  outcome: 'Site institucional da NT com foco em serviços de TI.',
  image: 'images/ntinformatica.png',
  demoUrl: 'https://nt-informatica.vercel.app/',
  repoUrl: 'https://nt-informatica.vercel.app/',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['html', 'css', 'javascript', 'institucional'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  featuredOrder: 4,
  isExternal: true,
 },
 {
  id: 'lgf-contabilidade',
  name: 'LGF Contabilidade',
  category: 'Institucional',
  description:
   'Landing page institucional de contabilidade e consultoria para empresas.',
  outcome: 'Presença digital institucional com foco em conversão.',
  image: 'images/lgf-contabilidade.png',
  demoUrl: 'https://lgfcontabilidade.com.br/',
  repoUrl: 'https://lgfcontabilidade.com.br/',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['html', 'css', 'javascript', 'institucional'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  featuredOrder: 5,
  isExternal: true,
 },
 {
  id: 'transcende',
  name: 'Transcende',
  category: 'Institucional',
  description:
   'O site antigo pedia um visual mais alinhado ao negócio e um fluxo de agendamento e financeiro no próprio canal.',
  outcome: 'Visual renovado com agendamento e financeiro no site.',
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
  id: 'automacao-ops',
  name: 'Automação operacional',
  category: 'Automação',
  description:
   'Projeto de automação em desenvolvimento — será publicado com demo e screenshot.',
  outcome: 'Em desenvolvimento.',
  image: 'images/pontocorte.png',
  demoUrl: '',
  repoUrl: '',
  stack: ['Python'],
  language: 'Python',
  topics: ['automation'],
  updatedAt: '2026-07-22T00:00:00Z',
  featured: false,
  isExternal: true,
  ready: false,
 },
];

const VISIBLE_CATALOG = PROJECT_CATALOG.filter(
 (project) => project.ready !== false
);

/** Repositórios GitHub com metadados customizados (fora do catálogo externo) */
const GITHUB_REPO_OVERRIDES = {
 Syncfinance: {
  image: 'images/syncfinance.png',
  category: 'Open source',
  description:
   'Aplicação web para organização e acompanhamento de finanças pessoais com Laravel.',
  outcome: 'App Laravel para organizar e acompanhar finanças pessoais.',
  stack: ['PHP', 'Laravel', 'MySQL'],
  language: 'PHP',
  topics: ['laravel', 'php', 'finance'],
 },
 Horientando: {
  image: 'images/horientando.png',
  category: 'Open source',
  description:
   'Trabalho de conclusão de curso com sistema completo desenvolvido em Laravel.',
  outcome: 'TCC com sistema completo em Laravel.',
  stack: ['PHP', 'Laravel', 'MySQL'],
  language: 'PHP',
  topics: ['laravel', 'tcc', 'php'],
 },
 Guicodex: {
  image: 'images/guicodex.png',
  category: 'Portfólio',
  description:
   'Portfólio interativo em estilo Pokédex para exibir projetos e habilidades de desenvolvedor.',
  outcome: 'Portfólio interativo em estilo Pokédex.',
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

export const FEATURED_PROJECTS = VISIBLE_CATALOG.filter(
 (project) => project.featured
).sort(
 (a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99)
);

const FEATURED_NAMES = new Set(
 FEATURED_PROJECTS.map((project) => project.name.toLowerCase())
);

function findProjectByName(name) {
 if (!name) return null;
 const normalized = name.toLowerCase();
 return (
  VISIBLE_CATALOG.find((project) => project.name.toLowerCase() === normalized) ||
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
 if (project?.category) return project.category;

 const override = findGithubOverride(name);
 return override?.category || null;
}

export function resolveProjectOutcome(name) {
 const project = findProjectByName(name);
 if (project?.outcome) return project.outcome;

 const override = findGithubOverride(name);
 return override?.outcome || null;
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

export const EXTERNAL_PROJECTS = VISIBLE_CATALOG.filter(
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
  VISIBLE_CATALOG.map((project) => project.name.toLowerCase())
 );

 const githubOnlyCount = LOCAL_GITHUB_REPOS.filter(
  (repo) => !catalogNames.has(repo.name.toLowerCase())
 ).length;

 const portfolioTotal = VISIBLE_CATALOG.length + githubOnlyCount;

 const liveSites = VISIBLE_CATALOG.filter(
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
