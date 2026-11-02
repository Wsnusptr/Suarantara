/**
 * Firebase Client Configuration (Push Notification & Analytics Only)
 * 
 * Sesuai strategi arsitektur Suarantara:
 * - Firebase Storage TIDAK DIGUNAKAN (menghindari biaya/limit kuota storage).
 * - Firebase KHUSUS digunakan untuk:
 *   1. Firebase Cloud Messaging (FCM) - Notifikasi warta darurat & breaking news mahasiswa (GRATIS)
 *   2. Client Presence / Realtime readers counter
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'placeholder-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'suarantara-portal.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'suarantara-portal',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'suarantara-portal.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-0000000000',
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'placeholder-vapid-key',
}

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'placeholder-api-key'
)
