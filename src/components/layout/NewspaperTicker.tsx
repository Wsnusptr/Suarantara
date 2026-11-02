'use client'

import { useState, useEffect, useCallback } from 'react'
import { Radio } from 'lucide-react'

interface NewspaperTickerProps {
  isDark?: boolean
}

export function NewspaperTicker({ isDark = true }: NewspaperTickerProps) {
  const [headlineList, setHeadlineList] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Sinkronisasi dinamis dari CMS Database (/api/cms/ticker)
  useEffect(() => {
    fetch('/api/cms/ticker')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items && data.items.length > 0) {
          setHeadlineList(data.items.map((i: any) => i.text))
        }
      })
      .catch(() => {})
  }, [])

  const typeSpeed = 35
  const deleteSpeed = 18
  const pauseDuration = 2500

  const tick = useCallback(() => {
    if (headlineList.length === 0) return
    const fullText = headlineList[currentIndex % headlineList.length] || ''

    if (isPaused) return

    if (!isDeleting) {
      // Typing
      const nextText = fullText.substring(0, displayText.length + 1)
      setDisplayText(nextText)

      if (nextText === fullText) {
        // Finished typing, pause before deleting
        setIsPaused(true)
        setTimeout(() => {
          setIsPaused(false)
          setIsDeleting(true)
        }, pauseDuration)
      }
    } else {
      // Deleting
      const nextText = fullText.substring(0, displayText.length - 1)
      setDisplayText(nextText)

      if (nextText === '') {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % headlineList.length)
      }
    }
  }, [currentIndex, displayText, headlineList, isDeleting, isPaused])

  useEffect(() => {
    const speed = isDeleting ? deleteSpeed : typeSpeed
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting])

  return (
    <div className="flex items-center gap-2 overflow-hidden w-full select-none">
      {/* Icon Radio */}
      <div className="flex items-center justify-center shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/20 border border-red-500/60 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
        <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
      </div>

      {/* Typewriter Text */}
      <div className="relative flex-1 min-w-0 overflow-hidden">
        <p
          className={`text-[10px] sm:text-xs font-sans font-medium drop-shadow-xs truncate whitespace-nowrap ${
            isDark ? 'text-stone-200' : 'text-stone-800'
          }`}
          suppressHydrationWarning
        >
          {displayText}
          <span className="inline-block w-[2px] h-[12px] bg-gold ml-0.5 align-middle animate-blink" />
        </p>
      </div>
    </div>
  )
}
