# Exit-Digital · sitio web

Sitio bilingüe (ES/EN) de **Exit-Digital**, taller de serigrafía y DTF en México desde 2009.
HTML/CSS/JS estático generado con un build de Node sin dependencias. Hosting: Netlify (gratis).

- Spec: [docs/spec.md](docs/spec.md) · Plan: [docs/plan.md](docs/plan.md)

## Uso

```bash
npm run build   # genera dist/
npm test        # pruebas sobre el sitio generado
npm run dev     # build + servidor local en http://localhost:4321
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| WhatsApp, correo, ciudad, horario, links de pago, dominio | `src/config.js` |
| Textos en español / inglés | `src/i18n/es.js`, `src/i18n/en.js` (mismas claves en ambos; los tests lo verifican) |
| Estructura de cada página y URLs | `src/pages.js` |
| Layout (header, footer, `<head>`) | `src/build.js` |
| Estilos y JS | `public/css/styles.css`, `public/js/main.js` |
| Imágenes | `public/img/` |

## Publicar en Netlify (primera vez)
1. Netlify → **Add new site → Import an existing project → GitHub** → este repo.
2. Build command `npm run build`, publish directory `dist` (ya vienen en `netlify.toml`).
3. **Forms**: Site configuration → Forms → *Enable form detection*, y luego volver a desplegar.
   En *Form notifications* agregar el correo de Fátima para recibir cada cotización.
4. **Dominio**: Domain management → Add a domain → apuntar los DNS del registrador. Después cambiar `siteUrl` en `src/config.js`.

## Seguridad
- **Cabeceras** (`netlify.toml`): CSP estricta (solo recursos propios + Google Fonts, sin scripts inline),
  HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` y `Permissions-Policy`. `npm run dev` envía las mismas.
- **Formulario**: honeypot + filtro anti-spam de Netlify; solo acepta formatos de diseño y máximo 8 MB.
- **Sin secretos en el repo**: los links de pago son públicos por diseño; los cobros ocurren en Stripe/PayPal, nunca en este sitio.
- **Enlaces externos** con `rel="noopener noreferrer"`. Los tests verifican cabeceras, CSP y enlaces.
- **Cuentas**: activar 2FA en GitHub, Netlify, Porkbun (más *domain lock* y WHOIS privacy), Stripe y PayPal.
- Si llega spam por el formulario: Netlify → Forms → activar reCAPTCHA (requiere ajustar la CSP).

## Pagos (los crea Fátima en sus cuentas)
- **Stripe** → Payment Links → producto "Pago de cotización" → *Let customers choose what to pay* → pegar el link en `payments.stripe`.
- **PayPal Business** → crear PayPal.me → pegar en `payments.paypal`.
- **Mercado Pago** (opcional) → link de pago → `payments.mercadopago` (vacío = no se muestra).

## Por confirmar con Fátima
- Ciudad y horario (`src/config.js`, marcados `CONFIRMAR`/`REEMPLAZAR`); links de Stripe y PayPal.
- Tiempos típicos de respuesta y producción.
- Fotos propias de trabajos (no usar las de personajes con licencia: Mario, Simpsons, Nirvana, Goku…).
- Servicios tomados de su PDF "Productos y servicios" (2026-10-26).
