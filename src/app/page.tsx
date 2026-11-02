import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { HeroVideoSection } from '@/components/sections/HeroVideoSection'
import { PartnerCarousel3D } from '@/components/sections/PartnerCarousel3D'
import { PillarContentSection } from '@/components/sections/PillarContentSection'
import { VideoReelsCarousel } from '@/components/sections/VideoReelsCarousel'
import { CategoryContentSection } from '@/components/sections/CategoryContentSection'
import { StudentVoiceCtaSection } from '@/components/sections/StudentVoiceCtaSection'
import { Footer } from '@/components/layout/Footer'
import { ContactDrawerRight } from '@/components/layout/ContactDrawerRight'
import { VantaTopologyBackground } from '@/components/ui/VantaTopologyBackground'

export default function Home() {
  return (
    <div className="relative min-h-screen text-stone-900 flex flex-col selection:bg-gold/30 selection:text-navy">
      {/* ─── 1. ANIMATED TOPOLOGY BACKGROUND (Vanta.js: White Canvas + Navy Topology Lines) ─── */}
      <VantaTopologyBackground />

      {/* ─── 2. TOPBAR OVERLAY (Transparent over Video with Rolling Door Hide/Show on Scroll) ─── */}
      <NewspaperMasthead />

      {/* ─── 3. HERO VIDEO BANNER (vid-banner.mp4 + Overlay Gelap + Tiga Pilar Buttons) ─── */}
      <HeroVideoSection />

      {/* ─── 4. 3D LIVING PARTNER CAROUSEL (Logo Proporsional & Otomatis Slide 3D Focus) ─── */}
      <PartnerCarousel3D />

      {/* ─── 5. PILAR SECTION (Default: MEDIA dengan Dropdown Selector ke ADVOKASI & KAJIAN)
               Kiri: Banner Berita Utama (Judul di Atas Gambar) + 2-Grid Berita Persegi
               Kanan: Rekomendasi Untuk Anda (Maks 7) + Topik Terpopuler & Tren Isu Minggu Ini ─── */}
      <PillarContentSection />

      {/* ─── 6. VIDEO REELS CAROUSEL (Full Layar Horizontal, Rasio 9:16 Portrait TikTok-style, Auto-slide) ─── */}
      <VideoReelsCarousel />

      {/* ─── 7. KATEGORI BERITA RESMI (6 Kategori: Politik, Hukum, Peristiwa, Pendidikan, Kesehatan, Sosbud)
               Kiri: Tab Kategori + Grid Berita
               Kanan: Suara Mahasiswa (Polling Interaktif, Kutipan Tokoh BEM, & Slot Kolaborasi) ─── */}
      <CategoryContentSection />

      {/* ─── 8. CTA SECTION DENGAN 3D POP-OUT STUDENT REPRESENTATIVE
               "Punya Berita, Aspirasi, atau Riset Kampus yang Ingin Dipublikasikan?" ─── */}
      <StudentVoiceCtaSection />

      {/* ─── 9. FOOTER LENGKAP (Logo, Profil, Lampiran, Tiga Pilar, Kontak Redaksi, Privacy Policy) ─── */}
      <Footer />

      {/* ─── 10. DRAWER KONTAK SISI KANAN (Instagram, WhatsApp 085286140817, & Form Kirim Pesan) ─── */}
      <ContactDrawerRight />
    </div>
  )
}
