'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Newspaper, Scale, BookOpen, ChevronDown } from 'lucide-react'

export function HeroVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const pillars = [
    {
      id: 'media',
      name: 'Media',
      href: '#media',
      icon: Newspaper,
      // Biru dongker & Emas transparan
      bgStyle: 'bg-navy-950/70 hover:bg-navy-900/90 border-gold/50 hover:border-gold hover:shadow-[0_0_25px_rgba(212,162,0,0.45)]',
      iconColor: 'text-gold group-hover:text-gold-200',
    },
    {
      id: 'advokasi',
      name: 'Advokasi',
      href: '#advokasi',
      icon: Scale,
      // Biru dongker & Emas transparan dengan sentuhan aksen crimson
      bgStyle: 'bg-navy-950/70 hover:bg-navy-900/90 border-crimson/50 hover:border-crimson hover:shadow-[0_0_25px_rgba(192,57,43,0.45)]',
      iconColor: 'text-crimson-400 group-hover:text-red-300',
    },
    {
      id: 'kajian',
      name: 'Kajian',
      href: '#kajian',
      icon: BookOpen,
      // Biru dongker & Emas transparan
      bgStyle: 'bg-navy-950/70 hover:bg-navy-900/90 border-gold/50 hover:border-gold hover:shadow-[0_0_25px_rgba(212,162,0,0.45)]',
      iconColor: 'text-gold group-hover:text-gold-200',
    },
  ]

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-stone-950 text-white pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-16">
      {/* ─── Background Video Banner ─── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-[1.02] filter contrast-[1.08] brightness-[0.92]"
      >
        <source src="/video/vid-banner.mp4" type="video/mp4" />
        Browser Anda tidak mendukung tag video.
      </video>

      {/* ─── Efek Kehitaman Elegan (Slight Dark Overlay) ─── */}
      <div className="absolute inset-0 bg-black/45 md:bg-black/50 backdrop-contrast-[1.05]" />
      
      {/* Subtle Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/60 pointer-events-none" />

      {/* ─── Center Content (Headline & 3 Pilar Buttons) ─── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center my-auto">
        
        {/* Subtle Typographic Kicker (Tanpa Box Abu) */}
        <div className="flex items-center gap-3 mb-3.5 sm:mb-4.5 opacity-90">
          <span className="w-8 sm:w-14 h-px bg-gradient-to-r from-transparent to-gold" />
          <span className="font-serif italic text-[10px] sm:text-xs lg:text-sm tracking-[0.22em] text-gold uppercase font-medium">
            Tiga Pilar Gerakan
          </span>
          <span className="w-8 sm:w-14 h-px bg-gradient-to-l from-transparent to-gold" />
        </div>

        {/* Headline Suarantara */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-lg max-w-3xl">
          Suara Aspirasi & Representasi Mahasiswa Nusantara
        </h1>

        {/* Subtitle Elegan */}
        <p className="mt-3 sm:mt-4 font-sans text-[11px] sm:text-xs md:text-sm lg:text-base text-stone-200/90 max-w-xl font-light tracking-wide leading-relaxed drop-shadow-md">
          Mengawal kebijakan publik, memperjuangkan hak mahasiswa, dan menarasikan pergerakan intelektual dari seluruh penjuru Nusantara.
        </p>

        {/* ─── 3 BUTTON PILAR (Background Biru Dongker / Emas Transparan — Tanpa Warna Abu) ─── */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 w-full max-w-xl">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <a
                key={pillar.id}
                href={pillar.href}
                onClick={(e) => {
                  e.preventDefault()
                  window.history.pushState(null, '', pillar.href)
                  window.dispatchEvent(new CustomEvent('suarantara-switch-pillar', { detail: pillar.id }))
                }}
                className={`group relative flex items-center justify-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-7 lg:py-3 rounded-full backdrop-blur-md border transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer select-none shadow-lg ${pillar.bgStyle}`}
              >
                {/* Glowing Icon */}
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0 transition-transform duration-300 group-hover:scale-115 ${pillar.iconColor}`}
                />

                {/* Teks Nama Pilar Saja (Hanya Icon + Teks) */}
                <span className="font-serif font-bold text-[10px] sm:text-xs lg:text-sm tracking-wider uppercase text-white transition-colors duration-200">
                  {pillar.name}
                </span>

                {/* Indicator Dot Emas Transparan */}
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70 group-hover:bg-gold transition-colors duration-300" />
              </a>
            )
          })}
        </div>

        {/* Subtle Scroll Cue */}
        <a
          href="#konten-pilar"
          onClick={(e) => {
            e.preventDefault()
            const el = document.getElementById('konten-pilar')
            if (el) {
              const yOffset = -90
              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
              window.scrollTo({ top: y, behavior: 'smooth' })
            }
          }}
          className="mt-10 sm:mt-12 inline-flex items-center gap-1.5 text-stone-300 hover:text-gold transition-colors text-[8px] sm:text-2xs lg:text-2xs tracking-[0.2em] uppercase font-sans group opacity-85 hover:opacity-100"
        >
          <span>Jelajahi Edisi Terkini</span>
          <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform duration-300" />
        </a>
      </div>

    </section>
  )
}
