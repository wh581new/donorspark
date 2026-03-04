'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Copy,
  Check,
  Mail,
  Gift,
  Zap,
  Calendar,
  DollarSign,
  Users,
  FileText,
  ExternalLink,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  BarChart3,
  Inbox,
  Clock,
} from 'lucide-react';
import { useParams } from 'next/navigation';

/* ═══════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════ */

interface Offering {
  title: string;
  description: string;
  estimatedValue: string;
  category: string;
  catalogDescription: string;
  // Legacy field aliases for backward compatibility
  value?: string;
  catalogCopy?: string;
}

interface Submission {
  id: string;
  orgId: string;
  donorName: string;
  donorEmail: string;
  donorSummary: string;
  offerings: Offering[];
  status: 'new' | 'reviewed' | 'contacted';
  createdAt: string;
}

interface Org {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  message?: string;
  adminEmail: string;
  brandColor?: string;
}

interface Stats {
  totalSubmissions: number;
  totalOfferings: number;
  newSubmissions: number;
  estimatedValue: string;
}

interface AdminData {
  org: Org;
  stats: Stats;
}

/* ═══════════════════════════════════════════════
   Animation config
   ═══════════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const slideDown = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
};

/* ═══════════════════════════════════════════════
   BetterWorld Logo
   ═══════════════════════════════════════════════ */
function BetterWorldLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 74" fill="#3d5566" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="58" fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" fontSize="68" fontWeight="600" letterSpacing="-2">
        betterworld
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   Animated Counter
   ═══════════════════════════════════════════════ */
function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const duration = 800;

    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setDisplay(Math.floor(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

/* ═══════════════════════════════════════════════
   Stat Card — Apple-style
   ═══════════════════════════════════════════════ */
function StatCard({
  icon: Icon,
  label,
  value,
  isNumeric = false,
  accent = 'emerald',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  isNumeric?: boolean;
  accent?: 'emerald' | 'blue' | 'amber' | 'violet';
}) {
  const accentMap = {
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', ring: 'ring-blue-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', ring: 'ring-amber-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', ring: 'ring-violet-100' },
  };
  const a = accentMap[accent];

  return (
    <motion.div
      variants={fadeUp}
      className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-gray-500 mb-2 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {isNumeric ? <AnimatedCounter value={Number(value)} /> : value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${a.bg} ring-1 ${a.ring}`}>
          <Icon className={`w-5 h-5 ${a.icon}`} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Status Badge — pill style
   ═══════════════════════════════════════════════ */
function StatusBadge({
  status,
  onClick,
}: {
  status: 'new' | 'reviewed' | 'contacted';
  onClick: () => void;
}) {
  const config = {
    new: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', label: 'New' },
    reviewed: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Reviewed' },
    contacted: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Contacted' },
  }[status];

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all hover:shadow-sm active:scale-95 ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   Submission Card — clean, expandable
   ═══════════════════════════════════════════════ */
function SubmissionCard({
  submission,
  token,
  onStatusUpdate,
}: {
  submission: Submission;
  token: string;
  onStatusUpdate: (id: string, newStatus: 'new' | 'reviewed' | 'contacted') => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const cycleStatus = async () => {
    const statuses: ('new' | 'reviewed' | 'contacted')[] = ['new', 'reviewed', 'contacted'];
    const next = statuses[(statuses.indexOf(submission.status) + 1) % 3];
    setUpdating(true);
    try {
      const res = await fetch(`/api/submission/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) onStatusUpdate(submission.id, next);
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const copyText = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const date = new Date(submission.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const totalValue = submission.offerings.reduce((sum, o) => {
    const valStr = o.estimatedValue || o.value || '0';
    // Parse "$1,500-$2,500" or "$1,500 - $2,500" → midpoint; "$500" → 500
    const nums = valStr.match(/\$?\s*([\d,]+)/g);
    if (!nums || nums.length === 0) return sum;
    const parsed = nums.slice(0, 2).map(n => parseInt(n.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n));
    if (parsed.length === 0) return sum;
    const avg = parsed.reduce((a, b) => a + b, 0) / parsed.length;
    return sum + avg;
  }, 0);

  return (
    <motion.div
      layout
      variants={fadeUp}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 sm:p-6 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
      >
        {/* Avatar */}
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
          <span className="text-lg font-bold text-emerald-700">
            {submission.donorName.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{submission.donorName}</h3>
            <StatusBadge status={submission.status} onClick={cycleStatus} />
          </div>
          <p className="text-sm text-gray-500 truncate mt-0.5">{submission.donorEmail}</p>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{submission.offerings.length}</p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">offerings</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-emerald-700">${totalValue.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wide">est. value</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {date}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={slideDown}
            initial="initial"
            animate="animate"
            exit="exit"
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-5 sm:p-6 space-y-5">
              {/* Mobile stats */}
              <div className="sm:hidden flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Gift className="w-3.5 h-3.5" /> {submission.offerings.length} offerings</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${totalValue.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {date}</span>
              </div>

              {/* Donor summary */}
              {submission.donorSummary && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Donor Profile</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{submission.donorSummary}</p>
                </div>
              )}

              {/* Offerings list */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Offerings ({submission.offerings.length})
                </p>
                <div className="space-y-2.5">
                  {submission.offerings.map((offering, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, ease }}
                      className="p-4 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-gray-900">{offering.title}</h5>
                          <span className="text-[11px] text-gray-400 uppercase tracking-wide">{offering.category}</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex-shrink-0">
                          {offering.estimatedValue || offering.value || 'N/A'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{offering.description}</p>
                      {(offering.catalogDescription || offering.catalogCopy) && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2">
                          <p className="flex-1 text-sm text-gray-500 italic leading-relaxed">
                            &ldquo;{offering.catalogDescription || offering.catalogCopy}&rdquo;
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); copyText(`${offering.title}\n\n${offering.catalogDescription || offering.catalogCopy}`, idx); }}
                            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {copiedIdx === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`mailto:${submission.donorEmail}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Donor
                </a>
                <button
                  onClick={cycleStatus}
                  disabled={updating}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Advance Status'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Empty State
   ═══════════════════════════════════════════════ */
function EmptyState() {
  const [clickCount, setClickCount] = useState(0);
  const [message, setMessage] = useState('');

  const messages = [
    '',
    '👋 Hey there!',
    '🎯 Still waiting for donors...',
    '☕ Maybe grab a coffee while you wait?',
    '🚀 Great things take time!',
    "🦄 You found the secret! You're a dashboard power user!",
  ];

  const handleClick = () => {
    const next = Math.min(clickCount + 1, messages.length - 1);
    setClickCount(next);
    setMessage(messages[next]);
  };

  return (
    <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 px-4">
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-5 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <motion.div
          animate={clickCount >= 5 ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Inbox className={`w-8 h-8 transition-colors ${clickCount >= 5 ? 'text-emerald-500' : 'text-gray-300'}`} />
        </motion.div>
      </motion.button>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No submissions yet</h3>
      <AnimatePresence mode="wait">
        {message ? (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`text-sm text-center max-w-sm leading-relaxed ${clickCount >= 5 ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}
          >
            {message}
          </motion.p>
        ) : (
          <motion.p
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500 text-center max-w-sm leading-relaxed"
          >
            Share your donor link to start receiving offerings. They&apos;ll appear here as they come in.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Share Link Section
   ═══════════════════════════════════════════════ */
function ShareLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/org/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div variants={fadeUp} className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
          <ExternalLink className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">Your Donor Link</h3>
          <p className="text-sm text-gray-500 mb-4">Share this with donors to start receiving auction offerings.</p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-600 font-mono truncate">
              {url}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Main Admin Dashboard
   ═══════════════════════════════════════════════ */
export default function AdminDashboard() {
  const params = useParams();
  const token = params.token as string;

  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`/api/admin/${token}`);
        if (!response.ok) throw new Error('Invalid access token');
        const data = await response.json();
        setAdminData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin data');
      }
    };
    fetchAdminData();
  }, [token]);

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/submission', {
          headers: { 'x-access-token': token },
        });
        if (!response.ok) throw new Error('Failed to fetch submissions');
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (adminData) fetchSubmissions();
  }, [adminData, token]);

  const handleStatusUpdate = (id: string, newStatus: 'new' | 'reviewed' | 'contacted') => {
    setSubmissions(subs => subs.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  // ─── Error state ───
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Home
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  // ─── Loading state ───
  if (!adminData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <p className="text-gray-500 font-medium">Loading dashboard…</p>
        </motion.div>
      </div>
    );
  }

  const { org, stats } = adminData;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ─── Sticky header ─── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {org.logoUrl ? (
                <img src={org.logoUrl} alt={org.name} className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  {org.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900">{org.name}</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`/org/${org.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                View donor page
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://betterworld.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block"
              >
                <BetterWorldLogo className="h-5 opacity-40 hover:opacity-70 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main content ─── */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Submissions" value={stats.totalSubmissions} isNumeric accent="emerald" />
            <StatCard icon={Gift} label="Offerings" value={stats.totalOfferings} isNumeric accent="blue" />
            <StatCard icon={Zap} label="New" value={stats.newSubmissions} isNumeric accent="amber" />
            <StatCard icon={DollarSign} label="Est. Value" value={stats.estimatedValue} accent="violet" />
          </div>

          {/* Share link */}
          <ShareLink slug={org.slug} />

          {/* Submissions */}
          <div>
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                  Submissions
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isLoading ? 'Loading…' : `${submissions.length} total`}
                </p>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : submissions.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div
                variants={stagger}
                initial="initial"
                animate="animate"
                className="space-y-3"
              >
                {submissions.map(sub => (
                  <SubmissionCard
                    key={sub.id}
                    submission={sub}
                    token={token}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-8 pb-4">
            <p className="text-xs text-gray-400">
              Powered by{' '}
              <a href="/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-500 hover:text-gray-700 transition-colors">
                What Could I Offer?
              </a>
              {' · '}
              <a href="https://betterworld.org" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-500 hover:text-gray-700 transition-colors">
                betterworld
              </a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
