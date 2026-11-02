'use client'

import { useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft } from 'lucide-react'

function MasukForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/kirim-suara'
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-sm shadow-sm">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 text-center border-b border-stone-100">
        <div className="flex justify-center mb-5">
          <div className="relative w-48 h-14">
            <Image
              src="/logo-Suarantara.png"
              alt="SUARANTARA"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="font-serif text-2xl sm:text-[1.7rem] font-bold text-navy leading-tight mb-2">
          Masuk ke Redaksi
        </h1>
        <p className="text-sm font-sans text-stone-500 leading-relaxed max-w-xs mx-auto">
          Masuk untuk mengirim aspirasi, aduan, dan kontribusi tulisan kepada redaksi.
        </p>
      </div>

      {/* Sign In Area */}
      <div className="px-8 py-8">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-md border border-stone-300 bg-white hover:bg-stone-50 hover:border-stone-400 active:scale-[0.98] transition-all duration-200 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
        >
          {/* Google Icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-sm font-sans font-medium text-stone-700 group-hover:text-stone-900">
            {isLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
          </span>
        </button>

        {/* Decorative separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-stone-200" />
          <span className="text-[10px] font-sans uppercase tracking-widest text-stone-400">atau</span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-sm font-sans text-stone-500 hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

export default function MasukPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <NewspaperMasthead variant="white" />

      {/* Spacer for fixed masthead */}
      <div className="pt-32 sm:pt-36 md:pt-40" />

      {/* Login Card */}
      <main className="flex-1 flex items-start justify-center px-4 pb-20">
        <div className="w-full max-w-md">
          {/* Ornamental top line */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-stone-300" />
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400">Redaksi Suarantara</span>
            <div className="flex-1 h-px bg-stone-300" />
          </div>

          <Suspense fallback={
            <div className="bg-white border border-stone-200 rounded-sm p-8 text-center text-sm text-stone-500">
              Memuat formulir masuk...
            </div>
          }>
            <MasukForm />
          </Suspense>

          {/* Bottom Note */}
          <p className="text-center text-[11px] font-sans text-stone-400 mt-6 leading-relaxed">
            Dengan masuk, Anda menyetujui bahwa identitas Anda akan digunakan<br className="hidden sm:block" />
            untuk verifikasi aspirasi yang dikirimkan.
          </p>

          {/* Ornamental bottom line */}
          <div className="flex items-center gap-3 mt-8">
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
