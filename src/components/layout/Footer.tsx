'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  ArrowUp,
} from 'lucide-react'
import { useContactModal } from '@/hooks/useContactModal'

// Crisp standard SVG icons for social media
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
      <polygon points="10 15 15 12 10 9 10 15"/>
    </svg>
  )
}

export function Footer() {
  const { openContact } = useContactModal()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePillarClick = (e: React.MouseEvent, pillar: string) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        e.preventDefault()
        window.history.pushState(null, '', `/#${pillar}`)
        window.dispatchEvent(new CustomEvent('suarantara-switch-pillar', { detail: pillar }))
      }
    }
  }

  return (
    <footer
      id="konten-footer"
      className="w-full text-stone-800 border-t-2 border-gold/50 relative z-10 select-none shadow-inner"
      style={{
        backgroundImage: "url('/background-footer.jfif')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* ─── KONTEN UTAMA FOOTER (4 KOLOM) DENGAN TEKS GELAP TERBACA TAJAM TANPA OVERLAY BIRU ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Kolom 1: Logo & Profil Singkat (4 Kolom) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative h-14 w-52 flex items-center">
                <Image
                  src="/logo-Suarantara.png"
                  alt="SUARANTARA"
                  fill
                  sizes="210px"
                  className="object-contain object-left filter contrast-[1.05]"
                />
              </div>
            </Link>

            <p className="font-sans text-xs text-stone-700 leading-relaxed font-normal">
              Suara Aspirasi dan Representasi Mahasiswa Nusantara (SUARANTARA) adalah wadah pergerakan independen yang berpijak pada tiga pilar: Media, Advokasi, dan Kajian untuk kedaulatan mahasiswa Indonesia.
            </p>

            <div className="flex items-center gap-3 pt-1 text-stone-600">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-gold hover:text-navy border border-stone-300 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Instagram Suarantara"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-gold hover:text-navy border border-stone-300 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Twitter X Suarantara"
              >
                <TwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-gold hover:text-navy border border-stone-300 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="YouTube Suarantara"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-gold hover:text-navy border border-stone-300 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Kolom 2: Lampiran & Profil (3 Kolom) */}
          <div className="lg:col-span-3 space-y-3 font-sans">
            <h4 className="font-serif text-sm font-extrabold uppercase tracking-widest text-navy border-b border-navy/20 pb-2">
              Tentang Organisasi
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-700">
              <li>
                <Link
                  href="/#tentang-kami"
                  onClick={(e) => handlePillarClick(e, 'tentang-kami')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Tentang Suarantara
                </Link>
              </li>
              <li>
                <Link
                  href="/#visi-misi"
                  onClick={(e) => handlePillarClick(e, 'visi-misi')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Visi &amp; Misi Pergerakan
                </Link>
              </li>
              <li>
                <Link
                  href="/#tentang-kami"
                  onClick={(e) => handlePillarClick(e, 'tentang-kami')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Struktur Kepengurusan
                </Link>
              </li>
              <li>
                <Link
                  href="/#partners"
                  onClick={(e) => handlePillarClick(e, 'partners')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Mitra Kampus &amp; Jaringan
                </Link>
              </li>
              <li>
                <Link
                  href="/#program"
                  onClick={(e) => handlePillarClick(e, 'program')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Program Kerja Strategis
                </Link>
              </li>
              <li>
                <Link
                  href="/#media"
                  onClick={(e) => handlePillarClick(e, 'media')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Pedoman Liputan Siber
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tiga Pilar Gerakan (2 Kolom) */}
          <div className="lg:col-span-2 space-y-3 font-sans">
            <h4 className="font-serif text-sm font-extrabold uppercase tracking-widest text-navy border-b border-navy/20 pb-2">
              Tiga Pilar
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-700">
              <li>
                <Link
                  href="/#media"
                  onClick={(e) => handlePillarClick(e, 'media')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Pilar Media
                </Link>
              </li>
              <li>
                <Link
                  href="/#advokasi"
                  onClick={(e) => handlePillarClick(e, 'advokasi')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Pilar Advokasi
                </Link>
              </li>
              <li>
                <Link
                  href="/#kajian"
                  onClick={(e) => handlePillarClick(e, 'kajian')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Pilar Kajian
                </Link>
              </li>
              <li>
                <Link href="/kirim-suara" className="text-gold-800 font-bold hover:underline">
                  Kirim Aspirasi Mahasiswa
                </Link>
              </li>
              <li>
                <Link
                  href="/#media"
                  onClick={(e) => handlePillarClick(e, 'media')}
                  className="hover:text-gold-700 transition-colors"
                >
                  Arsip Edisi Digital
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Redaksi (3 Kolom) */}
          <div id="kontak" className="lg:col-span-3 space-y-3 font-sans">
            <h4 className="font-serif text-sm font-extrabold uppercase tracking-widest text-navy border-b border-navy/20 pb-2">
              Kontak Redaksi
            </h4>
            <div className="space-y-2.5 text-xs text-stone-700 font-normal">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                <span>Sekretariat Nasional Suarantara, DKI Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-700 shrink-0" />
                <a href="mailto:redaksi@suarantara.org" className="hover:text-navy font-medium transition-colors">
                  redaksi@suarantara.org
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-700 shrink-0" />
                <span className="font-medium text-stone-800">Hotline Redaksi Suarantara</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openContact}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold hover:bg-gold-500 text-navy text-[11px] font-sans font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer border border-gold-600"
              >
                <span>Buka Form Kontak</span>
              </button>

              <button
                onClick={scrollToTop}
                type="button"
                suppressHydrationWarning
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[11px] font-sans font-semibold text-navy border border-stone-300 transition-colors shadow-2xs cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Ke Atas</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ─── BOTTOM LEGAL BAR (Privacy Policy, Terms, Copyright) ─── */}
      <div className="border-t border-navy/15 bg-white/50 backdrop-blur-xs py-4 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs font-sans text-stone-600">
          <div>
            © 2026 <strong className="text-navy font-bold">SUARANTARA</strong>. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-4">
            <Link href="/kebijakan-privasi" className="hover:text-navy transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link href="/syarat-ketentuan" className="hover:text-navy transition-colors">
              Syarat &amp; Ketentuan
            </Link>
            <span>•</span>
            <Link href="/kode-etik" className="hover:text-navy transition-colors">
              Kode Etik Redaksi
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
