'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Calendar,
  Clock,
  Eye,
  User,
  Share2,
  Bookmark,
  Printer,
  ChevronRight,
  Check,
  MessageSquare,
  TrendingUp,
  Newspaper,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { Footer } from '@/components/layout/Footer'
import { ContactDrawerRight } from '@/components/layout/ContactDrawerRight'
import { useContactModal } from '@/hooks/useContactModal'
import { EmptyState } from '@/components/common/EmptyState'

// SVG Icons for clean social shares
function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function TwitterXIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TelegramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z" />
    </svg>
  )
}

const FALLBACK_COVER = '/tentang-kami-mahasiswa.jpeg'
// Hanya izinkan gambar dari host yang terdaftar di next.config (cakupan aman).
// URL lain jatuh ke gambar fallback agar tidak memicu error optimasi gambar.
function resolveCover(url?: string | null): string {
  if (!url) return FALLBACK_COVER
  const trimmed = String(url).trim()
  if (!trimmed) return FALLBACK_COVER
  if (trimmed.startsWith('/')) return trimmed
  if (
    /^https:\/\/(cdn\.sanity\.io|lh3\.googleusercontent\.com|[a-z0-9-]+\.supabase\.co)\//i.test(trimmed)
  ) {
    return trimmed
  }
  return FALLBACK_COVER
}

export default function DetailBeritaClient({ initialArticle = null }: { initialArticle?: any }) {
  const params = useParams()
  const slug = params?.slug as string
  const { openContact } = useContactModal()
  const [copied, setCopied] = useState(false)
  const [fontSizeClass, setFontSizeClass] = useState<'text-base' | 'text-lg'>('text-base')
  const [dbArticle, setDbArticle] = useState<any>(initialArticle)
  const [allArticles, setAllArticles] = useState<any[]>([])

  // Sinkronisasi data dari CMS: artikel ini (bila belum di-SSR) + daftar warta lain untuk sidebar.
  useEffect(() => {
    fetch('/api/cms/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.articles)) {
          setAllArticles(data.articles)
          if (!initialArticle) {
            const found = data.articles.find((a: any) => a.slug === slug)
            if (found) setDbArticle(found)
          }
        }
      })
      .catch(() => {})
  }, [slug, initialArticle])

  // ─── Nilai terintegrasi: seluruh konten bersumber dari CMS ───
  const cmsTags: string[] = (() => {
    try {
      const parsed = JSON.parse(dbArticle?.tags || '[]')
      return Array.isArray(parsed) ? parsed.filter((t) => typeof t === 'string') : []
    } catch {
      return []
    }
  })()
  // Naskah dari CMS dirender sebagai paragraf (aman, tanpa HTML mentah)
  const cmsParagraphs: string[] | null = (() => {
    const raw: string = String(dbArticle?.content || '').trim()
    if (!raw) return null
    const parts = raw
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
    return parts.length > 0 ? parts : null
  })()

  // Estimasi waktu baca dihitung dari panjang naskah (asumsi 200 kata/menit)
  const wordCount = String(dbArticle?.content || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} Menit Baca`

  const view = {
    title: dbArticle?.title || 'Warta Suarantara',
    category: dbArticle?.category || 'Warta',
    subcategory: dbArticle?.kickerBadge || '',
    editionCode: dbArticle?.editionBadge || '—',
    leadDeck: dbArticle?.leadExcerpt || '',
    authorName: dbArticle?.authorName || 'Redaksi Suarantara',
    authorRole: dbArticle?.authorRole || 'Redaksi',
    publishedAt: dbArticle?.dateDisplay || '',
    views: dbArticle?.viewsDisplay || '0',
    coverSrc: resolveCover(dbArticle?.coverImageUrl),
    coverCaption: dbArticle?.coverCaption || '',
    coverCredit: dbArticle?.coverCredit || '',
    tags: cmsTags,
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  // Warta terkait & isu terpopuler — sepenuhnya diturunkan dari data CMS (tanpa konten palsu).
  const relatedNews = allArticles
    .filter((a: any) => a.slug !== slug)
    .slice(0, 4)
    .map((a: any) => ({
      slug: String(a.slug || ''),
      title: String(a.title || ''),
      category: String(a.category || 'Warta'),
      date: String(a.dateDisplay || ''),
      views: String(a.viewsDisplay || '0'),
    }))

  const trendingTopics = allArticles
    .filter((a: any) => a.isTrending)
    .slice(0, 4)
    .map((a: any, idx: number) => ({
      no: String(a.rankingNo || '').trim() || String(idx + 1).padStart(2, '0'),
      title: String(a.title || ''),
      views: String(a.viewsDisplay || '0'),
    }))

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-gold/30 selection:text-navy">
      {/* ─── 1. TOPBAR STANDALONE RESMI (Warna Putih Bersih Koran dengan Scroll Show/Hide Aktif) ─── */}
      <NewspaperMasthead variant="white" />

      {/* ─── 2. CONTAINER UTAMA DETAIL ARTIKEL KORAN ─── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 md:pt-40 pb-16">
        
        {/* ══════════════ HEADER ARTIKEL GAYA KORAN PROFESIONAL ══════════════ */}
        <header className="border-b-2 border-navy pb-6 mb-8">
          
          {/* A. BREADCRUMBS FORMAL (Berita / Kategori / Subkategori / Judul) */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-2xs sm:text-xs font-sans text-stone-500 mb-4 pb-2 border-b border-stone-200"
          >
            <Link
              href="/"
              className="text-stone-600 hover:text-navy transition-colors font-medium hover:underline"
            >
              Beranda
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <Link
              href="/#media"
              className="text-stone-600 hover:text-navy transition-colors font-medium hover:underline"
            >
              Media &amp; Warta
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-gold-800 font-semibold uppercase tracking-wider">
              {view.category}
            </span>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {view.title}
            </span>
          </nav>

          {/* B. LABEL KATEGORI & KODE EDISI KORAN */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm bg-navy text-gold font-sans font-bold text-2xs uppercase tracking-widest shadow-xs">
                <Newspaper className="w-3 h-3 text-gold" />
                {view.category}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-gold/15 text-gold-900 border border-gold/30 font-sans text-2xs font-semibold uppercase tracking-wider">
                {view.subcategory}
              </span>
            </div>

            <div className="font-mono text-2xs text-stone-500 tracking-wider">
              NO. EDISI: <span className="font-bold text-navy">{view.editionCode}</span>
            </div>
          </div>

          {/* C. HEADLINE / JUDUL UTAMA BESAR KLASIK KORAN */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#0B1528] leading-[1.18] tracking-tight mb-4">
            {view.title}
          </h1>

          {/* D. SINOPSIS / EDITORIAL LEAD DECK (Miring Elegan Khas Jurnalistik Berbobot) */}
          <p className="font-serif italic text-base sm:text-lg md:text-xl text-stone-700 leading-relaxed max-w-5xl border-l-3 border-gold pl-4 py-1 mb-6">
            &ldquo;{view.leadDeck}&rdquo;
          </p>

          {/* E. BARIS METADATA LENGKAP: PENULIS, EDITOR, WAKTU UPLOAD, ESTIMASI BACA & SISI KANAN (SHARE + VIEWS) */}
          <div className="pt-4 border-t border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans text-stone-600">
            
            {/* Sisi Kiri: Detail Redaksi & Waktu (Tanpa Views) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
              {/* Penulis */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center text-navy font-bold text-xs shrink-0">
                  {view.authorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-stone-900 leading-tight">
                    {view.authorName}
                  </div>
                  <div className="text-[10px] text-stone-500 font-light">
                    {view.authorRole}
                  </div>
                </div>
              </div>

              <span className="hidden sm:inline text-stone-300">•</span>

              {/* Tanggal & Waktu Upload */}
              <div className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
                <Calendar className="w-3.5 h-3.5 text-gold-700" />
                <span>{view.publishedAt}</span>
              </div>

              <span className="hidden sm:inline text-stone-300">•</span>

              {/* Estimasi Waktu Baca */}
              <div className="inline-flex items-center gap-1 text-stone-600">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{readingTime}</span>
              </div>
            </div>

            {/* Sisi Kanan: Bagikan Sosmed, Salin, Print & TEPAT DI BAWAHNYA VIEWS COUNTER */}
            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 self-start md:self-auto">
              
              {/* Baris Atas: Jejeran Icon Sosmed, Salin Tautan & Cetak */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-stone-500 mr-1 hidden sm:inline">
                  Bagikan:
                </span>

                {/* WhatsApp Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${view.title} - Baca selengkapnya di Suarantara: `
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Bagikan ke WhatsApp"
                  className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com/intent/tweet"
                  target="_blank"
                  rel="noreferrer"
                  title="Bagikan ke X"
                  className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <TwitterXIcon className="w-3 h-3" />
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/share/url"
                  target="_blank"
                  rel="noreferrer"
                  title="Bagikan ke Telegram"
                  className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <TelegramIcon className="w-3.5 h-3.5" />
                </a>

                {/* Tombol Salin Tautan */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Salin Tautan Artikel"
                  className="px-2.5 py-1 rounded-full border border-stone-300 hover:border-gold bg-white text-stone-700 hover:text-navy text-[11px] font-sans font-medium flex items-center gap-1 transition-colors shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3 h-3 text-stone-500" />
                      <span>Salin</span>
                    </>
                  )}
                </button>

                {/* Cetak Artikel */}
                <button
                  type="button"
                  onClick={handlePrint}
                  title="Cetak Artikel (Format Cetak Koran)"
                  className="w-7 h-7 rounded-full border border-stone-300 hover:border-navy bg-white text-stone-600 hover:text-navy flex items-center justify-center transition-colors shadow-2xs hidden sm:flex"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Baris Bawah di Kanan: Total Views Pembaca (Tepat di Bawah Bagikan Sosmed) */}
              <div className="flex items-center gap-1.5 text-2xs font-sans text-stone-500">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Total Dibaca:</span>
                <div className="inline-flex items-center gap-1 font-mono font-bold text-navy bg-gold/15 border border-gold/30 px-2 py-0.5 rounded text-[11px]">
                  <Eye className="w-3 h-3 text-gold-700" />
                  <span>{view.views} Pembaca</span>
                </div>
              </div>

            </div>

          </div>

        </header>

        {/* ══════════════ GRID KONTEN 2 KOLOM (KIRI: ARTIKEL UTAMA, KANAN: SIDEBAR WARTA) ══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ──────────────────────────────────────────────────────────
              KOLOM KIRI (8 KOLOM): KONTEN ARTIKEL JURNALISTIK UTAMA
          ────────────────────────────────────────────────────────── */}
          <article className="lg:col-span-8 space-y-7">
            
            {/* GAMBAR UTAMA DENGAN CAPTION FORMAL KORAN */}
            <figure className="space-y-2">
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/10] rounded-xl overflow-hidden border border-navy/20 bg-stone-900 shadow-md">
                <Image
                  src={view.coverSrc}
                  alt={view.title}
                  fill
                  priority
                  className="object-cover object-center filter contrast-[1.02] brightness-95"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
                {/* Vintage vignette edge overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                
                {/* Photo stamp */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-black/75 backdrop-blur-md text-[10px] font-mono text-stone-200 border border-white/10">
                  DOKUMENTASI EKSKLUSIF
                </div>
              </div>

              {/* Caption & Hak Cipta Foto */}
              <figcaption className="text-2xs sm:text-xs font-sans text-stone-600 border-l-2 border-gold-600 pl-3 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>{view.coverCaption}</span>
                <span className="font-mono text-stone-500 shrink-0 italic text-[10px]">
                  {view.coverCredit}
                </span>
              </figcaption>
            </figure>

            {/* KONTROL UKURAN HURUF BACA (Klasik & Nyaman untuk Pengguna) */}
            <div className="flex items-center justify-between py-2 border-y border-stone-200/70 text-2xs font-sans text-stone-500">
              <span className="italic font-serif">Format Baca: Font Standar Koran Kompak</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-stone-400">Ukuran Teks:</span>
                <button
                  type="button"
                  onClick={() => setFontSizeClass('text-base')}
                  className={`px-2 py-0.5 rounded border text-xs font-serif ${
                    fontSizeClass === 'text-base'
                      ? 'bg-navy text-white border-navy font-bold'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-navy'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => setFontSizeClass('text-lg')}
                  className={`px-2 py-0.5 rounded border text-sm font-serif ${
                    fontSizeClass === 'text-lg'
                      ? 'bg-navy text-white border-navy font-bold'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-navy'
                  }`}
                >
                  A+
                </button>
              </div>
            </div>

            {/* ISI BODY ARTIKEL DENGAN DROP CAP & TIPOGRAFI KLASIK */}
            <div
              className={`font-sans leading-[1.8] text-stone-800 space-y-5 transition-all ${
                fontSizeClass === 'text-lg' ? 'text-lg leading-[1.9]' : 'text-base'
              }`}
            >
              {cmsParagraphs ? (
                cmsParagraphs.map((para, i) => (
                  <p
                    key={i}
                    className={`text-justify whitespace-pre-line ${
                      i === 0
                        ? 'first-letter:font-serif first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-extrabold first-letter:text-navy first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:pt-1'
                        : ''
                    }`}
                  >
                    {para}
                  </p>
                ))
              ) : (
                <EmptyState
                  icon={Newspaper}
                  title="Naskah Warta Belum Tersedia"
                  description="Redaksi sedang melengkapi isi lengkap warta ini. Silakan kembali beberapa saat lagi untuk membaca versi utuhnya."
                />
              )}
            </div>

            {/* ═════════ KOTAK BIOGRAFI PENULIS (TENTANG PENULIS) ═════════ */}
            <div className="mt-10 p-5 rounded-xl bg-white border border-stone-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-navy text-gold flex items-center justify-center font-serif font-extrabold text-xl shrink-0 border-2 border-gold shadow-xs">
                {view.authorName.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-navy">
                    {view.authorName}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-gold/20 text-gold-900 border border-gold/40">
                    {view.authorRole}
                  </span>
                </div>
                <p className="text-xs font-sans text-stone-600 leading-relaxed">
                  {view.authorName} menulis untuk kanal Media Suarantara sebagai {view.authorRole}.
                  Tulisan ini bagian dari ikhtiar menghadirkan advokasi independen, nalar kajian, dan
                  informasi terverifikasi bagi mahasiswa Nusantara.
                </p>
              </div>
            </div>

            {/* ═════════ TAG TOPIK ARTIKEL KORAN ═════════ */}
            <div className="pt-4 border-t border-stone-200">
              <span className="block text-2xs font-sans font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                Topik Terkait Artikel:
              </span>
              <div className="flex flex-wrap gap-2">
                {view.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md text-xs font-sans bg-stone-100 hover:bg-gold/15 text-stone-700 hover:text-navy border border-stone-200 transition-colors cursor-pointer"
                  >
                    #{tag.replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>

            {/* ═════════ KOTAK AJAKAN KIRIM SUARA / TANGGAPAN ═════════ */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-navy-950 via-[#0B1528] to-navy-900 text-white border border-gold/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-gold text-xs font-sans font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ruang Aspirasi &amp; Balasan Opini</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-white">
                  Punya Pandangan Berbeda atau Aduan Kasus Kampus?
                </h4>
                <p className="text-xs font-sans text-stone-300 max-w-xl">
                  Redaksi Suarantara membuka ruang tanggapan terbuka bagi seluruh mahasiswa dan akademisi. Tulisan atau aduan Anda akan ditinjau langsung oleh dewan redaksi.
                </p>
              </div>

              <button
                type="button"
                onClick={openContact}
                className="px-5 py-2.5 rounded-full bg-gold hover:bg-gold-400 text-navy font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-gold/30 shrink-0 cursor-pointer"
              >
                Kirim Tanggapan / Aspirasi
              </button>
            </div>

          </article>

          {/* ──────────────────────────────────────────────────────────
              KOLOM KANAN (4 KOLOM): SIDEBAR KLASIK KORAN
          ────────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* 1. KOTAK WARTA TERKAIT & PILIHAN REDAKSI */}
            <div className="bg-white rounded-xl border border-stone-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-navy/15 pb-2.5">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gold-700" />
                  Warta Terkait Pilihan Redaksi
                </span>
                <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
              </div>

              {relatedNews.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={BookOpen}
                  title="Belum Ada Warta Lain"
                  description="Warta terkait akan tampil otomatis begitu redaksi menerbitkan artikel baru."
                />
              ) : (
                <div className="divide-y divide-stone-100 space-y-3.5 pt-1">
                  {relatedNews.map((news, idx) => (
                    <article key={idx} className="pt-3 first:pt-0 group cursor-pointer">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-800 block mb-1">
                        {news.category}
                      </span>
                      <h4 className="font-serif text-xs sm:text-[13px] font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug line-clamp-2">
                        <Link href={`/berita/${news.slug}`}>{news.title}</Link>
                      </h4>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-sans text-stone-500">
                        <span>{news.date}</span>
                        <span className="inline-flex items-center gap-1 font-mono text-gold-800 font-semibold">
                          <Eye className="w-2.5 h-2.5" />
                          {news.views}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* 2. ISU TERPOPULER PEKAN INI (Numbered List 1-4) */}
            <div className="bg-white rounded-xl border border-stone-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-navy/15 pb-2.5">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-gold-700" />
                  Trending Isu Kampus
                </span>
                <span className="text-[10px] font-sans text-stone-500">Minggu Ini</span>
              </div>

              {trendingTopics.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={TrendingUp}
                  title="Belum Ada Isu Trending"
                  description="Daftar isu terpopuler akan tersusun otomatis dari artikel yang ditandai redaksi."
                />
              ) : (
                <div className="space-y-3 pt-1">
                  {trendingTopics.map((item) => (
                    <div key={item.no} className="flex items-start gap-3 group cursor-pointer">
                      <span className="font-serif font-black text-xl text-stone-300 group-hover:text-gold transition-colors leading-none shrink-0 w-6">
                        {item.no}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-xs font-bold text-stone-800 group-hover:text-navy transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h5>
                        <span className="text-[10px] font-mono text-stone-500 mt-1 block">
                          {item.views} Pembaca
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. KARTU INTI KEMITRAAN & INISIASI BEM STMIK JAYAKARTA */}
            <div className="bg-[#0B1528] text-white rounded-xl border border-gold/40 p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gold block">
                Konsorsium Kolaborasi
              </span>
              <h4 className="font-serif text-base font-bold text-white leading-tight">
                Diinisiasi oleh BEM STMIK Jayakarta &amp; Mahasiswa Nusantara
              </h4>
              <p className="text-2xs font-sans text-stone-300 leading-relaxed">
                Suarantara lahir pada 15 Oktober 2026 atas inisiatif Wisnu Saputra (Wapresma BEM STMIK Jayakarta) demi menghadirkan jembatan advokasi independen, nalar kajian ilmiah, dan media kebenaran.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/#partners"
                  className="text-xs font-serif font-bold text-gold hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>Lihat Profil Mitra Lengkap</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </aside>

        </div>

      </main>

      {/* ─── 3. FOOTER RESMI KORAN SUARANTARA ─── */}
      <Footer />

      {/* ─── 4. POPUP DRAWER KONTAK SISI KANAN (WhatsApp & Instagram) ─── */}
      <ContactDrawerRight />
    </div>
  )
}
