import { defineField, defineType } from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Penulis & Redaksi',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Lengkap',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / URL',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Jabatan / Posisi Redaksi',
      type: 'string',
      description: 'Contoh: Pemimpin Redaksi, Jurnalis Investigasi, Kontributor Daerah',
    }),
    defineField({
      name: 'campus',
      title: 'Asal Kampus / Lembaga',
      type: 'string',
      description: 'Contoh: Universitas Indonesia, UGM, Unhas, Unand',
    }),
    defineField({
      name: 'avatar',
      title: 'Foto Profil',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Biografi Singkat',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
    },
  },
})
