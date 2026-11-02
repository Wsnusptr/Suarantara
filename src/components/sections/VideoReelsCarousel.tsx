'use client'

import { useState, useEffect } from 'react'
import { Play, Eye, Video, Volume2 } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

interface VideoReel {
  id: string
  title: string
  creator: string
  views: string
  duration: string
  category: string
  thumbnailGradient: string
}

export function VideoReelsCarousel() {
  const [reels, setReels] = useState<VideoReel[]>([])
  const [scrollIndex, setScrollIndex] = useState(0)
  const [cardStep, setCardStep] = useState(195)

  // Sinkronisasi dinamis dari CMS Database (/api/cms/reels)
  useEffect(() => {
    fetch('/api/cms/reels')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reels && data.reels.length > 0) {
          setReels(data.reels)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const updateStep = () => {
      setCardStep(window.innerWidth < 400 ? 156 : window.innerWidth < 640 ? 172 : 195)
    }
    updateStep()
    window.addEventListener('resize', updateStep)
    return () => window.removeEventListener('resize', updateStep)
  }, [])

  // Auto-scroll loop setiap 2.8 detik tanpa tombol panah
  useEffect(() => {
    if (reels.length === 0) return
    const timer = setInterval(() => {
      setScrollIndex((prev) => (prev + 1) % reels.length)
    }, 2800)

    return () => clearInterval(timer)
  }, [reels.length])

  return (
    <section className="w-full my-6 sm:my-8 py-4 sm:py-5 border-y border-navy/20 bg-white/60 backdrop-blur-xs text-stone-900 overflow-hidden select-none relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-crimson rounded-full animate-ping" />
          <h3 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
            <Video className="w-4 h-4 text-gold-700" />
            Video Terbaru
          </h3>
        </div>
      </div>

      {/* Horizontal Strip Carousel (Layout Portrait ala TikTok / Reels memanjang full layar) */}
      {reels.length === 0 ? (
        <EmptyState
          variant="compact"
          icon={Video}
          title="Belum Ada Video Terbaru"
          description="Klip video liputan, edukasi, dan aspirasi mahasiswa akan tampil di sini setelah redaksi mengunggahnya."
        />
      ) : (
      <div className="relative w-full overflow-hidden">
        <div
          className="flex items-center gap-3 sm:gap-4 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] px-4"
          style={{
            transform: `translateX(-${scrollIndex * cardStep}px)`,
          }}
        >
          {/* Loop ganda untuk kontinuitas slider */}
          {[...reels, ...reels, ...reels].map((reel, idx) => (
            <div
              key={`${reel.id}-${idx}`}
              className={`relative shrink-0 w-36 sm:w-44 md:w-48 h-60 sm:h-72 md:h-80 rounded-xl overflow-hidden bg-gradient-to-b ${reel.thumbnailGradient} border border-navy/15 hover:border-gold transition-all duration-300 group cursor-pointer shadow-md hover:-translate-y-1`}
            >
              {/* Top Meta: Kategori & Durasi */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-sans font-semibold text-gold tracking-wider uppercase border border-gold/30">
                  {reel.category}
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-stone-300">
                  {reel.duration}
                </span>
              </div>

              {/* Center Play Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-gold backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md">
                  <Play className="w-4 h-4 text-white group-hover:text-navy fill-current ml-0.5 transition-colors" />
                </div>
              </div>

              {/* Bottom Scrim & Teks Spesifik yang Jelas dan Terbaca */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/85 via-45% to-transparent pt-8 z-10 flex flex-col justify-end">
                {/* Judul Berada di Bawah (Ukuran Minimalis, Tajam, Tidak Terpotong) */}
                <h4 className="font-serif font-bold text-[11px] sm:text-xs md:text-[13px] text-white leading-snug line-clamp-2 group-hover:text-gold transition-colors drop-shadow-sm">
                  {reel.title}
                </h4>

                {/* Spesifik Metadata: Publisher & Views */}
                <div className="mt-1.5 pt-1.5 border-t border-white/20 flex items-center justify-between text-[8.5px] sm:text-[10px] text-stone-300 font-sans">
                  <span className="truncate max-w-[85px] sm:max-w-[95px] text-stone-200">{reel.creator}</span>
                  <span className="inline-flex items-center gap-0.5 text-gold font-mono font-semibold shrink-0">
                    <Eye className="w-2.5 h-2.5" />
                    {reel.views}
                  </span>
                </div>
              </div>

              {/* Active Sound Indicator Pill */}
              <div className="absolute bottom-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <Volume2 className="w-3.5 h-3.5 text-stone-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

    </section>
  )
}
