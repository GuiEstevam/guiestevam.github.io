/**
 * Ícones Font Awesome para tags de stack
 */

const STACK_ICON_MAP = {
 PHP: 'fab fa-php',
 Laravel: 'fab fa-laravel',
 MySQL: 'fas fa-database',
 Blade: 'fas fa-layer-group',
 HTML: 'fab fa-html5',
 CSS: 'fab fa-css3-alt',
 JavaScript: 'fab fa-js',
 'Vue.js': 'fab fa-vuejs',
 Vue: 'fab fa-vuejs',
 Python: 'fab fa-python',
 Java: 'fab fa-java',
 Livewire: 'fas fa-bolt',
 TailwindCSS: 'fab fa-css3-alt',
 Docker: 'fab fa-docker',
 SQL: 'fas fa-database',
 Git: 'fab fa-git-alt',
 Vite: 'fas fa-bolt',
};

const LANGUAGE_ICON_MAP = {
 JavaScript: 'fab fa-js',
 TypeScript: 'fab fa-js-square',
 Python: 'fab fa-python',
 Java: 'fab fa-java',
 'C++': 'fab fa-cuttlefish',
 C: 'fas fa-code',
 'C#': 'fab fa-microsoft',
 PHP: 'fab fa-php',
 Ruby: 'fas fa-gem',
 Go: 'fab fa-golang',
 Rust: 'fas fa-cog',
 Swift: 'fab fa-swift',
 Kotlin: 'fas fa-code',
 HTML: 'fab fa-html5',
 CSS: 'fab fa-css3-alt',
 SCSS: 'fab fa-sass',
 SASS: 'fab fa-sass',
 Vue: 'fab fa-vuejs',
 React: 'fab fa-react',
 Angular: 'fab fa-angular',
 Dart: 'fab fa-dart',
 Shell: 'fas fa-terminal',
 PowerShell: 'fab fa-microsoft',
 Lua: 'fas fa-code',
 Perl: 'fab fa-perl',
 R: 'fas fa-chart-line',
 MATLAB: 'fas fa-calculator',
 Scala: 'fas fa-code',
 Clojure: 'fas fa-code',
 Haskell: 'fas fa-code',
 Elm: 'fab fa-elm',
 Erlang: 'fas fa-code',
 Elixir: 'fas fa-code',
 OCaml: 'fas fa-code',
 FSharp: 'fab fa-microsoft',
 ObjectiveC: 'fab fa-apple',
 CoffeeScript: 'fas fa-coffee',
 TeX: 'fas fa-file-alt',
 Markdown: 'fab fa-markdown',
 Laravel: 'fab fa-laravel',
 Blade: 'fas fa-layer-group',
 SQL: 'fas fa-database',
 Vite: 'fas fa-bolt',
 Docker: 'fab fa-docker',
};

/**
 * @param {string} tech
 * @returns {string}
 */
export function getStackIcon(tech) {
 if (!tech || typeof tech !== 'string') return 'fas fa-code';

 const label = tech.trim();
 if (STACK_ICON_MAP[label]) return STACK_ICON_MAP[label];
 if (LANGUAGE_ICON_MAP[label]) return LANGUAGE_ICON_MAP[label];

 const alias = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  html: 'HTML',
  css: 'CSS',
  php: 'PHP',
  laravel: 'Laravel',
  mysql: 'MySQL',
  vue: 'Vue.js',
  'vue.js': 'Vue.js',
  livewire: 'Livewire',
  tailwindcss: 'TailwindCSS',
  docker: 'Docker',
 };

 const normalized = label.toLowerCase();
 const resolved = alias[normalized] || label;
 return STACK_ICON_MAP[resolved] || LANGUAGE_ICON_MAP[resolved] || 'fas fa-code';
}
