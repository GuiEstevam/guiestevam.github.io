/**
 * Renderiza a seção #destaques a partir de projects.js
 */

import { FEATURED_PROJECTS } from './data/projects.js';

const SECONDARY_STACK_LIMIT = 2;

/**
 * Inicializa e renderiza os cards em destaque
 */
export function renderFeaturedProjects() {
 const container = document.getElementById('featured-projects-grid');
 if (!container) return;

 container.innerHTML = '';
 container.setAttribute('aria-busy', 'true');

 FEATURED_PROJECTS.forEach((project, index) => {
  const card = createFeaturedCard(project, index);
  container.appendChild(card);
 });

 container.removeAttribute('aria-busy');

 requestAnimationFrame(() => {
  if (window.observeNewElements) {
   window.observeNewElements();
  }
 });
}

function formatFeaturedUrl(url) {
 try {
  return new URL(url).hostname.replace(/^www\./, '');
 } catch {
  return 'site';
 }
}

function formatFeaturedIndex(index) {
 return String(index + 1).padStart(2, '0');
}

function createOpenIcon() {
 const icon = document.createElement('ion-icon');
 icon.setAttribute('name', 'open-outline');
 icon.setAttribute('aria-hidden', 'true');
 return icon;
}

function createBrowserChrome(demoUrl) {
 const browser = document.createElement('div');
 browser.className = 'featured-card-browser';

 const bar = document.createElement('div');
 bar.className = 'featured-card-browser-bar';
 bar.setAttribute('aria-hidden', 'true');

 ['close', 'min', 'max'].forEach((type) => {
  const dot = document.createElement('span');
  dot.className = `featured-card-browser-dot featured-card-browser-dot--${type}`;
  bar.appendChild(dot);
 });

 const urlLabel = document.createElement('span');
 urlLabel.className = 'featured-card-browser-url font-mono';
 urlLabel.textContent = formatFeaturedUrl(demoUrl);
 bar.appendChild(urlLabel);

 browser.appendChild(bar);
 return browser;
}

function getStackIcon(tech) {
 const icons = {
  PHP: 'fab fa-php',
  Laravel: 'fab fa-laravel',
  MySQL: 'fas fa-database',
  Blade: 'fas fa-layer-group',
  HTML: 'fab fa-html5',
  CSS: 'fab fa-css3-alt',
  JavaScript: 'fab fa-js',
  'Vue.js': 'fab fa-vuejs',
 };

 return icons[tech] || 'fas fa-code';
}

function createProductionBadge() {
 const badge = document.createElement('span');
 badge.className = 'featured-card-badge font-mono';

 const icon = document.createElement('ion-icon');
 icon.setAttribute('name', 'checkmark-circle-outline');
 icon.setAttribute('aria-hidden', 'true');

 const label = document.createElement('span');
 label.textContent = 'Em produção';

 badge.appendChild(icon);
 badge.appendChild(label);
 return badge;
}

function createStackPill(tech) {
 const item = document.createElement('li');
 item.className = 'stack-pill';

 const icon = document.createElement('i');
 icon.className = getStackIcon(tech);
 icon.setAttribute('aria-hidden', 'true');

 const label = document.createElement('span');
 label.textContent = tech;

 item.appendChild(icon);
 item.appendChild(label);
 return item;
}

function createStackList(stack, limit = stack.length) {
 const stackList = document.createElement('ul');
 stackList.className = 'featured-card-stack';
 stackList.setAttribute('aria-label', 'Stack do projeto');

 const visibleStack = stack.slice(0, limit);
 const hiddenCount = stack.length - visibleStack.length;

 visibleStack.forEach((tech) => {
  stackList.appendChild(createStackPill(tech));
 });

 if (hiddenCount > 0) {
  const moreItem = document.createElement('li');
  moreItem.className = 'stack-pill stack-pill--more';

  const icon = document.createElement('ion-icon');
  icon.setAttribute('name', 'layers-outline');
  icon.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.textContent = `+${hiddenCount}`;

  moreItem.appendChild(icon);
  moreItem.appendChild(label);
  moreItem.setAttribute('aria-label', `Mais ${hiddenCount} tecnologias`);
  stackList.appendChild(moreItem);
 }

 return stackList;
}

function createSiteLink(siteUrl, projectName, variant = 'button') {
 const siteLink = document.createElement('a');
 siteLink.href = siteUrl;
 siteLink.target = '_blank';
 siteLink.rel = 'noopener noreferrer';
 siteLink.setAttribute('aria-label', `Ver site do projeto ${projectName}`);

 if (variant === 'button') {
  siteLink.className = 'featured-card-demo';
  siteLink.appendChild(document.createTextNode('Ver site'));
  siteLink.appendChild(createOpenIcon());
  return siteLink;
 }

 siteLink.className = 'featured-card-cta';
 const label = document.createElement('span');
 label.textContent = 'Ver site';
 siteLink.appendChild(label);
 siteLink.appendChild(createOpenIcon());
 return siteLink;
}

function createFeaturedImage(project, index) {
 const img = document.createElement('img');
 img.src = project.image;
 img.alt = `Screenshot do projeto ${project.name}`;
 img.className = 'featured-card-image';
 img.loading = index === 0 ? 'eager' : 'lazy';
 img.width = 640;
 img.height = 400;
 return img;
}

function createFeaturedCard(project, index) {
 const article = document.createElement('article');
 const isPrimary = project.bentoClass === 'featured-card--primary';
 article.className = `featured-card ${project.bentoClass || ''} reveal-on-scroll`;
 article.setAttribute('role', 'listitem');
 article.setAttribute('aria-label', `Projeto em destaque: ${project.name}`);
 article.dataset.delay = String(index * 0.1);

 const demoUrl = project.demoUrl || project.repoUrl;
 if (!demoUrl) return article;

 const browser = createBrowserChrome(demoUrl);
 const media = document.createElement('div');
 media.className = 'featured-card-media';

 media.appendChild(createProductionBadge());
 media.appendChild(createFeaturedImage(project, index));

 if (isPrimary) {
  const overlay = document.createElement('div');
  overlay.className = 'featured-card-overlay';

  const indexLabel = document.createElement('span');
  indexLabel.className = 'featured-card-index font-mono';
  indexLabel.textContent = formatFeaturedIndex(index);
  overlay.appendChild(indexLabel);

  const title = document.createElement('h3');
  title.className = 'featured-card-title';
  title.textContent = project.name;
  overlay.appendChild(title);

  if (project.impactLine) {
   const impact = document.createElement('p');
   impact.className = 'featured-card-impact font-mono';
   impact.textContent = project.impactLine;
   overlay.appendChild(impact);
  }

  if (project.description) {
   const description = document.createElement('p');
   description.className = 'featured-card-description';
   description.textContent = project.description;
   overlay.appendChild(description);
  }

  if (Array.isArray(project.stack) && project.stack.length > 0) {
   overlay.appendChild(createStackList(project.stack));
  }

  const actions = document.createElement('div');
  actions.className = 'featured-card-actions';
  actions.appendChild(createSiteLink(demoUrl, project.name, 'cta'));
  overlay.appendChild(actions);

  media.appendChild(overlay);
 } else {
  const body = document.createElement('div');
  body.className = 'featured-card-overlay featured-card-overlay--compact';

  const indexLabel = document.createElement('span');
  indexLabel.className = 'featured-card-index font-mono';
  indexLabel.textContent = formatFeaturedIndex(index);
  body.appendChild(indexLabel);

  const title = document.createElement('h3');
  title.className = 'featured-card-title';
  title.textContent = project.name;
  body.appendChild(title);

  if (project.impactLine) {
   const impact = document.createElement('p');
   impact.className = 'featured-card-impact font-mono';
   impact.textContent = project.impactLine;
   body.appendChild(impact);
  }

  if (project.description) {
   const description = document.createElement('p');
   description.className = 'featured-card-description';
   description.textContent = project.description;
   body.appendChild(description);
  }

  if (Array.isArray(project.stack) && project.stack.length > 0) {
   body.appendChild(createStackList(project.stack, SECONDARY_STACK_LIMIT));
  }

  const actions = document.createElement('div');
  actions.className = 'featured-card-actions';
  actions.appendChild(createSiteLink(demoUrl, project.name, 'button'));
  body.appendChild(actions);

  browser.appendChild(media);
  browser.appendChild(body);
  article.appendChild(browser);
  return article;
 }

 browser.appendChild(media);
 article.appendChild(browser);
 return article;
}
