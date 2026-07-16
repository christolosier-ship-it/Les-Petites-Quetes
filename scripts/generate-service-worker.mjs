import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(dist)
  .filter((path) => !path.endsWith(`${sep}sw.js`))
  .map((path) => `./${relative(dist, path).split(sep).join('/')}`)
  .sort();
const signature = files
  .map((path) => `${path}:${statSync(join(dist, path.slice(2))).size}`)
  .join('|');
const version = createHash('sha256').update(signature).digest('hex').slice(0, 12);
const cacheName = `les-petites-quetes-${version}`;
const source = `const CACHE_NAME = ${JSON.stringify(cacheName)};
const CACHE_PREFIX = 'les-petites-quetes-';
const PRECACHE = ${JSON.stringify(files, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html')),
    );
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => cached ?? fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    })),
  );
});
`;

writeFileSync(join(dist, 'sw.js'), source);
const html = readFileSync(join(dist, 'index.html'), 'utf8');
if (!html.includes('.js') || !files.some((file) => file.endsWith('.js'))) {
  throw new Error('Le service worker ne peut pas être généré sans bundle JavaScript.');
}
console.log(`Service worker ${version} généré avec ${files.length} ressources précachées.`);
