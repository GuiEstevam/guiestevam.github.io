/**
 * Slider unificado de projetos — destaques + GitHub em faixa longa
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
} from './data/projects.js';
import { getStackIcon } from './utils/stack-icons.js';

const EXCLUDED_PROJECTS = new Set(
 EXCLUDED_PROJECT_NAMES.map((name) => name.toLowerCase())
);

const SLIDER_GAP = 16;

let sliderState = null;

/**
 * Inicializa o slider de projetos na seção #projetos
 */
export async function initProjectsSlider() {
 const root = document.getElementById('projects-slider');
 const track = document.getElementById('projects-slider-track');
 if (!root || !track) return;

 showLoadingState(track);

 try {
  const { repos } = await fetchRepositories();
  const projects = buildUnifiedProjectList(repos);
  renderProjectCards(track, projects);
  requestAnimationFrame(() => {
   requestAnimationFrame(() => {
    initSliderControls(root, track);
   });
  });
 } catch (error) {
  console.error('Erro ao carregar projetos:', error);
  const fallbackRepos = getPortfolioProjectsFallback();
  const projects = buildUnifiedProjectList(fallbackRepos);

  if (projects.length > 0) {
   renderProjectCards(track, projects);
   requestAnimationFrame(() => {
    requestAnimationFrame(() => {
     initSliderControls(root, track);
    });
   });
   if (window.showToast) {
    window.showToast('Projetos carregados do catálogo local', 'info', 4000);
   }
   return;
  }

  showErrorState(track);
  if (window.showToast) {
   window.showToast('Erro ao carregar projetos', 'error');
  }
 }
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
    image: resolveProjectImage(repo.name) || getFallbackImage(repo.name),
    demoUrl: isProduction ? homepage || htmlUrl : homepage || htmlUrl,
    repoUrl: htmlUrl,
    isProduction,
    updatedAt: repo.updated_at,
    stack: resolveProjectStack(
     repo.name,
     repo.language ? [repo.language] : []
    ),
   };
  })
  .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

 return [...featured, ...others];
}

function getFallbackImage(name) {
 const hash = (name || 'projeto')
  .split('')
  .reduce((acc, char) => acc + char.charCodeAt(0), 0);
 const index = (hash % 9) + 3;
 return `images/pic${String(index).padStart(2, '0')}.jpg`;
}

function formatProjectUrl(url) {
 try {
  return new URL(url).hostname.replace(/^www\./, '');
 } catch {
  return 'site';
 }
}

function showLoadingState(track) {
 track.innerHTML = '';
 track.setAttribute('aria-busy', 'true');

 for (let i = 0; i < 4; i += 1) {
  const skeleton = document.createElement('article');
  skeleton.className = 'featured-item featured-item--skeleton';
  skeleton.setAttribute('aria-hidden', 'true');
  skeleton.innerHTML =
   '<div class="featured-item-media"><div class="featured-item-skeleton-shimmer"></div></div>';
  track.appendChild(skeleton);
 }
}

function showErrorState(track) {
 track.innerHTML = '';
 track.removeAttribute('aria-busy');
 track.innerHTML =
  '<p class="projects-slider-error" role="alert">Não foi possível carregar os projetos no momento.</p>';
}

function renderProjectCards(track, projects) {
 track.innerHTML = '';
 track.removeAttribute('aria-busy');

 projects.forEach((project, index) => {
  track.appendChild(createProjectCard(project, index));
 });

 requestAnimationFrame(() => {
  triggerCardEntrance(track);
  if (window.observeNewElements) {
   window.observeNewElements();
  }
 });
}

function triggerCardEntrance(track) {
 const cards = track.querySelectorAll('.featured-item:not(.featured-item--skeleton)');
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
   }, index * 95);
  });
 });
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
 list.className = 'featured-item-tags';
 list.setAttribute('aria-label', 'Tecnologias do projeto');

 const visibleTags = tags.slice(0, 3);
 visibleTags.forEach((tech) => {
  const item = document.createElement('li');
  item.className = 'featured-item-tag font-mono';
  item.appendChild(createTagIcon(tech));

  const label = document.createElement('span');
  label.className = 'featured-item-tag-label';
  label.textContent = tech;
  item.appendChild(label);

  list.appendChild(item);
 });

 const hiddenCount = tags.length - visibleTags.length;
 if (hiddenCount > 0) {
  const more = document.createElement('li');
  more.className = 'featured-item-tag featured-item-tag--more font-mono';
  more.setAttribute('aria-label', `Mais ${hiddenCount} tecnologias`);

  const moreIcon = document.createElement('ion-icon');
  moreIcon.setAttribute('name', 'layers-outline');
  moreIcon.setAttribute('aria-hidden', 'true');
  more.appendChild(moreIcon);

  const moreLabel = document.createElement('span');
  moreLabel.className = 'featured-item-tag-label';
  moreLabel.textContent = `+${hiddenCount}`;
  more.appendChild(moreLabel);

  list.appendChild(more);
 }

 return list;
}

function createProjectCard(project, index) {
 const article = document.createElement('article');
 article.className = 'featured-item featured-item--animated reveal-on-scroll';
 article.setAttribute('role', 'listitem');
 article.style.setProperty('--reveal-index', String(index));
 article.dataset.delay = String(Math.min(index * 0.09, 0.72));

 const linkUrl = project.isProduction
  ? project.demoUrl || project.repoUrl
  : project.demoUrl && !project.demoUrl.includes('github.com')
    ? project.demoUrl
    : project.repoUrl || project.demoUrl;

 if (!linkUrl) return article;

 const link = document.createElement('a');
 link.className = 'featured-item-link';
 link.href = linkUrl;
 link.target = '_blank';
 link.rel = 'noopener noreferrer';

 const badgeLabel = project.isProduction ? 'Em produção' : 'Open source';
 const categoryLabel = project.category || (project.isProduction ? 'Projeto' : 'Repositório');

 link.setAttribute(
  'aria-label',
  `${project.name} — ${categoryLabel} (${formatProjectUrl(linkUrl)})`
 );

  const media = document.createElement('div');
  media.className = 'featured-item-media';

  const img = document.createElement('img');
  img.src = project.image;
  img.alt = `Screenshot do projeto ${project.name}`;
  img.className = 'featured-item-image';
  img.loading = index < 3 ? 'eager' : 'lazy';
  img.width = 640;
  img.height = 400;
  media.appendChild(img);

  const badge = document.createElement('span');
  badge.className = `featured-item-badge font-mono${
   project.isProduction ? '' : ' featured-item-badge--opensource'
  }`;
  badge.setAttribute('aria-label', badgeLabel);
  badge.textContent = badgeLabel;

  const caption = document.createElement('div');
  caption.className = 'featured-item-caption';

  const title = document.createElement('h3');
  title.className = 'featured-item-title';
  title.textContent = project.name;
  caption.appendChild(title);

  const category = document.createElement('p');
  category.className = 'featured-item-category font-mono';
  category.textContent = categoryLabel;
  caption.appendChild(category);

  if (project.outcome) {
   const outcome = document.createElement('p');
   outcome.className = 'featured-item-outcome';
   outcome.textContent = project.outcome;
   caption.appendChild(outcome);
  }

  const languageTags = createLanguageTags(project.stack);
  if (languageTags) {
   caption.appendChild(languageTags);
  }

  const openIcon = document.createElement('ion-icon');
  openIcon.className = 'featured-item-icon';
  openIcon.setAttribute('name', 'open-outline');
  openIcon.setAttribute('aria-hidden', 'true');
  caption.appendChild(openIcon);

  // Desktop: badge/caption sobrepõem a mídia via CSS absolute.
  // Mobile: flex column com imagem limpa e metadados abaixo.
  link.appendChild(media);
  link.appendChild(badge);
  link.appendChild(caption);
  article.appendChild(link);

 return article;
}

function initSliderControls(root, track) {
 const originalCards = Array.from(
  track.querySelectorAll('.featured-item:not(.featured-item--skeleton)')
 );
 if (originalCards.length === 0) return;

 const prevBtn = root.querySelector('.projects-slider-btn--prev');
 const nextBtn = root.querySelector('.projects-slider-btn--next');
 const dotsContainer = root.querySelector('.projects-slider-dots');

 sliderState = {
  root,
  track,
  originalCards,
  prevBtn,
  nextBtn,
  dotsContainer,
  currentIndex: 0,
  cloneCount: 0,
  originalCount: originalCards.length,
  gap: SLIDER_GAP,
  touchStartX: 0,
  touchEndX: 0,
  resizeObserver: null,
  onTransitionEnd: null,
 };

 setupInfiniteLoop();
 createSliderDots();
 bindSliderEvents();
 updateSliderPosition(true);
 updateSliderUi();
}

function setupInfiniteLoop() {
 if (!sliderState) return;

 const { track, originalCards } = sliderState;

 track.querySelectorAll('[data-clone="true"]').forEach((clone) => clone.remove());

 const cloneCount = Math.min(getVisibleCount(), originalCards.length);

 for (let index = cloneCount - 1; index >= 0; index -= 1) {
  const sourceIndex = originalCards.length - cloneCount + index;
  const clone = cloneSlideCard(originalCards[sourceIndex], 'prepend');
  track.insertBefore(clone, track.firstChild);
 }

 for (let index = 0; index < cloneCount; index += 1) {
  const clone = cloneSlideCard(originalCards[index], 'append');
  track.appendChild(clone);
 }

 sliderState.cloneCount = cloneCount;
 sliderState.currentIndex = cloneCount;
}

function cloneSlideCard(sourceCard, position) {
 const clone = sourceCard.cloneNode(true);
 clone.setAttribute('data-clone', 'true');
 clone.setAttribute('data-clone-position', position);
 clone.setAttribute('aria-hidden', 'true');
 clone.classList.remove('reveal-on-scroll', 'featured-item--animated');
 clone.classList.add('revealed');
 clone.style.removeProperty('--reveal-index');
 clone.removeAttribute('data-delay');

 const cloneLink = clone.querySelector('a');
 if (cloneLink) {
  cloneLink.setAttribute('tabindex', '-1');
 }

 return clone;
}

function getLoopBounds() {
 const cloneCount = sliderState?.cloneCount || 0;
 const originalCount = sliderState?.originalCount || 0;
 const visibleCount = getVisibleCount();

 return {
  startIndex: cloneCount,
  resetHighAt: cloneCount + originalCount,
  resetHighTo: cloneCount,
  resetLowAt: cloneCount - 1,
  resetLowTo: cloneCount + Math.max(0, originalCount - visibleCount),
 };
}

function getLogicalIndex() {
 if (!sliderState) return 0;

 const { currentIndex, cloneCount, originalCount } = sliderState;
 const visibleCount = getVisibleCount();
 const maxLogical = Math.max(0, originalCount - visibleCount);
 const logical = currentIndex - cloneCount;

 if (logical < 0) return maxLogical;
 if (logical > maxLogical) return 0;
 return logical;
}

function getVisibleCount() {
 const width = window.innerWidth;
 if (width >= 1200) return 3;
 if (width >= 768) return 2;
 return 1;
}

function getMaxIndex() {
 return Math.max(0, (sliderState?.originalCount || 0) - getVisibleCount());
}

function getCardStep() {
 if (!sliderState?.track) return 0;
 const trackCards = sliderState.track.querySelectorAll(
  '.featured-item:not(.featured-item--skeleton)'
 );
 if (trackCards.length === 0) return 0;

 const first = trackCards[0];
 const trackStyle = getComputedStyle(sliderState.track);
 const gap =
  parseFloat(trackStyle.columnGap || trackStyle.gap || '0') || SLIDER_GAP;
 return first.offsetWidth + gap;
}

function updateSliderPosition(skipAnimation = false) {
 if (!sliderState) return;

 const { track, currentIndex } = sliderState;
 const step = getCardStep();
 const offset = currentIndex * step;
 const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
 ).matches;

 if (skipAnimation || prefersReducedMotion) {
  track.style.transition = 'none';
 } else {
  track.style.transition = 'transform 0.48s cubic-bezier(0.25, 0.8, 0.25, 1)';
 }

 track.style.transform = `translate3d(${-offset}px, 0, 0)`;
}

function handleLoopTransitionEnd(event) {
 if (!sliderState || event.target !== sliderState.track) return;
 if (event.propertyName !== 'transform') return;

 const bounds = getLoopBounds();
 let shouldReset = false;
 let nextIndex = sliderState.currentIndex;

 if (sliderState.currentIndex >= bounds.resetHighAt) {
  shouldReset = true;
  nextIndex = bounds.resetHighTo;
 } else if (sliderState.currentIndex <= bounds.resetLowAt) {
  shouldReset = true;
  nextIndex = bounds.resetLowTo;
 }

 if (!shouldReset) return;

 updateSliderPosition(true);
 sliderState.currentIndex = nextIndex;
 requestAnimationFrame(() => {
  updateSliderPosition(true);
  updateSliderUi();
 });
}

function updateSliderUi() {
 if (!sliderState) return;

 const { prevBtn, nextBtn, dots } = sliderState;
 const logicalIndex = getLogicalIndex();

 if (prevBtn) {
  prevBtn.disabled = false;
  prevBtn.classList.remove('is-disabled');
  prevBtn.setAttribute('aria-disabled', 'false');
 }

 if (nextBtn) {
  nextBtn.disabled = false;
  nextBtn.classList.remove('is-disabled');
  nextBtn.setAttribute('aria-disabled', 'false');
 }

 if (Array.isArray(dots)) {
  dots.forEach((dot, index) => {
   const isActive = index === logicalIndex;
   dot.classList.toggle('active', isActive);
   dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
   dot.setAttribute('tabindex', isActive ? '0' : '-1');
  });
 }
}

function createSliderDots() {
 if (!sliderState?.dotsContainer || !sliderState.originalCount) return;

 sliderState.dotsContainer.innerHTML = '';
 sliderState.dots = [];

 const totalDots = getMaxIndex() + 1;

 for (let index = 0; index < totalDots; index += 1) {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'projects-slider-dot';
  dot.setAttribute('role', 'tab');
  dot.setAttribute('aria-label', `Ir para o projeto ${index + 1}`);
  dot.addEventListener('click', () => goToSlide(index));
  sliderState.dotsContainer.appendChild(dot);
  sliderState.dots.push(dot);
 }
}

function finalizeLoopIfNeeded() {
 if (!sliderState) return;

 const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
 ).matches;
 if (!prefersReducedMotion) return;

 const bounds = getLoopBounds();

 if (sliderState.currentIndex >= bounds.resetHighAt) {
  sliderState.currentIndex = bounds.resetHighTo;
  updateSliderPosition(true);
  return;
 }

 if (sliderState.currentIndex <= bounds.resetLowAt) {
  sliderState.currentIndex = bounds.resetLowTo;
  updateSliderPosition(true);
 }
}

function goToSlide(index) {
 if (!sliderState) return;
 sliderState.currentIndex = sliderState.cloneCount + index;
 updateSliderPosition();
 finalizeLoopIfNeeded();
 updateSliderUi();
}

function goToPrev() {
 if (!sliderState) return;
 sliderState.currentIndex -= 1;
 updateSliderPosition();
 finalizeLoopIfNeeded();
 updateSliderUi();
}

function goToNext() {
 if (!sliderState) return;
 sliderState.currentIndex += 1;
 updateSliderPosition();
 finalizeLoopIfNeeded();
 updateSliderUi();
}

function bindSliderEvents() {
 if (!sliderState) return;

 const { prevBtn, nextBtn, track, root } = sliderState;

 if (sliderState.onTransitionEnd) {
  track.removeEventListener('transitionend', sliderState.onTransitionEnd);
 }

 sliderState.onTransitionEnd = handleLoopTransitionEnd;
 track.addEventListener('transitionend', sliderState.onTransitionEnd);

 prevBtn?.addEventListener('click', goToPrev);
 nextBtn?.addEventListener('click', goToNext);

 track.addEventListener('touchstart', (event) => {
  sliderState.touchStartX = event.changedTouches[0].screenX;
 }, { passive: true });

 track.addEventListener('touchend', (event) => {
  sliderState.touchEndX = event.changedTouches[0].screenX;
  const distance = sliderState.touchStartX - sliderState.touchEndX;
  if (Math.abs(distance) < 40) return;
  if (distance > 0) goToNext();
  else goToPrev();
 }, { passive: true });

 const onResize = () => {
  const logicalIndex = getLogicalIndex();
  setupInfiniteLoop();
  sliderState.currentIndex = sliderState.cloneCount + logicalIndex;
  createSliderDots();
  updateSliderPosition(true);
  updateSliderUi();
 };

 window.addEventListener('resize', onResize, { passive: true });

 if ('ResizeObserver' in window) {
  sliderState.resizeObserver?.disconnect();
  sliderState.resizeObserver = new ResizeObserver(onResize);
  sliderState.resizeObserver.observe(root);
 }
}
