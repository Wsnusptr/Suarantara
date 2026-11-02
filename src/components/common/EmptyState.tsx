'use client'

import type { LucideIcon } from 'lucide-react'
import { Sparkles, PenLine } from 'lucide-react'

interface EmptyStateProps {
  /** Judul ringkas, mis. "Belum Ada Warta Terbit". */
  title: string
  /** Penjelasan ramah untuk pengunjung. */
  description?: string
  /** Ikon Lucide opsional (default: Sparkles). */
  icon?: LucideIcon
  /** Teks kecil tambahan (mis. ajakan bagi admin untuk mengisi konten). */
  hint?: string
  /** Varian tata letak: 'default' (blok besar) atau 'compact' (blok kecil di sidebar). */
  variant?: 'default' | 'compact'
  className?: string
}

/**
 * Tampilan kosong yang ramah & menawan — dipakai saat data CMS belum tersedia
 * (mis. admin belum menulis artikel). Menjaga portal tetap terlihat rapi,
 * hidup, dan tidak pernah menampilkan konten palsu.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Sparkles,
  hint,
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  const isCompact = variant === 'compact'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`relative overflow-hidden rounded-2xl border border-dashed border-navy/25 bg-white/70 backdrop-blur-xs text-center animate-fade-up ${
        isCompact ? 'px-4 py-7' : 'px-6 py-14 sm:py-16'
      } ${className}`}
    >
      {/* Aurora lembut di latar agar tidak terasa kosong */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(60%_60%_at_30%_20%,rgba(212,162,0,0.14),transparent_70%),radial-gradient(50%_50%_at_80%_90%,rgba(27,45,94,0.10),transparent_70%)]"
      />
      {/* Garis kilau bergerak tipis di atas */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 inset-x-0 h-px animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(212,162,0,0.85),transparent)] bg-[length:200%_100%]"
      />

      <div className="relative flex flex-col items-center">
        <div className={`relative mb-4 ${isCompact ? 'mb-3' : ''}`}>
          {/* Cincin denyut */}
          <span
            aria-hidden
            className={`absolute inset-0 rounded-full bg-gold/25 animate-ping-slow ${
              isCompact ? 'scale-110' : 'scale-125'
            }`}
          />
          <span
            className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-800 text-gold shadow-lg shadow-navy/20 animate-floaty ${
              isCompact ? 'w-11 h-11' : 'w-16 h-16'
            }`}
          >
            <Icon className={isCompact ? 'w-5 h-5' : 'w-7 h-7'} />
          </span>
        </div>

        <h3
          className={`font-serif font-bold text-navy tracking-tight ${
            isCompact ? 'text-sm' : 'text-lg sm:text-xl'
          }`}
        >
          {title}
        </h3>

        {description && (
          <p
            className={`mt-2 max-w-md mx-auto font-sans leading-relaxed text-stone-600 ${
              isCompact ? 'text-[11px]' : 'text-xs sm:text-sm'
            }`}
          >
            {description}
          </p>
        )}

        {hint && (
          <span
            className={`mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-sans font-semibold text-gold-800 ${
              isCompact ? 'text-[9px]' : 'text-[10px] sm:text-[11px]'
            }`}
          >
            <PenLine className="w-3 h-3" />
            {hint}
          </span>
        )}
      </div>
    </div>
  )
}
