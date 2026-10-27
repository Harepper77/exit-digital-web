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
  images: {
    hero: '/img/hero-1440.jpg',
    hero2x: '/img/hero-2880.jpg',
    heroSize: [1440, 811],
    about: '/img/nosotros.jpg',
    aboutSize: [1173, 660],
    // Mismo orden que services.items en src/i18n
    services: [
      '/img/servicios/serigrafia.jpg',
      '/img/servicios/dtf.jpg',
      '/img/servicios/sublimacion.jpg',
      '/img/servicios/vinil-textil.jpg',
      '/img/servicios/vinil-adherible.jpg',
      '/img/servicios/promocionales.jpg',
      '/img/servicios/diseno.jpg',
    ],
    servicesSize: [1190, 741],
  },
  // Formulario de cotización: cuántas partidas (producto + servicio) puede agregar el cliente.
  // Netlify solo guarda campos que existen en el HTML, así que se generan todas de antemano.
  quoteItems: 5,
  payments: {
    // Stripe Payment Link con "el cliente elige el monto". Si dice REEMPLAZAR, el botón no se muestra.
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
