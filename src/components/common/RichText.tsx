'use client'

import { Fragment, type ReactNode } from 'react'

// ─── Renderer Rich Text ringan & aman ────────────────────────────────────────
// Mengubah naskah CMS (subset Markdown) menjadi elemen React tanpa HTML mentah.
// Mendukung: paragraf, ## H2, ### H3, > kutipan, - / * bullet, 1. nomor,
// --- garis pemisah, ![alt](url) gambar, **tebal**, *miring*, `kode`,
// [teks](tautan). Tidak memakai dangerouslySetInnerHTML (bebas XSS).

type Block =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'hr' }
  | { kind: 'image'; alt: string; src: string }

const URL_RE = /^(https?:\/\/|\/|#|mailto:)/i

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  if (/^\s*javascript:/i.test(trimmed) || /^\s*data:/i.test(trimmed)) return false
  return URL_RE.test(trimmed)
}

/** Tokenisasi inline: **tebal**, *miring*, _miring_, `kode`, [teks](url). */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const pattern =
    /(\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    const token = match[0]
    const key = `${keyPrefix}-i${i++}`

    if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      nodes.push(
        <code key={key} className="px-1.5 py-0.5 rounded bg-stone-100 text-navy font-mono text-[0.9em]">
          {token.slice(1, -1)}
        </code>
      )
    } else if (token.startsWith('[')) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token)
      const label = m?.[1] ?? ''
      const href = m?.[2] ?? ''
      if (m && isSafeUrl(href)) {
        nodes.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy font-semibold underline decoration-gold decoration-2 underline-offset-2 hover:text-crimson transition-colors"
          >
            {label}
          </a>
        )
      } else {
        nodes.push(token)
      }
    } else {
      const inner = token.slice(1, -1)
      nodes.push(<em key={key}>{inner}</em>)
    }
    lastIndex = pattern.lastIndex
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

/** Parse naskah menjadi blok-blok terstruktur. */
function parseBlocks(raw: string): Block[] {
  const lines = raw.replace(/\r\n?/g, '\n').split('\n')
  const blocks: Block[] = []
  let para: string[] = []
  let list: { ordered: boolean; items: string[] } | null = null

  const flushPara = () => {
    if (para.length) {
      blocks.push({ kind: 'paragraph', text: para.join('\n') })
      para = []
    }
  }
  const flushList = () => {
    if (list) {
      blocks.push({ kind: 'list', ordered: list.ordered, items: list.items })
      list = null
    }
  }
  const flushAll = () => {
    flushPara()
    flushList()
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '')

    if (!line.trim()) {
      flushAll()
      continue
    }

    // Garis pemisah
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flushAll()
      blocks.push({ kind: 'hr' })
      continue
    }

    // Gambar berdiri sendiri
    const img = /^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(line)
    if (img) {
      flushAll()
      if (isSafeUrl(img[2])) blocks.push({ kind: 'image', alt: img[1], src: img[2] })
      continue
    }

    // Heading
    const h2 = /^\s*##\s+(.*)$/.exec(line)
    if (h2 && !/^\s*###/.test(line)) {
      flushAll()
      blocks.push({ kind: 'heading', level: 2, text: h2[1].trim() })
      continue
    }
    const h3 = /^\s*###\s+(.*)$/.exec(line)
    if (h3) {
      flushAll()
      blocks.push({ kind: 'heading', level: 3, text: h3[1].trim() })
      continue
    }

    // Kutipan
    const quote = /^\s*>\s?(.*)$/.exec(line)
    if (quote) {
      flushAll()
      blocks.push({ kind: 'quote', text: quote[1].trim() })
      continue
    }

    // Bullet list
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      flushPara()
      if (!list || list.ordered) {
        flushList()
        list = { ordered: false, items: [] }
      }
      list.items.push(bullet[1].trim())
      continue
    }

    // Numbered list
    const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line)
    if (numbered) {
      flushPara()
      if (!list || !list.ordered) {
        flushList()
        list = { ordered: true, items: [] }
      }
      list.items.push(numbered[1].trim())
      continue
    }

    // Paragraf biasa
    flushList()
    para.push(line)
  }

  flushAll()
  return blocks
}

export interface RichTextProps {
  content: string
  className?: string
  /** Kelas drop cap (huruf pertama besar) untuk paragraf pertama. */
  dropCapClassName?: string
}

export function RichText({ content, className = '', dropCapClassName = '' }: RichTextProps) {
  const raw = String(content || '').trim()
  if (!raw) return null

  const blocks = parseBlocks(raw)
  let paragraphSeen = false

  return (
    <div className={className}>
      {blocks.map((block, idx) => {
        const key = `b-${idx}`
        switch (block.kind) {
          case 'heading':
            return block.level === 2 ? (
              <h2
                key={key}
                className="font-serif font-bold text-xl sm:text-2xl text-navy mt-7 mb-2 leading-snug"
              >
                {renderInline(block.text, key)}
              </h2>
            ) : (
              <h3
                key={key}
                className="font-serif font-bold text-lg sm:text-xl text-navy mt-5 mb-1.5 leading-snug"
              >
                {renderInline(block.text, key)}
              </h3>
            )
          case 'quote':
            return (
              <blockquote
                key={key}
                className="border-l-4 border-gold bg-gold/5 pl-4 py-2 my-4 font-serif italic text-stone-700 text-base sm:text-lg"
              >
                {renderInline(block.text, key)}
              </blockquote>
            )
          case 'hr':
            return <hr key={key} className="border-0 border-t border-stone-300 my-6" />
          case 'image':
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={key}
                src={block.src}
                alt={block.alt}
                loading="lazy"
                className="w-full rounded-lg border border-stone-200 my-4"
              />
            )
          case 'list':
            return block.ordered ? (
              <ol key={key} className="list-decimal pl-6 space-y-1.5 my-3">
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
                ))}
              </ol>
            ) : (
              <ul key={key} className="list-disc pl-6 space-y-1.5 my-3">
                {block.items.map((item, i) => (
                  <li key={`${key}-${i}`}>{renderInline(item, `${key}-${i}`)}</li>
                ))}
              </ul>
            )
          case 'paragraph': {
            const isFirst = !paragraphSeen
            paragraphSeen = true
            return (
              <p
                key={key}
                className={`text-justify whitespace-pre-line ${isFirst ? dropCapClassName : ''}`}
              >
                {renderInline(block.text, key)}
              </p>
            )
          }
          default:
            return <Fragment key={key} />
        }
      })}
    </div>
  )
}
