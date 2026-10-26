import config from './config.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const paths = {
  home: { es: '/es/', en: '/en/' },
  services: { es: '/es/servicios/', en: '/en/services/' },
  about: { es: '/es/nosotros/', en: '/en/about/' },
  quote: { es: '/es/cotiza/', en: '/en/quote/' },
  contact: { es: '/es/contacto/', en: '/en/contact/' },
  thanks: { es: '/es/gracias/', en: '/en/thanks/' },
};

export const whatsappUrl = (text) =>
  `https://wa.me/${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

const cta = (lang, t) => `
  <section class="cta-band">
    <div class="container cta-band__inner">
      <h2>${t.common.ctaTitle}</h2>
      <p>${t.common.ctaText}</p>
      <div class="actions">
        <a class="btn btn--primary" href="${paths.quote[lang]}">${t.common.quoteNow}</a>
        <a class="btn btn--ghost" href="${whatsappUrl(t.whatsapp.message)}" target="_blank" rel="noopener noreferrer">${t.whatsapp.label}</a>
      </div>
    </div>
  </section>`;

const payButtons = (t) => {
  const p = config.payments;
  return `
    <div class="pay-buttons">
      <a class="btn btn--pay" data-pay="stripe" href="${p.stripe}" target="_blank" rel="noopener noreferrer">${t.pay.stripe}</a>
      <a class="btn btn--pay" data-pay="paypal" href="${p.paypal}" target="_blank" rel="noopener noreferrer">${t.pay.paypal}</a>
      ${p.mercadopago ? `<a class="btn btn--pay" data-pay="mercadopago" href="${p.mercadopago}" target="_blank" rel="noopener noreferrer">${t.pay.mercadopago}</a>` : ''}
    </div>`;
};

const photo = (src, [w, h], alt, cls, eager) =>
  `<img class="${cls}" src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

const serviceCards = (items, full) => items.map((s, i) => `
  <article class="card card--${['cyan', 'magenta', 'yellow', 'ink'][i % 4]}${full ? ' card--media' : ''}">
    ${full ? photo(config.images.services[i], config.images.servicesSize, s.name, 'card__img') : ''}
    <h3>${s.name}</h3>
    <p>${s.text}</p>
    ${full ? `<ul class="ticks">${s.points.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
    ${full && s.specs.length ? `<ul class="specs">${s.specs.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
  </article>`).join('');

const field = (name, label, input, required) => `
  <div class="field">
    <label for="f-${name}">${label}${required ? ' <span aria-hidden="true">*</span>' : ''}</label>
    ${input}
  </div>`;

export const pages = [
  {
    id: 'home',
    path: paths.home,
    body: (lang, t) => `
      <section class="hero">
        <div class="container hero__inner hero__inner--media">
          <div class="hero__text">
          <p class="eyebrow">${t.home.eyebrow}</p>
          <h1>${t.home.heroTitle}</h1>
          <p class="lead">${t.home.heroText}</p>
          <div class="actions">
            <a class="btn btn--primary" href="${paths.quote[lang]}">${t.common.quoteNow}</a>
            <a class="btn btn--ghost" href="${paths.services[lang]}">${t.home.seeServices}</a>
          </div>
          <ul class="badges">${t.home.badges.map((b) => `<li>${b}</li>`).join('')}</ul>
          </div>
          <div class="hero__media">${photo(config.images.hero, config.images.heroSize, t.home.heroAlt, 'hero__img', true)}</div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <h2 class="section__title">${t.home.servicesTitle}</h2>
          <div class="grid grid--4">${serviceCards(t.services.items, false)}</div>
          <p class="center"><a class="link-arrow" href="${paths.services[lang]}">${t.home.seeServices} →</a></p>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container">
          <h2 class="section__title">${t.home.stepsTitle}</h2>
          <ol class="steps">${t.home.steps.map((s) => `<li><h3>${s.title}</h3><p>${s.text}</p></li>`).join('')}</ol>
        </div>
      </section>
      <section class="section">
        <div class="container split">
          <div>
            <h2>${t.home.worldTitle}</h2>
            <p>${t.home.worldText}</p>
          </div>
          <ul class="ticks ticks--big">${t.home.worldPoints.map((x) => `<li>${x}</li>`).join('')}</ul>
        </div>
      </section>
      ${cta(lang, t)}`,
  },
  {
    id: 'services',
    path: paths.services,
    body: (lang, t) => `
      <header class="page-head"><div class="container"><h1>${t.services.heading}</h1><p class="lead">${t.services.intro}</p></div></header>
      <section class="section">
        <div class="container grid grid--2">${serviceCards(t.services.items, true)}</div>
      </section>
      <section class="section section--alt">
        <div class="container">
          <h2 class="section__title">${t.services.compareTitle}</h2>
          <div class="table-wrap">
            <table>
              <thead><tr>${t.services.compareHead.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
              <tbody>${t.services.compareRows.map((r) => `<tr><th scope="row">${r[0]}</th>${r.slice(1).map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          </div>
          <p class="note">${t.services.compareNote}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <h2 class="section__title">${t.services.filesTitle}</h2>
          <div class="grid grid--3">${t.services.files.map((f) => `<article class="card card--ink"><h3>${f.title}</h3><p>${f.text}</p></article>`).join('')}</div>
          <p class="note center files-note">${t.services.filesNote}</p>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container">
          <h2 class="section__title">${t.services.faqTitle}</h2>
          <div class="faq">${t.services.faq.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</div>
        </div>
      </section>
      ${cta(lang, t)}`,
  },
  {
    id: 'about',
    path: paths.about,
    body: (lang, t) => `
      <header class="page-head"><div class="container"><h1>${t.about.heading}</h1><p class="lead">${t.about.intro}</p></div></header>
      <section class="section">
        <div class="container split">
          <div class="prose">${t.about.story.map((p) => `<p>${p}</p>`).join('')}</div>
          <div class="about__side">
            ${photo(config.images.about, config.images.aboutSize, t.about.photoAlt, 'about__img')}
            <dl class="stats">${t.about.stats.map((s) => `<div><dt>${s.label}</dt><dd>${s.value}</dd></div>`).join('')}</dl>
          </div>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container">
          <h2 class="section__title">${t.about.valuesTitle}</h2>
          <div class="grid grid--3">${t.about.values.map((v, i) => `<article class="card card--${['cyan', 'magenta', 'yellow'][i % 3]}"><h3>${v.title}</h3><p>${v.text}</p></article>`).join('')}</div>
        </div>
      </section>
      ${cta(lang, t)}`,
  },
  {
    id: 'quote',
    path: paths.quote,
    body: (lang, t) => {
      const f = t.quote.fields;
      const opts = (list) => list.map((o) => `<option>${o}</option>`).join('');
      return `
      <header class="page-head"><div class="container"><h1>${t.quote.heading}</h1><p class="lead">${t.quote.intro}</p></div></header>
      <section class="section">
        <div class="container quote">
          <form class="form" name="cotizacion" method="POST" action="${paths.thanks[lang]}" enctype="multipart/form-data" data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="cotizacion">
            <input type="hidden" name="idioma" value="${lang}">
            <p class="hidden"><label>No llenar / Don't fill: <input name="bot-field"></label></p>
            <div class="form__grid">
              ${field('nombre', f.name, '<input id="f-nombre" name="nombre" autocomplete="name" required>', true)}
              ${field('correo', f.email, '<input id="f-correo" name="correo" type="email" autocomplete="email" required>', true)}
              ${field('telefono', f.phone, '<input id="f-telefono" name="telefono" type="tel" autocomplete="tel">', false)}
              ${field('pais', f.country, `<input id="f-pais" name="pais" autocomplete="country-name" required>`, true)}
              ${field('servicio', f.service, `<select id="f-servicio" name="servicio" required><option value="">${f.choose}</option>${opts(t.quote.serviceOptions)}</select>`, true)}
              ${field('prenda', f.garment, `<select id="f-prenda" name="prenda"><option value="">${f.choose}</option>${opts(t.quote.garmentOptions)}</select>`, false)}
              ${field('cantidad', f.quantity, '<input id="f-cantidad" name="cantidad" type="number" min="1" inputmode="numeric" required>', true)}
              ${field('fecha', f.date, '<input id="f-fecha" name="fecha" type="date">', false)}
            </div>
            ${field('archivo', f.file, `<input id="f-archivo" name="archivo" type="file" accept=".png,.jpg,.jpeg,.pdf,.ai,.cdr,.eps,.svg,.psd" data-max-mb="8" data-error="${esc(f.fileTooBig)}"><small class="hint">${f.fileHint}</small>`, false)}
            ${field('comentarios', f.comments, `<textarea id="f-comentarios" name="comentarios" rows="5" required placeholder="${esc(f.commentsPlaceholder)}"></textarea>`, true)}
            <p class="note">${t.quote.privacy}</p>
            <button class="btn btn--primary" type="submit">${t.quote.submit}</button>
          </form>
          <aside class="quote__aside">
            <div class="panel">
              <h2>${t.quote.payTitle}</h2>
              <p>${t.quote.payText}</p>
              ${payButtons(t)}
              <p class="note">${t.quote.payNote}</p>
            </div>
            <div class="panel panel--whatsapp">
              <h2>${t.quote.waTitle}</h2>
              <p>${t.quote.waText}</p>
              <a class="btn btn--whatsapp" href="${whatsappUrl(t.whatsapp.message)}" target="_blank" rel="noopener noreferrer">${t.whatsapp.label}</a>
            </div>
          </aside>
        </div>
      </section>`;
    },
  },
  {
    id: 'contact',
    path: paths.contact,
    body: (lang, t) => `
      <header class="page-head"><div class="container"><h1>${t.contact.heading}</h1><p class="lead">${t.contact.intro}</p></div></header>
      <section class="section">
        <div class="container grid grid--3">
          <article class="card card--cyan">
            <h2>WhatsApp</h2>
            <p>${t.contact.waText}</p>
            <a class="btn btn--whatsapp" href="${whatsappUrl(t.whatsapp.message)}" target="_blank" rel="noopener noreferrer">${esc(config.whatsapp)}</a>
          </article>
          <article class="card card--magenta">
            <h2>${t.contact.emailTitle}</h2>
            <p>${t.contact.emailText}</p>
            <a class="btn btn--ghost" href="mailto:${config.email}">${config.email}</a>
          </article>
          <article class="card card--yellow">
            <h2>${t.contact.whereTitle}</h2>
            <p>${config.city[lang]}</p>
            <p>${config.hours[lang]}</p>
            <p class="note">${t.contact.shipping}</p>
          </article>
        </div>
      </section>
      <section class="section section--alt">
        <div class="container panel panel--wide">
          <h2>${t.contact.payTitle}</h2>
          <p>${t.contact.payText}</p>
          ${payButtons(t)}
        </div>
      </section>
      ${cta(lang, t)}`,
  },
  {
    id: 'thanks',
    path: paths.thanks,
    noindex: true,
    body: (lang, t) => `
      <section class="hero hero--small">
        <div class="container hero__inner">
          <h1>${t.thanks.heading}</h1>
          <p class="lead">${t.thanks.text}</p>
          <div class="actions">
            <a class="btn btn--whatsapp" href="${whatsappUrl(t.whatsapp.message)}" target="_blank" rel="noopener noreferrer">${t.whatsapp.label}</a>
            <a class="btn btn--ghost" href="${paths.home[lang]}">${t.thanks.back}</a>
          </div>
        </div>
      </section>`,
  },
];
