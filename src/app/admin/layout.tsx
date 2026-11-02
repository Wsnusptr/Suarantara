import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

const STAFF_ROLES = new Set([
  'ADMIN',
  'SUPERADMIN',
  'PEMRED',
  'EDITOR_MEDIA',
  'TIM_ADVOKASI',
  'TIM_RISET',
  'HUMAS_MITRA',
])

// Guard server-side untuk meja redaksi. Middleware hanya menyaring keberadaan
// cookie; di sini sesi diverifikasi dan peran dipastikan staf. Non-staf diarahkan
// kembali ke halaman masuk.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!session?.user || !STAFF_ROLES.has(role || '')) {
    redirect('/masuk?callbackUrl=/admin')
  }

  return <>{children}</>
}
