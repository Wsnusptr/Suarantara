'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { Footer } from '@/components/layout/Footer'
import { Send, CheckCircle, LogOut, ChevronDown, AlertCircle } from 'lucide-react'

const KATEGORI_OPTIONS = ['Media', 'Advokasi', 'Kajian', 'Umum'] as const

export default function KirimSuaraPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    kampus: '',
    isi: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Wajib login. Pengalihan dilakukan di dalam useEffect (bukan saat render)
  // agar tidak memicu peringatan React tentang setState/router di body render.
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/masuk?callbackUrl=/kirim-suara')
    }
  }, [status, router])

  const user = session?.user

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.judul.trim()) newErrors.judul = 'Judul aspirasi wajib diisi'
    if (!formData.kategori) newErrors.kategori = 'Pilih kategori'
    if (!formData.kampus.trim()) newErrors.kampus = 'Kampus asal wajib diisi'
    if (!formData.isi.trim()) newErrors.isi = 'Isi aspirasi wajib diisi'
    if (formData.isi.trim().length < 20) newErrors.isi = 'Isi aspirasi minimal 20 karakter'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitError('')
    setSubmitting(true)
    try {
      // Identitas (nama/email) TIDAK dikirim dari klien — server mengambilnya
      // dari sesi yang terverifikasi untuk mencegah pemalsuan identitas.
      const res = await fetch('/api/cms/voices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campus: formData.kampus,
          category: formData.kategori,
          subject: formData.judul,
          message: formData.isi,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        setSubmitError(data?.error || 'Gagal mengirim aspirasi. Silakan coba lagi.')
        setSubmitting(false)
        return
      }

      setSubmitting(false)
      setSubmitted(true)
    } catch {
      setSubmitError('Tidak dapat menghubungi server. Periksa koneksi Anda dan coba lagi.')
      setSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  // Saat memuat sesi, atau belum login (sedang dialihkan) — tampilkan loader.
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-sans text-stone-500">
            {status === 'unauthenticated' ? 'Mengalihkan ke halaman masuk...' : 'Memuat...'}
          </p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <NewspaperMasthead variant="white" />
        <div className="pt-32 sm:pt-36 md:pt-40" />
        <main className="flex-1 flex items-start justify-center px-4 pb-20">
          <div className="w-full max-w-lg text-center">
            <div className="bg-white border border-stone-200 rounded-sm shadow-sm px-8 py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
              <h2 className="font-serif text-2xl font-bold text-navy mb-3">Aspirasi Terkirim!</h2>
              <p className="text-sm font-sans text-stone-600 leading-relaxed mb-6">
                Aspirasi Anda telah masuk ke Meja Redaksi Suarantara dan akan ditinjau oleh tim redaksi.
                Anda dapat memantau statusnya melalui meja redaksi setelah login.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setSubmitError('')
                    setFormData({ judul: '', kategori: '', kampus: '', isi: '' })
                  }}
                  className="px-5 py-2.5 rounded-full bg-gold text-navy font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-gold-500 transition-colors cursor-pointer"
                >
                  Kirim Aspirasi Lain
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-600 font-sans text-xs hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <NewspaperMasthead variant="white" />

      {/* Spacer for fixed masthead */}
      <div className="pt-32 sm:pt-36 md:pt-40" />

      <main className="flex-1 px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Page header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-stone-300" />
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400">Surat Aspirasi</span>
            <div className="flex-1 h-px bg-stone-300" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy text-center mb-2">
            Kirim Aspirasi
          </h1>
          <p className="text-sm font-sans text-stone-500 text-center mb-8 max-w-md mx-auto">
            Sampaikan aspirasi, aduan, atau kontribusi tulisan Anda kepada redaksi Suarantara.
          </p>

          {/* User Info Card */}
          <div className="bg-white border border-stone-200 rounded-sm shadow-sm px-6 py-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold/40 shrink-0">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || ''}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-navy flex items-center justify-center text-white font-bold text-sm">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-serif font-semibold text-navy text-sm">{user?.name}</p>
                <p className="text-[11px] font-sans text-stone-500">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-[11px] font-sans text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Keluar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-sm shadow-sm">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-serif text-lg font-semibold text-navy">Formulir Aspirasi</h2>
              <p className="text-[11px] font-sans text-stone-400 mt-0.5">Semua kolom bertanda * wajib diisi</p>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Judul */}
              <div>
                <label htmlFor="judul" className="block text-xs font-sans font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Judul Aspirasi <span className="text-crimson">*</span>
                </label>
                <input
                  id="judul"
                  type="text"
                  value={formData.judul}
                  onChange={(e) => handleChange('judul', e.target.value)}
                  placeholder="Contoh: Transparansi Anggaran BEM Tahun 2026"
                  className={`w-full px-4 py-3 text-sm font-sans border rounded-sm bg-[#FAF8F5] focus:bg-white focus:outline-none transition-colors ${
                    errors.judul ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-gold'
                  }`}
                />
                {errors.judul && <p className="text-[11px] font-sans text-red-500 mt-1">{errors.judul}</p>}
              </div>

              {/* Kategori & Kampus side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Kategori */}
                <div>
                  <label htmlFor="kategori" className="block text-xs font-sans font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Kategori <span className="text-crimson">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="kategori"
                      value={formData.kategori}
                      onChange={(e) => handleChange('kategori', e.target.value)}
                      className={`w-full px-4 py-3 text-sm font-sans border rounded-sm bg-[#FAF8F5] focus:bg-white focus:outline-none appearance-none transition-colors ${
                        errors.kategori ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-gold'
                      } ${!formData.kategori ? 'text-stone-400' : 'text-stone-900'}`}
                    >
                      <option value="" disabled>Pilih kategori...</option>
                      {KATEGORI_OPTIONS.map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.kategori && <p className="text-[11px] font-sans text-red-500 mt-1">{errors.kategori}</p>}
                </div>

                {/* Kampus */}
                <div>
                  <label htmlFor="kampus" className="block text-xs font-sans font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Kampus Asal <span className="text-crimson">*</span>
                  </label>
                  <input
                    id="kampus"
                    type="text"
                    value={formData.kampus}
                    onChange={(e) => handleChange('kampus', e.target.value)}
                    placeholder="Contoh: STMIK Jayakarta"
                    className={`w-full px-4 py-3 text-sm font-sans border rounded-sm bg-[#FAF8F5] focus:bg-white focus:outline-none transition-colors ${
                      errors.kampus ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-gold'
                    }`}
                  />
                  {errors.kampus && <p className="text-[11px] font-sans text-red-500 mt-1">{errors.kampus}</p>}
                </div>
              </div>

              {/* Isi Aspirasi */}
              <div>
                <label htmlFor="isi" className="block text-xs font-sans font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Isi Aspirasi <span className="text-crimson">*</span>
                </label>
                <textarea
                  id="isi"
                  value={formData.isi}
                  onChange={(e) => handleChange('isi', e.target.value)}
                  placeholder="Tuliskan aspirasi, aduan, atau masukan Anda secara detail..."
                  rows={7}
                  className={`w-full px-4 py-3 text-sm font-sans border rounded-sm bg-[#FAF8F5] focus:bg-white focus:outline-none resize-y transition-colors leading-relaxed ${
                    errors.isi ? 'border-red-400 focus:border-red-500' : 'border-stone-300 focus:border-gold'
                  }`}
                />
                <div className="flex justify-between mt-1">
                  {errors.isi && <p className="text-[11px] font-sans text-red-500">{errors.isi}</p>}
                  <p className="text-[10px] font-sans text-stone-400 ml-auto">{formData.isi.length} karakter</p>
                </div>
              </div>

              {submitError && (
                <div className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3.5 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] font-sans text-red-700 leading-relaxed">{submitError}</p>
                </div>
              )}
            </div>

            {/* Submit Area */}
            <div className="px-6 py-5 border-t border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[10px] font-sans text-stone-400 text-center sm:text-left">
                Aspirasi akan tersimpan di Meja Redaksi dan ditinjau oleh tim redaksi.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gold hover:bg-gold-500 text-navy font-bold text-sm uppercase tracking-wider shadow-sm active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Mengirim...' : 'Kirim Aspirasi'}
              </button>
            </div>
          </form>

          {/* Bottom ornament */}
          <div className="flex items-center gap-3 mt-10">
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
