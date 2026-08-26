import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const manifestPath = join(dist, '.vite', 'manifest.json');

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const entries = Object.entries(manifest);
const appEntry = entries.find(([, value]) => value.isEntry);
if (!appEntry) throw new Error('Le manifeste Vite ne contient aucune entrée applicative.');

function staticClosure(rootKey) {
  const visited = new Set();
  const stack = [rootKey];
  while (stack.length > 0) {
    const key = stack.pop();
    if (!key || visited.has(key)) continue;
    visited.add(key);
    for (const imported of manifest[key]?.imports ?? []) stack.push(imported);
  }
  return visited;
}

const coreKeys = staticClosure(appEntry[0]);
const coreJavaScript = new Set(
  [...coreKeys]
    .map((key) => manifest[key]?.file)
    .filter((file) => typeof file === 'string' && file.endsWith('.js')),
);

function isDeferredVroomBinary(relativePath) {
  return relativePath === 'games/vroom-scadoodles/index.pck' || relativePath === 'games/vroom-scadoodles/index.wasm';
}

const files = walk(dist)
  .filter((path) => !path.endsWith(`${sep}sw.js`))
  .filter((path) => !path.endsWith('.map'))
  .filter((path) => !path.endsWith(`${sep}.vite${sep}manifest.json`))
  .filter((path) => {
    const relativePath = relative(dist, path).split(sep).join('/');
    if (isDeferredVroomBinary(relativePath)) return false;
    return !relativePath.endsWith('.js') || coreJavaScript.has(relativePath);
  })
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
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    const fallback = url.pathname.startsWith('/games/beyond-fable/')
      ? './games/beyond-fable/index.html'
      : url.pathname.startsWith('/games/origin/')
        ? './games/origin/index.html'
        : url.pathname.startsWith('/games/vroom-scadoodles/')
          ? './games/vroom-scadoodles/index.html'
          : './index.html';
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(fallback, copy));
          return response;
        })
        .catch(() => caches.match(fallback)),
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
  throw new Error('Le service worker ne peut pas être généré sans bundle JavaScript initial.');
}
console.log(`Service worker ${version} généré avec ${files.length} ressources locales précachées ; les chunks dynamiques et binaires lourds de Vroom sont mis en cache à leur première ouverture.`);
