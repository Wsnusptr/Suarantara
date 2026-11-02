'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  History,
  Shield,
  Target,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Award,
  CheckCircle2,
  Bookmark,
  Scale,
  Newspaper,
  BookOpen,
} from 'lucide-react'

export function AboutUsSection() {
  return (
    <div
      id="tentang-kami"
      className="w-full relative z-10 select-none animate-in fade-in duration-200"
    >
      {/* ─── KOP KORAN RESMI & DOKUMEN MANIFESTO ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/15 pb-2 sm:pb-2.5 mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-2xs font-sans font-bold uppercase tracking-widest bg-gold text-navy shadow-xs">
            Dokumen Resmi Organisasi
          </span>
          <span className="text-[8.5px] sm:text-xs font-mono text-stone-500">
            Deklarasi: 15 Oktober 2026 • Arsip No. 01/SUARANTARA
          </span>
        </div>
        <span className="text-[8.5px] sm:text-xs font-serif italic text-stone-600">
          STMIK Jayakarta • Seluruh Mahasiswa Nusantara
        </span>
      </div>

      {/* ─── GRID UTAMA: KONTEN SEJARAH (KIRI 7 KOLOM) & FOTO INISIATOR LONJONG (KANAN 5 KOLOM) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        
        {/* ════════════════ SISI KIRI: SEJARAH, PONDASI & AMBISI (7 KOLOM) ════════════════ */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          
          {/* PULL QUOTE EDITORIAL / INTISARI MANIFESTO */}
          <div className="border-l-4 border-gold bg-white/70 backdrop-blur-xs p-3.5 sm:p-5 rounded-r-xl border-y border-r border-navy/15 shadow-xs">
            <p className="font-serif text-xs sm:text-sm md:text-base italic text-stone-800 leading-relaxed">
              &ldquo;Ketika kebijakan publik kian berjarak dari jerit nurani kerakyatan dan ruang mimbar kampus dibatasi sekat administratif, keheningan bukanlah pilihan. Suarantara didirikan sebagai jembatan moral dan benteng nalar kritis mahasiswa untuk membela hak-hak rakyat Indonesia.&rdquo;
            </p>
            <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[9px] sm:text-2xs font-sans text-stone-500 border-t border-stone-200/60 pt-1.5 sm:pt-2">
              <span className="font-bold text-navy uppercase tracking-wider">
                Manifesto Gerakan 15 Oktober 2026
              </span>
              <span className="font-mono text-gold-700 font-semibold">
                Jakarta • Nusantara
              </span>
            </div>
          </div>

          {/* BAB I: KRONIK SEJARAH & INISIATIF KELAHIRAN */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-2 border-b border-navy/15 pb-1.5 sm:pb-2">
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
              <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-navy">
                I. Sejarah &amp; Inisiatif Kelahiran Suarantara
              </h3>
            </div>

            <div className="font-sans text-[11px] sm:text-xs md:text-[13px] text-stone-700 leading-relaxed space-y-2.5 sm:space-y-3 font-light text-justify">
              <p>
                <strong className="font-serif font-bold text-navy text-xs sm:text-sm">SUARANTARA</strong> secara resmi didirikan pada{' '}
                <strong className="font-medium text-stone-900">15 Oktober 2026</strong>. Inisiatif bersejarah ini diprakarsai oleh{' '}
                <strong className="font-serif font-bold text-navy">Wisnu Saputra</strong>, yang menjabat sebagai{' '}
                <strong className="font-medium text-stone-900">Wakil Presiden Mahasiswa BEM STMIK Jayakarta</strong>.
              </p>
              <p>
                Kelahiran wadah ini berakar dari telaah mendalam terhadap situasi dan kondisi sosio-politik bangsa yang tengah menghadapi pusaran polemik arah kebijakan negara—terutama regulasi yang dinilai tidak berpihak kepada kepentingan masyarakat luas, tingginya komersialisasi sektor pendidikan, serta penyempitan ruang demokrasi di lingkungan sivitas akademika.
              </p>
              <p>
                Menjawab tantangan tersebut, Suarantara hadir mengonsolidasikan energi intelektual mahasiswa ke dalam tiga matra pergerakan yang terintegrasi:
              </p>

              {/* TIGA MATRA GERAKAN SUARANTARA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                <div className="bg-white/60 backdrop-blur-xs border border-navy/15 p-2.5 sm:p-3 rounded-lg shadow-2xs">
                  <div className="flex items-center gap-1.5 text-navy font-serif font-bold text-[10.5px] sm:text-xs mb-1">
                    <Newspaper className="w-3.5 h-3.5 text-gold-700" />
                    <span>Media Independen</span>
                  </div>
                  <p className="text-[9.5px] sm:text-[11px] text-stone-600 leading-snug">
                    Saluran warta yang menyuarakan fakta akurat, relevan, terverifikasi, dan bebas dari oligarki informasi.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-xs border border-navy/15 p-2.5 sm:p-3 rounded-lg shadow-2xs">
                  <div className="flex items-center gap-1.5 text-crimson font-serif font-bold text-[10.5px] sm:text-xs mb-1">
                    <Scale className="w-3.5 h-3.5 text-crimson" />
                    <span>Advokasi Nyata</span>
                  </div>
                  <p className="text-[9.5px] sm:text-[11px] text-stone-600 leading-snug">
                    Jembatan pendampingan hukum dan advokasi terbuka demi mengawal hak-hak rakyat serta mahasiswa.
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-xs border border-navy/15 p-2.5 sm:p-3 rounded-lg shadow-2xs">
                  <div className="flex items-center gap-1.5 text-gold-800 font-serif font-bold text-[10.5px] sm:text-xs mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-gold-700" />
                    <span>Kajian Kritis</span>
                  </div>
                  <p className="text-[9.5px] sm:text-[11px] text-stone-600 leading-snug">
                    Pusat riset dan policy brief berbasis data ilmiah untuk membedah arah kebijakan publik Indonesia.
                  </p>
                </div>
              </div>

              <p className="pt-1">
                Dalam perjalanannya, Suarantara telah resmi menjalin kolaborasi strategis dengan{' '}
                <strong className="font-medium text-stone-900">BEM STMIK Jayakarta</strong> dan kini membuka pintu selebar-lebarnya bagi seluruh lembaga kemahasiswaan (BEM, Senat, DPM), unit pers kampus, kelompok studi, maupun mahasiswa perorangan se-Nusantara yang memiliki kesamaan nafas perjuangan: <span className="font-semibold text-navy">demokratis, progresif, intelektual, dan berintegritas tinggi</span>.
              </p>
            </div>
          </div>

          {/* BAB II: ACUAN PONDASI & TULANG UKUR ORGANISASI */}
          <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
            <div className="flex items-center gap-2 border-b border-navy/15 pb-1.5 sm:pb-2">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
              <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-navy">
                II. Pondasi &amp; Tulang Ukur Organisasi (Core Values)
              </h3>
            </div>

            <p className="text-[10px] sm:text-xs text-stone-600 font-sans font-light">
              Suarantara menetapkan empat pilar nilai mutlak sebagai kompas etis dan tolak ukur dalam setiap langkah pergerakan:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 pt-1">
              {/* Point 1: Pengabdian Masyarakat */}
              <div className="bg-white/60 backdrop-blur-xs border-l-3 border-navy border border-navy/15 p-2.5 sm:p-3.5 rounded-r-lg space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-navy text-gold text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h4 className="font-serif font-bold text-[11px] sm:text-xs text-navy">
                    Pengabdian Terhadap Masyarakat
                  </h4>
                </div>
                <p className="text-[9.5px] sm:text-2xs text-stone-600 font-sans leading-relaxed">
                  Menghidupkan Tri Dharma Perguruan Tinggi dengan turun langsung ke akar rumput, mendengar keluh kesah rakyat, dan memastikan kerja intelektual bermuara pada keadilan sosial.
                </p>
              </div>

              {/* Point 2: Integritas Intelektual */}
              <div className="bg-white/60 backdrop-blur-xs border-l-3 border-gold border border-navy/15 p-2.5 sm:p-3.5 rounded-r-lg space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-gold text-navy text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h4 className="font-serif font-bold text-[11px] sm:text-xs text-navy">
                    Integritas Nalar Intelektual Kritis
                  </h4>
                </div>
                <p className="text-[9.5px] sm:text-2xs text-stone-600 font-sans leading-relaxed">
                  Menjaga kejujuran akademik, ketelitian metodologi riset, dan kebebasan berpikir yang tidak dapat dibeli maupun dikompromikan oleh kepentingan kekuasaan semu.
                </p>
              </div>

              {/* Point 3: Independensi Moral */}
              <div className="bg-white/60 backdrop-blur-xs border-l-3 border-crimson border border-navy/15 p-2.5 sm:p-3.5 rounded-r-lg space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-crimson text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h4 className="font-serif font-bold text-[11px] sm:text-xs text-navy">
                    Independensi Moral &amp; Keberpihakan
                  </h4>
                </div>
                <p className="text-[9.5px] sm:text-2xs text-stone-600 font-sans leading-relaxed">
                  Steril dari kooptasi partai politik praktis, dominasi korporasi pemodal, dan tirani birokrasi, tegak lurus mengawal kebenaran faktual.
                </p>
              </div>

              {/* Point 4: Solidaritas Nusantara */}
              <div className="bg-white/60 backdrop-blur-xs border-l-3 border-navy border border-navy/15 p-2.5 sm:p-3.5 rounded-r-lg space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-navy text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <h4 className="font-serif font-bold text-[11px] sm:text-xs text-navy">
                    Kolektivitas &amp; Demokrasi Nusantara
                  </h4>
                </div>
                <p className="text-[9.5px] sm:text-2xs text-stone-600 font-sans leading-relaxed">
                  Mendobrak sekat hegemoni kedaerahan, merangkul kampus pusat hingga perbatasan 3T dalam satu konsolidasi kebangsaan yang setara dan inklusif.
                </p>
              </div>
            </div>
          </div>

          {/* BAB III: AMBISI & TUJUAN STRATEGIS (VISI & MISI) */}
          <div id="visi-misi" className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
            <div className="flex items-center gap-2 border-b border-navy/15 pb-1.5 sm:pb-2">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
              <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-navy">
                III. Ambisi, Visi, &amp; Tujuan Strategis
              </h3>
            </div>

            {/* Visi */}
            <div className="bg-amber-50/70 text-stone-800 p-3.5 sm:p-5 rounded-xl border border-gold/60 shadow-2xs space-y-1.5 sm:space-y-2 relative overflow-hidden">
              <span className="px-2 py-0.5 rounded-full bg-gold text-navy text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider inline-block">
                Visi Agung Suarantara
              </span>
              <p className="font-serif text-[11px] sm:text-xs md:text-sm text-stone-800 italic leading-relaxed">
                &ldquo;Menjadi episentrum pergerakan intelektual, media aspirasi terpercaya, dan garda advokasi independen mahasiswa Indonesia demi terwujudnya kedaulatan pendidikan dan keadilan sosial bagi seluruh rakyat.&rdquo;
              </p>
            </div>

            {/* Misi / Tujuan */}
            <div className="space-y-1.5 sm:space-y-2 pt-1">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy block">
                Tujuan Strategis &amp; Peta Jalan Gerakan:
              </span>

              <div className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs font-sans text-stone-700">
                <div className="flex items-start gap-2 bg-white/60 backdrop-blur-xs p-2 sm:p-2.5 rounded-lg border border-navy/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Jurnalisme Investigasi Solutif:</strong> Menghadirkan liputan mendalam yang membongkar anomali kebijakan dan mengungkap realitas kampus yang selama ini terabaikan.
                  </span>
                </div>

                <div className="flex items-start gap-2 bg-white/60 backdrop-blur-xs p-2 sm:p-2.5 rounded-lg border border-navy/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Posko Advokasi Terintegrasi:</strong> Menyediakan pendampingan konkret bagi mahasiswa yang mengalami intimidasi akademik, pembatasan berserikat, atau ketidakadilan UKT.
                  </span>
                </div>

                <div className="flex items-start gap-2 bg-white/60 backdrop-blur-xs p-2 sm:p-2.5 rounded-lg border border-navy/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hilirisasi Riset Kebijakan:</strong> Memproduksi policy brief berkala yang didistribusikan kepada pembuat kebijakan, DPR, kementerian, dan forum dewan rektor.
                  </span>
                </div>

                <div className="flex items-start gap-2 bg-white/60 backdrop-blur-xs p-2 sm:p-2.5 rounded-lg border border-navy/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Aliansi Terbuka Seluruh Mahasiswa:</strong> Merajut persatuan mahasiswa dari 38 provinsi tanpa memandang almamater, memperkuat solidaritas nalar sehat.
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ════════════════ SISI KANAN: FOTO MAHASISWA LONJONG & LEMBAR KUNCI (5 KOLOM) ════════════════ */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6">
          
          {/* 3D POP-OUT INISIATOR SUARANTARA (Cutout Transparan Tanpa Box Bulat Curve) */}
          <div className="flex flex-col items-center">
            
            <div className="relative group w-full flex flex-col items-center justify-end pt-6 sm:pt-8 pb-2 sm:pb-3">
              
              {/* Layer 1: Radial Glow Emas Lembut di Belakang Sosok */}
              <div className="absolute top-8 sm:top-10 w-52 sm:w-72 h-56 sm:h-72 rounded-full bg-gradient-to-b from-gold/25 via-gold/10 to-transparent blur-2xl pointer-events-none -z-10" />
              
              {/* Layer 2: Geometric Minimalist Gold Arch (Lengkung Arsitektural Emas Tipis Memberi Efek Kedalaman 3D) */}
              <div className="absolute top-3 sm:top-4 w-44 sm:w-56 md:w-60 h-56 sm:h-72 border-2 border-gold/40 border-b-0 rounded-t-full pointer-events-none -z-10 opacity-70 group-hover:border-gold transition-colors duration-300" />
              
              {/* Layer 3: Floating Badge Inisiator */}
              <div className="absolute top-0 z-20 pointer-events-none">
                <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-gold text-navy font-sans font-extrabold text-[8.5px] sm:text-[10px] uppercase tracking-widest shadow-md border border-white">
                  Inisiator Pergerakan
                </span>
              </div>

              {/* Layer 4: Gambar Sosok 3D Cutout Transparan */}
              <div className="relative w-56 sm:w-72 md:w-80 h-[320px] sm:h-[420px] md:h-[460px] flex items-end justify-center transition-transform duration-300 group-hover:scale-[1.03]">
                <Image
                  src="/tentang-kami-mahasiswa-cutout.png"
                  alt="Wisnu Saputra - Inisiator Suarantara & Wapresma BEM STMIK Jayakarta"
                  fill
                  priority
                  sizes="(max-width: 768px) 300px, 360px"
                  className="object-contain object-bottom drop-shadow-[0_20px_35px_rgba(27,45,94,0.35)] z-10"
                />

                {/* Layer 5: Efek Hitam Ngelingker di Bawah Kaki (Efek Nyata Napak di Lantai) */}
                <div className="absolute -bottom-1 w-36 sm:w-52 h-3.5 sm:h-5 bg-black/45 rounded-[100%] blur-md pointer-events-none z-0" />
                <div className="absolute -bottom-0.5 w-24 sm:w-36 h-2 sm:h-2.5 bg-black/70 rounded-[100%] blur-xs pointer-events-none z-0" />
              </div>

            </div>

            {/* PLAQUE / KETERANGAN RESMI DI BAWAH FOTO */}
            <div className="mt-1.5 sm:mt-2 text-center max-w-xs space-y-1 bg-white/80 backdrop-blur-xs border border-navy/15 py-2.5 px-4 sm:py-3 sm:px-5 rounded-xl shadow-xs">
              <h4 className="font-serif font-extrabold text-sm sm:text-base md:text-lg text-navy tracking-tight">
                Wisnu Saputra
              </h4>
              <p className="font-sans text-[10.5px] sm:text-xs font-bold text-gold-800">
                Inisiator Suarantara
              </p>
              <p className="font-sans text-[9.5px] sm:text-[11px] text-stone-600 leading-tight">
                Wakil Presiden Mahasiswa BEM STMIK Jayakarta
              </p>
              <div className="pt-1 sm:pt-1.5 border-t border-stone-200/70 flex items-center justify-center gap-1.5 text-[8.5px] sm:text-[10px] font-mono text-stone-500">
                <span>Deklarasi: 15 Oktober 2026</span>
                <span>•</span>
                <span className="text-navy font-semibold">Jakarta</span>
              </div>
            </div>

          </div>

          {/* KOTAK LEMBAR FAKTA KORAN (FACT SHEET) */}
          <div className="bg-white/70 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3.5">
            <div className="flex items-center justify-between border-b border-navy/15 pb-2">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Bookmark className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700" />
                Lembar Data Konsolidasi
              </span>
              <span className="text-[8.5px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold-900 font-bold">
                Resmi
              </span>
            </div>

            <dl className="divide-y divide-stone-100 text-[10px] sm:text-xs font-sans space-y-1.5 sm:space-y-2">
              <div className="flex justify-between pt-1">
                <dt className="text-stone-500">Tanggal Didirikan:</dt>
                <dd className="font-semibold text-stone-900 text-right">15 Oktober 2026</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Tokoh Inisiator:</dt>
                <dd className="font-semibold text-navy text-right">Wisnu Saputra</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Afiliasi Kepengurusan:</dt>
                <dd className="font-medium text-stone-800 text-right">Wapresma BEM STMIK Jayakarta</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Kolaborator Perdana:</dt>
                <dd className="font-medium text-stone-800 text-right">BEM STMIK Jayakarta</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Pilar Pergerakan:</dt>
                <dd className="font-mono text-gold-800 text-right font-bold">Media • Advokasi • Kajian</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Prinsip Keanggotaan:</dt>
                <dd className="font-semibold text-stone-900 text-right">Demokratis, Intelektual, Terbuka</dd>
              </div>
            </dl>

            {/* CALLOUT AJAKAN KOLABORASI */}
            <div className="pt-1.5 sm:pt-2 border-t border-navy/10">
              <div className="p-2.5 sm:p-3 bg-navy/5 rounded-lg border border-navy/10 space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 text-navy font-serif font-bold text-[10.5px] sm:text-xs">
                  <Users className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700" />
                  <span>Kanal Terbuka Seluruh Mahasiswa</span>
                </div>
                <p className="text-[9.5px] sm:text-[11px] font-sans text-stone-600 leading-relaxed">
                  Apakah Anda perwakilan BEM, pers mahasiswa, atau peneliti independen? Suarantara membuka ruang kemitraan tanpa birokrasi rumit.
                </p>
                <Link
                  href="/kirim-suara"
                  className="w-full text-center block py-2 rounded-full bg-navy hover:bg-gold text-white hover:text-navy text-[10px] sm:text-2xs font-sans font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Gabung Jejaring Gerakan
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
