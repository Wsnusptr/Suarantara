// ─── Supabase Storage helper (REST API, tanpa dependency tambahan) ───────────
// Dipakai server-side untuk mengunggah aset gambar ke bucket Supabase Storage.
// Menggunakan SERVICE ROLE KEY (rahasia) → JANGAN pernah dipanggil dari client.
//
// Konfigurasi environment yang dibutuhkan:
//   NEXT_PUBLIC_SUPABASE_URL      → https://<ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY     → service_role JWT (RAHASIA)
//   SUPABASE_STORAGE_BUCKET       → nama bucket (default: "media")

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function getBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || 'media'
}

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
}

/** True jika MIME diizinkan sebagai gambar. */
export function isAllowedImageType(mime: string): boolean {
  return Boolean(ALLOWED_MIME[mime])
}

/** Ekstensi aman berdasarkan MIME (fallback ke nama file bila MIME tak dikenal). */
export function resolveExtension(mime: string, fileName: string): string {
  if (ALLOWED_MIME[mime]) return ALLOWED_MIME[mime]
  const match = /\.([a-z0-9]{2,5})$/i.exec(fileName)
  return match ? match[1].toLowerCase() : 'bin'
}

export interface UploadResult {
  url: string
  path: string
}

/**
 * Unggah bytes ke Supabase Storage dan kembalikan URL publik.
 * @throws Error bila konfigurasi kurang atau Supabase menolak.
 */
export async function uploadToSupabaseStorage(
  bytes: ArrayBuffer,
  mime: string,
  folder: string,
  objectName: string
): Promise<UploadResult> {
  if (!isSupabaseStorageConfigured()) {
    throw new Error('Supabase Storage belum dikonfigurasi (URL / SERVICE ROLE kosong).')
  }

  const bucket = getBucket()
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '')
  const objectPath = safeFolder ? `${safeFolder}/${objectName}` : objectName
  const endpoint = `${getBaseUrl()}/storage/v1/object/${bucket}/${objectPath}`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': mime || 'application/octet-stream',
      'Cache-Control': '31536000',
      'x-upsert': 'true',
    },
    body: bytes,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Supabase Storage menolak unggahan (${res.status}): ${detail.slice(0, 300)}`)
  }

  return {
    url: `${getBaseUrl()}/storage/v1/object/public/${bucket}/${objectPath}`,
    path: objectPath,
  }
}
