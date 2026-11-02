import type { NextAuthConfig } from 'next-auth'

// ─── Peran staf redaksi yang diizinkan mengelola CMS ─────────────────────────
export const STAFF_ROLES = [
  'ADMIN',
  'SUPERADMIN',
  'PEMRED',
  'EDITOR_MEDIA',
  'TIM_ADVOKASI',
  'TIM_RISET',
  'HUMAS_MITRA',
] as const

const STAFF_ROLE_SET = new Set<string>(STAFF_ROLES)

export function isStaffRole(role: unknown): boolean {
  return typeof role === 'string' && STAFF_ROLE_SET.has(role)
}

// ─── Allowlist email → peran (bootstrap akses Meja Redaksi lewat ENV) ─────────
// Pemisah koma. Tidak case-sensitive. Dipakai saat login agar akun Google yang
// terdaftar otomatis mendapat akses staf — tanpa perlu menyimpan password.
function parseEmailList(raw: string | undefined): string[] {
  return (raw || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function getAllowlistRole(email?: string | null): string | null {
  if (!email) return null
  const normalized = email.trim().toLowerCase()
  if (parseEmailList(process.env.SUPERADMIN_EMAILS).includes(normalized)) return 'SUPERADMIN'
  if (parseEmailList(process.env.ADMIN_EMAILS).includes(normalized)) return 'ADMIN'
  return null
}

// Rahasia sesi. Di produksi, AUTH_SECRET WAJIB diisi agar token tidak bisa dipalsukan.
const resolvedSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

export const authConfig = {
  // Gunakan rahasia dari env, atau fallback hanya jika bukan di produksi.
  secret: resolvedSecret || (process.env.NODE_ENV === 'production' ? undefined : 'dev-only-insecure-secret-change-me-32chars'),
  // Diperlukan agar NextAuth memercayai host header di balik proxy (Vercel).
  trustHost: true,
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
        return isLoggedIn && isStaffRole(user?.role)
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
