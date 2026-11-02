import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'

const db = new PrismaClient()

/**
 * Seeding minimal: menyiapkan SATU akun superadmin untuk login panel CMS
 * (Meja Redaksi). Seluruh konten (berita, program, advokasi, kajian, mitra,
 * dsb.) diisi sepenuhnya melalui input admin / CMS — tanpa data dummy.
 *
 * Akun superadmin mengikuti ENV:
 *   SUPERADMIN_EMAIL    (default: admin@suarantara.org)
 *   SUPERADMIN_PASSWORD (bila diisi → login manual email+sandi aktif)
 *   SUPERADMIN_NAME     (opsional)
 *
 * Format hash identik dengan src/lib/password.ts: "scrypt$<saltHex>$<hashHex>".
 * Dibuat inline agar skrip seed tetap mandiri (tanpa resolusi path alias).
 *
 * File ini idempoten (upsert) dan TIDAK menghapus data apa pun.
 */
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `scrypt$${salt}$${derived}`
}

async function main() {
  const email = (process.env.SUPERADMIN_EMAIL || 'admin@suarantara.org').trim().toLowerCase()
  const password = process.env.SUPERADMIN_PASSWORD || ''
  const name = process.env.SUPERADMIN_NAME || 'Superadmin Suarantara'

  console.log('🌱 Memulai Seeding Akun Superadmin Suarantara...')

  if (password) {
    const passwordHash = hashPassword(password)
    await db.user.upsert({
      where: { email },
      update: { role: 'SUPERADMIN', passwordHash },
      create: { name, email, role: 'SUPERADMIN', passwordHash },
    })
    console.log(`✅ Superadmin siap: ${email} (login manual email + sandi aktif).`)
  } else {
    await db.user.upsert({
      where: { email },
      update: { role: 'SUPERADMIN' },
      create: { name, email, role: 'SUPERADMIN' },
    })
    console.log(`✅ Superadmin siap: ${email} (tanpa sandi — set SUPERADMIN_PASSWORD untuk login manual).`)
  }

  console.log('🎉 Isi konten melalui panel admin (/admin) atau Sanity Studio (/studio).')
}

main()
  .catch((e) => {
    console.error('❌ Gagal Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
