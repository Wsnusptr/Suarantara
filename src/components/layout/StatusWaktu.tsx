'use client'

import { useEffect, useState } from 'react'
import { Clock, CloudSun, Sunrise } from 'lucide-react'

interface StatusWaktuProps {
  isDark?: boolean
}

export function StatusWaktu({ isDark = true }: StatusWaktuProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [wibTime, setWibTime] = useState<string>('')
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('')
  const [prayerInfo, setPrayerInfo] = useState<{ label: string; time: string }>({
    label: 'Subuh',
    time: '04:15 WIB',
  })

  // Format real-time date & time according to WIB (Asia/Jakarta)
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()

      // Format Date in Indonesian classic style
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
      const dateStr = new Intl.DateTimeFormat('id-ID', dateOptions).format(now)
      setCurrentDateFormatted(dateStr)

      // Time formatter
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      setWibTime(`${new Intl.DateTimeFormat('id-ID', timeOptions).format(now)} WIB`)

      // Calculate upcoming prayer time in WIB
      const hour = parseInt(
        new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          hour12: false,
        }).format(now),
        10
      )
      const minute = parseInt(
        new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          minute: '2-digit',
        }).format(now),
        10
      )
      const totalMinutes = hour * 60 + minute

      if (totalMinutes < 4 * 60 + 15) {
        setPrayerInfo({ label: 'Subuh', time: '04:15 WIB' })
      } else if (totalMinutes < 11 * 60 + 44) {
        setPrayerInfo({ label: 'Dzuhur', time: '11:44 WIB' })
      } else if (totalMinutes < 15 * 60 + 2) {
        setPrayerInfo({ label: 'Ashar', time: '15:02 WIB' })
      } else if (totalMinutes < 17 * 60 + 54) {
        setPrayerInfo({ label: 'Maghrib', time: '17:54 WIB' })
      } else if (totalMinutes < 19 * 60 + 5) {
        setPrayerInfo({ label: 'Isya', time: '19:05 WIB' })
      } else {
        setPrayerInfo({ label: 'Subuh Besok', time: '04:15 WIB' })
      }
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Smooth fade cycle every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % 3)
        setIsVisible(true)
      }, 350)
    }, 3800)

    return () => clearInterval(interval)
  }, [])

  const statusItems = [
    {
      id: 'prayer',
      icon: <Sunrise className="w-3.5 h-3.5 text-gold shrink-0 drop-shadow-xs" />,
      text: `${prayerInfo.label}: ${prayerInfo.time}`,
    },
    {
      id: 'weather',
      icon: <CloudSun className="w-3.5 h-3.5 text-sky-400 shrink-0 drop-shadow-xs" />,
      text: 'Nusantara • 29°C Cerah Berawan',
    },
    {
      id: 'clock',
      icon: <Clock className="w-3.5 h-3.5 text-crimson-300 shrink-0 drop-shadow-xs" />,
      text: wibTime || '--:--:-- WIB',
    },
  ]

  const activeStatus = statusItems[currentSlide]

  return (
    <div
      className={`flex items-center justify-end gap-2.5 text-2xs md:text-xs font-sans tracking-tight ${
        isDark ? 'text-stone-300' : 'text-stone-700'
      }`}
    >
      {/* Tanggal Otomatis (Berada bersama status waktu di kanan) */}
      <div
        className={`hidden lg:flex items-center gap-1.5 pr-2.5 border-r font-serif font-medium ${
          isDark ? 'border-white/20 text-stone-300' : 'border-navy/20 text-stone-600'
        }`}
      >
        <span className="capitalize" suppressHydrationWarning>{currentDateFormatted || 'Memuat tanggal...'}</span>
      </div>

      {/* Widget Status Waktu (Solat WIB, Cuaca, Jam) dengan Efek Transisi Pudar */}
      <div className="flex items-center gap-1.5 min-w-[160px] sm:min-w-[180px] justify-end">
        <div
          className={`flex items-center gap-1.5 transition-all duration-300 ease-in-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          {activeStatus.icon}
          <span
            suppressHydrationWarning
            className={`font-semibold whitespace-nowrap text-[11px] md:text-xs ${
              isDark ? 'text-white drop-shadow-xs' : 'text-stone-900'
            }`}
          >
            {activeStatus.text}
          </span>
        </div>
      </div>
    </div>
  )
}
