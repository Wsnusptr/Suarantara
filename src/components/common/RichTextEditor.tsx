'use client'

import { useRef, useState } from 'react'
import { Bold, Italic, Heading2, Heading3, Quote, List, ListOrdered, Link2, Image as ImageIcon, Minus, Eye, PenLine } from 'lucide-react'
import { RichText } from './RichText'

// ─── Editor Rich Text untuk CMS ──────────────────────────────────────────────
// Textarea + toolbar penanda (Markdown ringan) + pratinjau langsung.
// Hasil pratinjau memakai <RichText> yang sama dengan halaman publik,
// sehingga tampilan di CMS identik dengan hasil akhir (What You See Is What You Get).

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  /** Kelas drop cap pratinjau; disamakan dengan halaman detail berita. */
  dropCapClassName?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis naskah di sini...',
  rows = 14,
  dropCapClassName = 'first-letter:font-serif first-letter:text-5xl first-letter:font-extrabold first-letter:text-navy first-letter:float-left first-letter:mr-2 first-letter:leading-none',
}: RichTextEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [preview, setPreview] = useState(false)

  const wrapSelection = (before: string, after: string, fallback: string) => {
    const ta = ref.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = value.slice(start, end) || fallback
    const next = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      ta.focus()
      const s = start + before.length
      ta.setSelectionRange(s, s + selected.length)
    })
  }

  const prefixLine = (prefix: string) => {
    const ta = ref.current
    if (!ta) return
    const start = ta.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    onChange(next)
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + prefix.length
      ta.setSelectionRange(pos, pos)
    })
  }

  const insertBlock = (text: string) => {
    const ta = ref.current
    if (!ta) return
    const start = ta.selectionStart
    const needsLeadingBreak = start > 0 && value[start - 1] !== '\n'
    const snippet = (needsLeadingBreak ? '\n' : '') + text
    const next = value.slice(0, start) + snippet + value.slice(start)
    onChange(next)
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + snippet.length
      ta.setSelectionRange(pos, pos)
    })
  }

  const btn =
    'inline-flex items-center justify-center w-7 h-7 rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-navy hover:text-white hover:border-navy transition-colors'

  return (
    <div className="rounded-lg border border-stone-300 overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-stone-50 border-b border-stone-200">
        <button type="button" title="Tebal" onClick={() => wrapSelection('**', '**', 'teks tebal')} className={btn}>
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Miring" onClick={() => wrapSelection('*', '*', 'teks miring')} className={btn}>
          <Italic className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-5 bg-stone-300 mx-0.5" />
        <button type="button" title="Subjudul besar" onClick={() => prefixLine('## ')} className={btn}>
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Subjudul sedang" onClick={() => prefixLine('### ')} className={btn}>
          <Heading3 className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Kutipan" onClick={() => prefixLine('> ')} className={btn}>
          <Quote className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-5 bg-stone-300 mx-0.5" />
        <button type="button" title="Daftar butir" onClick={() => prefixLine('- ')} className={btn}>
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Daftar nomor" onClick={() => prefixLine('1. ')} className={btn}>
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Tautan" onClick={() => wrapSelection('[', '](https://)', 'teks tautan')} className={btn}>
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Sisipkan gambar (URL)" onClick={() => insertBlock('![keterangan](https://)\n')} className={btn}>
          <ImageIcon className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Garis pemisah" onClick={() => insertBlock('---\n')} className={btn}>
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className={`ml-auto inline-flex items-center gap-1.5 px-2.5 h-7 rounded-md text-[11px] font-serif font-bold border transition-colors ${
            preview
              ? 'bg-navy text-white border-navy'
              : 'bg-white text-stone-600 border-stone-200 hover:border-navy'
          }`}
        >
          {preview ? <PenLine className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {preview ? 'Kembali Tulis' : 'Pratinjau'}
        </button>
      </div>

      {preview ? (
        <div className="px-4 py-3 min-h-[200px] max-h-[420px] overflow-y-auto text-sm leading-relaxed text-stone-800 space-y-4">
          {value.trim() ? (
            <RichText content={value} dropCapClassName={dropCapClassName} />
          ) : (
            <p className="text-stone-400 italic text-xs font-sans">Belum ada naskah untuk dipratinjau.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={ref}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-xs font-sans leading-relaxed focus:outline-none resize-y"
        />
      )}

      <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200 text-[10px] font-sans text-stone-500">
        Pintasan: **tebal**, *miring*, ## subjudul, &gt; kutipan, - daftar, [teks](tautan). Tekan Enter dua kali untuk paragraf baru.
      </div>
    </div>
  )
}
