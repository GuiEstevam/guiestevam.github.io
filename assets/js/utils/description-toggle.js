export const DESCRIPTION_MOBILE_MQ = '(max-width: 767px)';

/**
 * Expande/colapsa descrição no mobile quando o texto ultrapassa o limite de linhas.
 */
export function setupMobileDescriptionToggle(desc, descContainer, options = {}) {
 const toggleClass = options.toggleClass ?? 'description-toggle';
 const mobileQuery = window.matchMedia(DESCRIPTION_MOBILE_MQ);

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

  // Limpar estados prévios
  desc.classList.remove('expanded', 'is-truncated');
  desc.style.removeProperty('--desc-collapsed-height');
  desc.style.removeProperty('--desc-expanded-height');

  if (!mobileQuery.matches) {
   return;
  }

  // Ativar truncamento temporário para medição
  desc.classList.add('is-truncated');
  
  // Leitura única de layout (evitando alternar classes/estilos de forma cíclica)
  const collapsedHeight = desc.clientHeight;
  const fullHeight = desc.scrollHeight;

  // Se o conteúdo cabe sem truncar (threshold de 4px para flexibilidade)
  if (fullHeight <= collapsedHeight + 4) {
   desc.classList.remove('is-truncated');
   return;
  }

  // Definir variável apenas para a altura colapsada medida de forma limpa
  desc.style.setProperty('--desc-collapsed-height', `${collapsedHeight}px`);

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
   } else {
    // Definir altura expandida dinamicamente apenas no clique (lazy measurement)
    desc.style.setProperty('--desc-expanded-height', `${desc.scrollHeight}px`);
    desc.classList.add('expanded');
    setToggleState(toggleButton, true);
   }
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

