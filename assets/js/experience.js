/**
 * Trajetória — linha do tempo de experiência + formação (com a publicação dentro da pós)
 * Sem animação de scroll: o conteúdo aparece assim que é montado.
 */

import { EXPERIENCE_ITEMS } from './data/experience.js';
import { EDUCATION_ITEMS } from './data/education.js';
import { formatDuration } from './utils/formatters.js';

export function renderExperienceTimeline() {
 const work = document.getElementById('experience-timeline');
 if (work) {
  work.replaceChildren(...EXPERIENCE_ITEMS.map(createExperienceItem));
 }

 const study = document.getElementById('education-list');
 if (study) {
  study.replaceChildren(...EDUCATION_ITEMS.map(createEducationItem));
 }
}

function el(tag, className, text) {
 const node = document.createElement(tag);
 if (className) node.className = className;
 if (text != null) node.textContent = text;
 return node;
}

function createMarker(iconName) {
 const marker = el('span', 'journey-marker');
 marker.setAttribute('aria-hidden', 'true');
 const icon = document.createElement('ion-icon');
 icon.setAttribute('name', iconName);
 marker.appendChild(icon);
 return marker;
}

function createMeta(period, extra, current) {
 const meta = el('p', 'journey-meta');
 meta.appendChild(el('span', 'journey-period', period));
 if (extra) meta.appendChild(el('span', 'journey-extra', extra));
 if (current) meta.appendChild(el('span', 'journey-badge', 'Atual'));
 return meta;
}

function createShell(item, iconName) {
 const li = el('li', 'journey-item');
 if (item.current) li.classList.add('journey-item--current');
 if (item.compact) li.classList.add('journey-item--compact');
 li.appendChild(createMarker(iconName));

 const card = el('div', 'journey-card');
 li.appendChild(card);
 return { li, card };
}

function createExperienceItem(item) {
 const { li, card } = createShell(item, 'briefcase-outline');

 const duration = item.startDate ? formatDuration(item.startDate, item.endDate || null) : '';
 card.appendChild(createMeta(item.period, duration, item.current));
 card.appendChild(el('h4', 'journey-title', item.title));
 card.appendChild(el('p', 'journey-org', item.company));

 if (item.description && !item.compact) {
  card.appendChild(el('p', 'journey-text', item.description));
 }

 if (item.link) {
  const a = el('a', 'journey-link');
  a.href = item.link.href;
  a.appendChild(el('span', null, item.link.label));
  const icon = el('i', 'icon solid fa-arrow-up');
  icon.setAttribute('aria-hidden', 'true');
  a.appendChild(icon);
  card.appendChild(a);
 }

 return li;
}

function createEducationItem(item) {
 const { li, card } = createShell(item, item.current ? 'school-outline' : 'ribbon-outline');

 card.appendChild(createMeta(item.period, item.current ? '' : item.status, item.current));
 card.appendChild(el('h4', 'journey-title', item.title));
 card.appendChild(el('p', 'journey-org', item.institution));

 if (item.publication) {
  card.appendChild(createPublication(item.publication));
 }

 return li;
}

function createPublication(pub) {
 const a = el('a', 'journey-publication');
 a.href = pub.href;
 a.target = '_blank';
 a.rel = 'noopener noreferrer';

 const iconWrap = el('span', 'journey-publication-icon');
 iconWrap.setAttribute('aria-hidden', 'true');
 const doc = document.createElement('ion-icon');
 doc.setAttribute('name', 'document-text-outline');
 iconWrap.appendChild(doc);
 a.appendChild(iconWrap);

 const body = el('span', 'journey-publication-body');
 body.appendChild(el('span', 'journey-publication-kind', `${pub.kind} · ${pub.venue}`));
 body.appendChild(el('span', 'journey-publication-title', pub.title));

 const cta = el('span', 'journey-publication-cta', 'Ler artigo');
 const icon = el('i', 'icon solid fa-external-link-alt');
 icon.setAttribute('aria-hidden', 'true');
 cta.appendChild(icon);
 body.appendChild(cta);
 a.appendChild(body);

 a.setAttribute('aria-label', `Ler o artigo "${pub.title}" (abre em nova aba)`);
 return a;
}
