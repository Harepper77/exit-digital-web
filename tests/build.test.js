import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from '../src/build.js';
import { pages } from '../src/pages.js';
import es from '../src/i18n/es.js';
import en from '../src/i18n/en.js';
import config from '../src/config.js';

let out;
const read = (p) => readFileSync(join(out, p), 'utf8');
const fileFor = (url) => join(url.replace(/^\//, ''), url.endsWith('/') ? 'index.html' : '');

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

test('all internal links resolve to generated files', () => {
  const html = walk(out).filter((f) => f.endsWith('.html'));
  for (const file of html) {
    for (const [, href] of readFileSync(file, 'utf8').matchAll(/(?:href|src|action)="(\/[^"#?]*)/g)) {
      assert.ok(existsSync(join(out, fileFor(href))), `${href} linked from ${file}`);
    }
  }
});

test('no template leaks in output', () => {
  for (const file of walk(out).filter((f) => f.endsWith('.html'))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /undefined|\[object Object\]|\$\{/, file);
  }
});

test('quote form is a Netlify form with file upload and honeypot', () => {
  for (const lang of ['es', 'en']) {
    const page = pages.find((p) => p.id === 'quote');
    const html = read(fileFor(page.path[lang]));
    assert.match(html, /<form[^>]*name="cotizacion"/);
    assert.match(html, /data-netlify="true"/);
    assert.match(html, /enctype="multipart\/form-data"/);
    assert.match(html, /netlify-honeypot="bot-field"/);
    assert.match(html, /<input[^>]*type="file"/);
    const thanks = pages.find((p) => p.id === 'thanks').path[lang];
    assert.match(html, new RegExp(`action="${thanks}"`));
  }
});

test('whatsapp button on every page with prefilled message', () => {
  const digits = config.whatsapp.replace(/\D/g, '');
  for (const page of pages) {
    const html = read(fileFor(page.path.en));
    assert.match(html, new RegExp(`https://wa\\.me/${digits}\\?text=`));
  }
});

test('payment buttons follow config', () => {
  const html = read(fileFor(pages.find((p) => p.id === 'quote').path.es));
  assert.ok(html.includes(config.payments.stripe));
  assert.ok(html.includes(config.payments.paypal));
  assert.equal(html.includes('data-pay="mercadopago"'), Boolean(config.payments.mercadopago));
});

test('root redirects to spanish by default', () => {
  assert.match(read('index.html'), /url=\/es\//);
  assert.match(read('_redirects'), /\/\s+\/en\/\s+302!?\s+Language=en/);
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

test('photos appear on home, services and about', () => {
  const imgs = (id, lang) => [...read(fileFor(pages.find((p) => p.id === id).path[lang])).matchAll(/<img /g)].length;
  for (const lang of ['es', 'en']) {
    assert.ok(imgs('home', lang) >= 1, 'home hero');
    assert.equal(imgs('services', lang), config.images.services.length);
    assert.ok(imgs('about', lang) >= 1, 'about');
  }
  assert.equal(config.images.services.length, es.services.items.length);
});

test('international phone is shown in the footer', () => {
  assert.match(config.whatsapp, /^\+52 55 /);
  assert.ok(read(fileFor(pages[0].path.es)).includes(`href="tel:${config.whatsapp.replace(/\s/g, '')}"`));
});

test('brand logo is inlined from public/img/logo.svg in header and footer', () => {
  const html = read('es/index.html');
  const svgs = html.match(/<svg class="logo__mark"[^>]*>/g) ?? [];
  assert.equal(svgs.length, 2);
  for (const tag of svgs) assert.match(tag, /viewBox="8 8 234 94"/);
  assert.ok(!html.includes('<style'), 'logo must not bring a <style> (CSP)');
  assert.ok(html.includes('#eb008b') && html.includes('#00adee') && html.includes('#fff100'));
});

test('share and touch icons point to existing PNGs', () => {
  const html = read('en/index.html');
  assert.match(html, /<meta property="og:image" content="https:\/\/exit-digital\.shop\/img\/og\.png">/);
  assert.match(html, /<link rel="apple-touch-icon" href="\/img\/apple-touch-icon\.png">/);
  for (const f of ['img/og.png', 'img/apple-touch-icon.png', 'img/favicon.svg']) assert.ok(existsSync(join(out, f)), f);
});
