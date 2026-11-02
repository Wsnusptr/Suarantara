'use client'

import { useEffect, useRef } from 'react'

export function VantaTopologyBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let vantaEffect: any = null

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`)
        if (existing) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = (e) => reject(e)
        document.head.appendChild(script)
      })
    }

    const initVanta = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/p5.min.js')
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js')

        if (
          typeof window !== 'undefined' &&
          (window as any).VANTA &&
          (window as any).VANTA.TOPOLOGY &&
          vantaRef.current
        ) {
          vantaEffect = (window as any).VANTA.TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            // Sesuai instruksi: Background putih, garis animasi Navy (Biru Dongker) Suarantara
            color: 0x1b2d5e,
            backgroundColor: 0xffffff,
          })
        }
      } catch (err) {
        console.warn('Vanta Topology background init warning:', err)
      }
    }

    initVanta()

    return () => {
      if (vantaEffect && typeof vantaEffect.destroy === 'function') {
        vantaEffect.destroy()
      }
    }
  }, [])

  return (
    <div
      ref={vantaRef}
      // Opasitas dikurangi menjadi halus & elegan (20%-25%) agar konten utama jelas terbaca
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-20 md:opacity-25 transition-opacity duration-700"
      aria-hidden="true"
    />
  )
}
