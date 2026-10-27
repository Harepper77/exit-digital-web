// Netlify la ejecuta con cada envío verificado de un formulario (no con los marcados como spam)
// y manda al taller el correo con diseño vía Resend.
// Variables de entorno (Netlify → Project configuration → Environment variables):
//   RESEND_API_KEY   API key de Resend (solo permiso de envío)
//   QUOTE_NOTIFY_TO  destinatarios separados por coma
//   QUOTE_FROM       remitente verificado, p. ej. "Exit-Digital <cotizaciones@exit-digital.shop>"
import { buildQuoteEmail } from '../../src/email.js';

export const handler = async (event) => {
  let payload;
  try {
    ({ payload } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400 };
  }
  if (payload?.form_name !== 'cotizacion' || !payload.data) return { statusCode: 204 };

  const { RESEND_API_KEY: key, QUOTE_NOTIFY_TO, QUOTE_FROM: from } = process.env;
  const to = (QUOTE_NOTIFY_TO ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!key || !to.length || !from) {
    console.error('Faltan RESEND_API_KEY, QUOTE_NOTIFY_TO o QUOTE_FROM');
    return { statusCode: 500 };
  }

  const email = buildQuoteEmail(payload);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      // Si Netlify reintenta el evento, Resend no manda el correo dos veces.
      'Idempotency-Key': `cotizacion-${payload.id}`,
    },
    body: JSON.stringify({ from, to, reply_to: email.replyTo, subject: email.subject, html: email.html, text: email.text }),
  });
  if (!res.ok) {
    console.error('Resend respondió', res.status, await res.text());
    return { statusCode: 502 };
  }
  return { statusCode: 200 };
};
