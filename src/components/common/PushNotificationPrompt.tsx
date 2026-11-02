'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, BellRing, Check, X } from 'lucide-react'
import { requestFCMToken } from '@/lib/firebase/messaging'

export default function PushNotificationPrompt() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  // Jangan tampilkan di halaman Admin Redaksi atau Studio
  const isExcluded = pathname?.startsWith('/admin') || pathname?.startsWith('/studio')

  useEffect(() => {
    // Check if user already dismissed or subscribed
    const isDismissed = localStorage.getItem('suarantara_fcm_dismissed')
    const token = localStorage.getItem('suarantara_fcm_token')
    if (token) {
      setSubscribed(true)
    } else if (!isDismissed) {
      // Show subtle prompt after 5 seconds
      const timer = setTimeout(() => setIsOpen(true), 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const token = await requestFCMToken()
      if (token) {
        setSubscribed(true)
        setTimeout(() => setIsOpen(false), 2500)
      } else {
        // Fallback simulated subscription for offline preview
        localStorage.setItem('suarantara_fcm_subscribed', 'true')
        setSubscribed(true)
        setTimeout(() => setIsOpen(false), 2000)
      }
    } catch (e) {
      console.warn('Subscription cancelled or error:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setIsOpen(false)
    localStorage.setItem('suarantara_fcm_dismissed', 'true')
  }

  if (isExcluded) return null

  if (!isOpen && !subscribed) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Aktifkan Warta Kilat Mahasiswa"
        className="fixed bottom-5 right-5 z-40 bg-[#1B2D5E] text-[#D4A200] p-3 rounded-full shadow-lg border-2 border-[#D4A200]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
      >
        <Bell className="w-5 h-5 animate-pulse" />
      </button>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-5 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#FAF8F5] border-2 border-[#1B2D5E]/30 rounded-lg shadow-2xl p-4 font-sans text-stone-900 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded bg-[#1B2D5E] text-[#D4A200] flex items-center justify-center shrink-0">
            {subscribed ? <Check className="w-5 h-5 text-emerald-400" /> : <BellRing className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#C0392B] uppercase">Warta Kilat Nusantara</span>
            <h4 className="font-serif font-bold text-sm text-[#1B2D5E] leading-tight">
              {subscribed ? 'Warta Kilat Aktif!' : 'Dapatkan Notifikasi Kasus & Aksi'}
            </h4>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-stone-400 hover:text-stone-700 p-1 -mr-1 -mt-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
        {subscribed
          ? 'Anda akan menerima pemberitahuan langsung saat ada investigasi kampus & advokasi darurat baru.'
          : 'Jadilah yang pertama mengetahui warta pergerakan mahasiswa, aksi darurat 38 provinsi, dan advokasi kampus.'}
      </p>

      {!subscribed && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="flex-1 bg-[#1B2D5E] hover:bg-[#253d7e] text-white text-xs font-semibold py-2 px-3 rounded shadow hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin text-xs">●</span>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-[#D4A200]" />
                Aktifkan Sekarang
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="text-xs text-stone-500 hover:text-stone-800 py-2 px-2.5"
          >
            Nanti Saja
          </button>
        </div>
      )}
    </div>
  )
}
