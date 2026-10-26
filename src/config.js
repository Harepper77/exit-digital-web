// Datos del negocio. Todo lo marcado REEMPLAZAR es placeholder hasta tener los datos reales.
export default {
  brand: 'Exit-Digital',
  since: 2009,
  siteUrl: 'https://exit-digital.shop',
  tagline: { es: 'El arte de crear lo que imaginas', en: 'The art of creating what you imagine' },
  email: 'exitdigital.diseno@gmail.com',
  whatsapp: '+52 55 4916 4398',
  city: { es: 'Ciudad de México (CDMX), México', en: 'Mexico City (CDMX), Mexico' },
  hours: { es: 'Lunes a viernes 9:00–18:00 · Sábado 10:00–14:00', en: 'Mon–Fri 9:00–18:00 · Sat 10:00–14:00 (Mexico City time)' }, // REEMPLAZAR
  // Fotos: hoy son placeholders SVG. Guarda la foto real con el tamaño indicado
  // (p. ej. public/img/servicios/dtf.jpg) y cambia aquí la extensión.
  images: {
    hero: '/img/hero.svg',
    heroSize: [1200, 1500],
    about: '/img/nosotros.svg',
    aboutSize: [1200, 900],
    // Mismo orden que services.items en src/i18n
    services: [
      '/img/servicios/serigrafia.svg',
      '/img/servicios/dtf.svg',
      '/img/servicios/sublimacion.svg',
      '/img/servicios/vinil-textil.svg',
      '/img/servicios/vinil-adherible.svg',
      '/img/servicios/promocionales.svg',
      '/img/servicios/diseno.svg',
    ],
    servicesSize: [1200, 900],
  },
  payments: {
    // Stripe Payment Link con "el cliente elige el monto"
    stripe: 'https://buy.stripe.com/REEMPLAZAR',
    // PayPal.me o link de PayPal Business
    paypal: 'https://paypal.me/REEMPLAZAR',
    // Opcional (México). Vacío = no se muestra.
    mercadopago: '',
  },
  social: {
    facebook: '', // opcional
    instagram: '', // opcional
  },
};
