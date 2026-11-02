'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Newspaper,
  Scale,
  BookOpen,
  Calendar,
  Building2,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  X,
  Star,
  Image as ImageIcon,
} from 'lucide-react'

type TabKey = 'media' | 'advokasi' | 'kajian' | 'program' | 'partners' | 'aspirasi' | 'reels'

interface Stats {
  articles: number
  cases: number
  papers: number
  programs: number
  partners: number
  voices: number
  reels: number
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('media')
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Data states
  const [articles, setArticles] = useState<any[]>([])
  const [cases, setCases] = useState<any[]>([])
  const [papers, setPapers] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [voices, setVoices] = useState<any[]>([])
  const [reels, setReels] = useState<any[]>([])

  // State petisi aktif (satu petisi publik dikelola dari panel advokasi)
  const [petitionId, setPetitionId] = useState<string | null>(null)
  const [petitionForm, setPetitionForm] = useState({
    title: '',
    desc: '',
    targetSignatures: 10000,
    isUrgent: false,
    isActive: true,
  })

  // Modal State for Create/Edit Article
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null)

  // Status unggah gambar ke Supabase Storage
  const [uploadingArticleCover, setUploadingArticleCover] = useState(false)
  const [uploadingProgramCover, setUploadingProgramCover] = useState(false)
  const createEmptyArticleForm = () => ({
    title: '',
    slug: '',
    category: 'Opini Mahasiswa',
    categoryKey: 'politik',
    leadExcerpt: '',
    content: '',
    authorName: 'Redaksi Suarantara',
    authorRole: '',
    authorAvatar: '',
    dateDisplay: '01 Nov 2026',
    kickerBadge: '',
    editionBadge: '',
    coverImageUrl: '',
    coverCaption: '',
    coverCredit: 'Foto: Biro Dokumentasi',
    imageGrad: 'from-navy-950 via-navy-900 to-stone-900',
    iconColor: 'text-gold',
    iconType: 'newspaper',
    tagsText: '',
    isHeadlineBanner: false,
    isEditorPick: false,
    isTrending: false,
    rankingNo: '',
    recommendationTag: '',
    status: 'PUBLISHED',
  })
  const [articleForm, setArticleForm] = useState(createEmptyArticleForm())

  // Modal State for Create Case
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false)
  const [caseForm, setCaseForm] = useState({
    caseCode: `ADV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    campus: '',
    category: 'ukt',
    categoryLabel: 'UKT & Biaya',
    status: 'investigasi',
    statusLabel: 'Tahap Investigasi LBH',
    statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
    affectedCount: '100 Mahasiswa Terdampak',
    lastUpdate: 'Kasus baru masuk meja verifikasi advokasi.',
    progressPercent: 20,
    dateDisplay: '01 Nov 2026',
    coverImageUrl: '',
    coverCaption: '',
    coverCredit: '',
    legalCounsel: '',
    urgencyLevel: '',
    leadBackground: '',
    timelineText: '',
    violationsText: '',
    demandsText: '',
  })

  // Modal State for Create Partner
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false)
  const [partnerForm, setPartnerForm] = useState({
    partnerCode: 'PTR-006',
    name: '',
    shortName: '',
    category: 'BEM Universitas',
    badgeType: 'Mitra Kampus',
    campusFullName: '',
    campusShortName: '',
    campusCity: '',
    campusProvince: 'DKI Jakarta',
    presmaName: '',
    cabinetName: 'Kabinet Perjuangan',
    logoUrl: '/partners/bem-stmik-jayakarta.svg',
  })

  // Modal State for Create Video Reel
  const [isReelModalOpen, setIsReelModalOpen] = useState(false)
  const [reelForm, setReelForm] = useState({
    title: '',
    creator: 'Redaksi Suarantara',
    views: '10.5K',
    duration: '0:58',
    category: 'Liputan Langsung',
    thumbnailGradient: 'from-navy-950 via-navy-900 to-stone-900',
  })

  // Modal State for Create/Edit Program
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false)
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null)
  const createEmptyProgramForm = () => ({
    programCode: `PRG-${new Date().getFullYear()}-${String(Math.floor(1 + Math.random() * 999)).padStart(3, '0')}`,
    title: '',
    slug: '',
    category: 'Media & Pers',
    status: 'Registrasi Dibuka',
    statusColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    statusNote: '',
    dateRange: '',
    duration: '',
    locationVenue: '',
    hostOrganizer: '',
    quota: '',
    cost: '',
    author: 'Redaksi Suarantara',
    editionNumber: 'Edisi No. 01/2026',
    dateDisplay: '',
    headlineImageGrad: 'from-navy-950 via-navy-900 to-stone-900',
    iconColor: 'text-gold',
    iconType: 'newspaper',
    coverImageUrl: '',
    coverCaption: '',
    coverCredit: '',
    leadBackground: '',
    backgroundBody: '',
    highlightsText: '',
    modulesText: '',
    requirementsText: '',
    facilitiesText: '',
    timelineText: '',
    isHeadlineProgram: false,
    sortOrder: 0,
  })
  const [programForm, setProgramForm] = useState(createEmptyProgramForm())

  // Helper konversi teks (satu baris = satu item) menjadi JSON string untuk field CMS
  const linesToJson = (text: string) =>
    JSON.stringify(text.split('\n').map((l) => l.trim()).filter(Boolean))
  const modulesToJson = (text: string) =>
    JSON.stringify(
      text
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [day = '', title = '', desc = '', mentor = ''] = l.split('|').map((s) => s.trim())
          return { day, title, desc, mentor }
        })
    )
  const jsonToLines = (raw: unknown): string => {
    try {
      const arr = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (!Array.isArray(arr)) return ''
      return arr.map((h) => String(h)).join('\n')
    } catch {
      return ''
    }
  }
  const jsonToModules = (raw: unknown): string => {
    try {
      const arr = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (!Array.isArray(arr)) return ''
      return arr
        .map((m: any) =>
          [m?.day, m?.title, m?.desc, m?.mentor].map((x) => String(x ?? '')).join(' | ')
        )
        .join('\n')
    } catch {
      return ''
    }
  }
  const timelineToJson = (text: string) =>
    JSON.stringify(
      text
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [date = '', title = ''] = l.split('|').map((s) => s.trim())
          return { date, title }
        })
    )
  const jsonToTimeline = (raw: unknown): string => {
    try {
      const arr = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (!Array.isArray(arr)) return ''
      return arr
        .map((t: any) => [t?.date, t?.title].map((x) => String(x ?? '')).join(' | '))
        .join('\n')
    } catch {
      return ''
    }
  }

  // Helper khusus advokasi: tiap baris teks → butir JSON terstruktur.
  const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean)
  const timelineStepsToJson = (text: string) =>
    JSON.stringify(
      lines(text).map((l) => {
        const [date = '', title = '', desc = '', rawStatus = ''] = l.split('|').map((s) => s.trim())
        const status = ['selesai', 'aktif', 'rencana'].includes(rawStatus) ? rawStatus : 'rencana'
        return { date, title, desc, status }
      })
    )
  const legalViolationsToJson = (text: string) =>
    JSON.stringify(
      lines(text).map((l) => {
        const [article = '', explanation = ''] = l.split('|').map((s) => s.trim())
        return { article, explanation }
      })
    )
  const demandsToJson = (text: string) => JSON.stringify(lines(text))

  // Fetch stats & data
  const fetchAllData = async () => {
    setLoading(true)
    try {
      const statsRes = await fetch('/api/cms/stats')
      const statsJson = await statsRes.json()
      if (statsJson.success) setStats(statsJson.stats)

      const [artRes, caseRes, paperRes, progRes, partRes, voiceRes, reelRes] = await Promise.all([
        fetch('/api/cms/articles?limit=50'),
        fetch('/api/cms/advocacy'),
        fetch('/api/cms/papers'),
        fetch('/api/cms/programs'),
        fetch('/api/cms/partners'),
        fetch('/api/cms/voices'),
        fetch('/api/cms/reels'),
      ])

      const [artJson, caseJson, paperJson, progJson, partJson, voiceJson, reelJson] = await Promise.all([
        artRes.json(),
        caseRes.json(),
        paperRes.json(),
        progRes.json(),
        partRes.json(),
        voiceRes.json(),
        reelRes.json(),
      ])

      if (artJson.success) setArticles(artJson.articles)
      if (caseJson.success) setCases(caseJson.cases)
      if (paperJson.success) setPapers(paperJson.papers)
      if (progJson.success) setPrograms(progJson.programs)
      if (partJson.success) setPartners(partJson.partners)
      if (voiceJson.success) setVoices(voiceJson.voices)
      if (reelJson.success) setReels(reelJson.reels)
    } catch (err) {
      console.error('Failed to load CMS data:', err)
      showNotification('Gagal memuat data dari server', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // Ambil petisi aktif dari CMS (satu petisi publik)
  const fetchPetition = async () => {
    try {
      const res = await fetch('/api/cms/petitions')
      const data = await res.json()
      if (data.success && data.petition) {
        setPetitionId(data.petition.id)
        setPetitionForm({
          title: data.petition.title ?? '',
          desc: data.petition.desc ?? '',
          targetSignatures: Number(data.petition.targetSignatures ?? 10000),
          isUrgent: Boolean(data.petition.isUrgent),
          isActive: Boolean(data.petition.isActive),
        })
      }
    } catch {
      // abaikan: petisi opsional
    }
  }

  // Muat petisi aktif saat tab advokasi dibuka
  useEffect(() => {
    if (activeTab === 'advokasi') fetchPetition()
  }, [activeTab])

  // Simpan petisi: POST bila baru, PUT bila sudah ada id
  const handleSavePetition = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const isEdit = Boolean(petitionId)
      const res = await fetch('/api/cms/petitions', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...petitionForm, id: petitionId } : petitionForm),
      })
      const data = await res.json()
      if (data.success) {
        showNotification(isEdit ? 'Petisi berhasil diperbarui!' : 'Petisi baru berhasil dibuat!')
        if (data.petition?.id) setPetitionId(data.petition.id)
        fetchPetition()
      } else {
        showNotification(data.error || 'Gagal menyimpan petisi', 'error')
      }
    } catch {
      showNotification('Terjadi kesalahan koneksi', 'error')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3500)
  }

  // Unggah gambar ke Supabase Storage → kembalikan URL publik (atau null bila gagal)
  const uploadImage = async (file: File, folder: string): Promise<string | null> => {
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Ukuran gambar melebihi 5 MB.', 'error')
      return null
    }
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    try {
      const res = await fetch('/api/cms/upload', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (data.success && data.url) {
        showNotification('Gambar berhasil diunggah ke penyimpanan.')
        return data.url as string
      }
      showNotification(data.error || 'Gagal mengunggah gambar', 'error')
      return null
    } catch {
      showNotification('Terjadi kesalahan saat mengunggah gambar', 'error')
      return null
    }
  }

  // Buka form untuk membuat artikel baru
  const openCreateArticle = () => {
    setEditingArticleId(null)
    setArticleForm(createEmptyArticleForm())
    setIsArticleModalOpen(true)
  }

  // Buka form untuk mengubah artikel yang sudah ada
  const openEditArticle = (art: any) => {
    setEditingArticleId(art.id)
    let tagsText = ''
    try {
      const parsed = typeof art.tags === 'string' ? JSON.parse(art.tags) : art.tags
      if (Array.isArray(parsed)) tagsText = parsed.join('\n')
    } catch {
      tagsText = ''
    }
    setArticleForm({
      title: art.title ?? '',
      slug: art.slug ?? '',
      category: art.category ?? 'Opini Mahasiswa',
      categoryKey: art.categoryKey ?? 'politik',
      leadExcerpt: art.leadExcerpt ?? '',
      content: art.content ?? '',
      authorName: art.authorName ?? 'Redaksi Suarantara',
      authorRole: art.authorRole ?? '',
      authorAvatar: art.authorAvatar ?? '',
      dateDisplay: art.dateDisplay ?? '',
      kickerBadge: art.kickerBadge ?? '',
      editionBadge: art.editionBadge ?? '',
      coverImageUrl: art.coverImageUrl ?? '',
      coverCaption: art.coverCaption ?? '',
      coverCredit: art.coverCredit ?? 'Foto: Biro Dokumentasi',
      imageGrad: art.imageGrad ?? 'from-navy-950 via-navy-900 to-stone-900',
      iconColor: art.iconColor ?? 'text-gold',
      iconType: art.iconType ?? 'newspaper',
      tagsText,
      isHeadlineBanner: Boolean(art.isHeadlineBanner),
      isEditorPick: Boolean(art.isEditorPick),
      isTrending: Boolean(art.isTrending),
      rankingNo: art.rankingNo ?? '',
      recommendationTag: art.recommendationTag ?? '',
      status: art.status ?? 'PUBLISHED',
    })
    setIsArticleModalOpen(true)
  }

  // Simpan artikel: POST bila baru, PUT bila mengubah
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // tagsText (dipisah baris/koma) → array tags untuk API
      const tags = articleForm.tagsText
        .split(/[\n,]+/)
        .map((t) => t.trim())
        .filter(Boolean)

      const { tagsText, ...rest } = articleForm
      void tagsText
      const payload = { ...rest, tags }

      const isEdit = Boolean(editingArticleId)
      const res = await fetch('/api/cms/articles', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { ...payload, id: editingArticleId } : payload),
      })
      const data = await res.json()
      if (data.success) {
        showNotification(isEdit ? 'Warta berhasil diperbarui!' : 'Warta baru berhasil diterbitkan!')
        setIsArticleModalOpen(false)
        setEditingArticleId(null)
        setArticleForm(createEmptyArticleForm())
        fetchAllData()
      } else {
        showNotification(data.error || 'Gagal menyimpan artikel', 'error')
      }
    } catch {
      showNotification('Terjadi kesalahan koneksi', 'error')
    }
  }

  // Handle Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return
    try {
      const res = await fetch(`/api/cms/articles?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showNotification('Artikel berhasil dihapus')
        fetchAllData()
      } else {
        showNotification(data.error || 'Gagal menghapus', 'error')
      }
    } catch {
      showNotification('Terjadi kesalahan', 'error')
    }
  }

  // Handle Create Case
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Field teks bantu (per baris) diubah menjadi JSON terstruktur sebelum dikirim.
      const { timelineText, violationsText, demandsText, ...rest } = caseForm
      const payload = {
        ...rest,
        timelineSteps: timelineStepsToJson(timelineText),
        legalViolations: legalViolationsToJson(violationsText),
        demands: demandsToJson(demandsText),
      }
      const res = await fetch('/api/cms/advocacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.success) {
        showNotification('Kasus advokasi baru berhasil didaftarkan!')
        setIsCaseModalOpen(false)
        fetchAllData()
      } else {
        showNotification(data.error || 'Gagal mendaftar kasus', 'error')
      }
    } catch {
      showNotification('Terjadi kesalahan koneksi', 'error')
    }
  }

  // Handle Create Partner
  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/cms/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerForm),
      })
      const data = await res.json()
      if (data.success) {
        showNotification('Mitra kampus baru berhasil didaftarkan!')
        setIsPartnerModalOpen(false)
        fetchAllData()
      } else {
        showNotification(data.error || 'Gagal mendaftarkan mitra', 'error')
      }
    } catch {
      showNotification('Terjadi kesalahan koneksi', 'error')
    }
  }

  // Handle Open Program Modal (Create / Edit)
  const openCreateProgram = () => {
    setEditingProgramId(null)
    setProgramForm(createEmptyProgramForm())
    setIsProgramModalOpen(true)
  }

  const openEditProgram = (pr: any) => {
    setEditingProgramId(pr.id)
    setProgramForm({
      programCode: pr.programCode ?? '',
      title: pr.title ?? '',
      slug: pr.slug ?? '',
      category: pr.category ?? 'Media & Pers',
      status: pr.status ?? 'Registrasi Dibuka',
      statusColor: pr.statusColor ?? 'bg-emerald-50 text-emerald-800 border-emerald-200',
      statusNote: pr.statusNote ?? '',
      dateRange: pr.dateRange ?? '',
      duration: pr.duration ?? '',
      locationVenue: pr.locationVenue ?? '',
      hostOrganizer: pr.hostOrganizer ?? '',
      quota: pr.quota ?? '',
      cost: pr.cost ?? '',
      author: pr.author ?? 'Redaksi Suarantara',
      editionNumber: pr.editionNumber ?? '',
      dateDisplay: pr.dateDisplay ?? '',
      headlineImageGrad: pr.headlineImageGrad ?? 'from-navy-950 via-navy-900 to-stone-900',
      iconColor: pr.iconColor ?? 'text-gold',
      iconType: pr.iconType ?? 'newspaper',
      coverImageUrl: pr.coverImageUrl ?? '',
      coverCaption: pr.coverCaption ?? '',
      coverCredit: pr.coverCredit ?? '',
      leadBackground: pr.leadBackground ?? '',
      backgroundBody: pr.backgroundBody ?? '',
      highlightsText: jsonToLines(pr.highlights),
      modulesText: jsonToModules(pr.modules),
      requirementsText: jsonToLines(pr.requirements),
      facilitiesText: jsonToLines(pr.facilities),
      timelineText: jsonToTimeline(pr.timeline),
      isHeadlineProgram: Boolean(pr.isHeadlineProgram),
      sortOrder: Number(pr.sortOrder ?? 0),
    })
    setIsProgramModalOpen(true)
  }

  // Handle Create / Update Program
  const handleSubmitProgram = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        programCode: programForm.programCode.trim(),
        title: programForm.title.trim(),
        slug: programForm.slug.trim() || undefined,
        category: programForm.category,
        status: programForm.status,
        statusColor: programForm.statusColor,
        statusNote: programForm.statusNote,
        dateRange: programForm.dateRange,
        duration: programForm.duration,
        locationVenue: programForm.locationVenue,
        hostOrganizer: programForm.hostOrganizer,
        quota: programForm.quota,
        cost: programForm.cost,
        author: programForm.author,
        editionNumber: programForm.editionNumber,
        dateDisplay: programForm.dateDisplay,
        headlineImageGrad: programForm.headlineImageGrad,
        iconColor: programForm.iconColor,
        iconType: programForm.iconType,
        coverImageUrl: programForm.coverImageUrl.trim(),
        coverCaption: programForm.coverCaption,
        coverCredit: programForm.coverCredit,
        leadBackground: programForm.leadBackground,
        backgroundBody: programForm.backgroundBody,
        highlights: linesToJson(programForm.highlightsText),
        modules: modulesToJson(programForm.modulesText),
        requirements: linesToJson(programForm.requirementsText),
        facilities: linesToJson(programForm.facilitiesText),
        timeline: timelineToJson(programForm.timelineText),
        isHeadlineProgram: programForm.isHeadlineProgram,
        sortOrder: Number(programForm.sortOrder) || 0,
      }
      const res = await fetch('/api/cms/programs', {
        method: editingProgramId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProgramId ? { ...payload, id: editingProgramId } : payload),
      })
      const data = await res.json()
      if (data.success) {
        showNotification(editingProgramId ? 'Program berhasil diperbarui!' : 'Program baru berhasil dibuat!')
        setIsProgramModalOpen(false)
        setEditingProgramId(null)
        fetchAllData()
      } else {
        showNotification(data.error || 'Gagal menyimpan program', 'error')
      }
    } catch {
      showNotification('Terjadi kesalahan koneksi', 'error')
    }
  }

  // Filtered views
  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPapers = papers.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPrograms = programs.filter(
    (pr) =>
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.hostOrganizer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPartners = partners.filter(
    (pa) =>
      pa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pa.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pa.campusCity.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-gold selection:text-navy">
      
      {/* ─── TOAST NOTIFICATION ─── */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2.5 text-xs font-serif font-bold transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-crimson text-white border-crimson-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-gold shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* ─── TOP EDITORIAL MASTHEAD BAR ─── */}
      <header className="bg-navy text-white border-b-2 border-gold/40 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-serif font-bold text-lg">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base sm:text-lg tracking-wider text-white uppercase">
                  Suarantara CMS
                </h1>
                <span className="px-2 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase tracking-widest bg-gold text-navy">
                  Meja Redaksi
                </span>
              </div>
              <p className="text-[10px] text-stone-300 font-serif italic">
                Sistem Manajemen Konten Tiga Pilar Gerakan Mahasiswa Nusantara
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span className="font-serif font-semibold">Wisnu Saputra</span>
              <span className="text-[9px] font-mono text-gold px-1.5 py-0.2 rounded bg-black/40">Superadmin</span>
            </div>

            <button
              onClick={fetchAllData}
              title="Refresh Data"
              className="p-1.5 rounded-md bg-white/10 hover:bg-gold hover:text-navy text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/studio"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors shadow-xs"
              title="Buka Sanity Studio untuk Penulisan Visual & Media CDN"
            >
              <span>Sanity Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif font-bold text-navy bg-gold hover:bg-gold-400 transition-colors shadow-xs"
            >
              <span>Lihat Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* ─── MAIN CMS CONTAINER ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* ─── LIVE OVERVIEW METRICS CARDS ─── */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            {
              label: 'Artikel Warta',
              count: stats?.articles ?? 0,
              icon: Newspaper,
              color: 'text-navy',
              bg: 'bg-white',
              border: 'border-navy/15',
              tab: 'media' as TabKey,
            },
            {
              label: 'Kasus Advokasi',
              count: stats?.cases ?? 0,
              icon: Scale,
              color: 'text-crimson',
              bg: 'bg-white',
              border: 'border-crimson/20',
              tab: 'advokasi' as TabKey,
            },
            {
              label: 'Naskah Kajian',
              count: stats?.papers ?? 0,
              icon: BookOpen,
              color: 'text-gold-800',
              bg: 'bg-white',
              border: 'border-gold/30',
              tab: 'kajian' as TabKey,
            },
            {
              label: 'Program Kerja',
              count: stats?.programs ?? 0,
              icon: Calendar,
              color: 'text-emerald-800',
              bg: 'bg-white',
              border: 'border-emerald-700/20',
              tab: 'program' as TabKey,
            },
            {
              label: 'Mitra Kampus',
              count: stats?.partners ?? 0,
              icon: Building2,
              color: 'text-stone-800',
              bg: 'bg-white',
              border: 'border-stone-300',
              tab: 'partners' as TabKey,
            },
            {
              label: 'Aspirasi Masuk',
              count: stats?.voices ?? 0,
              icon: MessageSquare,
              color: 'text-indigo-800',
              bg: 'bg-white',
              border: 'border-indigo-700/20',
              tab: 'aspirasi' as TabKey,
            },
          ].map((m) => {
            const Icon = m.icon
            const isActive = activeTab === m.tab
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => setActiveTab(m.tab)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 shadow-xs relative overflow-hidden group cursor-pointer ${
                  m.bg
                } ${m.border} ${isActive ? 'ring-2 ring-navy shadow-md -translate-y-0.5' : 'hover:shadow-md'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-stone-500">
                    {m.label}
                  </span>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                  {m.count}
                </div>
                <span className="text-[9px] font-sans text-stone-400 mt-1 inline-block">
                  Kelola Modul →
                </span>
              </button>
            )
          })}
        </section>

        {/* ─── TAB NAVIGATION & SEARCH BAR ─── */}
        <section className="bg-white rounded-xl border border-navy/15 shadow-xs p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          
          {/* Pills Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { key: 'media', label: 'Pilar Media', icon: Newspaper },
              { key: 'advokasi', label: 'Pilar Advokasi', icon: Scale },
              { key: 'kajian', label: 'Pilar Kajian', icon: BookOpen },
              { key: 'program', label: 'Pilar Program', icon: Calendar },
              { key: 'partners', label: 'Pilar Partners', icon: Building2 },
              { key: 'aspirasi', label: 'Kotak Aspirasi', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key as TabKey)
                    setSearchTerm('')
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-colors shrink-0 select-none ${
                    isSelected
                      ? 'bg-navy text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-navy'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Search Input & Action Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={`Cari di ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 text-xs font-sans focus:outline-none focus:border-navy bg-stone-50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Action Buttons Per Tab */}
            {activeTab === 'media' && (
              <button
                type="button"
                onClick={openCreateArticle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold text-white bg-navy hover:bg-navy-900 transition-colors shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-gold" />
                <span>Tulis Warta</span>
              </button>
            )}

            {activeTab === 'advokasi' && (
              <button
                type="button"
                onClick={() => setIsCaseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif font-bold text-white bg-crimson hover:bg-crimson-800 transition-colors shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Daftar Kasus</span>
              </button>
            )}
          </div>

        </section>

        {/* ─── TAB CONTENT PANELS ─── */}

        {/* 1. MEDIA TAB */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-xl border border-navy/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-navy">
                  Daftar Warta, Investigasi & Opini Mahasiswa
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Total {filteredArticles.length} artikel terindeks di database
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 font-serif font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Judul & Kategori</th>
                    <th className="py-3 px-4">Penulis / Biro</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Status & Posisi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-stone-50/80 transition-colors group">
                      <td className="py-3 px-4 max-w-sm sm:max-w-md">
                        <div className="flex items-start gap-2">
                          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${art.isHeadlineBanner ? 'bg-gold ring-2 ring-gold/40' : 'bg-navy'}`} />
                          <div>
                            <p className="font-serif font-bold text-xs sm:text-[13px] text-stone-900 group-hover:text-navy line-clamp-1">
                              {art.title}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-stone-100 font-medium text-stone-700">
                                {art.category}
                              </span>
                              <span>•</span>
                              <span className="font-mono text-stone-400 truncate max-w-[150px]">/{art.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium whitespace-nowrap">
                        {art.authorName}
                      </td>
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                        {art.dateDisplay}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-gold-700 whitespace-nowrap">
                        {art.viewsDisplay}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex flex-wrap items-center gap-1">
                          {art.isHeadlineBanner && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gold text-navy">
                              Banner Utama
                            </span>
                          )}
                          {art.isEditorPick && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-navy text-white">
                              Rekomendasi
                            </span>
                          )}
                          {art.isTrending && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-crimson text-white">
                              Tren #{art.rankingNo}
                            </span>
                          )}
                          {!art.isHeadlineBanner && !art.isEditorPick && !art.isTrending && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-stone-100 text-stone-600">
                              Grid Berita
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditArticle(art)}
                            title="Ubah Warta"
                            className="p-1 rounded text-stone-400 hover:text-navy transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            title="Hapus Warta"
                            className="p-1 rounded text-stone-400 hover:text-crimson transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredArticles.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-400 font-serif italic">
                        Tidak ada warta yang sesuai pencarian
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. ADVOKASI TAB */}
        {activeTab === 'advokasi' && (
          <div className="bg-white rounded-xl border border-navy/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-navy">
                  Pelacak Kasus & Advokasi Mahasiswa Terverifikasi
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Total {filteredCases.length} sengketa kampus aktif dalam pengawalan aliansi
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 font-serif font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Kasus & Kampus</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Status & Catatan Terakhir</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Dampak</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {filteredCases.map((cs) => (
                    <tr key={cs.id} className="hover:bg-stone-50/80 transition-colors group">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-start gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold ${cs.isNationalPriority ? 'bg-crimson text-white' : 'bg-stone-200 text-stone-700'}`}>
                            {cs.caseCode}
                          </span>
                          <div>
                            <p className="font-serif font-bold text-xs sm:text-[13px] text-stone-900 group-hover:text-navy line-clamp-2">
                              {cs.title}
                            </p>
                            <p className="text-[10px] text-stone-500 font-medium mt-0.5">
                              📍 {cs.campus}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-stone-100 text-stone-700">
                          {cs.categoryLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold border ${cs.statusColor} mb-1`}>
                          {cs.statusLabel}
                        </span>
                        <p className="text-[10px] text-stone-600 italic line-clamp-1">
                          &ldquo;{cs.lastUpdate}&rdquo;
                        </p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-stone-700 mb-0.5">
                            <span>{cs.progressPercent}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                            <div
                              className="h-full bg-navy rounded-full transition-all"
                              style={{ width: `${cs.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-medium text-[11px] whitespace-nowrap">
                        {cs.affectedCount}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={async () => {
                            if (!confirm('Hapus kasus ini?')) return
                            await fetch(`/api/cms/advocacy?id=${cs.id}`, { method: 'DELETE' })
                            showNotification('Kasus advokasi dihapus')
                            fetchAllData()
                          }}
                          className="p-1 rounded text-stone-400 hover:text-crimson transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ─── Panel Petisi Aktif (tampil di halaman advokasi publik) ─── */}
            <div className="p-4 border-t border-stone-200 bg-stone-50/60">
              <form onSubmit={handleSavePetition} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-serif font-bold text-sm text-crimson flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Petisi Aktif
                  </h4>
                  <span className="text-[10px] font-sans text-stone-500">
                    {petitionId
                      ? 'Memperbarui petisi yang tayang di halaman publik'
                      : 'Belum ada petisi — isi untuk menayangkan'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Judul Petisi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Tolak Kenaikan UKT Sepihak"
                    value={petitionForm.title}
                    onChange={(e) => setPetitionForm({ ...petitionForm, title: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Deskripsi Petisi *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jelaskan tuntutan dan latar belakang petisi..."
                    value={petitionForm.desc}
                    onChange={(e) => setPetitionForm({ ...petitionForm, desc: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                      Target Tanda Tangan
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={petitionForm.targetSignatures}
                      onChange={(e) =>
                        setPetitionForm({
                          ...petitionForm,
                          targetSignatures: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs font-sans text-stone-700 pb-2">
                    <input
                      type="checkbox"
                      checked={petitionForm.isUrgent}
                      onChange={(e) => setPetitionForm({ ...petitionForm, isUrgent: e.target.checked })}
                      className="accent-crimson"
                    />
                    Tandai Urgent
                  </label>
                  <label className="flex items-center gap-2 text-xs font-sans text-stone-700 pb-2">
                    <input
                      type="checkbox"
                      checked={petitionForm.isActive}
                      onChange={(e) => setPetitionForm({ ...petitionForm, isActive: e.target.checked })}
                      className="accent-crimson"
                    />
                    Aktifkan Petisi
                  </label>
                </div>

                <div className="flex justify-end pt-2 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-md text-xs font-serif font-bold text-white bg-crimson hover:bg-crimson-800 shadow-xs"
                  >
                    {petitionId ? 'Simpan Perubahan Petisi' : 'Buat Petisi'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. KAJIAN TAB */}
        {activeTab === 'kajian' && (
          <div className="bg-white rounded-xl border border-navy/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-navy">
                  Katalog Policy Brief & Kertas Posisi Riset Mahasiswa
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Total {filteredPapers.length} naskah akademik terverifikasi peer-reviewed
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 font-serif font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Judul Naskah & Tipe</th>
                    <th className="py-3 px-4">Peneliti & Lembaga</th>
                    <th className="py-3 px-4">Halaman</th>
                    <th className="py-3 px-4">Sitasi & Unduhan</th>
                    <th className="py-3 px-4">File PDF</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {filteredPapers.map((pp) => (
                    <tr key={pp.id} className="hover:bg-stone-50/80 transition-colors group">
                      <td className="py-3 px-4 max-w-md">
                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-navy text-white shrink-0">
                            {pp.paperCode}
                          </span>
                          <div>
                            <p className="font-serif font-bold text-xs sm:text-[13px] text-stone-900 group-hover:text-navy line-clamp-2">
                              {pp.title}
                            </p>
                            <span className="text-[9.5px] font-semibold text-gold-800 uppercase tracking-wider">
                              {pp.type} • {pp.categoryLabel}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-medium text-stone-800 truncate">{pp.authors}</p>
                        <p className="text-[10px] text-stone-500 truncate">{pp.institution}</p>
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-mono whitespace-nowrap">
                        {pp.pages} Halaman
                      </td>
                      <td className="py-3 px-4 font-mono whitespace-nowrap text-stone-700">
                        {pp.downloads} • {pp.citations}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-navy whitespace-nowrap truncate max-w-[120px]">
                        {pp.fileUrl}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={async () => {
                            if (!confirm('Hapus naskah kajian ini?')) return
                            await fetch(`/api/cms/papers?id=${pp.id}`, { method: 'DELETE' })
                            showNotification('Naskah kajian dihapus')
                            fetchAllData()
                          }}
                          className="p-1 rounded text-stone-400 hover:text-crimson transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. PROGRAM TAB */}
        {activeTab === 'program' && (
          <div className="bg-white rounded-xl border border-navy/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-navy">
                  Agenda Kerja Strategis & Program Gerakan
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Total {filteredPrograms.length} program kerja terdaftar
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateProgram}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif font-bold text-white bg-navy hover:bg-navy-800 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-gold" />
                <span>Tambah Program</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 font-serif font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Nama Program & Kode</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Waktu & Lokasi</th>
                    <th className="py-3 px-4">Penyelenggara</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {filteredPrograms.map((pr) => (
                    <tr key={pr.id} className="hover:bg-stone-50/80 transition-colors group">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-stone-200 text-stone-700 shrink-0">
                            {pr.programCode}
                          </span>
                          <div>
                            <p className="font-serif font-bold text-xs sm:text-[13px] text-stone-900 group-hover:text-navy line-clamp-2">
                              {pr.title}
                            </p>
                            <span className="text-[10px] text-stone-400 font-mono">/{pr.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-stone-700">
                        {pr.category}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-semibold text-stone-800">{pr.dateRange}</p>
                        <p className="text-[10px] text-stone-500 truncate">{pr.locationVenue}</p>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium whitespace-nowrap">
                        {pr.hostOrganizer}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pr.statusColor}`}>
                          {pr.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditProgram(pr)}
                            className="p-1 rounded text-stone-400 hover:text-navy transition-colors"
                            title="Edit program"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Hapus agenda program ini?')) return
                              await fetch(`/api/cms/programs?id=${pr.id}`, { method: 'DELETE' })
                              showNotification('Agenda program dihapus')
                              fetchAllData()
                            }}
                            className="p-1 rounded text-stone-400 hover:text-crimson transition-colors"
                            title="Hapus program"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. PARTNERS TAB */}
        {activeTab === 'partners' && (
          <div className="bg-white rounded-xl border border-navy/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-navy">
                  Direktori Konsorsium Mitra BEM & Jaringan Kampus
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Total {filteredPartners.length} mitra kampus resmi terverifikasi
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPartnerForm({
                    partnerCode: `PTR-${String(partners.length + 1).padStart(3, '0')}`,
                    name: '',
                    shortName: '',
                    category: 'BEM Universitas',
                    badgeType: 'Mitra Kampus',
                    campusFullName: '',
                    campusShortName: '',
                    campusCity: '',
                    campusProvince: 'DKI Jakarta',
                    presmaName: '',
                    cabinetName: 'Kabinet Perjuangan',
                    logoUrl: '/partners/bem-stmik-jayakarta.svg',
                  })
                  setIsPartnerModalOpen(true)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-serif font-bold text-white bg-navy hover:bg-navy-800 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-gold" />
                <span>Daftarkan Mitra Baru</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 font-serif font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Nama Lembaga & Kode</th>
                    <th className="py-3 px-4">Kategori & Tipe</th>
                    <th className="py-3 px-4">Asal Kampus & Kota</th>
                    <th className="py-3 px-4">Presma / Pimpinan</th>
                    <th className="py-3 px-4">Logo Path</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {filteredPartners.map((pt) => (
                    <tr key={pt.id} className="hover:bg-stone-50/80 transition-colors group">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-start gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-navy text-white shrink-0">
                            {pt.partnerCode}
                          </span>
                          <div>
                            <p className="font-serif font-bold text-xs sm:text-[13px] text-stone-900 group-hover:text-navy">
                              {pt.name}
                            </p>
                            <span className="text-[10px] text-gold-700 font-semibold">{pt.badgeType}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">
                        {pt.category}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-semibold text-stone-800">{pt.campusFullName}</p>
                        <p className="text-[10px] text-stone-500">{pt.campusCity}, {pt.campusProvince}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-stone-700">
                        <p className="font-medium">{pt.presmaName}</p>
                        <p className="text-[10px] text-stone-400">{pt.cabinetName}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-stone-500 whitespace-nowrap">
                        {pt.logoUrl}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={async () => {
                            if (!confirm('Hapus mitra ini?')) return
                            await fetch(`/api/cms/partners?id=${pt.id}`, { method: 'DELETE' })
                            showNotification('Profil mitra dihapus')
                            fetchAllData()
                          }}
                          className="p-1 rounded text-stone-400 hover:text-crimson transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. ASPIRASI TAB */}
        {activeTab === 'aspirasi' && (
          <div className="bg-white rounded-xl border border-navy/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-navy">
                  Kotak Masuk Suara & Aspirasi Mahasiswa
                </h3>
                <p className="text-xs text-stone-500 font-sans">
                  Aspirasi dan aduan yang dikirimkan sivitas akademika melalui halaman /kirim-suara
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 font-serif font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Pengirim & Kampus</th>
                    <th className="py-3 px-4">Perihal / Kategori</th>
                    <th className="py-3 px-4">Pesan Aspirasi</th>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Status Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {voices.map((v) => (
                    <tr key={v.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-serif font-bold text-stone-900">{v.name}</p>
                        <p className="text-[10px] text-stone-500">{v.campus} • {v.email}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy/10 text-navy mb-1 inline-block">
                          {v.category}
                        </span>
                        <p className="font-semibold text-stone-800 text-xs">{v.subject}</p>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <p className="text-stone-700 line-clamp-2">{v.message}</p>
                      </td>
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap font-mono text-[10px]">
                        {new Date(v.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={v.status}
                          onChange={async (e) => {
                            await fetch('/api/cms/voices', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: v.id, status: e.target.value }),
                            })
                            showNotification('Status aspirasi diperbarui')
                            fetchAllData()
                          }}
                          className="px-2 py-1 rounded border border-stone-300 text-xs font-serif font-semibold bg-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="DITINJAU">DITINJAU</option>
                          <option value="DITERIMA">DITERIMA</option>
                          <option value="DITOLAK">DITOLAK</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {voices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-400 font-serif italic">
                        Belum ada aspirasi mahasiswa yang masuk ke sistem
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ─── MODAL CREATE ARTICLE ─── */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-navy/20 relative my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-lg text-navy flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-gold" />
                <span>{editingArticleId ? 'Ubah Warta' : 'Terbitkan Warta Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-stone-700 mb-1">
                  Judul Warta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Judul artikel berita mendalam..."
                  value={articleForm.title}
                  onChange={(e) => {
                    const title = e.target.value
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '')
                    setArticleForm({ ...articleForm, title, slug })
                  }}
                  className="w-full px-3 py-2 border rounded-md text-xs font-serif font-bold focus:outline-none focus:border-navy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Kategori Rubrik *
                  </label>
                  <select
                    value={articleForm.categoryKey}
                    onChange={(e) => {
                      const key = e.target.value
                      const labels: Record<string, string> = {
                        politik: 'Politik',
                        hukum: 'Hukum',
                        peristiwa: 'Peristiwa',
                        pendidikan: 'Pendidikan',
                        kesehatan: 'Kesehatan',
                        sosbud: 'Sosial & Budaya',
                      }
                      setArticleForm({
                        ...articleForm,
                        categoryKey: key,
                        category: labels[key] || 'Warta Kampus',
                      })
                    }}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  >
                    <option value="politik">Politik</option>
                    <option value="hukum">Hukum</option>
                    <option value="peristiwa">Peristiwa</option>
                    <option value="pendidikan">Pendidikan</option>
                    <option value="kesehatan">Kesehatan</option>
                    <option value="sosbud">Sosial & Budaya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Kicker Badge
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Laporan Khusus"
                    value={articleForm.kickerBadge}
                    onChange={(e) => setArticleForm({ ...articleForm, kickerBadge: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Edition Badge
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Edisi #12"
                    value={articleForm.editionBadge}
                    onChange={(e) => setArticleForm({ ...articleForm, editionBadge: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-navy">
                  <ImageIcon className="w-4 h-4 text-gold" />
                  <span>Gambar Sampul (Cover)</span>
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                    Opsi 1 — Tempel URL Gambar
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (kosongkan bila tidak pakai gambar)"
                    value={articleForm.coverImageUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, coverImageUrl: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                    Opsi 2 — Unggah dari Perangkat (ke Supabase Storage)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
                      disabled={uploadingArticleCover}
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploadingArticleCover(true)
                        const url = await uploadImage(file, 'articles')
                        if (url) setArticleForm((prev) => ({ ...prev, coverImageUrl: url }))
                        setUploadingArticleCover(false)
                        e.target.value = ''
                      }}
                      className="flex-1 text-[11px] font-sans file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-navy file:text-white file:text-[11px] file:cursor-pointer text-stone-500"
                    />
                    {uploadingArticleCover && (
                      <RefreshCw className="w-4 h-4 text-gold animate-spin shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-[10px] text-stone-400 font-sans">
                    JPG/PNG/WEBP/GIF/AVIF/SVG · maks 5 MB. URL hasil unggah otomatis terisi di Opsi 1.
                  </p>
                  {articleForm.coverImageUrl && (
                    <div className="mt-2 relative w-full h-32 rounded-md overflow-hidden border border-stone-200 bg-stone-100">
                      {/* pratinjau sampul */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={articleForm.coverImageUrl}
                        alt="Pratinjau sampul"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                      Keterangan Gambar
                    </label>
                    <input
                      type="text"
                      placeholder="Caption tampil di bawah gambar"
                      value={articleForm.coverCaption}
                      onChange={(e) => setArticleForm({ ...articleForm, coverCaption: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                      Kredit Foto
                    </label>
                    <input
                      type="text"
                      value={articleForm.coverCredit}
                      onChange={(e) => setArticleForm({ ...articleForm, coverCredit: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                      Gradient Fallback (bila tanpa gambar)
                    </label>
                    <select
                      value={articleForm.imageGrad}
                      onChange={(e) => setArticleForm({ ...articleForm, imageGrad: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    >
                      <option value="from-navy-950 via-navy-900 to-stone-900">Navy Klasik</option>
                      <option value="from-crimson-800 via-navy-900 to-stone-900">Crimson Redaksi</option>
                      <option value="from-stone-800 via-navy-950 to-navy-900">Stone Gelap</option>
                      <option value="from-emerald-900 via-navy-900 to-stone-900">Hijau Riset</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                      Ikon Kartu
                    </label>
                    <select
                      value={articleForm.iconType}
                      onChange={(e) => setArticleForm({ ...articleForm, iconType: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    >
                      <option value="newspaper">Newspaper</option>
                      <option value="scale">Timbangan (Hukum)</option>
                      <option value="megaphone">Megafon (Aksi)</option>
                      <option value="book">Buku (Riset)</option>
                      <option value="building">Gedung (Kampus)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                  Tags (pisahkan dengan koma atau baris baru)
                </label>
                <textarea
                  rows={2}
                  placeholder="misal: UKT, kebijakan kampus, aksi mahasiswa"
                  value={articleForm.tagsText}
                  onChange={(e) => setArticleForm({ ...articleForm, tagsText: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                  Ringkasan / Lead Excerpt
                </label>
                <textarea
                  rows={2}
                  placeholder="Cuplikan 2-3 kalimat pembuka..."
                  value={articleForm.leadExcerpt}
                  onChange={(e) => setArticleForm({ ...articleForm, leadExcerpt: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                  Naskah Berita Lengkap
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan naskah berita lengkap di sini..."
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Penulis / Biro
                  </label>
                  <input
                    type="text"
                    value={articleForm.authorName}
                    onChange={(e) => setArticleForm({ ...articleForm, authorName: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Tanggal Terbit
                  </label>
                  <input
                    type="text"
                    value={articleForm.dateDisplay}
                    onChange={(e) => setArticleForm({ ...articleForm, dateDisplay: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Jabatan Penulis
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Jurnalis Biro Politik"
                    value={articleForm.authorRole}
                    onChange={(e) => setArticleForm({ ...articleForm, authorRole: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    URL Avatar Penulis
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (opsional)"
                    value={articleForm.authorAvatar}
                    onChange={(e) => setArticleForm({ ...articleForm, authorAvatar: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-navy">
                  <Star className="w-4 h-4 text-gold" />
                  <span>Penempatan & Prioritas Tampil</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 text-xs font-sans text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={articleForm.isHeadlineBanner}
                      onChange={(e) => setArticleForm({ ...articleForm, isHeadlineBanner: e.target.checked })}
                      className="w-4 h-4 accent-navy"
                    />
                    <span>Banner Utama</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-sans text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={articleForm.isEditorPick}
                      onChange={(e) => setArticleForm({ ...articleForm, isEditorPick: e.target.checked })}
                      className="w-4 h-4 accent-navy"
                    />
                    <span>Rekomendasi Editor</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-sans text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={articleForm.isTrending}
                      onChange={(e) => setArticleForm({ ...articleForm, isTrending: e.target.checked })}
                      className="w-4 h-4 accent-crimson"
                    />
                    <span>Tren</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                      Ranking Tren (1-10)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Misal: 1"
                      value={articleForm.rankingNo}
                      onChange={(e) => setArticleForm({ ...articleForm, rankingNo: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                      Label Rekomendasi
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: Wajib Baca"
                      value={articleForm.recommendationTag}
                      onChange={(e) => setArticleForm({ ...articleForm, recommendationTag: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-sans font-semibold text-stone-500 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={articleForm.status}
                    onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  >
                    <option value="DRAFT">DRAF (belum tampil publik)</option>
                    <option value="IN_REVIEW">MENUNGGU REVIEW</option>
                    <option value="PUBLISHED">TERBIT (tampil di web)</option>
                    <option value="ARCHIVED">ARSIP</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 rounded-md text-xs font-serif font-bold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md text-xs font-serif font-bold text-white bg-navy hover:bg-navy-900 shadow-xs"
                >
                  {editingArticleId ? 'Simpan Perubahan' : 'Simpan & Terbitkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL CREATE ADVOCACY CASE ─── */}
      {isCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-navy/20 relative my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-lg text-crimson flex items-center gap-2">
                <Scale className="w-5 h-5 text-crimson" />
                <span>Daftarkan Kasus Advokasi Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCaseModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-serif font-bold text-stone-700 mb-1">
                  Judul Gugatan / Sengketa Advokasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Penolakan Kenaikan UKT Golongan 5 Tanpa Transparansi..."
                  value={caseForm.title}
                  onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-xs font-serif font-bold focus:outline-none focus:border-crimson"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Kampus Asal *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Universitas Negeri di Jawa Timur"
                    value={caseForm.campus}
                    onChange={(e) => setCaseForm({ ...caseForm, campus: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Kategori Kasus *
                  </label>
                  <select
                    value={caseForm.category}
                    onChange={(e) => {
                      const cat = e.target.value
                      const labels: Record<string, string> = {
                        ukt: 'UKT & Biaya',
                        represi: 'Represi & Ormawa',
                        ppks: 'PPKS & Etik',
                        fasilitas: 'Pungli & Fasilitas',
                      }
                      setCaseForm({ ...caseForm, category: cat, categoryLabel: labels[cat] || 'Advokasi' })
                    }}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  >
                    <option value="ukt">UKT & Biaya Kuliah</option>
                    <option value="represi">Represi & Pembekuan Ormawa</option>
                    <option value="ppks">PPKS & Etika</option>
                    <option value="fasilitas">Pungutan Liar & Fasilitas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Status Tahapan
                  </label>
                  <select
                    value={caseForm.status}
                    onChange={(e) => {
                      const st = e.target.value
                      const labels: Record<string, string> = {
                        investigasi: 'Tahap Investigasi LBH',
                        audiensi: 'Tahap Audiensi Rektorat',
                        litigasi: 'Mediasi & Somasi Hukum',
                        menang: 'Berhasil Dimenangkan',
                      }
                      const colors: Record<string, string> = {
                        investigasi: 'bg-crimson/10 text-crimson border-crimson/30',
                        audiensi: 'bg-amber-100 text-amber-800 border-amber-300',
                        litigasi: 'bg-navy/10 text-navy border-navy/30',
                        menang: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      }
                      setCaseForm({
                        ...caseForm,
                        status: st,
                        statusLabel: labels[st] || st,
                        statusColor: colors[st] || 'bg-stone-100 text-stone-800',
                      })
                    }}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  >
                    <option value="investigasi">Investigasi</option>
                    <option value="audiensi">Audiensi Rektorat</option>
                    <option value="litigasi">Litigasi / Somasi</option>
                    <option value="menang">Dimenangkan (Selesai)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Persentase Progress: {caseForm.progressPercent}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={caseForm.progressPercent}
                    onChange={(e) => setCaseForm({ ...caseForm, progressPercent: parseInt(e.target.value, 10) })}
                    className="w-full mt-2 accent-crimson"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                  Catatan Pembaruan Terakhir
                </label>
                <textarea
                  rows={2}
                  value={caseForm.lastUpdate}
                  onChange={(e) => setCaseForm({ ...caseForm, lastUpdate: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                  Jumlah Terdampak
                </label>
                <input
                  type="text"
                  value={caseForm.affectedCount}
                  onChange={(e) => setCaseForm({ ...caseForm, affectedCount: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                />
              </div>

              {/* ─── Section Konten Advokasi (cover, narasi, inisiator, urgensi) ─── */}
              <div className="pt-3 border-t border-stone-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                      Cover Gambar (URL)
                    </label>
                    <input
                      type="text"
                      placeholder="/uploads/advokasi/cover.jpg"
                      value={caseForm.coverImageUrl}
                      onChange={(e) => setCaseForm({ ...caseForm, coverImageUrl: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                      Kredit Foto
                    </label>
                    <input
                      type="text"
                      placeholder="Foto: Biro Dokumentasi"
                      value={caseForm.coverCredit}
                      onChange={(e) => setCaseForm({ ...caseForm, coverCredit: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Caption Cover
                  </label>
                  <input
                    type="text"
                    placeholder="Keterangan singkat gambar sampul kasus"
                    value={caseForm.coverCaption}
                    onChange={(e) => setCaseForm({ ...caseForm, coverCaption: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Narasi / Latar Belakang Perkara
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan latar belakang dan konteks perkara advokasi..."
                    value={caseForm.leadBackground}
                    onChange={(e) => setCaseForm({ ...caseForm, leadBackground: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                      Inisiator / Kuasa Pemohon
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: Biro Advokasi Suarantara"
                      value={caseForm.legalCounsel}
                      onChange={(e) => setCaseForm({ ...caseForm, legalCounsel: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                      Label Urgensi
                    </label>
                    <input
                      type="text"
                      placeholder="Misal: URGENSI TINGGI • ADVOKASI NASIONAL"
                      value={caseForm.urgencyLevel}
                      onChange={(e) => setCaseForm({ ...caseForm, urgencyLevel: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Kronologi (1 baris = 1 tahap)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="2026-11-01 | Verifikasi Aduan | Deskripsi singkat | selesai"
                    value={caseForm.timelineText}
                    onChange={(e) => setCaseForm({ ...caseForm, timelineText: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans font-mono"
                  />
                  <p className="mt-1 text-[10px] text-stone-500 font-sans">
                    Format: TANGGAL | JUDUL | DESKRIPSI | STATUS (status: selesai/aktif/rencana)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Dasar Hukum (1 baris = 1 butir)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Pasal 31 UU No. 12/2012 | Penjelasan singkat pelanggaran"
                    value={caseForm.violationsText}
                    onChange={(e) => setCaseForm({ ...caseForm, violationsText: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans font-mono"
                  />
                  <p className="mt-1 text-[10px] text-stone-500 font-sans">
                    Format: PASAL | PENJELASAN
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Tuntutan (1 baris = 1 tuntutan)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Batalkan kenaikan UKT sepihak"
                    value={caseForm.demandsText}
                    onChange={(e) => setCaseForm({ ...caseForm, demandsText: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCaseModalOpen(false)}
                  className="px-4 py-2 rounded-md text-xs font-serif font-bold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md text-xs font-serif font-bold text-white bg-crimson hover:bg-crimson-800 shadow-xs"
                >
                  Daftarkan Kasus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL CREATE PARTNER ─── */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-navy/20 relative my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-lg text-navy flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gold" />
                <span>Daftarkan Mitra Kampus Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Kode Mitra *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.partnerCode}
                    onChange={(e) => setPartnerForm({ ...partnerForm, partnerCode: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-mono font-bold bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Tipe Kemitraan *
                  </label>
                  <select
                    value={partnerForm.badgeType}
                    onChange={(e) => setPartnerForm({ ...partnerForm, badgeType: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  >
                    <option value="Mitra Kampus">Mitra Kampus</option>
                    <option value="Mitra Riset">Mitra Riset</option>
                    <option value="Mitra Pers">Mitra Pers</option>
                    <option value="Mitra Pendiri">Mitra Pendiri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-stone-700 mb-1">
                  Nama Lembaga / Organisasi Mahasiswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BEM Universitas Airlangga"
                  value={partnerForm.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setPartnerForm({ ...partnerForm, name, campusFullName: partnerForm.campusFullName || name })
                  }}
                  className="w-full px-3 py-2 border rounded-md text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Nama Singkat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: BEM Unair"
                    value={partnerForm.shortName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, shortName: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Kategori Ormawa
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: BEM Perguruan Tinggi Negeri"
                    value={partnerForm.category}
                    onChange={(e) => setPartnerForm({ ...partnerForm, category: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Kota Asal Kampus
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Surabaya"
                    value={partnerForm.campusCity}
                    onChange={(e) => setPartnerForm({ ...partnerForm, campusCity: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Provinsi Kampus
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jawa Timur"
                    value={partnerForm.campusProvince}
                    onChange={(e) => setPartnerForm({ ...partnerForm, campusProvince: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Presma / Pimpinan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: M. Fadhil"
                    value={partnerForm.presmaName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, presmaName: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Nama Kabinet
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kabinet Cakrawala"
                    value={partnerForm.cabinetName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, cabinetName: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                  Logo URL / File Path
                </label>
                <input
                  type="text"
                  placeholder="/partners/bem-nusantara.svg"
                  value={partnerForm.logoUrl}
                  onChange={(e) => setPartnerForm({ ...partnerForm, logoUrl: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                />
                <p className="text-[10px] text-stone-400 mt-1 font-sans">
                  Gunakan icon SVG dari folder public/partners atau URL gambar web langsung.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-md text-xs font-serif font-bold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md text-xs font-serif font-bold text-white bg-navy hover:bg-navy-800 shadow-xs"
                >
                  Daftarkan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL CREATE / EDIT PROGRAM ─── */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-navy/20 relative my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-lg text-navy flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                <span>{editingProgramId ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsProgramModalOpen(false)
                  setEditingProgramId(null)
                }}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProgram} className="space-y-5">
              {/* Identitas Program */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-serif font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 pb-1">
                  Identitas Program
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Kode Program *</label>
                    <input
                      type="text"
                      required
                      value={programForm.programCode}
                      onChange={(e) => setProgramForm({ ...programForm, programCode: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-mono font-bold bg-stone-50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Slug URL (opsional)</label>
                    <input
                      type="text"
                      placeholder="kosongkan = otomatis dari kode program"
                      value={programForm.slug}
                      onChange={(e) => setProgramForm({ ...programForm, slug: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif font-bold text-stone-700 mb-1">Judul Program *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sekolah Jurnalisme Investigasi Mahasiswa (SJIM) 2026"
                    value={programForm.title}
                    onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-xs font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Kategori</label>
                    <select
                      value={programForm.category}
                      onChange={(e) => setProgramForm({ ...programForm, category: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    >
                      <option value="Media & Pers">Media &amp; Pers</option>
                      <option value="Advokasi">Advokasi</option>
                      <option value="Riset & Kajian">Riset &amp; Kajian</option>
                      <option value="Pengabdian">Pengabdian</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Status</label>
                    <select
                      value={programForm.status}
                      onChange={(e) => setProgramForm({ ...programForm, status: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    >
                      <option value="Registrasi Dibuka">Registrasi Dibuka</option>
                      <option value="Sedang Berjalan">Sedang Berjalan</option>
                      <option value="Akan Datang">Akan Datang</option>
                      <option value="Edisi Selesai">Edisi Selesai</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Catatan Status</label>
                    <input
                      type="text"
                      placeholder="Contoh: Batas Pendaftaran: 8 November 2026"
                      value={programForm.statusNote}
                      onChange={(e) => setProgramForm({ ...programForm, statusNote: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Warna Badge Status (Tailwind)</label>
                    <input
                      type="text"
                      value={programForm.statusColor}
                      onChange={(e) => setProgramForm({ ...programForm, statusColor: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Ikon</label>
                    <select
                      value={programForm.iconType}
                      onChange={(e) => setProgramForm({ ...programForm, iconType: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    >
                      <option value="newspaper">newspaper</option>
                      <option value="scale">scale</option>
                      <option value="book">book</option>
                      <option value="compass">compass</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Warna Ikon</label>
                    <input
                      type="text"
                      value={programForm.iconColor}
                      onChange={(e) => setProgramForm({ ...programForm, iconColor: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Urutan Tampil</label>
                    <input
                      type="number"
                      value={programForm.sortOrder}
                      onChange={(e) => setProgramForm({ ...programForm, sortOrder: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Gradien Banner (Tailwind)</label>
                  <input
                    type="text"
                    value={programForm.headlineImageGrad}
                    onChange={(e) => setProgramForm({ ...programForm, headlineImageGrad: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-sans font-semibold text-stone-600">
                  <input
                    type="checkbox"
                    checked={programForm.isHeadlineProgram}
                    onChange={(e) => setProgramForm({ ...programForm, isHeadlineProgram: e.target.checked })}
                    className="rounded border-stone-300"
                  />
                  Jadikan Program Unggulan (Headline)
                </label>
              </div>

              {/* Jadwal & Lokasi */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-serif font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 pb-1">
                  Jadwal, Lokasi &amp; Biaya
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Rentang Tanggal *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 12–15 November 2026"
                      value={programForm.dateRange}
                      onChange={(e) => setProgramForm({ ...programForm, dateRange: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Durasi</label>
                    <input
                      type="text"
                      placeholder="Contoh: 4 Hari Penuh (Karantina & Workshop)"
                      value={programForm.duration}
                      onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Lokasi / Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Auditorium Kampus STMIK Jayakarta, Jakarta Pusat"
                    value={programForm.locationVenue}
                    onChange={(e) => setProgramForm({ ...programForm, locationVenue: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Penyelenggara *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kolaborasi BEM STMIK Jayakarta x Redaksi Suarantara"
                    value={programForm.hostOrganizer}
                    onChange={(e) => setProgramForm({ ...programForm, hostOrganizer: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Kuota Peserta</label>
                    <input
                      type="text"
                      placeholder="Contoh: 50 Delegasi Mahasiswa"
                      value={programForm.quota}
                      onChange={(e) => setProgramForm({ ...programForm, quota: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Biaya / Investasi</label>
                    <input
                      type="text"
                      placeholder="Contoh: 100% Bebas Biaya"
                      value={programForm.cost}
                      onChange={(e) => setProgramForm({ ...programForm, cost: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Tanggal Tampil</label>
                    <input
                      type="text"
                      placeholder="Contoh: 31 Oktober 2026"
                      value={programForm.dateDisplay}
                      onChange={(e) => setProgramForm({ ...programForm, dateDisplay: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Publikasi & Sampul */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-serif font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 pb-1">
                  Publikasi &amp; Sampul
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Penulis / Penanggung Jawab</label>
                    <input
                      type="text"
                      value={programForm.author}
                      onChange={(e) => setProgramForm({ ...programForm, author: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Nomor Edisi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Edisi Pelatihan No. 01/2026"
                      value={programForm.editionNumber}
                      onChange={(e) => setProgramForm({ ...programForm, editionNumber: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">URL Gambar Sampul</label>
                  <input
                    type="text"
                    placeholder="https://... atau /tentang-kami-mahasiswa.jpeg"
                    value={programForm.coverImageUrl}
                    onChange={(e) => setProgramForm({ ...programForm, coverImageUrl: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-mono"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
                      disabled={uploadingProgramCover}
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setUploadingProgramCover(true)
                        const url = await uploadImage(file, 'programs')
                        if (url) setProgramForm((prev) => ({ ...prev, coverImageUrl: url }))
                        setUploadingProgramCover(false)
                        e.target.value = ''
                      }}
                      className="flex-1 text-[11px] font-sans file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-navy file:text-white file:text-[11px] file:cursor-pointer text-stone-500"
                    />
                    {uploadingProgramCover && (
                      <RefreshCw className="w-4 h-4 text-gold animate-spin shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-[10px] text-stone-400 font-sans">
                    Atau unggah dari perangkat (Supabase Storage) · maks 5 MB.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Keterangan Gambar</label>
                    <input
                      type="text"
                      placeholder="Caption foto dokumentasi program"
                      value={programForm.coverCaption}
                      onChange={(e) => setProgramForm({ ...programForm, coverCaption: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Kredit Gambar</label>
                    <input
                      type="text"
                      placeholder="Contoh: Dokumentasi Suarantara / BEM"
                      value={programForm.coverCredit}
                      onChange={(e) => setProgramForm({ ...programForm, coverCredit: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Narasi & Konten */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-serif font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 pb-1">
                  Narasi &amp; Konten Detail
                </h4>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">Sinopsis / Lead</label>
                  <textarea
                    rows={2}
                    placeholder="Ringkasan eksekutif program (tampil sebagai lead di halaman detail)."
                    value={programForm.leadBackground}
                    onChange={(e) => setProgramForm({ ...programForm, leadBackground: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Latar Belakang / Urgensi <span className="font-normal text-stone-400">(pisahkan antar paragraf dengan baris kosong)</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paragraf 1...&#10;&#10;Paragraf 2..."
                    value={programForm.backgroundBody}
                    onChange={(e) => setProgramForm({ ...programForm, backgroundBody: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                      Poin Fokus / Highlights <span className="font-normal text-stone-400">(1 baris = 1 poin)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder={'Metodologi Investigasi Anggaran Kampus\nForensik Dokumen & Keamanan Digital'}
                      value={programForm.highlightsText}
                      onChange={(e) => setProgramForm({ ...programForm, highlightsText: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                      Syarat Peserta <span className="font-normal text-stone-400">(1 baris = 1 syarat)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder={'Mahasiswa aktif\nPengurus BEM / pers mahasiswa'}
                      value={programForm.requirementsText}
                      onChange={(e) => setProgramForm({ ...programForm, requirementsText: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Fasilitas Peserta <span className="font-normal text-stone-400">(1 baris = 1 fasilitas)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder={'Sertifikat kelulusan\nAkomodasi & konsumsi'}
                    value={programForm.facilitiesText}
                    onChange={(e) => setProgramForm({ ...programForm, facilitiesText: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Modul / Silabus <span className="font-normal text-stone-400">(1 baris = 1 modul, pisahkan kolom dengan tanda | )</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder={'HARI KE-1 | Anatomi Keuangan Kampus | Deskripsi singkat modul | Nama Fasilitator'}
                    value={programForm.modulesText}
                    onChange={(e) => setProgramForm({ ...programForm, modulesText: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                  <p className="text-[10px] text-stone-400 mt-1 font-sans">
                    Format: <span className="font-mono">HARI | JUDUL | DESKRIPSI | FASILITATOR</span>
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-sans font-semibold text-stone-600 mb-1">
                    Timeline Seleksi <span className="font-normal text-stone-400">(1 baris = 1 tahapan, pisahkan kolom dengan tanda | )</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder={'1–8 November 2026 | Pendaftaran Berkas & Ide Investigasi\n9–10 November 2026 | Verifikasi Tim Kurasi Redaksi'}
                    value={programForm.timelineText}
                    onChange={(e) => setProgramForm({ ...programForm, timelineText: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md text-xs font-sans"
                  />
                  <p className="text-[10px] text-stone-400 mt-1 font-sans">
                    Format: <span className="font-mono">TANGGAL | JUDUL TAHAPAN</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsProgramModalOpen(false)
                    setEditingProgramId(null)
                  }}
                  className="px-4 py-2 rounded-md text-xs font-serif font-bold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md text-xs font-serif font-bold text-white bg-navy hover:bg-navy-800 shadow-xs"
                >
                  {editingProgramId ? 'Simpan Perubahan' : 'Buat Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
