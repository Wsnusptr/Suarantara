'use client'

import { firebaseConfig, isFirebaseConfigured } from './config'

/**
 * Registrasi Push Notification (Firebase Cloud Messaging)
 * Menggunakan fully lazy dynamic import yang tidak di-bundle webpack
 * sehingga portal tetap berfungsi tanpa package firebase terinstal.
 */
export async function requestFCMToken(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('[FCM] Browser tidak mendukung notifikasi Web.')
    return null
  }

  if (!isFirebaseConfigured) {
    console.info('[FCM] Firebase belum dikonfigurasi. Lewati registrasi token.')
    return null
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      console.warn('[FCM] Izin notifikasi ditolak pengguna.')
      return null
    }

    // Dinamis — tidak masuk webpack static import graph
    const firebaseAppModule = 'firebase' + '/app'
    const firebaseMessagingModule = 'firebase' + '/messaging'
    
    const { initializeApp, getApps, getApp } = await import(/* webpackIgnore: true */ /* @vite-ignore */ firebaseAppModule)
    const { getMessaging, getToken } = await import(/* webpackIgnore: true */ /* @vite-ignore */ firebaseMessagingModule)

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    const messaging = getMessaging(app)

    // Teruskan konfigurasi publik ke service worker via query string agar
    // penanganan pesan latar belakang memakai project Firebase yang sama.
    const swParams = new URLSearchParams({
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
    })
    const registration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?${swParams.toString()}`
    )

    const token = await getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
      serviceWorkerRegistration: registration,
    })

    if (token) {
      await saveTokenToServer(token)
      return token
    }
    return null
  } catch (error) {
    console.error('[FCM] Error mendapatkan token:', error)
    return null
  }
}

async function saveTokenToServer(token: string) {
  try {
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, timestamp: new Date().toISOString() }),
    })
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.setItem('suarantara_fcm_token', token)
    }
  }
}
