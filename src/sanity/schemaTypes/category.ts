import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Kategori Berita & Pilar',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nama Kategori',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pillar',
      title: 'Pilar Utama',
      type: 'string',
      options: {
        list: [
          { title: 'Media (Kabar & Investigasi)', value: 'media' },
          { title: 'Advokasi (Kawal Kasus)', value: 'advokasi' },
          { title: 'Kajian (Riset & Data)', value: 'kajian' },
          { title: 'Program & Aksi', value: 'program' },
          { title: 'Mitra & Jaringan', value: 'partners' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Kategori',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pillar',
    },
  },
})
