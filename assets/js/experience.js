/**
 * Timeline de experiência profissional + formação — render + toggle mobile
 */

import { EXPERIENCE_ITEMS } from './data/experience.js';
import { EDUCATION_ITEMS } from './data/education.js';
import { getStackIcon } from './utils/stack-icons.js';
import { setupMobileDescriptionToggle } from './utils/description-toggle.js';
import { formatDuration } from './utils/formatters.js';

const EXPERIENCE_LINE_CLAMP_CURRENT = 3;
const EXPERIENCE_LINE_CLAMP_DEFAULT = 2;

export function renderExperienceTimeline() {
 const timeline = document.getElementById('experience-timeline');
 if (!timeline) return;

 const wrapper = timeline.closest('.experience-timeline-wrapper') || timeline.parentElement;
 wrapper?.querySelector('.experience-older-toggle')?.remove();

 timeline.innerHTML = '';
 timeline.classList.remove('experience-timeline--expanded');

 const primaryItems = EXPERIENCE_ITEMS.filter((item) => !item.collapsedByDefault);
 const olderItems = EXPERIENCE_ITEMS.filter((item) => item.collapsedByDefault);
 let index = 0;

 primaryItems.forEach((item) => {
  timeline.appendChild(createExperienceItem(item, index));
  index += 1;
 });

 olderItems.forEach((item) => {
  const li = createExperienceItem(item, index);
  li.classList.add('experience-item--older', 'is-collapsed');
  li.dataset.olderItem = 'true';
  timeline.appendChild(li);
  index += 1;
 });

 if (olderItems.length && wrapper) {
  wrapper.appendChild(createOlderExperiencesToggle(timeline, olderItems.length));
 }

 initExperienceDescriptions(timeline);
 renderEducationList();

 requestAnimationFrame(() => {
  if (window.observeNewElements) {
   window.observeNewElements();
  }
 });
}

function createOlderExperiencesToggle(timeline, olderCount) {
 const countLabel =
  olderCount === 1 ? '1 experiência anterior' : `${olderCount} experiências anteriores`;

 const toggle = document.createElement('button');
 toggle.type = 'button';
 toggle.className = 'experience-older-toggle';
 toggle.setAttribute('aria-expanded', 'false');
 toggle.setAttribute('aria-controls', 'experience-timeline');
 toggle.innerHTML = `
  <span class="experience-older-toggle-text">Ver ${countLabel}</span>
  <ion-icon name="chevron-down-outline" class="experience-older-toggle-icon" aria-hidden="true"></ion-icon>
 `;

 toggle.addEventListener('click', () => {
  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  const nextExpanded = !isExpanded;
  const olderItems = timeline.querySelectorAll('.experience-item--older');

  toggle.setAttribute('aria-expanded', String(nextExpanded));
  timeline.classList.toggle('experience-timeline--expanded', nextExpanded);

  if (nextExpanded) {
   olderItems.forEach((item) => item.classList.remove('is-collapsed'));
   revealOlderExperienceCards(timeline);
   initExperienceDescriptions(timeline);
   requestAnimationFrame(() => {
    if (window.observeNewElements) {
     window.observeNewElements();
    }
   });
  } else {
   resetOlderExperienceCards(timeline);
   window.setTimeout(() => {
    if (toggle.getAttribute('aria-expanded') === 'false') {
     olderItems.forEach((item) => item.classList.add('is-collapsed'));
    }
   }, 220);
  }

  const text = toggle.querySelector('.experience-older-toggle-text');
  const icon = toggle.querySelector('.experience-older-toggle-icon');
  if (text) {
   text.textContent = nextExpanded
    ? 'Ocultar experiências anteriores'
    : `Ver ${countLabel}`;
  }
  if (icon) {
   icon.setAttribute('name', nextExpanded ? 'chevron-up-outline' : 'chevron-down-outline');
  }
 });

 return toggle;
}

function revealOlderExperienceCards(timeline) {
 const cards = timeline.querySelectorAll(
  '.experience-item--older .experience-card'
 );
 const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
 ).matches;

 cards.forEach((card, index) => {
  card.classList.remove('revealed', 'experience-card--exit');
  card.classList.add('experience-card--enter');
  card.style.transitionDelay = '0ms';

  if (prefersReducedMotion) {
   card.classList.add('revealed');
   return;
  }

  void card.offsetWidth;

  window.setTimeout(() => {
   card.style.transitionDelay = `${index * 90}ms`;
   card.classList.add('revealed');
  }, 30);
 });
}

function resetOlderExperienceCards(timeline) {
 timeline.querySelectorAll('.experience-item--older .experience-card').forEach((card) => {
  card.classList.remove('revealed');
  card.classList.add('experience-card--exit');
  card.style.transitionDelay = '0ms';
 });
}

function renderEducationList() {
 const list = document.getElementById('education-list');
 if (!list) return;

 list.innerHTML = '';

 EDUCATION_ITEMS.forEach((item) => {
  list.appendChild(createEducationItem(item));
 });
}

function createEducationItem(item) {
 const li = document.createElement('li');
 li.className = 'education-item';
 if (item.statusVariant === 'current') {
  li.classList.add('education-item--current');
 }
 li.setAttribute('role', 'listitem');

 const iconWrap = document.createElement('span');
 iconWrap.className = 'education-item-icon';
 iconWrap.setAttribute('aria-hidden', 'true');

 const icon = document.createElement('ion-icon');
 icon.setAttribute(
  'name',
  item.statusVariant === 'current' ? 'school-outline' : 'ribbon-outline'
 );
 iconWrap.appendChild(icon);

 const body = document.createElement('div');
 body.className = 'education-item-body';

 const title = document.createElement('h4');
 title.className = 'education-item-title';
 title.textContent = item.title;

 const institution = document.createElement('p');
 institution.className = 'education-item-institution';
 institution.textContent = item.institution;

 const period = document.createElement('span');
 period.className = 'education-item-period font-mono';
 period.textContent = item.period;

 body.appendChild(title);
 body.appendChild(institution);
 body.appendChild(period);

 const status = document.createElement('span');
 status.className = 'education-item-status font-mono';
 if (item.statusVariant === 'current') {
  status.classList.add('education-item-status--current');
 } else {
  status.classList.add('education-item-status--done');
 }
 status.textContent = item.status;

 li.appendChild(iconWrap);
 li.appendChild(body);
 li.appendChild(status);

 return li;
}

function createExperienceItem(item, index) {
 const li = document.createElement('li');
 li.className = ['experience-item', ...(item.itemModifiers || [])]
  .filter(Boolean)
  .join(' ');
 li.setAttribute('role', 'listitem');

 const marker = document.createElement('div');
 marker.className = 'experience-marker';
 marker.setAttribute('aria-hidden', 'true');

 const card = document.createElement('div');
 card.className = ['experience-card', ...(item.cardModifiers || []), 'reveal-on-scroll']
  .filter(Boolean)
  .join(' ');
 if (index > 0) {
  card.dataset.delay = String(Math.min(index * 0.08, 0.32));
 }

 card.appendChild(createExperienceHeader(item));

 if (item.parallelNote) {
  card.appendChild(createParallelNote(item.parallelNote));
 }

 card.appendChild(createExperienceMeta(item));

 if (item.stack?.length) {
  card.appendChild(createExperienceStack(item.stack));
 }

 card.appendChild(createExperienceDescription(item.description));

 li.appendChild(marker);
 li.appendChild(card);

 return li;
}

function createExperienceHeader(item) {
 const header = document.createElement('div');
 header.className = 'experience-header';

 const titleWrapper = document.createElement('div');
 titleWrapper.className = 'experience-title-wrapper';

 const title = document.createElement('h3');
 title.className = 'experience-title';
 title.textContent = item.title;

 const company = document.createElement('p');
 company.className = 'experience-company';
 company.textContent = item.company;

 titleWrapper.appendChild(title);
 titleWrapper.appendChild(company);

 const badges = document.createElement('div');
 badges.className = 'experience-badges';

 (item.badges || []).forEach((badge) => {
  const badgeEl = document.createElement('span');
  badgeEl.className = 'experience-badge-text';
  if (badge.variant === 'current') {
   badgeEl.classList.add('experience-badge-text--current');
  } else if (badge.variant === 'dev') {
   badgeEl.classList.add('experience-badge-text--dev');
  }
  badgeEl.textContent = badge.text;
  badges.appendChild(badgeEl);
 });

 header.appendChild(titleWrapper);
 header.appendChild(badges);

 return header;
}

function createParallelNote(note) {
 const paragraph = document.createElement('p');
 paragraph.className = 'experience-parallel-note';
 paragraph.innerHTML = `<i class="icon solid fa-layer-group" aria-hidden="true"></i> ${escapeHtml(note)}`;
 return paragraph;
}

function createExperienceMeta(item) {
 const fragment = document.createDocumentFragment();

 const meta = document.createElement('div');
 meta.className = 'experience-meta';

 const period = document.createElement('span');
 period.className = 'experience-period';
 period.innerHTML = `<i class="icon solid fa-calendar" aria-hidden="true"></i> ${escapeHtml(item.period)}`;

 const duration = document.createElement('span');
 duration.className = 'experience-duration';
 duration.textContent = resolveExperienceDuration(item);

 meta.appendChild(period);
 meta.appendChild(duration);
 fragment.appendChild(meta);

 const location = document.createElement('div');
 location.className = 'experience-location';
 location.innerHTML = `<i class="icon solid fa-map-marker-alt" aria-hidden="true"></i> ${escapeHtml(item.location)}`;
 fragment.appendChild(location);

 return fragment;
}

function createExperienceStack(stack) {
 const list = document.createElement('ul');
 list.className = 'experience-stack';
 list.setAttribute('aria-label', 'Stack utilizada');

 stack.forEach((tech) => {
  const stackItem = document.createElement('li');
  stackItem.className = 'stack-pill';

  const icon = document.createElement('i');
  icon.className = getStackIcon(tech);
  icon.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.textContent = tech;

  stackItem.appendChild(icon);
  stackItem.appendChild(label);
  list.appendChild(stackItem);
 });

 return list;
}

function createExperienceDescription(text) {
 const container = document.createElement('div');
 container.className = 'experience-description';

 const paragraph = document.createElement('p');
 paragraph.textContent = text;
 container.appendChild(paragraph);

 return container;
}

function initExperienceDescriptions(root = document) {
 const items = root.querySelectorAll('.experience-item');

 items.forEach((item) => {
  const descContainer = item.querySelector('.experience-description');
  if (!descContainer) return;

  if (descContainer.dataset.toggleBound === 'true') return;
  descContainer.dataset.toggleBound = 'true';

  const lineClamp = item.classList.contains('experience-item--current')
   ? EXPERIENCE_LINE_CLAMP_CURRENT
   : EXPERIENCE_LINE_CLAMP_DEFAULT;

  setupMobileDescriptionToggle(descContainer, descContainer, {
   lineClamp,
   toggleClass: 'experience-description-toggle',
  });
 });
}

function resolveExperienceDuration(item) {
 if (item?.startDate) {
  const computed = formatDuration(item.startDate, item.endDate || null);
  if (computed) return computed;
 }

 return item?.duration || '';
}

function escapeHtml(text) {
 if (!text) return '';
 const div = document.createElement('div');
 div.textContent = text;
 return div.innerHTML;
}
