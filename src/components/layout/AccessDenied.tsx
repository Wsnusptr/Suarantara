'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ShieldAlert, LogOut, Home } from 'lucide-react'

interface AccessDeniedProps {
  /** Email akun yang sedang login (untuk transparansi). */
  email?: string | null
  /** Nama area terbatas, mis. "Meja Redaksi" atau "Sanity Studio". */
  area?: string
}

// Halaman yang ditampilkan ketika pengguna SUDAH login tetapi bukan staf redaksi.
// Sengaja berupa tampilan (bukan redirect) agar tidak terjadi loop
// /masuk -> /admin -> /masuk tanpa henti.
export function AccessDenied({ email, area = 'Meja Redaksi' }: AccessDeniedProps) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-stone-300" />
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400">Akses Terbatas</span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>

        <div className="bg-white border border-stone-200 rounded-sm shadow-sm px-8 py-10">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-navy mb-3">Akses Ditolak</h1>

          <p className="text-sm font-sans text-stone-600 leading-relaxed mb-2">
            Akun Anda tidak memiliki peran sebagai staf redaksi, sehingga {area} tidak dapat diakses.
          </p>

          {email && (
            <p className="text-[11px] font-sans text-stone-400 mb-6 break-all">
              Masuk sebagai: <span className="font-medium text-stone-500">{email}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/masuk' })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-navy hover:bg-navy-800 text-white font-sans font-semibold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar &amp; Ganti Akun
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-600 font-sans text-xs hover:bg-stone-50 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <div className="flex-1 h-px bg-stone-300" />
          <span className="text-stone-400 text-xs">✦</span>
          <div className="flex-1 h-px bg-stone-300" />
        </div>
      </div>
    </div>
  )
}
