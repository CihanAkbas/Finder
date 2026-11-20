const CACHE = 'finder-shell-v2'
const MAX_ENTRIES = 80

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()),
  )
})

function skip(url) {
  return url.pathname.startsWith('/tiles') || url.pathname.includes('/maps/') || url.pathname.endsWith('.png')
}

async function trim(cache) {
  const keys = await cache.keys()
  if (keys.length <= MAX_ENTRIES) return
  await Promise.all(keys.slice(0, keys.length - MAX_ENTRIES).map((key) => cache.delete(key)))
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return
  if (url.origin !== self.location.origin || skip(url)) return

  if (url.pathname.startsWith('/_next/static')) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const hit = await cache.match(request)
        if (hit) return hit
        const response = await fetch(request)
        if (response.ok) {
          await cache.put(request, response.clone())
          await trim(cache)
        }
        return response
      }),
    )
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          void caches.open(CACHE).then(async (cache) => {
            await cache.put(request, copy)
            await trim(cache)
          })
          return response
        })
        .catch(async () => (await caches.match(request)) || (await caches.match('/gta5')) || Response.error()),
    )
  }
})
