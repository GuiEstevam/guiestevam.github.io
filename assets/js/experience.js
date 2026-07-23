/**
 * Timeline de experiência profissional — render + toggle mobile
 */

import { EXPERIENCE_ITEMS } from './data/experience.js';
import { getStackIcon } from './utils/stack-icons.js';
import { setupMobileDescriptionToggle } from './utils/description-toggle.js';

const EXPERIENCE_LINE_CLAMP_CURRENT = 3;
const EXPERIENCE_LINE_CLAMP_DEFAULT = 2;

export function renderExperienceTimeline() {
 const timeline = document.getElementById('experience-timeline');
 if (!timeline) return;

 timeline.innerHTML = '';

 EXPERIENCE_ITEMS.forEach((item, index) => {
  timeline.appendChild(createExperienceItem(item, index));
 });

 initExperienceDescriptions();

 requestAnimationFrame(() => {
  if (window.observeNewElements) {
   window.observeNewElements();
  }
 });
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
 duration.textContent = item.duration;

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

function initExperienceDescriptions() {
 const items = document.querySelectorAll('#experiencia .experience-item');

 items.forEach((item) => {
  const desc = item.querySelector('.experience-description p');
  const body = item.querySelector('.experience-card');
  if (!desc || !body) return;

  const lineClamp = item.classList.contains('experience-item--current')
   ? EXPERIENCE_LINE_CLAMP_CURRENT
   : EXPERIENCE_LINE_CLAMP_DEFAULT;

  requestAnimationFrame(() => {
   requestAnimationFrame(() => {
    setupMobileDescriptionToggle(desc, body, {
     lineClamp,
     toggleClass: 'experience-description-toggle',
    });
   });
  });
 });
}

function escapeHtml(text) {
 if (!text) return '';
 const div = document.createElement('div');
 div.textContent = text;
 return div.innerHTML;
}
