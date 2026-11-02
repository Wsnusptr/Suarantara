'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Scale,
  Calendar,
  Clock,
  Eye,
  Users,
  ShieldCheck,
  FileText,
  Download,
  Share2,
  Printer,
  ChevronRight,
  Check,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gavel,
  Building2,
  AlertCircle,
} from 'lucide-react'
import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { Footer } from '@/components/layout/Footer'
import { ContactDrawerRight } from '@/components/layout/ContactDrawerRight'
import { useContactModal } from '@/hooks/useContactModal'
import { EmptyState } from '@/components/common/EmptyState'

// Gambar dokumentasi cadangan bila admin belum melampirkan berkas visual.
const FALLBACK_ADVOKASI_COVER = '/tentang-kami-mahasiswa.jpeg'

// Empat milestone generik tahapan advokasi (bukan label fiktif per-kasus).
const STEP_MILESTONES = [
  'Verifikasi Aduan',
  'Konsolidasi Aliansi',
  'Somasi Terbuka',
  'Litigasi & Putusan',
]

// Parse JSON secara aman → selalu array (mencegah crash bila data lama/kosong).
function parseArray<T = unknown>(raw: unknown): T[] {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

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

export default function DetailAdvokasiClient({ initialCase = null }: { initialCase?: any }) {
  const params = useParams()
  const slug = params?.slug as string
  const { openContact } = useContactModal()
  const [copied, setCopied] = useState(false)
  const [supportSubmitted, setSupportSubmitted] = useState(false)
  const [cmsCase, setCmsCase] = useState<any>(initialCase)
  const [allCases, setAllCases] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])

  // Sinkronisasi data kasus dari CMS: kasus ini (bila belum di-SSR) + daftar kasus lain.
  useEffect(() => {
    fetch('/api/cms/advocacy')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.cases)) {
          setAllCases(data.cases)
          if (!initialCase) {
            const found = data.cases.find(
              (c: any) => c.slug === slug || c.caseCode === slug || c.id === slug
            )
            if (found) setCmsCase(found)
          }
        }
      })
      .catch(() => {})
  }, [slug, initialCase])

  // Bank dokumen advokasi untuk sidebar.
  useEffect(() => {
    fetch('/api/cms/documents')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.documents)) setDocuments(data.documents)
      })
      .catch(() => {})
  }, [])

  // ─── VIEW MODEL: seluruh konten bersumber dari CMS (tanpa data placeholder) ───
  const view = {
    caseCode: cmsCase?.caseCode || '—',
    title: cmsCase?.title || '',
    category: cmsCase?.categoryLabel || 'Advokasi Mahasiswa',
    campus: cmsCase?.campus || '',
    statusLabel: cmsCase?.statusLabel || 'Dalam Penanganan',
    statusColor: cmsCase?.statusColor || 'bg-crimson text-white',
    progressPercent:
      typeof cmsCase?.progressPercent === 'number' ? cmsCase.progressPercent : 0,
    registrationDate: cmsCase?.dateDisplay || '',
    supportersCount: cmsCase?.supportersCount || '',
    affectedScope: cmsCase?.affectedCount || '',
    alliedCount: cmsCase?.alliedCount || '',
    lastUpdate: cmsCase?.lastUpdate || '',
    isNationalPriority: Boolean(cmsCase?.isNationalPriority),
    coverImageUrl: cmsCase?.coverImageUrl || '',
    coverCaption: cmsCase?.coverCaption || '',
    coverCredit: cmsCase?.coverCredit || '',
    leadBackground: cmsCase?.leadBackground || '',
    legalCounsel: cmsCase?.legalCounsel || '',
    urgencyLevel: cmsCase?.urgencyLevel || '',
  }

  // Sinopsis faktual yang tersusun dari data kasus (tanpa narasi palsu).
  const leadSummary = [view.category, view.campus ? `di ${view.campus}` : '', view.lastUpdate]
    .filter(Boolean)
    .join(' • ')

  // Sinopsis: prioritaskan narasi CMS, fallback ringkasan turunan.
  const leadText = view.leadBackground || leadSummary

  // Label urgensi bersumber dari CMS (hanya tampil bila admin menandainya).
  const urgencyLabel = view.isNationalPriority
    ? view.urgencyLevel || 'URGENSI TINGGI • ADVOKASI NASIONAL'
    : ''

  // Nama lembaga advokasi inisiator (institusional, bukan narasi fiktif).
  const initiatorLabel = view.legalCounsel
    ? view.legalCounsel
    : view.alliedCount
      ? `Biro Advokasi Suarantara & ${view.alliedCount}`
      : 'Biro Advokasi Suarantara'

  // Gambar sampul + paragraf latar belakang yang bisa berisi beberapa alinea.
  const coverSrc = view.coverImageUrl || FALLBACK_ADVOKASI_COVER
  const backgroundParagraphs: string[] = String(view.leadBackground)
    .split(/\n{2,}/)
    .map((p: string) => p.trim())
    .filter(Boolean)

  // Data terstruktur advokasi.
  const timelineSteps = parseArray<{ date?: string; title?: string; desc?: string; status?: string }>(
    cmsCase?.timelineSteps
  )
  const legalViolations = parseArray<{ article?: string; explanation?: string }>(
    cmsCase?.legalViolations
  )
  const demands = parseArray<string>(cmsCase?.demands)

  // Progres stepper generik dari progressPercent.
  const stepAktif = Math.min(3, Math.floor(view.progressPercent / 25))

  // Kasus advokasi terkait lainnya (maks. 4, tanpa kasus saat ini).
  const relatedCases = allCases
    .filter(
      (c: any) =>
        !(
          c.caseCode === cmsCase?.caseCode ||
          c.slug === slug ||
          (cmsCase?.id && c.id === cmsCase.id)
        )
    )
    .slice(0, 4)

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

  const handleSupportAction = () => {
    const message = `Halo Biro Advokasi Suarantara,\n\nSaya ingin menyatakan dukungan solidaritas penuh untuk mengawal kasus:\n"${view.title}" (Kode: ${view.caseCode}).\n\nNama:\nKampus/Institusi:\nPesan Solidaritas:`
    window.open(`https://wa.me/6285286140817?text=${encodeURIComponent(message)}`, '_blank')
    setSupportSubmitted(true)
  }

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-gold/30 selection:text-navy">
      {/* ─── 1. TOPBAR STANDALONE RESMI (Warna Putih Bersih Koran dengan Scroll Show/Hide Aktif) ─── */}
      <NewspaperMasthead variant="white" />

      {/* ─── 2. MAIN CONTAINER DETAIL KASUS ADVOKASI ─── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 md:pt-40 pb-16">
        
        {/* ══════════════ HEADER DETAIL KASUS GAYA LEDGER ADVOKASI KORAN ══════════════ */}
        <header className="border-b-2 border-navy pb-6 mb-8">
          
          {/* A. BREADCRUMBS FORMAL */}
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
              href="/#advokasi"
              className="text-stone-600 hover:text-navy transition-colors font-medium hover:underline"
            >
              Pilar Advokasi
            </Link>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-crimson font-bold uppercase tracking-wider">
              Kawal Kasus Hukum
            </span>
            <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {view.caseCode}
            </span>
          </nav>

          {/* B. BADGE STATUS KASUS, KODE PERKARA & URGENSI */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-crimson text-white font-sans font-bold text-2xs uppercase tracking-widest shadow-xs">
                <Gavel className="w-3 h-3 text-white" />
                {view.statusLabel}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm bg-navy text-gold font-mono text-2xs font-bold uppercase tracking-wider">
                {view.caseCode}
              </span>
              {urgencyLabel && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300 font-sans text-2xs font-bold uppercase tracking-wider">
                  {urgencyLabel}
                </span>
              )}
            </div>

            <div className="font-mono text-2xs text-stone-500 tracking-wider">
              KLASIFIKASI: <span className="font-bold text-navy">{view.category}</span>
            </div>
          </div>

          {/* C. HEADLINE / JUDUL UTAMA KASUS ADVOKASI */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0B1528] leading-[1.2] tracking-tight mb-4">
            {view.title}
          </h1>

          {/* D. SINOPSIS & RINGKASAN EKSEKUTIF PERKARA */}
          <p className="font-serif italic text-base sm:text-lg md:text-xl text-stone-700 leading-relaxed max-w-5xl border-l-3 border-crimson pl-4 py-1 mb-6">
            &ldquo;{leadText}&rdquo;
          </p>

          {/* E. PROGRESS STEPPER KASUS (Buku Kasus Hukum Mahasiswa) */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-stone-300 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="font-serif font-bold text-navy flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-crimson" />
                <span>Status Progres Penanganan Perkara:</span>
              </span>
              <span className="font-mono font-bold text-crimson text-sm">
                {view.progressPercent}% Selesai
              </span>
            </div>

            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-crimson via-amber-500 to-emerald-600 transition-all duration-700"
                style={{ width: `${view.progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-sans text-stone-600">
              {STEP_MILESTONES.map((label, idx) => {
                const isDone = idx < stepAktif || view.progressPercent >= 100
                const isActive = idx === stepAktif && view.progressPercent < 100
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-1.5 ${isActive ? 'font-bold text-navy' : ''}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                          isActive ? 'bg-crimson text-white' : 'bg-stone-300 text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    )}
                    <span>
                      {idx + 1}. {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* F. BARIS METADATA LENGKAP: TIM HUKUM, PEMOHON & SISI KANAN (BAGIKAN + VIEWS TEPAT DI BAWAHNYA) */}
          <div className="pt-4 border-t border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans text-stone-600">
            
            {/* Sisi Kiri: Detail Tim Hukum & Pemohon */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
              {/* Tim Kuasa Hukum */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-crimson/10 border border-crimson/30 flex items-center justify-center text-crimson font-bold text-xs shrink-0">
                  <Gavel className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 leading-tight">{initiatorLabel}</div>
                  <div className="text-[10px] text-stone-500 font-light">
                    Inisiator Advokasi &amp; Kuasa Pemohon
                  </div>
                </div>
              </div>

              <span className="hidden sm:inline text-stone-300">•</span>

              {/* Tanggal Registrasi */}
              {view.registrationDate && (
                <div className="inline-flex items-center gap-1.5 text-stone-600 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-gold-700" />
                  <span>{view.registrationDate}</span>
                </div>
              )}

              <span className="hidden sm:inline text-stone-300">•</span>

              {/* Mahasiswa Terdampak */}
              {view.affectedScope && (
                <div className="inline-flex items-center gap-1 text-stone-700 font-medium">
                  <Users className="w-3.5 h-3.5 text-crimson" />
                  <span>{view.affectedScope}</span>
                </div>
              )}
            </div>

            {/* Sisi Kanan: Baris Atas (Bagikan Sosmed & Print) & Baris Bawah Tepat di Bawahnya (Views/Pengawal) */}
            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0 self-start md:self-auto">
              
              {/* Baris Atas: Jejeran Icon Sosmed, Salin & Print */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-stone-500 mr-1 hidden sm:inline">
                  Bagikan Kasus:
                </span>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Kawal Bersama: ${view.title} - Cek status perkara lengkap di Suarantara: `
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Bagikan ke WhatsApp"
                  className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://twitter.com/intent/tweet"
                  target="_blank"
                  rel="noreferrer"
                  title="Bagikan ke X"
                  className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <TwitterXIcon className="w-3 h-3" />
                </a>

                <a
                  href="https://t.me/share/url"
                  target="_blank"
                  rel="noreferrer"
                  title="Bagikan ke Telegram"
                  className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                >
                  <TelegramIcon className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Salin Tautan Kasus"
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

                <button
                  type="button"
                  onClick={handlePrint}
                  title="Cetak Berkas Perkara"
                  className="w-7 h-7 rounded-full border border-stone-300 hover:border-navy bg-white text-stone-600 hover:text-navy flex items-center justify-center transition-colors shadow-2xs hidden sm:flex"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Baris Bawah di Kanan: Total Pengawal Kasus (Tepat di Bawah Bagikan Sosmed) */}
              {view.supportersCount && (
                <div className="flex items-center gap-1.5 text-2xs font-sans text-stone-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Total Pengawal:
                  </span>
                  <div className="inline-flex items-center gap-1 font-mono font-bold text-navy bg-gold/15 border border-gold/30 px-2 py-0.5 rounded text-[11px]">
                    <Eye className="w-3 h-3 text-gold-700" />
                    <span>{view.supportersCount} Mahasiswa Mengawal</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </header>

        {/* ══════════════ GRID 2 KOLOM KORAN ADVOKASI (KIRI: ARTIKEL KASUS & FAKTA, KANAN: SIDEBAR DOKUMEN & HOTLINE) ══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ──────────────────────────────────────────────────────────
              KOLOM KIRI (8 KOLOM): DETAIL BUKTI, KRONOLOGI & TUNTUTAN
          ────────────────────────────────────────────────────────── */}
          <article className="lg:col-span-8 space-y-8">
            
            {/* GAMBAR DOKUMENTASI ADVOKASI */}
            <figure className="space-y-2">
              <div className="relative w-full aspect-[16/9] md:aspect-[21/10] rounded-xl overflow-hidden border border-navy/20 bg-stone-900 shadow-md">
                <Image
                  src={coverSrc}
                  alt={view.title || 'Dokumentasi advokasi'}
                  fill
                  priority
                  className="object-cover object-center filter contrast-[1.02] brightness-95"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-crimson text-white font-bold text-[10px] font-sans uppercase tracking-widest shadow-md flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  <span>BERKAS ADVOKASI RESMI TERVERIFIKASI</span>
                </div>
              </div>
              {(view.coverCaption || view.coverCredit) && (
                <figcaption className="text-2xs sm:text-xs font-sans text-stone-600 border-l-2 border-crimson pl-3 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>{view.coverCaption}</span>
                  {view.coverCredit && (
                    <span className="font-mono text-stone-500 shrink-0 italic text-[10px]">
                      {view.coverCredit}
                    </span>
                  )}
                </figcaption>
              )}
            </figure>

            {/* LATAR BELAKANG PERKARA (Paragraf Koran Klasik dengan Drop Cap) */}
            <div className="font-sans leading-[1.8] text-stone-800 space-y-4 text-justify">
              {backgroundParagraphs.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Latar Belakang Belum Diisi"
                  description="Tim advokasi belum menuliskan narasi latar belakang perkara ini."
                  hint="Konten dikelola melalui CMS"
                />
              ) : (
                backgroundParagraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'first-letter:font-serif first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-extrabold first-letter:text-crimson first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:pt-1'
                        : undefined
                    }
                  >
                    {paragraph}
                  </p>
                ))
              )}
            </div>

            {/* 1. KRONOLOGI LENGKAP PENANGANAN KASUS (TIMELINE TRACKER) */}
            <div className="space-y-4 pt-2">
              <div className="border-b border-navy/20 pb-2 flex items-center justify-between">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-navy flex items-center gap-2">
                  <Clock className="w-5 h-5 text-crimson" />
                  Kronologi Lengkap Perkara &amp; Langkah Advokasi
                </h3>
                <span className="text-2xs font-mono text-stone-500">
                  Diverifikasi Tim Hukum
                </span>
              </div>

              {timelineSteps.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Kronologi Belum Diisi"
                  description="Belum ada catatan kronologi penanganan perkara yang dipublikasikan."
                  hint="Konten dikelola melalui CMS"
                />
              ) : (
                <div className="relative border-l-2 border-stone-300 ml-3.5 space-y-6 py-2">
                  {timelineSteps.map((step, idx) => {
                    const isActive = step.status === 'aktif'
                    const isDone = step.status === 'selesai'
                    return (
                      <div key={idx} className="relative pl-6 sm:pl-8 group">
                        {/* Bullet marker */}
                        <span
                          className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                            isActive
                              ? 'bg-crimson border-white ring-4 ring-crimson/30 animate-pulse'
                              : isDone
                                ? 'bg-emerald-600 border-white'
                                : 'bg-stone-300 border-white'
                          }`}
                        />

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-navy">
                              {step.date}
                            </span>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-extrabold uppercase tracking-wider bg-crimson text-white">
                                Tahap Saat Ini
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-navy transition-colors">
                            {step.title}
                          </h4>

                          <p className="text-xs font-sans text-stone-600 leading-relaxed text-justify">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 2. PASAL & DASAR HUKUM YANG DIGUGAT (Fact Sheet Legal) */}
            <div className="bg-white rounded-xl border border-stone-300 p-6 shadow-xs space-y-4">
              <div className="border-b border-navy/15 pb-2.5 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                  <FileText className="w-4 h-4 text-crimson" />
                  Pasal &amp; Dasar Hukum Pelanggaran yang Digugat
                </h3>
                <span className="text-2xs font-mono text-gold-900 font-bold bg-gold/15 px-2 py-0.5 rounded">
                  Legal Basis
                </span>
              </div>

              {legalViolations.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={FileText}
                  title="Dasar Hukum Belum Diisi"
                  description="Pasal dan dasar hukum yang digugat belum dipublikasikan oleh tim advokasi."
                />
              ) : (
                <div className="space-y-3.5">
                  {legalViolations.map((item, i) => (
                    <div key={i} className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
                      <span className="font-serif font-bold text-xs sm:text-sm text-crimson block">
                        {item.article}
                      </span>
                      <p className="text-xs font-sans text-stone-700 leading-relaxed text-justify">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. TUNTUTAN POKOK ADVOKASI */}
            <div className="bg-navy/5 border border-navy/20 p-6 rounded-xl space-y-4">
              <div className="border-b border-navy/15 pb-2">
                <h3 className="font-serif text-lg font-bold text-navy flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gold-700" />
                  Tuntutan Pokok Sikap Moral Mahasiswa
                </h3>
                <p className="text-xs font-sans text-stone-600">
                  Konsensus resmi yang disepakati oleh koalisi advokasi mahasiswa
                </p>
              </div>

              {demands.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={AlertCircle}
                  title="Tuntutan Belum Diisi"
                  description="Butir tuntutan pokok advokasi belum dipublikasikan oleh tim advokasi."
                />
              ) : (
                <ol className="space-y-2.5 text-xs font-sans text-stone-800 list-decimal list-inside leading-relaxed text-justify">
                  {demands.map((demand, i) => (
                    <li key={i} className="pl-1">
                      {typeof demand === 'string' && demand.includes(':') ? (
                        <>
                          <strong className="text-navy">{demand.split(':')[0]}</strong>
                          {demand.slice(demand.indexOf(':'))}
                        </>
                      ) : (
                        <span>{String(demand)}</span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* 4. KOTAK AKSI PENGURUSAN SOLIDARITAS / LAPORKAN KASUS */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-navy-950 via-[#0B1528] to-navy-900 text-white border border-gold/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 text-gold text-xs font-sans font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerakan Solidaritas Nasional</span>
                </span>
                <h4 className="font-serif text-lg font-bold text-white">
                  Ikut Mengawal Kasus Ini atau Laporkan Kasus Kampus Anda?
                </h4>
                <p className="text-xs font-sans text-stone-300 max-w-xl">
                  Biro Advokasi Suarantara membuka pendampingan hukum pro bono bagi seluruh mahasiswa yang terancam sanksi sepihak atau pungutan liar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSupportAction}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  <span>{supportSubmitted ? 'Dukungan Terkirim' : 'Kawal via WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={openContact}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-gold hover:bg-gold-400 text-navy font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                >
                  Laporkan Kasus
                </button>
              </div>
            </div>

          </article>

          {/* ──────────────────────────────────────────────────────────
              KOLOM KANAN (4 KOLOM): SIDEBAR DOKUMEN, TIM & HOTLINE
          ────────────────────────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* 1. KOTAK BERKAS DOKUMEN RESMI PERKARA */}
            <div className="bg-white rounded-xl border border-stone-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-navy/15 pb-2.5">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-crimson" />
                  Berkas &amp; Bukti Perkara Resmi
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-navy text-gold font-bold">
                  PDF Terbuka
                </span>
              </div>

              {documents.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={FileText}
                  title="Berkas Belum Tersedia"
                  description="Dokumen resmi perkara akan tampil di sini setelah diunggah melalui CMS."
                />
              ) : (
                <div className="space-y-2.5 pt-1">
                  {documents.map((doc: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="font-serif text-xs font-bold text-stone-900 block truncate">
                          {doc.title}
                        </span>
                        <span className="text-[10px] font-sans text-stone-500">
                          {doc.type} • {doc.size}
                        </span>
                      </div>

                      <a
                        href={doc.fileUrl || '#unduh'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md bg-navy text-gold hover:bg-gold hover:text-navy transition-colors shrink-0 shadow-2xs"
                        title="Unduh Berkas"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-1 text-[10px] font-sans text-stone-500 italic">
                *Seluruh dokumen perkara dapat diakses secara bebas untuk keperluan pengawalan dan kajian ilmiah mahasiswa.
              </div>
            </div>

            {/* 2. TIM PENDAMPING & KAMPUS INISIATOR */}
            <div className="bg-[#0B1528] text-white rounded-xl border border-gold/40 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-gold text-2xs font-mono uppercase tracking-widest border-b border-white/10 pb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Konsorsium Pendamping Hukum</span>
              </div>
              <h4 className="font-serif text-base font-bold text-white leading-tight">
                {initiatorLabel}
              </h4>
              {view.campus && (
                <p className="text-2xs font-sans text-stone-300 leading-relaxed">
                  Advokasi {view.category} untuk mahasiswa di {view.campus}.
                  {view.alliedCount ? ` Didukung oleh ${view.alliedCount}.` : ''}
                </p>
              )}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-2xs font-mono text-stone-400">
                <span>{view.campus || 'Jaringan Aliansi Mahasiswa'}</span>
                <span className="text-emerald-400">Pro Bono (Gratis)</span>
              </div>
            </div>

            {/* 3. KASUS ADVOKASI AKTIF LAINNYA */}
            <div className="bg-white rounded-xl border border-stone-300 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-navy/15 pb-2">
                <span className="font-serif text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-crimson" />
                  Kasus Advokasi Terkait Lainnya
                </span>
                <Link
                  href="/#advokasi"
                  className="text-[10px] font-sans font-bold text-gold-800 hover:text-navy transition-colors"
                >
                  Lihat Semua
                </Link>
              </div>

              {relatedCases.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={Scale}
                  title="Belum Ada Kasus Lain"
                  description="Kasus advokasi lain akan tampil di sini setelah dipublikasikan melalui CMS."
                />
              ) : (
                <div className="divide-y divide-stone-100 space-y-3 pt-1">
                  {relatedCases.map((kasus: any, idx: number) => (
                    <article key={idx} className="pt-3 first:pt-0 group">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${kasus.statusColor}`}
                        >
                          {kasus.statusLabel}
                        </span>
                        <span className="text-[9px] font-mono text-stone-400">
                          {kasus.caseCode}
                        </span>
                      </div>

                      <h5 className="font-serif text-xs font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug line-clamp-2">
                        <Link href={`/advokasi/${kasus.slug || kasus.id}`}>
                          {kasus.title}
                        </Link>
                      </h5>

                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-sans text-stone-500">
                        <span className="truncate max-w-[170px]">{kasus.campus}</span>
                        <span className="font-mono text-navy font-bold flex items-center gap-1">
                          {kasus.progressPercent}%
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

          </aside>

        </div>

      </main>

      {/* ─── 3. FOOTER RESMI ─── */}
      <Footer />

      {/* ─── 4. POPUP DRAWER KONTAK SISI KANAN ─── */}
      <ContactDrawerRight />
    </div>
  )
}
