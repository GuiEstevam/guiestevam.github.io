export const DESCRIPTION_MOBILE_MQ = '(max-width: 767px)';

/**
 * Expande/colapsa descrição no mobile quando o texto ultrapassa o limite de linhas.
 */
export function setupMobileDescriptionToggle(desc, descContainer, options = {}) {
 const lineClamp = options.lineClamp ?? 3;
 const toggleClass = options.toggleClass ?? 'description-toggle';
 const mobileQuery = window.matchMedia(DESCRIPTION_MOBILE_MQ);

 const getCollapsedHeight = () => {
  const styles = getComputedStyle(desc);
  const lineHeight = parseFloat(styles.lineHeight);
  const fontSize = parseFloat(styles.fontSize);
  const resolvedLineHeight = Number.isNaN(lineHeight)
   ? fontSize * 1.55
   : lineHeight;
  return Math.ceil(resolvedLineHeight * lineClamp);
 };

 const measureFullHeight = () => {
  desc.classList.add('is-truncated', 'expanded');
  const fullHeight = desc.scrollHeight;
  desc.classList.remove('expanded');
  return fullHeight;
 };

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

 const syncToggle = () => {
  const existingToggle = descContainer.querySelector(`.${toggleClass}`);
  if (existingToggle) {
   existingToggle.remove();
  }

  desc.classList.remove('expanded', 'is-truncated');
  desc.style.removeProperty('--desc-collapsed-height');
  desc.style.removeProperty('--desc-expanded-height');

  if (!mobileQuery.matches) {
   return;
  }

  desc.classList.add('is-truncated');
  const collapsedHeight = getCollapsedHeight();
  const fullHeight = measureFullHeight();

  if (fullHeight <= collapsedHeight + 2) {
   desc.classList.remove('is-truncated');
   return;
  }

  desc.style.setProperty('--desc-collapsed-height', `${collapsedHeight}px`);
  desc.style.setProperty('--desc-expanded-height', `${fullHeight}px`);

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
   const isExpanded = desc.classList.contains('expanded');
   if (isExpanded) {
    desc.classList.remove('expanded');
    setToggleState(toggleButton, false);
    return;
   }

   desc.style.setProperty('--desc-expanded-height', `${desc.scrollHeight}px`);
   desc.classList.add('expanded');
   setToggleState(toggleButton, true);
  });

  descContainer.appendChild(toggleButton);
 };

 syncToggle();

 if (typeof mobileQuery.addEventListener === 'function') {
  mobileQuery.addEventListener('change', syncToggle);
 } else if (typeof mobileQuery.addListener === 'function') {
  mobileQuery.addListener(syncToggle);
 }
}
