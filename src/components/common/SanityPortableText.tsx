import React from 'react'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-slate-800 leading-relaxed text-base md:text-lg mb-5 font-sans">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1B2D5E] mt-8 mb-4 tracking-tight border-b border-stone-200 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1B2D5E] mt-6 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#D4A200] pl-5 py-3 my-6 italic font-serif text-lg text-slate-700 bg-[#FAF8F5] rounded-r border-t border-b border-r border-stone-200">
        “{children}”
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 space-y-2 mb-5 text-slate-800 text-base md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 space-y-2 mb-5 text-slate-800 text-base md:text-lg">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline decoration-[#D4A200]">{children}</span>,
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-[#C0392B] font-medium underline underline-offset-2 hover:text-[#962d22] transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const imageUrl = urlFor(value).url()
      return (
        <figure className="my-8 rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={imageUrl}
              alt={value.alt || 'Dokumentasi Berita Suarantara'}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="p-3 text-xs md:text-sm text-stone-600 font-sans italic text-center border-t border-stone-200 bg-white">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

interface SanityPortableTextProps {
  value: any
}

export default function SanityPortableText({ value }: SanityPortableTextProps) {
  if (!value) return null
  return (
    <div className="prose prose-slate max-w-none">
      <PortableText value={value} components={components} />
    </div>
  )
}
