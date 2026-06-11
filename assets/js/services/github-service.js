/**
 * Service para integração com GitHub API
 * Responsável por buscar dados, cache e tratamento de erros de API
 */

import {
 EXTERNAL_PROJECTS,
 getPortfolioProjectsFallback,
} from '../data/projects.js';

// Configuração
const GITHUB_USERNAME = 'GuiEstevam';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const EXCLUDED_REPOS = ['guiestevam.github.io'];
const CACHE_KEY = 'github_repos_cache';
const CACHE_TIMESTAMP_KEY = 'github_repos_cache_timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

// Cache de linguagens
const LANG_CACHE_PREFIX = 'github_repo_languages_';
const LANG_CACHE_DURATION = 60 * 60 * 1000; // 1 hora
const languagesMemoryCache = new Map();

/**
 * Busca repositórios da API do GitHub, cache ou catálogo local
 * @returns {Promise<{ repos: Array, source: 'api'|'cache'|'stale-cache'|'local' }>}
 */
export async function fetchRepositories() {
 const cachedRepos = getCachedRepos();
 if (cachedRepos) {
  return {
   repos: mergeWithExternalProjects(cachedRepos),
   source: 'cache',
  };
 }

 try {
  const response = await fetch(GITHUB_API_URL, {
   headers: {
    Accept: 'application/vnd.github.v3+json',
   },
  });

  if (!response.ok) {
   const fallback = resolveFallbackRepos();
   if (fallback) {
    console.warn(
     `GitHub API retornou ${response.status}, usando ${fallback.source}`
    );
    return fallback;
   }
   throw new Error(formatErrorMessage(response.status));
  }

  const repos = await response.json();
  const filteredRepos = repos.filter((repo) => {
   if (repo.fork || repo.private) return false;
   if (EXCLUDED_REPOS.includes(repo.name)) return false;
   return true;
  });

  setCachedRepos(filteredRepos);

  return {
   repos: mergeWithExternalProjects(filteredRepos),
   source: 'api',
  };
 } catch (error) {
  const fallback = resolveFallbackRepos();
  if (fallback) {
   console.warn('GitHub API indisponível, usando catálogo local.', error);
   return fallback;
  }

  throw new Error(`Falha ao buscar repositórios: ${error.message}`);
 }
}

/**
 * Busca linguagens de um repositório específico
 * @param {string} repoUrl 
 */
export async function fetchRepositoryLanguages(repoInput) {
    try {
        const { owner, repo, languagesUrl } = normalizeRepoLanguageInput(repoInput);
        if (!owner || !repo) {
            return null;
        }

        const cacheKey = buildLanguageCacheKey(owner, repo);
        const cachedLanguages = getCachedLanguages(cacheKey);
        if (cachedLanguages) {
            return cachedLanguages;
        }

        const requestUrl = languagesUrl || `https://api.github.com/repos/${owner}/${repo}/languages`;
        const response = await fetch(requestUrl, {
            headers: { Accept: 'application/vnd.github.v3+json' }
        });

        if (!response.ok) {
            return null;
        }

        const languages = await response.json();
        setCachedLanguages(cacheKey, languages);
        return languages;
    } catch (error) {
        console.warn('Erro ao buscar linguagens do repositório:', error);
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

function resolveFallbackRepos() {
 const staleCache = getStaleCachedRepos();
 if (Array.isArray(staleCache) && staleCache.length > 0) {
  return {
   repos: mergeWithExternalProjects(staleCache),
   source: 'stale-cache',
  };
 }

 const localRepos = getPortfolioProjectsFallback();
 if (localRepos.length > 0) {
  return {
   repos: localRepos,
   source: 'local',
  };
 }

 return null;
}

function getStaleCachedRepos() {
 try {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (!cachedData) return null;
  return JSON.parse(cachedData);
 } catch (error) {
  console.warn('Erro ao ler cache expirado:', error);
  return null;
 }
}

function formatErrorMessage(status) {
    if (status === 403) return 'Rate limit da API do GitHub excedido. Tente novamente mais tarde.';
    if (status === 404) return 'Usuário do GitHub não encontrado.';
    return `Erro ao buscar repositórios: ${status}`;
}

function normalizeRepoLanguageInput(input) {
    if (!input) return {};

    if (typeof input === 'string') {
        const match = input.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (match) {
            return {
                owner: match[1],
                repo: match[2],
                languagesUrl: null,
            };
        }
        return {};
    }

    // Permitir objetos vindos diretamente da API
    if (typeof input === 'object') {
        const owner =
            input.owner?.login ||
            input.owner?.name ||
            input.owner?.username ||
            input.owner ||
            null;

        const repo = input.repo || input.name || input.repository || null;
        const languagesUrl = input.languagesUrl || input.languages_url || null;

        if (owner && repo) {
            return { owner, repo, languagesUrl };
        }

        // Fallback: tentar extrair do html_url fornecido pela API
        if (input.html_url) {
            return normalizeRepoLanguageInput(input.html_url);
        }
    }

    return {};
}

function buildLanguageCacheKey(owner, repo) {
    return `${owner.toLowerCase()}/${repo.toLowerCase()}`;
}

function getCachedLanguages(cacheKey) {
    if (!cacheKey) return null;

    const memoryEntry = languagesMemoryCache.get(cacheKey);
    if (memoryEntry && Date.now() - memoryEntry.timestamp < LANG_CACHE_DURATION) {
        return memoryEntry.data;
    }

    try {
        const stored = sessionStorage.getItem(LANG_CACHE_PREFIX + cacheKey);
        if (!stored) {
            return null;
        }

        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < LANG_CACHE_DURATION) {
            languagesMemoryCache.set(cacheKey, parsed);
            return parsed.data;
        }

        sessionStorage.removeItem(LANG_CACHE_PREFIX + cacheKey);
    } catch (error) {
        console.warn('Erro ao ler cache de linguagens:', error);
    }

    return null;
}

function setCachedLanguages(cacheKey, languages) {
    if (!cacheKey) return;

    const entry = {
        timestamp: Date.now(),
        data: languages,
    };

    languagesMemoryCache.set(cacheKey, entry);

    try {
        sessionStorage.setItem(LANG_CACHE_PREFIX + cacheKey, JSON.stringify(entry));
    } catch (error) {
        console.warn('Erro ao salvar cache de linguagens:', error);
    }
}

