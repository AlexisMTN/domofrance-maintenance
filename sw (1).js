// Service Worker DOMOFRANCE
const CACHE_NAME = 'domofrance-v1'

self.addEventListener('install', e => {
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim())
})

self.addEventListener('fetch', e => {
  // Laisser passer toutes les requêtes normalement
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})

// Recevoir les notifications push
self.addEventListener('push', e => {
  let data = {}
  try { data = e.data ? e.data.json() : {} } catch(err) { data = { title: 'DOMOFRANCE', body: e.data ? e.data.text() : '' } }
  
  const title = data.title || 'DOMOFRANCE Maintenance'
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [{ action: 'open', title: 'Ouvrir' }]
  }
  e.waitUntil(self.registration.showNotification(title, options))
})

// Clic sur la notification
self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    if (list.length > 0) return list[0].focus()
    return clients.openWindow('/')
  }))
})
