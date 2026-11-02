'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  FileText,
  Building2,
  Share2,
  Printer,
  ChevronRight,
  Check,
  Award,
  ShieldCheck,
  Send,
  ArrowRight,
  Sparkles,
  Download,
  AlertCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react'
import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { Footer } from '@/components/layout/Footer'
import { ContactDrawerRight } from '@/components/layout/ContactDrawerRight'
import { useContactModal } from '@/hooks/useContactModal'
import { EmptyState } from '@/components/common/EmptyState'

// Gambar sampul cadangan bila admin belum mengunggah gambar program.
const FALLBACK_PROGRAM_COVER = '/tentang-kami-mahasiswa.jpeg'

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

export default function DetailProgramClient({
  initialProgram = null,
  initialPrograms = [],
}: {
  initialProgram?: any
  initialPrograms?: any[]
}) {
  const params = useParams()
  const slug = params?.slug as string
  const { openContact } = useContactModal()
  const [copied, setCopied] = useState(false)
  const [cmsProgram, setCmsProgram] = useState<any>(initialProgram)
  const [cmsPrograms, setCmsPrograms] = useState<any[]>(initialPrograms)

  // Sinkronisasi data program dari CMS berdasarkan slug / kode program
  useEffect(() => {
    // Data sudah diambil di server (SSR) untuk SEO/OG → tidak perlu fetch ulang
    if (initialProgram || initialPrograms.length > 0) return
    if (!slug) return
    fetch('/api/cms/programs')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.programs)) {
          setCmsPrograms(data.programs)
          const found = data.programs.find(
            (p: any) => p.slug === slug || p.programCode === slug || p.id === slug
          )
          if (found) setCmsProgram(found)
        }
      })
      .catch(() => {})
  }, [slug, initialProgram, initialPrograms])

  // Resolver sumber gambar sampul: validasi URL HTTPS dari CMS, fallback ke template.
  const resolveCover = (url?: string | null, fallback = ''): string => {
    const raw = String(url || '').trim()
    if (!raw) return fallback
    if (raw.startsWith('/')) return raw
    try {
      const parsed = new URL(raw)
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') return raw
    } catch {
      /* URL tidak valid → pakai fallback */
    }
    return fallback
  }

  // ─── VIEW MODEL: Prioritas data CMS, fallback placeholder template ───
  const toStrArray = (raw: unknown): string[] => {
    if (!raw) return []
    if (Array.isArray(raw)) return raw.map((h) => String(h)).filter(Boolean)
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed.map((h) => String(h)).filter(Boolean)
        return raw.trim() ? [raw] : []
      } catch {
        return raw.trim() ? [raw] : []
      }
    }
    return []
  }

  const toModules = (
    raw: unknown
  ): { day: string; title: string; desc: string; mentor: string }[] => {
    let arr: any = raw
    if (typeof raw === 'string') {
      try {
        arr = JSON.parse(raw)
      } catch {
        return []
      }
    }
    if (!Array.isArray(arr)) return []
    return arr
      .map((m: any) => ({
        day: String(m?.day ?? ''),
        title: String(m?.title ?? ''),
        desc: String(m?.desc ?? ''),
        mentor: String(m?.mentor ?? ''),
      }))
      .filter((m) => m.title)
  }

  const toTimeline = (raw: unknown): { date: string; title: string }[] => {
    let arr: any = raw
    if (typeof raw === 'string') {
      try {
        arr = JSON.parse(raw)
      } catch {
        return []
      }
    }
    if (!Array.isArray(arr)) return []
    return arr
      .map((t: any) => ({
        date: String(t?.date ?? '').trim(),
        title: String(t?.title ?? '').trim(),
      }))
      .filter((t) => t.date || t.title)
  }

  const cmsHighlights = toStrArray(cmsProgram?.highlights)
  const cmsRequirements = toStrArray(cmsProgram?.requirements)
  const cmsFacilities = toStrArray(cmsProgram?.facilities)
  const cmsModules = toModules(cmsProgram?.modules)
  const cmsTimeline = toTimeline(cmsProgram?.timeline)
  const cmsBackground = (() => {
    const raw = String(cmsProgram?.backgroundBody || '').trim()
    if (!raw) return null
    const parts = raw
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
    return parts.length > 0 ? parts : null
  })()

  // ─── VIEW MODEL: seluruh konten bersumber dari CMS (tanpa data placeholder) ───
  const view = {
    code: cmsProgram?.programCode || '—',
    edition: cmsProgram?.editionNumber || '',
    title: cmsProgram?.title || '',
    category: cmsProgram?.category || 'Program Kerja',
    status: cmsProgram?.status || '',
    statusNote: cmsProgram?.statusNote || '',
    lead: String(cmsProgram?.leadBackground || '').trim(),
    date: cmsProgram?.dateRange || '',
    duration: cmsProgram?.duration || '',
    location: cmsProgram?.locationVenue || '',
    host: cmsProgram?.hostOrganizer || '',
    quota: cmsProgram?.quota || '',
    cost: cmsProgram?.cost || '',
    author: cmsProgram?.author || 'Redaksi Suarantara',
    dateDisplay: cmsProgram?.dateDisplay || '',
    coverSrc: resolveCover(cmsProgram?.coverImageUrl, FALLBACK_PROGRAM_COVER),
    coverCaption: cmsProgram?.coverCaption || '',
    coverCredit: cmsProgram?.coverCredit || '',
    backgroundParagraphs: cmsBackground,
    highlights: cmsHighlights,
    modules: cmsModules,
    requirements: cmsRequirements,
    facilities: cmsFacilities,
    timeline: cmsTimeline,
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleRegisterWhatsapp = () => {
    const message = `Halo Panitia ${view.title} (${view.host}),\n\nSaya ingin mendaftar sebagai delegasi peserta.\n\nKode Program: ${view.code}\nNama:\nKampus:\nNo. WhatsApp:`
    window.open(`https://wa.me/6285286140817?text=${encodeURIComponent(message)}`, '_blank')
  }

  // Program kerja lainnya — murni dari data CMS (tanpa daftar contoh statis).
  const otherPrograms = cmsPrograms
    .filter((p: any) => p.slug !== slug && p.programCode !== slug && p.id !== slug)
    .slice(0, 3)
    .map((p: any) => ({
      code: p.programCode,
      title: p.title,
      date: p.dateRange,
      status: p.status,
      category: p.category,
      slug: p.slug,
    }))

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-gold/30 selection:text-navy">
      {/* ─── 1. TOPBAR STANDALONE RESMI (Warna Putih Bersih Koran dengan Scroll Show/Hide Aktif) ─── */}
      <NewspaperMasthead variant="white" />

      {/* ─── 2. MAIN CONTAINER DETAIL PROGRAM KERJA ─── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 md:pt-40 pb-16">
        
        {/* ══════════════ HEADER DETAIL PROGRAM (KORAN PROGRAM AGENDA) ══════════════ */}
        <header className="border-b-2 border-navy pb-6 mb-8">
          
          {/* A. BREADCRUMB NAVIGASI */}
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
              href="/#program"
              className="text-stone-600 hover:text-navy transition-colors font-medium hover:underline"
            >
              Program Kerja
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-gold-800 font-semibold uppercase tracking-wider">
              {view.category}
            </span>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {view.code}
            </span>
          </nav>

          {/* B. BADGE STATUS REGISTRASI & KODE CMS PROGRAM */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-emerald-700 text-white font-sans font-bold text-2xs uppercase tracking-widest shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                {view.status}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm bg-navy text-gold font-mono text-2xs font-bold uppercase tracking-wider">
                {view.code}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-stone-200 text-stone-700 font-sans text-2xs font-semibold">
                {view.category}
              </span>
            </div>

            <div className="font-mono text-2xs text-stone-500 tracking-wider">
              {view.statusNote ? (
                <span className="inline-flex items-center gap-1 text-amber-800 font-sans font-semibold not-italic">
                  <AlertCircle className="w-3 h-3" />
                  {view.statusNote}
                </span>
              ) : (
                <>
                  STATUS CMS:{' '}
                  <span className="font-bold text-emerald-700">AKTIF / TERVERIFIKASI</span>
                </>
              )}
            </div>
          </div>

          {/* C. JUDUL UTAMA PROGRAM KERJA */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0B1528] leading-[1.2] tracking-tight mb-4">
            {view.title}
          </h1>

          {/* D. SINOPSIS EXECUTIVE / RINGKASAN PROGRAM */}
          {view.lead ? (
            <p className="font-serif italic text-base sm:text-lg md:text-xl text-stone-700 leading-relaxed max-w-5xl border-l-3 border-gold pl-4 py-1 mb-6">
              &ldquo;{view.lead}&rdquo;
            </p>
          ) : null}

          {/* D2. BYLINE PROGRAM (sinkron CMS: author & editionNumber) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs sm:text-xs font-sans text-stone-500 mb-5">
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3 h-3 text-gold-700" />
              <span className="font-semibold text-stone-700">Oleh {view.author}</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="font-mono text-stone-500">{view.edition}</span>
            {view.dateDisplay ? (
              <>
                <span className="text-stone-300">•</span>
                <span className="font-mono text-stone-500">{view.dateDisplay}</span>
              </>
            ) : null}
          </div>

          {/* E. QUICK SPEC GRID PROGRAM (Spesifikasi Unik Program: Tanggal, Lokasi, Tuan Rumah, Kuota) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-stone-300 shadow-2xs text-xs font-sans">
            {/* Tanggal */}
            <div className="space-y-0.5 border-r-0 md:border-r border-stone-200 pr-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gold-700" />
                Jadwal Kegiatan:
              </span>
              <span className="font-bold text-navy text-xs sm:text-[13px] block">
                {view.date || '—'}
              </span>
              <span className="text-[10px] text-stone-500">{view.duration || 'Durasi menyesuaikan'}</span>
            </div>

            {/* Lokasi */}
            <div className="space-y-0.5 border-r-0 md:border-r border-stone-200 pr-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-700" />
                Lokasi Pelaksanaan:
              </span>
              <span className="font-bold text-navy text-xs sm:text-[13px] block truncate">
                {view.location || '—'}
              </span>
              <span className="text-[10px] text-stone-500">Lokasi Terverifikasi Redaksi</span>
            </div>

            {/* Tuan Rumah & Inisiator */}
            <div className="space-y-0.5 border-r-0 md:border-r border-stone-200 pr-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block flex items-center gap-1">
                <Building2 className="w-3 h-3 text-gold-700" />
                Penyelenggara:
              </span>
              <span className="font-bold text-navy text-xs sm:text-[13px] block truncate">
                {view.host || '—'}
              </span>
              <span className="text-[10px] text-gold-800 font-semibold">Kolaborasi Resmi</span>
            </div>

            {/* Kuota & Biaya */}
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block flex items-center gap-1">
                <Award className="w-3 h-3 text-gold-700" />
                Kuota &amp; Investasi:
              </span>
              <span className="font-bold text-emerald-800 text-xs sm:text-[13px] block">
                {view.cost || '—'}
              </span>
              <span className="text-[10px] text-stone-500">{view.quota || '—'}</span>
            </div>
          </div>

          {/* F. ACTION BAR REGISTRASI LANGSUNG & SHARE */}
          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRegisterWhatsapp}
                className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Daftar Delegasi Sekarang</span>
              </button>

              <button
                type="button"
                onClick={openContact}
                className="px-4 py-2.5 rounded-full bg-navy hover:bg-navy-900 text-white font-sans font-semibold text-xs tracking-wide flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-gold" />
                <span>Tanya Narahubung</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-stone-500 mr-1">
                Bagikan Agenda:
              </span>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Pendaftaran ${view.title} telah dibuka! Cek info lengkapnya di Suarantara: `
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                title="Bagikan ke WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com/intent/tweet"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                title="Bagikan ke X"
              >
                <TwitterXIcon className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
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
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </header>

        {/* ══════════════ GRID 2 KOLOM KORAN (KIRI: KONTEN LENGKAP PROGRAM, KANAN: SIDEBAR CMS & REGISTRASI) ══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ──────────────────────────────────────────────────────────
              KOLOM KIRI (8 KOLOM): DETAIL PROGRAM & SILABUS KORAN
          ────────────────────────────────────────────────────────── */}
          <section className="lg:col-span-8 space-y-8">
            
            {/* GAMBAR DOKUMENTASI PROGRAM KERJA */}
            <figure className="space-y-2">
              <div className="relative w-full aspect-[16/9] md:aspect-[21/10] rounded-xl overflow-hidden border border-navy/20 bg-stone-900 shadow-md">
                <Image
                  src={view.coverSrc}
                  alt={view.title}
                  fill
                  priority
                  className="object-cover object-center filter contrast-[1.02] brightness-95"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-gold text-navy font-bold text-[10px] font-sans uppercase tracking-widest shadow-md">
                  AGENDA UTAMA MAHASISWA NUSANTARA
                </div>
              </div>
              <figcaption className="text-2xs sm:text-xs font-sans text-stone-600 border-l-2 border-gold-600 pl-3 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>{view.coverCaption}</span>
                <span className="font-mono text-stone-500 shrink-0 italic text-[10px]">
                  {view.coverCredit}
                </span>
              </figcaption>
            </figure>

            {/* LATAR BELAKANG & TUJUAN STRATEGIS PROGRAM */}
            <div className="bg-white rounded-xl border border-stone-300 p-6 shadow-xs space-y-4">
              <div className="border-b border-navy/15 pb-2.5 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gold-700" />
                  Latar Belakang &amp; Urgensi Gerakan
                </h3>
                <span className="text-2xs font-mono text-stone-500 font-semibold">
                  TOR DOKUMEN RESMI
                </span>
              </div>

              {view.backgroundParagraphs ? (
                <div className="text-sm font-sans text-stone-700 leading-relaxed space-y-3.5 text-justify">
                  {view.backgroundParagraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="Latar Belakang Belum Diisi"
                  description="Redaksi belum melengkapi latar belakang & urgensi program ini. Uraian lengkap akan tampil otomatis setelah admin mengisinya dari CMS."
                />
              )}
            </div>

            {/* STRUKTUR SILABUS (CMS: Fokus Materi / Fallback: Modul Pembelajaran) */}
            <div className="space-y-4">
              <div className="border-b border-navy/20 pb-2 flex items-center justify-between">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-navy flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold-700" />
                  {view.highlights.length > 0
                    ? 'Fokus Materi & Capaian Program'
                    : 'Silabus Kurikulum & Jadwal Pelatihan'}
                </h3>
                <span className="text-2xs font-sans text-stone-500">
                  {view.highlights.length > 0
                    ? `${view.highlights.length} Fokus Utama Terstandarisasi`
                    : view.modules.length > 0
                      ? `${view.modules.length} Modul Utama Terstandarisasi`
                      : 'Menunggu Input Redaksi'}
                </span>
              </div>

              {view.highlights.length > 0 ? (
                /* Sumber: field `highlights` dari CMS */
                <div className="grid grid-cols-1 gap-3.5">
                  {view.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-xl bg-white border border-stone-300 hover:border-gold transition-all shadow-xs flex flex-col sm:flex-row items-start gap-4 group"
                    >
                      <div className="px-3 py-1.5 rounded-md bg-navy text-gold font-mono font-extrabold text-xs shrink-0 tracking-wider">
                        FOKUS {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-navy transition-colors">
                          {item}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              ) : view.modules.length > 0 ? (
                /* Sumber: field `modules` dari CMS */
                <div className="grid grid-cols-1 gap-3.5">
                  {view.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-xl bg-white border border-stone-300 hover:border-gold transition-all shadow-xs flex flex-col sm:flex-row items-start gap-4 group"
                    >
                      <div className="px-3 py-1.5 rounded-md bg-navy text-gold font-mono font-extrabold text-xs shrink-0 tracking-wider">
                        {mod.day || `HARI KE-${idx + 1}`}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-navy transition-colors">
                          {mod.title}
                        </h4>
                        {mod.desc ? (
                          <p className="text-xs font-sans text-stone-600 leading-relaxed text-justify">
                            {mod.desc}
                          </p>
                        ) : null}
                        {mod.mentor ? (
                          <div className="pt-1 flex items-center gap-1.5 text-2xs font-sans text-gold-800 font-semibold">
                            <Users className="w-3 h-3 text-gold-700" />
                            <span>Fasilitator: {mod.mentor}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="Materi Program Belum Disusun"
                  description="Fokus materi atau silabus kurikulum belum diisi redaksi. Rangkaian materi akan tampil otomatis setelah dilengkapi dari CMS."
                />
              )}
            </div>

            {/* SYARAT KELAYAKAN & FASILITAS PESERTA (2 Kolom Kartu Elegan) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Syarat Pendaftaran */}
              <div className="p-5 rounded-xl bg-white border border-stone-300 shadow-xs space-y-3">
                <h4 className="font-serif text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2 border-b border-navy/10 pb-2">
                  <AlertCircle className="w-4 h-4 text-crimson" />
                  Kriteria &amp; Syarat Delegasi
                </h4>
                {view.requirements.length > 0 ? (
                  <ul className="space-y-2 text-xs font-sans text-stone-700">
                    {view.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-crimson shrink-0 mt-1.5" />
                        <span className="leading-snug">{req}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    variant="compact"
                    icon={AlertCircle}
                    title="Syarat Belum Diisi"
                    description="Kriteria & syarat delegasi akan tampil setelah redaksi melengkapinya."
                  />
                )}
              </div>

              {/* Fasilitas Terjamin */}
              <div className="p-5 rounded-xl bg-amber-50/60 border border-gold/40 shadow-xs space-y-3">
                <h4 className="font-serif text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2 border-b border-gold/30 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-700" />
                  Fasilitas Peserta (100% Didanai)
                </h4>
                {view.facilities.length > 0 ? (
                  <ul className="space-y-2 text-xs font-sans text-stone-800">
                    {view.facilities.map((fac, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                        <span className="leading-snug">{fac}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    variant="compact"
                    icon={CheckCircle2}
                    title="Fasilitas Belum Diisi"
                    description="Rincian fasilitas peserta akan tampil setelah redaksi melengkapinya."
                  />
                )}
              </div>

            </div>

            {/* KOTAK AJAKAN PENDAFTARAN BAWAH */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-navy-950 via-[#0B1528] to-navy-900 text-white border border-gold/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 text-gold text-xs font-sans font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{view.quota ? `Kesempatan Terbatas: ${view.quota}` : 'Pendaftaran Delegasi Dibuka'}</span>
                </span>
                <h4 className="font-serif text-lg font-bold text-white">
                  Daftarkan Diri Anda Sebagai Delegasi Program
                </h4>
                <p className="text-xs font-sans text-stone-300 max-w-xl">
                  Seleksi didasarkan pada proposal liputan dan komitmen integritas. Narahubung Suarantara akan mengonfirmasi berkas Anda dalam 1x24 jam.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRegisterWhatsapp}
                className="px-6 py-3 rounded-full bg-gold hover:bg-gold-400 text-navy font-sans font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-gold/30 shrink-0 cursor-pointer active:scale-95"
              >
                Daftar via WhatsApp Sekarang
              </button>
            </div>

          </section>

          {/* ──────────────────────────────────────────────────────────
              KOLOM KANAN (4 KOLOM): SIDEBAR CMS, TIMELINE & MITRA
          ────────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* 1. KOTAK TIMELINE & STATUS SELEKSI REGISTRASI */}
            <div className="bg-white rounded-xl border border-stone-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-navy/15 pb-2.5">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold-700" />
                  Timeline Seleksi Program
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Dibuka
                </span>
              </div>

              {view.timeline.length > 0 ? (
                <div className="space-y-3 pt-1 text-xs font-sans">
                  {view.timeline.map((step, idx) => {
                    const dotColors = ['bg-emerald-600', 'bg-amber-500', 'bg-blue-600', 'bg-navy']
                    const isLast = idx === view.timeline.length - 1
                    return (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]} shrink-0 mt-1.5`}
                        />
                        <div>
                          <span className={`font-bold block ${isLast ? 'text-navy' : 'text-stone-900'}`}>
                            {step.date}
                          </span>
                          <span className="text-2xs text-stone-500">{step.title}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  variant="compact"
                  icon={Clock}
                  title="Timeline Belum Disusun"
                  description="Tahapan seleksi akan tampil setelah redaksi melengkapinya dari CMS."
                />
              )}

              <div className="pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleRegisterWhatsapp}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>Kirim Berkas Pendaftaran</span>
                </button>
              </div>
            </div>

            {/* 2. PROFIL PENYELENGGARA (bersumber dari data CMS) */}
            {view.host ? (
              <div className="bg-[#0B1528] text-white rounded-xl border border-gold/40 p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-gold text-2xs font-mono uppercase tracking-widest border-b border-white/10 pb-2">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Kampus / Lembaga Penyelenggara</span>
                </div>
                <h4 className="font-serif text-base font-bold text-white leading-tight">
                  {view.host}
                </h4>
                <p className="text-2xs font-sans text-stone-300 leading-relaxed">
                  {view.host} bertindak sebagai penyelenggara program ini. Detail lokasi, fasilitas,
                  dan informasi teknis akan dikonfirmasi langsung oleh narahubung resmi Suarantara.
                </p>
                <div className="pt-1 flex items-center justify-between text-2xs font-mono text-stone-400">
                  <span className="truncate max-w-[180px]">{view.location || 'Lokasi menyesuaikan'}</span>
                  <span className="text-gold">Penyelenggara</span>
                </div>
              </div>
            ) : null}

            {/* 3. PROGRAM STRATEGIS LAINNYA */}
            <div className="bg-white rounded-xl border border-stone-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-navy/15 pb-2">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-navy">
                  Program Kerja Lainnya
                </span>
                <Link
                  href="/#program"
                  className="text-[10px] font-sans font-bold text-gold-800 hover:text-navy transition-colors"
                >
                  Lihat Semua
                </Link>
              </div>

              {otherPrograms.length > 0 ? (
                <div className="divide-y divide-stone-100 space-y-3 pt-1">
                  {otherPrograms.map((op, idx) => (
                    <article key={idx} className="pt-3 first:pt-0 group">
                      <span className="text-[9px] font-mono font-bold text-gold-800 uppercase block mb-1">
                        {op.code} • {op.category}
                      </span>
                      <h5 className="font-serif text-xs font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug line-clamp-2">
                        <Link href={`/program/${op.slug}`}>{op.title}</Link>
                      </h5>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-sans text-stone-500">
                        <span>{op.date}</span>
                        <span className="font-medium text-stone-700">{op.status}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  variant="compact"
                  icon={BookOpen}
                  title="Belum Ada Program Lain"
                  description="Program kerja lainnya akan tampil setelah redaksi menerbitkannya."
                />
              )}
            </div>

          </aside>

        </div>

      </main>

      {/* ─── 3. FOOTER ─── */}
      <Footer />

      {/* ─── 4. POPUP DRAWER KONTAK ─── */}
      <ContactDrawerRight />
    </div>
  )
}
