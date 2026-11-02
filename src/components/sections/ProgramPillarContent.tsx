'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Scale,
  Newspaper,
  Compass,
  FileText,
  Building2,
} from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

// Schema modular siap CMS
export interface ProgramArticle {
  id: string
  code: string
  title: string
  category: 'Advokasi' | 'Media & Pers' | 'Riset & Kajian' | 'Pengabdian'
  status: 'Sedang Berjalan' | 'Registrasi Dibuka' | 'Akan Datang' | 'Edisi Selesai'
  statusColor: string
  date: string
  location: string
  host: string
  headlineImageGrad: string
  coverImageUrl?: string | null
  iconColor: string
  iconType: 'newspaper' | 'scale' | 'book' | 'compass'
  lead: string
  highlights: string[]
  author: string
  editionNumber: string
  slug: string
}

export function ProgramPillarContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [activeModalProgram, setActiveModalProgram] = useState<ProgramArticle | null>(null)
  const [allPrograms, setAllPrograms] = useState<ProgramArticle[]>([])

  // Sinkronisasi dinamis dari CMS Database
  useEffect(() => {
    fetch('/api/cms/programs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.programs && data.programs.length > 0) {
          setAllPrograms(
            data.programs.map((pr: any) => ({
              id: pr.programCode || pr.id,
              code: pr.programCode,
              title: pr.title,
              category: pr.category as any,
              status: pr.status as any,
              statusColor: pr.statusColor,
              date: pr.dateRange,
              location: pr.locationVenue,
              host: pr.hostOrganizer,
              headlineImageGrad: pr.headlineImageGrad,
              coverImageUrl: pr.coverImageUrl || null,
              iconColor: pr.iconColor,
              iconType: pr.iconType as any,
              lead: pr.leadBackground,
              highlights: typeof pr.highlights === 'string' ? JSON.parse(pr.highlights || '[]') : pr.highlights,
              author: pr.author,
              editionNumber: pr.editionNumber,
              slug: pr.slug,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  const categories = ['Semua', 'Advokasi', 'Media & Pers', 'Riset & Kajian', 'Pengabdian']

  const filteredPrograms =
    selectedCategory === 'Semua'
      ? allPrograms
      : allPrograms.filter((item) => item.category === selectedCategory)

  // Program Utama / Headline Program Koran
  const headlineProgram = allPrograms[0] || null

  return (
    <div
      id="program"
      className="w-full relative z-10 select-none animate-in fade-in duration-200"
    >
      {/* ─── KOP EDITORIAL KORAN: DOKUMEN PROGRAM RESMI ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/15 pb-2 sm:pb-2.5 mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-2xs font-sans font-bold uppercase tracking-widest bg-gold text-navy shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>Kanal Program &amp; Agenda Aksi</span>
          </span>
          <span className="text-[8.5px] sm:text-xs font-mono text-stone-500">
            Katalog Kegiatan Resmi • CMS-Ready
          </span>
        </div>
        <span className="text-[8.5px] sm:text-xs font-serif italic text-stone-600">
          Manifestasi Aksi Nyata Tri Dharma Perguruan Tinggi Mahasiswa Nusantara
        </span>
      </div>

      {/* ─── GRID UTAMA KORAN: BANNER UTAMA + KATALOG PROGRAM (8 KOLOM) & SIDEBAR CMS / KALENDER (4 KOLOM) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ════════════════ KONTEN KIRI: HEADLINE PROGRAM & ARTIKEL GRID KORAN (8 KOLOM) ════════════════ */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          
          {/* 1. BANNER UTAMA PROGRAM TERBESAR (Gaya Headline Berita Koran Modern) */}
          {headlineProgram ? (
          <article className="relative w-full rounded-2xl overflow-hidden border border-navy/25 group cursor-pointer shadow-md bg-gradient-to-tr from-navy-950 via-navy-900 to-stone-900 p-4 sm:p-7 text-white space-y-3 sm:space-y-4">
            <div className="absolute inset-0 bg-[radial-gradient(#d4a200_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Badges Baris Atas */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider bg-gold text-navy shadow-xs">
                  Program Unggulan Nasional
                </span>
                <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-semibold border ${headlineProgram.statusColor}`}>
                  {headlineProgram.status}
                </span>
              </div>
              <span className="text-[8.5px] sm:text-[10px] font-mono text-stone-300">
                {headlineProgram.editionNumber}
              </span>
            </div>

            {/* Judul Headline Besar & Gagah */}
            <div className="relative z-10 space-y-1.5 sm:space-y-2">
              <h3 className="font-serif text-base sm:text-xl md:text-2xl font-extrabold text-white group-hover:text-gold transition-colors leading-snug drop-shadow-sm">
                {headlineProgram.title}
              </h3>

              <p className="font-sans text-[11px] sm:text-xs md:text-[13px] text-stone-200/90 font-light leading-relaxed">
                {headlineProgram.lead}
              </p>
            </div>

            {/* Poin Tematik Program */}
            <div className="relative z-10 bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
              <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-gold block">
                Fokus Materi &amp; Capaian Pelatihan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 text-[9.5px] sm:text-2xs font-sans text-stone-200">
                {headlineProgram.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    <span className="leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Footer: Tanggal, Lokasi, Penyelenggara & Tombol Detail */}
            <div className="relative z-10 pt-2.5 sm:pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[8.5px] sm:text-2xs font-sans text-stone-300">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1 text-stone-200">
                  <Calendar className="w-3 h-3 text-gold" />
                  {headlineProgram.date}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-stone-200">
                  <MapPin className="w-3 h-3 text-gold" />
                  {headlineProgram.location}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-stone-300">
                  <Building2 className="w-3 h-3 text-gold" />
                  {headlineProgram.host}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/program/${headlineProgram.slug}`}
                  className="font-serif font-bold text-gold hover:text-white text-[10px] sm:text-xs inline-flex items-center gap-1 transition-colors"
                >
                  <span>Buka Halaman Detail Program</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
          ) : (
            <EmptyState
              icon={Compass}
              title="Belum Ada Program Terdaftar"
              description="Agenda program kerja Suarantara akan tampil di sini setelah redaksi menambahkannya melalui panel CMS."
              hint="Redaksi sedang menyusun agenda program"
            />
          )}

          {/* 2. FILTER KATEGORI PROGRAM */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 border-b border-navy/15 pb-2 sm:pb-2.5">
            <div>
              <h4 className="font-serif text-[10.5px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                Daftar Program &amp; Artikel Kegiatan
              </h4>
              <p className="text-[8.5px] sm:text-[10px] font-sans text-stone-500">
                Menampilkan {filteredPrograms.length} program kegiatan aktif
              </p>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[8px] sm:text-2xs font-sans font-medium transition-colors shrink-0 select-none ${
                    selectedCategory === cat
                      ? 'bg-navy text-white font-bold shadow-xs'
                      : 'bg-white/70 hover:bg-navy/10 text-stone-700 border border-navy/15'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. GRID PROGRAM SEPERTI BERITA KORAN (Gambar, Keterangan, Judul & Metadata) */}
          {filteredPrograms.length === 0 ? (
            <EmptyState
              variant="compact"
              icon={FileText}
              title="Belum Ada Program pada Kategori Ini"
              description="Program kegiatan akan muncul di sini setelah ditambahkan melalui panel CMS. Silakan pilih kategori lain atau kembali ke 'Semua'."
              hint="Redaksi sedang menyiapkan agenda"
            />
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredPrograms.map((prog) => {
              const isMedia = prog.iconType === 'newspaper'
              const isAdvocacy = prog.iconType === 'scale'
              const isResearch = prog.iconType === 'book'
              const IconComp = isMedia ? Newspaper : isAdvocacy ? Scale : isResearch ? BookOpen : Compass

              return (
                <article
                  key={prog.id}
                  onClick={() => setActiveModalProgram(prog)}
                  className="bg-white/70 backdrop-blur-xs border border-navy/15 hover:border-gold p-3 sm:p-4 rounded-xl flex flex-col justify-between group cursor-pointer transition-all shadow-2xs"
                >
                  <div>
                    {/* Visual Banner Gambar Koran */}
                    <div
                      className={`relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gradient-to-tr ${prog.headlineImageGrad} border border-navy/15 mb-2.5 sm:mb-3 flex items-center justify-center shadow-xs group-hover:scale-[1.01] transition-transform`}
                    >
                      {prog.coverImageUrl ? (
                        <Image
                          src={prog.coverImageUrl}
                          alt={prog.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 400px"
                        />
                      ) : (
                        <div className="text-center p-2 sm:p-3 text-white/80">
                          <IconComp className={`w-5 h-5 sm:w-6 sm:h-6 ${prog.iconColor} mx-auto mb-1`} />
                          <span className="font-serif text-[9px] sm:text-[10px] tracking-wider uppercase text-stone-200">
                            {prog.category}
                          </span>
                        </div>
                      )}

                      {/* Status Tag di Pojok Atas */}
                      <span className={`absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider border backdrop-blur-md ${prog.statusColor}`}>
                        {prog.status}
                      </span>

                      {/* Kode CMS di Pojok Kanan Atas */}
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[7.5px] sm:text-[8px] font-mono text-stone-300">
                        {prog.code}
                      </span>
                    </div>

                    {/* Judul Seperti Berita Koran */}
                    <h5 className="font-serif text-[11px] sm:text-xs md:text-[13px] font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug line-clamp-2">
                      {prog.title}
                    </h5>

                    {/* Keterangan / Cuplikan Ringkasan Kegiatan */}
                    <p className="mt-1 sm:mt-1.5 text-[9.5px] sm:text-2xs text-stone-600 font-sans font-light leading-relaxed line-clamp-2">
                      {prog.lead}
                    </p>
                  </div>

                  {/* Metadata Koran: Tanggal, Lokasi & Tombol Aksi */}
                  <div className="mt-2.5 sm:mt-3 pt-1.5 sm:pt-2 border-t border-stone-200/60 flex items-center justify-between text-[8.5px] sm:text-[10px] font-sans text-stone-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3 h-3 text-gold-700 shrink-0" />
                      <span className="truncate">{prog.date}</span>
                    </div>

                    <span className="font-serif font-bold text-navy group-hover:text-gold transition-colors text-[9.5px] sm:text-[11px] shrink-0 inline-flex items-center gap-0.5">
                      <span>Detail</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
          )}

        </div>

        {/* ════════════════ SISI KANAN: SIDEBAR CMS KALENDER & ALUR KEGIATAN (4 KOLOM) ════════════════ */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          
          {/* 1. KOTAK METADATA CMS PROGRAM */}
          <div className="bg-white/70 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3.5">
            <div className="flex items-center justify-between border-b border-navy/15 pb-2">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gold-700" />
                Skema CMS Program Kerja
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold-900 font-bold">
                CMS Ready
              </span>
            </div>

            <dl className="divide-y divide-stone-100 text-[10px] sm:text-xs font-sans space-y-1.5 sm:space-y-2">
              <div className="flex justify-between pt-1">
                <dt className="text-stone-500">Total Program Terdaftar:</dt>
                <dd className="font-bold text-navy text-right">{allPrograms.length} Program Agenda</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Agenda Terdekat:</dt>
                <dd className="font-semibold text-emerald-700 text-right">
                  {allPrograms[0]?.date || 'Belum ada agenda'}
                </dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Tuan Rumah Perdana:</dt>
                <dd className="font-medium text-stone-800 text-right">
                  {allPrograms[0]?.host || 'BEM STMIK Jayakarta'}
                </dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Format Keterlibatan:</dt>
                <dd className="font-medium text-stone-800 text-right">Terbuka / Seluruh Mahasiswa</dd>
              </div>
            </dl>

            <div className="pt-1.5 sm:pt-2 border-t border-navy/10 text-[9.5px] sm:text-[11px] font-sans text-stone-500 italic leading-snug">
              Semua agenda program dirancang menggunakan parameter dinamis untuk integrasi penuh ke database CMS Suarantara.
            </div>
          </div>

          {/* 2. CALLOUT AJUKAN PROGRAM / KOLABORASI KAMPUS (Tanpa Font Putih) */}
          <div className="bg-white border-2 border-gold/60 p-3.5 sm:p-5 rounded-xl shadow-md space-y-2.5 sm:space-y-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-navy/15 pb-2">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-gold-700" />
                Usulkan Agenda Kampus
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold-900 text-[8px] sm:text-[9px] font-mono font-bold">
                Kolaboratif
              </span>
            </div>

            <h4 className="font-serif text-xs sm:text-sm md:text-base font-extrabold text-navy leading-snug">
              Punya Rencana Pelatihan, Aksi Advokasi, atau Diskusi di Kampus Anda?
            </h4>

            <p className="text-[10px] sm:text-2xs text-stone-700 font-sans leading-relaxed">
              Ajukan kolaborasi program kerja BEM atau Lembaga Pers kampus Anda untuk disiarkan dan diselenggarakan bersama jaringan Suarantara.
            </p>

            <div className="pt-1.5">
              <Link
                href="/kirim-suara"
                className="w-full text-center block py-2 sm:py-2.5 rounded-full bg-gold hover:bg-gold-500 text-navy font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors shadow-sm border border-gold-600"
              >
                Ajukan Program Kerja Sama
              </Link>
            </div>
          </div>

          {/* 3. ALUR TAHAPAN PENDAFTARAN PROGRAM */}
          <div className="bg-white/70 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3">
            <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy block border-b border-navy/15 pb-2">
              Alur Mengikuti Program Suarantara
            </span>

            <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs font-sans text-stone-700">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-navy text-gold text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>Pilih program yang berstatus <em>Registrasi Dibuka</em>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-navy text-gold text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>Isi formulir pendelegasian perwakilan BEM/individu.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-navy text-gold text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Dapatkan lembar konfirmasi &amp; panduan teknis kegiatan.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ─── MODAL PRATINJAU GAMBARAN DETAIL PROGRAM (SEBELUM ADA CMS & HALAMAN DETAIL) ─── */}
      {activeModalProgram && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white text-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-7 border border-navy/30 shadow-2xl space-y-3 sm:space-y-4">
            
            <div className="flex items-start justify-between gap-2.5 sm:gap-3 border-b border-stone-200 pb-2.5 sm:pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider bg-gold/20 text-gold-900 border border-gold/40">
                  {activeModalProgram.category} • {activeModalProgram.code}
                </span>
                <h4 className="font-serif text-sm sm:text-base md:text-lg font-bold text-navy mt-1 sm:mt-1.5 leading-snug">
                  {activeModalProgram.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProgram(null)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-stone-100 hover:bg-crimson hover:text-white flex items-center justify-center text-xs sm:text-sm font-bold transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Gambar Sampul Program (sinkron CMS) */}
            {activeModalProgram.coverImageUrl && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <Image
                  src={activeModalProgram.coverImageUrl}
                  alt={activeModalProgram.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 672px"
                />
              </div>
            )}

            {/* Info Waktu & Penyelenggara */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-[10.5px] sm:text-xs font-sans bg-stone-50 p-2.5 sm:p-3 rounded-xl border border-stone-200/70">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700 shrink-0" />
                <span><strong>Waktu:</strong> {activeModalProgram.date}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-crimson shrink-0" />
                <span><strong>Lokasi:</strong> {activeModalProgram.location}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 sm:col-span-2">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-navy shrink-0" />
                <span><strong>Penyelenggara:</strong> {activeModalProgram.host}</span>
              </div>
            </div>

            {/* Detail Gambaran Artikel Program */}
            <div className="space-y-1.5 sm:space-y-2 text-[10.5px] sm:text-xs font-sans text-stone-700 leading-relaxed font-light">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy block">
                Gambaran &amp; Latar Belakang Program:
              </span>
              <p>{activeModalProgram.lead}</p>

              <div className="bg-navy/5 p-2.5 sm:p-3 rounded-lg border border-navy/10 space-y-1 sm:space-y-1.5 mt-1.5 sm:mt-2">
                <span className="font-bold text-navy block text-[10px] sm:text-[11px]">Poin Utama Kegiatan:</span>
                <ul className="space-y-1 text-[10px] sm:text-[11px]">
                  {activeModalProgram.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Info CMS notice & Action */}
            <div className="pt-2.5 sm:pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-[9px] sm:text-2xs font-sans text-stone-500">
              <span>*Format artikel program tersinkronisasi langsung dengan portal koran.</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveModalProgram(null)}
                  className="w-full sm:w-auto px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 text-[10px] sm:text-xs font-bold transition-colors"
                >
                  Tutup
                </button>
                <Link
                  href={`/program/${activeModalProgram.slug}`}
                  className="w-full sm:w-auto px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-navy hover:bg-navy-900 text-gold text-[10px] sm:text-xs font-bold transition-colors text-center inline-flex items-center justify-center gap-1.5"
                >
                  <span>Buka Halaman Detail Penuh</span>
                  <ArrowRight className="w-3 h-3 text-gold" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
