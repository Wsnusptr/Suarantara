/* eslint-disable no-restricted-globals */
// Firebase Messaging Service Worker for Suarantara Push Notifications
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

// Konfigurasi diteruskan dari aplikasi melalui query string saat registrasi
// (apiKey publik boleh tampil di URL; nilai rahasia tidak pernah dikirim ke SW).
const params = new URLSearchParams(self.location.search)
const firebaseConfig = {
  apiKey: params.get('apiKey') || 'placeholder-api-key',
  authDomain: params.get('authDomain') || 'suarantara-portal.firebaseapp.com',
  projectId: params.get('projectId') || 'suarantara-portal',
  storageBucket: params.get('storageBucket') || 'suarantara-portal.appspot.com',
  messagingSenderId: params.get('messagingSenderId') || '000000000000',
  appId: params.get('appId') || '1:000000000000:web:0000000000000000000000',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const messaging = firebase.messaging()

// Handle background push messages
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] Received background message:', payload)

  const notificationTitle = payload.notification?.title || 'Warta Kilat Suarantara'
  const notificationOptions = {
    body: payload.notification?.body || 'Ada perkembangan warta dan advokasi mahasiswa terbaru.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: payload.data?.url || '/',
    },
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click to open article
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
