import NextAuth from 'next-auth'
import type { User } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { timingSafeEqual } from 'node:crypto'
import { db } from '@/lib/db'
import { authConfig, getAllowlistRole, isStaffRole } from '@/auth.config'
import { verifyPassword } from '@/lib/password'

// ─── Rate limit percobaan login manual (anti brute-force, per email) ──────────
const loginAttempts = new Map<string, { count: number; reset: number }>()
const LOGIN_WINDOW_MS = 10 * 60 * 1000
const LOGIN_MAX_ATTEMPTS = 8

function isAllowedLoginAttempt(email: string): boolean {
  const now = Date.now()
  const bucket = loginAttempts.get(email)
  if (!bucket || bucket.reset < now) {
    loginAttempts.set(email, { count: 1, reset: now + LOGIN_WINDOW_MS })
    return true
  }
  if (bucket.count >= LOGIN_MAX_ATTEMPTS) return false
  bucket.count++
  return true
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}

interface StaffUser extends User {
  role: string
}

// Autentikasi manual khusus staf redaksi (email + kata sandi).
// Hanya berhasil bila email berperan staf ATAU terdaftar di allowlist ENV.
async function authorizeStaff(credentials: Partial<Record<string, unknown>>): Promise<User | null> {
  const email = typeof credentials?.email === 'string' ? credentials.email.trim().toLowerCase() : ''
  const password = typeof credentials?.password === 'string' ? credentials.password : ''
  if (!email || !password) return null
  if (!isAllowedLoginAttempt(email)) return null

  const allowRole = getAllowlistRole(email)
  const envEmail = (process.env.SUPERADMIN_EMAIL || '').trim().toLowerCase()
  const envPassword = process.env.SUPERADMIN_PASSWORD || ''

  // 1) Bootstrap superadmin dari ENV (tanpa perlu data di DB)
  if (envEmail && envPassword && email === envEmail && safeEqual(password, envPassword)) {
    const role = allowRole || 'SUPERADMIN'
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      const updated = await db.user.update({ where: { email }, data: { role } })
      return { id: updated.id, name: updated.name, email: updated.email, image: updated.image, role } as StaffUser
    }
    const created = await db.user.create({
      data: { email, name: 'Superadmin Suarantara', role },
    })
    return { id: created.id, name: created.name, email: created.email, image: created.image, role } as StaffUser
  }

  // 2) Akun staf di database (memakai passwordHash scrypt)
  const user = await db.user.findUnique({ where: { email } })
  if (!user || !verifyPassword(password, user.passwordHash)) return null

  const role = allowRole || user.role
  if (!isStaffRole(role)) return null
  if (role !== user.role) {
    try {
      await db.user.update({ where: { id: user.id }, data: { role } })
    } catch {
      // abaikan: sinkronisasi peran bersifat best-effort
    }
  }
  return { id: user.id, name: user.name, email: user.email, image: user.image, role } as StaffUser
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || 'missing_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'missing_google_client_secret',
    }),
    Credentials({
      id: 'credentials',
      name: 'Staf Redaksi',
      credentials: {
        email: { label: 'Email Redaksi', type: 'email' },
        password: { label: 'Kata Sandi', type: 'password' },
      },
      authorize: (credentials) => authorizeStaff(credentials as Partial<Record<string, unknown>>),
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        // @ts-expect-error custom role property
        session.user.role = token.role || 'USER'
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        const email = typeof user.email === 'string' ? user.email : undefined
        // @ts-expect-error custom role property
        let role: string = user.role || 'USER'

        // Sumber kebenaran: peran tersimpan di database.
        if (email) {
          try {
            const dbUser = await db.user.findUnique({ where: { email }, select: { role: true } })
            if (dbUser?.role) role = dbUser.role
          } catch {
            // abaikan: jika DB tak terjangkau, gunakan peran dari provider
          }
        }

        // Allowlist ENV menaikkan akses staf & menyimpannya agar konsisten.
        const allowRole = getAllowlistRole(email)
        if (allowRole && role !== allowRole) {
          role = allowRole
          if (email) {
            try {
              await db.user.update({ where: { email }, data: { role: allowRole } })
            } catch {
              // abaikan
            }
          }
        }

        token.role = role
      }
      return token
    },
  },
})
