'use client'

import { useState, useRef } from 'react'
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
} from 'lucide-react'

/* ────────────────────────────────────────────────
   BetterWorld SVG Logo (matches brand book)
   ──────────────────────────────────────────────── */
function BetterWorldLogo({ className = '', color = '#3d5566' }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 74" fill={color} xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="58" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" fontSize="68" fontWeight="600" letterSpacing="-2">
        betterworld
      </text>
    </svg>
  )
}

/* ────────────────────────────────────────────────
   Constants & animation config
   ──────────────────────────────────────────────── */
const BRAND_COLORS = [
  { name: 'Sage', value: '#6b8b74' },
  { name: 'Ocean', value: '#3b82f6' },
  { name: 'Coral', value: '#ef4444' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Slate', value: '#64748b' },
] as const

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

  const formRef = useRef<HTMLDivElement>(null)
  const formInView = useInView(formRef, { once: true, margin: '-80px' })

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
      const donorLink = `https://whatcouldioffer.com/org/${orgSlug}`
      const adminLink = `https://whatcouldioffer.com/admin/${token}`

      setSuccess({ slug: orgSlug, donorLink, adminLink, accessToken: token })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
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
              <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
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
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Copy Donor Link
                </button>
                <button
                  onClick={() => window.open(success.adminLink, '_blank')}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium py-3 rounded-xl transition-colors border border-gray-200 flex items-center justify-center gap-2"
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
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Gift className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-[15px] tracking-tight">
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
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
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
                AI-Powered Auction Discovery
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
              className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-gray-900 leading-[1.05] tracking-tight mb-6"
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
              Help supporters discover creative auction items they never knew they could give. Set up in 2 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={scrollToForm}
                className="group inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 px-7 rounded-full transition-all text-[15px]"
              >
                Create your page
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="https://whatcouldioffer.com/org/demo"
                className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium py-3.5 px-7 rounded-full border border-gray-200 hover:border-gray-300 transition-all text-[15px] bg-white"
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
                    { val: '5 min', sub: 'setup' },
                    { val: '30%', sub: 'more items' },
                    { val: '100K+', sub: 'orgs served' },
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

      {/* ── How it works ── */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-medium text-emerald-600 mb-3 tracking-wide uppercase">How it works</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
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
                    <span className="text-sm font-semibold text-gray-900">{item.num}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof / features ── */}
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
                <p className="text-3xl font-bold text-gray-900">30%</p>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-6">
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
                      <p className="font-semibold text-gray-900 text-[15px]">{f.title}</p>
                      <p className="text-gray-500 text-sm">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
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

            {/* Logo URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Logo URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://yoursite.org/logo.png"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all text-[15px] placeholder:text-gray-400 bg-white"
              />
            </div>

            {/* Brand Color */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Brand color
              </label>
              <div className="flex gap-3">
                {BRAND_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, brandColor: color.value })}
                    className={`w-10 h-10 rounded-full transition-all ${
                      formData.brandColor === color.value
                        ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {formData.brandColor === color.value && (
                      <Check className="w-4 h-4 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
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
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 text-[15px]"
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
            <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer">
              <BetterWorldLogo className="h-5 w-auto" color="#6b7280" />
            </a>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="https://betterworld.org/privacy" className="hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <a href="https://betterworld.org/terms" className="hover:text-gray-600 transition-colors">
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
