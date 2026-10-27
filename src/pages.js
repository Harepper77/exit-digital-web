import config from './config.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const paths = {
  home: { es: '/es/', en: '/en/' },
};

// Una sola página de gracias para ambos idiomas: Netlify guarda una sola definición por
// nombre de formulario, y si cada idioma tuviera su destino, mostraría siempre el de uno.
export const thanksPath = '/gracias/';

// One-page: cada sección tiene un ancla por idioma.
export const anchors = {
  services: { es: 'servicios', en: 'services' },
  techniques: { es: 'tecnicas', en: 'techniques' },
  steps: { es: 'como-funciona', en: 'how-it-works' },
  about: { es: 'nosotros', en: 'about' },
  faq: { es: 'preguntas', en: 'faq' },
  quote: { es: 'cotiza', en: 'quote' },
};

export const anchorHref = (id, lang) => `${paths.home[lang]}#${anchors[id][lang]}`;

export const whatsappUrl = (text) =>
  `https://wa.me/${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

const ext = (href, cls, label) => `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;

const photo = (src, [w, h], alt, cls, extra = 'loading="lazy"') =>
  `<img class="${cls}" src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" ${extra} decoding="async">`;

// Los links que siguen en REEMPLAZAR no se muestran.
const payLinks = () => ['stripe', 'paypal', 'mercadopago']
  .filter((k) => config.payments[k] && !config.payments[k].includes('REEMPLAZAR'));

const hero = (lang, t) => `
  <section class="hero">
    ${photo(config.images.hero, config.images.heroSize, t.hero.alt, 'hero__img', `srcset="${config.images.hero} 1440w, ${config.images.hero2x} 2880w" sizes="100vw" fetchpriority="high"`)}
    <div class="container hero__inner">
      <p class="eyebrow">${t.hero.eyebrow}</p>
      <h1>${t.hero.title}</h1>
      <p class="lead">${t.hero.text}</p>
      <div class="actions">
        <a class="btn btn--primary" href="${anchorHref('quote', lang)}">${t.hero.quote}</a>
        <a class="btn btn--ghost" href="${anchorHref('services', lang)}">${t.hero.seeServices}</a>
      </div>
    </div>
  </section>`;

const services = (lang, t) => `
  <section class="section section--cream" id="${anchors.services[lang]}">
    <div class="container">
      <h2 class="section__title">${t.services.title}</h2>
      <div class="services">${t.services.items.map((s, i) => `
        <article class="service${i === t.services.items.length - 1 && i % 2 === 0 ? ' service--wide' : ''}">
          ${photo(config.images.services[i], config.images.servicesSize, s.name, 'service__img')}
          <div class="service__body">
            <h3>${s.name}</h3>
            <p>${s.text}</p>
            <ul class="bullets">${s.points.map((x) => `<li>${x}</li>`).join('')}</ul>
          </div>
          ${s.specs.length ? `<ul class="specs">${s.specs.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
        </article>`).join('')}
      </div>
    </div>
  </section>`;

const techniques = (lang, t) => `
  <section class="section" id="${anchors.techniques[lang]}">
    <div class="container">
      <h2 class="section__title">${t.services.compareTitle}</h2>
      <div class="table-wrap">
        <table class="table">
          <thead><tr>${t.services.compareHead.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
          <tbody>${t.services.compareRows.map((r) => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      <p class="note">${t.services.compareNote}</p>
      <div class="table-wrap">
        <table class="table table--files">
          <thead><tr><th scope="col" colspan="2">${t.services.filesTitle}</th></tr></thead>
          <tbody>${t.services.files.map((f) => `<tr><th scope="row">${f.title}</th><td>${f.text}</td></tr>`).join('')}</tbody>
        </table>
      </div>
      <p class="note">${t.services.filesNote}</p>
    </div>
  </section>`;

const steps = (lang, t) => `
  <section class="section section--cream" id="${anchors.steps[lang]}">
    <div class="container">
      <h2 class="section__title">${t.steps.title}</h2>
      <ol class="steps">${t.steps.items.map((s) => `<li><h3>${s.title}</h3><p>${s.text}</p></li>`).join('')}</ol>
    </div>
  </section>`;

const cta = (lang, t) => `
  <section class="cta-band">
    <div class="container cta-band__inner">
      <h2>${t.cta.title}</h2>
      <p>${t.cta.text}</p>
      <div class="actions">
        <a class="btn btn--primary" href="${anchorHref('quote', lang)}">${t.hero.quote}</a>
        ${ext(whatsappUrl(t.whatsapp.message), 'btn btn--ghost', t.whatsapp.label)}
      </div>
    </div>
  </section>`;

const about = (lang, t) => `
  <section class="section section--dark" id="${anchors.about[lang]}">
    <div class="container">
      <h2 class="section__title">${t.about.title}</h2>
      <div class="about">
        <div>
          <div class="prose">${t.about.story.map((p) => `<p>${p}</p>`).join('')}</div>
          <div class="values">${t.about.values.map((v, i) => `<article class="value value--${['cyan', 'magenta', 'yellow'][i % 3]}"><h3>${v.title}</h3><p>${v.text}</p></article>`).join('')}</div>
        </div>
        ${photo(config.images.about, config.images.aboutSize, t.about.photoAlt, 'about__img')}
      </div>
    </div>
  </section>`;

const faq = (lang, t) => `
  <section class="section" id="${anchors.faq[lang]}">
    <div class="container">
      <h2 class="section__title">${t.faq.title}</h2>
    </div>
    <div class="faq">${t.faq.items.map((f, i) => `
      <details${i === 0 ? ' open' : ''}><summary><span class="container">${f.q}</span></summary><div class="container"><p>${f.a}</p></div></details>`).join('')}
    </div>
  </section>`;

const options = (list, choose) => `<option value="">${choose}</option>${list.map((o) => `<option>${o}</option>`).join('')}`;

// Campo con etiqueta flotante sobre el borde (estilo del diseño).
const field = (id, label, control, required, cls = '') => `
  <div class="field${cls}">
    <label for="${id}">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
    ${control}
  </div>`;

const item = (n, t) => {
  const f = t.quote.fields;
  const id = (name) => `f-${name}-${n}`;
  // El número de partida va en la etiqueta (oculto a la vista): Netlify identifica los campos
  // por su etiqueta y fusionaría los de todas las partidas si fueran iguales.
  const label = (text) => `${text}<span class="sr-only"> · ${t.quote.itemLabel} <span class="item-n">${n}</span></span>`;
  const sel = (name, list) => `<select id="${id(name)}" name="${name}_${n}" required>${options(list, f.choose)}</select>`;
  return `
    <fieldset class="item" data-item="${n}"${n > 1 ? ' hidden disabled' : ''}>
      <legend>${t.quote.itemLabel} <span class="item-n">${n}</span></legend>
      <div class="form__grid">
        ${field(id('servicio'), label(f.service), sel('servicio', t.quote.serviceOptions), true)}
        ${field(id('producto'), label(f.product), sel('producto', t.quote.productOptions), true)}
        ${field(id('color'), label(f.color), sel('color', t.quote.colorOptions), true)}
        ${field(id('calidad'), label(f.quality), sel('calidad', t.quote.qualityOptions), true)}
        ${field(id('piezas'), label(f.quantity), `<input id="${id('piezas')}" name="piezas_${n}" type="number" min="1" inputmode="numeric" required>`, true)}
      </div>
      ${n > 1 ? `<button class="item-remove" type="button">${t.quote.removeItem} <span aria-hidden="true">×</span><span class="sr-only"> ${t.quote.itemLabel} <span class="item-n">${n}</span></span></button>` : ''}
    </fieldset>`;
};

const quote = (lang, t) => {
  const f = t.quote.fields;
  const links = payLinks();
  const items = Array.from({ length: config.quoteItems }, (_, i) => item(i + 1, t)).join('');
  return `
  <section class="section section--cream" id="${anchors.quote[lang]}">
    <div class="container">
      <h2 class="section__title">${t.quote.title}</h2>
      <p class="section__intro">${t.quote.intro}</p>
      <div class="quote">
        <form class="form card" name="cotizacion" method="POST" action="${thanksPath}" enctype="multipart/form-data" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="cotizacion">
          <input type="hidden" name="idioma" value="${lang}">
          <p class="hidden"><label>No llenar / Don't fill: <input name="bot-field"></label></p>
          <h3 class="form__title">${t.quote.contactTitle}</h3>
          <div class="form__grid">
            ${field('f-nombre', f.name, '<input id="f-nombre" name="nombre" autocomplete="name" required>', true)}
            ${field('f-correo', f.email, '<input id="f-correo" name="correo" type="email" autocomplete="email" required>', true)}
            ${field('f-telefono', f.phone, '<input id="f-telefono" name="telefono" type="tel" autocomplete="tel">', false)}
            ${field('f-pais', f.country, '<input id="f-pais" name="pais" autocomplete="country-name" required>', true)}
          </div>
          <h3 class="form__title">${t.quote.itemsTitle}</h3>
          <div class="items">${items}</div>
          <button class="btn btn--outline item-add" type="button" data-full="${esc(t.quote.itemsFull)}"><span aria-hidden="true">+</span> ${t.quote.addItem}</button>
          <div class="form__grid">
            ${field('f-fecha', f.date, '<input id="f-fecha" name="fecha" type="date" required>', true)}
          </div>
          ${field('f-descripcion', f.description, `<textarea id="f-descripcion" name="descripcion" rows="4" required placeholder="${esc(f.descriptionPlaceholder)}"></textarea>`, true)}
          ${field('f-archivo', f.file, `
            <div class="file">
              <input id="f-archivo" name="archivo" type="file" accept=".png,.jpg,.jpeg,.pdf,.ai,.cdr,.eps,.svg,.psd" data-max-mb="8" data-error="${esc(f.fileTooBig)}">
              <span class="file__button" aria-hidden="true">${f.fileButton}</span>
              <span class="file__name" data-none="${esc(f.fileNone)}">${f.fileNone}</span>
            </div>`, false, ' field--file')}
          <p class="hint">${f.fileHint}</p>
          <p class="hint">${t.quote.privacy}</p>
          <button class="btn btn--primary" type="submit">${t.quote.submit}</button>
        </form>
        <aside class="quote__aside">
          ${links.length ? `
          <div class="card panel">
            <h3>${t.quote.payTitle}</h3>
            <p>${t.quote.payText}</p>
            <div class="pay-buttons">${links.map((k) => `<a class="btn btn--block btn--${k}" data-pay="${k}" href="${config.payments[k]}" target="_blank" rel="noopener noreferrer">${t.pay[k]}</a>`).join('')}</div>
            <p class="hint">${t.quote.payNote}</p>
          </div>` : ''}
          <div class="card panel">
            <h3>${t.quote.waTitle}</h3>
            <p>${t.quote.waText}</p>
            ${ext(whatsappUrl(t.whatsapp.message), 'btn btn--block btn--whatsapp', t.whatsapp.label)}
          </div>
        </aside>
      </div>
    </div>
  </section>`;
};

export const pages = [
  {
    id: 'home',
    path: paths.home,
    body: (lang, t) => [hero, services, techniques, steps, cta, about, faq, quote].map((s) => s(lang, t)).join(''),
  },
];

// Página de gracias bilingüe (español primero).
export const thanksBody = (dict) => ['es', 'en'].map((lang) => {
  const t = dict[lang];
  return `
  <section class="hero hero--small"${lang === 'en' ? ' lang="en"' : ''}>
    <div class="container hero__inner">
      <h1>${t.thanks.heading}</h1>
      <p class="lead">${t.thanks.text}</p>
      <div class="actions">
        ${ext(whatsappUrl(t.whatsapp.message), 'btn btn--whatsapp', t.whatsapp.label)}
        <a class="btn btn--ghost" href="${paths.home[lang]}">${t.thanks.back}</a>
      </div>
    </div>
  </section>`;
}).join('');

// URLs de la versión con varias páginas → su sección en el one-page.
export const legacyRedirects = [
  ['/es/gracias/', thanksPath], ['/en/thanks/', thanksPath],
  ['/es/servicios/', anchorHref('services', 'es')], ['/en/services/', anchorHref('services', 'en')],
  ['/es/nosotros/', anchorHref('about', 'es')], ['/en/about/', anchorHref('about', 'en')],
  ['/es/cotiza/', anchorHref('quote', 'es')], ['/en/quote/', anchorHref('quote', 'en')],
  ['/es/contacto/', anchorHref('quote', 'es')], ['/en/contact/', anchorHref('quote', 'en')],
];
