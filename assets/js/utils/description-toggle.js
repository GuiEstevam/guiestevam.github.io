export const DESCRIPTION_MOBILE_MQ = '(max-width: 767px)';

/**
 * Expande/colapsa descrição no mobile com line-clamp.
 * @param {HTMLElement} descContainer - .experience-description
 * @param {HTMLElement} _toggleParent - mantido por compat (botão vai dentro do container)
 * @param {{ toggleClass?: string, lineClamp?: number }} [options]
 */
export function setupMobileDescriptionToggle(
 descContainer,
 _toggleParent,
 options = {}
) {
 const toggleClass = options.toggleClass ?? 'description-toggle';
 const lineClamp = options.lineClamp ?? 2;
 const mobileQuery = window.matchMedia(DESCRIPTION_MOBILE_MQ);
 const textEl = descContainer.querySelector('p');

 if (!textEl) return;

 const setToggleState = (toggleButton, isExpanded) => {
  toggleButton.setAttribute('aria-expanded', String(isExpanded));
  const toggleText = toggleButton.querySelector('.toggle-text');
  const toggleIcon = toggleButton.querySelector('.toggle-icon');
  if (toggleText) {
   toggleText.textContent = isExpanded ? 'Mostrar menos' : 'Mostrar mais';
  }
  if (toggleIcon) {
   toggleIcon.setAttribute(
    'name',
    isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'
   );
  }
 };

 const clearState = () => {
  descContainer.querySelector(`.${toggleClass}`)?.remove();
  descContainer.classList.remove('expanded', 'is-truncated');
  descContainer.style.removeProperty('--desc-line-clamp');
 };

 const syncToggle = () => {
  clearState();

  if (!mobileQuery.matches) {
   return;
  }

  descContainer.style.setProperty('--desc-line-clamp', String(lineClamp));
  descContainer.classList.add('is-truncated');

  // Força layout com clamp aplicado
  void textEl.offsetHeight;

  const needsToggle = textEl.scrollHeight > textEl.clientHeight + 1;
  if (!needsToggle) {
   clearState();
   return;
  }

  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.className = toggleClass;
  toggleButton.setAttribute('aria-label', 'Expandir ou colapsar descrição');
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.innerHTML = `
   <span class="toggle-text">Mostrar mais</span>
   <ion-icon name="chevron-down-outline" class="toggle-icon" aria-hidden="true"></ion-icon>
  `;

  toggleButton.addEventListener('click', () => {
   const isExpanded = descContainer.classList.contains('expanded');
   descContainer.classList.toggle('expanded', !isExpanded);
   setToggleState(toggleButton, !isExpanded);
  });

  descContainer.appendChild(toggleButton);
 };

 // Aguarda layout/fonte/reveal para medir com precisão
 const scheduleSync = () => {
  window.requestAnimationFrame(() => {
   window.requestAnimationFrame(syncToggle);
  });
 };

 scheduleSync();
 window.setTimeout(scheduleSync, 120);
 window.setTimeout(scheduleSync, 400);

 if (typeof mobileQuery.addEventListener === 'function') {
  mobileQuery.addEventListener('change', syncToggle);
 } else if (typeof mobileQuery.addListener === 'function') {
  mobileQuery.addListener(syncToggle);
 }
}
