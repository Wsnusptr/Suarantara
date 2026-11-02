import { defineArrayMember, defineField, defineType } from 'sanity'

export const articleType = defineType({
  name: 'artikel',
  title: 'Artikel & Warta Nusantara',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Berita / Tajuk Rencana',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(180),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / URL Artikel',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 120,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pillar',
      title: 'Pilar Suarantara',
      type: 'string',
      options: {
        list: [
          { title: 'Media (Kabar Kampus & Investigasi)', value: 'media' },
          { title: 'Advokasi (Pendampingan & Hak Mahasiswa)', value: 'advokasi' },
          { title: 'Kajian (Riset Kebijakan & Opini)', value: 'kajian' },
          { title: 'Program (Gerakan & Pelatihan)', value: 'program' },
          { title: 'Mitra (Jaringan BEM & Organisasi)', value: 'partners' },
        ],
        layout: 'radio',
      },
      initialValue: 'media',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori / Rubrik',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'author',
      title: 'Penulis / Jurnalis',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Waktu Terbit',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Gambar Utama (Cover)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'caption',
          title: 'Keterangan Foto / Sumber',
          type: 'string',
        }),
        defineField({
          name: 'alt',
          title: 'Teks Aksesibilitas (Alt Text)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan Berita (Lead / Excerpt)',
      type: 'text',
      rows: 3,
      description: 'Ditampilkan di kartu berita halaman depan dan cuplikan media sosial.',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'readingTime',
      title: 'Estimasi Waktu Baca',
      type: 'string',
      initialValue: '4 min',
      description: 'Contoh: 3 min, 5 min',
    }),
    defineField({
      name: 'region',
      title: 'Wilayah / Provinsi Terkait',
      type: 'string',
      description: 'Contoh: Nasional, Jawa Barat, Sulawesi Selatan, Papua Tengah',
      initialValue: 'Nasional',
    }),
    defineField({
      name: 'tags',
      title: 'Label / Tagar Berita',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'isFeatured',
      title: 'Sorotan Utama (Headline)',
      type: 'boolean',
      initialValue: false,
      description: 'Centang jika artikel ini menjadi berita utama di bagian atas portal.',
    }),
    defineField({
      name: 'isBreaking',
      title: 'Breaking News Ticker',
      type: 'boolean',
      initialValue: false,
      description: 'Centang jika ingin muncul di ticker berjalan warta mendesak.',
    }),
    defineField({
      name: 'body',
      title: 'Naskah Lengkap Berita (Body Content)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Paragraf Normal', value: 'normal' },
            { title: 'Subjudul Besar (H2)', value: 'h2' },
            { title: 'Subjudul Sedang (H3)', value: 'h3' },
            { title: 'Kutipan Editorial (Blockquote)', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet List', value: 'bullet' },
            { title: 'Numbered List', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Tebal (Strong)', value: 'strong' },
              { title: 'Miring (Emphasis)', value: 'em' },
              { title: 'Garis Bawah (Underline)', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Tautan URL',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL Tujuan',
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Keterangan Foto',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Deskripsi Gambar',
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
      pillar: 'pillar',
    },
    prepare(selection) {
      const { author, pillar } = selection
      return {
        ...selection,
        subtitle: `${pillar?.toUpperCase() || 'BERITA'} • ${author || 'Redaksi Suarantara'}`,
      }
    },
  },
})
