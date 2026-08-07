/**
 * Dark mode fixo — garante a classe dark-mode antes da pintura.
 * Os tokens de light mode permanecem no CSS caso um toggle volte no futuro.
 */

document.documentElement.classList.add('dark-mode');

if (document.body) {
  document.body.classList.add('dark-mode');
} else {
  document.addEventListener(
    'DOMContentLoaded',
    () => document.body.classList.add('dark-mode'),
    { once: true }
  );
}
