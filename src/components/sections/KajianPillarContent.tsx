'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  FileText,
  Download,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  Calendar,
  Users,
  PlusCircle,
  Sparkles,
  BarChart3,
  Bookmark,
  Printer,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

type ResearchCategory = 'semua' | 'pendidikan' | 'hukum' | 'ekonomi' | 'lingkungan'

interface ResearchPaper {
  id: string
  type: 'Policy Brief' | 'Position Paper' | 'Kajian Tematik' | 'Working Paper'
  title: string
  authors: string
  institution: string
  abstract: string
  category: ResearchCategory
  categoryLabel: string
  pages: number
  date: string
  downloads: string
  citations: string
  fileUrl: string
  executiveSummary: string[]
  recommendations: string[]
  isNationalHeadline?: boolean
}

interface ObservatoryIndicator {
  id: string
  name: string
  metricValue: string
  metricSuffix?: string | null
  statusNote: string
  textColor: string
}

interface PolicyRecommendation {
  id: string
  title: string
  desc: string
}

interface ResearchEventItem {
  id: string
  title: string
  eventDatetime: string
  speakers: string
  eventType: string
  registrationUrl: string
}

export function KajianPillarContent() {
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory>('semua')
  const [visibleCount, setVisibleCount] = useState<number>(6)
  const [readingPaper, setReadingPaper] = useState<ResearchPaper | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [activePage, setActivePage] = useState<number>(1)
  const [allPapers, setAllPapers] = useState<ResearchPaper[]>([])
  const [indicators, setIndicators] = useState<ObservatoryIndicator[]>([])
  const [policyRecs, setPolicyRecs] = useState<PolicyRecommendation[]>([])
  const [researchEvent, setResearchEvent] = useState<ResearchEventItem | null>(null)

  // Sinkronisasi dinamis dari CMS Database
  useEffect(() => {
    fetch('/api/cms/papers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.papers) && data.papers.length > 0) {
          setAllPapers(
            data.papers.map((p: any) => ({
              id: p.paperCode || p.id,
              type: p.type,
              title: p.title,
              authors: p.authors,
              institution: p.institution,
              category: p.category as any,
              categoryLabel: p.categoryLabel,
              abstract: p.abstract,
              pages: p.pages,
              date: p.dateDisplay,
              downloads: p.downloads,
              citations: p.citations,
              fileUrl: p.fileUrl,
              isNationalHeadline: p.isNationalHeadline,
              executiveSummary:
                typeof p.executiveSummary === 'string'
                  ? JSON.parse(p.executiveSummary || '[]')
                  : p.executiveSummary || [],
              recommendations:
                typeof p.recommendations === 'string'
                  ? JSON.parse(p.recommendations || '[]')
                  : p.recommendations || [],
            }))
          )
        }
      })
      .catch(() => {})

    fetch('/api/cms/research-meta')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (Array.isArray(data.indicators)) {
            setIndicators(
              data.indicators.map((i: any) => ({
                id: i.id,
                name: i.name,
                metricValue: i.metricValue,
                metricSuffix: i.metricSuffix,
                statusNote: i.statusNote,
                textColor: i.textColor || 'text-navy',
              }))
            )
          }
          if (Array.isArray(data.recommendations)) {
            setPolicyRecs(
              data.recommendations.map((r: any) => ({
                id: r.id,
                title: r.title,
                desc: r.desc,
              }))
            )
          }
          setResearchEvent(data.event || null)
        }
      })
      .catch(() => {})
  }, [])

  const filterTabs: { key: ResearchCategory; label: string }[] = [
    { key: 'semua', label: `Semua Riset (${allPapers.length})` },
    { key: 'pendidikan', label: `Pendidikan & UKT (${allPapers.filter((p) => p.category === 'pendidikan').length})` },
    { key: 'hukum', label: `Hukum & Demokrasi (${allPapers.filter((p) => p.category === 'hukum').length})` },
    { key: 'ekonomi', label: `Ekonomi & Kerja (${allPapers.filter((p) => p.category === 'ekonomi').length})` },
    { key: 'lingkungan', label: `Sains & Lingkungan (${allPapers.filter((p) => p.category === 'lingkungan').length})` },
  ]

  const filteredPapers =
    selectedCategory === 'semua'
      ? allPapers
      : allPapers.filter((item) => item.category === selectedCategory)

  const displayedPapers = filteredPapers.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPapers.length

  const heroPaper = allPapers.find((p) => p.isNationalHeadline) || allPapers[0] || null

  const openReader = (paper: ResearchPaper) => {
    setReadingPaper(paper)
    setZoomLevel(100)
    setActivePage(1)
  }

  const closeReader = () => {
    setReadingPaper(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start select-none">
      
      {/* ════════════════ KONTEN KIRI: RISET UTAMA, PAPER LEDGER & OBSERVATORIUM (8 KOLOM) ════════════════ */}
      <div className="lg:col-span-8 space-y-7">
        
        {/* 1. BANNER KAJIAN UTAMA NASIONAL (Tanpa Box Putih, Teks di Atas Gambar pada Scrim Bawah) */}
        {heroPaper ? (
          <article className="relative w-full h-56 sm:h-72 md:h-80 lg:h-[410px] rounded-xl overflow-hidden border border-navy/25 group cursor-pointer shadow-md bg-gradient-to-tr from-navy-950 via-navy-900 to-stone-900">
            <div className="absolute inset-0 bg-[radial-gradient(#d4a200_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
            
            {/* Focal Graphic Center (Unobstructed Upper Area) */}
            <div className="absolute top-1/5 sm:top-1/4 inset-x-0 flex flex-col items-center justify-center text-center p-3 sm:p-6 text-white/90 z-10 transition-transform duration-300 group-hover:scale-105 pointer-events-none">
              <div className="inline-flex p-2 sm:p-3.5 rounded-full bg-white/10 backdrop-blur-md mb-1.5 sm:mb-2 border border-white/20">
                <BookOpen className="w-5 h-5 sm:w-8 sm:h-8 text-gold" />
              </div>
              <p className="font-serif text-[9px] sm:text-xs md:text-sm italic tracking-wide text-stone-200 line-clamp-1 px-4">
                Kajian Kebijakan Strategis Mahasiswa Indonesia
              </p>
            </div>

            {/* Badges di Pojok Kiri & Kanan Atas */}
            <div className="absolute top-2 sm:top-3.5 inset-x-2 sm:inset-x-3.5 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider bg-gold text-navy shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {heroPaper.type}
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[7.5px] sm:text-[9px] font-sans bg-black/50 backdrop-blur-md text-stone-200 border border-white/10 uppercase tracking-wider">
                  {heroPaper.categoryLabel}
                </span>
              </div>
              <span className="px-1.5 sm:px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7.5px] sm:text-[9px] text-stone-300 font-mono">
                {heroPaper.pages} Halaman • Peer-Reviewed
              </span>
            </div>

            {/* Gradient Scrim Bagian Bawah Tempat Teks Berada */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 md:p-6 bg-gradient-to-t from-navy-950/95 via-navy-950/80 via-45% to-transparent pt-10 sm:pt-14 z-20 flex flex-col justify-end">
              <h3 className="font-serif text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white group-hover:text-gold transition-colors leading-snug drop-shadow-sm line-clamp-2">
                {heroPaper.title}
              </h3>

              <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs md:text-[13px] text-stone-200/90 font-sans font-light line-clamp-2 leading-relaxed">
                {heroPaper.abstract}
              </p>

              <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[8.5px] sm:text-2xs font-sans text-stone-300">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="inline-flex items-center gap-1 font-medium text-stone-200">
                    <Users className="w-3 h-3 text-gold" />
                    {heroPaper.authors}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 font-mono font-semibold text-gold">
                    <Eye className="w-3 h-3 text-gold" />
                    {heroPaper.downloads} Pembaca
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-stone-300">
                    <Calendar className="w-3 h-3 text-gold" />
                    {heroPaper.date}
                  </span>
                </div>

                {/* Action Buttons: Live Interactive Reader & Download */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openReader(heroPaper)}
                    suppressHydrationWarning
                    className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gold hover:bg-gold-400 text-navy font-sans font-bold text-[8.5px] sm:text-2xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Baca File PDF Langsung</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Belum Ada Naskah Riset Terbit"
            description="Dewan Riset Suarantara belum memublikasikan naskah kajian. Policy brief, position paper, dan hasil riset gerakan mahasiswa akan tampil di sini begitu diterbitkan."
            hint="Redaksi riset sedang menyusun naskah pertama"
          />
        )}

        {/* 2. KATALOG RISET & POLICY BRIEF TEMATIK (Scientific Paper Ledger) */}
        {allPapers.length > 0 && (
        <div className="space-y-4">
          
          {/* Header Katalog Paper */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy/15 pb-2">
            <div>
              <h4 className="font-serif text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                Katalog Naskah Riset & Policy Brief
              </h4>
              <p className="text-[8.5px] sm:text-[10px] font-sans text-stone-500">
                Dokumentasi akademik dan kertas kebijakan resmi mahasiswa Nusantara
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(tab.key)
                    setVisibleCount(6)
                  }}
                  suppressHydrationWarning
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[8px] sm:text-2xs font-sans font-medium transition-colors shrink-0 select-none ${
                    selectedCategory === tab.key
                      ? 'bg-navy text-white font-bold'
                      : 'bg-white/80 hover:bg-navy/10 text-stone-700 border border-navy/15'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List Kartu Naskah Ilmiah (Tanpa Box Putih Kaku) */}
          {displayedPapers.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={FileText}
              title="Belum Ada Naskah pada Kategori Ini"
              description="Kategori riset yang Anda pilih belum memiliki naskah terbit. Silakan pilih kategori lain atau kembali ke seluruh riset."
            />
          ) : (
            <div className="space-y-3">
              {displayedPapers.map((paper) => (
                <article
                  key={paper.id}
                  className="bg-white/60 backdrop-blur-xs border border-navy/15 hover:border-gold p-3 sm:p-4 rounded-xl transition-all shadow-2xs group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded text-[7.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider bg-navy/10 text-navy border border-navy/20">
                        {paper.type}
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-sans font-semibold text-gold-700">
                        {paper.categoryLabel}
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-mono text-stone-400">
                      {paper.pages} Halaman • {paper.date}
                    </span>
                  </div>

                  {/* Judul Riset */}
                  <h5 className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug">
                    {paper.title}
                  </h5>

                  {/* Peneliti & Institusi */}
                  <p className="text-[9.5px] sm:text-[11px] font-sans text-stone-600 mt-0.5 sm:mt-1">
                    Oleh: <strong className="font-medium text-stone-800">{paper.authors}</strong> — {paper.institution}
                  </p>

                  {/* Cuplikan Abstrak */}
                  <p className="mt-1 text-[9px] sm:text-2xs text-stone-600 font-sans font-light leading-relaxed line-clamp-2">
                    {paper.abstract}
                  </p>

                  {/* Metadata & Action Buttons (Baca Langsung PDF + Unduh) */}
                  <div className="mt-2 sm:mt-2.5 pt-1.5 border-t border-stone-200/50 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[8.5px] sm:text-[10px] font-sans text-stone-500">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-mono text-stone-600 font-medium">
                        {paper.downloads} Unduhan
                      </span>
                      <span>•</span>
                      <span className="font-mono text-stone-600">
                        {paper.citations}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Tombol Lihat PDF Langsung (Google Drive Style Modal) */}
                      <button
                        type="button"
                        onClick={() => openReader(paper)}
                        suppressHydrationWarning
                        className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-navy/10 hover:bg-navy text-navy hover:text-white font-sans font-bold text-[8.5px] sm:text-[10px] uppercase tracking-wider transition-colors"
                      >
                        <Eye className="w-2.5 h-2.5 text-gold" />
                        <span>Baca PDF Langsung</span>
                      </button>

                      {/* Tombol Unduh File */}
                      <button
                        type="button"
                        onClick={() => openReader(paper)}
                        suppressHydrationWarning
                        className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-white/80 hover:bg-gold text-stone-700 hover:text-navy border border-navy/15 font-sans font-medium text-[8.5px] sm:text-[10px] transition-colors"
                      >
                        <Download className="w-2.5 h-2.5" />
                        <span>Unduh</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Tombol Lihat Naskah Lainnya Rata Kiri */}
          <div className="pt-1.5 sm:pt-2 flex justify-start">
            {hasMore ? (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 4)}
                suppressHydrationWarning
                className="group inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-serif font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors border-b-2 border-navy hover:border-gold pb-0.5 sm:pb-1 select-none"
              >
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold group-hover:rotate-90 transition-transform duration-200" />
                <span>Lihat Naskah Lainnya (+4 Naskah)</span>
              </button>
            ) : (
              <div className="text-left py-1 text-stone-500 text-[10px] sm:text-[11px] font-serif italic border-b border-stone-200/60 pb-1">
                Seluruh {filteredPapers.length} naskah riset telah ditampilkan
              </div>
            )}
          </div>

        </div>
        )}

        {/* 3. OBSERVATORIUM DATA MAHASISWA (Metrik Empiris Lapangan) */}
        <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
          <div className="flex items-center justify-between border-b border-navy/15 pb-2">
            <h4 className="font-serif text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
              Observatorium Data Mahasiswa Nusantara
            </h4>
            <span className="text-[8.5px] sm:text-[10px] font-sans text-stone-500 font-medium">
              Survei Independen Terbuka
            </span>
          </div>

          {indicators.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={BarChart3}
              title="Observatorium Belum Berisi Data"
              description="Metrik empiris hasil survei dan pendataan lapangan mahasiswa belum dipublikasikan oleh tim riset."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {indicators.map((ind) => (
                <div
                  key={ind.id}
                  className="bg-white/60 backdrop-blur-xs border border-navy/15 p-3 sm:p-3.5 rounded-xl space-y-1"
                >
                  <span className="text-[8.5px] sm:text-[10px] font-sans text-stone-500 uppercase font-semibold">
                    {ind.name}
                  </span>
                  <div className={`font-serif font-extrabold text-xl sm:text-2xl ${ind.textColor}`}>
                    {ind.metricValue}
                    {ind.metricSuffix ? (
                      <span className="text-[10px] sm:text-xs font-sans text-stone-500 font-normal"> {ind.metricSuffix}</span>
                    ) : null}
                  </div>
                  <p className="text-[8.5px] sm:text-[10px] text-stone-600 font-sans leading-tight">
                    {ind.statusNote}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ════════════════ KONTEN KANAN: CALL FOR PAPERS, REKOMENDASI & AGENDA BEDAH RISET (4 KOLOM) ════════════════ */}
      <div className="lg:col-span-4 space-y-4 sm:space-y-6">
        
        {/* 1. CALL FOR PAPERS / KIRIM NASKAH RISET MAHASISWA (Tanpa Font Putih) */}
        <div className="bg-white border-2 border-gold/60 p-3.5 sm:p-5 rounded-xl shadow-md space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-navy/15 pb-2">
            <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
              Call for Papers
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-gold/20 text-gold-900 text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider">
              Terbuka
            </span>
          </div>

          <h4 className="font-serif text-xs sm:text-sm md:text-base font-extrabold text-navy leading-snug">
            Punya Skripsi, Position Paper, atau Policy Brief Kampus?
          </h4>

          <p className="text-[10px] sm:text-2xs text-stone-700 font-sans leading-relaxed">
            Dewan Riset Suarantara membuka kurasi naskah ilmiah gerakan mahasiswa untuk dipublikasikan dan didistribusikan kepada pembuat kebijakan nasional.
          </p>

          <div className="space-y-1.5 pt-1 text-[9.5px] sm:text-[11px] font-sans text-stone-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
              <span>Format Naskah: PDF, DOCX, atau LaTeX</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
              <span>Peer-Review oleh Akademisi &amp; Peneliti BEM</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
              <span>Distribusi ke Jaringan Media &amp; Parlemen</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1.5 space-y-2">
            <Link
              href="/kirim-suara"
              className="w-full text-center block py-2 sm:py-2.5 rounded-full bg-gold hover:bg-gold-500 text-navy font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors shadow-sm border border-gold-600 active:scale-95"
            >
              Kirimkan Naskah Kajian
            </Link>

            <Link
              href="#pedoman-penulisan"
              className="w-full text-center block py-1.5 sm:py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-sans font-semibold text-[10px] sm:text-xs tracking-wide transition-colors"
            >
              Pedoman Penulisan &amp; Format Naskah
            </Link>
          </div>
        </div>

        {/* 2. REKOMENDASI KEBIJAKAN UTAMA MAHASISWA (Policy Takeaways) */}
        <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-1.5 border-b border-navy/15 pb-2">
            <Bookmark className="w-3.5 h-3.5 text-navy" />
            <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy">
              Rekomendasi Kebijakan Mahasiswa
            </span>
          </div>

          {policyRecs.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={Bookmark}
              title="Belum Ada Rekomendasi Kebijakan"
              description="Butir rekomendasi kebijakan hasil konsolidasi gerakan mahasiswa belum dirilis."
            />
          ) : (
            <div className="space-y-2 text-[10px] sm:text-xs font-sans text-stone-700">
              {policyRecs.map((rec, idx) => (
                <div key={rec.id} className="flex items-start gap-2 sm:gap-2.5">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-navy text-gold text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-snug">
                    <strong>{rec.title}:</strong> {rec.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. AGENDA BEDAH RISET & MIMBAR ILMIAH TERBUKA */}
        <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between border-b border-navy/15 pb-2">
            <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-crimson" />
              Agenda Mimbar Riset
            </span>
            {researchEvent && (
              <span className="text-[8px] sm:text-[9px] font-sans px-1.5 sm:px-2 py-0.5 rounded-full bg-gold/15 text-gold-800 font-bold">
                {researchEvent.eventType}
              </span>
            )}
          </div>

          {researchEvent ? (
            <>
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono text-crimson font-bold uppercase">
                  {researchEvent.eventDatetime}
                </span>
                <h5 className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-snug mt-0.5">
                  {researchEvent.title}
                </h5>
                <p className="text-[9.5px] sm:text-[11px] font-sans text-stone-600 mt-1">
                  Bersama: {researchEvent.speakers}
                </p>
              </div>

              <a
                href={researchEvent.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center block py-2 rounded-full bg-navy hover:bg-gold text-white hover:text-navy font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                Daftar Ikut Diskusi (Gratis)
              </a>
            </>
          ) : (
            <EmptyState
              variant="compact"
              icon={Calendar}
              title="Belum Ada Agenda Mimbar Riset"
              description="Jadwal bedah naskah, webinar, dan diskusi ilmiah terbuka akan diumumkan di sini."
            />
          )}
        </div>

      </div>

      {/* ════════════════ INTERACTIVE PDF / DOCUMENT READER MODAL (Google Drive Style) ════════════════ */}
      {readingPaper && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
          
          {/* Reader Window Container */}
          <div className="bg-white w-full max-w-4xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-navy/30">
            
            {/* Top Toolbar (Google Docs / Drive Reader Bar) */}
            <div className="bg-[#0E1930] text-white px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-b border-white/10 shrink-0">
              
              {/* Judul Dokumen */}
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2 sm:pr-4">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-[11px] sm:text-sm text-white truncate">
                    {readingPaper.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-stone-300 font-sans truncate">
                    {readingPaper.authors} • {readingPaper.type}
                  </p>
                </div>
              </div>

              {/* Controls Toolbar: Zoom, Print, Download, Close */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.max(70, prev - 15))}
                    className="hover:text-gold transition-colors p-0.5"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
                    className="hover:text-gold transition-colors p-0.5"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Print button */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
                  title="Cetak Naskah"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* Download Button */}
                <a
                  href={readingPaper.fileUrl || '#unduh'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold hover:bg-gold-400 text-navy font-sans font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  title="Unduh File PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh PDF</span>
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeReader}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-crimson text-stone-300 hover:text-white transition-colors ml-1"
                  title="Tutup Pratinjau Dokumen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Document Content Viewport (Scrollable PDF Simulation) */}
            <div className="flex-1 bg-stone-100 overflow-y-auto p-2 sm:p-6 md:p-8 flex justify-center">
              
              {/* Paper Page Sheet (Koran / Academic Paper Page Layout) */}
              <div
                className="bg-white text-stone-900 shadow-xl border border-stone-200 max-w-2xl w-full p-4 sm:p-10 md:p-12 transition-transform duration-200 origin-top min-h-[900px] flex flex-col justify-between"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                <div>
                  {/* Paper Header / Running Head */}
                  <div className="border-b-2 border-navy pb-2 sm:pb-3 mb-4 sm:mb-6 flex items-center justify-between text-[8px] sm:text-2xs font-sans text-stone-500 uppercase tracking-widest">
                    <span>Dewan Riset Strategis Suarantara</span>
                    <span>{readingPaper.type} • No. 04/2026</span>
                    <span>{readingPaper.date}</span>
                  </div>

                  {/* Judul Resmi Naskah */}
                  <h1 className="font-serif text-base sm:text-xl md:text-2xl font-extrabold text-navy leading-tight mb-2">
                    {readingPaper.title}
                  </h1>

                  {/* Penulis & Institusi */}
                  <div className="text-[10px] sm:text-xs font-sans text-stone-700 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-stone-100">
                    <p className="font-bold text-stone-900">{readingPaper.authors}</p>
                    <p className="text-stone-500 italic">{readingPaper.institution}</p>
                  </div>

                  {/* Abstrak Box */}
                  <div className="bg-stone-50 border-l-4 border-gold p-3 sm:p-4 rounded-r-md mb-4 sm:mb-6 space-y-1 sm:space-y-1.5">
                    <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy block">
                      Ringkasan Eksekutif (Abstract)
                    </span>
                    <p className="font-sans text-[10px] sm:text-xs text-stone-700 leading-relaxed italic">
                      &ldquo;{readingPaper.abstract}&rdquo;
                    </p>
                  </div>

                  {/* Poin Temuan Utama (Key Findings) */}
                  {readingPaper.executiveSummary.length > 0 && (
                    <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
                      <h2 className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-navy flex items-center gap-1.5 border-b border-stone-200 pb-1.5">
                        <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                        Temuan Kunci Hasil Survei Lapangan
                      </h2>
                      <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs font-sans text-stone-700 list-disc pl-5 leading-relaxed">
                        {readingPaper.executiveSummary.map((item, idx) => (
                          <li key={idx} className="pl-1">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Rekomendasi Kebijakan Konkret */}
                  {readingPaper.recommendations.length > 0 && (
                    <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
                      <h2 className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-navy flex items-center gap-1.5 border-b border-stone-200 pb-1.5">
                        <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                        Rekomendasi Kebijakan (Policy Recommendations)
                      </h2>
                      <div className="space-y-2 text-[10px] sm:text-xs font-sans text-stone-700">
                        {readingPaper.recommendations.map((rec, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2 bg-navy/5 p-2 sm:p-2.5 rounded border border-navy/10">
                            <span className="font-bold text-navy shrink-0">{rIdx + 1}.</span>
                            <span className="leading-snug">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Paper Footer / Page Number */}
                <div className="pt-6 sm:pt-8 border-t border-stone-200 flex items-center justify-between text-[8px] sm:text-2xs font-sans text-stone-400">
                  <span>Dokumen Resmi Suarantara • Distribusi Publik Terbuka</span>
                  <span>Halaman {activePage} dari {readingPaper.pages}</span>
                </div>

              </div>

            </div>

            {/* Bottom Navigation Footer in Reader */}
            <div className="bg-white border-t border-stone-200 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-[10px] sm:text-xs font-sans text-stone-600 shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
                  disabled={activePage === 1}
                  className="p-1 rounded hover:bg-stone-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>Halaman {activePage} dari {readingPaper.pages}</span>
                <button
                  type="button"
                  onClick={() => setActivePage((prev) => Math.min(readingPaper.pages, prev + 1))}
                  disabled={activePage === readingPaper.pages}
                  className="p-1 rounded hover:bg-stone-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-stone-500 text-[9px] sm:text-2xs">
                Tekan tombol <kbd className="px-1.5 py-0.5 bg-stone-100 border rounded font-mono text-[9px] sm:text-[10px]">Tutup</kbd> untuk kembali
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}
