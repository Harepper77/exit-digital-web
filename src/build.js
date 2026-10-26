import { mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import config from './config.js';
import es from './i18n/es.js';
import en from './i18n/en.js';
import { pages, paths, whatsappUrl } from './pages.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dict = { es, en };
const other = { es: 'en', en: 'es' };
const navIds = ['home', 'services', 'about', 'quote', 'contact'];
const year = new Date().getFullYear();

const logo = (lang) => `
  <a class="logo" href="${paths.home[lang]}" aria-label="${config.brand}">
    <svg class="logo__mark" viewBox="0 0 36 36" aria-hidden="true"><circle cx="12" cy="13" r="9" fill="var(--cyan)"/><circle cx="24" cy="13" r="9" fill="var(--magenta)"/><circle cx="18" cy="23" r="9" fill="var(--yellow)"/></svg>
    <span class="logo__text">Exit<span>-Digital</span></span>
  </a>`;

const waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" width="28" height="28"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>';

function layout(page, lang) {
  const t = dict[lang];
  const meta = t[page.id];
  const url = (l) => `${config.siteUrl}${page.path[l]}`;
  const nav = navIds.map((id) => {
    const current = id === page.id ? ' aria-current="page"' : '';
    const cls = id === 'quote' ? ' class="nav__cta"' : '';
    return `<li><a${cls} href="${paths[id][lang]}"${current}>${t.nav[id]}</a></li>`;
  }).join('');

  return `<!doctype html>
<html lang="${lang === 'es' ? 'es-MX' : 'en'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${meta.title} · ${config.brand}</title>
  <meta name="description" content="${meta.description}">
  ${page.noindex ? '<meta name="robots" content="noindex">' : ''}
  <link rel="canonical" href="${url(lang)}">
  <link rel="alternate" hreflang="es" href="${url('es')}">
  <link rel="alternate" hreflang="en" href="${url('en')}">
  <link rel="alternate" hreflang="x-default" href="${url('es')}">
  <meta property="og:title" content="${meta.title} · ${config.brand}">
  <meta property="og:description" content="${meta.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url(lang)}">
  <meta property="og:locale" content="${lang === 'es' ? 'es_MX' : 'en_US'}">
  <meta name="theme-color" content="#14121f">
  <link rel="icon" href="/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&display=swap">
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/main.js" defer></script>
</head>
<body>
  <a class="skip" href="#main">${t.nav.skip}</a>
  <header class="site-header">
    <div class="container site-header__inner">
      ${logo(lang)}
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="nav-toggle__bars" aria-hidden="true"></span><span class="sr-only">${t.nav.menu}</span>
      </button>
      <nav id="site-nav" class="nav" aria-label="${t.nav.menu}">
        <ul>${nav}</ul>
        <a class="lang-switch" href="${page.path[other[lang]]}" hreflang="${other[lang]}" lang="${other[lang]}" aria-label="${t.nav.switchAria}">${t.nav.switchLabel}</a>
      </nav>
    </div>
  </header>
  <main id="main">
    ${page.body(lang, t)}
  </main>
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div>
        ${logo(lang)}
        <p>${t.footer.tagline}</p>
      </div>
      <ul class="site-footer__nav">${navIds.map((id) => `<li><a href="${paths[id][lang]}">${t.nav[id]}</a></li>`).join('')}</ul>
      <div>
        <p><a href="mailto:${config.email}">${config.email}</a></p>
        <p>${config.city[lang]}</p>
        <p>${t.footer.payments}</p>
      </div>
    </div>
    <p class="container site-footer__legal">© ${config.since}–${year} ${config.brand}. ${t.footer.rights}</p>
  </footer>
  <a class="wa-float" href="${whatsappUrl(t.whatsapp.message)}" target="_blank" rel="noopener noreferrer" aria-label="${t.whatsapp.label}">${waIcon}</a>
</body>
</html>
`;
}

function write(out, urlPath, html) {
  const dir = join(out, urlPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

export function build(out = join(root, 'dist')) {
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(join(root, 'public'), out, { recursive: true });

  for (const page of pages) {
    for (const lang of ['es', 'en']) write(out, page.path[lang], layout(page, lang));
  }

  writeFileSync(join(out, 'index.html'), `<!doctype html>
<html lang="es-MX"><head><meta charset="utf-8"><title>${config.brand}</title>
<meta http-equiv="refresh" content="0; url=/es/"><link rel="canonical" href="${config.siteUrl}/es/"></head>
<body><a href="/es/">Español</a> · <a href="/en/">English</a></body></html>
`);

  const notFound = { id: 'notFound', path: { es: '/404.html', en: '/en/' }, noindex: true, body: (lang, t) => `
    <section class="hero hero--small"><div class="container hero__inner">
      <h1>404 · ${t.notFound.title}</h1><p class="lead">${t.notFound.text} / ${en.notFound.text}</p>
      <div class="actions"><a class="btn btn--primary" href="/es/">${t.notFound.back}</a><a class="btn btn--ghost" href="/en/">${en.notFound.back}</a></div>
    </div></section>` };
  writeFileSync(join(out, '404.html'), layout(notFound, 'es'));

  // Netlify: idioma del navegador en la raíz; español por defecto.
  writeFileSync(join(out, '_redirects'), '/  /en/  302!  Language=en\n/  /es/  302!\n');
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(`Sitio generado en ${build()}`);
}
