// Genera las imágenes placeholder (SVG) de public/img/. Uso: node scripts/placeholders.js
// Cuando tengas la foto real, guárdala junto al SVG (p. ej. serigrafia.jpg) y cambia la ruta en src/config.js.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../src/config.js';

const img = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const labels = {
  '/img/hero.svg': 'Hero · prenda impresa',
  '/img/nosotros.svg': 'Nosotros · taller / equipo',
  '/img/servicios/serigrafia.svg': 'Serigrafía',
  '/img/servicios/dtf.svg': 'DTF',
  '/img/servicios/sublimacion.svg': 'Sublimación',
  '/img/servicios/vinil-textil.svg': 'Vinil textil',
  '/img/servicios/vinil-adherible.svg': 'Vinil adherible',
  '/img/servicios/promocionales.svg': 'Gran formato y promocionales',
  '/img/servicios/diseno.svg': 'Diseño',
};
const sizes = { hero: config.images.heroSize, about: config.images.aboutSize, services: config.images.servicesSize };

const svg = (label, [w, h], path) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <pattern id="c" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="5" fill="#00b4d8"/></pattern>
    <pattern id="m" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="21" cy="7" r="5" fill="#e5007e"/></pattern>
    <pattern id="y" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="21" r="5" fill="#ffd60a"/></pattern>
    <radialGradient id="f"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
    <mask id="k"><rect width="${w}" height="${h}" fill="url(#f)"/></mask>
  </defs>
  <rect width="${w}" height="${h}" fill="#26233a"/>
  <g mask="url(#k)" opacity=".55"><rect width="${w}" height="${h}" fill="url(#c)"/><rect width="${w}" height="${h}" fill="url(#m)"/><rect width="${w}" height="${h}" fill="url(#y)"/></g>
  <g font-family="Arial, sans-serif" text-anchor="middle" fill="#fff">
    <text x="${w / 2}" y="${h / 2 - 18}" font-size="${Math.round(w / 16)}" font-weight="900">FOTO · ${label}</text>
    <text x="${w / 2}" y="${h / 2 + Math.round(w / 22)}" font-size="${Math.round(w / 40)}" opacity=".8">${w} × ${h} px · ${path.replace('.svg', '.jpg')}</text>
  </g>
</svg>
`;

for (const [path, label] of Object.entries(labels)) {
  const size = path.includes('hero') ? sizes.hero : path.includes('nosotros') ? sizes.about : sizes.services;
  mkdirSync(dirname(join(img, path)), { recursive: true });
  writeFileSync(join(img, path), svg(label, size, path));
}
console.log(`${Object.keys(labels).length} placeholders en public/img/`);
