'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Gem,
  DollarSign,
  Tag,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RotateCcw,
  Send,
  CheckCircle2,
  Circle,
  X,
  Heart,
  Gift,
  Star,
  Zap,
  Users,
  Mail,
  ExternalLink,
  Building2,
  User,
  Briefcase,
  Palette,
  Music,
  Camera,
  Utensils,
  Dumbbell,
  BookOpen,
  Globe,
  Wrench,
  TreePine,
  Home,
  Car,
  Sailboat,
  Laptop,
  Mic,
} from 'lucide-react';
import {
  DonorType,
  InputMethod,
  UnifiedAnswers,
  DonorInput,
  AuctionSuggestion,
  SuggestionsResponse,
} from '@/lib/types';

/* ═══════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════ */

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const cardReveal = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

/* ═══════════════════════════════════════════════
   Confetti burst (pure CSS)
   ═══════════════════════════════════════════════ */
function ConfettiBurst() {
  const colors = ['#10b981', '#059669', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        const rotation = Math.random() * 360;
        return (
          <div
            key={i}
            className="absolute confetti-piece"
            style={{
              left: `${left}%`,
              top: '-10px',
              width: `${size}px`,
              height: `${size * 0.6}px`,
              backgroundColor: color,
              borderRadius: '2px',
              animationDelay: `${delay}s`,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Floating particles background
   ═══════════════════════════════════════════════ */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-emerald-100/20 floating-particle"
          style={{
            width: `${80 + i * 60}px`,
            height: `${80 + i * 60}px`,
            left: `${5 + i * 20}%`,
            top: `${15 + (i % 3) * 30}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${10 + i * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Suggestion Card
   ═══════════════════════════════════════════════ */
function SuggestionCard({
  item,
  index,
  selected,
  onToggle,
  brandColor,
}: {
  item: AuctionSuggestion;
  index: number;
  selected: boolean;
  onToggle: () => void;
  brandColor: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCatalog = async () => {
    try {
      await navigator.clipboard.writeText(`${item.title}\n\n${item.catalogDescription}`);
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={cardReveal}
      initial="initial"
      animate="animate"
      transition={{ ...cardReveal.transition, delay: index * 0.1 }}
      whileHover={{ y: -2, boxShadow: '0 16px 48px rgba(0,0,0,0.06)' }}
      onClick={onToggle}
      className={`relative bg-white rounded-3xl border cursor-pointer transition-all duration-300 overflow-hidden group ${
        selected
          ? 'border-emerald-200 shadow-lg shadow-emerald-100/30'
          : 'border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <motion.div
        className="absolute top-0 left-0 w-1.5 h-full rounded-r-full"
        style={{ backgroundColor: brandColor }}
        animate={{ opacity: selected ? 1 : 0, scaleY: selected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <motion.div className="flex-shrink-0 mt-1" whileTap={{ scale: 0.85 }}>
            <motion.div animate={selected ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
              {selected ? (
                <CheckCircle2 className="w-6 h-6" style={{ color: brandColor }} />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 group-hover:text-emerald-300 transition-colors" />
              )}
            </motion.div>
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {item.category}
              </span>
              {item.isHiddenGem && (
                <motion.span
                  className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center gap-1"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gem className="w-3 h-3" />
                  Hidden Gem
                </motion.span>
              )}
            </div>

            <h3 className="text-lg font-bold text-navy-900 leading-snug mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{item.description}</p>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl">
                <DollarSign className="w-4 h-4 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold">{item.estimatedValue}</span>
                  <span className="text-[10px] opacity-70 ml-1">bid value</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl">
                <Tag className="w-4 h-4 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold">{item.donorCost}</span>
                  <span className="text-[10px] opacity-70 ml-1">your cost</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 flex items-start gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 mt-0.5 text-amber-500 flex-shrink-0" />
              <span>{item.whyItWorks}</span>
            </p>

            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
            >
              {expanded ? (
                <>Collapse <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>View auction copy <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 bg-gray-50 rounded-2xl p-4 backdrop-blur-sm border border-gray-200/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Ready-to-Use Copy</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyCatalog(); }}
                        className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                      >
                        {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{item.catalogDescription}&rdquo;</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Loading State
   ═══════════════════════════════════════════════ */
const LOADING_STEPS = [
  { text: 'Getting to know you', emoji: '👋', detail: 'Reading your unique profile' },
  { text: 'Discovering hidden gems', emoji: '💎', detail: 'Searching for creative matches' },
  { text: 'Matching your skills to ideas', emoji: '🎯', detail: 'Connecting dots you might not see' },
  { text: 'Crafting personalized offerings', emoji: '✨', detail: 'Tailoring each suggestion' },
  { text: 'Polishing the final touches', emoji: '💫', detail: 'Making everything shine' },
];
const LOADING_MORE_MESSAGES = [
  { text: 'Finding fresh ideas...', emoji: '💡' },
  { text: 'Thinking outside the box...', emoji: '📦' },
  { text: 'Brainstorming...', emoji: '🧠' },
];
const FUN_FACTS = [
  'Silent auctions raise 2-3x more than traditional fundraisers',
  'Experiences & services often outperform physical items at auction',
  'Unique, personal offerings create the most bidding excitement',
  'The best auction items tell a story about the donor',
  'Donors who contribute skills often become repeat supporters',
];

function LoadingState({ isMore }: { isMore: boolean }) {

  const [msgIdx, setMsgIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    if (isMore) {
      const timer = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MORE_MESSAGES.length), 2400);
      return () => clearInterval(timer);
    }
  }, [isMore, LOADING_MORE_MESSAGES.length]);

  useEffect(() => {
    if (isMore) return;
    const start = Date.now();
    const duration = 18000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(95, (elapsed / duration) * 100);
      setProgress(pct);
      // Advance step based on progress
      const stepIndex = Math.min(LOADING_STEPS.length - 1, Math.floor((pct / 95) * LOADING_STEPS.length));
      setActiveStep(stepIndex);
      if (pct < 95) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isMore, LOADING_STEPS.length]);

  // Rotate fun facts
  useEffect(() => {
    if (isMore) return;
    const timer = setInterval(() => setFactIdx(i => (i + 1) % FUN_FACTS.length), 4000);
    return () => clearInterval(timer);
  }, [isMore, FUN_FACTS.length]);

  if (isMore) {
    return (
      <motion.div {...pageTransition} className="max-w-md mx-auto text-center py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3"
          >
            <span className="text-2xl mb-1 block">{LOADING_MORE_MESSAGES[msgIdx].emoji}</span>
            <p className="text-lg font-medium text-gray-800">{LOADING_MORE_MESSAGES[msgIdx].text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageTransition} className="max-w-lg mx-auto text-center py-16 px-4">
      {/* Animated icon */}
      <motion.div
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-200/50"
        animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-12 h-12 text-white" />
      </motion.div>

      {/* Current step text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <span className="text-3xl mb-2 block">{LOADING_STEPS[activeStep].emoji}</span>
          <p className="text-xl font-semibold text-navy-900">{LOADING_STEPS[activeStep].text}</p>
          <p className="text-sm text-gray-500 mt-1">{LOADING_STEPS[activeStep].detail}</p>
        </motion.div>
      </AnimatePresence>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {LOADING_STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === activeStep ? 24 : 8,
              height: 8,
              backgroundColor: i <= activeStep ? '#10b981' : '#e5e7eb',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="max-w-xs mx-auto mb-8">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>
      </div>

      {/* Fun fact ticker */}
      <motion.div
        className="bg-cream-50 border border-cream-200 rounded-2xl px-6 py-4 max-w-sm mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Did you know?</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={factIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-600 leading-relaxed"
          >
            {FUN_FACTS[factIdx]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Share Modal
   ═══════════════════════════════════════════════ */
function ShareModal({
  selectedItems,
  donorSummary,
  orgName,
  orgSlug,
  brandColor,
  onClose,
  onSuccess,
}: {
  selectedItems: AuctionSuggestion[];
  donorSummary: string;
  orgName: string;
  orgSlug: string;
  brandColor: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    if (!email.trim() || !name.trim()) {
      setError('Please fill in your name and email');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: name,
          donorEmail: email,
          orgName,
          orgSlug,
          orgEmail: '',
          donorSummary,
          selectedOfferings: selectedItems,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to share');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {success && <ConfettiBurst />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-navy-900">Share your offerings</h3>
            <button onClick={onClose} disabled={sending} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" aria-label="Close">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" disabled={sending}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 text-sm transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" disabled={sending}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 text-sm transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Personal note (optional)</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Add a personal message..." disabled={sending} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 text-sm transition-all resize-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50" />
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/50">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-2">
                Sharing {selectedItems.length} offering{selectedItems.length !== 1 ? 's' : ''}
              </p>
              <ul className="space-y-1">
                {selectedItems.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700">• {item.title}</li>
                ))}
              </ul>
            </div>

            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600">{error}</motion.p>}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleShare} disabled={sending}
              className="mt-6 w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{ backgroundColor: brandColor || '#059669' }}>
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Share My Offerings</>}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   Thank You Page
   ═══════════════════════════════════════════════ */
function ThankYouPage({ orgName, orgSlug, brandColor }: { orgName: string; orgSlug: string; brandColor: string }) {
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/org/${orgSlug}` : '';
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `I just discovered creative auction items I can donate to ${orgName} using DonorSpark! Try it yourself:`;

  return (
    <>
      {showConfetti && <ConfettiBurst />}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        className="max-w-lg mx-auto text-center py-16 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.4, 1] }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-7xl mb-6"
        >
          🎉
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-navy-900 mb-3 tracking-tight"
        >
          You&apos;re amazing!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg mb-10 leading-relaxed"
        >
          Your offerings have been shared with <span className="font-semibold text-navy-900">{orgName}</span>. You&apos;re making a real difference.
        </motion.p>

        {/* Share with a friend section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gradient-to-b from-white to-cream-50 rounded-3xl p-8 border border-gray-200/60 shadow-sm mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 200, damping: 15 }}
            className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4"
          >
            <Heart className="w-7 h-7 text-rose-500" />
          </motion.div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">Double your impact</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            Know someone who might have something amazing to offer? Invite them to discover what they could contribute!
          </p>

          <div className="flex flex-col gap-3">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:?subject=You should try this!&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: brandColor }}
            >
              <Mail className="w-5 h-5" /> Email a friend
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyLink}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-2 border-gray-200 hover:border-gray-300 text-navy-900 font-medium text-sm transition-all bg-white"
            >
              {copied ? <><Check className="w-4 h-4 text-emerald-500" /> Link copied!</> : <><Copy className="w-4 h-4" /> Copy link to share</>}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-1.5 text-xs text-gray-400"
        >
          Powered by{' '}
          <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer">
            <img src="https://betterworld.org/assets/brand/wordmark-denim.svg" alt="BetterWorld" className="h-3 w-auto" draggable={false} />
          </a>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   Chip Selector — Typeform-style multi-select
   ═══════════════════════════════════════════════ */
function ChipSelector({
  options,
  selected,
  onToggle,
  brandColor,
}: {
  options: { label: string; icon?: React.ReactNode }[];
  selected: string[];
  onToggle: (label: string) => void;
  brandColor: string;
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.label);
        return (
          <motion.button
            key={opt.label}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onToggle(opt.label)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 text-sm font-medium transition-all duration-200 ${
              isSelected
                ? 'text-white shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
            style={isSelected ? { backgroundColor: brandColor, borderColor: brandColor } : {}}
          >
            {opt.icon}
            {opt.label}
            {isSelected && <Check className="w-4 h-4 ml-1" />}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Typeform-style Screen Wrapper
   ═══════════════════════════════════════════════ */
function TypeformScreen({
  children,
  screenNum,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  screenNum: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4"
      >
        {screenNum}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3 leading-tight max-w-xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-10 max-w-md"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="w-full max-w-xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Interest & Asset Options
   ═══════════════════════════════════════════════ */

const INTEREST_OPTIONS = [
  { label: 'Cooking', icon: <Utensils className="w-4 h-4" /> },
  { label: 'Photography', icon: <Camera className="w-4 h-4" /> },
  { label: 'Music', icon: <Music className="w-4 h-4" /> },
  { label: 'Art & Design', icon: <Palette className="w-4 h-4" /> },
  { label: 'Fitness', icon: <Dumbbell className="w-4 h-4" /> },
  { label: 'Travel', icon: <Globe className="w-4 h-4" /> },
  { label: 'Reading', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Outdoors', icon: <TreePine className="w-4 h-4" /> },
  { label: 'DIY & Crafts', icon: <Wrench className="w-4 h-4" /> },
  { label: 'Sports', icon: <Zap className="w-4 h-4" /> },
  { label: 'Tech', icon: <Laptop className="w-4 h-4" /> },
  { label: 'Public Speaking', icon: <Mic className="w-4 h-4" /> },
];

const ASSET_OPTIONS = [
  { label: 'Vacation Home', icon: <Home className="w-4 h-4" /> },
  { label: 'Boat or Watercraft', icon: <Sailboat className="w-4 h-4" /> },
  { label: 'Nice Backyard / Patio', icon: <TreePine className="w-4 h-4" /> },
  { label: 'Professional Network', icon: <Users className="w-4 h-4" /> },
  { label: 'Company / Business', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Vehicle / Classic Car', icon: <Car className="w-4 h-4" /> },
  { label: 'Studio / Workshop', icon: <Wrench className="w-4 h-4" /> },
  { label: 'Pool', icon: <Sparkles className="w-4 h-4" /> },
];

/* ═══════════════════════════════════════════════
   Main Org Donor Page — Unified Typeform Flow
   ═══════════════════════════════════════════════ */

interface OrgData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  message: string;
  brandColor: string;
}

const TOTAL_SCREENS = 6;

export default function OrgDonorPage({ params }: { params: { slug: string } }) {
  const [org, setOrg] = useState<OrgData | null>(null);
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgError, setOrgError] = useState(false);

  // Flow state
  const [phase, setPhase] = useState<'flow' | 'results' | 'thankyou'>('flow');
  const [screen, setScreen] = useState(0); // 0 = welcome, 1-6 = questions
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results state
  const [allSuggestions, setAllSuggestions] = useState<AuctionSuggestion[]>([]);
  const [donorSummary, setDonorSummary] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Unified answers
  const [unified, setUnified] = useState<UnifiedAnswers>({
    donorType: 'individual',
    interests: [],
    assets: [],
  });
  const [nonprofitContext, setNonprofitContext] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Load org data
  useEffect(() => {
    fetch(`/api/org/${params.slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => { setOrg(data); setOrgLoading(false); })
      .catch(() => { setOrgError(true); setOrgLoading(false); });
  }, [params.slug]);

  // Auto-focus text inputs when screen changes
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [screen]);

  const brandColor = org?.brandColor || '#059669';

  const goNext = () => {
    setDirection(1);
    if (screen < TOTAL_SCREENS) {
      setScreen(s => s + 1);
    } else {
      handleSubmit(false);
    }
  };

  const goBack = () => {
    setDirection(-1);
    if (screen > 0) setScreen(s => s - 1);
  };

  // Handle Enter key to advance
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      goNext();
    }
  };

  const toggleInterest = (label: string) => {
    setUnified(prev => ({
      ...prev,
      interests: prev.interests.includes(label)
        ? prev.interests.filter(i => i !== label)
        : [...prev.interests, label],
    }));
  };

  const toggleAsset = (label: string) => {
    setUnified(prev => ({
      ...prev,
      assets: prev.assets.includes(label)
        ? prev.assets.filter(a => a !== label)
        : [...prev.assets, label],
    }));
  };

  const buildInput = useCallback((): DonorInput => {
    return {
      method: 'unified' as InputMethod,
      unified,
      nonprofitContext: nonprofitContext || (org?.message ? `Event: ${org.message}` : undefined),
    };
  }, [unified, nonprofitContext, org]);

  const handleSubmit = async (keepBrainstorming = false) => {
    keepBrainstorming ? setLoadingMore(true) : setLoading(true);
    setError(null);

    const input = buildInput();
    if (keepBrainstorming && allSuggestions.length > 0) {
      input.previousSuggestions = allSuggestions.map(s => s.title);
    }

    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Something went wrong');
      }

      const data: SuggestionsResponse = await res.json();

      if (keepBrainstorming) {
        setAllSuggestions(prev => [...prev, ...data.suggestions]);
      } else {
        setAllSuggestions(data.suggestions);
        setDonorSummary(data.donorSummary);
        setSelectedIds(new Set());
      }
      setPhase('results');
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      // If it fails mid-generation, go back to last screen so user can retry
      if (!keepBrainstorming) {
        setScreen(TOTAL_SCREENS);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const toggleSelected = (index: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const startOver = () => {
    setPhase('flow');
    setScreen(0);
    setAllSuggestions([]);
    setDonorSummary('');
    setError(null);
    setUnified({ donorType: 'individual', interests: [], assets: [] });
    setNonprofitContext('');
    setSelectedIds(new Set());
  };

  const selectedItems = Array.from(selectedIds).map(i => allSuggestions[i]);
  const hiddenGemsCount = allSuggestions.filter(s => s.isHiddenGem).length;

  const progressPercent = phase === 'results' ? 100 : Math.round((screen / TOTAL_SCREENS) * 100);

  // ─── Loading org ───
  if (orgLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-emerald-600" />
        </motion.div>
      </div>
    );
  }

  // ─── Org not found ───
  if (orgError || !org) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-900 mb-2">Organization not found</h2>

          <p className="text-gray-600 mb-6">This link doesn&apos;t seem to be active.</p>
          <a href="https://betterworld.org" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Go to betterworld &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-20 border-b border-gray-200/50 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                onClick={() => {
                  const next = logoClicks + 1;
                  setLogoClicks(next);
                  if (next === 7) {
                    setShowEasterEgg(true);
                    setTimeout(() => setShowEasterEgg(false), 3000);
                    setLogoClicks(0);
                  }
                }}
                className="cursor-pointer"
              >
                {org.logoUrl ? (
                  <img src={org.logoUrl} alt={org.name} className="w-9 h-9 rounded-lg object-cover" />
                ) : (
                  <motion.div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: brandColor }}
                    animate={showEasterEgg ? { rotate: [0, 360], scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    {org.name.charAt(0)}
                  </motion.div>
                )}
              </div>
              <div>
                <h1 className="text-sm font-semibold text-navy-900">{org.name}</h1>
                <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  powered by
                  <img src="https://betterworld.org/assets/brand/wordmark-denim.svg" alt="BetterWorld" className="h-2.5 w-auto" draggable={false} />
                </a>
              </div>
            </div>
            {(screen > 0 || phase === 'results') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startOver}
                className="text-xs text-gray-600 hover:text-navy-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start over
              </motion.button>
            )}
          </div>
        </div>
        {/* Progress bar */}
        {phase === 'flow' && screen > 0 && (
          <div className="h-1 bg-gray-100">
            <motion.div
              className="h-full rounded-r-full"
              style={{ backgroundColor: brandColor }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}
      </header>

      {/* Easter egg toast */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <span className="text-xl">🦄</span>
            <span className="text-sm font-medium">You found the secret! You&apos;re clearly a power user.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* ═══ LOADING STATE ═══ */}
          {loading && (
            <motion.div key="loading" {...pageTransition} className="flex-1">
              <LoadingState isMore={false} />
            </motion.div>
          )}

          {/* ═══ UNIFIED FLOW ═══ */}
          {!loading && phase === 'flow' && (
            <motion.div
              key={`screen-${screen}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col items-center justify-center px-4 py-12 min-h-[60vh]"
            >
              {/* ─── Screen 0: Welcome ─── */}
              {screen === 0 && (
                <div className="relative w-full max-w-3xl mx-auto">
                  <FloatingParticles />
                  <div className="relative text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-emerald-50 text-emerald-700"
                    >
                      <Gift className="w-4 h-4" />
                      Discover your auction potential
                    </motion.div>

                    <motion.h2
                      variants={fadeUp}
                      initial="initial"
                      animate="animate"
                      className="text-4xl sm:text-6xl font-bold text-navy-900 mb-6 tracking-tight leading-tight"
                    >
                      You have more to<br />
                      <span className="text-emerald-600">offer</span>
                    </motion.h2>

                    <motion.p
                      variants={fadeUp}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 0.15 }}
                      className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12"
                    >
                      Answer a few quick questions and we&apos;ll uncover creative, high-value auction offerings you didn&apos;t know you had.
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={goNext}
                      className="px-10 py-4 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                      style={{ backgroundColor: brandColor }}
                    >
                      Let&apos;s Go
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    {/* Social proof */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-16"
                    >
                      <div className="flex items-center justify-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 italic max-w-xl mx-auto leading-relaxed">
                        &ldquo;I had no idea my backyard could be worth $2,000 at auction. This tool is incredible.&rdquo;
                      </p>
                      <p className="text-xs text-gray-500 mt-2">&mdash; Recent donor</p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* ─── Screen 1: Individual or Business ─── */}
              {screen === 1 && (
                <TypeformScreen
                  screenNum="Step 1 of 6"
                  title="First, what describes you best?"
                  subtitle="This helps us tailor our suggestions"
                >
                  <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    {[
                      { type: 'individual' as DonorType, icon: User, label: 'Individual', desc: 'Person donating time, skills, or assets' },
                      { type: 'business' as DonorType, icon: Building2, label: 'Business', desc: 'Company or organization with services & space' },
                    ].map(opt => {
                      const Icon = opt.icon;
                      const isSelected = unified.donorType === opt.type;
                      return (
                        <motion.button
                          key={opt.type}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setUnified(prev => ({ ...prev, donorType: opt.type }));
                            setTimeout(goNext, 300);
                          }}
                          className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                            isSelected
                              ? 'shadow-md text-white'
                              : 'bg-white border-gray-200 hover:border-gray-300 text-navy-900'
                          }`}
                          style={isSelected ? { backgroundColor: brandColor, borderColor: brandColor } : {}}
                        >
                          <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                          <p className="font-semibold text-base mb-1">{opt.label}</p>
                          <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{opt.desc}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </TypeformScreen>
              )}

              {/* ─── Screen 2: Occupation / Business Info ─── */}
              {screen === 2 && (
                <TypeformScreen
                  screenNum="Step 2 of 6"
                  title={unified.donorType === 'individual'
                    ? "What do you do for work?"
                    : "Tell us about your business"}
                  subtitle={unified.donorType === 'individual'
                    ? "Your profession is a goldmine for auction ideas"
                    : "We'll find creative offerings beyond gift cards"}
                >
                  <div className="space-y-4">
                    {unified.donorType === 'individual' ? (
                      <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={unified.occupation || ''}
                        onChange={e => setUnified(prev => ({ ...prev, occupation: e.target.value }))}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Software engineer, Yoga instructor, Dentist..."
                        className="w-full text-center text-xl px-6 py-4 rounded-2xl border-2 border-gray-200 text-navy-900 placeholder-gray-400 transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none"
                      />
                    ) : (
                      <>
                        <input
                          ref={inputRef as React.RefObject<HTMLInputElement>}
                          type="text"
                          value={unified.businessName || ''}
                          onChange={e => setUnified(prev => ({ ...prev, businessName: e.target.value }))}
                          onKeyDown={handleKeyDown}
                          placeholder="Business name"
                          className="w-full text-center text-xl px-6 py-4 rounded-2xl border-2 border-gray-200 text-navy-900 placeholder-gray-400 transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none"
                        />
                        <input
                          type="text"
                          value={unified.industry || ''}
                          onChange={e => setUnified(prev => ({ ...prev, industry: e.target.value }))}
                          onKeyDown={handleKeyDown}
                          placeholder="Industry (e.g., Restaurant, Real estate, Consulting...)"
                          className="w-full text-center text-lg px-6 py-3.5 rounded-2xl border-2 border-gray-200 text-navy-900 placeholder-gray-400 transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none"
                        />
                      </>
                    )}
                  </div>
                </TypeformScreen>
              )}

              {/* ─── Screen 3: Interests ─── */}
              {screen === 3 && (
                <TypeformScreen
                  screenNum="Step 3 of 6"
                  title="What are you into?"
                  subtitle="Pick as many as you like — these spark our best ideas"
                >
                  <ChipSelector
                    options={INTEREST_OPTIONS}
                    selected={unified.interests}
                    onToggle={toggleInterest}
                    brandColor={brandColor}
                  />
                  <div className="mt-6">
                    <input
                      type="text"
                      value={unified.interestsOther || ''}
                      onChange={e => setUnified(prev => ({ ...prev, interestsOther: e.target.value }))}
                      onKeyDown={handleKeyDown}
                      placeholder="Anything else? (e.g., beekeeping, pottery, salsa dancing...)"
                      className="w-full text-center text-sm px-5 py-3 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none"
                    />
                  </div>
                </TypeformScreen>
              )}

              {/* ─── Screen 4: Hidden Talents ─── */}
              {screen === 4 && (
                <TypeformScreen
                  screenNum="Step 4 of 6"
                  title="Any hidden talents or skills?"
                  subtitle="The things people don't know about you are often the most valuable"
                >
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={unified.hiddenTalents || ''}
                    onChange={e => setUnified(prev => ({ ...prev, hiddenTalents: e.target.value }))}
                    placeholder="e.g., I make incredible sourdough, I used to be a pilot, I can teach anyone to play guitar, I know every restaurant owner in town..."
                    rows={4}
                    className="w-full text-center text-lg px-6 py-4 rounded-2xl border-2 border-gray-200 text-navy-900 placeholder-gray-400 transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-3">Press Enter or click Next to continue. Leave blank to skip.</p>
                </TypeformScreen>
              )}

              {/* ─── Screen 5: Assets ─── */}
              {screen === 5 && (
                <TypeformScreen
                  screenNum="Step 5 of 6"
                  title="Got any special assets or access?"
                  subtitle="Property, equipment, connections — all auction gold"
                >
                  <ChipSelector
                    options={ASSET_OPTIONS}
                    selected={unified.assets}
                    onToggle={toggleAsset}
                    brandColor={brandColor}
                  />
                  <div className="mt-6">
                    <input
                      type="text"
                      value={unified.assetsOther || ''}
                      onChange={e => setUnified(prev => ({ ...prev, assetsOther: e.target.value }))}
                      onKeyDown={handleKeyDown}
                      placeholder="Anything else? (e.g., wine cellar, recording studio, season tickets...)"
                      className="w-full text-center text-sm px-5 py-3 rounded-xl border border-gray-200 text-navy-900 placeholder-gray-400 transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none"
                    />
                  </div>
                </TypeformScreen>
              )}

              {/* ─── Screen 6: Optional Bio + Context ─── */}
              {screen === 6 && (
                <TypeformScreen
                  screenNum="Step 6 of 6 — Optional"
                  title="Anything else we should know?"
                  subtitle="Paste your LinkedIn, Instagram, or Facebook bio — or just tell us about yourself. Or hit Discover!"
                >
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={unified.socialText || ''}
                    onChange={e => setUnified(prev => ({ ...prev, socialText: e.target.value }))}
                    placeholder="Paste your LinkedIn, Instagram, or Facebook bio — or just tell us a bit about yourself..."
                    rows={4}
                    className="w-full text-lg px-6 py-4 rounded-2xl border-2 border-gray-200 text-navy-900 placeholder-gray-400 transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none resize-none"
                  />

                  {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 mt-3">{error}</motion.p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="mt-8 w-full py-4 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    style={{ backgroundColor: brandColor }}
                  >
                    <Sparkles className="w-5 h-5" />
                    Discover My Offerings
                  </motion.button>
                </TypeformScreen>
              )}

              {/* ─── Navigation Buttons ─── */}
              {screen > 0 && screen < TOTAL_SCREENS && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 mt-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goBack}
                    className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goNext}
                    className="px-8 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    style={{ backgroundColor: brandColor }}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <span className="text-xs text-gray-400 ml-2 hidden sm:inline">or press Enter ↵</span>
                </motion.div>
              )}

              {/* Back button on last screen */}
              {screen === TOTAL_SCREENS && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={goBack}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ═══ RESULTS ═══ */}
          {!loading && phase === 'results' && (
            <motion.div key="results" {...pageTransition} className="max-w-5xl mx-auto px-4 py-8 pb-32 w-full" ref={resultsRef}>
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="text-center mb-6"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
                  className="inline-block text-4xl"
                >
                  🎉
                </motion.span>
              </motion.div>

              <div className="mb-10 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-navy-900 mb-2">Your personalized offerings</h2>
                  <p className="text-gray-600">
                    We found {allSuggestions.length} offering{allSuggestions.length !== 1 ? 's' : ''} tailored to you
                    {hiddenGemsCount > 0 && ` (including ${hiddenGemsCount} hidden gem${hiddenGemsCount !== 1 ? 's' : ''})`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (selectedIds.size === allSuggestions.length) {
                      setSelectedIds(new Set());
                    } else {
                      setSelectedIds(new Set(allSuggestions.map((_, i) => i)));
                    }
                  }}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-50"
                >
                  {selectedIds.size === allSuggestions.length ? (
                    <><X className="w-3.5 h-3.5" /> Deselect all</>
                  ) : (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Select all</>
                  )}
                </button>
              </div>

              {donorSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-gray-50 rounded-3xl border border-gray-200/50"
                >
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Your Profile</p>
                  <p className="text-gray-800 leading-relaxed">{donorSummary}</p>
                </motion.div>
              )}

              <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4 mb-10">
                {allSuggestions.map((item, i) => (
                  <SuggestionCard
                    key={i}
                    item={item}
                    index={i}
                    selected={selectedIds.has(i)}
                    onToggle={() => toggleSelected(i)}
                    brandColor={brandColor}
                  />
                ))}
              </motion.div>

              {!loadingMore && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mb-10">
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSubmit(true)}
                      disabled={loadingMore}
                      className="px-6 py-3 rounded-xl border-2 border-gray-300 text-navy-900 font-semibold transition-all hover:border-emerald-400 hover:text-emerald-700"
                    >
                      <span className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> Get more ideas
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setShowShareModal(true)}
                      disabled={selectedItems.length === 0}
                      className="px-6 py-3 rounded-xl text-white font-semibold transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                      style={{ backgroundColor: brandColor }}
                    >
                      <Send className="w-4 h-4" />
                      Share {selectedItems.length > 0 && `(${selectedItems.length})`}
                    </motion.button>
                  </div>
                  {selectedItems.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <button
                        onClick={() => setPhase('thankyou')}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
                      >
                        Just browsing? Finish up
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {loadingMore && <LoadingState isMore={true} />}

              <AnimatePresence>
                {showShareModal && (
                  <ShareModal
                    selectedItems={selectedItems}
                    donorSummary={donorSummary}
                    orgName={org.name}
                    orgSlug={org.slug}
                    brandColor={brandColor}
                    onClose={() => setShowShareModal(false)}
                    onSuccess={() => setPhase('thankyou')}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══ THANK YOU ═══ */}
          {phase === 'thankyou' && (
            <ThankYouPage orgName={org.name} orgSlug={org.slug} brandColor={brandColor} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {phase === 'flow' && screen === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pb-8 pt-4 space-y-2"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
            Built by{' '}
            <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer" className="inline-flex">
              <img src="https://betterworld.org/assets/brand/wordmark-denim.svg" alt="BetterWorld" className="h-3 w-auto" draggable={false} />
            </a>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400">
            <a href="https://help.betterworld.org/en/articles/8557905-privacy-policy" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="https://help.betterworld.org/en/articles/8557943-terms-conditions" className="hover:text-gray-600 transition-colors">Terms</a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
