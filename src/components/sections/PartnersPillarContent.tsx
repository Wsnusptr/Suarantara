'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  FileText,
  Mail,
  Phone,
  Globe,
  Tag,
} from 'lucide-react'
import { useContactModal } from '@/hooks/useContactModal'
import { EmptyState } from '@/components/common/EmptyState'

// Struktur data mitra yang dirancang rapi dan modular (Fondasi CMS-Ready)
export interface PartnerProfile {
  id: string
  code: string
  name: string
  shortName: string
  category: string
  joinDate: string
  status: 'Aktif & Terverifikasi' | 'Menunggu Verifikasi'
  badgeType: 'Mitra Pendiri' | 'Mitra Kampus' | 'Mitra Riset' | 'Mitra Pers'
  campus: {
    fullName: string
    shortName: string
    address: string
    city: string
    province: string
    website: string
  }
  leadership: {
    presma: string
    presmaTitle: string
    wapresma: string
    wapresmaTitle: string
    cabinetName: string
    period: string
  }
  collaborationScopes: string[]
  quote: string
  logo: string
  stats: {
    studentsRepresented: string
    casesHandled: string
    papersContributed: string
  }
}

export function PartnersPillarContent() {
  const { openContact } = useContactModal()
  const [partnerList, setPartnerList] = useState<PartnerProfile[]>([])

  // Sinkronisasi dinamis dari CMS Database
  useEffect(() => {
    fetch('/api/cms/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.partners && data.partners.length > 0) {
          const mapped: PartnerProfile[] = data.partners.map((p: any) => ({
            id: p.id,
            code: p.partnerCode || 'PTR-000',
            name: p.name,
            shortName: p.shortName || p.name,
            category: p.category || 'Organisasi Mahasiswa',
            joinDate: p.joinDate || '15 Oktober 2026',
            status: (p.status as any) || 'Aktif & Terverifikasi',
            badgeType: (p.badgeType as any) || 'Mitra Kampus',
            campus: {
              fullName: p.campusFullName || p.name,
              shortName: p.campusShortName || p.shortName || p.name,
              address: p.campusAddress || 'Sekretariat BEM',
              city: p.campusCity || 'Jakarta',
              province: p.campusProvince || 'DKI Jakarta',
              website: p.campusWebsite || 'https://suarantara.org',
            },
            leadership: {
              presma: p.presmaName || 'Presiden Mahasiswa',
              presmaTitle: p.presmaTitle || 'Presiden Mahasiswa',
              wapresma: p.wapresmaName || 'Wakil Presiden Mahasiswa',
              wapresmaTitle: p.wapresmaTitle || 'Wakil Presiden Mahasiswa',
              cabinetName: p.cabinetName || 'Kabinet Perjuangan',
              period: p.periodYear || '2026 / 2027',
            },
            collaborationScopes:
              typeof p.collaborationScopes === 'string'
                ? JSON.parse(p.collaborationScopes || '[]')
                : p.collaborationScopes || [],
            quote: p.officialQuote || '',
            logo: p.logoUrl || '/partners/bem-stmik-jayakarta.svg',
            stats: {
              studentsRepresented: p.studentsRepresented || '2.800+ Mahasiswa',
              casesHandled: p.casesHandled || '14 Advokasi Kampus',
              papersContributed: p.papersContributed || '6 Naskah Kajian',
            },
          }))

          // Pastikan Mitra Pendiri tetap di urutan pertama
          mapped.sort((a, b) => (a.badgeType === 'Mitra Pendiri' ? -1 : b.badgeType === 'Mitra Pendiri' ? 1 : 0))
          setPartnerList(mapped)
        }
      })
      .catch(() => {})
  }, [])

  const foundingPartner = partnerList.find((p) => p.badgeType === 'Mitra Pendiri') || partnerList[0] || null
  const otherPartners = foundingPartner ? partnerList.filter((p) => p.id !== foundingPartner.id) : []

  return (
    <div
      id="partners"
      className="w-full relative z-10 select-none animate-in fade-in duration-200"
    >
      {/* ─── KOP DOKUMEN DIREKTORI KEMITRAAN ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy/15 pb-2 sm:pb-2.5 mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-2xs font-sans font-bold uppercase tracking-widest bg-gold text-navy shadow-xs flex items-center gap-1">
            <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>Direktori Mitra Kampus &amp; Ormawa</span>
          </span>
          <span className="text-[8.5px] sm:text-xs font-mono text-stone-500">
            Terverifikasi Resmi • Arsip Konsorsium Suarantara
          </span>
        </div>
        <span className="text-[8.5px] sm:text-xs font-serif italic text-stone-600">
          Kolaborasi Berasaskan Nilai Demokratis &amp; Integritas Intelektual
        </span>
      </div>

      {/* ─── GRID UTAMA: PROFIL DETAIL MITRA (KIRI 8 KOLOM) & FONDASI CMS / SLOT PENGAJUAN (KANAN 4 KOLOM) ─── */}
      {foundingPartner ? (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ════════════════ SISI KIRI: PROFIL DETIL MITRA BEM STMIK JAYAKARTA (8 KOLOM) ════════════════ */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-7">
          
          {/* BANNER UTAMA MITRA PENDIRI (FOUNDING PARTNER SHOWCASE) */}
          <article className="bg-white/80 backdrop-blur-xs border-2 border-navy/25 rounded-2xl p-4 sm:p-7 shadow-md space-y-4 sm:space-y-6 relative overflow-hidden">
            {/* Visual Header Ribbon / Scrim */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-3 sm:pb-5 border-b border-navy/15">
              
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Logo Mitra Besar & Terang */}
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-white border border-navy/20 p-1.5 sm:p-2 shadow-xs shrink-0 flex items-center justify-center">
                  <Image
                    src={foundingPartner.logo}
                    alt={foundingPartner.name}
                    width={72}
                    height={72}
                    className="object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-sans font-extrabold uppercase tracking-widest bg-gold text-navy shadow-2xs">
                      {foundingPartner.badgeType}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {foundingPartner.status}
                    </span>
                  </div>

                  <h3 className="font-serif font-extrabold text-base sm:text-xl md:text-2xl text-navy leading-snug">
                    {foundingPartner.name}
                  </h3>

                  <p className="text-[10px] sm:text-xs font-sans text-stone-600">
                    {foundingPartner.category} • Kode: <strong className="font-mono text-navy">{foundingPartner.code}</strong>
                  </p>
                </div>
              </div>

              {/* Tanggal Join & Periode Plakat */}
              <div className="text-left sm:text-right shrink-0 bg-navy/5 p-2 sm:p-2.5 rounded-lg border border-navy/10 space-y-0.5">
                <span className="text-[9px] sm:text-[10px] font-sans text-stone-500 block">Tanggal Bergabung:</span>
                <span className="font-mono text-[10.5px] sm:text-xs font-bold text-navy flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3 h-3 text-gold-700" />
                  {foundingPartner.joinDate}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-sans text-gold-800 font-semibold block">
                  {foundingPartner.leadership.cabinetName}
                </span>
              </div>
            </div>

            {/* DETAIL KAMPUS & LOKASI SEKRETARIAT */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-serif font-bold text-[10.5px] sm:text-xs md:text-sm uppercase tracking-wider text-navy flex items-center gap-1.5 border-b border-navy/10 pb-1 sm:pb-1.5">
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                Informasi &amp; Lokasi Kampus
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 text-xs font-sans">
                <div className="bg-white/60 p-2.5 sm:p-3.5 rounded-xl border border-navy/10 space-y-1">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase text-stone-500 font-semibold">Institusi Pendidikan:</span>
                  <p className="font-bold text-stone-900 leading-snug text-[11px] sm:text-xs">
                    {foundingPartner.campus.fullName}
                  </p>
                  <p className="text-[9.5px] sm:text-[11px] text-stone-600">
                    Fokus Kajian: Informatika, Sistem Informasi, Rekayasa Perangkat Lunak, &amp; Kecerdasan Digital.
                  </p>
                </div>

                <div className="bg-white/60 p-2.5 sm:p-3.5 rounded-xl border border-navy/10 space-y-1">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase text-stone-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-crimson" />
                    Alamat Sekretariat BEM:
                  </span>
                  <p className="text-stone-800 leading-snug font-medium text-[11px] sm:text-xs">
                    {foundingPartner.campus.address}
                  </p>
                  <p className="text-[9.5px] sm:text-[11px] font-mono text-stone-600">
                    {foundingPartner.campus.city}, {foundingPartner.campus.province}
                  </p>
                </div>
              </div>
            </div>

            {/* KETERANGAN PRESIDEN & WAKIL PRESIDEN MAHASISWA */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-serif font-bold text-[10.5px] sm:text-xs md:text-sm uppercase tracking-wider text-navy flex items-center gap-1.5 border-b border-navy/10 pb-1 sm:pb-1.5">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                Kepemimpinan &amp; Delegasi Kemitraan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 text-xs font-sans">
                {/* Presma */}
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-navy/5 border border-navy/15 space-y-1">
                  <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500">
                    {foundingPartner.leadership.presmaTitle}
                  </span>
                  <h5 className="font-serif font-bold text-xs sm:text-sm text-navy">
                    {foundingPartner.leadership.presma}
                  </h5>
                  <p className="text-[9.5px] sm:text-[11px] text-stone-600 leading-snug">
                    Penanggung Jawab Aliansi Kebijakan &amp; Hubungan Eksternal BEM STMIK Jayakarta Periode {foundingPartner.leadership.period}.
                  </p>
                </div>

                {/* Wapresma & Inisiator */}
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-gold/10 border border-gold/40 space-y-1 relative">
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-gold text-navy text-[7.5px] sm:text-[8px] font-bold uppercase">
                    Inisiator
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-gold-800">
                    Wakil Presiden Mahasiswa
                  </span>
                  <h5 className="font-serif font-bold text-xs sm:text-sm text-navy">
                    {foundingPartner.leadership.wapresma}
                  </h5>
                  <p className="text-[9.5px] sm:text-[11px] text-stone-700 leading-tight">
                    Inisiator berdirinya Suarantara, Koordinator Konseptor Tiga Matra (Media, Advokasi, Kajian).
                  </p>
                </div>
              </div>
            </div>

            {/* RUANG LINGKUP KOLABORASI NYATA (ACTIONABLE SCOPE) */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-[10.5px] sm:text-xs md:text-sm uppercase tracking-wider text-navy flex items-center gap-1.5 border-b border-navy/10 pb-1 sm:pb-1.5">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                Ruang Lingkup Kemitraan Strategis
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs font-sans">
                {foundingPartner.collaborationScopes.map((scope, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-lg bg-white/60 border border-stone-200/60"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-700 shrink-0 mt-0.5" />
                    <span className="text-stone-700 leading-snug">{scope}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KUTIPAN PERNYATAAN SIKAP MITRA (Tanpa Font Putih yang Samar) */}
            <div className="bg-amber-50/70 text-stone-800 p-3 sm:p-5 rounded-xl border border-gold/60 space-y-1.5 sm:space-y-2 relative overflow-hidden shadow-2xs">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gold-800">
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700" />
                <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy">
                  Pernyataan Sikap Mitra Pendiri:
                </span>
              </div>
              <p className="font-serif italic text-[11px] sm:text-xs md:text-[13px] text-stone-800 leading-relaxed">
                &ldquo;{foundingPartner.quote}&rdquo;
              </p>
              <div className="pt-1 flex items-center justify-between text-[9px] sm:text-2xs font-sans text-stone-600 border-t border-gold/25">
                <span className="font-medium text-stone-700">Dewan Presidium BEM STMIK Jayakarta</span>
                <span className="font-mono text-gold-800 font-semibold">Pakta Kemitraan No. 01/BEM-SJ/2026</span>
              </div>
            </div>

          </article>

          {/* JARINGAN MITRA & ALIANSI KAMPUS TERVERIFIKASI */}
          <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
            <div className="flex items-center justify-between border-b border-navy/15 pb-1.5 sm:pb-2">
              <h4 className="font-serif text-[10.5px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-700" />
                Jaringan Mitra &amp; Aliansi Terverifikasi
              </h4>
              <span className="text-[8.5px] sm:text-[10px] font-sans text-stone-500 font-medium">
                {partnerList.length} Mitra Terdaftar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {otherPartners.map((ptr) => (
                <div
                  key={ptr.id}
                  className="bg-white/80 hover:bg-white border border-navy/15 hover:border-gold/60 p-3 sm:p-4 rounded-xl space-y-2.5 transition-all shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-navy/5 border border-navy/10 p-1.5 flex items-center justify-center shrink-0">
                      <Image
                        src={ptr.logo || '/partners/bem-stmik-jayakarta.svg'}
                        alt={ptr.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-sans font-bold uppercase tracking-wider bg-gold/20 text-navy border border-gold/40">
                        {ptr.badgeType}
                      </span>
                      <span className="block text-[8px] font-mono text-stone-400 mt-0.5">
                        {ptr.code}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-serif font-bold text-xs sm:text-sm text-navy leading-snug line-clamp-1">
                      {ptr.name}
                    </h5>
                    <p className="text-[10px] text-stone-600 font-sans flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-crimson shrink-0" />
                      <span className="truncate">{ptr.campus.shortName || ptr.campus.city}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[9px] font-sans text-stone-500">
                    <span className="truncate max-w-[130px]">
                      {ptr.leadership.presma ? `Presma: ${ptr.leadership.presma}` : ptr.category}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      Aktif
                    </span>
                  </div>
                </div>
              ))}

              {/* Slot Pendaftaran Terbuka Mitra Baru */}
              <div className="border-2 border-dashed border-navy/20 hover:border-gold/60 p-3.5 sm:p-5 rounded-xl text-center space-y-2 transition-colors bg-white/40 flex flex-col items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gold-700" />
                </div>
                <div>
                  <span className="text-[8.5px] sm:text-[9px] font-mono uppercase font-bold text-stone-400 block">
                    Slot Mitra #{String(partnerList.length + 1).padStart(3, '0')} (Buka Registrasi)
                  </span>
                  <h5 className="font-serif font-bold text-[11px] sm:text-xs md:text-sm text-stone-700">
                    BEM / Lembaga Mahasiswa
                  </h5>
                </div>
                <p className="text-[9.5px] sm:text-2xs text-stone-500 font-sans leading-relaxed">
                  Buka kemitraan advokasi, sindikasi warta kampus &amp; riset bersama Suarantara.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ════════════════ SISI KANAN: STATISTIK MITRA, CMS SCHEMA PREVIEW & CTA JOIN (4 KOLOM) ════════════════ */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          
          {/* 1. KOTAK DATA RINGKAS KEMITRAAN (CMS METADATA CARD) */}
          <div className="bg-white/70 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3.5">
            <div className="flex items-center justify-between border-b border-navy/15 pb-2">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gold-700" />
                Ringkasan Direktori Mitra
              </span>
              <span className="text-[8.5px] sm:text-[9px] font-mono px-2 py-0.5 rounded bg-gold/15 text-gold-900 font-bold">
                CMS Ready
              </span>
            </div>

            <dl className="divide-y divide-stone-100 text-[10px] sm:text-xs font-sans space-y-1.5 sm:space-y-2">
              <div className="flex justify-between pt-1">
                <dt className="text-stone-500">Mitra Terverifikasi:</dt>
                <dd className="font-bold text-navy text-right">
                  {partnerList.length} Lembaga Mitra
                </dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Status Kemitraan:</dt>
                <dd className="font-semibold text-emerald-700 text-right">
                  {foundingPartner.shortName} (Mitra Pendiri)
                </dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Basis Kolaborasi:</dt>
                <dd className="font-medium text-stone-800 text-right">Media • Advokasi • Kajian</dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Total Mahasiswa Terwakili:</dt>
                <dd className="font-mono font-bold text-gold-800 text-right">
                  {partnerList.length > 1 ? `${partnerList.length * 2}.500+ Mahasiswa` : '2.800+ Mahasiswa'}
                </dd>
              </div>

              <div className="flex justify-between pt-1.5 sm:pt-2">
                <dt className="text-stone-500">Wilayah Jaringan:</dt>
                <dd className="font-medium text-stone-800 text-right">LLDIKTI Wilayah III</dd>
              </div>
            </dl>

            <div className="pt-1.5 sm:pt-2 border-t border-navy/10 text-[9.5px] sm:text-[11px] font-sans text-stone-500 italic">
              Data terintegrasi ke dalam master catalog CMS Suarantara untuk penambahan mitra baru secara dinamis.
            </div>
          </div>

          {/* 2. FORMULIR AJAKAN KEMITRAAN KAMPUS (Tanpa Font Putih yang Samar) */}
          <div className="bg-white border-2 border-gold/60 p-3.5 sm:p-5 rounded-xl shadow-md space-y-2.5 sm:space-y-3.5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-navy/15 pb-2">
              <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-700" />
                Buka Kemitraan Baru
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold-900 text-[8px] sm:text-[9px] font-mono font-bold">
                Terbuka
              </span>
            </div>

            <h4 className="font-serif text-xs sm:text-sm md:text-base font-extrabold text-navy leading-snug">
              Ingin BEM atau Ormawa Kampus Anda Menjadi Mitra Resmi Suarantara?
            </h4>

            <p className="text-[10px] sm:text-2xs text-stone-700 font-sans leading-relaxed">
              Suarantara membuka konsolidasi luas tanpa sekat hegemoni. Dapatkan akses publikasi artikel kampus, pendampingan kasus advokasi mahasiswa, dan sindikasi naskah riset.
            </p>

            <div className="space-y-1 sm:space-y-1.5 pt-1 text-[9.5px] sm:text-[11px] font-sans text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
                <span>Tanpa Biaya / Komitmen Moral Bersama</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
                <span>Hak Suara di Mimbar Redaksi &amp; Riset</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold-700 shrink-0" />
                <span>Bantuan Pendampingan Advokasi Kampus</span>
              </div>
            </div>

            <div className="pt-1.5 space-y-2">
              <Link
                href="/kirim-suara"
                className="w-full text-center block py-2 sm:py-2.5 rounded-full bg-gold hover:bg-gold-500 text-navy font-sans font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors shadow-sm border border-gold-600"
              >
                Ajukan Kemitraan BEM
              </Link>

              <button
                type="button"
                onClick={openContact}
                className="w-full text-center block py-1.5 sm:py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-sans font-semibold text-[10px] sm:text-xs tracking-wide transition-colors cursor-pointer"
              >
                Hubungi Divisi Jaringan Kampus
              </button>
            </div>
          </div>

          {/* 3. SYARAT KELAYAKAN MITRA GERAKAN */}
          <div className="bg-white/70 backdrop-blur-xs border border-navy/20 p-3.5 sm:p-5 rounded-xl shadow-xs space-y-2.5 sm:space-y-3">
            <span className="font-serif font-bold text-[10px] sm:text-xs uppercase tracking-wider text-navy block border-b border-navy/15 pb-2">
              Prinsip Kemitraan Suarantara
            </span>

            <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs font-sans text-stone-700">
              <li className="flex items-start gap-1.5 sm:gap-2">
                <span className="font-bold text-navy shrink-0">•</span>
                <span><strong>Independen:</strong> Tidak berafiliasi atau menjadi alat kepanjangan tangan partai politik praktis manapun.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-navy shrink-0">•</span>
                <span><strong>Demokratis:</strong> Menjunjung tinggi kebebasan berpendapat dan mimbar akademik di dalam kampus.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-navy shrink-0">•</span>
                <span><strong>Berintegritas:</strong> Mengedepankan verifikasi data yang jujur dalam setiap penyampaian laporan dan aduan.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="Belum Ada Mitra Terdaftar"
          description="Direktori kemitraan Suarantara masih kosong. Profil BEM dan ormawa mitra akan tampil di sini setelah terverifikasi oleh divisi jaringan kampus."
          hint="Slot kemitraan terbuka untuk kampus Anda"
        />
      )}

    </div>
  )
}
