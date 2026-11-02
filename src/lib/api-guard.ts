import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// ─── Peran staf redaksi yang diizinkan menulis konten via CMS ────────────────
export const STAFF_ROLES = [
  'ADMIN',
  'SUPERADMIN',
  'PEMRED',
  'EDITOR_MEDIA',
  'TIM_ADVOKASI',
  'TIM_RISET',
  'HUMAS_MITRA',
] as const

export type StaffRole = (typeof STAFF_ROLES)[number]

// ─── Util IP ─────────────────────────────────────────────────────────────────
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

// ─── Rate limiter in-memory (sliding window sederhana) ───────────────────────
// Catatan: cukup untuk single-instance. Untuk multi-instance gunakan Redis/Upstash.
type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()

// Bersihkan bucket kadaluarsa secara berkala agar tidak bocor memori
if (typeof globalThis !== 'undefined') {
  const g = globalThis as unknown as { __suarantaraRlTimer?: NodeJS.Timeout }
  if (!g.__suarantaraRlTimer) {
    g.__suarantaraRlTimer = setInterval(() => {
      const now = Date.now()
      for (const [key, b] of buckets) {
        if (b.reset < now) buckets.delete(key)
      }
    }, 60_000)
    // Jangan menahan proses keluar
    g.__suarantaraRlTimer.unref?.()
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfter: number; remaining: number } {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return { ok: true, retryAfter: 0, remaining: limit - 1 }
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.reset - now) / 1000), remaining: 0 }
  }
  bucket.count++
  return { ok: true, retryAfter: 0, remaining: limit - bucket.count }
}

export function tooManyRequests(retryAfter: number): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Terlalu banyak permintaan. Silakan coba beberapa saat lagi.' },
    { status: 429, headers: { 'Retry-After': String(Math.max(retryAfter, 1)) } }
  )
}

export function unauthorized(message = 'Akses ditolak. Autentikasi diperlukan.'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 401 })
}

export function forbidden(message = 'Anda tidak memiliki izin untuk aksi ini.'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 403 })
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 400 })
}

export function conflict(message: string): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 409 })
}

export function serverError(message = 'Terjadi kesalahan pada server.'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 500 })
}

/** Deteksi pelanggaran unique constraint Prisma (kode P2002). */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: string }).code === 'P2002'
  )
}

// ─── Guard sesi + peran ──────────────────────────────────────────────────────
export interface StaffSession {
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null; role: string }
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const session = await auth()
  const user = session?.user as { id?: string; role?: string } | undefined
  if (!session?.user || !user) return null
  const role = user.role || 'USER'
  if (!(STAFF_ROLES as readonly string[]).includes(role)) return null
  return session as unknown as StaffSession
}

export async function requireStaff(): Promise<StaffSession | null> {
  return getStaffSession()
}

// ─── Validasi & sanitasi input ───────────────────────────────────────────────
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

/** Potong spasi, buang karakter kontrol, batasi panjang. */
export function cleanString(value: unknown, maxLength = 5000): string | undefined {
  if (typeof value !== 'string') return undefined
  const cleaned = value.replace(CONTROL_CHARS, '').trim()
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) : cleaned
}

/** Ambil hanya field yang diizinkan (mencegah mass-assignment). */
export function pick<T extends Record<string, unknown>>(
  source: Record<string, unknown>,
  allowed: readonly (keyof T)[]
): Partial<T> {
  const out: Partial<T> = {}
  for (const key of allowed) {
    if (key in source) {
      // @ts-expect-error index signature
      out[key] = source[key]
    }
  }
  return out
}

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

/** Konversi string JSON array dengan aman → selalu mengembalikan string JSON valid. */
export function safeJsonArray(value: unknown): string {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return JSON.stringify(Array.isArray(parsed) ? parsed : [])
    } catch {
      return JSON.stringify([])
    }
  }
  return JSON.stringify(Array.isArray(value) ? value : [])
}

/** Slugify ringan + buang karakter tak aman dari URL. */
export function slugify(value: unknown): string | undefined {
  const s = cleanString(value, 160)
  if (!s) return undefined
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/** Cek apakah sebuah peran termasuk staf redaksi. */
export function isStaffRole(role: unknown): role is StaffRole {
  return typeof role === 'string' && (STAFF_ROLES as readonly string[]).includes(role)
}

// ─── Spesifikasi field untuk sanitasi terpusat (anti mass-assignment) ────────
export type FieldType = 'string' | 'boolean' | 'int' | 'json' | 'slug'
export interface FieldSpec {
  type: FieldType
  /** Panjang maksimum untuk tipe string (default 5000). */
  max?: number
}

/** Pemetaan tipe field spesifikasi → tipe nilai hasil sanitasi. */
export type Sanitized<S extends Record<string, FieldSpec>> = {
  [K in keyof S]?: S[K] extends { type: 'boolean' }
    ? boolean
    : S[K] extends { type: 'int' }
      ? number
      : string
}

/**
 * Ambil hanya field yang terdaftar di `spec`, lakukan casting aman sesuai tipe,
 * dan buang nilai yang tidak valid. Mencegah penulisan kolom sistem (id,
 * createdAt, viewsCount, dll) sekaligus mensterilkan input.
 *
 * Gunakan spesifikasi dengan `as const satisfies Record<string, FieldSpec>`
 * agar tipe hasil dapat di-infer secara akurat.
 */
export function sanitizeFields<S extends Record<string, FieldSpec>>(
  body: Record<string, unknown>,
  spec: S
): Sanitized<S> {
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(spec)) {
    if (!(key in body)) continue
    const value = body[key]
    const cfg = spec[key] as FieldSpec
    switch (cfg.type) {
      case 'boolean':
        out[key] = Boolean(value)
        break
      case 'int': {
        const n = typeof value === 'number' ? value : parseInt(String(value), 10)
        if (Number.isFinite(n)) out[key] = Math.trunc(n)
        break
      }
      case 'json':
        out[key] = safeJsonArray(value)
        break
      case 'slug': {
        const s = slugify(value)
        if (s) out[key] = s
        break
      }
      default: {
        const s = cleanString(value, cfg.max ?? 5000)
        if (s !== undefined) out[key] = s
        break
      }
    }
  }
  return out as Sanitized<S>
}

/** Validasi enum string; mengembalikan nilai jika termasuk daftar, jika tidak `undefined`. */
export function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined
}

/** Validasi panjang token FCM (base64url-ish, 100–4096 char). */
export function isValidFcmToken(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 80 && value.length <= 4096 && /^[\w:.-]+$/.test(value)
}
