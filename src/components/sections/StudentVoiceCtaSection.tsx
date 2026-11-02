'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Send, BookOpen, ShieldCheck, Sparkles, ChevronDown, X } from 'lucide-react'

// Panduan singkat redaksi — ditampilkan inline agar tombol "Panduan Redaksi"
// tidak menjadi tautan mati (sebelumnya href="#panduan" tanpa target).
const PANDUAN_REDAKSI: { title: string; desc: string }[] = [
  {
    title: 'Tulisan & Opini',
    desc: 'Naskah asli, minimal 400 kata, mencantumkan sumber data/fakta yang dapat diverifikasi.',
  },
  {
    title: 'Aduan & Advokasi',
    desc: 'Sertakan kronologi, bukti pendukung, dan pihak terkait. Identitas pelapor dirahasiakan.',
  },
  {
    title: 'Kajian & Riset',
    desc: 'Sertakan ringkasan, metode, serta kesimpulan. Cantumkan nama institusi/afiliasi.',
  },
  {
    title: 'Etika & Verifikasi',
    desc: 'Redaksi berhak menyunting tanpa mengubah substansi, dan menolak konten hoaks/SARA.',
  },
]

export function StudentVoiceCtaSection() {
  const [showGuide, setShowGuide] = useState(false)
  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-12 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 relative z-10">
      
      {/* ─── 3D POP-OUT CTA CONTAINER (Background Putih Elegan Sesuai Background Keseluruhan, Border Emas) ─── */}
      <div className="relative rounded-2xl bg-white border-2 border-gold/60 shadow-[0_20px_50px_rgba(27,45,94,0.12)] p-3 sm:p-7 md:p-10 overflow-visible">
        
        {/* Subtle Ornamental Grid Texture */}
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(#d4a200_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />

        {/* Layout Side-by-Side (Berdampingan di Seluruh Ukuran Layar: Mobile Portrait hingga Desktop) */}
        <div className="relative z-10 grid grid-cols-12 gap-2.5 sm:gap-6 lg:gap-8 items-center">
          
          {/* Kolom Teks & Tombol Aksi (7 Kolom, Font Responsif Proporsional agar Pas Bersebelahan) */}
          <div className="col-span-7 space-y-2 sm:space-y-3.5 text-left">
            
            {/* Minimalist Gold Tag */}
            <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gold/15 border border-gold/40 text-navy text-[8px] sm:text-[10px] md:text-xs font-sans font-bold uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold-700" />
              <span>Ruang Partisipasi Publik</span>
            </div>

            {/* Judul Utama (Proporsional di Mobile agar tidak makan ruang) */}
            <h3 className="font-serif text-xs sm:text-lg md:text-2xl lg:text-3xl font-extrabold text-navy leading-tight sm:leading-snug max-w-lg">
              Punya Berita, Aspirasi, atau Riset Kampus yang Ingin Dipublikasikan?
            </h3>

            {/* Deskripsi */}
            <p className="font-sans text-[9px] sm:text-xs md:text-sm text-stone-700 font-normal leading-relaxed line-clamp-3 sm:line-clamp-none max-w-md">
              Suarantara menyediakan kanal terbuka bagi seluruh mahasiswa Nusantara untuk menyuarakan fakta, kajian riset, dan aduan advokasi kampus.
            </p>

            {/* Action Buttons (Tertata rapi di samping foto) */}
            <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
              <Link
                href="/kirim-suara"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-gold hover:bg-gold-500 text-navy font-sans font-bold text-[9px] sm:text-xs uppercase tracking-wider transition-all duration-200 border border-gold-600 shadow-md hover:shadow-gold/30 hover:scale-105 active:scale-95"
              >
                <Send className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                <span>Sampaikan Suara</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowGuide((v) => !v)}
                aria-expanded={showGuide}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-navy border border-stone-300 font-sans font-semibold text-[8px] sm:text-xs tracking-wide transition-all duration-200 shadow-xs cursor-pointer"
              >
                <BookOpen className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold-700" />
                <span>Panduan Redaksi</span>
                <ChevronDown className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${showGuide ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Panel Panduan Redaksi (inline, tanpa tautan mati) */}
            {showGuide && (
              <div className="mt-2 rounded-xl border border-gold/40 bg-gold/5 p-3 sm:p-4 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif font-bold text-navy text-[10px] sm:text-sm">Panduan Pengiriman ke Redaksi</span>
                  <button
                    type="button"
                    onClick={() => setShowGuide(false)}
                    aria-label="Tutup panduan"
                    className="text-stone-400 hover:text-navy transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="space-y-1.5">
                  {PANDUAN_REDAKSI.map((item) => (
                    <li key={item.title} className="flex gap-1.5 text-[9px] sm:text-xs font-sans text-stone-600 leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-gold-600/80 mt-1.5 shrink-0" />
                      <span>
                        <span className="font-semibold text-navy">{item.title}:</span> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keamanan & Validasi Kerahasiaan */}
            <div className="pt-0.5 sm:pt-1 flex items-center gap-1.5 text-stone-600 text-[8px] sm:text-[10px] md:text-[11px] font-sans">
              <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gold-700 shrink-0" />
              <span className="line-clamp-1 sm:line-clamp-none">Identitas &amp; bukti aduan advokasi terenkripsi aman.</span>
            </div>

          </div>

          {/* Kolom Efek 3D Foto Orang Pop-Out Bersebelahan (5 Kolom, Kepala & Leher Melewati Batas Atas Kotak) */}
          <div className="col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[150px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[360px] h-52 sm:h-72 md:h-88 lg:h-[470px] -mt-10 sm:-mt-16 md:-mt-28 lg:-mt-40 transition-transform duration-300 hover:scale-[1.03] flex items-end justify-center pointer-events-none">
              
              {/* Gambar Sosok Asli Cutout Tanpa Kotak / Tanpa Box Frame */}
              <div className="relative w-full h-full flex items-end justify-center">
                <Image
                  src="/tentang-kami-mahasiswa-cutout.png"
                  alt="Wisnu Saputra - Inisiator Suarantara & Wapresma BEM STMIK Jayakarta"
                  fill
                  priority
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 280px, 380px"
                  className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(27,45,94,0.38)] z-10"
                />

                {/* Efek Hitam Ngelingker di Bawah Kaki (Efek Nyata Napak di Lantai) */}
                <div className="absolute -bottom-1 w-24 sm:w-40 md:w-56 h-3 sm:h-5 bg-black/45 rounded-[100%] blur-sm pointer-events-none z-0" />
                <div className="absolute -bottom-0.5 w-16 sm:w-28 md:w-36 h-2 sm:h-2.5 bg-black/70 rounded-[100%] blur-2xs pointer-events-none z-0" />
              </div>

              {/* Floating Plakat Identitas Minimalis Elegan */}
              <div className="absolute -bottom-2 sm:-bottom-3 right-0 sm:right-2 bg-white/95 backdrop-blur-md border border-gold/70 py-0.5 sm:py-1 px-2 sm:px-3 rounded-full shadow-md text-center pointer-events-auto z-20">
                <span className="font-serif font-bold text-[8px] sm:text-xs text-navy block leading-tight">
                  Wisnu Saputra
                </span>
                <span className="text-[7px] sm:text-[9px] font-sans text-stone-500 font-medium block">
                  Inisiator Suarantara
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  )
}
