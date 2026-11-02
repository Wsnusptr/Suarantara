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

const SITE_DESCRIPTION =
  'SUARANTARA adalah portal digital mahasiswa yang berfokus pada tiga pilar: Media, Advokasi, dan Kajian untuk representasi mahasiswa Nusantara.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SUARANTARA — Suara Aspirasi dan Representasi Mahasiswa Nusantara',
    template: '%s | SUARANTARA',
  },
  description: SITE_DESCRIPTION,
  keywords: ['SUARANTARA', 'mahasiswa', 'aspirasi', 'advokasi', 'media', 'kajian', 'nusantara'],
  applicationName: 'SUARANTARA',
  authors: [{ name: 'Suarantara' }],
  creator: 'Suarantara',
  publisher: 'Suarantara',
  icons: {
    icon: [{ url: '/favicon.jpeg', type: 'image/jpeg' }],
    shortcut: ['/favicon.jpeg'],
    apple: [{ url: '/logo-Suarantara.png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'SUARANTARA',
    url: SITE_URL,
    title: 'SUARANTARA — Suara Aspirasi dan Representasi Mahasiswa Nusantara',
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/logo-Suarantara.png',
        width: 550,
        height: 244,
        alt: 'Logo SUARANTARA',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUARANTARA — Suara Aspirasi dan Representasi Mahasiswa Nusantara',
    description:
      'Media, Advokasi, dan Kajian untuk representasi mahasiswa Nusantara.',
    images: ['/logo-Suarantara.png'],
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
