# Portfólio — Guilherme Estevam

Portfólio pessoal de **Guilherme Estevam**, Desenvolvedor Full Stack (Laravel e Vue.js), publicado em [guiestevam.me](https://guiestevam.me/).

## Stack

- **HTML5 + CSS3 + JavaScript (ES6+)** — sem frameworks de UI
- **Vite 5** — dev server e build
- **Font Awesome + Ionicons** — ícones
- **GitHub API** — projetos open source carregados dinamicamente (com fallback local)
- **GitHub Pages** — hospedagem (deploy via GitHub Actions)

## Como rodar

```bash
npm install
npm run dev      # dev server em http://localhost:3000
npm run build    # build de produção em dist/
npm run preview  # preview do build
```

## Estrutura

```
├── index.html              # Página única (todas as seções)
├── assets/
│   ├── css/                # Estilos (base, custom, dev-theme, toast, about)
│   ├── js/                 # Módulos ES6 (entry: app.js)
│   │   ├── data/           # Dados: projetos, métricas, experiência, formação
│   │   ├── services/       # Integração GitHub API (com cache)
│   │   └── utils/          # Utilitários (formatters, stack-icons, ...)
│   └── sass/               # Fonte SASS do template original (legado)
├── public/                 # Assets estáticos copiados como estão para o build
│   ├── images/             # Imagens web (WebP otimizado)
│   ├── curriculo-*.pdf     # Currículo para download
│   ├── CNAME               # Domínio customizado do Pages
│   ├── robots.txt
│   └── sitemap.xml
├── images-src/             # Fontes das imagens (PNG/JPG originais, fora do deploy)
└── scripts/
    └── convert-project-images.py  # Converte images-src/ → public/images/ (WebP)
```

## Imagens de projetos

Screenshots dos projetos ficam em `images-src/` (fonte) e são convertidos para WebP 1280×800 em `public/images/`:

```bash
python scripts/convert-project-images.py
```

Requer Python com Pillow (`pip install Pillow`). Fontes menores que o alvo são mantidas na resolução nativa (sem corte nem upscale).

## Deploy

O deploy é automático via GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)): push na branch `master` → `npm run build` → publica `dist/` no GitHub Pages.

> Nas configurações do repositório, **Settings → Pages → Source** deve estar como **GitHub Actions**.

## Licença

Código próprio sob MIT. O layout parte do template [Editorial (HTML5 UP)](https://html5up.net/editorial), sob [CCA 3.0](LICENSE.txt).
