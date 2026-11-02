'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Scale,
  ShieldCheck,
  AlertCircle,
  FileText,
  Download,
  CheckCircle2,
  Lock,
  PhoneCall,
  ArrowRight,
  Eye,
  Calendar,
  Users,
  ExternalLink,
  Flame,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

type CaseCategory = 'semua' | 'ukt' | 'represi' | 'ppks' | 'fasilitas'

interface AdvocacyCase {
  id: string
  title: string
  campus: string
  category: CaseCategory
  categoryLabel: string
  status: 'investigasi' | 'audiensi' | 'litigasi' | 'menang'
  statusLabel: string
  statusColor: string
  affectedCount: string
  lastUpdate: string
  progressPercent: number
  date: string
  slug?: string
  isNationalPriority?: boolean
  supportersCount?: string
  alliedCount?: string
}

interface AdvocacyDocumentItem {
  id: string
  title: string
  desc: string
  type: string
  size: string
  downloads: string
  fileUrl?: string
}

export function AdvocacyPillarContent() {
  const [selectedFilter, setSelectedFilter] = useState<CaseCategory>('semua')
  const [visibleCount, setVisibleCount] = useState<number>(6)
  const [petitionSigned, setPetitionSigned] = useState(false)
  const [petition, setPetition] = useState<any>(null)
  const [allCases, setAllCases] = useState<AdvocacyCase[]>([])
  const [documents, setDocuments] = useState<AdvocacyDocumentItem[]>([])

  // Sinkronisasi dinamis dari CMS Database
  useEffect(() => {
    fetch('/api/cms/advocacy')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cases && data.cases.length > 0) {
          setAllCases(
            data.cases.map((c: any) => ({
              id: c.caseCode || c.id,
              title: c.title,
              campus: c.campus,
              category: c.category as any,
              categoryLabel: c.categoryLabel,
              status: c.status as any,
              statusLabel: c.statusLabel,
              statusColor: c.statusColor,
              affectedCount: c.affectedCount,
              lastUpdate: c.lastUpdate,
              progressPercent: c.progressPercent,
              date: c.dateDisplay,
              slug: c.slug,
              isNationalPriority: Boolean(c.isNationalPriority),
              supportersCount: c.supportersCount || '',
              alliedCount: c.alliedCount || '',
            }))
          )
        }
      })
      .catch(() => {})

    fetch('/api/cms/petitions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.petition) setPetition(data.petition)
      })
      .catch(() => {})

    fetch('/api/cms/documents')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.documents) && data.documents.length > 0) {
          setDocuments(
            data.documents.map((d: any) => ({
              id: d.docCode || d.id,
              title: d.title,
              desc: d.desc,
              type: d.type,
              size: d.size,
              downloads: d.downloads,
              fileUrl: d.fileUrl,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  const filterTabs: { key: CaseCategory; label: string }[] = [
    { key: 'semua', label: `Semua Kasus (${allCases.length})` },
    { key: 'ukt', label: `UKT & Biaya (${allCases.filter((c) => c.category === 'ukt').length})` },
    { key: 'represi', label: `Represi & Ormawa (${allCases.filter((c) => c.category === 'represi').length})` },
    { key: 'ppks', label: `PPKS & Etik (${allCases.filter((c) => c.category === 'ppks').length})` },
    { key: 'fasilitas', label: `Pungli & Fasilitas (${allCases.filter((c) => c.category === 'fasilitas').length})` },
  ]

  const filteredCases =
    selectedFilter === 'semua'
      ? allCases
      : allCases.filter((item) => item.category === selectedFilter)

  const displayedCases = filteredCases.slice(0, visibleCount)
  const hasMore = visibleCount < filteredCases.length

  // Statistik pengawalan diturunkan langsung dari data kasus nyata (tanpa angka statis)
  const totalCases = allCases.length
  const ongoingCases = allCases.filter((c) => c.status !== 'menang').length
  const wonCases = allCases.filter((c) => c.status === 'menang').length
  const categoryCount = new Set(allCases.map((c) => c.category)).size

  // Kasus unggulan untuk banner: prioritas nasional bila ada, jika tidak kasus terbaru.
  const featured = allCases.find((c) => c.isNationalPriority) ?? allCases[0]

  // Tandatangani petisi: tambah 1 tanda tangan lalu perbarui angka dari respons server.
  const handleSignPetition = async () => {
    if (!petition || petitionSigned) return
    try {
      const res = await fetch('/api/cms/petitions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: petition.id }),
      })
      const data = await res.json()
      if (data.success && data.petition) {
        setPetition(data.petition)
        setPetitionSigned(true)
      }
    } catch {
      // abaikan: biarkan pengguna mencoba lagi
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      
      {/* ════════════════ KONTEN KIRI: ADVOKASI UTAMA, LIVE CASE TRACKER & TOOLKIT (8 KOLOM) ════════════════ */}
      <div className="lg:col-span-8 space-y-7">
        
        {/* 1. BANNER KASUS PRIORITAS NASIONAL (Dinamis dari data CMS) */}
        {featured ? (
          <article className="relative w-full h-56 sm:h-72 md:h-80 lg:h-[410px] rounded-xl overflow-hidden border border-navy/25 group cursor-pointer shadow-md bg-gradient-to-tr from-navy-950 via-navy-900 to-crimson-950">
            <div className="absolute inset-0 bg-[radial-gradient(#c0392b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Focal Graphic Center (Unobstructed Upper Half) */}
            <div className="absolute top-1/5 sm:top-1/4 inset-x-0 flex flex-col items-center justify-center text-center p-3 sm:p-6 text-white/90 z-10 transition-transform duration-300 group-hover:scale-105 pointer-events-none">
              <div className="inline-flex p-2 sm:p-3.5 rounded-full bg-white/10 backdrop-blur-md mb-1.5 sm:mb-2 border border-white/20">
                <Scale className="w-5 h-5 sm:w-8 sm:h-8 text-gold" />
              </div>
              <p className="font-serif text-[9px] sm:text-xs md:text-sm italic tracking-wide text-stone-200 line-clamp-1 px-4">
                {featured.campus}
              </p>
            </div>

            {/* Badges di Pojok Kiri & Kanan Atas */}
            <div className="absolute top-2 sm:top-3.5 inset-x-2 sm:inset-x-3.5 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {featured.isNationalPriority && (
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider bg-crimson text-white shadow-xs flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" />
                    Prioritas Nasional
                  </span>
                )}
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[7.5px] sm:text-[9px] font-sans bg-black/50 backdrop-blur-md text-gold border border-gold/30 uppercase tracking-wider">
                  {featured.categoryLabel}
                </span>
              </div>
              <span className="px-1.5 sm:px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7.5px] sm:text-[9px] text-stone-300 font-mono">
                Status: {featured.statusLabel}
              </span>
            </div>

            {/* Gradient Scrim Bagian Bawah Tempat Teks Berada */}
            <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-6 bg-gradient-to-t from-navy-950/95 via-navy-950/80 via-45% to-transparent pt-12 sm:pt-14 z-20 flex flex-col justify-end">
              <h3 className="font-serif text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white group-hover:text-gold transition-colors leading-snug drop-shadow-sm line-clamp-2">
                {featured.title}
              </h3>

              {featured.lastUpdate && (
                <p className="mt-1 text-[10px] sm:text-xs md:text-[13px] text-stone-200/90 font-sans font-light line-clamp-2 leading-relaxed">
                  {featured.lastUpdate}
                </p>
              )}

              <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/20 flex flex-wrap items-center justify-between gap-1.5 sm:gap-3 text-[8.5px] sm:text-2xs font-sans text-stone-300">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1 font-medium text-stone-200">
                    <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                    {featured.alliedCount || featured.campus}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-mono font-semibold text-gold">
                    <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                    {featured.supportersCount || featured.affectedCount}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-stone-300">
                    <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                    {featured.date}
                  </span>
                </div>

                <Link
                  href={`/advokasi/${featured.slug || featured.id}`}
                  className="font-serif font-bold text-gold hover:text-white text-[9.5px] sm:text-xs inline-flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>Kawal Kasus Ini</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <EmptyState
            icon={Scale}
            title="Belum Ada Kasus Prioritas"
            description="Banner kasus advokasi prioritas akan tampil di sini setelah tim advokasi mempublikasikan kasus melalui CMS."
            hint="Tim advokasi sedang mendata kasus"
          />
        )}

        {/* 2. LIVE ADVOCACY CASE TRACKER (Pelacak Kasus Terbuka Mahasiswa) */}
        <div className="space-y-4">
          
          {/* Header Case Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy/15 pb-2">
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-crimson" />
                Daftar Kasus Aktif Terverifikasi
              </h4>
              <p className="text-[10px] font-sans text-stone-500">
                Pembaruan status berkala advokasi bersama jaringan aliansi mahasiswa
              </p>
            </div>

            {/* Filter Kategori Kasus */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(tab.key)
                    setVisibleCount(6)
                  }}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[9px] sm:text-2xs font-sans font-medium transition-colors shrink-0 select-none ${
                    selectedFilter === tab.key
                      ? 'bg-navy text-white font-bold'
                      : 'bg-white/80 hover:bg-navy/10 text-stone-700 border border-navy/15'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List Kasus Advokasi (Gaya Buku Besar Koran Klasik / Case Ledger) */}
          {displayedCases.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={Scale}
              title="Belum Ada Kasus Terverifikasi"
              description="Kasus advokasi yang sedang dikawal akan tampil di sini setelah tim advokasi mempublikasikannya melalui CMS."
              hint="Tim advokasi sedang mendata kasus"
            />
          ) : (
          <div className="space-y-3">
            {displayedCases.map((kasus) => (
              <Link
                key={kasus.id}
                href={`/advokasi/${kasus.slug || kasus.id}`}
                className="block bg-white/60 backdrop-blur-xs border border-navy/15 hover:border-navy/40 p-3 sm:p-4 rounded-xl transition-all shadow-2xs group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider border ${kasus.statusColor}`}>
                      {kasus.statusLabel}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-sans text-stone-500">
                      {kasus.campus}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-stone-500">
                    {kasus.date}
                  </span>
                </div>

                <h5 className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug">
                  {kasus.title}
                </h5>

                {/* Progress Bar & Catatan Terkini */}
                <div className="mt-2 pt-1.5 border-t border-stone-200/50 space-y-1">
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-sans">
                    <span className="font-medium text-stone-600 truncate max-w-[200px] sm:max-w-[280px]">
                      {kasus.affectedCount}
                    </span>
                    <span className="font-mono font-bold text-navy">
                      Progress: {kasus.progressPercent}%
                    </span>
                  </div>

                  <div className="w-full bg-stone-200/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        kasus.status === 'menang'
                          ? 'bg-emerald-600'
                          : kasus.status === 'investigasi'
                          ? 'bg-crimson'
                          : 'bg-gold-600'
                      }`}
                      style={{ width: `${kasus.progressPercent}%` }}
                    />
                  </div>

                  <p className="text-[9.5px] sm:text-[11px] text-stone-600 font-sans italic pt-0.5">
                    &ldquo;{kasus.lastUpdate}&rdquo;
                  </p>
                </div>

                <div className="mt-2 pt-1.5 flex items-center justify-between text-[8.5px] sm:text-[10px] font-sans text-stone-500">
                  <span className="text-navy font-semibold group-hover:underline inline-flex items-center gap-1">
                    Lihat Dokumen &amp; Bukti Advokasi <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                  <span className="font-sans text-stone-400">ID: {kasus.id}</span>
                </div>
              </Link>
            ))}
          </div>
          )}

          {/* Tombol Lihat Kasus Lainnya di Kiri Tanpa Box Curve */}
          {totalCases > 0 && (
          <div className="pt-2 flex justify-start">
            {hasMore ? (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="group inline-flex items-center gap-2 text-xs font-serif font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors border-b-2 border-navy hover:border-gold pb-1 select-none"
              >
                <PlusCircle className="w-4 h-4 text-gold group-hover:rotate-90 transition-transform duration-200" />
                <span>Lihat Kasus Lainnya (+4 Kasus)</span>
              </button>
            ) : (
              <div className="text-left py-1 text-stone-500 text-[11px] font-serif italic border-b border-stone-200/60 pb-1">
                Seluruh {totalCases} kasus aktif terverifikasi telah ditampilkan
              </div>
            )}
          </div>
          )}

        </div>

        {/* 3. BANK DOKUMEN & PANDUAN ADVOKASI MAHASISWA (Advocacy Toolkit) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-navy/15 pb-2">
            <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gold-700" />
              Bank Dokumen & Panduan Legalitas Mahasiswa
            </h4>
            <span className="text-[9px] sm:text-[10px] font-sans text-stone-500 font-medium">
              Format Siap Pakai & Gratis
            </span>
          </div>

          {documents.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={FileText}
              title="Bank Dokumen Belum Tersedia"
              description="Template surat, panduan banding, dan berkas legal akan tersedia di sini setelah diunggah melalui CMS."
              hint="Berkas sedang disiapkan redaksi"
            />
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/60 backdrop-blur-xs border border-navy/15 hover:border-gold p-3 sm:p-3.5 rounded-xl transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-mono text-stone-500 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-navy/10 text-navy font-bold uppercase font-sans">
                      {doc.type}
                    </span>
                    <span>{doc.size}</span>
                  </div>

                  <h5 className="font-serif text-[11px] sm:text-xs font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug">
                    {doc.title}
                  </h5>

                  <p className="mt-1 text-[9.5px] sm:text-[11px] text-stone-600 font-sans font-light leading-relaxed">
                    {doc.desc}
                  </p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[8.5px] sm:text-[10px] font-sans">
                  <span className="text-stone-500">{doc.downloads}</span>
                  <a
                    href={doc.fileUrl || '#unduh'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-navy hover:bg-gold text-white hover:text-navy text-[8.5px] sm:text-[10px] font-sans font-bold uppercase tracking-wider transition-colors"
                  >
                    <Download className="w-2.5 h-2.5" />
                    <span>Unduh Berkas</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

      </div>

      {/* ════════════════ KONTEN KANAN: POSKO ADUAN RAHASIA, METRIK & PETISI (4 KOLOM) ════════════════ */}
      <div className="lg:col-span-4 space-y-4 sm:space-y-6">
        
        {/* 1. POSKO ADUAN DIGITAL & HOTLINE RAHASIA (Whistleblower Desk - Tanpa Font Putih) */}
        <div className="bg-white border-2 border-gold/60 p-3.5 sm:p-5 rounded-xl shadow-md space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-navy/15 pb-2">
            <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
              Posko Aduan Mahasiswa
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-crimson text-white text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider animate-pulse">
              Aktif 24 Jam
            </span>
          </div>

          <h4 className="font-serif text-xs sm:text-sm md:text-base font-extrabold text-navy leading-snug">
            Mengalami Intimidasi, Pungutan Liar, atau Sanksi Sepihak di Kampus?
          </h4>

          <p className="text-[10px] sm:text-2xs text-stone-700 font-sans leading-relaxed">
            Laporkan secara aman kepada Tim Advokasi Suarantara. Identitas Anda dilindungi kerahasiaannya dengan sistem pelaporan terenkripsi.
          </p>

          {/* Jaminan 3 Pilar Keamanan */}
          <div className="space-y-1.5 pt-1 text-[9.5px] sm:text-[11px] font-sans text-stone-700">
            <div className="flex items-center gap-2">
              <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
              <span>100% Identitas Terenkripsi &amp; Anonim</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
              <span>Pendampingan LBH Mahasiswa Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
              <span>Verifikasi Berkas Maksimal 2x24 Jam</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1.5 space-y-2">
            <Link
              href="/kirim-suara"
              className="w-full text-center block py-2 sm:py-2.5 rounded-full bg-gold hover:bg-gold-500 text-navy font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors shadow-sm border border-gold-600 active:scale-95"
            >
              Buat Laporan Aduan Baru
            </Link>

            <Link
              href="#cek-tiket"
              className="w-full text-center block py-1.5 sm:py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-sans font-semibold text-[10px] sm:text-xs tracking-wide transition-colors"
            >
              Cek Status Tiket Aduan
            </Link>
          </div>

          {/* Hotline Cepat */}
          <div className="pt-1 text-center border-t border-navy/10 text-stone-600 text-[9px] sm:text-[10px] font-sans">
            Hotline Resmi WhatsApp: <span className="font-mono text-navy font-bold">0852-8614-0817</span>
          </div>
        </div>

        {/* 2. STATISTIK PENGAWALAN KASUS (Advocacy Ledger Metrics) */}
        <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-1.5 border-b border-navy/15 pb-2 mb-2.5 sm:mb-3">
            <Scale className="w-3.5 h-3.5 text-navy" />
            <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy">
              Catatan Statistik Pengawalan
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            <div className="p-2 sm:p-2.5 rounded-lg bg-navy/5 border border-navy/15 text-center">
              <span className="font-serif font-extrabold text-base sm:text-xl text-navy block">{totalCases}</span>
              <span className="font-sans text-[8.5px] sm:text-[10px] text-stone-600">Kasus Terverifikasi</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <span className="font-serif font-extrabold text-base sm:text-xl text-amber-700 block">{ongoingCases}</span>
              <span className="font-sans text-[8.5px] sm:text-[10px] text-stone-600">Sedang Dikawal</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <span className="font-serif font-extrabold text-base sm:text-xl text-emerald-700 block">{wonCases}</span>
              <span className="font-sans text-[8.5px] sm:text-[10px] text-stone-600">Dimenangkan</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-gold/15 border border-gold/40 text-center">
              <span className="font-serif font-extrabold text-base sm:text-xl text-navy block">{categoryCount}</span>
              <span className="font-sans text-[8.5px] sm:text-[10px] text-stone-600">Kategori Isu</span>
            </div>
          </div>
        </div>

        {/* 3. PETISI & SOLIDARITAS MAHASISWA TERKINI (Dinamis dari CMS) */}
        <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between border-b border-navy/15 pb-2">
            <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-crimson" />
              Petisi Solidaritas Terbuka
            </span>
            {petition?.isUrgent && (
              <span className="text-[8px] sm:text-[9px] font-sans text-crimson font-bold uppercase">Mendesak</span>
            )}
          </div>

          {petition ? (
            <>
              <h5 className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-snug">
                {petition.title}
              </h5>

              <p className="text-[9.5px] sm:text-[11px] text-stone-600 font-sans font-light leading-relaxed">
                {petition.desc}
              </p>

              {/* Progress Petisi */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-sans">
                  <span className="font-mono font-bold text-navy">
                    {Number(petition.currentSignatures ?? 0).toLocaleString('id-ID')} Tanda Tangan
                  </span>
                  <span className="text-stone-500">
                    Target: {Number(petition.targetSignatures ?? 0).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="w-full bg-stone-200 h-1.5 sm:h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-crimson h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        ((Number(petition.currentSignatures ?? 0) || 0) /
                          Math.max(1, Number(petition.targetSignatures ?? 0) || 1)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignPetition}
                disabled={petitionSigned}
                className={`w-full py-2 rounded-full font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 shadow-xs ${
                  petitionSigned
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-crimson hover:bg-red-700 text-white active:scale-95'
                }`}
              >
                {petitionSigned ? '✓ Anda Telah Menandatangani Petisi' : 'Ikut Tanda Tangani Petisi'}
              </button>
            </>
          ) : (
            <EmptyState
              variant="compact"
              icon={Flame}
              title="Belum Ada Petisi Aktif"
              description="Petisi solidaritas mahasiswa akan tampil di sini setelah dipublikasikan melalui CMS."
            />
          )}
        </div>

      </div>

    </div>
  )
}
