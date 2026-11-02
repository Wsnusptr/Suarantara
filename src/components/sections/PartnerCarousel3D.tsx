'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Handshake } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

interface Partner {
  id: string
  name: string
  shortName: string
  logo: string
}

export function PartnerCarousel3D() {
  const [partnerList, setPartnerList] = useState<Partner[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [itemSpacing, setItemSpacing] = useState(120)
  const [centerScale, setCenterScale] = useState(1.15)

  // Sinkronisasi dinamis dari CMS Database (/api/cms/partners)
  useEffect(() => {
    fetch('/api/cms/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.partners && data.partners.length > 0) {
          setPartnerList(
            data.partners.map((p: any) => ({
              id: p.id,
              name: p.name,
              shortName: p.shortName || p.name,
              logo: p.logoUrl || '/partners/bem-stmik-jayakarta.svg',
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  // Responsif: spacing & scale menyesuaikan lebar layar
  useEffect(() => {
    const updateSpacing = () => {
      const w = window.innerWidth
      setItemSpacing(w < 380 ? 68 : w < 640 ? 80 : w < 1024 ? 100 : 120)
      setCenterScale(w < 380 ? 1.0 : w < 640 ? 1.05 : 1.15)
    }
    updateSpacing()
    window.addEventListener('resize', updateSpacing)
    return () => window.removeEventListener('resize', updateSpacing)
  }, [])

  // Otomatis ngeslide tanpa henti setiap 2.4 detik
  useEffect(() => {
    if (partnerList.length === 0) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % partnerList.length)
    }, 2400)

    return () => clearInterval(timer)
  }, [partnerList.length])

  const total = partnerList.length

  return (
    <div
      id="partner-carousel"
      className="relative w-full py-5 sm:py-6 overflow-hidden select-none border-b border-navy/10 bg-white/40 backdrop-blur-xs"
    >
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        {/* Subtle Minimalist Kicker */}
        <div className="flex items-center gap-2.5 mb-3 opacity-70">
          <span className="w-6 h-px bg-gold" />
          <span className="font-serif italic text-2xs sm:text-xs tracking-[0.24em] text-navy font-semibold uppercase">
            Mitra Gerakan & Kampus
          </span>
          <span className="w-6 h-px bg-gold" />
        </div>

        {/* ─── 3D CAROUSEL (Logo Diperbesar Sedikit Agar Lebih Nyata & Jelas Terbaca) ─── */}
        {partnerList.length === 0 ? (
          <EmptyState
            variant="compact"
            icon={Handshake}
            title="Belum Ada Mitra Tampil"
            description="Logo dan profil mitra kampus akan bergulir di sini setelah data kemitraan tersedia."
          />
        ) : (
        <>
        <div className="relative h-28 sm:h-32 md:h-36 w-full flex items-center justify-center">
          <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
            {partnerList.map((partner, index) => {
              // Circular offset calculation
              let offset = index - activeIndex
              if (offset < -Math.floor(total / 2)) offset += total
              if (offset > Math.floor(total / 2)) offset -= total

              const isCenter = offset === 0
              const isDirectAdjacent = Math.abs(offset) === 1
              const isVisible = Math.abs(offset) <= 2

              if (!isVisible) return null

              // Horizontal spacing proporsional
              const translateX = offset * itemSpacing

              return (
                <div
                  key={partner.id}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    transform: `translateX(${translateX}px) scale(${
                      isCenter ? centerScale : isDirectAdjacent ? 0.9 : 0.75
                    })`,
                    zIndex: isCenter ? 30 : isDirectAdjacent ? 20 : 10,
                  }}
                  className={`absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isCenter
                      ? 'bg-white shadow-[0_15px_30px_rgba(27,45,94,0.18),0_0_20px_rgba(212,162,0,0.25)] border-2 border-gold ring-2 ring-gold/20 opacity-100'
                      : isDirectAdjacent
                      ? 'bg-white/85 shadow-xs border border-navy/15 opacity-70 hover:opacity-90'
                      : 'bg-white/50 border border-stone-200/60 opacity-35 filter grayscale'
                  }`}
                  title={partner.name}
                >
                  {/* Logo Image (Ukuran diperbesar agar jelas dan terbaca tajam) */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      sizes="90px"
                      className={`object-contain transition-all duration-300 ${
                        isCenter ? 'drop-shadow-sm scale-105' : 'drop-shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Label nama pada logo di tengah */}
                  {isCenter && (
                    <span className="font-serif text-[9px] sm:text-[10px] font-bold text-navy truncate max-w-full px-1 mt-1 line-clamp-1">
                      {partner.shortName}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Minimalist Micro Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {partnerList.map((_, dotIdx) => (
            <button
              key={`dot-${dotIdx}`}
              onClick={() => setActiveIndex(dotIdx)}
              suppressHydrationWarning
              className={`h-1 transition-all duration-300 rounded-full ${
                activeIndex === dotIdx ? 'w-4 bg-gold' : 'w-1 bg-navy/20'
              }`}
              aria-label={`Slide ${dotIdx + 1}`}
            />
          ))}
        </div>
        </>
        )}

      </div>
    </div>
  )
}
