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
   Progress Steps
   ═══════════════════════════════════════════════ */
function ProgressSteps({ current }: { current: number }) {
  const steps = ['Tell us about you', 'Discover offerings', 'Share with org'];
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
              i < current
                ? 'bg-emerald-600 text-white'
                : i === current
                ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300'
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
              i < current ? 'bg-emerald-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Suggestion Card — Apple-level premium design
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
      whileHover={{ y: -2, boxShadow: '0 16px 48px rgba(0,0,0,0.06)' }}
      onClick={onToggle}
      className={`relative bg-white rounded-3xl border cursor-pointer transition-all duration-300 overflow-hidden group ${
        selected
          ? 'border-emerald-200 shadow-lg shadow-emerald-100/30'
          : 'border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Selection indicator bar */}
      <motion.div
        className="absolute top-0 left-0 w-1.5 h-full rounded-r-full"
        style={{ backgroundColor: brandColor }}
        animate={{ opacity: selected ? 1 : 0, scaleY: selected ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="p-6 sm:p-7">
        <div className="flex items-start gap-4">
          {/* Select toggle */}
          <motion.div
            className="flex-shrink-0 mt-1"
            whileTap={{ scale: 0.85 }}
          >
            <motion.div
              animate={selected ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {selected ? (
                <CheckCircle2 className="w-6 h-6" style={{ color: brandColor }} />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 group-hover:text-emerald-300 transition-colors" />
              )}
            </motion.div>
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* Badges */}
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

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {item.description}
            </p>

            {/* Value chips */}
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

            {/* Why it works */}
            <p className="text-xs text-gray-600 flex items-start gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 mt-0.5 text-amber-500 flex-shrink-0" />
              <span>{item.whyItWorks}</span>
            </p>

            {/* Expandable catalog copy */}
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
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                        Ready-to-Use Copy
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyCatalog(); }}
                        className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                      >
                        {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
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
      className="max-w-lg mx-auto text-center py-20"
    >
      <motion.div
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200/40"
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
          className="text-lg font-medium text-gray-800 mb-3"
        >
          {messages[msgIdx]}
        </motion.p>
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

      {!isMore && (
        <p className="text-sm text-gray-600 mt-8">
          This usually takes 10-20 seconds
        </p>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Share Modal — premium glass effect
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
      const res = await fetch(`/api/org/${orgId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          donorSummary,
          offerings: selectedItems.map(s => ({
            title: s.title,
            description: s.description,
            estimatedValue: s.estimatedValue,
            donorCost: s.donorCost,
            whyItWorks: s.whyItWorks,
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to share');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
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
            <h3 className="text-2xl font-bold text-gray-900">Share your offerings</h3>
            <button
              onClick={onClose}
              disabled={sending}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                disabled={sending}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                disabled={sending}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Personal note (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message..."
                disabled={sending}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-sm transition-all resize-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
              />
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

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600">
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleShare}
              disabled={sending}
              className="mt-6 w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{ backgroundColor: brandColor || '#059669' }}
            >
              {sending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4" /> Share My Offerings</>
              )}
            </motion.button>
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

  const cls = `w-full rounded-xl border p-3.5 text-gray-900 placeholder-gray-400 text-sm transition-all duration-200 resize-none ${
    focused ? 'border-emerald-300 ring-2 ring-emerald-100 shadow-sm' : 'border-gray-200 hover:border-gray-300'
  }`;

  return (
    <motion.div variants={fadeUp}>
      <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>
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

  const brandColor = org?.brandColor || '#059669';

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Organization not found</h2>
          <p className="text-gray-600 mb-6">This link doesn&apos;t seem to be active.</p>
          <a href="https://betterworld.org" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Go to betterworld →
          </a>
        </div>
      </div>
    );
  }

  const currentStep = step === 'select' ? 0 : step === 'input' ? 0 : step === 'results' ? 2 : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Org-branded header with backdrop blur ─── */}
      <header className="sticky top-0 z-20 border-b border-gray-200/50 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name} className="w-9 h-9 rounded-lg object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: brandColor }}>
                  {org.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-sm font-semibold text-gray-900">{org.name}</h1>
                <p className="text-xs text-gray-500">powered by betterworld</p>
              </div>
            </div>
            {step !== 'select' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startOver}
                className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start over
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-32">
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
                <div className="relative text-center mb-14">
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
                    className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight"
                  >
                    You have more to<br />
                    <span className="text-emerald-600">offer</span>
                  </motion.h2>

                  <motion.p
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.15 }}
                    className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                  >
                    Tell us about yourself and we&apos;ll uncover creative, high-value auction offerings unique to you.
                  </motion.p>
                </div>

                <motion.div
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                  className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16"
                >
                  {[
                    {
                      method: 'freetext' as InputMethod,
                      icon: MessageSquareText,
                      title: 'In Your Own Words',
                      desc: 'Tell us what you do, love, and are good at',
                    },
                    {
                      method: 'guided' as InputMethod,
                      icon: ClipboardList,
                      title: 'Quick Questions',
                      desc: "Answer a few prompts — we'll do the rest",
                    },
                    {
                      method: 'social' as InputMethod,
                      icon: Linkedin,
                      title: 'Paste Your Bio',
                      desc: 'Drop in your LinkedIn or website bio',
                    },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <motion.button
                        key={opt.method}
                        variants={fadeUp}
                        whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setMethod(opt.method); setStep('input'); }}
                        className="text-left p-7 bg-white rounded-3xl border border-gray-200 shadow-sm transition-all duration-300 group hover:border-gray-300"
                      >
                        <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                          <Icon className="w-6 h-6 text-emerald-700" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1.5 text-base">
                          {opt.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
                      </motion.button>
                    );
                  })}
                </motion.div>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic max-w-xl mx-auto leading-relaxed">
                    "I had no idea my backyard could be worth $2,000 at auction. This tool is incredible."
                  </p>
                  <p className="text-xs text-gray-500 mt-2">— Recent donor</p>
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-0 left-0 right-0 text-center pb-8 pt-16"
              >
                <p className="text-xs text-gray-500">
                  Built by{' '}
                  <a href="https://betterworld.org" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                    betterworld
                  </a>
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ STEP 2: Input Form ═══ */}
          {step === 'input' && method && (
            <motion.div key="input" {...pageTransition} className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {method === 'freetext'
                    ? 'Tell us about yourself'
                    : method === 'guided'
                    ? 'Quick questions'
                    : 'Share your bio'}
                </h2>
                <p className="text-gray-600">We use this to find your perfect offerings.</p>
              </div>

              <motion.div
                variants={stagger}
                initial="initial"
                animate="animate"
                className="space-y-6 mb-8"
              >
                {method === 'freetext' && (
                  <>
                    <InputField
                      label="Tell us about yourself"
                      placeholder="Share what you do, your passions, skills, and experiences. The more detail, the better we can help..."
                      value={freetext}
                      onChange={setFreetext}
                      multiline
                    />
                  </>
                )}

                {method === 'guided' && (
                  <>
                    <motion.div variants={fadeUp}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        What type of donor are you?
                      </label>
                      <select
                        value={donorType}
                        onChange={(e) => setDonorType(e.target.value as DonorType)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm transition-all focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="individual">Individual Donor</option>
                        <option value="business">Business Owner</option>
                        <option value="professional">Professional</option>
                        <option value="other">Other</option>
                      </select>
                    </motion.div>

                    <InputField
                      label="What's your profession or main occupation?"
                      placeholder="e.g., Software engineer, Marketing manager, Yoga instructor..."
                      value={guided.profession || ''}
                      onChange={(v) => updateGuided('profession', v)}
                    />

                    <InputField
                      label="What are your hobbies or interests?"
                      placeholder="e.g., Photography, cooking, gardening, travel..."
                      value={guided.hobbies || ''}
                      onChange={(v) => updateGuided('hobbies', v)}
                    />

                    <InputField
                      label="Any special skills or talents?"
                      placeholder="e.g., Speaking, consulting, mentoring, teaching..."
                      value={guided.skills || ''}
                      onChange={(v) => updateGuided('skills', v)}
                    />
                  </>
                )}

                {method === 'social' && (
                  <>
                    <InputField
                      label="Paste your bio"
                      placeholder="Copy and paste your LinkedIn profile, website bio, or similar..."
                      value={socialText}
                      onChange={setSocialText}
                      multiline
                    />
                  </>
                )}

                <InputField
                  label="Anything about the organization or event?"
                  placeholder="e.g., 'We're raising funds for a local school gala' (optional)"
                  value={nonprofitContext}
                  onChange={setNonprofitContext}
                />

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600">
                    {error}
                  </motion.p>
                )}

                <motion.button
                  variants={fadeUp}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-white font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                  style={{ backgroundColor: brandColor || '#059669' }}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Discovering offerings...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Discover Offerings</>
                  )}
                </motion.button>
              </motion.div>

              {loading && <LoadingState isMore={false} />}
            </motion.div>
          )}

          {/* ═══ STEP 3: Results ═══ */}
          {step === 'results' && (
            <motion.div key="results" {...pageTransition} ref={resultsRef}>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your personalized offerings</h2>
                <p className="text-gray-600">
                  We found {allSuggestions.length} offering{allSuggestions.length !== 1 ? 's' : ''} tailored to you
                  {hiddenGemsCount > 0 && ` (including ${hiddenGemsCount} hidden gem${hiddenGemsCount !== 1 ? 's' : ''})`}
                </p>
              </div>

              {/* Donor Summary */}
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

              {/* Suggestions Grid */}
              <motion.div
                variants={stagger}
                initial="initial"
                animate="animate"
                className="space-y-4 mb-10"
              >
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

              {/* Brainstorm More Button */}
              {!loadingMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 justify-center mb-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSubmit(true)}
                    disabled={loadingMore}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-900 font-semibold transition-all hover:border-emerald-400 hover:text-emerald-700"
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
                    style={{ backgroundColor: brandColor || '#059669' }}
                  >
                    <Send className="w-4 h-4" />
                    Share {selectedItems.length > 0 && `(${selectedItems.length})`}
                  </motion.button>
                </motion.div>
              )}

              {loadingMore && <LoadingState isMore={true} />}

              {/* Share Modal */}
              <AnimatePresence>
                {showShareModal && (
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
