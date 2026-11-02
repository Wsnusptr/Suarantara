import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

/**
 * Seeding minimal: hanya menyiapkan akun superadmin untuk login panel CMS.
 * Seluruh konten (berita, program, advokasi, kajian, mitra, dsb.) diisi
 * sepenuhnya melalui input admin / CMS — tanpa data dummy.
 *
 * File ini idempoten (upsert) dan TIDAK menghapus data apa pun.
 */
async function main() {
  console.log('🌱 Memulai Seeding Akun Superadmin Suarantara...')

  await db.user.upsert({
    where: { email: 'admin@suarantara.org' },
    update: {},
    create: {
      name: 'Wisnu Saputra (Superadmin)',
      email: 'admin@suarantara.org',
      role: 'SUPERADMIN',
    },
  })

  console.log('✅ Seeding Akun Superadmin Selesai! Isi konten melalui panel admin.')
}

main()
  .catch((e) => {
    console.error('❌ Gagal Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
