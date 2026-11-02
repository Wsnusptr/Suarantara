import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

/**
 * Pemulihan "data bersih": menghapus SELURUH record konten dummy dari database
 * agar portal menampilkan murni data asli yang diinput admin.
 *
 * YANG DIPERTAHANKAN: tabel autentikasi (User, Account, Session,
 * VerificationToken) dan FcmToken — sehingga akun superadmin & sesi tetap utuh.
 *
 * Penggunaan (pastikan DATABASE_URL/DIRECT_URL di .env sudah valid):
 *   pnpm db:clean        (atau: node --experimental-strip-types prisma/cleanup-dummy.ts)
 */
async function main() {
  console.log('🧹 Memulai pembersihan data konten dummy...')

  // Hitung dulu agar laporan transparan.
  const before = {
    articles: await db.article.count(),
    videoReels: await db.videoReel.count(),
    pollOptions: await db.pollOption.count(),
    polls: await db.poll.count(),
    quotes: await db.quoteAspiration.count(),
    advocacyCases: await db.advocacyCase.count(),
    advocacyDocuments: await db.advocacyDocument.count(),
    petitions: await db.petition.count(),
    whistleblowerReports: await db.whistleblowerReport.count(),
    researchPapers: await db.researchPaper.count(),
    observatoryIndicators: await db.observatoryIndicator.count(),
    policyRecommendations: await db.policyRecommendationItem.count(),
    researchEvents: await db.researchEvent.count(),
    partners: await db.partner.count(),
    programs: await db.program.count(),
    tickerItems: await db.tickerItem.count(),
    voices: await db.voice.count(),
  }

  // Urutan penting: hapus anak (PollOption) sebelum induk (Poll).
  await db.pollOption.deleteMany()
  await db.poll.deleteMany()

  await db.article.deleteMany()
  await db.videoReel.deleteMany()
  await db.quoteAspiration.deleteMany()
  await db.advocacyCase.deleteMany()
  await db.advocacyDocument.deleteMany()
  await db.petition.deleteMany()
  await db.whistleblowerReport.deleteMany()
  await db.researchPaper.deleteMany()
  await db.observatoryIndicator.deleteMany()
  await db.policyRecommendationItem.deleteMany()
  await db.researchEvent.deleteMany()
  await db.partner.deleteMany()
  await db.program.deleteMany()
  await db.tickerItem.deleteMany()
  await db.voice.deleteMany()

  console.log('✅ Pembersihan selesai. Ringkasan record yang dihapus:')
  for (const [key, value] of Object.entries(before)) {
    console.log(`   • ${key}: ${value}`)
  }
  console.log('ℹ️  Tabel User/Account/Session/VerificationToken/FcmToken TIDAK diubah.')
}

main()
  .catch((e) => {
    console.error('❌ Gagal membersihkan data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
