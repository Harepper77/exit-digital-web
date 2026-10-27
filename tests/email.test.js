import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildQuoteEmail } from '../src/email.js';
import { handler } from '../netlify/functions/submission-created.mjs';

const payload = (data = {}) => ({
  form_name: 'cotizacion',
  id: 'abc123',
  created_at: '2026-10-28T23:17:00.000Z',
  data: {
    idioma: 'en',
    nombre: 'Ana López',
    correo: 'ana@example.com',
    telefono: '55 1234 5678',
    pais: 'México',
    servicio_1: 'Serigrafía', producto_1: 'Playera', color_1: 'Rojo', calidad_1: 'Económica', piezas_1: '20',
    servicio_2: '', producto_2: '', color_2: '', calidad_2: '', piezas_2: '',
    servicio_3: 'DTF', producto_3: 'Sudadera', color_3: 'Gris jaspe', calidad_3: 'Estándar', piezas_3: '10',
    fecha: '2026-11-20',
    descripcion: 'Logo al frente\nTallas M y G',
    archivo: { url: 'https://files.netlify.com/x/logo.png', filename: 'logo.png' },
    ...data,
  },
});

test('email lists only filled items, in Spanish, with total pieces', () => {
  const { html, text, subject } = buildQuoteEmail(payload());
  assert.match(subject, /Nueva cotización · Ana López · 2 productos/);
  for (const s of ['Servicio', 'Producto', 'Color', 'Calidad', 'Piezas', 'Serigrafía', 'Sudadera', 'Gris jaspe']) assert.ok(html.includes(s), s);
  assert.equal((html.match(/data-item=/g) ?? []).length, 2);
  assert.match(html, /Total: 30 piezas/);
  assert.doesNotMatch(html, /Service|Quality|How many/);
  assert.match(text, /1\. Serigrafía · Playera · Rojo · Económica · 20 pzs/);
  assert.match(text, /2\. DTF · Sudadera · Gris jaspe · Estándar · 10 pzs/);
});

test('email escapes customer input', () => {
  const { html, subject } = buildQuoteEmail(payload({ nombre: '<script>x</script>', descripcion: '<img src=x onerror=alert(1)>' }));
  assert.doesNotMatch(html, /<script>|<img src=x/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(subject, /[\r\n]/);
});

test('reply-to is the customer only when the email is valid', () => {
  assert.equal(buildQuoteEmail(payload()).replyTo, 'ana@example.com');
  assert.equal(buildQuoteEmail(payload({ correo: 'bad\r\nBcc: x@y.z' })).replyTo, undefined);
});

test('whatsapp link adds Mexico code to 10-digit numbers; file link and description shown', () => {
  const { html } = buildQuoteEmail(payload());
  assert.match(html, /https:\/\/wa\.me\/525512345678/);
  assert.match(html, /href="https:\/\/files\.netlify\.com\/x\/logo\.png"/);
  assert.match(html, /Logo al frente<br>Tallas M y G/);
  assert.match(html, /Inglés/);
  const noExtras = buildQuoteEmail(payload({ telefono: '', archivo: '' })).html;
  assert.doesNotMatch(noExtras, /wa\.me|files\.netlify/);
});

test('function sends through Resend with idempotency and ignores other forms', async () => {
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { calls.push({ url, init }); return new Response('{"id":"e1"}', { status: 200 }); };
  Object.assign(process.env, { RESEND_API_KEY: 're_test', QUOTE_NOTIFY_TO: 'a@x.com, b@y.com', QUOTE_FROM: 'Exit-Digital <cotizaciones@exit-digital.shop>' });
  try {
    const ok = await handler({ body: JSON.stringify({ payload: payload() }) });
    assert.equal(ok.statusCode, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.resend.com/emails');
    assert.equal(calls[0].init.headers['Idempotency-Key'], 'cotizacion-abc123');
    const body = JSON.parse(calls[0].init.body);
    assert.deepEqual(body.to, ['a@x.com', 'b@y.com']);
    assert.equal(body.reply_to, 'ana@example.com');

    const other = await handler({ body: JSON.stringify({ payload: { ...payload(), form_name: 'otro' } }) });
    assert.equal(other.statusCode, 204);
    assert.equal(calls.length, 1);
  } finally {
    globalThis.fetch = realFetch;
  }
});
