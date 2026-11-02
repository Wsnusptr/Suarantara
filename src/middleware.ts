import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Gerbang akses tingkat edge untuk area terbatas (UX + lapisan pertama).
// Penegakan sesi & peran yang sesungguhnya dilakukan di:
//   1) src/app/admin/layout.tsx (guard server-side untuk meja redaksi)
//   2) src/lib/api-guard.ts pada setiap rute tulis (requireStaff).
// Middleware ini hanya memastikan tidak ada permintaan anonim yang lolos ke
// halaman terbatas tanpa sesi sama sekali.
const PROTECTED_PREFIXES = ['/admin', '/kirim-suara', '/studio']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  if (!isProtected) return NextResponse.next()

  const sessionToken =
    req.cookies.get('authjs.session-token') ||
    req.cookies.get('__Secure-authjs.session-token') ||
    req.cookies.get('next-auth.session-token') ||
    req.cookies.get('__Secure-next-auth.session-token')

  if (!sessionToken) {
    const signInUrl = new URL('/masuk', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/kirim-suara/:path*', '/studio/:path*'],
}
