/*
 * Service Worker para PWA
 * Dashboard Bolsa Docents - Lleida
 * 
 * Desarrollado por @CarlesMiranda
 * Fecha: Septiembre 2025
 */

const CACHE_NAME = 'bolsa-docents-v1.0.3';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Archivos en caché');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalación completa');
        return self.skipWaiting(); // Activar inmediatamente
      })
      .catch((error) => {
        console.error('❌ Service Worker: Error en instalación:', error);
      })
  );
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activación completa');
      return self.clients.claim(); // Tomar control inmediatamente
    })
  );
});

// Intercepción de requests (estrategia: Network First para scripts críticos, Cache First para assets)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Definir rutas/scripts críticos que deben ser network-first
  const criticalScripts = [
    '/app.js',
    '/firebase-config.js'
  ];

  const isCriticalScript = criticalScripts.some(path => url.pathname.endsWith(path)) ||
                           (url.hostname.includes('cdn.jsdelivr.net') && url.pathname.includes('/npm/chart.js'));

  // Si es una petición a Firebase/Google APIs, usar network-first (ya existía)
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cachear solo respuestas válidas y evitar clonar si el body ya fue usado
          const shouldCache = response && response.status === 200 && !response.bodyUsed;
          if (shouldCache) {
            try {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone).catch(err => console.warn('SW cache put failed:', err));
                });
            } catch (e) {
              console.warn('SW: No se pudo clonar/cachear la respuesta (firebase/googleapis):', e);
            }
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Network-first para scripts críticos (si la red falla, usar caché)
  if (isCriticalScript) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const shouldCache = response && response.status === 200 && !response.bodyUsed;
          if (shouldCache) {
            try {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone).catch(err => console.warn('SW cache put failed:', err)));
            } catch (e) {
              console.warn('SW: No se pudo clonar/cachear la respuesta (criticalScript):', e);
            }
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first para resto de assets estáticos (CSS, imágenes, documentos)
  if (request.destination === 'style' || request.destination === 'image' || request.destination === 'font' || request.destination === 'document') {
    event.respondWith(
      caches.match(request)
        .then((response) => response || fetch(request).then((networkResp) => {
          const shouldCache = networkResp && networkResp.status === 200 && !networkResp.bodyUsed;
          if (shouldCache) {
            try {
              const networkClone = networkResp.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, networkClone).catch(err => console.warn('SW cache put failed:', err)));
            } catch (e) {
              console.warn('SW: No se pudo clonar/cachear la respuesta (asset):', e);
            }
          }
          return networkResp;
        }).catch(() => {
          // Fallback para páginas HTML
          if (request.destination === 'document') {
            return new Response(`<!doctype html><title>Offline</title><body>Sin conexión</body>` , { headers: { 'Content-Type': 'text/html' } });
          }
        }))
    );
    return;
  }

  // Default: intentar cache primero, luego red
  event.respondWith(
    caches.match(request)
      .then((response) => response || fetch(request).then((r) => {
        try {
          if (r && r.status === 200 && !r.bodyUsed) {
            // Clonar de forma segura y cachear la copia
            const safeClone = r.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, safeClone).catch(err => console.warn('SW cache put failed:', err)));
          } else {
            // No cachear respuestas inválidas o cuyo body ya fue usado
            if (!r) console.warn('SW: fetch devolvió undefined');
            else if (r.bodyUsed) console.warn('SW: response.bodyUsed=true, no se cachea');
            else if (r.status !== 200) console.warn('SW: response status != 200, no se cachea', r.status);
          }
        } catch (e) {
          console.warn('SW: No se pudo clonar/cachear la respuesta (default) safe:', e);
        }
        return r;
      }))
  );
});

// Manejo de sincronización en background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Service Worker: Sincronización en background');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Aquí podríamos sincronizar datos pendientes con Firebase
    console.log('🔄 Service Worker: Ejecutando sincronización...');
    
    // Notificar a la aplicación que puede intentar sincronizar
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        action: 'SYNC_AVAILABLE'
      });
    });
    
  } catch (error) {
    console.error('❌ Service Worker: Error en sincronización:', error);
  }
}

// Manejo de notificaciones push (para futuras implementaciones)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nueva actualización disponible',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || '1'
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver detalles',
          icon: '/icons/checkmark.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/icons/xmark.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Bolsa Docents', options)
    );
  }
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

console.log('🔧 Service Worker: Inicializado correctamente');
