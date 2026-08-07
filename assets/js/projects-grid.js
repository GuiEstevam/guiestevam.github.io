/**
 * Renderização da grade de projetos (Gridresponsivo)
 */

import { fetchRepositories } from './services/github-service.js';
import {
  EXCLUDED_PROJECT_NAMES,
  FEATURED_PROJECTS,
  getPortfolioProjectsFallback,
  getProjectCategory,
  isProductionProject,
  resolveProjectHomepage,
  resolveProjectImage,
  resolveProjectOutcome,
  resolveProjectStack,
  resolveProjectDescription,
} from './data/projects.js';
import { getStackIcon } from './utils/stack-icons.js';

const EXCLUDED_PROJECTS = new Set(
  EXCLUDED_PROJECT_NAMES.map((name) => name.toLowerCase())
);

/**
 * Monta <img> do projeto ou placeholder com ícone
 */
function createProjectMediaImage(project, index) {
  const imagePath = project.image || '';

  if (!imagePath) {
    const placeholder = document.createElement('div');
    placeholder.className = 'project-card-placeholder';

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'code-outline');
    icon.setAttribute('aria-hidden', 'true');
    placeholder.appendChild(icon);

    const label = document.createElement('span');
    label.className = 'font-mono';
    label.textContent = project.name;
    placeholder.appendChild(label);

    return placeholder;
  }

  const img = document.createElement('img');
  img.alt = `Screenshot do projeto ${project.name}`;
  img.className = 'project-card-image';
  img.loading = index < 4 ? 'eager' : 'lazy';
  img.width = 640;
  img.height = 400;
  img.decoding = 'async';
  img.src = imagePath;
  return img;
}

function createTagIcon(tech) {
  const icon = document.createElement('i');
  icon.className = getStackIcon(tech);
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function createLanguageTags(stack) {
  const tags = Array.isArray(stack)
    ? stack.filter((item) => item && typeof item === 'string')
    : [];

  if (tags.length === 0) return null;

  const list = document.createElement('ul');
  list.className = 'project-card-tags';
  list.setAttribute('aria-label', 'Tecnologias do projeto');

  const visibleTags = tags.slice(0, 4);
  visibleTags.forEach((tech) => {
    const item = document.createElement('li');
    item.className = 'project-card-tag font-mono';
    item.appendChild(createTagIcon(tech));

    const label = document.createElement('span');
    label.className = 'project-card-tag-label';
    label.textContent = tech;
    item.appendChild(label);

    list.appendChild(item);
  });

  const hiddenCount = tags.length - visibleTags.length;
  if (hiddenCount > 0) {
    const more = document.createElement('li');
    more.className = 'project-card-tag project-card-tag--more font-mono';
    more.setAttribute('aria-label', `Mais ${hiddenCount} tecnologias`);

    const moreIcon = document.createElement('ion-icon');
    moreIcon.setAttribute('name', 'layers-outline');
    moreIcon.setAttribute('aria-hidden', 'true');
    more.appendChild(moreIcon);

    const moreLabel = document.createElement('span');
    moreLabel.className = 'project-card-tag-label';
    moreLabel.textContent = `+${hiddenCount}`;
    more.appendChild(moreLabel);

    list.appendChild(more);
  }

  return list;
}

function createProjectCard(project, index) {
  const card = document.createElement('article');
  card.className = 'project-grid-card reveal-on-scroll';
  card.setAttribute('role', 'listitem');
  card.style.setProperty('--reveal-index', String(index));
  card.dataset.delay = String(Math.min(index * 0.08, 0.6));

  const projectKey = project.name.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-');
  card.dataset.project = projectKey;

  const demoUrl = project.demoUrl;
  const repoUrl = project.repoUrl;
  const badgeLabel = project.isProduction ? 'Em produção' : 'Open source';
  const categoryLabel = project.category || (project.isProduction ? 'Projeto' : 'Repositório');

  // Media & Imagem
  const media = document.createElement('div');
  media.className = 'project-card-media';
  media.appendChild(createProjectMediaImage(project, index));

  // Badge da stack
  const badge = document.createElement('span');
  badge.className = `project-card-badge font-mono ${project.isProduction ? 'prod' : 'open'}`;
  badge.textContent = badgeLabel;
  media.appendChild(badge);

  // Conteúdo do Card
  const content = document.createElement('div');
  content.className = 'project-card-content';

  const category = document.createElement('span');
  category.className = 'project-card-category font-mono';
  category.textContent = categoryLabel;
  content.appendChild(category);

  const title = document.createElement('h3');
  title.className = 'project-card-title';
  title.textContent = project.name;
  content.appendChild(title);

  // Descrição do problema / solução
  const desc = document.createElement('p');
  desc.className = 'project-card-desc';
  desc.textContent = project.description || '';
  content.appendChild(desc);

  // Resultado
  if (project.outcome) {
    const outcome = document.createElement('div');
    outcome.className = 'project-card-outcome';
    outcome.innerHTML = `<strong>Resultado:</strong> ${project.outcome}`;
    content.appendChild(outcome);
  }

  // Tags das tecnologias
  const languageTags = createLanguageTags(project.stack);
  if (languageTags) {
    content.appendChild(languageTags);
  }

  // Ações / Links
  const actions = document.createElement('div');
  actions.className = 'project-card-actions';

  if (demoUrl) {
    const demoLink = document.createElement('a');
    demoLink.className = 'button project-btn-primary';
    demoLink.href = demoUrl;
    demoLink.target = '_blank';
    demoLink.rel = 'noopener noreferrer';
    demoLink.innerHTML = '<ion-icon name="open-outline" aria-hidden="true"></ion-icon> <span>Acessar</span>';
    actions.appendChild(demoLink);
  }

  if (repoUrl && (!project.isProduction || repoUrl !== demoUrl)) {
    const repoLink = document.createElement('a');
    repoLink.className = 'button project-btn-secondary';
    repoLink.href = repoUrl;
    repoLink.target = '_blank';
    repoLink.rel = 'noopener noreferrer';
    repoLink.innerHTML = '<i class="fab fa-github" aria-hidden="true"></i> <span>Código</span>';
    actions.appendChild(repoLink);
  }

  content.appendChild(actions);
  card.appendChild(media);
  card.appendChild(content);

  return card;
}

function buildUnifiedProjectList(repos) {
  const featuredNames = new Set(
    FEATURED_PROJECTS.map((project) => project.name.toLowerCase())
  );

  const featured = FEATURED_PROJECTS.map((project) => ({
    name: project.name,
    category: project.category || null,
    outcome: project.outcome || null,
    image: project.image,
    demoUrl: project.demoUrl || project.repoUrl,
    repoUrl: project.repoUrl || project.demoUrl,
    isProduction: true,
    updatedAt: project.updatedAt,
    stack: project.stack?.length ? [...project.stack] : [],
    description: project.description || '',
  }));

  const others = (Array.isArray(repos) ? repos : [])
    .filter(
      (repo) =>
        repo?.name &&
        !featuredNames.has(repo.name.toLowerCase()) &&
        !EXCLUDED_PROJECTS.has(repo.name.toLowerCase())
    )
    .map((repo) => {
      const homepage = resolveProjectHomepage(repo.name, repo.homepage);
      const htmlUrl = repo.html_url || '';
      const isProduction = isProductionProject(repo.name, htmlUrl, homepage);

      return {
        name: repo.name,
        category:
          getProjectCategory(repo.name) ||
          (isProduction ? 'Site' : 'Open source'),
        outcome: resolveProjectOutcome(repo.name),
        image: resolveProjectImage(repo.name) || '',
        demoUrl: isProduction ? homepage || htmlUrl : homepage || htmlUrl,
        repoUrl: htmlUrl,
        isProduction,
        updatedAt: repo.updated_at,
        stack: resolveProjectStack(
          repo.name,
          repo.language ? [repo.language] : []
        ),
        description: resolveProjectDescription(repo.name, repo.description),
      };
    })
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  return [...featured, ...others];
}

function showLoadingState(grid) {
  grid.innerHTML = '';
  grid.setAttribute('aria-busy', 'true');

  for (let i = 0; i < 6; i += 1) {
    const skeleton = document.createElement('article');
    skeleton.className = 'project-grid-card project-grid-card--skeleton';
    skeleton.setAttribute('aria-hidden', 'true');
    skeleton.innerHTML = `
      <div class="project-card-media"><div class="skeleton-shimmer"></div></div>
      <div class="project-card-content">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line desc"></div>
        <div class="skeleton-line desc"></div>
        <div class="skeleton-line tags"></div>
      </div>
    `;
    grid.appendChild(skeleton);
  }
}

function showErrorState(grid) {
  grid.innerHTML = '';
  grid.removeAttribute('aria-busy');
  grid.innerHTML =
    '<p class="projects-grid-error" role="alert">Não foi possível carregar os projetos no momento.</p>';
}

function setupSliderControls(grid) {
  const container = grid.parentElement;
  if (!container) return;

  const btnPrev = container.querySelector('.projects-nav-btn--prev');
  const btnNext = container.querySelector('.projects-nav-btn--next');

  if (!btnPrev || !btnNext) return;

  const updateButtons = () => {
    const scrollLeft = grid.scrollLeft;
    const maxScroll = grid.scrollWidth - grid.clientWidth;

    btnPrev.disabled = scrollLeft <= 5;
    btnNext.disabled = scrollLeft >= maxScroll - 5;
  };

  const getScrollAmount = () => {
    const card = grid.querySelector('.project-grid-card');
    if (card) {
      return card.clientWidth + 32; // card width + grid gap (2rem = 32px)
    }
    return grid.clientWidth * 0.75;
  };

  btnPrev.onclick = () => {
    grid.scrollBy({
      left: -getScrollAmount(),
      behavior: 'smooth'
    });
  };

  btnNext.onclick = () => {
    grid.scrollBy({
      left: getScrollAmount(),
      behavior: 'smooth'
    });
  };

  grid.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);

  // Inicializa o estado dos botões após a renderização
  setTimeout(updateButtons, 100);

  // --- MOUSE DRAG SCROLLING ---
  let isDown = false;
  let startX;
  let startPageX;
  let scrollLeft;
  let isDragging = false;
  let mouseMoved = false;

  grid.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Apenas clique esquerdo
    
    isDown = true;
    isDragging = false;
    mouseMoved = false;
    startX = e.pageX - grid.offsetLeft;
    startPageX = e.pageX;
    scrollLeft = grid.scrollLeft;
    
    grid.style.scrollSnapType = 'none';
    grid.style.scrollBehavior = 'auto';
  });

  const stopDragging = () => {
    if (isDown) {
      isDown = false;
      grid.style.scrollSnapType = 'x mandatory';
      grid.style.scrollBehavior = 'smooth';
    }
  };

  grid.addEventListener('mouseleave', stopDragging);
  grid.addEventListener('mouseup', stopDragging);

  grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX) * 1.5;
    
    if (Math.abs(e.pageX - startPageX) > 5) {
      mouseMoved = true;
      isDragging = true;
    }
    
    grid.scrollLeft = scrollLeft - walk;
  });

  grid.addEventListener('click', (e) => {
    if (isDragging && mouseMoved) {
      e.preventDefault();
      e.stopPropagation();
      isDragging = false;
      mouseMoved = false;
    }
  }, true);
}

function renderProjectCards(grid, projects) {
  grid.innerHTML = '';
  grid.removeAttribute('aria-busy');

  projects.forEach((project, index) => {
    grid.appendChild(createProjectCard(project, index));
  });

  requestAnimationFrame(() => {
    triggerCardEntrance(grid);
    if (window.observeNewElements) {
      window.observeNewElements();
    }
    setupSliderControls(grid);
  });
}

function triggerCardEntrance(grid) {
  const cards = grid.querySelectorAll('.project-grid-card:not(.project-grid-card--skeleton)');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add('revealed'));
    return;
  }

  requestAnimationFrame(() => {
    cards.forEach((card, index) => {
      window.setTimeout(() => {
        card.classList.add('revealed');
      }, index * 80);
    });
  });
}

export async function initProjectsGrid() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  showLoadingState(grid);

  try {
    const { repos } = await fetchRepositories();
    const projects = buildUnifiedProjectList(repos);
    renderProjectCards(grid, projects);
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    const fallbackRepos = getPortfolioProjectsFallback();
    const projects = buildUnifiedProjectList(fallbackRepos);

    if (projects.length > 0) {
      renderProjectCards(grid, projects);
      if (window.showToast) {
        window.showToast('Projetos carregados do catálogo local', 'info', 4000);
      }
      return;
    }

    showErrorState(grid);
    if (window.showToast) {
      window.showToast('Erro ao carregar projetos', 'error');
    }
  }
}
