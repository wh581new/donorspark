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
   Animated Counter Hook & Stats Section
   ──────────────────────────────────────────────── */
function AnimatedStat({ target, prefix = '', suffix = '', label, icon: Icon }: { target: number; prefix?: string; suffix?: string; label: string; icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const count = useCountUp(target, 2000, inView)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="text-center"
    >
      <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
      <p className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-2">{prefix}{count.toLocaleString()}{suffix}</p>
      <p className="text-gray-400 text-sm sm:text-base">{label}</p>
    </motion.div>
  )
}

function useCountUp(target: number, duration: number = 2000, inView: boolean = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])
  return count
}

/* ────────────────────────────────────────────────
   Summary Bar with Animated Numbers
   ──────────────────────────────────────────────── */
function SummaryBar({ scrollToForm }: { scrollToForm: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const donationCount = useCountUp(75, 1600, inView)
  const auctionCount = useCountUp(1200, 2000, inView)
  const multiplier = useCountUp(16, 1800, inView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
    >
      {/* Subtle glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]" />
      <div className="flex items-center gap-4 relative">
        <motion.div
          whileInView={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center"
        >
          <Coffee className="w-6 h-6 text-emerald-400" />
        </motion.div>
        <div>
          <p className="text-white font-semibold text-lg">One coffee shop. Three creative offerings.</p>
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">${donationCount}</span> in basic donations →{' '}
            <span className="text-emerald-400 font-bold">${auctionCount.toLocaleString()}</span> in auction value —{' '}
            <span className="text-emerald-400 font-semibold">{multiplier}x more</span>
          </p>
        </div>
      </div>
      <button
        onClick={scrollToForm}
        className="group bg-white hover:bg-gray-100 text-navy-900 font-medium py-3 px-6 rounded-full transition-all text-sm flex items-center gap-2 flex-shrink-0 hover:shadow-lg hover:shadow-white/10"
      >
        Try it free
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────
   Animated Hero Demo Component
   ──────────────────────────────────────────────── */
const DEMO_PROFILES = [
  {
    text: "I'm a dentist who loves golf and wine 🦷⛳🍷",
    suggestions: [
      { title: 'Teeth Whitening Package', value: 800, emoji: '✨', delay: 0.6 },
      { title: 'Golf Foursome + Lunch', value: 1200, emoji: '⛳', delay: 1.2 },
      { title: 'Private Wine Tasting for 8', value: 600, emoji: '🍷', delay: 1.8 },
    ],
  },
  {
    text: "We own a bakery and have a lake house 🧁🏡",
    suggestions: [
      { title: 'Custom Wedding Cake', value: 1500, emoji: '🎂', delay: 0.6 },
      { title: 'Weekend at the Lake House', value: 2500, emoji: '🏡', delay: 1.2 },
      { title: 'Baking Class for 10', value: 400, emoji: '👩‍🍳', delay: 1.8 },
    ],
  },
  {
    text: "I'm a photographer with a boat 📸⛵",
    suggestions: [
      { title: 'Family Portrait Session', value: 500, emoji: '📸', delay: 0.6 },
      { title: 'Sunset Sail for 6', value: 900, emoji: '⛵', delay: 1.2 },
      { title: 'Photo + Boat Party Package', value: 1800, emoji: '🎉', delay: 1.8 },
    ],
  },
]

function HeroDemo() {
  const [profileIdx, setProfileIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'thinking' | 'results' | 'pause'>('typing')
  const [displayedText, setDisplayedText] = useState('')
  const [visibleCards, setVisibleCards] = useState(0)
  const [totalValue, setTotalValue] = useState(0)

  const profile = DEMO_PROFILES[profileIdx]

  // Typing effect
  useEffect(() => {
    if (phase !== 'typing') return
    setDisplayedText('')
    setVisibleCards(0)
    setTotalValue(0)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayedText(profile.text.slice(0, i))
      if (i >= profile.text.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('thinking'), 400)
      }
    }, 35)
    return () => clearInterval(interval)
  }, [phase, profileIdx])

  // Thinking → results
  useEffect(() => {
    if (phase !== 'thinking') return
    const timer = setTimeout(() => setPhase('results'), 1200)
    return () => clearTimeout(timer)
  }, [phase])

  // Show cards one by one
  useEffect(() => {
    if (phase !== 'results') return
    setVisibleCards(0)
    const timers = profile.suggestions.map((s, i) =>
      setTimeout(() => {
        setVisibleCards(i + 1)
        setTotalValue(prev => prev + s.value)
      }, s.delay * 1000)
    )
    // Pause then cycle to next
    const cycleTimer = setTimeout(() => {
      setPhase('pause')
      setTimeout(() => {
        setProfileIdx(prev => (prev + 1) % DEMO_PROFILES.length)
        setPhase('typing')
      }, 2000)
    }, 4500)
    return () => { timers.forEach(clearTimeout); clearTimeout(cycleTimer) }
  }, [phase, profileIdx])

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.12)] border border-gray-200/60 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      <div className="relative p-6 sm:p-10 min-h-[360px] sm:min-h-[440px] flex flex-col">
        {/* Mock browser bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 bg-white/10 rounded-lg px-4 py-1.5 ml-3">
            <span className="text-white/40 text-xs font-mono">whatcouldioffer.com/org/your-nonprofit</span>
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white/[0.07] backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-5 mb-5">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Tell us about yourself</p>
          <div className="flex items-center gap-2">
            <p className="text-white text-base sm:text-lg font-medium flex-1 min-h-[28px]">
              {displayedText}
              {phase === 'typing' && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-emerald-400 ml-0.5 align-middle"
                />
              )}
            </p>
          </div>
        </div>

        {/* AI thinking indicator */}
        <AnimatePresence>
          {phase === 'thinking' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-emerald-400"
                  />
                ))}
              </div>
              <span className="text-emerald-400/80 text-sm">Discovering auction ideas...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestion cards */}
        <div className="flex-1 flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {(phase === 'results' || phase === 'pause') && profile.suggestions.slice(0, visibleCards).map((s, i) => (
              <motion.div
                key={`${profileIdx}-${i}`}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 bg-white/[0.07] backdrop-blur-sm rounded-xl border border-white/10 p-3 sm:p-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl flex-shrink-0">
                  {s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm sm:text-[15px] truncate">{s.title}</p>
                  <p className="text-white/40 text-xs">Estimated auction value</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-emerald-400 font-bold text-lg sm:text-xl">${s.value.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total value bar */}
        <AnimatePresence>
          {totalValue > 0 && (phase === 'results' || phase === 'pause') && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between"
            >
              <span className="text-white/50 text-sm font-medium">Total auction value discovered</span>
              <motion.span
                key={totalValue}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-emerald-400 font-bold text-2xl"
              >
                ${totalValue.toLocaleString()}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

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
            <div className="flex flex-col">
              <span className="font-semibold text-navy-900 text-[15px] tracking-tight leading-tight">
                What Could I Offer?
              </span>
              <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] text-navy-900/60 hover:text-navy-900 transition-colors leading-tight">
                by
                <BetterWorldLogo className="h-2 w-auto" color="#1a2640" />
              </a>
            </div>
          </div>
          <div className="flex items-center">
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
        {/* Animated gradient background orbs */}
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/6 w-[400px] h-[400px] bg-teal-100/30 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-sky-100/20 rounded-full blur-[80px] pointer-events-none"
        />
        <div className="max-w-6xl mx-auto relative">
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
              Unlock the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                hidden
                <br />
                generosity
              </span>{' '}of your
              <br />
              donors.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-lg"
            >
              AI-powered auction item discovery that helps your supporters give more than they ever thought possible. <span className="text-navy-900 font-semibold">Raise 10x+ more in your next auction.</span>
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

        {/* Animated product demo */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="max-w-6xl mx-auto mt-20"
        >
          <HeroDemo />
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
          SECTION: ANIMATED STATS BAR
          ══════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Subtle animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px]"
        />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
            <AnimatedStat target={2400} suffix="+" label="Auction items discovered" icon={Gift} />
            <AnimatedStat target={380} prefix="$" suffix="K+" label="In potential auction value" icon={TrendingUp} />
            <AnimatedStat target={150} suffix="+" label="Nonprofits using WCIO" icon={Users} />
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

          {/* Summary bar — animated */}
          <SummaryBar scrollToForm={scrollToForm} />
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
                transition={{ duration: 0.6, delay: idx * 0.15, ease }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group cursor-default"
              >
                <div className="relative rounded-2xl overflow-hidden mb-6 bg-gray-100 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                    <span className="text-sm font-semibold text-navy-900 group-hover:text-white transition-colors duration-300">{item.num}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-navy-900 mb-2 tracking-tight group-hover:text-emerald-700 transition-colors duration-300">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Form ── */}
      <section ref={formRef} className="py-28 px-6 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -right-32 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 -left-32 w-64 h-64 bg-teal-50 rounded-full blur-[80px] pointer-events-none"
        />
        <div className="max-w-xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={formInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={formInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5"
            >
              <Sparkles className="w-7 h-7 text-emerald-600" />
            </motion.div>
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
