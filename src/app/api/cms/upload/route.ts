import { NextRequest, NextResponse } from 'next/server'
import {
  requireStaff,
  unauthorized,
  badRequest,
  getClientIp,
  rateLimit,
  tooManyRequests,
  serverError,
  cleanString,
} from '@/lib/api-guard'
import {
  isSupabaseStorageConfigured,
  isAllowedImageType,
  resolveExtension,
  uploadToSupabaseStorage,
  MAX_UPLOAD_BYTES,
} from '@/lib/supabase/storage'

// ─── Unggah aset gambar ke Supabase Storage (server-side, SERVICE ROLE) ───────
// Hanya staf redaksi. Rate limit ketat. Validasi tipe & ukuran berkas.
// multipart/form-data: field "file" (wajib), "folder" (opsional: articles|programs|partners|reels).

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_FOLDERS = ['articles', 'programs', 'partners', 'reels', 'misc'] as const

export async function POST(req: NextRequest) {
  const staff = await requireStaff()
  if (!staff) return unauthorized('Hanya staf redaksi yang dapat mengunggah gambar.')

  if (!isSupabaseStorageConfigured()) {
    return serverError(
      'Penyimpanan gambar belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`cms:upload:${ip}`, 30, 60 * 1000)
    if (!rl.ok) return tooManyRequests(rl.retryAfter)

    const form = await req.formData().catch(() => null)
    if (!form) return badRequest('Format unggahan tidak valid.')

    const file = form.get('file')
    if (!(file instanceof File)) return badRequest('Berkas gambar wajib disertakan.')

    if (file.size <= 0) return badRequest('Berkas kosong.')
    if (file.size > MAX_UPLOAD_BYTES) {
      return badRequest(`Ukuran berkas melebihi batas ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MB.`)
    }
    if (!isAllowedImageType(file.type)) {
      return badRequest('Tipe berkas tidak didukung. Gunakan JPG, PNG, WEBP, GIF, AVIF, atau SVG.')
    }

    const folderRaw = cleanString(form.get('folder'), 40) || 'misc'
    const folder = (ALLOWED_FOLDERS as readonly string[]).includes(folderRaw) ? folderRaw : 'misc'

    const ext = resolveExtension(file.type, file.name || '')
    const random = Math.random().toString(36).slice(2, 10)
    const objectName = `${Date.now()}-${random}.${ext}`

    const bytes = await file.arrayBuffer()
    const { url, path } = await uploadToSupabaseStorage(bytes, file.type, folder, objectName)

    return NextResponse.json({ success: true, url, path })
  } catch (error) {
    console.error('Failed to upload image:', error)
    const message = error instanceof Error ? error.message : 'Gagal mengunggah gambar.'
    return serverError(message.slice(0, 300))
  }
}
