// Servidor local mínimo para revisar dist/ (no se usa en producción).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const port = Number(process.env.PORT) || 4321;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };

createServer(async (req, res) => {
  let path = join(dist, normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!path.startsWith(dist)) return res.writeHead(403).end();
  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
    res.end(await readFile(path));
  } catch {
    // POST del formulario: Netlify lo procesa en producción; aquí solo simulamos la redirección.
    res.writeHead(404, { 'content-type': types['.html'] });
    res.end(await readFile(join(dist, '404.html')));
  }
}).listen(port, () => console.log(`http://localhost:${port}`));
