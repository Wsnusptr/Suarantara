import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

// ─── Hashing password staf redaksi (scrypt, tanpa dependensi eksternal) ───────
// Format tersimpan: "scrypt$<saltHex>$<hashHex>". Verifikasi memakai
// timingSafeEqual untuk mencegah serangan timing.

const KEYLEN = 64

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, KEYLEN).toString('hex')
  return `scrypt$${salt}$${derived}`
}

export function verifyPassword(password: string, stored: string | null | undefined): boolean {
  if (!password || !stored) return false
  const parts = stored.split('$')
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false
  const [, salt, hash] = parts
  try {
    const expected = Buffer.from(hash, 'hex')
    const derived = scryptSync(password, salt, KEYLEN)
    if (expected.length !== derived.length) return false
    return timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}
