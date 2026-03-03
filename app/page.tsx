'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Check,
  Copy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
  Settings,
  Mail,
  AlertCircle,
  ChevronDown,
  Clock,
} from 'lucide-react'

const BRAND_COLORS = [
  { name: 'Sage Green', value: '#6b8b74', tw: 'bg-brand-500' },
  { name: 'Ocean Blue', value: '#3b82f6', tw: 'bg-blue-500' },
  { name: 'Warm Coral', value: '#ef4444', tw: 'bg-red-500' },
  { name: 'Royal Purple', value: '#8b5cf6', tw: 'bg-purple-500' },
  { name: 'Amber Gold', value: '#f59e0b', tw: 'bg-amber-500' },
  { name: 'Slate', value: '#64748b', tw: 'bg-slate-500' },
] as const

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
} as const

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const

const easeInOutCubic = [0.4, 0, 0.2, 1] as const

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
  const formInView = useInView(formRef, { once: true, margin: '-100px' })

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

      setSuccess({
        slug: orgSlug,
        donorLink,
        adminLink,
        accessToken: token,
      })
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 via-cream to-white flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-brand-100 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Organization Created!
              </h1>
              <p className="text-brand-50">
                You're all set to start discovering donor gifts
              </p>
            </div>

            {/* Success Content */}
            <div className="p-8 space-y-8">
              {/* Links Section */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-6"
              >
                {/* Donor Link */}
                <motion.div variants={fadeInUp} className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-5 h-5 text-brand-600" />
                    <label className="font-semibold text-gray-900">
                      Share with Donors
                    </label>
                  </div>
                  <div className="flex gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <input
                      type="text"
                      value={success.donorLink}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 font-mono outline-none"
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(success.donorLink, 'donor')
                      }
                      className="px-3 py-1 rounded bg-brand-100 hover:bg-brand-200 text-brand-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      {copiedField === 'donor' ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Share this link with your donors to get started
                  </p>
                </motion.div>

                {/* Admin Dashboard Link */}
                <motion.div variants={fadeInUp} className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-brand-600" />
                    <label className="font-semibold text-gray-900">
                      Your Admin Dashboard
                    </label>
                  </div>
                  <div className="flex gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <input
                      type="text"
                      value={success.adminLink}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 font-mono outline-none"
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(success.adminLink, 'admin')
                      }
                      className="px-3 py-1 rounded bg-brand-100 hover:bg-brand-200 text-brand-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      {copiedField === 'admin' ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Warning */}
                <motion.div
                  variants={fadeInUp}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">
                      Save your admin link
                    </p>
                    <p className="text-sm text-amber-800">
                      It's your only way to access your dashboard. Bookmark it or
                      save it in a secure location.
                    </p>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={fadeInUp}
                  className="flex gap-3 pt-4 flex-col sm:flex-row"
                >
                  <button
                    onClick={() =>
                      copyToClipboard(success.donorLink, 'donor-cta')
                    }
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Share Donor Link
                  </button>
                  <button
                    onClick={() =>
                      window.open(success.adminLink, '_blank')
                    }
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Go to Dashboard
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-gray-600 text-sm mt-6"
          >
            Questions? Email us at support@whatcouldioffer.com
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 via-navy-800 to-brand-900 text-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500 rounded-full opacity-10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <div className="bg-brand-500/20 border border-brand-500/40 rounded-full px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-300" />
              <span className="text-brand-100 text-sm font-medium">
                AI-Powered Discovery
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            What Could I{' '}
            <span className="bg-gradient-to-r from-brand-300 to-blue-300 bg-clip-text text-transparent">
              Offer?
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered auction item discovery that helps nonprofits unlock the hidden
            generosity of their donors. Watch as your community discovers what they can
            offer.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 mb-12 max-w-xl mx-auto"
          >
            {[
              { label: 'Nonprofits Helped', value: '200+' },
              { label: 'Auction Items Found', value: '5K+' },
              { label: 'Funds Raised', value: '$2.5M+' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold text-brand-300 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={scrollToForm}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
            >
              Set Up Your Organization
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-brand-400" />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-brand-900 to-cream">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your nonprofit up and running in three simple steps
            </p>
          </motion.div>

          {/* Steps Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: 1,
                icon: Settings,
                title: 'Set Up Your Organization',
                description:
                  'Tell us about your nonprofit, customize your branding, and set your mission message for donors.',
              },
              {
                step: 2,
                icon: Share2,
                title: 'Share Your Unique Link',
                description:
                  'Invite your donors with your custom link. Each organization gets its own branded experience.',
              },
              {
                step: 3,
                icon: Heart,
                title: 'Discover Donor Gifts',
                description:
                  'Watch as donors discover and share what they can offer. Build your auction items easily.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="relative group"
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative bg-white rounded-2xl p-8 border-2 border-brand-100 group-hover:border-brand-300 transition-colors duration-300 h-full flex flex-col">
                  {/* Step Badge */}
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 text-brand-600 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                    <item.icon className="w-12 h-12" />
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {item.description}
                  </p>

                  {/* Arrow */}
                  {idx < 2 && (
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2"
                    >
                      <ArrowRight className="w-6 h-6 text-brand-400" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section
        ref={formRef}
        className="py-20 px-4 bg-cream min-h-screen flex items-center"
      >
        <div className="w-full max-w-2xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Create Your Organization
            </h2>
            <p className="text-lg text-gray-600">
              Get started in less than 2 minutes
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl border-2 border-brand-100 p-8 space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            {/* Organization Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={formInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your nonprofit's name"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all placeholder-gray-400"
              />
            </motion.div>

            {/* Admin Email */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={formInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Admin Email *
              </label>
              <input
                type="email"
                value={formData.adminEmail}
                onChange={(e) =>
                  setFormData({ ...formData, adminEmail: e.target.value })
                }
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all placeholder-gray-400"
              />
            </motion.div>

            {/* Logo URL */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={formInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Logo URL <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, logoUrl: e.target.value })
                }
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all placeholder-gray-400"
              />
            </motion.div>

            {/* Brand Color Picker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={formInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Brand Color
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {BRAND_COLORS.map((color) => (
                  <motion.button
                    key={color.value}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setFormData({ ...formData, brandColor: color.value })
                    }
                    className={`h-12 rounded-lg transition-all relative group cursor-pointer ${
                      color.tw
                    } ${
                      formData.brandColor === color.value
                        ? 'ring-2 ring-offset-2 ring-gray-900 shadow-lg'
                        : 'shadow-md hover:shadow-lg'
                    }`}
                    title={color.name}
                  >
                    {formData.brandColor === color.value && (
                      <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Custom Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={formInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message to Donors{' '}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="We're raising funds for... Tell your donors what you're passionate about!"
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all resize-none placeholder-gray-400"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={formInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.35 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Clock className="w-5 h-5" />
                  </motion.div>
                  Setting up...
                </>
              ) : (
                <>
                  Create Organization
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <p className="text-center text-xs text-gray-500">
              We'll send a confirmation email to your admin address
            </p>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-gray-400 py-8 px-4 border-t border-navy-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            Made by nonprofits, for nonprofits. Powered by{' '}
            <a
              href="https://betterworld.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              BetterWorld
            </a>
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="hover:text-brand-400 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-brand-400 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-brand-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
