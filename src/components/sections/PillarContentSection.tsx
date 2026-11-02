'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Newspaper,
  Scale,
  BookOpen,
  History,
  ChevronDown,
  ArrowRight,
  Eye,
  User,
  Calendar,
  Flame,
  Tag,
  Clock,
  TrendingUp,
  PlusCircle,
  Target,
  Building2,
  Sparkles,
} from 'lucide-react'
import { AdvocacyPillarContent } from './AdvocacyPillarContent'
import { KajianPillarContent } from './KajianPillarContent'
import { AboutUsSection } from './AboutUsSection'
import { VisiMisiPillarContent } from './VisiMisiPillarContent'
import { PartnersPillarContent } from './PartnersPillarContent'
import { ProgramPillarContent } from './ProgramPillarContent'
import { EmptyState } from '@/components/common/EmptyState'
import { useContactModal } from '@/hooks/useContactModal'

type PillarType = 'media' | 'advokasi' | 'kajian' | 'tentang-kami' | 'visi-misi' | 'partners' | 'program'

interface PillarMeta {
  id: PillarType
  title: string
  subtitle: string
  badge: string
}

const pillarConfig: Record<PillarType, PillarMeta> = {
  media: {
    id: 'media',
    title: 'MEDIA',
    subtitle: 'Media Edisi Terbaru Suara Aspirasi dan Representasi Mahasiswa Nusantara',
    badge: 'Kanal Warta & Opini Mahasiswa',
  },
  advokasi: {
    id: 'advokasi',
    title: 'ADVOKASI',
    subtitle: 'Kanal Aduan & Pendampingan Hak Mahasiswa Se-Nusantara',
    badge: 'Ruang Kawal Kebijakan & Kasus',
  },
  kajian: {
    id: 'kajian',
    title: 'KAJIAN',
    subtitle: 'Pusat Analisis Ilmiah, Policy Brief, dan Riset Strategis',
    badge: 'Basis Data Riset & Rekomendasi Kebijakan',
  },
  'tentang-kami': {
    id: 'tentang-kami',
    title: 'TENTANG KAMI',
    subtitle: 'Manifesto, Sejarah, Landasan Gagasan, dan Tokoh Inisiator Suarantara',
    badge: 'Profil & Rekam Jejak Gerakan',
  },
  'visi-misi': {
    id: 'visi-misi',
    title: 'VISI & MISI',
    subtitle: 'Visi Luhur, Empat Misi Pokok Gerakan, dan Peta Jalan Strategis Mahasiswa Nusantara',
    badge: 'Kompas & Haluan Ideologis Gerakan',
  },
  partners: {
    id: 'partners',
    title: 'PARTNERS',
    subtitle: 'Direktori Kemitraan Kampus, Profil BEM STMIK Jayakarta, dan Jaringan Gerakan Nusantara',
    badge: 'Konsorsium Mitra Resmi',
  },
  program: {
    id: 'program',
    title: 'PROGRAM',
    subtitle: 'Agenda Strategis, Program Kerja Kolektif, dan Liputan Kegiatan Mahasiswa Nusantara',
    badge: 'Manifestasi Aksi Nyata',
  },
}

// ─── Tipe data ringan untuk kartu kanal Media (diisi dari CMS) ───────────────
interface GridItem {
  id: string
  title: string
  category: string
  date: string
  views: string
  publisher: string
  imageGrad: string
  iconColor: string
  coverImageUrl?: string
  slug?: string
}

interface RekItem {
  id: string
  title: string
  publisher: string
  views: string
  date: string
  tag: string
  imageColor: string
  coverImageUrl?: string
  slug?: string
}

interface TrenItem {
  no: string
  title: string
  views: string
}

interface HeroArticle {
  title: string
  slug: string
  kickerBadge: string
  editionBadge: string
  coverCredit: string
  coverCaption: string
  coverImageUrl: string
  dateDisplay: string
  viewsDisplay: string
  authorName: string
}

export function PillarContentSection() {
  const { openContact } = useContactModal()
  const [activePillar, setActivePillar] = useState<PillarType>('media')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState<number>(9)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Menu Organisasi untuk Portrait Dropdown dengan teks bergantian
  const orgLinks = [
    { id: 'tentang-kami', name: 'Tentang Kami', isContact: false },
    { id: 'visi-misi', name: 'Visi Misi', isContact: false },
    { id: 'partners', name: 'Partners', isContact: false },
    { id: 'program', name: 'Program', isContact: false },
    { id: 'kontak', name: 'Kontak Kami', isContact: true },
  ]
  const [orgCycleIndex, setOrgCycleIndex] = useState(0)
  const [orgFade, setOrgFade] = useState(true)
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false)
  const orgDropdownRef = useRef<HTMLDivElement>(null)

  // Animasi transisi pudar bergantian untuk tombol organisasi di portrait view
  useEffect(() => {
    const interval = setInterval(() => {
      setOrgFade(false)
      setTimeout(() => {
        setOrgCycleIndex((prev) => (prev + 1) % orgLinks.length)
        setOrgFade(true)
      }, 300)
    }, 2800)
    return () => clearInterval(interval)
  }, [orgLinks.length])

  // Tutup dropdown organisasi jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setOrgDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const current = pillarConfig[activePillar]

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sinkronisasi URL Hash & Custom Switch Event (#tentang-kami, #visi-misi, #media, dll.)
  useEffect(() => {
    function handlePillarSwitch(targetPillar: string, shouldScroll = true) {
      const validPillars: PillarType[] = ['media', 'advokasi', 'kajian', 'tentang-kami', 'visi-misi', 'partners', 'program']
      if (validPillars.includes(targetPillar as PillarType)) {
        setActivePillar(targetPillar as PillarType)
        if (shouldScroll) {
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

    function handleHash() {
      const rawHash = window.location.hash.replace('#', '')
      if (rawHash) {
        handlePillarSwitch(rawHash, true)
      }
    }

    function handleCustomEvent(e: Event) {
      const customEvent = e as CustomEvent<string>
      if (customEvent.detail) {
        handlePillarSwitch(customEvent.detail, true)
      }
    }

    // Cek saat mount (misal datang dari halaman detail dengan /#tentang-kami)
    handleHash()

    window.addEventListener('hashchange', handleHash)
    window.addEventListener('popstate', handleHash)
    window.addEventListener('suarantara-switch-pillar', handleCustomEvent)

    return () => {
      window.removeEventListener('hashchange', handleHash)
      window.removeEventListener('popstate', handleHash)
      window.removeEventListener('suarantara-switch-pillar', handleCustomEvent)
    }
  }, [])

  // Fungsi muat 9 berita lagi ke bawah
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9)
  }

  // ─── State kanal Media: seluruhnya bersumber dari CMS (tanpa data statis) ───
  const [beritaList, setBeritaList] = useState<GridItem[]>([])
  const [rekomendasiList, setRekomendasiList] = useState<RekItem[]>([])
  const [trenList, setTrenList] = useState<TrenItem[]>([])
  const [tagList, setTagList] = useState<string[]>([])
  const [heroArticle, setHeroArticle] = useState<HeroArticle | null>(null)
  const [loadingMedia, setLoadingMedia] = useState(true)

  // Sinkronisasi dinamis dari CMS database
  useEffect(() => {
    let active = true
    fetch('/api/cms/articles?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          const articles = data.articles

          // Artikel utama: yang ditandai headline, atau artikel terbaru.
          const headline = articles.find((a: any) => a.isHeadlineBanner) || articles[0]
          if (headline) {
            setHeroArticle({
              title: headline.title,
              slug: headline.slug,
              kickerBadge: headline.kickerBadge || 'Warta Utama',
              editionBadge: headline.editionBadge || 'Edisi Terkini',
              coverCredit: headline.coverCredit || 'Foto: Biro Dokumentasi',
              coverCaption: headline.coverCaption || headline.category || '',
              coverImageUrl: headline.coverImageUrl || '',
              dateDisplay: headline.dateDisplay || '',
              viewsDisplay: headline.viewsDisplay || '0 Tayang',
              authorName: headline.authorName || 'Redaksi Suarantara',
            })
          }

          const grid = articles.filter(
            (a: any) => !a.isHeadlineBanner && !a.isEditorPick && !a.isTrending
          )
          setBeritaList(
            grid.map((a: any) => ({
              id: a.id,
              title: a.title,
              category: a.category,
              date: a.dateDisplay,
              views: a.viewsDisplay,
              publisher: a.authorName,
              imageGrad: a.imageGrad,
              iconColor: a.iconColor,
              coverImageUrl: a.coverImageUrl || '',
              slug: a.slug,
            }))
          )

          const rek = articles.filter((a: any) => a.isEditorPick)
          setRekomendasiList(
            rek.map((a: any) => ({
              id: a.id,
              title: a.title,
              publisher: a.authorName,
              views: a.viewsDisplay,
              date: a.dateDisplay,
              tag: a.recommendationTag || a.category,
              imageColor: a.imageGrad,
              coverImageUrl: a.coverImageUrl || '',
              slug: a.slug,
            }))
          )

          setTrenList(
            articles
              .filter((a: any) => a.isTrending)
              .map((a: any, index: number) => ({
                no: a.rankingNo || String(index + 1).padStart(2, '0'),
                title: a.title,
                views: a.viewsDisplay,
              }))
          )

          // Topik terpopuler diturunkan dari label/tag artikel CMS.
          const collectedTags = new Set<string>()
          for (const a of articles) {
            let parsed: unknown = a.tags
            if (typeof a.tags === 'string') {
              try {
                parsed = JSON.parse(a.tags)
              } catch {
                parsed = a.tags.split(',')
              }
            }
            if (Array.isArray(parsed)) {
              for (const t of parsed) {
                const clean = String(t).trim()
                if (clean) collectedTags.add(clean.startsWith('#') ? clean : `#${clean}`)
              }
            }
            if (collectedTags.size >= 12) break
          }
          setTagList(Array.from(collectedTags))
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingMedia(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Generate daftar berita yang terlihat (jika melebihi kumpulan, dapat terus meluas)
  const displayedBerita = beritaList.slice(0, visibleCount)
  const hasMore = visibleCount < beritaList.length

  return (
    <section id="konten-pilar" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 select-none">
      
      {/* ─── HEADER PILAR: JUDUL MINIMALIS KLASIK, DROPDOWN & BUTTON NAVIGASI ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3 border-b-2 border-navy pb-3 mb-6">
        
        {/* BARIS UTAMA: KIRI (MEDIA) & KANAN (DROPDOWN ORGANISASI BERGANTIAN) SEJAJAR DI PORTRAIT */}
        <div className="flex items-center justify-between lg:justify-start gap-2 sm:gap-3 w-full lg:w-auto">
          
          {/* Dropdown Selector Pilar (MEDIA) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              suppressHydrationWarning
              className="group inline-flex items-center gap-1.5 font-serif text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy tracking-tight hover:text-gold transition-colors focus:outline-hidden"
              aria-expanded={dropdownOpen}
              aria-label="Pilih Pilar Suarantara"
            >
              <span>{current.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-gold-700 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-navy' : ''
                }`}
              />
            </button>

            {/* DROPDOWN MENU PILAR */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md border border-navy/25 shadow-xl rounded-lg py-2 z-50 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setActivePillar('media')
                    setDropdownOpen(false)
                  }}
                  className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs font-serif transition-colors ${
                    activePillar === 'media'
                      ? 'bg-navy/10 text-navy font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-navy'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-3.5 h-3.5 text-navy" />
                    <span>MEDIA (Warta & Opini)</span>
                  </div>
                  {activePillar === 'media' && <span className="w-1.5 h-1.5 rounded-full bg-navy" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActivePillar('advokasi')
                    setDropdownOpen(false)
                  }}
                  className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs font-serif transition-colors ${
                    activePillar === 'advokasi'
                      ? 'bg-crimson/10 text-crimson font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-crimson'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-crimson" />
                    <span>ADVOKASI (Kawal Kasus)</span>
                  </div>
                  {activePillar === 'advokasi' && <span className="w-1.5 h-1.5 rounded-full bg-crimson" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActivePillar('kajian')
                    setDropdownOpen(false)
                  }}
                  className={`w-full px-3 py-2 flex items-center justify-between text-left text-xs font-serif transition-colors ${
                    activePillar === 'kajian'
                      ? 'bg-gold/15 text-gold-800 font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-gold-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-gold-700" />
                    <span>KAJIAN (Riset &amp; Paper)</span>
                  </div>
                  {activePillar === 'kajian' && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
                </button>
              </div>
            )}
          </div>

          {/* DESKTOP VIEW: Jajaran Button di Samping Tulisan PILAR (Tetap Utuh untuk Lanskap/Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 border-l border-navy/20 pl-3">
            <button
              type="button"
              onClick={() => {
                setActivePillar('tentang-kami')
                window.history.pushState(null, '', '#tentang-kami')
              }}
              className={`px-2.5 py-1 rounded text-xs font-sans transition-colors select-none ${
                activePillar === 'tentang-kami'
                  ? 'bg-navy text-white font-bold shadow-xs'
                  : 'text-stone-700 hover:text-navy hover:bg-navy/5 font-medium'
              }`}
            >
              Tentang Kami
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePillar('visi-misi')
                window.history.pushState(null, '', '#visi-misi')
              }}
              className={`px-2.5 py-1 rounded text-xs font-sans transition-colors select-none ${
                activePillar === 'visi-misi'
                  ? 'bg-navy text-white font-bold shadow-xs'
                  : 'text-stone-700 hover:text-navy hover:bg-navy/5 font-medium'
              }`}
            >
              Visi Misi
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePillar('partners')
                window.history.pushState(null, '', '#partners')
              }}
              className={`px-2.5 py-1 rounded text-xs font-sans transition-colors select-none ${
                activePillar === 'partners'
                  ? 'bg-navy text-white font-bold shadow-xs'
                  : 'text-stone-700 hover:text-navy hover:bg-navy/5 font-medium'
              }`}
            >
              Partners
            </button>

            <button
              type="button"
              onClick={() => {
                setActivePillar('program')
                window.history.pushState(null, '', '#program')
              }}
              className={`px-2.5 py-1 rounded text-xs font-sans transition-colors select-none ${
                activePillar === 'program'
                  ? 'bg-navy text-white font-bold shadow-xs'
                  : 'text-stone-700 hover:text-navy hover:bg-navy/5 font-medium'
              }`}
            >
              Program
            </button>

            <button
              type="button"
              onClick={openContact}
              className="px-2.5 py-1 rounded text-xs font-sans font-medium text-stone-700 hover:text-navy hover:bg-navy/5 transition-colors select-none cursor-pointer"
            >
              Kontak Kami
            </button>
          </nav>

          {/* PORTRAIT VIEW: Dropdown Button Organisasi di Sisi Kanan (Sejajar dengan MEDIA) dengan Transisi Pudar Bergantian */}
          <div className="lg:hidden relative" ref={orgDropdownRef}>
            <button
              type="button"
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white border border-navy/20 text-navy shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Menu Organisasi"
            >
              {/* Teks dengan Transisi Pudar Masuk Bergantian */}
              <span
                className={`transition-opacity duration-300 font-serif font-bold text-xs text-navy tracking-tight truncate max-w-[120px] ${
                  orgFade ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {orgLinks[orgCycleIndex].name}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gold-700 shrink-0 transition-transform duration-200 ${
                  orgDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Organisasi */}
            {orgDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-md border border-navy/20 shadow-xl rounded-xl py-1.5 z-50 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
                {orgLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => {
                      setOrgDropdownOpen(false)
                      if (link.isContact) {
                        openContact()
                      } else {
                        setActivePillar(link.id as PillarType)
                        window.history.pushState(null, '', `#${link.id}`)
                        setTimeout(() => {
                          const el = document.getElementById('konten-pilar')
                          if (el) {
                            const yOffset = -90
                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
                            window.scrollTo({ top: y, behavior: 'smooth' })
                          }
                        }, 50)
                      }
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-sans transition-colors flex items-center justify-between ${
                      activePillar === link.id
                        ? 'bg-navy/10 text-navy font-bold'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-navy font-medium'
                    }`}
                  >
                    <span>{link.name}</span>
                    {activePillar === link.id && <span className="w-1.5 h-1.5 rounded-full bg-navy" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* KANAN (Desktop) / BAWAH (Mobile): Subtitle */}
        <div className="text-left lg:text-right pt-0.5 lg:pt-0">
          <p className="text-[10px] sm:text-xs font-serif italic text-stone-600 font-medium">
            {current.subtitle}
          </p>
        </div>

      </div>

      {/* ─── KONTEN DINAMIS BERDASARKAN PILAR AKTIF (MEDIA / ADVOKASI / KAJIAN / TENTANG KAMI / VISI MISI / PARTNERS / PROGRAM) ─── */}
      {activePillar === 'advokasi' ? (
        <AdvocacyPillarContent />
      ) : activePillar === 'kajian' ? (
        <KajianPillarContent />
      ) : activePillar === 'tentang-kami' ? (
        <AboutUsSection />
      ) : activePillar === 'visi-misi' ? (
        <VisiMisiPillarContent />
      ) : activePillar === 'partners' ? (
        <PartnersPillarContent />
      ) : activePillar === 'program' ? (
        <ProgramPillarContent />
      ) : loadingMedia ? (
        /* ─── SKELETON SINGKAT SAAT MEMUAT Warta CMS ─── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start animate-pulse">
          <div className="lg:col-span-8 space-y-6">
            <div className="w-full h-56 sm:h-72 lg:h-[410px] rounded-xl bg-navy/10" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-full aspect-[4/3] rounded-lg bg-navy/10" />
                  <div className="h-3 w-4/5 rounded bg-navy/10" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="h-40 rounded-xl bg-navy/10" />
            <div className="h-24 rounded-xl bg-navy/10" />
            <div className="h-28 rounded-xl bg-navy/10" />
          </div>
        </div>
      ) : (
        /* ─── KONTEN PILAR MEDIA (Default) ─── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ════════════════ KONTEN KIRI (8 KOLOM) ════════════════ */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. BANNER GEDE BERITA UTAMA (Tanpa Box Putih, Teks di Atas Gambar pada Scrim Bawah, Gambar Tetap Terbuka) */}
            {heroArticle && (
            <article className="relative w-full h-56 sm:h-72 md:h-80 lg:h-[410px] rounded-xl overflow-hidden border border-navy/25 group cursor-pointer shadow-md bg-gradient-to-tr from-navy-950 via-navy-900 to-stone-900">
              {/* Gambar Sampul CMS (bila tersedia) */}
              {heroArticle.coverImageUrl && (
                <Image
                  src={heroArticle.coverImageUrl}
                  alt={heroArticle.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              )}
              {/* Visual Graphic Motif / Background Canvas */}
              <div className="absolute inset-0 bg-[radial-gradient(#d4a200_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
              
              {/* Center Visual Focal Point (Unobstructed in the upper 60%) */}
              <div className="absolute top-1/5 sm:top-1/4 inset-x-0 flex flex-col items-center justify-center text-center p-3 sm:p-6 text-white/90 z-10 transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                <div className="inline-flex p-2 sm:p-3.5 rounded-full bg-white/10 backdrop-blur-md mb-1.5 sm:mb-2 border border-white/20">
                  <Newspaper className="w-5 h-5 sm:w-8 sm:h-8 text-gold" />
                </div>
                <p className="font-serif text-[9px] sm:text-xs md:text-sm italic tracking-wide text-stone-200 line-clamp-1 px-4">
                  {heroArticle.coverCaption}
                </p>
              </div>

              {/* Badges di Pojok Kiri & Kanan Atas Gambar (Ukuran Rapi & Proporsional di Mobile) */}
              <div className="absolute top-2 sm:top-3.5 inset-x-2 sm:inset-x-3.5 flex items-center justify-between z-20 pointer-events-none">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-sans font-bold uppercase tracking-wider bg-gold text-navy shadow-xs">
                    {heroArticle.kickerBadge}
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[7.5px] sm:text-[9px] font-sans bg-black/50 backdrop-blur-md text-stone-200 border border-white/10 uppercase tracking-wider">
                    {heroArticle.editionBadge}
                  </span>
                </div>
                <span className="px-1.5 sm:px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[7.5px] sm:text-[9px] text-stone-300 font-mono">
                  {heroArticle.coverCredit}
                </span>
              </div>

              {/* GRADIENT SCRIM DI BAGIAN BAWAH GAMBAR TEMPAT TEKS BERADA (Gambar tidak tertutup, teks kontras 100%) */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-navy-950/95 via-navy-950/80 via-45% to-transparent pt-14 z-20 flex flex-col justify-end">
                
                {/* JUDUL TEKS BERADA DI ATAS GAMBAR DENGAN KONTRAS TINGGI */}
                <h3 className="font-serif text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white group-hover:text-gold transition-colors leading-snug drop-shadow-sm line-clamp-2">
                  {heroArticle.title}
                </h3>

                {/* DIBAGIAN BAWAH KIRI: TANGGAL, VIEWS, DAN PENERBIT */}
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[9px] sm:text-2xs font-sans text-stone-300">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Tanggal */}
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                      {heroArticle.dateDisplay}
                    </span>
                    <span>•</span>
                    {/* Views */}
                    <span className="inline-flex items-center gap-1 font-mono font-semibold text-gold">
                      <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                      {heroArticle.viewsDisplay}
                    </span>
                    <span>•</span>
                    {/* Penerbit / Penulis */}
                    <span className="inline-flex items-center gap-1 font-medium text-stone-200 truncate max-w-[110px] sm:max-w-none">
                      <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                      {heroArticle.authorName}
                    </span>
                  </div>

                  <Link
                    href={`/berita/${heroArticle.slug}`}
                    className="font-serif font-bold text-gold hover:text-white text-[10px] sm:text-xs inline-flex items-center gap-1 transition-colors shrink-0"
                  >
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Link>
                </div>
              </div>

            </article>
            )}

            {/* 2. BERITA 3 GRID DENGAN POSTER PERSEGI, TANPA BACKGROUND PUTIH, JUDUL DI BAWAH GAMBAR */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4 border-b border-navy/15 pb-2">
                <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <Newspaper className="w-4 h-4 text-gold-700" />
                  Berita Terbaru
                </span>
                <span className="text-[10px] font-sans text-stone-500 font-medium">
                  Menampilkan {displayedBerita.length} dari {beritaList.length} Berita
                </span>
              </div>

              {beritaList.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={Newspaper}
                  title="Belum Ada Warta Terbaru"
                  description="Kanal warta masih dalam penyusunan. Berita terbaru dari redaksi akan tampil di sini begitu diterbitkan."
                  hint="Redaksi sedang menyiapkan warta hari ini"
                />
              ) : (
              <>
              {/* Grid 2 Kolom di Portrait / Mobile & 3 Kolom di Desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4.5">
                {displayedBerita.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug || item.id}`}
                    className="flex flex-col justify-between group cursor-pointer transition-all"
                  >
                    <div>
                      {/* Poster Gambar (Ukuran Pas & Rapi, Tanpa Box Putih di Luar) */}
                      <div className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-b ${item.imageGrad} border border-navy/15 mb-2.5 flex items-center justify-center shadow-xs group-hover:border-gold transition-colors`}>
                        {item.coverImageUrl ? (
                          <Image
                            src={item.coverImageUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-center p-3 text-white/80 transition-transform duration-300 group-hover:scale-105">
                            <Newspaper className={`w-5 h-5 ${item.iconColor} mx-auto mb-1`} />
                            <span className="font-serif text-[9px] tracking-wider uppercase text-stone-300 line-clamp-1">
                              {item.category}
                            </span>
                          </div>
                        )}

                        {/* Kategori Badge di Pojok Kiri Atas Gambar */}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/65 backdrop-blur-md text-[9px] font-sans font-semibold text-gold">
                          {item.category}
                        </span>
                      </div>

                      {/* JUDUL BERADA DI BAWAH GAMBAR (Font size pas di mobile 2-grid) */}
                      <h4 className="font-serif text-[11px] sm:text-xs md:text-[13px] font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    {/* SPESIFIK METADATA DI BAWAH JUDUL (Rapi & tidak bertabrakan di mobile 2-grid) */}
                    <div className="mt-1.5 pt-1 sm:pt-1.5 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-sans text-stone-500">
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="truncate">{item.date}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-0.5 text-gold-700 font-mono font-semibold shrink-0">
                          <Eye className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          {item.views}
                        </span>
                      </div>
                      <span className="font-medium text-stone-600 truncate max-w-full sm:max-w-[85px]">
                        {item.publisher}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* BUTTON LIHAT BERITA LAINNYA (DI KIRI, TANPA BOX CURVE ATAU BACKGROUND) */}
              <div className="mt-6 pt-3 flex justify-start">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    suppressHydrationWarning
                    className="group inline-flex items-center gap-2 text-xs font-serif font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors border-b-2 border-navy hover:border-gold pb-1 select-none"
                  >
                    <PlusCircle className="w-4 h-4 text-gold group-hover:rotate-90 transition-transform duration-200" />
                    <span>Lihat Berita Lainnya (+9 Berita)</span>
                  </button>
                ) : (
                  <div className="text-left py-1 text-stone-500 text-[11px] font-serif italic border-b border-stone-200/60 pb-1">
                    Seluruh {beritaList.length} warta terkini telah ditampilkan
                  </div>
                )}
              </div>
              </>
              )}

            </div>

          </div>

          {/* ════════════════ KONTEN KANAN (4 KOLOM) ════════════════ */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. REKOMENDASI UNTUK ANDA (MAKSIMAL 7 BERITA) */}
            <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-4 sm:p-5 rounded-xl shadow-xs">
              
              {/* Header Rekomendasi */}
              <div className="flex items-center justify-between border-b border-navy/15 pb-2 mb-3.5">
                <span className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-crimson" />
                  Rekomendasi Untuk Anda
                </span>
                <span className="text-[10px] font-sans text-stone-500 font-medium">
                  Pilihan Redaksi
                </span>
              </div>

              {/* List 7 Berita: Poster Persegi di Kiri, Judul di Kanan + Spesifik di Bawah Judul */}
              {rekomendasiList.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={Flame}
                  title="Belum Ada Pilihan Redaksi"
                  description="Kurasi berita pilihan akan muncul di sini setelah redaksi menandai artikel unggulan."
                />
              ) : (
              <div className="divide-y divide-stone-100 space-y-3">
                {rekomendasiList.slice(0, 7).map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug || item.id}`}
                    className={`flex gap-3 items-start group cursor-pointer ${
                      index === 0 ? '' : 'pt-3'
                    }`}
                  >
                    {/* Poster Persegi di Kiri */}
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-md overflow-hidden bg-gradient-to-br ${item.imageColor} border border-stone-200/60 flex items-center justify-center`}>
                      {item.coverImageUrl ? (
                        <Image
                          src={item.coverImageUrl}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <Newspaper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold/80" />
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[7px] sm:text-[8px] font-mono text-center text-stone-300 py-0.2">
                        {item.tag}
                      </span>
                    </div>

                    {/* Judul di Kanan + Spesifik di Bawah Judul */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif text-[11px] sm:text-xs font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h5>

                      <div className="mt-1 flex items-center gap-1.5 text-[8.5px] sm:text-[10px] font-sans text-stone-500">
                        <span className="font-medium text-stone-600 truncate max-w-[75px] sm:max-w-[85px]">
                          {item.publisher}
                        </span>
                        <span>•</span>
                        <span className="text-gold-700 font-mono font-medium">
                          {item.views}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              )}

            </div>

            {/* 2. TOPIK TERPOPULER (Tag Berita Koran Modern) */}
            <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-4 sm:p-5 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 border-b border-navy/15 pb-2 mb-3">
                <Tag className="w-3.5 h-3.5 text-navy" />
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-navy">
                  Topik Terpopuler
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tagList.length === 0 ? (
                  <p className="w-full text-center text-[11px] font-serif italic text-stone-500 py-1">
                    Topik akan terisi otomatis dari label artikel yang diterbitkan.
                  </p>
                ) : (
                  tagList.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-gold hover:text-navy border border-navy/15 text-[10px] font-sans font-medium text-stone-700 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* 3. TREN ISU MINGGU INI (Ranking 1-4) */}
            <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-4 sm:p-5 rounded-xl shadow-xs">
              <div className="flex items-center gap-1.5 border-b border-navy/15 pb-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-crimson" />
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-navy">
                  Tren Isu Minggu Ini
                </span>
              </div>

              <div className="space-y-2.5">
                {trenList.length === 0 ? (
                  <EmptyState
                    variant="compact"
                    icon={TrendingUp}
                    title="Belum Ada Tren Tercatat"
                    description="Peringkat isu terpanas minggu ini akan tampil setelah artikel bertanda tren diterbitkan."
                  />
                ) : (
                  trenList.map((tren) => (
                    <div
                      key={tren.no}
                      className="flex items-start gap-2.5 group cursor-pointer"
                    >
                      <span className="font-serif font-bold text-base text-gold-700 w-5 shrink-0">
                        {tren.no}
                      </span>
                      <div className="flex-1">
                        <p className="font-serif text-xs font-semibold text-stone-900 group-hover:text-navy transition-colors line-clamp-2 leading-snug">
                          {tren.title}
                        </p>
                        <span className="text-[9px] font-mono text-stone-400">
                          {tren.views} pembaca aktif
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  )
}
