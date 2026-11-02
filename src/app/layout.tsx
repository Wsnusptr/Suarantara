import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/AuthProvider'
import PushNotificationPrompt from '@/components/common/PushNotificationPrompt'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SUARANTARA — Suara Aspirasi dan Representasi Mahasiswa Nusantara',
    template: '%s | SUARANTARA',
  },
  description:
    'SUARANTARA adalah organisasi mahasiswa yang berfokus pada tiga pilar: Media, Advokasi, dan Kajian untuk representasi mahasiswa Nusantara.',
  keywords: ['SUARANTARA', 'mahasiswa', 'aspirasi', 'advokasi', 'media', 'kajian', 'nusantara'],
  applicationName: 'SUARANTARA',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'SUARANTARA',
    url: SITE_URL,
    images: [{ url: '/tentang-kami-mahasiswa.jpeg', width: 1200, height: 630, alt: 'SUARANTARA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUARANTARA',
    description:
      'Media, Advokasi, dan Kajian untuk representasi mahasiswa Nusantara.',
    images: ['/tentang-kami-mahasiswa.jpeg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
          <PushNotificationPrompt />
        </AuthProvider>
      </body>
    </html>
  )
}
