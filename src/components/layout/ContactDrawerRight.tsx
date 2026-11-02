'use client'

import { useState, useEffect } from 'react'
import {
  X,
  Send,
  Building2,
  User,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react'
import { useContactModal } from '@/hooks/useContactModal'

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function ContactDrawerRight() {
  const { isOpen, closeContact } = useContactModal()

  const [senderName, setSenderName] = useState('')
  const [campusName, setCampusName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Nomor WhatsApp Redaksi Suarantara
  const WA_NUMBER = '6285286140817'
  const DISPLAY_PHONE = '0852-8614-0817'

  // Tutup dengan Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        closeContact()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeContact])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!senderName.trim() || !campusName.trim() || !subject.trim() || !message.trim()) {
      setErrorMessage('Mohon lengkapi semua kolom formulir sebelum mengirim pesan.')
      return
    }

    setErrorMessage('')

    const waText = `Halo Redaksi & Advokasi Suarantara,

Saya ingin menyampaikan pesan/aspirasi melalui kanal kontak:
• Nama Pengirim: ${senderName.trim()}
• Asal Kampus/Lembaga: ${campusName.trim()}
• Subject Perihal: ${subject.trim()}

Isi Pesan:
${message.trim()}

Terima kasih atas perhatian dan ruang aspirasinya.
(Dikirim melalui Portal Resmi Suarantara)`

    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`
    window.open(waUrl, '_blank')

    setSenderName('')
    setCampusName('')
    setSubject('')
    setMessage('')
    closeContact()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop halus (hanya gelap lembut, klik luar untuk menutup popup) */}
      <div
        onClick={closeContact}
        className="absolute inset-0 bg-black/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200"
      />

      {/* ─── POPUP DI SISI KANAN (TIDAK KE TENGAH, BUKAN FULL SCREEN) ─── */}
      <div className="fixed right-3 sm:right-6 bottom-3 sm:bottom-6 z-50 w-[92vw] sm:w-[410px] max-h-[88vh] rounded-2xl bg-[#0B1528] text-stone-200 border-2 border-gold/50 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(212,162,0,0.25)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Subtle Radial Dot Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4a200_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        {/* ════════ HEADER POPUP: JUDUL & SOSIAL MEDIA RESMI ════════ */}
        <div className="relative z-10 p-3.5 sm:p-5 border-b border-white/10 shrink-0 space-y-2.5 sm:space-y-3 bg-navy-950/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-gold animate-pulse" />
              <span className="font-serif font-extrabold text-xs sm:text-base text-white tracking-wide uppercase">
                Kontak Redaksi &amp; Hotline
              </span>
            </div>

            {/* Tombol Tutup X di Kanan Atas */}
            <button
              type="button"
              onClick={closeContact}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-crimson text-stone-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
              title="Tutup Popup"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* ─── HANYA SOSIAL MEDIA INSTAGRAM & WHATSAPP SAJA ─── */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border border-white/15 text-white text-[10px] sm:text-[11px] font-sans font-semibold transition-all shadow-xs group"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400 group-hover:text-white" />
              <span>Instagram</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Halo Redaksi Suarantara, saya ingin terhubung...')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white text-[10px] sm:text-[11px] font-sans font-semibold transition-all shadow-xs"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400 group-hover:text-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* ════════ BODY POPUP: FORMULIR IDENTITAS & PESAN ════════ */}
        <div className="relative z-10 flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-2.5 sm:space-y-3">
          {errorMessage && (
            <div className="p-2 rounded-lg bg-crimson/20 border border-crimson/40 text-crimson-200 text-2xs font-sans">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
            {/* 1. Nama Pengirim */}
            <div className="space-y-1">
              <label className="block text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-stone-300">
                Nama Pengirim <span className="text-gold">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  required
                  className="w-full bg-white/5 border border-white/20 focus:border-gold rounded-lg py-1.5 pl-8 pr-2.5 text-[11px] sm:text-xs text-white placeholder:text-stone-500 focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* 2. Kampus Mana */}
            <div className="space-y-1">
              <label className="block text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-stone-300">
                Kampus Mana / Lembaga <span className="text-gold">*</span>
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={campusName}
                  onChange={(e) => setCampusName(e.target.value)}
                  placeholder="Contoh: STMIK Jayakarta"
                  required
                  className="w-full bg-white/5 border border-white/20 focus:border-gold rounded-lg py-1.5 pl-8 pr-2.5 text-[11px] sm:text-xs text-white placeholder:text-stone-500 focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* 3. Subject Pesan */}
            <div className="space-y-1">
              <label className="block text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-stone-300">
                Subject / Perihal <span className="text-gold">*</span>
              </label>
              <div className="relative flex items-center">
                <HelpCircle className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Perihal pesan Anda"
                  required
                  className="w-full bg-white/5 border border-white/20 focus:border-gold rounded-lg py-1.5 pl-8 pr-2.5 text-[11px] sm:text-xs text-white placeholder:text-stone-500 focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* 4. Isi Pesan */}
            <div className="space-y-1">
              <label className="block text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-stone-300">
                Isi Pesan / Aspirasi <span className="text-gold">*</span>
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan keterangan lengkap atau aduan Anda..."
                required
                className="w-full bg-white/5 border border-white/20 focus:border-gold rounded-lg py-1.5 px-2.5 text-[11px] sm:text-xs text-white placeholder:text-stone-500 focus:outline-hidden transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Tombol Kirim Terintegrasi ke WhatsApp */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-2 sm:py-2.5 px-4 rounded-xl bg-gold hover:bg-gold-400 text-navy font-sans font-extrabold text-[10.5px] sm:text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-gold/30 flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Send className="w-3.5 h-3.5 text-navy" />
                <span>Kirim Pesan</span>
              </button>
            </div>
          </form>

          <div className="pt-1 flex items-center gap-1.5 text-stone-400 text-[9px] sm:text-[10px] font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>Pesan akan langsung terhubung secara otomatis ke admin redaksi.</span>
          </div>
        </div>

      </div>
    </div>
  )
}
