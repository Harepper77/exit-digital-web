# Plan de trabajo

## Hoy — v1 publicada
1. [x] Spec (`docs/spec.md`) y plan.
2. [ ] Tests del sitio generado (`tests/build.test.js`) — TDD: primero fallan.
3. [ ] Build Node sin dependencias (`src/build.js`) + layout + 6 páginas × 2 idiomas.
4. [ ] Contenido ES/EN (`src/i18n`) y config del negocio (`src/config.js`).
5. [ ] CSS responsivo + JS (menú móvil, año, nada más).
6. [ ] Verificación en navegador: desktop y móvil, ambos idiomas, formulario.
7. [ ] Repo en GitHub + deploy en Netlify (conectar repo; build `npm run build`, publish `dist`).
8. [ ] Netlify: activar detección de formularios + notificación por correo a Fátima.

## Lo que hace Fátima / Héctor (bloqueante para quitar placeholders)
- [ ] Recuperar/registrar dominio y apuntarlo a Netlify.
- [ ] Fátima: cuenta **Stripe** → crear Payment Link "Pago de cotización" (cliente elige monto, MXN/USD).
- [ ] Fátima: cuenta **PayPal Business** → link PayPal.me.
- [ ] Número de WhatsApp Business, correo, ciudad, horario.
- [ ] Logo y 6–12 fotos de trabajos.

## Próximo (fase 1.5)
- Galería de trabajos con fotos reales; tawk.to; Google Business Profile; Open Graph image.
- Plantillas de respuesta para empleados (cotización ES/EN, envío, aranceles).

## Fase 2 (si crecen pedidos del extranjero)
- Productos fijos con Shopify Starter (Buy Buttons) o Shopify Basic.
- Envíos con Envia.com/Skydropx; tarifas DDP.
