import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { isStaffRole } from '@/auth.config'
import { AccessDenied } from '@/components/layout/AccessDenied'

// Guard server-side untuk meja redaksi. Middleware hanya menyaring keberadaan
// cookie; di sini sesi diverifikasi dan peran dipastikan staf.
//
//   • Belum login  → arahkan ke /masuk (bawa callbackUrl).
//   • Sudah login tapi bukan staf → tampilkan "Akses Ditolak" (TANPA redirect,
//     agar tidak terjadi loop /masuk -> /admin -> /masuk).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user as { role?: string; email?: string | null } | undefined

  if (!session?.user) {
    redirect('/masuk?callbackUrl=/admin')
  }

  if (!isStaffRole(user?.role)) {
    return <AccessDenied email={user?.email} area="Meja Redaksi (CMS)" />
  }

  return <>{children}</>
}
