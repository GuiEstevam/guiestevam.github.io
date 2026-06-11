import { setupMobileDescriptionToggle } from './utils/description-toggle.js';

const EXPERIENCE_LINE_CLAMP_CURRENT = 3;
const EXPERIENCE_LINE_CLAMP_DEFAULT = 2;

function initExperienceDescriptions() {
 const items = document.querySelectorAll('#experiencia .experience-item');

 items.forEach((item) => {
  const desc = item.querySelector('.experience-description');
  const body = item.querySelector('.experience-card');
  if (!desc || !body) {
   return;
  }

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

if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initExperienceDescriptions);
} else {
 initExperienceDescriptions();
}
