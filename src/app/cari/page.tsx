import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { Footer } from '@/components/layout/Footer'
import { Search, ArrowRight, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pencarian Warta | Suarantara',
  description: 'Cari berita, warta, dan artikel redaksi Suarantara.',
}

interface CariPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function CariPage({ searchParams }: CariPageProps) {
  const { q } = await searchParams
  const query = (q || '').trim()

  // Cari pada judul, lead, dan isi artikel yang sudah terbit (PUBLISHED).
  const articles = query
    ? await db.article.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { leadExcerpt: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: { publishedAt: 'desc' },
        take: 40,
      })
    : []

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <NewspaperMasthead variant="white" />
      <div className="pt-32 sm:pt-36 md:pt-40" />

      <main className="flex-1 px-4 sm:px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-stone-300" />
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400">Pencarian</span>
            <div className="flex-1 h-px bg-stone-300" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy text-center mb-2">
            Cari Warta
          </h1>
          <p className="text-sm font-sans text-stone-500 text-center mb-8 max-w-md mx-auto">
            Telusuri berita, warta, dan artikel yang telah diterbitkan redaksi Suarantara.
          </p>

          {/* Form pencarian */}
          <form action="/cari" method="get" className="max-w-xl mx-auto mb-10">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Ketik kata kunci, judul, atau kategori..."
                autoComplete="off"
                className="w-full pl-10 pr-28 py-3 text-sm font-sans rounded-full border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-gold shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold hover:bg-gold-500 text-navy font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cari
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Status hasil */}
          {query && (
            <p className="text-center text-xs font-sans text-stone-500 mb-6">
              {articles.length > 0 ? (
                <>Menampilkan <span className="font-semibold text-navy">{articles.length}</span> hasil untuk &ldquo;{query}&rdquo;</>
              ) : (
                <>Tidak ada hasil untuk &ldquo;{query}&rdquo;</>
              )}
            </p>
          )}

          {/* Hasil */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/berita/${article.slug}`}
                  className="group bg-white border border-stone-200 rounded-sm shadow-sm hover:shadow-md hover:border-gold/60 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-40 bg-stone-100 overflow-hidden">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${article.imageGrad} flex items-center justify-center`}>
                        <FileText className="w-8 h-8 text-white/60" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gold text-navy text-[9px] font-sans font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] font-sans text-stone-400 uppercase tracking-wider mb-1.5">
                      {article.dateDisplay}
                    </p>
                    <h3 className="font-serif text-base font-bold text-navy leading-snug line-clamp-2 group-hover:text-gold-700 transition-colors mb-2">
                      {article.title}
                    </h3>
                    {article.leadExcerpt && (
                      <p className="text-[12px] font-sans text-stone-500 leading-relaxed line-clamp-3">
                        {article.leadExcerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            query && (
              <div className="max-w-md mx-auto text-center bg-white border border-stone-200 rounded-sm shadow-sm px-8 py-12">
                <Search className="w-10 h-10 text-stone-300 mx-auto mb-4" />
                <h2 className="font-serif text-lg font-bold text-navy mb-2">Hasil Tidak Ditemukan</h2>
                <p className="text-sm font-sans text-stone-500 leading-relaxed">
                  Coba gunakan kata kunci lain atau periksa ejaan pencarian Anda.
                </p>
              </div>
            )
          )}

          {!query && (
            <div className="max-w-md mx-auto text-center bg-white border border-stone-200 rounded-sm shadow-sm px-8 py-12">
              <Search className="w-10 h-10 text-stone-300 mx-auto mb-4" />
              <p className="text-sm font-sans text-stone-500 leading-relaxed">
                Masukkan kata kunci pada kolom di atas untuk mulai mencari warta.
              </p>
            </div>
          )}

          {/* Bottom ornament */}
          <div className="flex items-center gap-3 mt-12">
            <div className="flex-1 h-px bg-stone-300" />
            <span className="text-stone-400 text-xs">✦</span>
            <div className="flex-1 h-px bg-stone-300" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
