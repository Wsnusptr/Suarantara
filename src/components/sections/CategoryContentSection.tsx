'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Vote,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Clock,
  Eye,
  CheckCircle,
  Newspaper,
  BookOpen,
  Scale,
  Activity,
  Landmark,
  Compass,
} from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'

type CategoryKey =
  | 'politik'
  | 'hukum'
  | 'peristiwa'
  | 'pendidikan'
  | 'kesehatan'
  | 'sosbud'

interface CategoryItem {
  id: string
  title: string
  category: CategoryKey
  date: string
  views: string
  author: string
  excerpt: string
  imageGrad: string
  iconType: 'politik' | 'hukum' | 'peristiwa' | 'pendidikan' | 'kesehatan' | 'sosbud'
  coverImageUrl?: string
  slug?: string
}

const categoryTabs: { key: CategoryKey; label: string }[] = [
  { key: 'politik', label: 'Politik' },
  { key: 'hukum', label: 'Hukum' },
  { key: 'peristiwa', label: 'Peristiwa' },
  { key: 'pendidikan', label: 'Pendidikan' },
  { key: 'kesehatan', label: 'Kesehatan' },
  { key: 'sosbud', label: 'Sosial & Budaya' },
]

/** Bucket kategori kosong — seluruh isi kanal rubrik murni bersumber dari CMS. */
const emptyCategoryBuckets = (): Record<CategoryKey, CategoryItem[]> => ({
  politik: [],
  hukum: [],
  peristiwa: [],
  pendidikan: [],
  kesehatan: [],
  sosbud: [],
})

function CategoryIcon({ type }: { type: CategoryItem['iconType'] }) {
  switch (type) {
    case 'politik':
      return <Landmark className="w-6 h-6 text-gold" />
    case 'hukum':
      return <Scale className="w-6 h-6 text-crimson-400" />
    case 'peristiwa':
      return <Newspaper className="w-6 h-6 text-amber-400" />
    case 'pendidikan':
      return <BookOpen className="w-6 h-6 text-gold" />
    case 'kesehatan':
      return <Activity className="w-6 h-6 text-emerald-400" />
    case 'sosbud':
      return <Compass className="w-6 h-6 text-purple-400" />
    default:
      return <Newspaper className="w-6 h-6 text-gold" />
  }
}

export function CategoryContentSection() {
  const [activeTab, setActiveTab] = useState<CategoryKey>('politik')
  const [pollVoted, setPollVoted] = useState<number | string | null>(null)
  const [articlesData, setArticlesData] = useState<Record<CategoryKey, CategoryItem[]>>(emptyCategoryBuckets)
  const [pollData, setPollData] = useState<any | null>(null)
  const [quoteData, setQuoteData] = useState<any | null>(null)

  // Sinkronisasi dinamis dari CMS Database (/api/cms/articles & /api/cms/widgets)
  useEffect(() => {
    fetch('/api/cms/articles?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.articles && data.articles.length > 0) {
          const grouped: Record<CategoryKey, CategoryItem[]> = emptyCategoryBuckets()

          data.articles.forEach((art: any) => {
            const key = (art.categoryKey || 'politik').toLowerCase() as CategoryKey
            if (grouped[key]) {
              grouped[key].push({
                id: art.id,
                title: art.title,
                slug: art.slug,
                category: key,
                date: art.dateDisplay || '',
                views: art.viewsDisplay || '0',
                author: art.authorName || 'Redaksi Suarantara',
                excerpt: art.leadExcerpt || art.excerpt || '',
                imageGrad: art.imageGrad || 'from-navy-950 via-navy-900 to-stone-900',
                iconType: (art.iconType as any) || key,
                coverImageUrl: art.coverImageUrl || '',
              })
            }
          })

          setArticlesData(grouped)
        }
      })
      .catch(() => {})

    // Fetch poll & quote widgets
    fetch('/api/cms/widgets')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.poll && data.poll.options?.length > 0) {
            setPollData({
              id: data.poll.id,
              question: data.poll.question,
              // API mengirim totalVotes (angka) hasil hitung dari kolom votes
              totalVotes: data.poll.totalVotes,
              options: data.poll.options.map((opt: any) => ({
                id: opt.id,
                label: opt.label,
                // API mengirim `percent` (angka 0-100) → format sebagai persentase CSS
                percent: `${opt.percent ?? 0}%`,
              })),
            })
          }
          if (data.quote) {
            setQuoteData({
              // Field respons API: quoteText, figureName, figureRole, avatarInitials
              text: data.quote.quoteText,
              author: data.quote.figureName,
              role: data.quote.figureRole,
              initials: data.quote.avatarInitials || 'AM',
            })
          }
        }
      })
      .catch(() => {})
  }, [])

  const handleVote = async (optionId: any) => {
    setPollVoted(optionId)
    try {
      const res = await fetch('/api/cms/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId }),
      })
      const data = await res.json()
      // Sinkronkan kembali persentase & total suara terbaru dari server
      if (data?.success && data.poll) {
        setPollData({
          id: data.poll.id,
          question: data.poll.question,
          totalVotes: data.poll.totalVotes,
          options: data.poll.options.map((opt: any) => ({
            id: opt.id,
            label: opt.label,
            percent: `${opt.percent ?? 0}%`,
          })),
        })
      }
    } catch {}
  }

  const articles = articlesData[activeTab] || []

  return (
    <section id="konten-kategori" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 select-none">
      
      {/* ─── GRID UTAMA KATEGORI (KONTEN KIRI 8 KOLOM vs KONTEN KANAN 4 KOLOM) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ─── KONTEN KIRI: 6 KATEGORI RESMI (8 KOLOM, TANPA BOX PUTIH, LENGKAP GAMBAR) ─── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Section Kategori */}
          <div className="flex items-center justify-between border-b-2 border-navy pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-navy" />
              <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-navy">
                Kanal Rubrik
              </h3>
            </div>
            <span className="text-[10px] font-sans uppercase tracking-widest text-stone-500 font-medium">
              Pilih Kategori Warta
            </span>
          </div>

          {/* 6 Tabs Kategori Ramping & Minimalis */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                suppressHydrationWarning
                className={`px-3.5 py-1.5 rounded-full text-2xs sm:text-xs font-serif font-bold uppercase tracking-wider transition-all duration-200 shrink-0 select-none ${
                  activeTab === tab.key
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-white/80 hover:bg-navy/10 text-stone-700 border border-navy/20 hover:border-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Konten Berita Kategori: Tanpa Box Putih, Gambar Tajam, Judul di Bawah Gambar */}
          <div className="space-y-6 pt-1">
            
            {articles.length === 0 ? (
              <EmptyState
                variant="default"
                icon={Newspaper}
                title={`Belum Ada Warta Kategori ${categoryTabs.find((t) => t.key === activeTab)?.label ?? ''}`}
                description="Rubrik ini akan terisi otomatis begitu redaksi menerbitkan artikel pada kategori terkait."
                hint="Redaksi belum menerbitkan warta kategori ini"
              />
            ) : (
            <>
            {/* Berita Utama Kategori dengan Gambar Banner Proporsional */}
            {articles[0] && (
              <Link
                href={`/berita/${(articles[0] as any).slug || articles[0].id}`}
                className="block group"
              >
                <article className="cursor-pointer">
                  {/* Poster Gambar Utama Kategori */}
                  <div className={`relative w-full h-44 sm:h-56 md:h-64 rounded-xl overflow-hidden bg-gradient-to-tr ${articles[0].imageGrad} border border-navy/15 flex items-center justify-center shadow-xs group-hover:border-gold transition-colors`}>
                    {articles[0].coverImageUrl ? (
                      <Image
                        src={articles[0].coverImageUrl}
                        alt={articles[0].title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[radial-gradient(#d4a200_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
                        <div className="text-center p-4 text-white/90 z-10 transition-transform duration-300 group-hover:scale-105">
                          <div className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-md mb-2 border border-white/20">
                            <CategoryIcon type={articles[0].iconType} />
                          </div>
                          <p className="font-serif text-xs italic tracking-wider text-stone-300 uppercase">
                            Sorotan Rubrik {activeTab}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Kategori Badge di Pojok Kiri */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-sans font-bold text-gold uppercase tracking-wider border border-gold/30">
                      {activeTab}
                    </span>
                  </div>

                  {/* Judul & Cuplikan di Bawah Gambar (Tanpa Box Putih) */}
                  <div className="mt-2.5 sm:mt-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-2xs font-sans text-stone-500 mb-1">
                      <span className="font-semibold text-navy uppercase tracking-wider">{activeTab}</span>
                      <span>•</span>
                      <span>{articles[0].date}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 text-gold-700 font-mono font-medium">
                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {articles[0].views}
                      </span>
                    </div>

                    <h4 className="font-serif text-sm sm:text-base md:text-lg font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug">
                      {articles[0].title}
                    </h4>

                    <p className="mt-1 text-[11px] sm:text-xs md:text-[13px] text-stone-600 font-sans font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {articles[0].excerpt}
                    </p>

                    <div className="mt-2 pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[9px] sm:text-2xs text-stone-500 font-sans">
                      <span className="font-medium text-stone-700">Penulis: {articles[0].author}</span>
                      <span className="font-serif font-bold text-navy group-hover:text-gold-700 inline-flex items-center gap-1 transition-colors">
                        Baca Ulasan <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Sub-Berita Kategori (Grid 2 Kolom di Seluruh Layar, Lengkap Gambar, Tanpa Box Putih) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 pt-2">
              {articles.slice(1).map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug || item.id}`}
                  className="block group"
                >
                  <article className="flex flex-col justify-between cursor-pointer h-full">
                    <div>
                      {/* Poster Gambar Sub-Berita */}
                      <div className={`relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-gradient-to-tr ${item.imageGrad} border border-navy/15 mb-2.5 flex items-center justify-center shadow-2xs group-hover:border-gold transition-colors`}>
                        {item.coverImageUrl ? (
                          <Image
                            src={item.coverImageUrl}
                            alt={item.title}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-center p-2 text-white/80 transition-transform duration-300 group-hover:scale-105">
                            <CategoryIcon type={item.iconType} />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[8px] font-sans font-semibold text-gold uppercase">
                          {activeTab}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[8.5px] sm:text-[10px] font-sans text-stone-500 mb-1">
                        <span className="font-semibold text-navy uppercase">{activeTab}</span>
                        <span>{item.date}</span>
                      </div>

                      <h5 className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 group-hover:text-navy transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h5>

                      <p className="mt-1 text-[9.5px] sm:text-[11px] text-stone-600 font-sans font-light line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-stone-200/60 flex items-center justify-between text-[8px] sm:text-[10px] text-stone-500 font-sans">
                      <span className="truncate max-w-[70px] sm:max-w-[120px] font-medium text-stone-700">{item.author}</span>
                      <span className="text-navy font-semibold group-hover:underline">Baca →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            </>
            )}

          </div>

        </div>

        {/* ─── KONTEN KANAN: POLLING, SUARA MAHASISWA & SLOT KOLABORASI (4 KOLOM) ─── */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          
          {/* 1. Jajak Pendapat / Polling Mahasiswa Mingguan */}
          <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs">
            <div className="flex items-center justify-between border-b border-navy/10 pb-2 mb-2.5 sm:mb-3">
              <span className="font-serif font-bold text-[10.5px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5 text-navy" />
                Jajak Pendapat Kampus
              </span>
              <span className="text-[8.5px] sm:text-[9px] px-2 py-0.5 rounded-full bg-gold/15 text-gold-800 font-semibold font-sans">
                Minggu Ini
              </span>
            </div>

            {!pollData ? (
              <EmptyState
                variant="compact"
                icon={Vote}
                title="Belum Ada Jajak Pendapat"
                description="Polling mahasiswa akan tampil di sini setelah admin mengaktifkannya dari panel CMS."
              />
            ) : (
            <>
            <p className="font-serif text-[11px] sm:text-xs md:text-sm font-bold text-stone-900 leading-snug mb-2.5 sm:mb-3">
              &ldquo;{pollData.question}&rdquo;
            </p>

            <div className="space-y-1.5 sm:space-y-2 text-[9.5px] sm:text-2xs font-sans">
              {pollData.options.map((opt: any) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleVote(opt.id)}
                  suppressHydrationWarning
                  className={`w-full text-left p-2 sm:p-2.5 rounded-md border transition-all relative overflow-hidden ${
                    pollVoted === opt.id
                      ? 'border-navy bg-navy/10 font-bold text-navy'
                      : 'border-stone-200 hover:border-navy/40 bg-white/70 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="leading-snug">{opt.label}</span>
                    {pollVoted !== null && <span className="font-mono text-[10px] sm:text-xs shrink-0 ml-2">{opt.percent}</span>}
                  </div>
                  {pollVoted !== null && (
                    <div
                      className="absolute inset-y-0 left-0 bg-gold/25 -z-0 transition-all duration-700"
                      style={{ width: opt.percent }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-2.5 sm:mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[9px] sm:text-[10px] text-stone-500 font-sans">
              <span>Total Responden: {pollData.totalVotes?.toLocaleString('id-ID') || '0'} Mahasiswa</span>
              {pollVoted && (
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Suara Tercatat
                </span>
              )}
            </div>
            </>
            )}
          </div>

          {/* 2. Kutipan Aspirasi Mahasiswa Nusantara */}
          <div className="bg-white/60 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 border-b border-navy/10 pb-2 mb-2.5 sm:mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-gold-700" />
              <span className="font-serif font-bold text-[10.5px] sm:text-xs uppercase tracking-wider text-navy">
                Kutipan Aspirasi Pekan Ini
              </span>
            </div>

            {!quoteData ? (
              <EmptyState
                variant="compact"
                icon={MessageSquare}
                title="Belum Ada Kutipan Aspirasi"
                description="Kutipan tokoh mahasiswa akan tampil di sini setelah admin menambahkannya."
              />
            ) : (
            <>
            <blockquote className="font-serif italic text-[11px] sm:text-xs md:text-sm text-stone-800 leading-relaxed border-l-2 border-gold pl-2.5 sm:pl-3 py-1">
              &ldquo;{quoteData.text}&rdquo;
            </blockquote>

            <div className="mt-2.5 sm:mt-3 flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-navy text-gold font-serif font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0">
                {quoteData.initials || '—'}
              </div>
              <div>
                <p className="font-serif font-bold text-[11px] sm:text-xs text-navy">{quoteData.author}</p>
                <p className="font-sans text-[9px] sm:text-[10px] text-stone-500">{quoteData.role}</p>
              </div>
            </div>
            </>
            )}
          </div>

          {/* 3. Kolaborasi Strategis & Ruang Mitra (Warna Teks Kontras Tajam, Tanpa Font Putih & Abu Samar) */}
          <div className="bg-white/80 backdrop-blur-xs p-3.5 sm:p-5 rounded-xl border border-navy/20 shadow-xs relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#d4a200_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                <span className="text-[9px] sm:text-[10px] font-sans uppercase font-bold tracking-widest text-gold-800">
                  Ruang Kemitraan
                </span>
              </div>

              <h5 className="font-serif font-bold text-xs sm:text-sm text-navy leading-snug">
                BEM, Lembaga Pers, atau Komunitas Riset Anda Ingin Berkolaborasi?
              </h5>

              <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-2xs text-stone-700 font-sans font-normal leading-relaxed">
                Bergabung bersama jaringan Suarantara untuk distribusi warta, advokasi bersama, dan publikasi kajian ilmiah kampus.
              </p>

              <Link
                href="#kontak-redaksi"
                className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 text-[9.5px] sm:text-2xs font-sans font-bold text-navy bg-gold hover:bg-gold-500 px-3 sm:px-3.5 py-1.5 rounded-full transition-colors uppercase tracking-wider shadow-xs border border-gold-600"
              >
                <span>Ajukan Kemitraan</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </section>
  )
}
