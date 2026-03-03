'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lightbulb,
  MessageSquareText,
  ClipboardList,
  Linkedin,
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
} from 'lucide-react';
import {
  DonorType,
  InputMethod,
  GuidedAnswers,
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

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const cardReveal = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

/* ═══════════════════════════════════════════════
   Confetti burst (pure CSS)
   ═══════════════════════════════════════════════ */
function ConfettiBurst() {
  const colors = ['#6b8b74', '#8fad97', '#f59e0b', '#3b82f6', '#ec4899', '#10b981'];
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
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-brand-200/30 floating-particle"
          style={{
            width: `${60 + i * 40}px`,
            height: `${60 + i * 40}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${8 + i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Progress Steps
   ═══════════════════════════════════════════════ */
function ProgressSteps({ current }: { current: number }) {
  const steps = ['Tell us about you', 'Discover offerings', 'Share with org'];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
              i < current
                ? 'bg-brand-500 text-white'
                : i === current
                ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-300'
                : 'bg-gray-100 text-gray-400'
            }`}
            animate={i === current ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {i < current ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">{label}</span>
          </motion.div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 rounded-full transition-colors duration-500 ${
              i < current ? 'bg-brand-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Suggestion Card — premium design
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

  const copyCatalog = () => {
    navigator.clipboard.writeText(`${item.title}\n\n${item.catalogDescription}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      variants={cardReveal}
      initial="initial"
      animate="animate"
      transition={{ ...cardReveal.transition, delay: index * 0.1 }}
      whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
      onClick={onToggle}
      className={`relative bg-white rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden group ${
        selected
          ? 'border-brand-400 shadow-lg shadow-brand-100/50'
          : 'border-transparent shadow-sm hover:border-brand-200'
      }`}
    >
      {/* Selection indicator bar */}
      <motion.div
        className="absolute top-0 left-0 w-1 h-full rounded-r-full"
        style={{ backgroundColor: brandColor }}
        animate={{ opacity: selected ? 1 : 0, scaleY: selected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          {/* Select toggle */}
          <motion.div
            className="flex-shrink-0 mt-0.5"
            whileTap={{ scale: 0.85 }}
          >
            <motion.div
              animate={selected ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {selected ? (
                <CheckCircle2 className="w-6 h-6" style={{ color: brandColor }} />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 group-hover:text-brand-300 transition-colors" />
              )}
            </motion.div>
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                {item.category}
              </span>
              {item.isHiddenGem && (
                <motion.span
                  className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gem className="w-3 h-3" />
                  Hidden Gem
                </motion.span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-navy-800 leading-snug mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-navy-600 leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Value chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{item.estimatedValue}</span>
                <span className="text-[10px] opacity-70">bid value</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                <Tag className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{item.donorCost}</span>
                <span className="text-[10px] opacity-70">your cost</span>
              </div>
            </div>

            {/* Why it works */}
            <p className="text-xs text-navy-500 italic flex items-start gap-1.5">
              <Zap className="w-3 h-3 mt-0.5 text-amber-500 flex-shrink-0" />
              {item.whyItWorks}
            </p>

            {/* Expandable catalog copy */}
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              {expanded ? (
                <>Collapse <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>View auction catalog copy <ChevronDown className="w-3.5 h-3.5" /></>
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
                  <div className="mt-3 bg-cream-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-navy-500 uppercase tracking-widest">
                        Ready-to-Use Copy
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyCatalog(); }}
                        className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
                      >
                        {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    </div>
                    <p className="text-sm text-navy-700 leading-relaxed italic">
                      &ldquo;{item.catalogDescription}&rdquo;
                    </p>
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
   Beautiful Loading State
   ═══════════════════════════════════════════════ */
function LoadingState({ isMore }: { isMore: boolean }) {
  const messages = isMore
    ? ['Finding fresh ideas...', 'Thinking outside the box...', 'Brainstorming...']
    : ['Analyzing your profile...', 'Discovering hidden gems...', 'Crafting offerings...', 'Almost there...'];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setMsgIdx(i => (i + 1) % messages.length), 3000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <motion.div
      {...pageTransition}
      className="max-w-lg mx-auto text-center py-16"
    >
      <motion.div
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-200/50"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg font-medium text-navy-700 mb-3"
        >
          {messages[msgIdx]}
        </motion.p>
      </AnimatePresence>

      <div className="flex justify-center gap-1.5 mt-4">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      {!isMore && (
        <p className="text-sm text-navy-500 mt-6">
          This usually takes 10-20 seconds
        </p>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Share Modal — gorgeous
   ═══════════════════════════════════════════════ */
function ShareModal({
  selectedItems,
  donorSummary,
  orgId,
  orgName,
  brandColor,
  onClose,
}: {
  selectedItems: AuctionSuggestion[];
  donorSummary: string;
  orgId: string;
  orgName: string;
  brandColor: string;
  onClose: () => void;
}) {
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleShare = async () => {
    if (!donorName.trim() || !donorEmail.trim()) {
      setError('Please fill in your name and email.');
      return;
    }
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorSummary,
          offerings: selectedItems,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to share');
      }

      setSent(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {showConfetti && <ConfettiBurst />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy-800">
                {sent ? '' : `Share with ${orgName}`}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, damping: 12 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: `${brandColor}15` }}
                >
                  <Heart className="w-10 h-10" style={{ color: brandColor }} />
                </motion.div>
                <h4 className="text-2xl font-bold text-navy-800 mb-2">
                  You&apos;re amazing!
                </h4>
                <p className="text-navy-600 mb-2">
                  Your {selectedItems.length} offering{selectedItems.length > 1 ? 's have' : ' has'} been shared with {orgName}.
                </p>
                <p className="text-sm text-navy-500 mb-8">
                  They&apos;ll reach out to coordinate the details.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl text-white font-semibold transition-colors"
                  style={{ backgroundColor: brandColor }}
                >
                  Done
                </motion.button>
              </motion.div>
            ) : (
              <>
                <p className="text-sm text-navy-600 mb-5">
                  We&apos;ll share your <span className="font-semibold">{selectedItems.length} offering{selectedItems.length > 1 ? 's' : ''}</span> so they can follow up.
                </p>

                <div className="bg-cream-50 rounded-xl p-3 mb-5 space-y-1.5">
                  {selectedItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: brandColor }} />
                      <span className="font-medium text-navy-700">{item.title}</span>
                      {item.isHiddenGem && <Gem className="w-3 h-3 text-amber-500" />}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Your name</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full rounded-xl border border-gray-200 p-3 text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-shadow"
                      style={{ '--tw-ring-color': `${brandColor}40` } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-1">Your email</label>
                    <input
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-gray-200 p-3 text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-shadow"
                      style={{ '--tw-ring-color': `${brandColor}40` } as React.CSSProperties}
                    />
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 mt-3">
                    {error}
                  </motion.p>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleShare}
                  disabled={sending}
                  className="mt-5 w-full py-3.5 rounded-xl text-white font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md"
                  style={{ backgroundColor: brandColor }}
                >
                  {sending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Share My Offerings</>
                  )}
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   Input Field with micro animation
   ═══════════════════════════════════════════════ */
function InputField({
  label,
  placeholder,
  value,
  onChange,
  multiline,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const cls = `w-full rounded-xl border p-3 text-navy-800 placeholder-gray-400 text-sm transition-all duration-200 resize-none ${
    focused ? 'border-brand-300 ring-2 ring-brand-100 shadow-sm' : 'border-gray-200 hover:border-gray-300'
  }`;

  return (
    <motion.div variants={fadeUp}>
      <label className="block text-sm font-medium text-navy-700 mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={5}
          className={cls}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Main Org Donor Page
   ═══════════════════════════════════════════════ */

interface OrgData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  message: string;
  brandColor: string;
}

export default function OrgDonorPage({ params }: { params: { slug: string } }) {
  const [org, setOrg] = useState<OrgData | null>(null);
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgError, setOrgError] = useState(false);

  const [step, setStep] = useState<'select' | 'input' | 'results'>('select');
  const [method, setMethod] = useState<InputMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allSuggestions, setAllSuggestions] = useState<AuctionSuggestion[]>([]);
  const [donorSummary, setDonorSummary] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);

  // Form state
  const [freetext, setFreetext] = useState('');
  const [donorType, setDonorType] = useState<DonorType>('individual');
  const [guided, setGuided] = useState<GuidedAnswers>({ donorType: 'individual' });
  const [socialText, setSocialText] = useState('');
  const [nonprofitContext, setNonprofitContext] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);

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

  const brandColor = org?.brandColor || '#6b8b74';

  const updateGuided = (key: keyof GuidedAnswers, value: string) => {
    setGuided(prev => ({ ...prev, [key]: value }));
  };

  const buildInput = useCallback((): DonorInput => {
    const input: DonorInput = {
      method: method!,
      nonprofitContext: nonprofitContext || (org?.message ? `Event: ${org.message}` : undefined),
    };
    switch (method) {
      case 'freetext': input.freetext = freetext; break;
      case 'guided': input.guided = { ...guided, donorType }; break;
      case 'social': input.socialText = socialText; break;
    }
    return input;
  }, [method, nonprofitContext, org, freetext, guided, donorType, socialText]);

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
      setStep('results');
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
    setStep('select');
    setMethod(null);
    setAllSuggestions([]);
    setDonorSummary('');
    setError(null);
    setFreetext('');
    setGuided({ donorType: 'individual' });
    setSocialText('');
    setNonprofitContext('');
    setSelectedIds(new Set());
  };

  const selectedItems = Array.from(selectedIds).map(i => allSuggestions[i]);
  const hiddenGemsCount = allSuggestions.filter(s => s.isHiddenGem).length;

  // ─── Loading org ───
  if (orgLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-brand-500" />
        </motion.div>
      </div>
    );
  }

  // ─── Org not found ───
  if (orgError || !org) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy-800 mb-2">Organization not found</h2>
          <p className="text-navy-600 mb-6">This link doesn&apos;t seem to be active.</p>
          <a href="/" className="text-brand-600 hover:text-brand-700 font-medium">
            Go to What Could I Offer? →
          </a>
        </div>
      </div>
    );
  }

  const currentStep = step === 'select' ? 0 : step === 'input' ? 0 : step === 'results' ? 2 : 0;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ─── Org-branded header ─── */}
      <header className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${brandColor}10, ${brandColor}05)` }}>
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, ${brandColor}08)` }} />
        <div className="relative max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: brandColor }}>
                  {org.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-navy-800 leading-tight">{org.name}</h1>
                <p className="text-[11px] text-navy-600 flex items-center gap-1">
                  <span>powered by</span>
                  <span className="font-semibold text-brand-600">What Could I Offer?</span>
                </p>
              </div>
            </div>
            {step !== 'select' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startOver}
                className="text-sm text-navy-600 hover:text-navy-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/50 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Start over
              </motion.button>
            )}
          </div>
          {step === 'select' && org.message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50"
            >
              <p className="text-sm text-navy-700 leading-relaxed flex items-start gap-2">
                <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: brandColor }} />
                {org.message}
              </p>
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Progress */}
        {!loading && !loadingMore && (
          <ProgressSteps current={step === 'select' ? 0 : step === 'input' ? 1 : 2} />
        )}

        <AnimatePresence mode="wait">
          {/* ═══ STEP 1: Select Method ═══ */}
          {step === 'select' && (
            <motion.div key="select" {...pageTransition}>
              <div className="relative">
                <FloatingParticles />
                <div className="relative text-center mb-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                    style={{ backgroundColor: `${brandColor}12`, color: brandColor }}
                  >
                    <Gift className="w-4 h-4" />
                    Discover your hidden auction potential
                  </motion.div>

                  <motion.h2
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    className="text-3xl sm:text-5xl font-bold text-navy-800 mb-4 tracking-tight leading-tight"
                  >
                    You have more to<br />
                    <span style={{ color: brandColor }}>offer</span> than you think
                  </motion.h2>

                  <motion.p
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.15 }}
                    className="text-lg text-navy-600 max-w-xl mx-auto leading-relaxed"
                  >
                    Tell us a little about yourself and we&apos;ll uncover creative, high-value auction offerings unique to you.
                  </motion.p>
                </div>

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
                >
                  {[
                    {
                      method: 'freetext' as InputMethod,
                      icon: MessageSquareText,
                      title: 'In Your Own Words',
                      desc: 'Tell us what you do, love, and are good at',
                      emoji: '✍️',
                    },
                    {
                      method: 'guided' as InputMethod,
                      icon: ClipboardList,
                      title: 'Quick Questions',
                      desc: 'Answer a few prompts — we\'ll do the rest',
                      emoji: '🎯',
                    },
                    {
                      method: 'social' as InputMethod,
                      icon: Linkedin,
                      title: 'Paste Your Bio',
                      desc: 'Drop in your LinkedIn or website bio',
                      emoji: '📋',
                    },
                  ].map((opt, i) => (
                    <motion.button
                      key={opt.method}
                      variants={fadeUp}
                      whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setMethod(opt.method); setStep('input'); }}
                      className="text-left p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 group"
                    >
                      <div className="text-3xl mb-3">{opt.emoji}</div>
                      <h3 className="font-bold text-navy-800 mb-1 group-hover:text-brand-700 transition-colors">
                        {opt.title}
                      </h3>
                      <p className="text-sm text-navy-600 leading-relaxed">{opt.desc}</p>
                    </motion.button>
                  ))}
                </motion.div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-14 text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-navy-600 italic max-w-md mx-auto">
                    &ldquo;I had no idea my backyard could be worth $2,000 at auction. This tool is incredible.&rdquo;
                  </p>
                  <p className="text-xs text-navy-500 mt-1">— Recent donor</p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ═══ STEP 2: Input Form ═══ */}
          {step === 'input' && !loading && (
            <motion.div key="input" {...pageTransition} className="max-w-2xl mx-auto">
              <motion.button
                whileHover={{ x: -3 }}
                onClick={() => setStep('select')}
                className="text-sm text-navy-600 hover:text-navy-800 flex items-center gap-1 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>

              {/* ── Free Text ── */}
              {method === 'freetext' && (
                <motion.div variants={stagger} initial="initial" animate="animate">
                  <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-navy-800 mb-2">
                    What makes you, <span style={{ color: brandColor }}>you?</span>
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-navy-600 mb-6 leading-relaxed">
                    Share anything — profession, hobbies, skills, property, business — the more you share, the more surprising your offerings will be.
                  </motion.p>
                  <InputField
                    label=""
                    placeholder="Example: I'm a dentist who loves sailing. I have a vacation condo in Hilton Head and my wife runs a catering business..."
                    value={freetext}
                    onChange={setFreetext}
                    multiline
                  />
                </motion.div>
              )}

              {/* ── Guided ── */}
              {method === 'guided' && (
                <motion.div variants={stagger} initial="initial" animate="animate">
                  <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-navy-800 mb-2">
                    A few quick <span style={{ color: brandColor }}>details</span>
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-navy-600 mb-6">
                    Answer what you can — skip what you want.
                  </motion.p>

                  <motion.div variants={fadeUp} className="flex gap-2 mb-6">
                    {(['individual', 'business'] as DonorType[]).map(t => (
                      <motion.button
                        key={t}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setDonorType(t)}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          donorType === t
                            ? 'text-white shadow-md'
                            : 'bg-gray-100 text-navy-600 hover:bg-gray-200'
                        }`}
                        style={donorType === t ? { backgroundColor: brandColor } : undefined}
                      >
                        {t === 'individual' ? '👤 Individual' : '🏢 Business'}
                      </motion.button>
                    ))}
                  </motion.div>

                  <div className="space-y-4">
                    {donorType === 'individual' ? (
                      <>
                        <InputField label="What do you do for work?" placeholder="e.g. Dentist, Teacher, Real Estate Agent..." value={guided.profession || ''} onChange={v => updateGuided('profession', v)} />
                        <InputField label="Hobbies & interests" placeholder="e.g. Sailing, photography, cooking, golf..." value={guided.hobbies || ''} onChange={v => updateGuided('hobbies', v)} />
                        <InputField label="Special skills" placeholder="e.g. Wine knowledge, piano, yoga instruction..." value={guided.skills || ''} onChange={v => updateGuided('skills', v)} />
                        <InputField label="Assets or access (optional)" placeholder="e.g. Beach house, boat, season tickets..." value={guided.assets || ''} onChange={v => updateGuided('assets', v)} />
                      </>
                    ) : (
                      <>
                        <InputField label="Business name" placeholder="e.g. Sunrise Coffee Roasters" value={guided.businessName || ''} onChange={v => updateGuided('businessName', v)} />
                        <InputField label="Industry" placeholder="e.g. Restaurant, Law Firm, Fitness Studio..." value={guided.industry || ''} onChange={v => updateGuided('industry', v)} />
                        <InputField label="Type of business" placeholder="e.g. Coffee shop with roasting facility..." value={guided.businessType || ''} onChange={v => updateGuided('businessType', v)} />
                        <InputField label="Special services" placeholder="e.g. Private dining, custom cakes, personal training..." value={guided.specialServices || ''} onChange={v => updateGuided('specialServices', v)} />
                        <InputField label="Physical space (optional)" placeholder="e.g. Event room for 50, outdoor patio..." value={guided.physicalSpace || ''} onChange={v => updateGuided('physicalSpace', v)} />
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Social ── */}
              {method === 'social' && (
                <motion.div variants={stagger} initial="initial" animate="animate">
                  <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-navy-800 mb-2">
                    Drop in your <span style={{ color: brandColor }}>profile</span>
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-navy-600 mb-6">
                    Paste your LinkedIn, website bio, or any profile text.
                  </motion.p>
                  <InputField
                    label=""
                    placeholder="Paste your LinkedIn About section, website bio, or any text that describes who you are..."
                    value={socialText}
                    onChange={setSocialText}
                    multiline
                  />
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSubmit(false)}
                disabled={
                  loading ||
                  (method === 'freetext' && !freetext.trim()) ||
                  (method === 'social' && !socialText.trim()) ||
                  (method === 'guided' && donorType === 'individual' && !guided.profession) ||
                  (method === 'guided' && donorType === 'business' && !guided.businessName)
                }
                className="mt-8 w-full py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                <Sparkles className="w-5 h-5" />
                Discover What I Could Offer
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* ═══ Loading ═══ */}
          {loading && <LoadingState key="loading" isMore={false} />}

          {/* ═══ STEP 3: Results ═══ */}
          {step === 'results' && !loading && (
            <motion.div key="results" {...pageTransition} ref={resultsRef}>
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1, damping: 12 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold mb-4"
                  style={{ backgroundColor: `${brandColor}12`, color: brandColor }}
                >
                  <Gift className="w-4 h-4" />
                  {allSuggestions.length} offering{allSuggestions.length > 1 ? 's' : ''} discovered
                  {hiddenGemsCount > 0 && (
                    <span className="flex items-center gap-1 text-amber-600">
                      · <Gem className="w-3 h-3" /> {hiddenGemsCount} hidden gem{hiddenGemsCount > 1 ? 's' : ''}
                    </span>
                  )}
                </motion.div>

                <motion.h2
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  className="text-3xl sm:text-4xl font-bold text-navy-800 mb-3 tracking-tight"
                >
                  Here&apos;s what you could offer
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.1 }}
                  className="text-navy-600 max-w-lg mx-auto mb-4"
                >
                  {donorSummary}
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.2 }}
                  className="text-sm text-navy-500"
                >
                  Tap offerings to select them, then share with {org.name} ↓
                </motion.p>
              </div>

              {/* Cards */}
              <div className="max-w-3xl mx-auto space-y-3">
                {allSuggestions.map((item, i) => (
                  <SuggestionCard
                    key={`${i}-${item.title}`}
                    item={item}
                    index={i < 8 ? i : 0}
                    selected={selectedIds.has(i)}
                    onToggle={() => toggleSelected(i)}
                    brandColor={brandColor}
                  />
                ))}
              </div>

              {/* Loading more */}
              {loadingMore && (
                <div className="max-w-3xl mx-auto mt-6">
                  <div className="flex items-center justify-center gap-3 py-8">
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: brandColor }} />
                    <span className="text-navy-600 font-medium">Brainstorming more ideas...</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="max-w-3xl mx-auto mt-8">
                {/* Selected count pill */}
                <AnimatePresence>
                  {selectedIds.size > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-center mb-4"
                    >
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full" style={{ backgroundColor: `${brandColor}12`, color: brandColor }}>
                        <CheckCircle2 className="w-4 h-4" />
                        {selectedIds.size} selected
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: selectedIds.size > 0 ? 1.01 : 1 }}
                    whileTap={{ scale: selectedIds.size > 0 ? 0.99 : 1 }}
                    onClick={() => setShowShareModal(true)}
                    disabled={selectedIds.size === 0}
                    className={`flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                      selectedIds.size > 0
                        ? 'text-white shadow-lg'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    style={selectedIds.size > 0 ? { backgroundColor: brandColor } : undefined}
                  >
                    <Send className="w-5 h-5" />
                    {selectedIds.size > 0
                      ? `Share ${selectedIds.size} with ${org.name}`
                      : 'Select offerings to share'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSubmit(true)}
                    disabled={loadingMore}
                    className="flex-1 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 text-navy-700 font-semibold hover:border-brand-200 hover:bg-cream-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Lightbulb className="w-5 h-5" />
                    Keep Brainstorming
                  </motion.button>
                </div>

                <div className="flex justify-center mt-4">
                  <button onClick={startOver} className="text-sm text-navy-500 hover:text-navy-700 flex items-center gap-1.5 transition-colors">
                    <RotateCcw className="w-4 h-4" /> Start Over
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-12 pb-4">
                <p className="text-xs text-navy-500">
                  Powered by{' '}
                  <a href="https://whatcouldioffer.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:text-brand-700">
                    What Could I Offer?
                  </a>
                  {' '}· Built by{' '}
                  <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600">
                    BetterWorld
                  </a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && org && (
          <ShareModal
            selectedItems={selectedItems}
            donorSummary={donorSummary}
            orgId={org.id}
            orgName={org.name}
            brandColor={brandColor}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
