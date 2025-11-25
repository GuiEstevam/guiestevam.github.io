/**
 * Renderização de projetos do GitHub
 * Responsável por manipular DOM e renderizar projetos dinamicamente
 */

import {
 formatRelativeDate,
 truncateTextByWords,
 formatProjectName,
 formatNumber,
} from './utils/formatters.js';
import {
 fetchRepositories,
 fetchRepositoryLanguages,
} from './services/github-service.js';

// Configuração de UI
const INITIAL_REPOS = 3; // Número de repositórios na primeira carga
const REPOS_PER_PAGE = 3; // Número de repositórios por página (após primeira carga)
const POPULAR_STARS_THRESHOLD = 10; // Número mínimo de stars para considerar projeto popular
const LANGUAGE_REQUEST_CONCURRENCY = 3; // Limite simultâneo de requisições por linguagens

// Mapeamento de imagens personalizadas para repositórios do GitHub
// Adicione aqui o nome do repositório e o caminho da imagem correspondente
const CUSTOM_REPO_IMAGES = {
 Syncfinance: 'images/syncfinance.png',
 projeto_tcc: 'images/projeto_tcc.jpg',
 Guicodex: 'images/guicodex.png', // Repositório com G maiúsculo
 Riftfinder: 'images/riftfinder.png', // Se você tiver outras imagens específicas, adicione aqui:
 // 'brg': 'images/brg.jpg',
 // 'seguradora': 'images/seguradora.jpg',
 // 'lol_api': 'images/lol_api.jpg',
 // Para projetos sem imagem customizada, será usada uma imagem padrão (pic03-pic11)
};

// Mapeamento de homepages/demos personalizadas para repositórios do GitHub
// Adicione aqui o nome do repositório e a URL da demo/homepage correspondente
// Isso permite exibir o botão "Ver Demo" mesmo quando o repositório não tem homepage configurada no GitHub
const CUSTOM_REPO_HOMEPAGES = {
 Riftfinder: 'http://guiestevam.me/Riftfinder/', // URL da demo do RiftFinder
 // Adicione outros projetos aqui conforme necessário:
 // 'Syncfinance': 'https://syncfinance.example.com',
 // 'Guicodex': 'https://guicodex.example.com',
};

// Variáveis para paginação e estado da UI
let allRepos = [];
let displayedRepos = 0;
let currentSortOrder = 'updated'; // 'updated', 'stars', 'name'
let searchFilter = ''; // Filtro de busca por nome

// Contador para gerar índices únicos de imagens (apenas para projetos sem imagem customizada)
let imageCounter = 0;

// Controle de concorrência das requisições de linguagens
const enqueueLanguageFetch = createConcurrencyLimiter(LANGUAGE_REQUEST_CONCURRENCY);

/**
 * Inicializa a busca de repositórios
 */
export async function loadGitHubRepos() {
 const container = document.querySelector('.posts');
 if (!container) {
  console.error('Container de projetos não encontrado');
  return;
 }

 // Mostrar estado de loading
 showLoadingState(container);

 try {
  const repos = await fetchRepositories();
  renderRepositories(container, repos);
 } catch (error) {
  console.error('Erro ao carregar repositórios:', error);
  showErrorState(container, error);
 }
}

/**
 * Renderiza os repositórios no HTML
 */
function renderRepositories(container, repos) {
 // Salvar todos os repositórios
 allRepos = repos;
 displayedRepos = 0;

 // Ordenar repositórios inicialmente
 sortRepositories();

 // Limpar container
 container.innerHTML = '';

 // Resetar contador de imagens
 imageCounter = 0;

 // Criar controles de ordenação e contador
 createProjectsControls();

 // Renderizar primeira página (usar INITIAL_REPOS para primeira carga)
 renderNextPage(container, true);
}

/**
 * Cria um placeholder SVG bonito com ícone para imagens que falharam
 */
function createImagePlaceholder(text) {
 const safeText = (text || 'Sem imagem').substring(0, 25); // Limitar tamanho
 const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect fill="url(#grad)" width="400" height="300"/>
        <!-- Ícone de código/folder -->
        <g transform="translate(200, 130)">
            <path fill="white" fill-opacity="0.9" d="M-40,-35 L-20,-35 L-20,-25 L40,-25 L40,-35 L60,-35 L60,35 L-40,35 Z" stroke="white" stroke-width="2" stroke-opacity="0.5"/>
            <path fill="white" fill-opacity="0.9" d="M-20,-25 L-20,-15 L40,-15 L40,-25 Z"/>
            <rect fill="white" fill-opacity="0.7" x="-35" y="-5" width="15" height="2" rx="1"/>
            <rect fill="white" fill-opacity="0.7" x="-35" y="0" width="30" height="2" rx="1"/>
            <rect fill="white" fill-opacity="0.7" x="-35" y="5" width="20" height="2" rx="1"/>
        </g>
        <text fill="white" font-family="sans-serif" font-size="16" font-weight="500" x="200" y="210" text-anchor="middle" dominant-baseline="middle">${safeText}</text>
    </svg>`;
 return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Cria um elemento article para um projeto
 */
function createProjectArticle(project) {
 const article = document.createElement('article');
 article.setAttribute('role', 'article');
 article.setAttribute('aria-label', `Projeto ${project.name}`);
 article.classList.add('reveal-on-scroll'); // Adicionar classe para animação

 // Formatar nome do projeto
 const formattedName = formatProjectName(project.name);

 // Truncar descrição por palavras (se houver descrição)
 const description = project.description
  ? truncateTextByWords(project.description, 150)
  : 'Sem descrição disponível.';

 // Adicionar classe para projetos populares
 if (project.isPopular) {
  article.classList.add('project-popular');
 }

 // Criar link da imagem
 const imageLink = document.createElement('a');
 imageLink.href = project.url;
 imageLink.className = 'image';
 imageLink.target = '_blank';
 imageLink.rel = 'noopener noreferrer';
 imageLink.setAttribute('aria-label', `Imagem do projeto ${project.name}`);

 // Criar container para imagem com placeholder
 const imageWrapper = document.createElement('div');
 imageWrapper.className = 'image-wrapper';

 // Criar placeholder visual primeiro
 const placeholderDiv = document.createElement('div');
 placeholderDiv.className = 'image-placeholder-wrapper';
 placeholderDiv.innerHTML = `
        <ion-icon name="code-outline" class="placeholder-icon"></ion-icon>
        <span class="placeholder-text">${escapeHtml(
         project.name.substring(0, 20)
        )}</span>
    `;

 // Criar imagem
 const img = document.createElement('img');
 img.alt = `Imagem representativa do projeto ${project.name}`;
 img.className = 'project-image';

 // Função para mostrar a imagem e esconder o placeholder
 function showImage() {
  if (img.naturalHeight > 0 && img.complete) {
   placeholderDiv.classList.add('is-hidden');
   requestAnimationFrame(() => {
    img.classList.add('is-visible');
   });
  }
 }

 // Função para mostrar o placeholder
 function showPlaceholder() {
  img.classList.remove('is-visible');
  placeholderDiv.classList.remove('is-hidden');
 }

 // Adicionar handler de erro ANTES de definir src
 img.onerror = function () {
  this.onerror = null; // Prevenir loop infinito
  console.warn(`Imagem falhou ao carregar: ${this.src}`);
  showPlaceholder();
 };

 // Esconder placeholder quando imagem carregar
 img.onload = function () {
  if (this.naturalHeight > 0) {
   showImage();
  } else {
   showPlaceholder();
  }
 };

 // Mostrar placeholder inicialmente
 showPlaceholder();

 // Definir src (depois de configurar todos os handlers)
 img.src = project.image;

 // Verificar se a imagem já está no cache imediatamente após definir src
 // Usar setTimeout para dar tempo do navegador atualizar o estado
 setTimeout(() => {
  if (img.complete && img.naturalHeight > 0) {
   // Imagem já estava no cache
   showImage();
  } else if (img.complete && img.naturalHeight === 0) {
   // Imagem "carregou" mas é inválida (erro)
   showPlaceholder();
  }
 }, 50);

 // Verificação adicional após mais tempo (para casos de carregamento lento)
 setTimeout(() => {
  if (img.complete && img.naturalHeight > 0) {
   showImage();
  } else if (!img.complete) {
   // Ainda está carregando, manter placeholder visível
   showPlaceholder();
  } else {
   // Completo mas sem altura = erro
   showPlaceholder();
  }
 }, 1000);

 // Adicionar ao wrapper
 imageWrapper.appendChild(placeholderDiv);
 imageWrapper.appendChild(img);

 imageLink.appendChild(imageWrapper);

 // Criar título
 const title = document.createElement('h3');
 title.textContent = formattedName;

 // Criar container para descrição com funcionalidade de expandir/colapsar
 const descContainer = document.createElement('div');
 descContainer.className = 'project-description-container';

 // Criar descrição (sempre exibir, mesmo que seja "Sem descrição disponível")
 const desc = document.createElement('p');
 const fullDescription = project.description || 'Sem descrição disponível.';
 desc.textContent = fullDescription;

 // Adicionar classe para distinguir descrições vazias
 if (!project.description || project.description.trim() === '') {
  desc.className = 'project-description-empty';
 } else {
  desc.className = 'project-description';
  // Adicionar data attribute com descrição completa
  desc.setAttribute('data-full-text', fullDescription);
 }

 // Adicionar botão "mostrar mais/mostrar menos" apenas se houver descrição
 if (project.description && project.description.trim() !== '') {
  const toggleButton = document.createElement('button');
  toggleButton.className = 'description-toggle';
  toggleButton.setAttribute('aria-label', 'Expandir ou colapsar descrição');
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.innerHTML = `
   <span class="toggle-text">Mostrar mais</span>
   <ion-icon name="chevron-down-outline" class="toggle-icon"></ion-icon>
  `;

  // Adicionar evento de clique
  toggleButton.addEventListener('click', function () {
   const isExpanded = desc.classList.contains('expanded');
   desc.classList.toggle('expanded');
   toggleButton.setAttribute('aria-expanded', !isExpanded);

   const toggleText = toggleButton.querySelector('.toggle-text');
   const toggleIcon = toggleButton.querySelector('.toggle-icon');

   if (!isExpanded) {
    toggleText.textContent = 'Mostrar menos';
    toggleIcon.setAttribute('name', 'chevron-up-outline');
   } else {
    toggleText.textContent = 'Mostrar mais';
    toggleIcon.setAttribute('name', 'chevron-down-outline');
   }
  });

  descContainer.appendChild(desc);
  descContainer.appendChild(toggleButton);
 } else {
  descContainer.appendChild(desc);
 }

 // Criar footer do card com informações do projeto (compacto)
 const projectInfo = document.createElement('div');
 projectInfo.className = 'project-info';

 // Linha superior: Linguagens e Stats lado a lado
 const topRow = document.createElement('div');
 topRow.className = 'project-info-top-row';

 // Container de tecnologias (compacto, sem título)
 const techBadges = document.createElement('div');
 techBadges.className = 'project-tech-badges';

 // Coletar todas as linguagens únicas para exibir
 const languagesToDisplay = new Set();

 // Adicionar linguagem principal se existir
 if (project.language) {
  languagesToDisplay.add(project.language);
 }

 // Adicionar outras linguagens se disponíveis (limitar a 3 principais)
 if (
  project.languages &&
  Array.isArray(project.languages) &&
  project.languages.length > 0
 ) {
  project.languages.slice(0, 3).forEach((lang) => {
   if (lang && typeof lang === 'string' && lang.trim()) {
    languagesToDisplay.add(lang.trim());
   }
  });
 }

 // Criar badges para todas as linguagens
 if (languagesToDisplay.size > 0) {
  // Limitar a 3 linguagens principais e ordenar
  Array.from(languagesToDisplay)
   .sort()
   .slice(0, 3)
   .forEach((lang) => {
    const languageBadge = document.createElement('span');
    languageBadge.className = 'project-language-badge';
    languageBadge.style.backgroundColor = getLanguageColor(lang);
    languageBadge.setAttribute('aria-label', `Linguagem: ${lang}`);
    const iconClass = getLanguageIcon(lang);
    languageBadge.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i> <span>${escapeHtml(
     lang
    )}</span>`;
    techBadges.appendChild(languageBadge);
   });
 } else {
  // Fallback: se não houver linguagem, mostrar badge genérico
  const noLanguageBadge = document.createElement('span');
  noLanguageBadge.className = 'project-language-badge';
  noLanguageBadge.style.backgroundColor = '#999999';
  noLanguageBadge.setAttribute('aria-label', 'Linguagem não especificada');
  noLanguageBadge.innerHTML = `<i class="fas fa-code" aria-hidden="true"></i> <span>N/S</span>`;
  techBadges.appendChild(noLanguageBadge);
 }

 topRow.appendChild(techBadges);

 // Stats (stars e forks) - inline com tecnologias
 const statsContainer = document.createElement('div');
 statsContainer.className = 'project-stats';

 // Stars
 const starsBadge = document.createElement('span');
 starsBadge.className = 'project-stat-item';
 starsBadge.setAttribute(
  'aria-label',
  `${formatNumber(project.stars)} estrelas`
 );
 starsBadge.innerHTML = `<i class="far fa-star" aria-hidden="true"></i> <span>${formatNumber(
  project.stars
 )}</span>`;
 statsContainer.appendChild(starsBadge);

 // Forks
 const forksBadge = document.createElement('span');
 forksBadge.className = 'project-stat-item';
 forksBadge.setAttribute('aria-label', `${formatNumber(project.forks)} forks`);
 forksBadge.innerHTML = `<i class="fas fa-code-branch" aria-hidden="true"></i> <span>${formatNumber(
  project.forks
 )}</span>`;
 statsContainer.appendChild(forksBadge);

 topRow.appendChild(statsContainer);
 projectInfo.appendChild(topRow);

 // Linha inferior: Data de atualização e botões
 const bottomRow = document.createElement('div');
 bottomRow.className = 'project-info-bottom-row';

 // Data de atualização (compacta)
 if (project.updatedAt) {
  const dateInfo = document.createElement('div');
  dateInfo.className = 'project-updated';
  dateInfo.innerHTML = `<i class="far fa-clock" aria-hidden="true"></i> <span>${formatRelativeDate(
   project.updatedAt
  )}</span>`;
  bottomRow.appendChild(dateInfo);
 } else {
  // Espaçador se não houver data
  const spacer = document.createElement('div');
  spacer.className = 'project-updated';
  spacer.style.opacity = '0';
  spacer.style.pointerEvents = 'none';
  bottomRow.appendChild(spacer);
 }

 // Criar ações (botões) para adicionar na linha inferior
 const actions = document.createElement('ul');
 actions.className = 'actions';

 // Botão para demo/homepage (se disponível)
 if (project.homepage && project.homepage.trim()) {
  const demoItem = document.createElement('li');
  const demoLink = document.createElement('a');
  demoLink.href = project.homepage;
  demoLink.className = 'button button-demo';
  demoLink.target = '_blank';
  demoLink.rel = 'noopener noreferrer';
  demoLink.setAttribute('aria-label', `Ver demo do projeto ${formattedName}`);
  demoLink.innerHTML =
   '<i class="fas fa-external-link-alt" aria-hidden="true"></i> Ver Demo';
  demoItem.appendChild(demoLink);
  actions.appendChild(demoItem);
 }

 // Botão para GitHub
 const githubItem = document.createElement('li');
 const githubLink = document.createElement('a');
 githubLink.href = project.url;
 githubLink.className = 'button button-github';
 githubLink.target = '_blank';
 githubLink.rel = 'noopener noreferrer';
 githubLink.setAttribute(
  'aria-label',
  `Ver projeto ${formattedName} no GitHub`
 );
 githubLink.innerHTML =
  '<i class="fab fa-github" aria-hidden="true"></i> Ver no GitHub';
 githubItem.appendChild(githubLink);
 actions.appendChild(githubItem);

 bottomRow.appendChild(actions);
 projectInfo.appendChild(bottomRow);

 // Criar container de conteúdo
 const contentContainer = document.createElement('div');
 contentContainer.className = 'article-content';

 // Criar body do artigo
 const articleBody = document.createElement('div');
 articleBody.className = 'article-body';

 // Criar header do artigo
 const articleHeader = document.createElement('div');
 articleHeader.className = 'article-header';
 articleHeader.appendChild(title);
 articleHeader.appendChild(descContainer);
 articleBody.appendChild(articleHeader);

 // Criar footer do artigo
 const articleFooter = document.createElement('div');
 articleFooter.className = 'article-footer';
 articleFooter.appendChild(projectInfo);
 articleBody.appendChild(articleFooter);

 contentContainer.appendChild(articleBody);

 // Montar artigo
 article.appendChild(imageLink);
 article.appendChild(contentContainer);

 return article;
}

/**
 * Renderiza a próxima página de repositórios
 * @param {boolean} isInitialLoad - Se true, usa INITIAL_REPOS; senão usa REPOS_PER_PAGE
 */
async function renderNextPage(container, isInitialLoad = false) {
 // Aplicar filtro de busca se houver
 let filteredRepos = allRepos;
 if (searchFilter) {
  filteredRepos = allRepos.filter((repo) =>
   repo.name.toLowerCase().includes(searchFilter)
  );
 }

 const reposToShow = isInitialLoad ? INITIAL_REPOS : REPOS_PER_PAGE;
 const reposToRender = filteredRepos.slice(
  displayedRepos,
  displayedRepos + reposToShow
 );

 if (reposToRender.length === 0) {
  if (displayedRepos === 0) {
   if (searchFilter) {
    showEmptyState(
     container,
     `Nenhum projeto encontrado com "${searchFilter}". Tente outra busca.`
    );
   } else {
    showEmptyState(container);
   }
   if (window.showToast) {
    const message = searchFilter
     ? `Nenhum projeto encontrado com "${searchFilter}".`
     : 'Nenhum projeto encontrado no GitHub.';
    window.showToast(message, 'info');
   }
  }
  return;
 }

 // Converter e renderizar repositórios
 const renderPromises = reposToRender.map(async (repo, index) => {
  // Buscar linguagens do repositório
  let languages = [];
  if (repo.language) {
   languages.push(repo.language);
  }

  try {
   const languagesData = await enqueueLanguageFetch(() =>
    fetchRepositoryLanguages({
     owner: repo.owner?.login || repo.owner?.name,
     name: repo.name,
     languagesUrl: repo.languages_url,
    })
   );

   if (languagesData) {
    const sortedLanguages = Object.keys(languagesData)
     .sort((a, b) => languagesData[b] - languagesData[a])
     .slice(0, 5); // Limitar a 5 linguagens principais
    languages = sortedLanguages;
   }
  } catch (error) {
   console.warn(`Erro ao buscar linguagens para ${repo.name}:`, error);
  }

  const project = {
   name: repo.name,
   description: repo.description || 'Sem descrição disponível.',
   image: getProjectImage(repo.name),
   url: repo.html_url,
   updatedAt: repo.updated_at,
   language: repo.language,
   languages: languages,
   stars: repo.stargazers_count || 0,
   forks: repo.forks_count || 0,
   homepage: getProjectHomepage(repo.name, repo.homepage),
   isPopular: (repo.stargazers_count || 0) >= POPULAR_STARS_THRESHOLD,
  };

  const article = createProjectArticle(project);

  // Adicionar delay para animação stagger (respeitando prefers-reduced-motion)
  const prefersReducedMotion = window.matchMedia(
   '(prefers-reduced-motion: reduce)'
  ).matches;
  if (!prefersReducedMotion) {
   article.style.animationDelay = `${index * 100}ms`;
  }

  container.appendChild(article);
  imageCounter++;

  // Trigger reveal animation após adicionar ao DOM
  requestAnimationFrame(() => {
   article.classList.add('revealed');
  });
 });

 // Aguardar todas as renderizações
 await Promise.all(renderPromises);

 displayedRepos += reposToRender.length;

 // Atualizar controles de projetos
 updateProjectsControls();

 // Adicionar botão de "Mostrar mais" se houver mais repositórios
 updatePaginationButtons(container);
 container.setAttribute('aria-label', 'Lista de projetos');

 // Não fazer scroll automático - deixar o usuário no lugar onde está
}

/**
 * Cria os controles de ordenação e contador de projetos
 */
function createProjectsControls() {
 const controlsContainer = document.getElementById('projects-controls');
 if (!controlsContainer) return;

 controlsContainer.innerHTML = `
  <div class="projects-controls-wrapper">
   <div class="projects-search">
    <input
     type="text"
     id="projects-search-input"
     class="projects-search-input"
     placeholder="Buscar projetos..."
     aria-label="Buscar projetos por nome"
     value="${searchFilter}"
    />
    <i class="icon solid fa-search projects-search-icon" aria-hidden="true"></i>
   </div>
   <div class="projects-count" aria-live="polite" aria-atomic="true">
    <span class="count-text">Mostrando <strong class="count-displayed">${displayedRepos}</strong> de <strong class="count-total">${
  allRepos.length
 }</strong> ${allRepos.length === 1 ? 'projeto' : 'projetos'}</span>
   </div>
   <div class="projects-sort">
    <label for="sort-select" class="sort-label">Ordenar por:</label>
    <select id="sort-select" class="sort-select" aria-label="Ordenar projetos">
     <option value="updated" ${
      currentSortOrder === 'updated' ? 'selected' : ''
     }>Mais recentes</option>
     <option value="stars" ${
      currentSortOrder === 'stars' ? 'selected' : ''
     }>Mais estrelas</option>
     <option value="name" ${
      currentSortOrder === 'name' ? 'selected' : ''
     }>Nome (A-Z)</option>
    </select>
   </div>
  </div>
 `;

 // Adicionar listener para ordenação
 const sortSelect = document.getElementById('sort-select');
 if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
   currentSortOrder = e.target.value;
   sortRepositories();
   // Re-renderizar todos os projetos visíveis
   const postsContainer = document.querySelector('.posts');
   if (postsContainer) {
    displayedRepos = 0;
    imageCounter = 0;
    postsContainer.innerHTML = '';
    renderNextPage(postsContainer, true);
   }
   updateProjectsControls();
  });
 }
}

/**
 * Atualiza o contador de projetos nos controles
 */
function updateProjectsControls() {
 // Aplicar filtro de busca se houver
 let filteredRepos = allRepos;
 if (searchFilter) {
  filteredRepos = allRepos.filter((repo) =>
   repo.name.toLowerCase().includes(searchFilter)
  );
 }

 const countDisplayed = document.querySelector('.count-displayed');
 const countTotal = document.querySelector('.count-total');
 if (countDisplayed) {
  countDisplayed.textContent = displayedRepos;
 }
 if (countTotal) {
  countTotal.textContent = filteredRepos.length;
 }

 // Atualizar texto do contador se houver busca
 const countText = document.querySelector('.count-text');
 if (countText && searchFilter) {
  const projectText = filteredRepos.length === 1 ? 'projeto' : 'projetos';
  countText.innerHTML = `Mostrando <strong class="count-displayed">${displayedRepos}</strong> de <strong class="count-total">${
   filteredRepos.length
  }</strong> ${projectText} encontrado${filteredRepos.length === 1 ? '' : 's'}`;
 } else if (countText && !searchFilter) {
  const projectText = allRepos.length === 1 ? 'projeto' : 'projetos';
  countText.innerHTML = `Mostrando <strong class="count-displayed">${displayedRepos}</strong> de <strong class="count-total">${allRepos.length}</strong> ${projectText}`;
 }
}

/**
 * Ordena os repositórios baseado na ordem atual
 */
function sortRepositories() {
 switch (currentSortOrder) {
  case 'stars':
   allRepos.sort(
    (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
   );
   break;
  case 'name':
   allRepos.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
   break;
  case 'updated':
  default:
   allRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
   break;
 }
}

/**
 * Atualiza os botões de paginação
 * Retorna o container dos botões para permitir scroll
 */
function updatePaginationButtons(container) {
 // Remover botões anteriores se existirem
 const existingButtons = container.querySelector('.pagination-buttons');
 if (existingButtons) {
  existingButtons.remove();
 }

 // Aplicar filtro de busca se houver
 let filteredRepos = allRepos;
 if (searchFilter) {
  filteredRepos = allRepos.filter((repo) =>
   repo.name.toLowerCase().includes(searchFilter)
  );
 }

 const hasMore = displayedRepos < filteredRepos.length;
 const hasMoreThanInitial = displayedRepos > INITIAL_REPOS;
 const isFullyExpanded = displayedRepos >= filteredRepos.length;

 // Se há mais projetos ou já mostrou mais que o inicial, mostrar botões
 if (hasMore || hasMoreThanInitial) {
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'pagination-buttons';
  const totalRepos = filteredRepos.length;

  // Botão "Mostrar mais" - mostrar apenas se houver mais projetos
  if (hasMore) {
   const showMoreBtn = document.createElement('button');
   showMoreBtn.className = 'button show-more-button';
   showMoreBtn.setAttribute(
    'aria-label',
    `Mostrar mais projetos. Mostrando ${displayedRepos} de ${totalRepos} ${
     totalRepos === 1 ? 'projeto' : 'projetos'
    }`
   );
   showMoreBtn.setAttribute('aria-expanded', 'false');
   showMoreBtn.innerHTML =
    '<span>Mostrar mais</span> <i class="icon solid fa-chevron-down" aria-hidden="true"></i>';
   showMoreBtn.onclick = () => {
    renderNextPage(container, false);
   };
   buttonContainer.appendChild(showMoreBtn);
  }

  // Botão "Mostrar menos" - sempre mostrar quando há mais que INITIAL_REPOS
  if (hasMoreThanInitial) {
   const showLessBtn = document.createElement('button');
   showLessBtn.className = 'button show-less-button';
   showLessBtn.setAttribute(
    'aria-label',
    `Mostrar menos projetos. Mostrando ${displayedRepos} de ${totalRepos} ${
     totalRepos === 1 ? 'projeto' : 'projetos'
    }`
   );
   showLessBtn.setAttribute('aria-expanded', 'true');
   showLessBtn.innerHTML =
    '<span>Mostrar menos</span> <i class="icon solid fa-chevron-up" aria-hidden="true"></i>';
   showLessBtn.onclick = () => {
    // Remover projetos além da primeira página (voltar para INITIAL_REPOS)
    const articles = container.querySelectorAll('article');
    const reposToKeep = INITIAL_REPOS;

    articles.forEach((article, index) => {
     if (index >= reposToKeep) {
      article.remove();
     }
    });

    displayedRepos = reposToKeep;
    imageCounter = reposToKeep;

    // Atualizar controles e botões
    updateProjectsControls();
    updatePaginationButtons(container);

    // Fazer scroll suave para o último projeto carregado nativamente (antes de mostrar mais)
    const prefersReducedMotion = window.matchMedia(
     '(prefers-reduced-motion: reduce)'
    ).matches;

    // Buscar o último article do batch inicial (o terceiro projeto - INITIAL_REPOS - 1)
    const allArticles = container.querySelectorAll('article');
    const lastInitialArticle = allArticles[INITIAL_REPOS - 1];

    if (lastInitialArticle && !prefersReducedMotion) {
     setTimeout(() => {
      // Scroll suave para o último projeto carregado nativamente
      lastInitialArticle.scrollIntoView({
       behavior: 'smooth',
       block: 'start',
       inline: 'nearest',
      });
     }, 200);
    } else if (lastInitialArticle && prefersReducedMotion) {
     setTimeout(() => {
      lastInitialArticle.scrollIntoView({
       behavior: 'auto',
       block: 'start',
       inline: 'nearest',
      });
     }, 100);
    } else if (!lastInitialArticle) {
     // Fallback: se não encontrar o último projeto, ir para o topo da seção
     const projectsSection = document.getElementById('projetos');
     if (projectsSection && !prefersReducedMotion) {
      setTimeout(() => {
       projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
     } else if (projectsSection && prefersReducedMotion) {
      setTimeout(() => {
       projectsSection.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 100);
     }
    }

    // Não focar automaticamente - melhor UX
   };
   buttonContainer.appendChild(showLessBtn);
  }

  container.appendChild(buttonContainer);
  return buttonContainer;
 }

 return null;
}

/**
 * Obtém a imagem do projeto (prioridade: customizado > padrão)
 */
function getProjectImage(repoName) {
 // 1. Verificar se tem imagem customizada definida no mapeamento
 // Buscar por nome exato primeiro (case-sensitive)
 if (CUSTOM_REPO_IMAGES[repoName]) {
  return CUSTOM_REPO_IMAGES[repoName];
 }

 // 2. Se não encontrar, buscar case-insensitive
 const repoNameLower = repoName.toLowerCase();
 for (const [key, value] of Object.entries(CUSTOM_REPO_IMAGES)) {
  if (key.toLowerCase() === repoNameLower) {
   return value;
  }
 }

 // 3. Fallback: usar imagem padrão baseada no contador (imagens disponíveis: pic03 a pic11)
 const availableImages = 9; // pic03 a pic11
 const imageIndex = (imageCounter % availableImages) + 3;
 return `images/pic${String(imageIndex).padStart(2, '0')}.jpg`;
}

/**
 * Obtém a homepage/demo do projeto (prioridade: customizado > GitHub homepage)
 * @param {string} repoName - Nome do repositório
 * @param {string|null} githubHomepage - Homepage configurada no GitHub (se houver)
 * @returns {string|null} URL da homepage ou null
 */
function getProjectHomepage(repoName, githubHomepage) {
 // 1. Verificar se tem homepage customizada definida no mapeamento
 // Buscar por nome exato primeiro (case-sensitive)
 if (CUSTOM_REPO_HOMEPAGES[repoName]) {
  return CUSTOM_REPO_HOMEPAGES[repoName];
 }

 // 2. Se não encontrar, buscar case-insensitive
 const repoNameLower = repoName.toLowerCase();
 for (const [key, value] of Object.entries(CUSTOM_REPO_HOMEPAGES)) {
  if (key.toLowerCase() === repoNameLower) {
   return value;
  }
 }

 // 3. Fallback: usar homepage do GitHub (se configurada)
 return githubHomepage || null;
}

/**
 * Obtém a cor do badge baseada na linguagem de programação
 * @param {string} language - Nome da linguagem
 * @returns {string} Cor em hexadecimal
 */
function getLanguageColor(language) {
 if (!language) return '#999999';

 const languageColors = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#ED8B00',
  'C++': '#00599C',
  C: '#A8B9CC',
  'C#': '#239120',
  PHP: '#777BB4',
  Ruby: '#CC342D',
  Go: '#00ADD8',
  Rust: '#000000',
  Swift: '#FA7343',
  Kotlin: '#7F52FF',
  HTML: '#E34F26',
  CSS: '#1572B6',
  SCSS: '#CC6699',
  SASS: '#CC6699',
  Vue: '#4FC08D',
  React: '#61DAFB',
  Angular: '#DD0031',
  Dart: '#0175C2',
  Shell: '#89E051',
  PowerShell: '#012456',
  Lua: '#000080',
  Perl: '#39457E',
  R: '#276DC3',
  MATLAB: '#E16737',
  Scala: '#DC322F',
  Clojure: '#5881D8',
  Haskell: '#5D4F85',
  Elm: '#60B5CC',
  Erlang: '#A90533',
  Elixir: '#4E2A8E',
  OCaml: '#3BE133',
  FSharp: '#B845FC',
  Dart: '#0175C2',
  ObjectiveC: '#438EFF',
  CoffeeScript: '#244776',
  TeX: '#3D6117',
  Markdown: '#083FA1',
 };

 return languageColors[language] || '#666666';
}

/**
 * Obtém o ícone Font Awesome para a linguagem de programação
 * @param {string} language - Nome da linguagem
 * @returns {string} Classe do ícone Font Awesome
 */
function getLanguageIcon(language) {
 if (!language) return 'fas fa-code';

 const languageIcons = {
  JavaScript: 'fab fa-js',
  TypeScript: 'fab fa-js-square',
  Python: 'fab fa-python',
  Java: 'fab fa-java',
  'C++': 'fab fa-cuttlefish',
  C: 'fas fa-code',
  'C#': 'fab fa-microsoft',
  PHP: 'fab fa-php',
  Ruby: 'fas fa-gem',
  Go: 'fab fa-golang',
  Rust: 'fas fa-cog',
  Swift: 'fab fa-swift',
  Kotlin: 'fas fa-code',
  HTML: 'fab fa-html5',
  CSS: 'fab fa-css3-alt',
  SCSS: 'fab fa-sass',
  SASS: 'fab fa-sass',
  Vue: 'fab fa-vuejs',
  React: 'fab fa-react',
  Angular: 'fab fa-angular',
  Dart: 'fab fa-dart',
  Shell: 'fas fa-terminal',
  PowerShell: 'fab fa-microsoft',
  Lua: 'fas fa-code',
  Perl: 'fab fa-perl',
  R: 'fas fa-chart-line',
  MATLAB: 'fas fa-calculator',
  Scala: 'fas fa-code',
  Clojure: 'fas fa-code',
  Haskell: 'fas fa-code',
  Elm: 'fab fa-elm',
  Erlang: 'fas fa-code',
  Elixir: 'fas fa-code',
  OCaml: 'fas fa-code',
  FSharp: 'fab fa-microsoft',
  ObjectiveC: 'fab fa-apple',
  CoffeeScript: 'fas fa-coffee',
  TeX: 'fas fa-file-alt',
  Markdown: 'fab fa-markdown',
 };

 return languageIcons[language] || 'fas fa-code';
}

/**
 * Mostra estado de loading com skeleton loaders
 */
function showLoadingState(container) {
 const skeletonCount = INITIAL_REPOS; // Mostrar skeletons da primeira carga
 let skeletonHTML = '';

 for (let i = 0; i < skeletonCount; i++) {
  skeletonHTML +=
   '<article class="project-skeleton" role="listitem" aria-busy="true">' +
   '<div class="skeleton-image"></div>' +
   '<div class="skeleton-content">' +
   '<div class="skeleton-title"></div>' +
   '<div class="skeleton-text"></div>' +
   '<div class="skeleton-text skeleton-text-short"></div>' +
   '<div class="skeleton-badges">' +
   '<div class="skeleton-badge"></div>' +
   '<div class="skeleton-badge"></div>' +
   '</div>' +
   '<div class="skeleton-button"></div>' +
   '</div>' +
   '</article>';
 }

 container.innerHTML = skeletonHTML;
}

/**
 * Mostra estado de erro
 */
function showErrorState(container, error) {
 const errorMessage =
  error.message || 'Erro desconhecido ao carregar projetos.';
 const isRateLimit =
  errorMessage.includes('Rate limit') || errorMessage.includes('403');

 container.innerHTML = `
        <article>
            <div class="error-state" role="alert">
                <p>Erro ao carregar projetos do GitHub.</p>
                <p><small>${escapeHtml(errorMessage)}</small></p>
                ${
                 isRateLimit
                  ? '<p><small>Dica: A API do GitHub tem um limite de 60 requisições por hora. Aguarde alguns minutos e tente novamente.</small></p>'
                  : ''
                }
                <ul class="actions">
                    <li><button class="button" onclick="location.reload()">Tentar novamente</button></li>
                </ul>
            </div>
        </article>
    `;

 if (window.showToast) {
  const toastMessage = isRateLimit
   ? 'Rate limit da API do GitHub. Aguarde alguns minutos.'
   : 'Erro ao carregar projetos. Verifique sua conexão.';
  window.showToast(toastMessage, 'error');
 }
}

/**
 * Mostra estado vazio quando não há projetos
 */
function showEmptyState(container, customMessage = null) {
 const message =
  customMessage || 'Não há projetos públicos disponíveis no momento.';
 container.innerHTML = `
        <article class="empty-state" role="status" aria-live="polite">
            <div class="empty-state-content">
                <i class="fas fa-folder-open empty-state-icon" aria-hidden="true"></i>
                <h3>Nenhum projeto encontrado</h3>
                <p>${message}</p>
            </div>
        </article>
    `;
 container.setAttribute('aria-label', 'Lista de projetos vazia');
}

/**
 * Escape HTML para prevenir XSS
 */
function escapeHtml(text) {
 if (!text) return '';
 const div = document.createElement('div');
 div.textContent = text;
 return div.innerHTML;
}

/**
 * Cria um limitador simples de concorrência para Promises
 * @param {number} limit - Número máximo de Promises simultâneas
 * @returns {(fn: Function) => Promise}
 */
function createConcurrencyLimiter(limit = 3) {
 if (!Number.isFinite(limit) || limit <= 0) {
  throw new Error('O limite de concorrência deve ser um número maior que zero.');
 }

 const queue = [];
 let activeCount = 0;

 const next = () => {
  if (queue.length === 0 || activeCount >= limit) {
   return;
  }

  activeCount++;
  const { fn, resolve, reject } = queue.shift();

  Promise.resolve()
   .then(fn)
   .then((value) => resolve(value))
   .catch((error) => reject(error))
   .finally(() => {
    activeCount--;
    next();
   });
 };

 return function enqueue(fn) {
  return new Promise((resolve, reject) => {
   queue.push({ fn, resolve, reject });
   next();
  });
 };
}
