import { defineArrayMember, defineField, defineType } from 'sanity'

export const advocacyDocType = defineType({
  name: 'advokasiLaporan',
  title: 'Laporan Investigasi Advokasi',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Kasus / Advokasi',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caseCode',
      title: 'Kode Registrasi Kasus',
      type: 'string',
      description: 'Contoh: ADV-2026-001',
    }),
    defineField({
      name: 'campus',
      title: 'Kampus / Lembaga Terkait',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status Penanganan',
      type: 'string',
      options: {
        list: [
          { title: 'Investigasi Lapangan', value: 'Investigasi' },
          { title: 'Mediasi Kampus', value: 'Mediasi' },
          { title: 'Audiensi Rektorat / Kementerian', value: 'Audiensi' },
          { title: 'Eskalasi Hukum', value: 'Eskalasi' },
          { title: 'Selesai & Menang', value: 'Selesai' },
        ],
      },
    }),
    defineField({
      name: 'timeline',
      title: 'Kronologi Kronologis',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'date', title: 'Tanggal', type: 'string' }),
            defineField({ name: 'stage', title: 'Tahapan', type: 'string' }),
            defineField({ name: 'summary', title: 'Rangkuman Peristiwa', type: 'text' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Naskah Investigasi Lengkap',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
  ],
})
