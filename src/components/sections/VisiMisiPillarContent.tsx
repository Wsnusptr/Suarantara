'use client'

import Link from 'next/link'
import {
  Target,
  Compass,
  Sparkles,
  Newspaper,
  Scale,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  Flag,
  Milestone,
  Quote,
  Flame,
} from 'lucide-react'

export function VisiMisiPillarContent() {
  const misiList = [
    {
      roman: 'I',
      title: 'Kedaulatan Pers & Literasi Kritis Mahasiswa',
      matra: 'Matra Media',
      icon: Newspaper,
      color: 'text-navy',
      badgeBg: 'bg-navy/10 text-navy border-navy/20',
      desc: 'Membangun ekosistem jurnalisme mahasiswa investigatif yang independen, jujur, dan berani membongkar tabir anomali kebijakan publik serta menyuarakan ketimpangan yang luput dari sorotan media arus utama.',
      targets: [
        'Produksi liputan mendalam (in-depth & investigative reporting) berbasis fakta lapangan.',
        'Pemberian ruang mimbar bebas bagi opini, suara akar rumput, dan kritik konstruktif mahasiswa.',
        'Penyelenggaraan sekolah jurnalisme siber dan verifikasi fakta bagi pers mahasiswa Nusantara.',
      ],
    },
    {
      roman: 'II',
      title: 'Garda Advokasi & Pembelaan Hak Sivitas Akademika',
      matra: 'Matra Advokasi',
      icon: Scale,
      color: 'text-crimson',
      badgeBg: 'bg-crimson/10 text-crimson border-crimson/20',
      desc: 'Menjadi benteng pertahanan moral dan hukum bagi mahasiswa yang menghadapi represifitas birokrasi, pengekangan hak berserikat, kekerasan seksual di kampus, serta ketidakadilan sistem pembiayaan UKT.',
      targets: [
        'Penyediaan Posko Aduan Terpadu 24 jam dengan sistem enkripsi pelindung identitas korban.',
        'Pendampingan hukum litigasi & non-litigasi berkolaborasi bersama LBH dan satgas kampus.',
        'Audit terbuka terhadap transparansi BOPTN, penentuan golongan UKT, dan fasilitas penunjang.',
      ],
    },
    {
      roman: 'III',
      title: 'Pusat Riset Kebijakan & Dialektika Ilmiah Berkualitas',
      matra: 'Matra Kajian',
      icon: BookOpen,
      color: 'text-gold-800',
      badgeBg: 'bg-gold/15 text-gold-800 border-gold/30',
      desc: 'Mengonsolidasikan daya nalar civitas akademika untuk melahirkan naskah akademik, policy brief, dan analisis ekonometrika yang berbobot guna mengoreksi arah kebijakan pemerintah maupun kampus.',
      targets: [
        'Penerbitan Policy Brief berkala yang didistribusikan langsung ke DPR RI dan kementerian terkait.',
        'Survei independen berskala nasional mengenai kondisi ekonomi dan kesejahteraan mahasiswa.',
        'Penyelenggaraan mimbar bedah naskah dan simposium riset kolaboratif antar-perguruan tinggi.',
      ],
    },
    {
      roman: 'IV',
      title: 'Solidaritas Kolektif & Aliansi Mahasiswa Se-Nusantara',
      matra: 'Matra Jaringan',
      icon: Users,
      color: 'text-emerald-800',
      badgeBg: 'bg-emerald-900/10 text-emerald-800 border-emerald-900/20',
      desc: 'Menghapus sekat hegemoni kedaerahan dengan merajut konsolidasi erat antara perguruan tinggi negeri, swasta, institut seni, vokasi, dan keagamaan dari Sabang sampai Merauke dalam satu barisan perjuangan.',
      targets: [
        'Penguatan jejaring perwakilan koordinator simpul di 38 provinsi di seluruh Indonesia.',
        'Program afirmasi advokasi dan alokasi sumber daya riset bagi kampus di wilayah 3T.',
        'Konsolidasi tahunan akbar BEM dan komunitas pemikir muda guna menyusun Piagam Mahasiswa.',
      ],
    },
  ]

  const roadmapPhases = [
    {
      fase: 'Fase I (2026–2027)',
      title: 'Pondasi Sistem & Konsolidasi Jaringan Nasional',
      status: 'Sedang Berjalan',
      items: [
        'Integrasi jaringan simpul mahasiswa di 100 kampus se-Indonesia.',
        'Peluncuran portal terpadu Media, Advokasi, dan Repository Kajian Terbuka.',
        'Publikasi 30 Policy Brief strategis respon regulasi pendidikan tinggi.',
      ],
    },
    {
      fase: 'Fase II (2027–2028)',
      title: 'Ekskalasi Advokasi & Uji Materiil Kebijakan Publik',
      status: 'Target Rencana',
      items: [
        'Pengajuan Judicial Review ke Mahkamah Konstitusi & MA terhadap klausul komersialisasi kampus.',
        'Pendirian Biro Konseling Hukum Mahasiswa Terpadu di 6 koridor kepulauan.',
        'Sindikasi media mahasiswa mandiri dengan jangkauan 500.000 pembaca aktif per bulan.',
      ],
    },
    {
      fase: 'Fase III (2028–2030)',
      title: 'Kemandirian Episentrum Riset & Gerakan Intelektual Asia',
      status: 'Arah Jangka Panjang',
      items: [
        'Pembentukan Institut Kajian Kebijakan Publik Mahasiswa (Nusantara Policy Institute).',
        'Pertukaran riset dan aliansi demokrasi pemuda lintas negara di Asia Tenggara.',
        'Pencapaian transparansi 100% tata kelola anggaran perguruan tinggi mitra pergerakan.',
      ],
    },
  ]

  return (
    <div
      id="visi-misi"
      className="w-full relative z-10 select-none animate-in fade-in duration-200"
    >
      {/* ─── KOP EDITORIAL KORAN: DOKUMEN VISI & MISI ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/15 pb-2 sm:pb-2.5 mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-2xs font-sans font-bold uppercase tracking-widest bg-gold text-navy shadow-xs flex items-center gap-1">
            <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>Garis Besar Haluan Gerakan</span>
          </span>
          <span className="text-[8.5px] sm:text-xs font-mono text-stone-500">
            Pedoman Strategis 2026–2030 • Suarantara
          </span>
        </div>
        <span className="text-[8.5px] sm:text-xs font-serif italic text-stone-600">
          Landasan Filosofis, Misi Matra, &amp; Target Capaian Nasional
        </span>
      </div>

      {/* ─── GRID UTAMA: VISI, MISI & ROADMAP (KIRI 8 KOLOM) & PLAKAT INTEGRITAS (KANAN 4 KOLOM) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ════════════════ SISI KIRI: VISI UTAMA, 4 MATRA MISI & ROADMAP (8 KOLOM) ════════════════ */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-7">
          
          {/* 1. BANNER MONUMENTAL: VISI AGUNG SUARANTARA (Tanpa Font Putih yang Samar) */}
          <div className="bg-white p-4 sm:p-7 rounded-2xl border-2 border-gold/60 shadow-md relative overflow-hidden">
            <div className="relative z-10 space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between border-b border-navy/15 pb-2 sm:pb-2.5">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gold text-navy font-sans font-extrabold text-[9px] sm:text-xs uppercase tracking-widest flex items-center gap-1 sm:gap-1.5 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-navy" />
                  <span>Visi Agung Suarantara 2026–2035</span>
                </span>
                <span className="text-[8.5px] sm:text-[10px] font-mono text-stone-500 font-semibold">
                  Konsensus Intelektual
                </span>
              </div>

              <blockquote className="font-serif text-xs sm:text-base md:text-xl font-bold text-navy leading-relaxed tracking-wide italic">
                &ldquo;Terwujudnya kedaulatan mahasiswa Indonesia sebagai episentrum kekuatan moral dan nalar intelektual yang independen, progresif, dan berakar kuat pada nurani kerakyatan guna menegakkan keadilan sosial, demokratisasi kampus, serta transparansi kebijakan publik nasional.&rdquo;
              </blockquote>

              <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[9px] sm:text-2xs font-sans text-stone-600 border-t border-navy/10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span>Pilar: Media • Advokasi • Kajian</span>
                  <span>•</span>
                  <span>Jangkauan: 38 Provinsi Nusantara</span>
                </div>
                <span className="font-mono text-gold-800 font-bold">Berpijak pada Fakta &amp; Kebenaran</span>
              </div>
            </div>
          </div>

          {/* 2. EMPAT MATRA MISI STRATEGIS ORGANISASI */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-navy/15 pb-1.5 sm:pb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-navy">
                  Empat Misi Pokok Gerakan
                </h3>
              </div>
              <span className="text-[8.5px] sm:text-[10px] font-sans text-stone-500 font-medium">
                Peta Kerja Konkret Tri Matra
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {misiList.map((misi) => {
                const IconComponent = misi.icon
                return (
                  <article
                    key={misi.roman}
                    className="bg-white/70 backdrop-blur-xs border border-navy/15 hover:border-gold/60 p-3.5 sm:p-5 rounded-xl shadow-2xs transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b border-stone-200/60">
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-navy text-gold font-serif font-extrabold text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {misi.roman}
                        </span>
                        <h4 className="font-serif font-bold text-xs sm:text-sm md:text-base text-navy group-hover:text-gold-700 transition-colors">
                          {misi.title}
                        </h4>
                      </div>
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider border shrink-0 ${misi.badgeBg}`}>
                        {misi.matra}
                      </span>
                    </div>

                    <p className="text-[10.5px] sm:text-xs font-sans text-stone-700 font-light leading-relaxed mb-2.5 sm:mb-3">
                      {misi.desc}
                    </p>

                    {/* Target Aksi Terukur */}
                    <div className="bg-navy/5 p-2.5 sm:p-3 rounded-lg border border-navy/10 space-y-1 sm:space-y-1.5">
                      <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-stone-600 block">
                        Target Aksi &amp; Capaian:
                      </span>
                      <ul className="space-y-1 text-[9.5px] sm:text-2xs font-sans text-stone-700">
                        {misi.targets.map((tgt, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 sm:gap-2">
                            <CheckCircle2 className="w-3 h-3 text-gold-700 shrink-0 mt-0.5" />
                            <span className="leading-snug">{tgt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {/* 3. ROADMAP & TARGET PENCAPAIAN PERGERAKAN (PETA JALAN GERAKAN) */}
          <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
            <div className="flex items-center justify-between border-b border-navy/15 pb-1.5 sm:pb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Milestone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider text-navy">
                  Peta Jalan Capaian Strategis (2026–2030)
                </h3>
              </div>
              <span className="text-[8.5px] sm:text-[10px] font-mono text-stone-500 font-medium">
                Milestones &amp; Roadmaps
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {roadmapPhases.map((phase, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 backdrop-blur-xs border border-navy/15 p-3 sm:p-4 rounded-xl flex flex-col justify-between space-y-2.5 sm:space-y-3 shadow-2xs"
                >
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[8.5px] sm:text-[9px] font-mono font-bold uppercase text-stone-500">
                        {phase.fase}
                      </span>
                      <span className="text-[7.5px] sm:text-[8px] font-sans px-1.5 py-0.5 rounded-full bg-gold/15 text-gold-900 font-bold">
                        {phase.status}
                      </span>
                    </div>

                    <h5 className="font-serif font-bold text-[11px] sm:text-xs text-navy leading-snug">
                      {phase.title}
                    </h5>

                    <ul className="space-y-1 sm:space-y-1.5 pt-1 text-[9.5px] sm:text-2xs font-sans text-stone-600 leading-tight">
                      {phase.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-gold font-bold">•</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-1.5 sm:pt-2 border-t border-stone-200/60 text-[8.5px] sm:text-[9px] font-mono text-stone-400">
                    Fase Tahapan #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ════════════════ SISI KANAN: PRINSIP DOKTRIN, IKRAR MORAL & KPI GERAKAN (4 KOLOM) ════════════════ */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          
          {/* 1. KOTAK PLAKAT: TIGA DOKTRIN UTAMA SIVITAS SUARANTARA */}
          <div className="bg-white/70 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3.5">
            <div className="flex items-center justify-between border-b border-navy/15 pb-2">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-gold-700" />
                Tiga Doktrin Utama
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold-900 font-bold">
                Asas Mutlak
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3 text-[10.5px] sm:text-xs font-sans">
              <div className="p-2.5 sm:p-3 bg-navy/5 rounded-lg border border-navy/10 space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-bold text-navy text-[11px] sm:text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-700" />
                  <span>1. Doktrin Independensi Murni</span>
                </div>
                <p className="text-[9.5px] sm:text-2xs text-stone-600 leading-snug">
                  Suarantara menolak segala bentuk hegemoni dan intervensi partai politik praktis, pemilik modal, maupun birokrasi perguruan tinggi.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 bg-crimson/5 rounded-lg border border-crimson/15 space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-bold text-crimson text-[11px] sm:text-xs">
                  <Flame className="w-3.5 h-3.5 text-crimson" />
                  <span>2. Doktrin Keberpihakan Kerakyatan</span>
                </div>
                <p className="text-[9.5px] sm:text-2xs text-stone-600 leading-snug">
                  Nalar kritis dan advokasi Suarantara mutlak berpihak kepada kepentingan rakyat kecil, buruh, tani, dan mahasiswa yang tertindas.
                </p>
              </div>

              <div className="p-2.5 sm:p-3 bg-gold/10 rounded-lg border border-gold/25 space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-bold text-navy text-[11px] sm:text-xs">
                  <Award className="w-3.5 h-3.5 text-gold-700" />
                  <span>3. Doktrin Kebenaran Ilmiah</span>
                </div>
                <p className="text-[9.5px] sm:text-2xs text-stone-600 leading-snug">
                  Setiap narasi warta dan rekomendasi kebijakan harus berbasis data primer, metodologi riset yang valid, dan bukti empiris teruji.
                </p>
              </div>
            </div>
          </div>

          {/* 2. IKRAR SIKAP MORAL INISIATOR WISNU SAPUTRA (Tanpa Font Putih yang Samar) */}
          <div className="bg-amber-50/70 text-stone-800 border-2 border-gold/60 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2 sm:space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-gold-800 border-b border-gold/25 pb-1.5 sm:pb-2">
              <Quote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy">
                Ikrar Moral Pendirian
              </span>
            </div>

            <p className="font-serif italic text-[11px] sm:text-xs leading-relaxed text-stone-800">
              &ldquo;Suarantara tidak lahir untuk mencari panggung kehormatan, melainkan untuk menjadi barikade pertahanan moral mahasiswa ketika kebenaran mulai dikaburkan oleh kepentingan kekuasaan.&rdquo;
            </p>

            <div className="pt-1.5 sm:pt-2 border-t border-gold/25 flex items-center justify-between text-[10px] sm:text-[11px] font-sans">
              <div>
                <p className="font-bold text-navy">Wisnu Saputra</p>
                <p className="text-stone-600 text-[9.5px] sm:text-[10px]">Wapresma BEM STMIK Jayakarta</p>
              </div>
              <span className="font-mono text-[8.5px] sm:text-[9px] text-gold-900 font-semibold px-2 py-0.5 rounded bg-gold/20">
                15 Okt 2026
              </span>
            </div>
          </div>

          {/* 3. TOLAK UKUR INDIKATOR KEBERHASILAN (KPI STRATEGIS) */}
          <div className="bg-white/70 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between border-b border-navy/15 pb-2">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy">
                Tolak Ukur Keberhasilan (KPI)
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-sans text-stone-500">
                Standar Mutu
              </span>
            </div>

            <dl className="divide-y divide-stone-100 text-[10px] sm:text-xs font-sans space-y-1.5 sm:space-y-2">
              <div className="flex justify-between pt-1">
                <dt className="text-stone-500">Respon Advokasi:</dt>
                <dd className="font-bold text-navy text-right">&lt; 24 Jam Verifikasi</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Akurasi Berita:</dt>
                <dd className="font-bold text-emerald-700 text-right">100% Cek Fakta</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Akses Dokumen Kajian:</dt>
                <dd className="font-bold text-stone-900 text-right">Open Access (Gratis)</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Jaringan Kampus Aktif:</dt>
                <dd className="font-bold text-gold-800 text-right">38 Provinsi Target</dd>
              </div>
            </dl>

            <div className="pt-1.5 sm:pt-2">
              <Link
                href="/kirim-suara"
                className="w-full text-center block py-2 sm:py-2.5 rounded-full bg-gold hover:bg-gold-400 text-navy font-sans font-bold text-[10px] sm:text-2xs uppercase tracking-wider transition-colors shadow-xs"
              >
                Ikut Berkontribusi Nyata
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
