/**
 * Service para integração com GitHub API
 * Responsável por buscar dados, cache e tratamento de erros de API
 */

// Configuração
const GITHUB_USERNAME = 'GuiEstevam';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const EXCLUDED_REPOS = ['guiestevam.github.io'];
const EXTERNAL_PROJECTS = [
    {
        name: 'Nerdola Miner',
        description: 'Loja especializada em ASICs com calculadoras de rentabilidade, suporte e conteúdo para mineração de Bitcoin.',
        html_url: 'https://nerdolaminer.com.br/',
        homepage: 'https://nerdolaminer.com.br/',
        stargazers_count: 0,
        forks_count: 0,
        language: 'PHP',
        topics: ['laravel', 'blade', 'sql', 'php'],
        updated_at: '2026-04-15T00:00:00Z',
        fork: false,
        private: false,
    },
    {
        name: 'Transcende',
        description: 'Site institucional para yoga, massagens, terapias e locação de espaços em São Paulo.',
        html_url: 'https://transcende.vercel.app/',
        homepage: 'https://transcende.vercel.app/',
        stargazers_count: 0,
        forks_count: 0,
        language: 'JavaScript',
        topics: ['html', 'css', 'javascript', 'landing-page'],
        updated_at: '2026-04-15T00:00:00Z',
        fork: false,
        private: false,
    },
    {
        name: 'LGF Contabilidade',
        description: 'Landing page institucional de contabilidade e consultoria para empresas.',
        html_url: 'https://lgf-nu.vercel.app/',
        homepage: 'https://lgf-nu.vercel.app/',
        stargazers_count: 0,
        forks_count: 0,
        language: 'JavaScript',
        topics: ['html', 'css', 'javascript', 'institucional'],
        updated_at: '2026-04-15T00:00:00Z',
        fork: false,
        private: false,
    },
    {
        name: 'SkyFashion',
        description: 'E-commerce de moda esportiva com catálogo, categorias e carrinho de compras.',
        html_url: 'https://skyfashion.pt/',
        homepage: 'https://skyfashion.pt/',
        stargazers_count: 0,
        forks_count: 0,
        language: 'PHP',
        topics: ['laravel', 'blade', 'sql', 'php', 'ecommerce'],
        updated_at: '2026-04-15T00:00:00Z',
        fork: false,
        private: false,
    },
    {
        name: 'Ntinformatica',
        description: 'Site institucional da NT Informática com foco em suporte técnico e soluções completas em TI.',
        html_url: 'https://nt-informatica.vercel.app/',
        homepage: 'https://nt-informatica.vercel.app/',
        stargazers_count: 0,
        forks_count: 0,
        language: 'JavaScript',
        topics: ['html', 'css', 'javascript', 'institucional'],
        updated_at: '2026-04-15T00:00:00Z',
        fork: false,
        private: false,
    },
];
const CACHE_KEY = 'github_repos_cache';
const CACHE_TIMESTAMP_KEY = 'github_repos_cache_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

/**
 * Busca repositórios da API do GitHub ou do cache
 * @returns {Promise<Array>} Lista de repositórios filtrados
 */
export async function fetchRepositories() {
    // 1. Verificar cache
    const cachedRepos = getCachedRepos();
    if (cachedRepos) {
        console.log('Usando dados em cache (GitHub API)');
        return mergeWithExternalProjects(cachedRepos);
    }

    // 2. Buscar da API
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            // Fallback para cache antigo em caso de rate limit
            if (response.status === 403) {
                const oldCache = localStorage.getItem(CACHE_KEY);
                if (oldCache) {
                    console.warn('Rate limit atingido, usando cache antigo');
                    return mergeWithExternalProjects(JSON.parse(oldCache));
                }
            }
            throw new Error(formatErrorMessage(response.status));
        }

        const repos = await response.json();
        
        // Filtrar repositórios
        const filteredRepos = repos.filter((repo) => {
            if (repo.fork || repo.private) return false;
            if (EXCLUDED_REPOS.includes(repo.name)) return false;
            return true;
        });

        // Salvar no cache
        setCachedRepos(filteredRepos);
        
        return mergeWithExternalProjects(filteredRepos);

    } catch (error) {
        throw new Error(`Falha ao buscar repositórios: ${error.message}`);
    }
}

/**
 * Busca linguagens de um repositório específico
 * @param {string} repoUrl 
 */
export async function fetchRepositoryLanguages(repoUrl) {
    try {
        const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) return null;

        const owner = match[1];
        const repo = match[2];
        const languagesUrl = `https://api.github.com/repos/${owner}/${repo}/languages`;

        const response = await fetch(languagesUrl, {
            headers: { Accept: 'application/vnd.github.v3+json' }
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.warn(`Erro ao buscar linguagens para ${repoUrl}:`, error);
        return null;
    }
}

// Helpers privados

function getCachedRepos() {
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

        if (!cachedData || !cachedTimestamp) return null;

        const now = Date.now();
        const cacheAge = now - parseInt(cachedTimestamp, 10);

        if (cacheAge < CACHE_DURATION) {
            return JSON.parse(cachedData);
        }

        // Cache expirado
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        return null;
    } catch (error) {
        console.warn('Erro ao ler cache:', error);
        return null;
    }
}

function setCachedRepos(repos) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(repos));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.warn('Erro ao salvar cache:', error);
    }
}

function mergeWithExternalProjects(repos) {
    if (!Array.isArray(repos)) return [...EXTERNAL_PROJECTS];

    const repoNames = new Set(repos.map((repo) => repo?.name).filter(Boolean));
    const missingExternalProjects = EXTERNAL_PROJECTS.filter(
        (externalProject) => !repoNames.has(externalProject.name)
    );

    return [...repos, ...missingExternalProjects];
}

function formatErrorMessage(status) {
    if (status === 403) return 'Rate limit da API do GitHub excedido. Tente novamente mais tarde.';
    if (status === 404) return 'Usuário do GitHub não encontrado.';
    return `Erro ao buscar repositórios: ${status}`;
}

