import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from '../src/build.js';
import { pages, anchors } from '../src/pages.js';
import es from '../src/i18n/es.js';
import en from '../src/i18n/en.js';
import config from '../src/config.js';

let out;
const read = (p) => readFileSync(join(out, p), 'utf8');
const fileFor = (url) => join(url.replace(/^\//, ''), url.endsWith('/') ? 'index.html' : '');
const home = (lang) => read(fileFor(pages.find((p) => p.id === 'home').path[lang]));
const placeholder = (url) => url.includes('REEMPLAZAR');

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function keys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  ).sort();
}

before(() => {
  out = mkdtempSync(join(tmpdir(), 'exit-digital-'));
  build(out);
});

test('es and en dictionaries have the same keys', () => {
  assert.deepEqual(keys(es), keys(en));
  for (const list of ['serviceOptions', 'productOptions', 'colorOptions', 'qualityOptions']) {
    assert.equal(es.quote[list].length, en.quote[list].length, list);
  }
});

test('every page is generated in both languages', () => {
  for (const page of pages) {
    for (const lang of ['es', 'en']) {
      assert.ok(existsSync(join(out, fileFor(page.path[lang]))), `${lang} ${page.id}`);
    }
  }
});

test('pages declare their language and alternates', () => {
  for (const page of pages) {
    for (const lang of ['es', 'en']) {
      const html = read(fileFor(page.path[lang]));
      assert.match(html, new RegExp(`<html lang="${lang}`));
      assert.match(html, new RegExp(`hreflang="es" href="[^"]*${page.path.es}"`));
      assert.match(html, new RegExp(`hreflang="en" href="[^"]*${page.path.en}"`));
      assert.match(html, /hreflang="x-default"/);
    }
  }
});

test('language switch points to the equivalent page', () => {
  for (const page of pages) {
    const esHtml = read(fileFor(page.path.es));
    assert.match(esHtml, new RegExp(`class="lang-switch"[^>]*href="${page.path.en}"`));
  }
});

test('one-page: every nav anchor targets a section on the home page', () => {
  for (const lang of ['es', 'en']) {
    const html = home(lang);
    for (const id of ['services', 'about', 'faq', 'quote']) {
      const anchor = anchors[id][lang];
      assert.match(html, new RegExp(`<section[^>]*id="${anchor}"`), `${lang} #${anchor}`);
      assert.match(html, new RegExp(`class="nav"[\\s\\S]*href="/${lang}/#${anchor}"`), `nav ${lang} #${anchor}`);
    }
  }
});

test('section order follows the design', () => {
  const html = home('es');
  const order = ['servicios', 'tecnicas', 'como-funciona', 'nosotros', 'preguntas', 'cotiza'].map((id) => html.indexOf(`id="${id}"`));
  assert.ok(order.every((pos) => pos > 0), JSON.stringify(order));
  assert.deepEqual([...order].sort((a, b) => a - b), order);
});

test('all internal links resolve to generated files', () => {
  const html = walk(out).filter((f) => f.endsWith('.html'));
  for (const file of html) {
    for (const [, href] of readFileSync(file, 'utf8').matchAll(/(?:href|src|action)="(\/[^"#?]*)/g)) {
      assert.ok(existsSync(join(out, fileFor(href))), `${href} linked from ${file}`);
    }
  }
});

test('legacy section URLs redirect to their anchors', () => {
  const redirects = read('_redirects');
  for (const [from, to] of [['/es/servicios/', '/es/#servicios'], ['/en/services/', '/en/#services'], ['/es/cotiza/', '/es/#cotiza'], ['/en/quote/', '/en/#quote'], ['/es/nosotros/', '/es/#nosotros'], ['/en/contact/', '/en/#quote']]) {
    assert.match(redirects, new RegExp(`^${from}\\s+${to}\\s+301$`, 'm'), from);
  }
});

test('no template leaks in output', () => {
  for (const file of walk(out).filter((f) => f.endsWith('.html'))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /undefined|\[object Object\]|\$\{/, file);
  }
});

test('quote form is a Netlify form with file upload and honeypot', () => {
  for (const lang of ['es', 'en']) {
    const html = home(lang);
    assert.match(html, /<form[^>]*name="cotizacion"/);
    assert.match(html, /data-netlify="true"/);
    assert.match(html, /enctype="multipart\/form-data"/);
    assert.match(html, /netlify-honeypot="bot-field"/);
    assert.match(html, /<input(?=[^>]*type="file")(?=[^>]*name="archivo")/);
    assert.match(html, /<textarea[^>]*name="descripcion"[^>]*required/);
    // Mismo destino en ambos idiomas: Netlify guarda una sola definición por nombre de formulario.
    assert.match(html, /action="\/gracias\/"/);
  }
});

test('quote items: all blocks exist in the HTML so Netlify keeps every field', () => {
  const html = home('es');
  const n = config.quoteItems;
  const blocks = html.match(/<fieldset class="item"[^>]*>/g) ?? [];
  assert.equal(blocks.length, n);
  for (let i = 1; i <= n; i++) {
    for (const f of ['servicio', 'producto', 'color', 'calidad', 'piezas']) {
      assert.match(html, new RegExp(`name="${f}_${i}"`), `${f}_${i}`);
    }
  }
  assert.doesNotMatch(blocks[0], /hidden|disabled/, 'first item visible');
  for (const tag of blocks.slice(1)) assert.match(tag, /hidden disabled/, tag);
  assert.match(html, /<button[^>]*class="[^"]*item-add/);
});

test('thanks page is bilingual and old thanks URLs redirect to it', () => {
  const html = read('gracias/index.html');
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.ok(html.includes(es.thanks.heading) && html.includes(en.thanks.heading));
  assert.match(html, /href="\/es\/"/);
  assert.match(html, /href="\/en\/"/);
  const redirects = read('_redirects');
  assert.match(redirects, /^\/es\/gracias\/\s+\/gracias\/\s+301$/m);
  assert.match(redirects, /^\/en\/thanks\/\s+\/gracias\/\s+301$/m);
});

test('whatsapp button on every page with prefilled message', () => {
  const digits = config.whatsapp.replace(/\D/g, '');
  for (const page of pages) {
    const html = read(fileFor(page.path.en));
    assert.match(html, new RegExp(`https://wa\\.me/${digits}\\?text=`));
  }
});

test('payment buttons only appear when the link is real', () => {
  const html = home('es');
  for (const key of ['stripe', 'paypal', 'mercadopago']) {
    const url = config.payments[key];
    assert.equal(html.includes(`data-pay="${key}"`), Boolean(url) && !placeholder(url), key);
  }
});

test('root redirects to spanish by default', () => {
  assert.match(read('index.html'), /url=\/es\//);
  assert.match(read('_redirects'), /^\/\s+\/en\/\s+302!?\s+Language=en/m);
});

test('netlify.toml sends security headers', () => {
  const toml = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
  for (const h of ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'X-Frame-Options']) {
    assert.match(toml, new RegExp(`${h} = `), h);
  }
  assert.match(toml, /frame-ancestors 'none'/);
  assert.match(toml, /script-src 'self'[;"]/);
  assert.match(toml, /form-action 'self'/);
});

test('pages are CSP-compatible and external links are isolated', () => {
  for (const file of walk(out).filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/, `inline script in ${file}`);
    assert.doesNotMatch(html, /\son[a-z]+="/, `inline handler in ${file}`);
    assert.doesNotMatch(html, /\sstyle="/, `inline style in ${file}`);
    for (const [tag] of html.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) {
      assert.match(tag, /rel="noopener noreferrer"/, tag);
    }
  }
});

test('every image has alt text and explicit size', () => {
  for (const file of walk(out).filter((f) => f.endsWith('.html'))) {
    for (const [tag] of readFileSync(file, 'utf8').matchAll(/<img [^>]*>/g)) {
      assert.match(tag, /\salt="[^"]+"/, tag);
      assert.match(tag, /\swidth="\d+" height="\d+"/, tag);
    }
  }
});

test('home shows hero, one photo per service and the about photo', () => {
  for (const lang of ['es', 'en']) {
    const imgs = [...home(lang).matchAll(/<img [^>]*>/g)].map(([tag]) => tag);
    assert.equal(imgs.length, 1 + config.images.services.length + 1);
    assert.match(imgs[0], /fetchpriority="high"/);
    assert.match(imgs[0], /srcset="[^"]*hero-1440\.jpg 1440w, [^"]*hero-2880\.jpg 2880w" sizes="100vw"/);
  }
  assert.equal(config.images.services.length, es.services.items.length);
});

test('only services with specs get the spec band', () => {
  const bands = home('es').match(/<ul class="specs">/g) ?? [];
  assert.equal(bands.length, es.services.items.filter((s) => s.specs.length).length);
});

test('international phone is shown in the footer', () => {
  assert.match(config.whatsapp, /^\+52 55 /);
  assert.ok(home('es').includes(`href="tel:${config.whatsapp.replace(/\s/g, '')}"`));
});

test('brand logo is inlined from public/img/logo.svg in header and footer', () => {
  const html = home('es');
  const svgs = html.match(/<svg class="logo__mark"[^>]*>/g) ?? [];
  assert.equal(svgs.length, 2);
  for (const tag of svgs) assert.match(tag, /viewBox="8 8 234 94"/);
  assert.ok(!html.includes('<style'), 'logo must not bring a <style> (CSP)');
  assert.ok(html.includes('#eb008b') && html.includes('#00adee') && html.includes('#fff100'));
});

test('share and touch icons point to existing PNGs', () => {
  const html = home('en');
  assert.match(html, /<meta property="og:image" content="https:\/\/exit-digital\.shop\/img\/og\.png">/);
  assert.match(html, /<link rel="apple-touch-icon" href="\/img\/apple-touch-icon\.png">/);
  for (const f of ['img/og.png', 'img/apple-touch-icon.png', 'img/favicon.svg']) assert.ok(existsSync(join(out, f)), f);
});
