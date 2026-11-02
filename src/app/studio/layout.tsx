import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { isStaffRole } from '@/auth.config'
import { AccessDenied } from '@/components/layout/AccessDenied'

// Sanity Studio menulis langsung ke dataset — hanya staf redaksi yang boleh.
//   • Belum login → /masuk?callbackUrl=/studio
//   • Sudah login tapi bukan staf → "Akses Ditolak" (tanpa redirect, anti-loop)
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user as { role?: string; email?: string | null } | undefined

  if (!session?.user) {
    redirect('/masuk?callbackUrl=/studio')
  }

  if (!isStaffRole(user?.role)) {
    return <AccessDenied email={user?.email} area="Sanity Studio" />
  }

  return <>{children}</>
}
