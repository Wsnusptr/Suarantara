import type { NextAuthConfig } from 'next-auth'

const STAFF_ROLES = new Set([
  'ADMIN',
  'SUPERADMIN',
  'PEMRED',
  'EDITOR_MEDIA',
  'TIM_ADVOKASI',
  'TIM_RISET',
  'HUMAS_MITRA',
])

// Rahasia sesi. Di produksi, AUTH_SECRET WAJIB diisi (fail-closed) agar token
// tidak bisa dipalsukan. Fallback hanya untuk lingkungan pengembangan.
const resolvedSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
if (!resolvedSecret && process.env.NODE_ENV === 'production') {
  throw new Error(
    'AUTH_SECRET wajib diisi pada lingkungan produksi. Setel AUTH_SECRET pada environment variabel.'
  )
}

export const authConfig = {
  secret: resolvedSecret || 'dev-only-insecure-secret-change-me-32chars',
  pages: {
    signIn: '/masuk',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user as { role?: string } | undefined
      const isLoggedIn = !!user
      const path = nextUrl.pathname

      // Area meja redaksi & studio: wajib login DAN berperan staf.
      if (path.startsWith('/admin') || path.startsWith('/studio')) {
        return isLoggedIn && STAFF_ROLES.has(user?.role || '')
      }
      // Halaman pengiriman aspirasi: minimal sudah login.
      if (path.startsWith('/kirim-suara')) {
        return isLoggedIn
      }
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
