// Datos del negocio. Todo lo marcado REEMPLAZAR es placeholder hasta tener los datos reales.
export default {
  brand: 'Exit-Digital',
  since: 2009,
  siteUrl: 'https://exit-digital.netlify.app', // REEMPLAZAR por el dominio cuando esté listo
  email: 'hola@exit-digital.com', // REEMPLAZAR
  whatsapp: '+52 55 0000 0000', // REEMPLAZAR (formato internacional)
  city: { es: 'Ciudad de México, México', en: 'Mexico City, Mexico' }, // REEMPLAZAR
  hours: { es: 'Lunes a viernes 9:00–18:00 · Sábado 10:00–14:00', en: 'Mon–Fri 9:00–18:00 · Sat 10:00–14:00 (Mexico City time)' }, // REEMPLAZAR
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
