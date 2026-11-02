import Link from 'next/link'
import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900">
      <NewspaperMasthead variant="white" />
      <main className="flex-1 flex items-center justify-center px-4 py-24 sm:py-32">
        <div className="max-w-md w-full text-center space-y-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-100 rounded-full">
            Edisi Khusus / 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-navy">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-stone-600 font-serif italic text-sm sm:text-base leading-relaxed">
            Artikel atau lembaran berita yang Anda tuju tidak tercatat dalam arsip redaksi Suarantara. Silakan periksa kembali tautan Anda.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-navy hover:bg-navy-900 rounded-lg shadow-sm transition-colors"
            >
              Kembali ke Beranda Utama
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
