'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { NewspaperMasthead } from '@/components/layout/NewspaperMasthead'
import { Footer } from '@/components/layout/Footer'
import { Send, Upload, CheckCircle, LogOut, ChevronDown } from 'lucide-react'

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
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/masuk?callbackUrl=/kirim-suara')
    return null
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-sans text-stone-500">Memuat...</p>
        </div>
      </div>
    )
  }

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

    // Simpan ke database CMS internal Suarantara
    try {
      await fetch('/api/cms/voices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name || 'Mahasiswa Nusantara',
          email: user?.email || 'mahasiswa@suarantara.org',
          campus: formData.kampus,
          category: formData.kategori,
          subject: formData.judul,
          message: formData.isi,
        }),
      })
    } catch (err) {
      console.warn('Gagal menyimpan aspirasi ke DB:', err)
    }

    const message = `*ASPIRASI SUARANTARA*
━━━━━━━━━━━━━━━━━━
*Pengirim:* ${user?.name || '-'} (${user?.email || '-'})
*Kampus:* ${formData.kampus}
*Kategori:* ${formData.kategori}
*Judul:* ${formData.judul}
━━━━━━━━━━━━━━━━━━

${formData.isi}`

    const waUrl = `https://wa.me/6285286140817?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
    setSubmitted(true)
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
                Pesan aspirasi Anda telah diarahkan ke WhatsApp redaksi Suarantara.
                Pastikan pesan terkirim di WhatsApp untuk memastikan aspirasi diterima.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
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

              {/* Lampiran (opsional) */}
              <div>
                <label className="block text-xs font-sans font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Lampiran <span className="text-stone-400 normal-case tracking-normal font-normal">(opsional)</span>
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-sm p-6 text-center hover:border-gold/60 transition-colors bg-[#FAF8F5]">
                  <Upload className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs font-sans text-stone-500">
                    Seret file ke sini atau <span className="text-gold font-medium cursor-pointer hover:underline">pilih file</span>
                  </p>
                  <p className="text-[10px] font-sans text-stone-400 mt-1">PDF, JPG, PNG (maks. 5MB)</p>
                </div>
              </div>
            </div>

            {/* Submit Area */}
            <div className="px-6 py-5 border-t border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[10px] font-sans text-stone-400 text-center sm:text-left">
                Aspirasi akan dikirim melalui WhatsApp ke redaksi Suarantara.
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gold hover:bg-gold-500 text-navy font-bold text-sm uppercase tracking-wider shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Kirim Aspirasi
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
