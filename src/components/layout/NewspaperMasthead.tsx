'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  ArrowRight,
  Menu,
  X,
  Send,
  LogOut,
  User,
  ChevronDown,
  Newspaper,
  Scale,
  BookOpen,
  Clock,
  ShieldCheck,
  PenTool,
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { StatusWaktu } from './StatusWaktu'
import { NewspaperTicker } from './NewspaperTicker'
import { useContactModal } from '@/hooks/useContactModal'

interface NewspaperMastheadProps {
  variant?: 'transparent' | 'white' | 'solid'
}

export function NewspaperMasthead({ variant = 'transparent' }: NewspaperMastheadProps) {
  const { openContact } = useContactModal()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false)
  const [drawerDate, setDrawerDate] = useState('')
  const [drawerTime, setDrawerTime] = useState('')
  const profileMenuRef = useRef<HTMLDivElement>(null)

  const isLoggedIn = status === 'authenticated' && !!session?.user
  const aspirasionHref = isLoggedIn ? '/kirim-suara' : '/masuk'

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update realtime date & time for hamburger drawer in WIB (Asia/Jakarta)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const dateStr = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(now)
      setDrawerDate(dateStr)

      const timeStr = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now)
      setDrawerTime(`${timeStr} WIB`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Lock body scroll when mobile hamburger drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Topbar HANYA muncul jika pengguna berada di posisi paling atas halaman (currentScrollY <= 60)
  // Saat pengguna berada di bawah / tengah halaman, topbar selalu tersembunyi (meskipun scroll ke atas)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY <= 60) {
        setIsHidden(false)
        setIsScrolled(false)
      } else {
        setIsHidden(true)
        setIsScrolled(true)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setMobileMenuOpen(false)
    window.location.href = `/cari?q=${encodeURIComponent(searchQuery.trim())}`
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const match = href.match(/#([a-z-]+)$/)
    if (match) {
      const pillar = match[1]
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        e.preventDefault()
        window.history.pushState(null, '', `/#${pillar}`)
        window.dispatchEvent(new CustomEvent('suarantara-switch-pillar', { detail: pillar }))
        setTimeout(() => {
          const el = document.getElementById('konten-pilar')
          if (el) {
            const yOffset = -90
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
          }
        }, 50)
      }
    }
  }

  const handleNavClickFromDrawer = (href: string) => {
    setMobileMenuOpen(false)
    const match = href.match(/#([a-z-]+)$/)
    if (match) {
      const pillar = match[1]
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        window.history.pushState(null, '', `/#${pillar}`)
        window.dispatchEvent(new CustomEvent('suarantara-switch-pillar', { detail: pillar }))
        setTimeout(() => {
          const el = document.getElementById('konten-pilar')
          if (el) {
            const yOffset = -90
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
          }
        }, 50)
      } else {
        window.location.href = href
      }
    }
  }

  const handlePillarClickFromDrawer = (pillar: string, category?: string) => {
    setMobileMenuOpen(false)
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        window.history.pushState(null, '', `/#${pillar}`)
        window.dispatchEvent(new CustomEvent('suarantara-switch-pillar', { detail: pillar }))
        if (category) {
          window.dispatchEvent(new CustomEvent('suarantara-switch-category', { detail: category }))
        }
        setTimeout(() => {
          const el = document.getElementById('konten-pilar')
          if (el) {
            const yOffset = -90
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
          }
        }, 50)
      } else {
        window.location.href = `/#${pillar}`
      }
    }
  }

  const navLinks = [
    { name: 'Tentang Kami', href: '/#tentang-kami' },
    { name: 'Visi Misi', href: '/#visi-misi' },
    { name: 'Partners', href: '/#partners' },
    { name: 'Program', href: '/#program' },
    { name: 'Kontak Kami', href: '#kontak' },
  ]

  const mediaCategories = [
    { key: 'politik', label: 'Politik' },
    { key: 'hukum', label: 'Hukum' },
    { key: 'peristiwa', label: 'Peristiwa' },
    { key: 'pendidikan', label: 'Pendidikan' },
    { key: 'kesehatan', label: 'Kesehatan' },
    { key: 'sosbud', label: 'Sosial & Budaya' },
  ]

  const isWhiteTheme = variant === 'white'

  const headerBgClass = isWhiteTheme
    ? 'bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs text-stone-900'
    : isScrolled
    ? 'bg-navy-950/85 backdrop-blur-md border-b border-white/10 shadow-xl text-white'
    : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        } ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* ─── DESKTOP & LANDSCAPE VIEW (Aktif pada lg: desktop & landscape) ─── */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:block">
            {/* BARIS 1: LOGO & JEJERAN NAVIGASI */}
            <div
              className={`flex items-center justify-between py-2.5 sm:py-3 border-b ${
                isWhiteTheme ? 'border-stone-200' : 'border-white/15'
              }`}
            >
              {/* Logo Suarantara */}
              <Link
                href="/"
                className="group relative inline-flex items-center transition-transform duration-200 hover:scale-[1.02] shrink-0"
              >
                <div className="relative h-11 sm:h-14 md:h-16 w-44 sm:w-56 md:w-64 flex items-center">
                  <Image
                    src="/logo-Suarantara.png"
                    alt="SUARANTARA"
                    fill
                    priority
                    sizes="(max-width: 768px) 240px, 300px"
                    className={`object-contain object-left ${
                      isWhiteTheme
                        ? 'filter contrast-[1.05]'
                        : 'drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] filter brightness-[1.05]'
                    }`}
                  />
                </div>
              </Link>

              {/* Jejeran Button Navigasi (Desktop & Tablet) */}
              <nav className="flex items-center gap-1.5 xl:gap-2 shrink-0">
                {navLinks.map((link) =>
                  link.name === 'Kontak Kami' ? (
                    <button
                      key={link.name}
                      type="button"
                      onClick={openContact}
                      className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 tracking-wide select-none cursor-pointer ${
                        isWhiteTheme
                          ? 'text-stone-700 hover:text-navy hover:bg-stone-100'
                          : 'text-stone-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-200 tracking-wide select-none ${
                        isWhiteTheme
                          ? 'text-stone-700 hover:text-navy hover:bg-stone-100'
                          : 'text-stone-200 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                )}

                {/* Button Khusus: Kirim Aspirasi (CTA Emas Elegan) */}
                <Link
                  href={aspirasionHref}
                  className={`ml-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 ${
                    isWhiteTheme
                      ? 'bg-gold hover:bg-gold-500 text-navy border border-gold-600 shadow-xs'
                      : 'bg-gold/20 hover:bg-gold text-gold hover:text-navy border border-gold/70 shadow-[0_0_15px_rgba(212,162,0,0.25)] hover:shadow-[0_0_20px_rgba(212,162,0,0.5)]'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>Kirim Aspirasi</span>
                </Link>

                {/* Profile Avatar (Muncul saat sudah login) */}
                {isLoggedIn && session?.user && (
                  <div className="relative ml-1" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="w-8 h-8 rounded-full overflow-hidden border-2 border-gold/60 hover:border-gold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-1"
                    >
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'Profile'}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center text-xs font-bold ${
                          isWhiteTheme ? 'bg-navy text-white' : 'bg-gold text-navy'
                        }`}>
                          {(session.user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>

                    {/* Profile Dropdown */}
                    {profileMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2.5 border-b border-stone-100">
                          <p className="text-sm font-serif font-semibold text-navy truncate">{session.user.name}</p>
                          <p className="text-[11px] font-sans text-stone-500 truncate">{session.user.email}</p>
                        </div>
                        <Link
                          href="/admin"
                          onClick={() => setProfileMenuOpen(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-sans text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-navy" />
                          Meja Redaksi (CMS)
                        </Link>
                        <Link
                          href="/kirim-suara"
                          onClick={() => setProfileMenuOpen(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-sans text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 text-gold-700" />
                          Kirim Aspirasi
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false)
                            signOut({ callbackUrl: '/' })
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-sans text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Keluar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </nav>
            </div>

            {/* BARIS 2: TICKER & SEARCH & STATUS WAKTU */}
            <div className="py-2 flex flex-row items-center justify-between gap-3">
              {/* SISI KIRI: Ticker Berita Berjalan */}
              <div className="flex-1 min-w-0 pr-4">
                <NewspaperTicker isDark={!isWhiteTheme} />
              </div>

              {/* SISI KANAN: Mesin Pencarian & Status Waktu */}
              <div className="w-auto shrink-0 flex items-center justify-end gap-3">
                {/* Mesin Pencarian Kapsul */}
                <form onSubmit={handleSearchSubmit} autoComplete="off" className="w-48 lg:w-52">
                  <div className="relative flex items-center group">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari warta..."
                      autoComplete="off"
                      spellCheck={false}
                      suppressHydrationWarning
                      className={`w-full text-[11px] font-sans pl-7 pr-7 py-1.5 rounded-full transition-all duration-200 ${
                        isWhiteTheme
                          ? 'bg-stone-100 hover:bg-stone-200/70 focus:bg-white text-stone-900 placeholder:text-stone-400 placeholder:font-serif placeholder:italic border border-stone-300 focus:border-gold focus:outline-hidden shadow-2xs'
                          : 'bg-black/40 group-hover:bg-black/60 focus:bg-navy-950 text-white placeholder:text-stone-300/80 placeholder:font-serif placeholder:italic border border-white/25 group-hover:border-gold/60 focus:border-gold focus:outline-hidden backdrop-blur-md shadow-inner'
                      }`}
                    />
                    <Search
                      className={`w-3 h-3 absolute left-2.5 transition-colors pointer-events-none ${
                        isWhiteTheme ? 'text-stone-400 group-hover:text-gold' : 'text-stone-300 group-hover:text-gold'
                      }`}
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        suppressHydrationWarning
                        className={`absolute right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] leading-none ${
                          isWhiteTheme ? 'bg-stone-200 text-stone-600 hover:bg-stone-300' : 'bg-white/20 text-stone-200 hover:bg-white/30'
                        }`}
                      >
                        ×
                      </button>
                    ) : (
                      <button
                        type="submit"
                        suppressHydrationWarning
                        className={`absolute right-1 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                          isWhiteTheme
                            ? 'bg-stone-200 group-hover:bg-gold group-hover:text-navy text-stone-600'
                            : 'bg-white/10 group-hover:bg-gold group-hover:text-navy text-stone-300'
                        }`}
                        title="Cari"
                      >
                        <ArrowRight className="w-2 h-2" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Status Waktu (Waktu Solat, Cuaca, Jam realtime) + Tanggal Otomatis */}
                <StatusWaktu isDark={!isWhiteTheme} />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* ─── PORTRAIT VIEW (Aktif Khusus Layar Potret: Mobile & iPad Potret) ─── */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="lg:hidden pb-1">
            {/* BARIS 1: PROFILE CIRCLE ICON (KIRI) & TOMBOL ASPIRASI + HAMBURGER (KANAN) */}
            <div
              className={`flex items-center justify-between py-2 sm:py-2.5 border-b ${
                isWhiteTheme ? 'border-stone-200' : 'border-white/15'
              }`}
            >
              {/* Kiri: Icon Profil Pengguna (Hanya Muncul Saat Sudah Login) */}
              <div className="flex items-center min-w-[36px]">
                {isLoggedIn && session?.user && (
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      type="button"
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="w-9 h-9 rounded-full overflow-hidden border-2 border-gold hover:border-gold-400 shadow-md flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                      aria-label="Profil Pengguna"
                    >
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center text-xs font-bold ${
                            isWhiteTheme ? 'bg-navy text-white' : 'bg-gold text-navy'
                          }`}
                        >
                          {(session.user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>

                    {/* Profile Dropdown Ringkas di Portrait */}
                    {profileMenuOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-2xl border border-stone-200 py-2 z-[70] animate-in fade-in duration-150">
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs font-serif font-bold text-navy truncate">{session.user.name}</p>
                          <p className="text-[10px] font-sans text-stone-500 truncate">{session.user.email}</p>
                        </div>
                        <Link
                          href="/admin"
                          onClick={() => setProfileMenuOpen(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-sans text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-navy" />
                          Meja Redaksi (CMS)
                        </Link>
                        <Link
                          href="/kirim-suara"
                          onClick={() => setProfileMenuOpen(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-sans text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 text-gold-700" />
                          Kirim Aspirasi
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false)
                            signOut({ callbackUrl: '/' })
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-sans text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Keluar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Kanan: Button Aspirasi & Button Hamburger */}
              <div className="flex items-center gap-2">
                <Link
                  href={aspirasionHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans font-bold text-[11px] tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-sm bg-gold hover:bg-gold-500 text-navy border border-gold-600"
                >
                  <Send className="w-3 h-3" />
                  <span>Aspirasi</span>
                </Link>

                {/* Button Hamburger (Memicu Munculnya Drawer dari Kanan ke Kiri) */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  type="button"
                  className={`p-2 rounded-lg transition-colors cursor-pointer active:scale-95 ${
                    isWhiteTheme
                      ? 'text-navy hover:bg-stone-100 border border-stone-300 shadow-2xs'
                      : 'text-white hover:bg-white/10 border border-white/25 bg-black/30'
                  }`}
                  aria-label="Buka Menu Redaksi"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* BARIS 2: TICKER RAPI & COMPACT DIPASKAN SESUAI LEBAR LAYAR POTRET */}
            <div className="py-1 px-0.5 overflow-hidden">
              <div
                className={`w-full max-w-full overflow-hidden px-2 py-1 rounded-full border ${
                  isWhiteTheme ? 'bg-stone-100/90 border-stone-200' : 'bg-black/40 border-white/10'
                }`}
              >
                <NewspaperTicker isDark={!isWhiteTheme} />
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ─── SLIDE-IN HAMBURGER DRAWER (PORTAL LANGSUNG KE BODY) ─────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${
              mobileMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
            }`}
          >
            {/* Backdrop Gelap Penutup Layar Penuh (100vh) */}
            <div
              className={`fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Panel Drawer Samping Kanan (Meluncur Mulus dari Kanan ke Kiri) */}
            <div
              className={`fixed top-0 right-0 bottom-0 w-[86vw] max-w-[370px] text-stone-900 shadow-2xl z-[10000] flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{
                background: 'linear-gradient(180deg, #FAF8F5 0%, #F5F0EA 40%, #FAF8F5 100%)',
                borderLeft: '1px solid rgba(212,162,0,0.15)',
              }}
            >
              <div className="flex-1 overflow-y-auto">
                {/* Header Drawer dengan Aksen Emas */}
                <div className="relative px-5 pt-4 pb-3">
                  {/* Garis aksen emas di atas */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                  
                  {/* Tombol Tutup (X) */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      type="button"
                      className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-navy transition-all duration-200 cursor-pointer active:scale-90"
                      aria-label="Tutup Menu"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Logo (Background transparan & crop pas sehingga logo nampak besar tajam tanpa makan space) */}
                  <div className="flex justify-center -mt-1 mb-1">
                    <div className="relative w-56 sm:w-64 h-16 sm:h-18 flex items-center justify-center">
                      <Image
                        src="/logo-Suarantara.png"
                        alt="SUARANTARA"
                        fill
                        priority
                        sizes="280px"
                        className="object-contain filter contrast-[1.08] drop-shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Konten Drawer */}
                <div className="px-5 pb-5 space-y-3">
                  {/* Mesin Pencarian */}
                  <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari warta atau artikel..."
                      className="w-full text-[11px] font-sans pl-9 pr-8 py-2.5 rounded-xl bg-white text-stone-900 placeholder:text-stone-400 placeholder:font-serif placeholder:italic border border-stone-200 focus:border-gold focus:outline-hidden shadow-xs transition-colors"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-sm font-bold"
                      >
                        ×
                      </button>
                    )}
                  </form>

                  {/* Tanggal & Status Waktu */}
                  <div className="flex items-center justify-between text-[10px] font-sans text-stone-500 px-1">
                    <span className="font-serif italic text-stone-600 capitalize">
                      {drawerDate || 'Memuat tanggal...'}
                    </span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-navy/80">
                      <Clock className="w-3 h-3 text-crimson/70 shrink-0" />
                      <span>{drawerTime || '--:-- WIB'}</span>
                    </div>
                  </div>

                  {/* Garis Pemisah Elegan */}
                  <div className="relative py-1">
                    <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
                  </div>

                  {/* Navigasi Organisasi */}
                  <nav className="space-y-0.5">
                    <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-stone-400 font-semibold px-3 pb-1 block">
                      Organisasi
                    </span>
                    {navLinks.map((link) =>
                      link.name === 'Kontak Kami' ? (
                        <button
                          key={link.name}
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            openContact()
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-sans font-semibold text-stone-600 hover:text-navy hover:bg-white/80 transition-all duration-150 cursor-pointer"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <button
                          key={link.name}
                          type="button"
                          onClick={() => handleNavClickFromDrawer(link.href)}
                          className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-sans font-semibold text-stone-600 hover:text-navy hover:bg-white/80 transition-all duration-150 cursor-pointer"
                        >
                          {link.name}
                        </button>
                      )
                    )}
                  </nav>

                  {/* Garis Pemisah Elegan */}
                  <div className="relative py-1">
                    <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
                  </div>

                  {/* Tiga Pilar Gerakan */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-stone-400 font-semibold px-3 pb-1 block">
                      Tiga Pilar Gerakan
                    </span>

                    {/* A. MEDIA (Dengan Accordion Dropdown) */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setMediaDropdownOpen(!mediaDropdownOpen)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-serif font-bold text-navy hover:bg-white/80 transition-all duration-150 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Newspaper className="w-3.5 h-3.5 text-gold-700" />
                          <span>Media</span>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                            mediaDropdownOpen ? 'rotate-180 text-navy' : ''
                          }`}
                        />
                      </button>

                      {/* Sub-menu Dropdown Kategori Media */}
                      {mediaDropdownOpen && (
                        <div className="ml-5 pl-2.5 border-l-2 border-gold/40 my-0.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                          {mediaCategories.map((cat) => (
                            <button
                              key={cat.key}
                              type="button"
                              onClick={() => handlePillarClickFromDrawer('media', cat.key)}
                              className="w-full text-left px-2.5 py-1.5 rounded text-[10px] font-sans text-stone-500 hover:text-navy hover:bg-white/80 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-gold-600/70" />
                              <span>{cat.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* B. ADVOKASI */}
                    <button
                      type="button"
                      onClick={() => handlePillarClickFromDrawer('advokasi')}
                      className="w-full flex items-center px-3 py-2 rounded-lg text-[11px] font-serif font-bold text-stone-700 hover:text-crimson hover:bg-white/80 transition-all duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-crimson" />
                        <span>Advokasi</span>
                      </div>
                    </button>

                    {/* C. KAJIAN */}
                    <button
                      type="button"
                      onClick={() => handlePillarClickFromDrawer('kajian')}
                      className="w-full flex items-center px-3 py-2 rounded-lg text-[11px] font-serif font-bold text-stone-700 hover:text-gold-800 hover:bg-white/80 transition-all duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-gold-700" />
                        <span>Kajian</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Drawer: Akun & Logout */}
              {isLoggedIn && session?.user ? (
                <div className="p-4 border-t border-stone-200/80 bg-white/60 backdrop-blur-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0 pr-2">
                      <p className="text-[11px] font-serif font-bold text-navy truncate">{session.user.name}</p>
                      <p className="text-[9px] font-sans text-stone-500 truncate">{session.user.email}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-gold/60 shrink-0">
                      {session.user.image ? (
                        <Image src={session.user.image} alt="" width={28} height={28} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-navy text-white text-[9px] font-bold flex items-center justify-center">
                          {(session.user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans font-semibold text-navy bg-gold/15 hover:bg-gold/30 border border-gold/40 transition-colors cursor-pointer mb-2"
                  >
                    <ShieldCheck className="w-3 h-3 text-navy" />
                    <span>Meja Redaksi (CMS)</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-sans text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Keluar dari Akun</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 border-t border-stone-200/80 bg-white/60 backdrop-blur-xs">
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[11px] font-sans font-semibold text-navy bg-gold/15 hover:bg-gold/30 border border-gold/40 transition-colors mb-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-navy" />
                    <span>Meja Redaksi (CMS)</span>
                  </Link>
                  <Link
                    href="/masuk"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[11px] font-sans font-semibold text-navy hover:bg-stone-100 transition-colors border border-stone-200"
                  >
                    <User className="w-3.5 h-3.5 text-gold-700" />
                    <span>Masuk ke Akun Redaksi</span>
                  </Link>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
