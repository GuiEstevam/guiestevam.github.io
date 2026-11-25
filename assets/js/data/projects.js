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
   'SaaS de gestão integrada para barbearias de alto fluxo. Unifica agendamentos em tempo real, fluxo de caixa e envio automático de lembretes via API do WhatsApp.',
  outcome: 'Reduziu ausências (no-shows) e otimizou o atendimento diário do estabelecimento.',
  image: 'images/pontocorte.webp',
  demoUrl: 'https://app.pontocorte.com.br/',
  repoUrl: '',
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
   'E-commerce de alto volume especializado em hardwares de mineração de Bitcoin (ASICs). Conta com integração de pagamentos, catálogo estruturado e calculadoras dinâmicas de rentabilidade em tempo real.',
  outcome: 'Canal direto de vendas faturando ativamente em ambiente de produção.',
  image: 'images/nerdolaminer.webp',
  demoUrl: 'https://nerdolaminer.com.br/',
  repoUrl: '',
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
   'E-commerce de moda com vitrine, categorias, marcas, carrinho, checkout e painel administrativo para pedidos e permissões.',
  outcome: 'Canal próprio de vendas 24/7, com a operação do dia a dia no mesmo sistema.',
  image: 'images/skyfashion.webp',
  demoUrl: 'https://skyfashion.pt/',
  repoUrl: '',
  stack: ['Laravel', 'Livewire', 'Jetstream', 'MySQL'],
  language: 'PHP',
  topics: ['laravel', 'livewire', 'jetstream', 'mysql', 'ecommerce'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  featuredOrder: 5,
  isExternal: true,
 },
 {
  id: 'ntinformatica',
  name: 'Ntinformatica',
  category: 'Institucional',
  description:
   'Portal institucional e de captação de clientes para empresa de suporte e gestão de infraestrutura de TI corporativa, integrado a sistemas de chamados.',
  outcome: 'Aumento na captura de leads de suporte de TI e melhoria no fluxo de incidentes.',
  image: 'images/ntinformatica.webp',
  demoUrl: 'https://ntinformatica.inf.br/',
  repoUrl: '',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['html', 'css', 'javascript', 'institucional'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  featuredOrder: 6,
  isExternal: true,
 },
 {
  id: 'frota-segura',
  name: 'Frota Segura',
  category: 'Operação',
  description:
   'Sistema de gestão de frota com ficha por veículo, QR Code, checklist, sinistros e leitura de CRLV e CNH em PDF, em português, inglês e chinês.',
  outcome: 'Cadastro, checklist e consulta da frota no mesmo sistema, em produção.',
  image: 'images/frota-segura.webp',
  demoUrl: 'https://frota.brginvestigacoes.com.br/admin/login',
  repoUrl: '',
  stack: ['Python', 'Flask', 'PostgreSQL'],
  language: 'Python',
  topics: ['python', 'flask', 'postgresql', 'fleet'],
  updatedAt: '2026-11-01T00:00:00Z',
  featured: true,
  featuredOrder: 3,
  isExternal: true,
 },
 {
  id: 'intranet-uc',
  name: 'Intranet UC',
  category: 'Operação',
  description:
   'Comunicação interna com histórico no servidor, busca, trilha de auditoria e telefonia junto do chat.',
  outcome: 'Chat e ramal na mesma ferramenta, em uso interno da operação.',
  image: '',
  demoUrl: '',
  repoUrl: '',
  stack: ['TypeScript', 'React', 'PostgreSQL'],
  language: 'TypeScript',
  topics: ['typescript', 'react', 'postgresql', 'intranet'],
  updatedAt: '2026-11-01T00:00:00Z',
  featured: true,
  featuredOrder: 4,
  isExternal: true,
 },
 {
  id: 'lgf-contabilidade',
  name: 'LGF Contabilidade',
  category: 'Institucional',
  description:
   'Site do escritório com páginas de serviço, contato e guias sobre abertura de MEI, saída do MEI, obrigações do Simples e organização de documentos.',
  outcome: 'Conversão ativa de novos clientes corporativos a partir de tráfego de busca.',
  image: 'images/lgf-contabilidade.webp',
  demoUrl: 'https://lgfcontabilidade.com.br/',
  repoUrl: '',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['html', 'css', 'javascript', 'institucional'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: true,
  featuredOrder: 7,
  isExternal: true,
 },
 {
  id: 'transcende',
  name: 'Transcende',
  category: 'Institucional',
  description:
   'Presença do estúdio em Sumaré, com yoga, massagens, terapias, locação de espaços e fluxo para escolher horário.',
  outcome: 'O visitante encontra o serviço e segue para o agendamento pelo próprio site.',
  image: 'images/transcende.webp',
  demoUrl: 'https://transcende.vercel.app/',
  repoUrl: '',
  stack: ['HTML', 'CSS', 'JavaScript'],
  language: 'JavaScript',
  topics: ['html', 'css', 'javascript', 'landing-page'],
  updatedAt: '2026-04-15T00:00:00Z',
  featured: false,
  isExternal: true,
 },
];

const VISIBLE_CATALOG = PROJECT_CATALOG.filter(
 (project) => project.ready !== false
);

/** Repositórios GitHub com metadados customizados (fora do catálogo externo) */
const GITHUB_REPO_OVERRIDES = {
 Syncfinance: {
  image: 'images/syncfinance.webp',
  category: 'Open source',
  description:
   'Aplicação web para organização e acompanhamento de finanças pessoais com Laravel.',
  outcome: 'App Laravel para organizar e acompanhar finanças pessoais.',
  stack: ['PHP', 'Laravel', 'MySQL'],
  language: 'PHP',
  topics: ['laravel', 'php', 'finance'],
 },
 Horientando: {
  image: 'images/horientando.webp',
  category: 'Open source',
  description:
   'Trabalho de conclusão de curso com sistema completo desenvolvido em Laravel.',
  outcome: 'TCC com sistema completo em Laravel.',
  stack: ['PHP', 'Laravel', 'MySQL'],
  language: 'PHP',
  topics: ['laravel', 'tcc', 'php'],
 },
 Guicodex: {
  image: 'images/guicodex.webp',
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
