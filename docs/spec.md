# Spec — Sitio web v1 (serigrafía y DTF)

Fecha: 2026-10-26 · Autor: Héctor (+ Claude)

## Objetivo
Sitio bilingüe (ES/EN) del taller de serigrafía y DTF de Fátima (operando desde 2009) para
**recibir pedidos del extranjero sin costo fijo**: el cliente ve los servicios, pide cotización,
recibe un precio y paga con un link (Stripe o PayPal). México sigue igual (WhatsApp).

Flujo: **Sitio → Cotiza (formulario o WhatsApp) → cotización por correo/WhatsApp → link de pago → producción → envío**.

## Alcance v1
| Página | ES | EN | Contenido |
|---|---|---|---|
| Inicio | `/es/` | `/en/` | Hero, resumen de servicios, cómo funciona (4 pasos), CTA a Cotiza |
| Servicios | `/es/servicios/` | `/en/services/` | Serigrafía, DTF, diseño, otros servicios; ventajas y pedidos mínimos |
| Nosotros | `/es/nosotros/` | `/en/about/` | Historia desde 2009, valores, cifras |
| Cotiza | `/es/cotiza/` | `/en/quote/` | Formulario con archivo + bloque "¿Ya tienes tu cotización? Paga aquí" |
| Contacto | `/es/contacto/` | `/en/contact/` | WhatsApp, correo, ubicación, horario, métodos de pago |
| Gracias | `/es/gracias/` | `/en/thanks/` | Confirmación tras enviar el formulario |

- `/` redirige al idioma del navegador (Netlify `Language`), por defecto `/es/`.
- Cada página: selector de idioma que lleva a la página equivalente, `hreflang`, `<html lang>`, título/description propios.
- Botón flotante de **WhatsApp** en todas las páginas, con mensaje prellenado según idioma.

## Pagos
- **Stripe Payment Link** con "el cliente elige el monto" (paga lo cotizado).
- **PayPal.me** (o link de PayPal Business).
- **Mercado Pago** opcional (México): se muestra solo si hay link en la config.
- Sin carrito ni inventario en v1: el precio se acuerda en la cotización.

## Formulario de cotización
Netlify Forms (gratis, sin backend; acepta archivos hasta ~8 MB). Campos: nombre*, correo*, WhatsApp/teléfono,
país*, servicio* (serigrafía / DTF / diseño / otro), prenda, cantidad*, fecha deseada, archivo de diseño, comentarios*.
Honeypot anti-spam. Redirige a la página de Gracias. Notificación por correo configurable en Netlify.

## Requisitos no funcionales
- Responsivo (mobile-first, 360 px → desktop), accesible (contraste AA, foco visible, labels, `prefers-reduced-motion`).
- Sin dependencias de runtime: HTML/CSS/JS estático. Build propio con Node 24 (sin paquetes npm).
- Todo el contenido editable en `src/i18n/{es,en}.js`; datos del negocio en `src/config.js`.
- Tests con `node:test` sobre el sitio generado.

## Fuera de alcance v1 (fase 2)
Chat tawk.to (preparado en config, apagado), catálogo/carrito Shopify, galería con fotos reales, blog, analítica, SEO avanzado.

## Datos pendientes (placeholders en `src/config.js`)
Nombre de marca, dominio, logo, WhatsApp, correo, dirección/ciudad, horario, links de Stripe/PayPal/Mercado Pago, fotos, redes.
