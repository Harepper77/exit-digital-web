// Correo de "nueva cotización" que recibe el taller (lo envía netlify/functions/submission-created.mjs).
// Siempre en español; muestra solo las partidas llenas. HTML de correo: tablas y estilos en línea.
import config from './config.js';
import es from './i18n/es.js';

const C = { ink: '#14121f', magenta: '#eb008b', cyan: '#00adee', yellow: '#fff100', cream: '#faf8f3', line: '#e4dfd3', muted: '#6b6b6b', wa: '#1fa855' };
const FONT = "font-family:Arial,Helvetica,sans-serif";

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const oneLine = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim();
const isEmail = (s) => /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/.test(s);

// 10 dígitos de México sin lada internacional → se agrega 52.
const whatsappDigits = (phone, country) => {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.length === 10 && /m[eé]xico/i.test(country ?? '') ? `52${digits}` : digits;
};

const fileUrl = (f) => {
  const url = typeof f === 'string' ? f : f?.url;
  return /^https:\/\//.test(url ?? '') ? url : '';
};

const formatDate = (iso, opts) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City', ...opts }).format(d);
};

export function quoteItems(data) {
  const items = [];
  for (let n = 1; n <= config.quoteItems; n++) {
    const item = {
      service: data[`servicio_${n}`], product: data[`producto_${n}`], color: data[`color_${n}`],
      quality: data[`calidad_${n}`], quantity: data[`piezas_${n}`],
    };
    if (Object.values(item).some((v) => String(v ?? '').trim())) items.push(item);
  }
  return items;
}

const button = (href, label, bg, color = '#fff') =>
  `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:${color};text-decoration:none;${FONT};font-size:14px;font-weight:bold;padding:12px 22px;border-radius:999px;margin:0 8px 8px 0">${label}</a>`;

const row = (label, value) => value ? `
  <tr><td style="${FONT};font-size:13px;color:${C.muted};padding:6px 12px 6px 0;vertical-align:top;white-space:nowrap">${label}</td>
      <td style="${FONT};font-size:15px;color:${C.ink};padding:6px 0">${value}</td></tr>` : '';

export function buildQuoteEmail(payload) {
  const d = payload?.data ?? {};
  const f = es.quote.fields;
  const name = oneLine(d.nombre) || 'Sin nombre';
  const email = oneLine(d.correo);
  const replyTo = isEmail(email) ? email : undefined;
  const wa = whatsappDigits(d.telefono, d.pais);
  const file = fileUrl(d.archivo);
  const items = quoteItems(d);
  const total = items.reduce((sum, it) => sum + (Number.parseInt(it.quantity, 10) || 0), 0);
  const received = formatDate(payload?.created_at, { dateStyle: 'long', timeStyle: 'short' });
  const needed = d.fecha ? formatDate(`${d.fecha}T12:00:00Z`, { dateStyle: 'long' }) || d.fecha : '';
  const lang = d.idioma === 'en' ? 'Inglés' : 'Español';
  const count = `${items.length} ${items.length === 1 ? 'producto' : 'productos'}`;

  const subject = oneLine(`Nueva cotización · ${name} · ${count}`);

  const th = (s) => `<th align="left" style="${FONT};font-size:12px;color:#fff;background:${C.ink};padding:10px 8px;font-weight:bold">${s}</th>`;
  const td = (s) => `<td style="${FONT};font-size:14px;color:${C.ink};padding:10px 8px;border-bottom:1px solid ${C.line}">${esc(s) || '—'}</td>`;
  const itemsTable = items.length ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      <tr>${th('#')}${th(f.service)}${th(f.product)}${th(f.color)}${th(f.quality)}${th('Piezas')}</tr>
      ${items.map((it, i) => `<tr data-item="${i + 1}"${i % 2 ? ` style="background:${C.cream}"` : ''}>${td(i + 1)}${td(it.service)}${td(it.product)}${td(it.color)}${td(it.quality)}${td(it.quantity)}</tr>`).join('')}
    </table>
    <p style="${FONT};font-size:13px;color:${C.muted};text-align:right;margin:8px 0 0">Total: ${total} piezas</p>` : `<p style="${FONT};font-size:14px;color:${C.muted}">Sin productos capturados.</p>`;

  const heading = (s) => `<h2 style="${FONT};font-size:16px;color:${C.ink};margin:28px 0 10px">${s}</h2>`;
  const replyHref = replyTo ? `mailto:${replyTo}?subject=${encodeURIComponent(`Tu cotización con ${config.brand}`)}` : '';

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.cream}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream}"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fff;border:1px solid ${C.line};border-radius:12px;overflow:hidden">
    <tr><td style="padding:20px 28px"><img src="${config.siteUrl}/img/logo-email.png" width="140" height="56" alt="${config.brand}" style="display:block;border:0"></td></tr>
    <tr><td style="font-size:0;line-height:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td height="6" style="background:${C.cyan}"></td><td height="6" style="background:${C.magenta}"></td><td height="6" style="background:${C.yellow}"></td></tr></table></td></tr>
    <tr><td style="padding:24px 28px 8px">
      <h1 style="${FONT};font-size:22px;color:${C.ink};margin:0 0 4px">Nueva cotización</h1>
      <p style="${FONT};font-size:13px;color:${C.muted};margin:0">${esc(received)}</p>

      ${heading('Cliente')}
      <table role="presentation" cellpadding="0" cellspacing="0">
        ${row(f.name, esc(name))}
        ${row(f.email, replyTo ? `<a href="mailto:${esc(replyTo)}" style="color:${C.magenta}">${esc(replyTo)}</a>` : esc(email))}
        ${row(f.phone, esc(oneLine(d.telefono)))}
        ${row(f.country, esc(oneLine(d.pais)))}
        ${row('Idioma del sitio', lang)}
      </table>

      ${heading(es.quote.itemsTitle)}
      ${itemsTable}

      ${heading('Detalles')}
      <table role="presentation" cellpadding="0" cellspacing="0">${row(f.date, esc(needed))}</table>
      <p style="${FONT};font-size:15px;line-height:1.5;color:${C.ink};background:${C.cream};border-left:4px solid ${C.magenta};padding:12px 14px;margin:8px 0 0">${esc(d.descripcion).replace(/\r?\n/g, '<br>') || '—'}</p>
      ${file ? `<p style="${FONT};font-size:14px;margin:16px 0 0">📎 <a href="${esc(file)}" style="color:${C.magenta}">Descargar el diseño del cliente</a></p>` : ''}

      <div style="margin:28px 0 8px">
        ${replyHref ? button(replyHref, 'Responder por correo', C.magenta) : ''}
        ${wa ? button(`https://wa.me/${wa}`, 'Escribir por WhatsApp', C.wa) : ''}
      </div>
    </td></tr>
    <tr><td style="padding:16px 28px;border-top:1px solid ${C.line}">
      <p style="${FONT};font-size:12px;color:${C.muted};margin:0">Recibida en ${esc(config.siteUrl.replace('https://', ''))} · ID ${esc(payload?.id ?? '')}. Al responder este correo le escribes directo al cliente.</p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

  const text = [
    `Nueva cotización — ${received}`,
    '',
    `${f.name}: ${name}`,
    `${f.email}: ${email}`,
    d.telefono ? `${f.phone}: ${oneLine(d.telefono)}` : null,
    `${f.country}: ${oneLine(d.pais)}`,
    `Idioma del sitio: ${lang}`,
    '',
    `${es.quote.itemsTitle}:`,
    ...items.map((it, i) => `${i + 1}. ${[it.service, it.product, it.color, it.quality].map(oneLine).join(' · ')} · ${oneLine(it.quantity)} pzs`),
    `Total: ${total} piezas`,
    '',
    needed ? `${f.date}: ${needed}` : null,
    `${f.description}:`,
    String(d.descripcion ?? ''),
    file ? `\nDiseño: ${file}` : null,
    wa ? `WhatsApp: https://wa.me/${wa}` : null,
  ].filter((l) => l !== null).join('\n');

  return { subject, html, text, replyTo };
}
