/**
 * Seção Projetos
 * - Estudos de caso: os projetos com `caseStudy` no catálogo (Nerdola Miner primeiro)
 * - Lista compacta: o restante do catálogo + repositórios do GitHub
 *
 * Tudo é montado de forma síncrona a partir do catálogo local, sem depender de
 * animação de scroll. A API do GitHub só atualiza a lista compacta quando responde.
 */

import { fetchRepositories } from './services/github-service.js';
import {
  CASE_STUDIES,
  EXCLUDED_PROJECT_NAMES,
  getCatalogOrder,
  getPortfolioProjectsFallback,
  getProjectCategory,
  isProductionProject,
  resolveProjectDescription,
  resolveProjectHomepage,
  resolveProjectImage,
  resolveProjectStack,
  resolveProjectTagline,
} from './data/projects.js';

const EXCLUDED = new Set(EXCLUDED_PROJECT_NAMES.map((name) => name.toLowerCase()));
const CASE_NAMES = new Set(CASE_STUDIES.map((project) => project.name.toLowerCase()));

/* ---------- Utilidades ---------- */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Link externo. O texto visível vem primeiro; `context` (ex.: nome do projeto)
 * entra só para leitores de tela, junto com o aviso de nova aba.
 */
function externalLink(href, className, label, context) {
  const link = el('a', className);
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.append(el('span', null, label));
  link.append(el('span', 'visually-hidden', `${context ? ` ${context}` : ''} (abre em nova aba)`));
  const icon = el('i', 'icon solid fa-external-link-alt');
  icon.setAttribute('aria-hidden', 'true');
  link.append(icon);
  return link;
}

function truncate(text, max = 90) {
  if (!text || text.length <= max) return text || '';
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

/* ---------- Estudos de caso ---------- */

function createCaseMedia(project, index) {
  const media = el('div', 'case-media');

  // A imagem também leva ao site; fica fora da ordem de tab (o botão já cumpre isso)
  const shot = el(project.demoUrl ? 'a' : 'div', 'case-shot');
  if (project.demoUrl) {
    shot.href = project.demoUrl;
    shot.target = '_blank';
    shot.rel = 'noopener noreferrer';
    shot.tabIndex = -1;
    shot.setAttribute('aria-hidden', 'true');
  }
  const img = document.createElement('img');
  img.src = project.image;
  img.alt = `Tela do ${project.name}`;
  img.width = 1280;
  img.height = 800;
  img.decoding = 'async';
  img.loading = index === 0 ? 'eager' : 'lazy';
  shot.append(img);
  media.append(shot);

  // O print do celular só acompanha o caso em destaque
  if (index === 0 && project.mobileImage) {
    const phone = el('div', 'case-phone');
    phone.setAttribute('aria-hidden', 'true');
    const phoneImg = document.createElement('img');
    phoneImg.src = project.mobileImage;
    phoneImg.alt = '';
    phoneImg.width = 414;
    phoneImg.height = 830;
    phoneImg.decoding = 'async';
    phoneImg.loading = 'lazy';
    phone.append(phoneImg);
    media.append(phone);
  }

  return media;
}

function createCaseStudy(project, index) {
  // O primeiro caso (Nerdola Miner) é o destaque; os demais formam uma dupla
  const article = el('article', index === 0 ? 'case case--featured' : 'case case--compact');
  article.dataset.project = project.id;
  const headingId = `case-${project.id}`;
  article.setAttribute('aria-labelledby', headingId);

  const body = el('div', 'case-body');

  const meta = el('p', 'case-meta');
  meta.append(
    el('span', 'case-index', String(index + 1).padStart(2, '0')),
    el('span', 'case-category', project.category)
  );

  const title = el('h3', 'case-title', project.name);
  title.id = headingId;

  const summary = el('p', 'case-summary', project.summary || project.description);

  body.append(meta, title, summary);

  if (project.highlights?.length) {
    const list = el('ul', 'case-highlights');
    list.setAttribute('aria-label', 'O que foi desenvolvido');
    project.highlights.forEach((item) => list.append(el('li', null, item)));
    body.append(list);
  }

  const facts = el('dl', 'case-facts');
  if (project.outcome) {
    const row = el('div', 'case-fact');
    row.append(el('dt', null, 'Resultado'), el('dd', null, project.outcome));
    facts.append(row);
  }
  if (project.stack?.length) {
    const row = el('div', 'case-fact');
    row.append(el('dt', null, 'Stack'), el('dd', 'case-stack', project.stack.join(' · ')));
    facts.append(row);
  }
  body.append(facts);

  if (project.demoUrl) {
    // Botão + endereço ao lado (ou o aviso de login, quando é um sistema fechado)
    const actions = el('div', 'case-actions');
    const button = externalLink(
      project.demoUrl,
      index === 0 ? 'case-button case-button--primary' : 'case-button',
      project.linkLabel || 'Visitar site',
      `do ${project.name}`
    );
    const note = el('span', 'case-link-note');
    if (project.linkNote) {
      const lock = el('i', 'icon solid fa-lock');
      lock.setAttribute('aria-hidden', 'true');
      note.append(lock, document.createTextNode(` ${project.linkNote}`));
    } else {
      note.textContent = hostOf(project.demoUrl);
    }
    actions.append(button, note);
    body.append(actions);
  }

  article.append(createCaseMedia(project, index), body);
  return article;
}

function renderCaseStudies(container) {
  container.textContent = '';
  CASE_STUDIES.forEach((project, index) => {
    container.append(createCaseStudy(project, index));
  });
}

/* ---------- Lista compacta ---------- */

function toListItem(repo) {
  const homepage = resolveProjectHomepage(repo.name, repo.homepage);
  const htmlUrl = repo.html_url || '';
  const isProduction = isProductionProject(repo.name, htmlUrl, homepage);
  const url = homepage || htmlUrl;

  return {
    name: repo.name,
    category: getProjectCategory(repo.name) || (isProduction ? 'Site' : 'Open source'),
    tagline:
      resolveProjectTagline(repo.name) ||
      truncate(resolveProjectDescription(repo.name, repo.description)),
    stack: resolveProjectStack(repo.name, repo.language ? [repo.language] : []).slice(0, 3),
    image: resolveProjectImage(repo.name) || '',
    url,
    linkLabel: !url ? null : url.includes('github.com') ? 'Código' : 'Ver site',
    isProduction,
    updatedAt: repo.updated_at,
  };
}

function buildOtherProjects(repos) {
  return (Array.isArray(repos) ? repos : [])
    .filter((repo) => {
      const key = repo?.name?.toLowerCase();
      return key && !EXCLUDED.has(key) && !CASE_NAMES.has(key);
    })
    .map(toListItem)
    .sort((a, b) => {
      // Produção primeiro (na ordem do catálogo), depois open source pelo mais recente
      if (a.isProduction !== b.isProduction) return a.isProduction ? -1 : 1;
      const orderA = getCatalogOrder(a.name) ?? 99;
      const orderB = getCatalogOrder(b.name) ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
}

function createProjectThumb(item) {
  const thumb = el('div', 'project-tile-thumb');

  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = `Tela do ${item.name}`;
    img.width = 640;
    img.height = 400;
    img.loading = 'lazy';
    img.decoding = 'async';
    thumb.append(img);
  } else {
    // Sem captura pública (ex.: sistema interno): bloco neutro com o nome
    thumb.classList.add('project-tile-thumb--empty');
    thumb.setAttribute('aria-hidden', 'true');
    const icon = el('i', 'icon solid fa-lock');
    thumb.append(icon, el('span', null, item.name));
  }

  return thumb;
}

function createProjectTile(item) {
  const tile = el('li', 'project-tile');

  const body = el('div', 'project-tile-body');

  const head = el('div', 'project-tile-head');
  head.append(el('h4', 'project-tile-title', item.name), el('span', 'project-tile-category', item.category));

  const desc = el('p', 'project-tile-desc', item.tagline);
  const stack = el('p', 'project-tile-stack', item.stack.join(' · '));

  const action = item.url
    ? externalLink(item.url, 'project-tile-link', item.linkLabel, `do ${item.name}`)
    : el('span', 'project-tile-note', 'Uso interno');

  body.append(head, desc, stack, action);
  tile.append(createProjectThumb(item), body);
  return tile;
}

function renderOtherProjects(list, repos) {
  const items = buildOtherProjects(repos);
  list.textContent = '';
  items.forEach((item) => list.append(createProjectTile(item)));
  list.closest('.projects-more')?.toggleAttribute('hidden', items.length === 0);
  setupCarousel(list);
  list._updateCarousel?.();
}

/* ---------- Carrossel dos outros projetos ---------- */

/**
 * Rolagem nativa (touch, trackpad, teclado) com scroll-snap no CSS;
 * as setas só avançam uma "página" e são desativadas nas pontas.
 */
function setupCarousel(list) {
  const nav = list.closest('.projects-more')?.querySelector('.projects-carousel-nav');
  if (!nav || list.dataset.carousel) return;
  list.dataset.carousel = 'true';

  const buttons = nav.querySelectorAll('.projects-carousel-btn');

  const update = () => {
    const max = list.scrollWidth - list.clientWidth;
    nav.hidden = max <= 4;
    buttons.forEach((btn) => {
      const dir = Number(btn.dataset.dir);
      btn.disabled = dir < 0 ? list.scrollLeft <= 4 : list.scrollLeft >= max - 4;
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = Number(btn.dataset.dir);
      list.scrollBy({ left: dir * list.clientWidth * 0.9, behavior: 'smooth' });
    });
  });

  list.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  list._updateCarousel = update;
  update();
}

/* ---------- Init ---------- */

export async function initProjectsSection() {
  const cases = document.getElementById('projects-cases');
  const list = document.getElementById('projects-list');
  if (!cases && !list) return;

  if (cases) renderCaseStudies(cases);
  if (!list) return;

  // Mostra o catálogo local na hora; a API do GitHub só complementa
  renderOtherProjects(list, getPortfolioProjectsFallback());

  try {
    const { repos } = await fetchRepositories();
    if (Array.isArray(repos) && repos.length) {
      renderOtherProjects(list, repos);
    }
  } catch (error) {
    console.warn('GitHub indisponível; mantendo a lista local de projetos.', error);
  }
}
