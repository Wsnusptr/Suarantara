// ─── Firebase Cloud Messaging — pengirim server-side (HTTP v1) ───────────────
// Tanpa dependency tambahan: menandatangani JWT (RS256) memakai service account,
// menukarnya dengan access token OAuth2, lalu memanggil FCM HTTP v1.
// Bersifat "graceful": bila FIREBASE_SERVICE_ACCOUNT_BASE64 kosong, pengiriman
// dilewati tanpa membuat proses gagal.

import crypto from 'crypto'

interface ServiceAccount {
  project_id: string
  client_email: string
  private_key: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

function getServiceAccount(): ServiceAccount | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (!b64) return null
  try {
    const json = Buffer.from(b64, 'base64').toString('utf8')
    const sa = JSON.parse(json) as Partial<ServiceAccount>
    if (!sa.project_id || !sa.client_email || !sa.private_key) return null
    return {
      project_id: sa.project_id,
      client_email: sa.client_email,
      // Service account JSON menyimpan newline sebagai "\n" literal.
      private_key: sa.private_key.replace(/\\n/g, '\n'),
    }
  } catch {
    return null
  }
}

export function isFcmSenderConfigured(): boolean {
  return getServiceAccount() !== null
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.token

  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(sa.private_key)
  const jwt = `${signingInput}.${base64url(signature)}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  if (!res.ok) {
    throw new Error(`Gagal mendapatkan access token FCM (${res.status})`)
  }
  const data = (await res.json()) as { access_token: string; expires_in?: number }
  cachedToken = { token: data.access_token, expiresAt: now + (data.expires_in || 3600) }
  return data.access_token
}

export interface FcmMessage {
  title: string
  body: string
  url?: string
  data?: Record<string, string>
}

export interface SendResult {
  token: string
  ok: boolean
  error?: string
  /** Token tidak lagi valid → bisa dinonaktifkan di DB. */
  unregistered?: boolean
}

export async function sendToToken(token: string, msg: FcmMessage): Promise<SendResult> {
  const sa = getServiceAccount()
  if (!sa) return { token, ok: false, error: 'FCM pengirim belum dikonfigurasi.' }

  try {
    const accessToken = await getAccessToken(sa)
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            token,
            notification: { title: msg.title, body: msg.body },
            webpush: {
              fcm_options: msg.url ? { link: msg.url } : undefined,
              notification: { icon: '/favicon.ico', badge: '/favicon.ico' },
            },
            data: msg.data || (msg.url ? { url: msg.url } : undefined),
          },
        }),
      }
    )

    if (res.ok) return { token, ok: true }

    const errText = await res.text().catch(() => '')
    const unregistered =
      res.status === 404 ||
      /UNREGISTERED|NOT_FOUND|Requested entity was not found/i.test(errText)
    return { token, ok: false, error: errText.slice(0, 300), unregistered }
  } catch (error) {
    return { token, ok: false, error: error instanceof Error ? error.message : 'Kesalahan pengiriman FCM.' }
  }
}

/** Kirim berurutan (menghindari burst rate-limit FCM). */
export async function sendToTokens(tokens: string[], msg: FcmMessage): Promise<SendResult[]> {
  const results: SendResult[] = []
  for (const token of tokens) {
    results.push(await sendToToken(token, msg))
  }
  return results
}
