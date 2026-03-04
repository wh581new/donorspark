'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Check,
  Copy,
  CheckCircle2,
  ArrowRight,
  Heart,
  Share2,
  Settings,
  Mail,
  AlertCircle,
  Clock,
  Gift,
  Users,
  Zap,
  ChevronRight,
  ArrowUpRight,
  Upload,
  X,
  Image as ImageIcon,
  Coffee,
  DollarSign,
  TrendingUp,
  Sparkles,
} from 'lucide-react'

/* ────────────────────────────────────────────────
   BetterWorld SVG Logo (official brand wordmark)
   ──────────────────────────────────────────────── */
function BetterWorldLogo({ className = '' }: { className?: string; color?: string }) {
  return (
    <img
      src="https://betterworld.org/assets/brand/wordmark-denim.svg"
      alt="BetterWorld"
      className={className}
      draggable={false}
    />
  )
}

/* ────────────────────────────────────────────────
   Constants & animation config
   ──────────────────────────────────────────────── */
const PRESET_COLORS = [
  '#6b8b74', '#3b82f6', '#ef4444', '#8b5cf6', '#f59e0b', '#64748b',
  '#e11d48', '#0891b2', '#16a34a', '#9333ea', '#ea580c', '#475569',
]

const ease = [0.22, 1, 0.36, 1] as const

/* ────────────────────────────────────────────────
   Hero product imagery (Unsplash)
   ──────────────────────────────────────────────── */
const HERO_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80&auto=format&fit=crop'
const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80&auto=format&fit=crop',
]

/* ────────────────────────────────────────────────
   Before/After coffee shop examples
   ──────────────────────────────────────────────── */
const BEFORE_AFTER_EXAMPLES = [
  {
    before: {
      title: '$25 Gift Card',
      amount: 25,
      emoji: '🎁',
      desc: 'Generic gift card donation',
      img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80&auto=format&fit=crop',
    },
    after: {
      title: 'Free Drip Coffee for a Year',
      amount: 200,
      emoji: '☕',
      desc: 'Costs the shop ~$40 in beans, raises 8x more',
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80&auto=format&fit=crop',
    },
    multiplier: '8x',
  },
  {
    before: {
      title: '3 Bags of Coffee',
      amount: 25,
      emoji: '☕',
      desc: 'A few bags of house blend',
      img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=600&q=80&auto=format&fit=crop',
    },
    after: {
      title: 'Afternoon Tea Baby Shower',
      amount: 600,
      emoji: '🫖',
      desc: 'Private event space + catering for 12 guests',
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&auto=format&fit=crop',
    },
    multiplier: '24x',
  },
  {
    before: {
      title: 'Set of Two Mugs',
      amount: 25,
      emoji: '☕',
      desc: 'A pair of branded coffee mugs',
      img: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80&auto=format&fit=crop',
    },
    after: {
      title: 'Name the Drink of the Month',
      amount: 400,
      emoji: '💕',
      desc: 'Name a signature drink after someone you love',
      img: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&q=80&auto=format&fit=crop',
    },
    multiplier: '16x',
  },
]

/* ────────────────────────────────────────────────
   Before/After Card Component
   ──────────────────────────────────────────────── */
function BeforeAfterCard({ example, index }: { example: typeof BEFORE_AFTER_EXAMPLES[0]; index: number }) {
  const [sliderPos, setSliderPos] = useState(95)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setSliderPos((x / rect.width) * 100)
  }

  const handleMouseDown = () => setIsDragging(true)

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false)
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX)
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX)
    }
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchend', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isDragging])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease }}
      viewport={{ once: true }}
      className="group"
    >
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden cursor-col-resize select-none bg-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-200/60"
        style={{ height: '340px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* After (full background) */}
        <div className="absolute inset-0">
          <img
            src={example.after.img}
            alt={example.after.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{example.after.emoji}</span>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded-full">
                After
              </span>
            </div>
            <p className="text-white text-xl font-bold tracking-tight">{example.after.title}</p>
            <p className="text-emerald-100/80 text-sm mt-1">{example.after.desc}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-bold text-white">${example.after.amount}</span>
              <span className="text-emerald-300 text-sm font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {example.multiplier} more
              </span>
            </div>
          </div>
        </div>

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="absolute inset-0" style={{ width: `${containerRef.current ? containerRef.current.offsetWidth : 400}px` }}>
            <img
              src={example.before.img}
              alt={example.before.title}
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(30%) brightness(0.85)' }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{example.before.emoji}</span>
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider bg-gray-500/30 px-2 py-0.5 rounded-full">
                  Before
                </span>
              </div>
              <p className="text-white text-xl font-bold tracking-tight">{example.before.title}</p>
              <p className="text-gray-300/80 text-sm mt-1">{example.before.desc}</p>
              <div className="mt-3">
                <span className="text-3xl font-bold text-white">${example.before.amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0.5 h-full bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.3)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:scale-110 transition-transform">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 3L2 8L5 13" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 3L14 8L11 13" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    adminEmail: '',
    logoUrl: '',
    message: '',
    brandColor: '#6b8b74',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    slug: string
    donorLink: string
    adminLink: string
    accessToken: string
  } | null>(null)

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showKonami, setShowKonami] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Logo must be under 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setLogoPreview(dataUrl)
      setFormData((prev) => ({ ...prev, logoUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleLogoFile(file)
  }

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleLogoFile(file)
  }

  const removeLogo = () => {
    setLogoPreview(null)
    setFormData((prev) => ({ ...prev, logoUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formRef = useRef<HTMLDivElement>(null)
  const formInView = useInView(formRef, { once: true, margin: '-80px' })

  useEffect(() => {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    let buffer: string[] = []

    const handleKeyDown = (e: KeyboardEvent) => {
      buffer.push(e.key)
      buffer = buffer.slice(-10)
      if (buffer.join(',') === konamiSequence.join(',')) {
        setShowKonami(true)
        setTimeout(() => setShowKonami(false), 3000)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/org/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      const orgSlug = data.org.slug
      const token = data.org.accessToken
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const donorLink = `${origin}/org/${orgSlug}`
      const adminLink = `${origin}/admin/${token}`

      setSuccess({ slug: orgSlug, donorLink, adminLink, accessToken: token })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      // Fallback for non-HTTPS or denied permissions
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /* ──────── Success State ──────── */
  if (success) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="w-full max-w-xl"
        >
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Header */}
            <div className="px-10 pt-14 pb-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
                className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </motion.div>
              <h1 className="text-2xl font-semibold text-navy-900 mb-2 tracking-tight">
                You&apos;re all set
              </h1>
              <p className="text-gray-500 text-[15px]">
                Your organization is live. Share the donor link to start collecting auction items.
              </p>
            </div>

            {/* Links */}
            <div className="px-10 pb-10 space-y-5">
              {/* Donor link */}
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Donor Link
                </label>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <input
                    type="text"
                    value={success.donorLink}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 font-mono outline-none truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(success.donorLink, 'donor')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copiedField === 'donor' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Admin link */}
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                  Admin Dashboard
                </label>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <input
                    type="text"
                    value={success.adminLink}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 font-mono outline-none truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(success.adminLink, 'admin')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copiedField === 'admin' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-50/60 border border-amber-100 rounded-xl px-4 py-3 flex gap-3 items-start">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-amber-700">
                  Bookmark your admin link — it&apos;s your only way to manage submissions.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => copyToClipboard(success.donorLink, 'donor-cta')}
                  className="flex-1 bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Copy Donor Link
                </button>
                <button
                  onClick={() => window.open(success.adminLink, '_blank')}
                  className="flex-1 bg-white hover:bg-gray-50 text-navy-900 text-sm font-medium py-3 rounded-xl transition-colors border border-gray-200 flex items-center justify-center gap-2"
                >
                  Open Dashboard
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Powered by */}
          <div className="text-center mt-8">
            <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-500 transition-colors text-sm">
              Powered by
              <BetterWorldLogo className="h-4 w-auto" color="#9ca3af" />
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  /* ──────── Main Marketing Page ──────── */
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <AnimatePresence>
        {showKonami && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-navy-900 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium flex items-center gap-2"
          >
            🎮 Achievement Unlocked: Secret Donor Mode!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-navy-900 text-[15px] tracking-tight">
              What Could I Offer?
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              by
              <BetterWorldLogo className="h-3.5 w-auto" color="#9ca3af" />
            </a>
            <button
              onClick={scrollToForm}
              className="bg-navy-900 hover:bg-navy-800 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="mb-5"
            >
              <span className="inline-flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-100 rounded-full px-4 py-1.5">
                <Zap className="w-3.5 h-3.5" />
                AI-Powered Auction Item Discovery
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
              className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-navy-900 leading-[1.05] tracking-tight mb-6"
            >
              Unlock the hidden
              <br />
              generosity of your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                donors.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-lg"
            >
              Help supporters discover creative auction items they never knew they could give. Set up in 60 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={scrollToForm}
                className="group inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-medium py-3.5 px-7 rounded-full transition-all text-[15px]"
              >
                Create your page
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="/org/demo"
                className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-navy-900 font-medium py-3.5 px-7 rounded-full border border-gray-200 hover:border-gray-300 transition-all text-[15px] bg-white"
              >
                See a live demo
              </a>
            </motion.div>
          </div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="max-w-6xl mx-auto mt-20"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)] border border-gray-200/60">
            <img
              src={HERO_IMAGE}
              alt="Charity gala event"
              className="w-full h-[320px] sm:h-[440px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">Trusted by nonprofits everywhere</p>
                  <p className="text-white text-2xl sm:text-3xl font-semibold tracking-tight">
                    Raise more. With less effort.
                  </p>
                </div>
                <div className="hidden sm:flex gap-6">
                  {[
                    { val: '60 sec', sub: 'setup' },
                    { val: '30%', sub: 'more items' },
                    { val: 'Free', sub: 'forever' },
                  ].map((s, i) => (
                    <div key={i} className="text-right">
                      <p className="text-white text-xl font-semibold">{s.val}</p>
                      <p className="text-white/60 text-xs">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2: WHY IT WORKS (moved up)
          ══════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-[0_16px_64px_rgba(0,0,0,0.08)]">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80&auto=format&fit=crop"
                  alt="Community fundraising"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hidden sm:block"
              >
                <p className="text-3xl font-bold text-navy-900">30%</p>
                <p className="text-sm text-gray-500">more auction items<br />on average</p>
              </motion.div>
            </motion.div>

            {/* Right: Features */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium text-emerald-600 mb-3 tracking-wide uppercase">Why it works</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mb-6">
                Most donors don&apos;t know what to give. AI changes that.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                Our AI asks thoughtful questions about hobbies, skills, and connections — then suggests creative auction items they never would have thought of.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Zap, title: 'Instant suggestions', desc: 'AI generates personalized auction item ideas in seconds' },
                  { icon: Heart, title: 'Higher value items', desc: 'Uncovers experiences and services that fetch premium bids' },
                  { icon: Users, title: 'Multi-org support', desc: 'Each nonprofit gets its own branded page and dashboard' },
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900 text-[15px]">{f.title}</p>
                      <p className="text-gray-500 text-sm">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3: BEFORE/AFTER EXAMPLES (NEW)
          ══════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <p className="text-sm font-medium text-emerald-600 mb-3 tracking-wide uppercase">See the difference</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy-900 tracking-tight">
              Same coffee shop. Way more impact.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            viewport={{ once: true }}
            className="text-center text-gray-500 text-lg max-w-2xl mx-auto mb-16"
          >
            A local coffee shop usually donates a $25 gift card. With AI, we help them discover offerings that raise <span className="text-navy-900 font-semibold">8&ndash;24x more</span> — at almost no extra cost. Drag the slider to compare.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {BEFORE_AFTER_EXAMPLES.map((example, idx) => (
              <BeforeAfterCard key={idx} example={example} index={idx} />
            ))}
          </div>

          {/* Summary bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Coffee className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">One coffee shop. Three creative offerings.</p>
                <p className="text-gray-400 text-sm">$75 in basic donations → $1,200 in auction value</p>
              </div>
            </div>
            <button
              onClick={scrollToForm}
              className="group bg-white hover:bg-gray-100 text-navy-900 font-medium py-3 px-6 rounded-full transition-all text-sm flex items-center gap-2 flex-shrink-0"
            >
              Try it free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4: HOW IT WORKS
          ══════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-medium text-emerald-600 mb-3 tracking-wide uppercase">How it works</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy-900 tracking-tight">
              Three steps to better auctions
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                num: '01',
                icon: Settings,
                title: 'Create your page',
                desc: 'Add your organization name, brand color, and a message for your donors. Takes about two minutes.',
                img: PRODUCT_IMAGES[0],
              },
              {
                num: '02',
                icon: Share2,
                title: 'Share with donors',
                desc: 'Send your custom link via email, social, or embed it on your website. Each org gets a branded page.',
                img: PRODUCT_IMAGES[1],
              },
              {
                num: '03',
                icon: Gift,
                title: 'Collect offerings',
                desc: 'AI helps donors discover what they can give — from vacation homes to guitar lessons. You review and curate.',
                img: PRODUCT_IMAGES[2],
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden mb-6 bg-gray-100">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-navy-900">{item.num}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Form ── */}
      <section ref={formRef} className="py-28 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mb-3">
              Get started for free
            </h2>
            <p className="text-gray-500 text-lg">
              Set up your organization in under 2 minutes.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="space-y-5"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex gap-3 items-start"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {/* Org Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Organization name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your nonprofit's name"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all text-[15px] placeholder:text-gray-400 bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Admin email
              </label>
              <input
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                placeholder="you@nonprofit.org"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all text-[15px] placeholder:text-gray-400 bg-white"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Logo <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />
              {logoPreview ? (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <img src={logoPreview} alt="Logo preview" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">Logo uploaded</p>
                    <p className="text-xs text-gray-400">Click to replace or drag a new one</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleLogoDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 py-6 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    dragActive
                      ? 'border-gray-400 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      <span className="text-gray-700 font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, SVG up to 2MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Color */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Brand color
              </label>
              <div className="flex items-center gap-4">
                {/* Color wheel input */}
                <div className="relative group">
                  <input
                    type="color"
                    value={formData.brandColor}
                    onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
                    className="w-14 h-14 rounded-2xl cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-all appearance-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-xl [&::-moz-color-swatch]:border-none"
                  />
                </div>
                {/* Quick presets */}
                <div className="flex flex-wrap gap-2 flex-1">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, brandColor: color })}
                      className={`w-7 h-7 rounded-full transition-all ${
                        formData.brandColor === color
                          ? 'ring-2 ring-offset-1 ring-gray-900 scale-110'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {formData.brandColor === color && (
                        <Check className="w-3 h-3 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Click the color wheel or pick a preset</p>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Message to donors <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="We're raising funds for our annual gala..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all resize-none text-[15px] placeholder:text-gray-400 bg-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-900 hover:bg-navy-800 disabled:bg-gray-400 text-white font-medium py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 text-[15px]"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Clock className="w-4 h-4" />
                  </motion.div>
                  Creating...
                </>
              ) : (
                <>
                  Create organization
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              Free forever. No credit card required.
            </p>
          </motion.form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-12 px-6 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Powered by</span>
            <a
              href="https://betterworld.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="transition-all duration-500 group-hover:hue-rotate-[45deg]">
                <BetterWorldLogo className="h-5 w-auto transition-all duration-500 group-hover:scale-110" color="#6b7280" />
              </div>
            </a>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="https://help.betterworld.org/en/articles/8557905-privacy-policy" className="hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <a href="https://help.betterworld.org/en/articles/8557943-terms-conditions" className="hover:text-gray-600 transition-colors">
              Terms
            </a>
            <a href="mailto:support@betterworld.org" className="hover:text-gray-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
