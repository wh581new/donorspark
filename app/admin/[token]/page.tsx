'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Mail,
  Gift,
  Zap,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Badge,
  ExternalLink,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useParams } from 'next/navigation';

/* ═══════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════ */

interface Offering {
  title: string;
  description: string;
  value: string;
  category: string;
  catalogCopy: string;
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
   Animation Variants
   ═══════════════════════════════════════════════ */

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const slideDown = {
  initial: { opacity: 0, height: 0, y: -10 },
  animate: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2 } },
};

/* ═══════════════════════════════════════════════
   Stat Counter Component
   ═══════════════════════════════════════════════ */

function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let currentValue = 0;
    const targetValue = value;
    const duration = 1000; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      currentValue = Math.floor(targetValue * progress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

/* ═══════════════════════════════════════════════
   Stat Card Component
   ═══════════════════════════════════════════════ */

function StatCard({
  icon: Icon,
  label,
  value,
  isNumeric = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  isNumeric?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-brand-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600 mb-2">{label}</p>
          <p className="text-2xl font-bold text-brand-950">
            {isNumeric ? <AnimatedCounter value={Number(value)} /> : value}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-brand-50">
          <Icon className="w-5 h-5 text-brand-700" />
        </div>
      </div>

      {/* Animated gradient background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Status Badge Component
   ═══════════════════════════════════════════════ */

function StatusBadge({
  status,
  onClick,
}: {
  status: 'new' | 'reviewed' | 'contacted';
  onClick: () => void;
}) {
  const statusConfig = {
    new: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
      label: 'New',
    },
    reviewed: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      label: 'Reviewed',
    },
    contacted: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      dot: 'bg-green-500',
      label: 'Contacted',
    },
  };

  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:shadow-md ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   Submission Card Component
   ═══════════════════════════════════════════════ */

function SubmissionCard({ submission, token, onStatusUpdate }: { submission: Submission; token: string; onStatusUpdate: (id: string, newStatus: 'new' | 'reviewed' | 'contacted') => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const cycleStatus = async () => {
    const statuses: ('new' | 'reviewed' | 'contacted')[] = ['new', 'reviewed', 'contacted'];
    const currentIndex = statuses.indexOf(submission.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/submission/${submission.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        onStatusUpdate(submission.id, nextStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = new Date(submission.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const totalValue = submission.offerings.reduce((sum, offering) => {
    const val = parseInt(offering.value.replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <motion.div
      layout
      variants={fadeUp}
      className="relative rounded-xl bg-white border border-brand-100 overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-start justify-between hover:bg-brand-50 transition-colors group"
      >
        <div className="flex-1 text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-brand-950 truncate">{submission.donorName}</h3>
              <p className="text-sm text-brand-600 truncate">{submission.donorEmail}</p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={submission.status} onClick={cycleStatus} />
                <span className="text-xs text-brand-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-3 ml-4">
          <div className="text-right">
            <p className="text-sm font-medium text-brand-950">{submission.offerings.length} offering{submission.offerings.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-brand-600">${totalValue.toLocaleString()}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-brand-600 group-hover:text-brand-950 transition-colors" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={slideDown}
            initial="initial"
            animate="animate"
            exit="exit"
            className="border-t border-brand-100"
          >
            <div className="p-6 space-y-6">
              {/* Donor Summary */}
              {submission.donorSummary && (
                <div>
                  <h4 className="text-sm font-semibold text-brand-950 mb-2">Donor Profile</h4>
                  <p className="text-sm text-brand-700 leading-relaxed">{submission.donorSummary}</p>
                </div>
              )}

              {/* Offerings */}
              <div>
                <h4 className="text-sm font-semibold text-brand-950 mb-3">Offerings ({submission.offerings.length})</h4>
                <div className="space-y-3">
                  {submission.offerings.map((offering, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="p-4 rounded-lg bg-brand-50 border border-brand-100"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-brand-950 truncate">{offering.title}</h5>
                          <p className="text-xs text-brand-600 mt-0.5">{offering.category}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="font-semibold text-brand-700">{offering.value}</p>
                        </div>
                      </div>
                      <p className="text-sm text-brand-700 mb-2">{offering.description}</p>
                      {offering.catalogCopy && (
                        <div className="mt-2 pt-2 border-t border-brand-200">
                          <p className="text-xs text-brand-600 italic">{offering.catalogCopy}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-2 pt-2 border-t border-brand-100">
                <a
                  href={`mailto:${submission.donorEmail}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contact Donor
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Empty State Component
   ═══════════════════════════════════════════════ */

function EmptyState() {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
        <Gift className="w-8 h-8 text-brand-400" />
      </div>
      <h3 className="text-lg font-semibold text-brand-950 mb-2">No submissions yet</h3>
      <p className="text-sm text-brand-600 text-center max-w-sm">
        Donors will appear here when they share their offerings. Share your link to get started!
      </p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Copy Link Component
   ═══════════════════════════════════════════════ */

function ShareLinkSection({ org, slug }: { org: Org; slug: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <motion.div variants={fadeUp} className="rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 p-6 border border-brand-200">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-brand-200">
          <ExternalLink className="w-5 h-5 text-brand-800" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-brand-950 mb-1">Share with Donors</h3>
          <p className="text-sm text-brand-700 mb-3">
            Share this link to receive donor offerings
          </p>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-brand-200 text-sm text-brand-600 font-medium">
              <span className="truncate">{shareUrl}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
            >
              {copied ? (
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
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Main Component
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

    if (adminData) {
      fetchSubmissions();
    }
  }, [adminData, token]);

  // Handle status update
  const handleStatusUpdate = (id: string, newStatus: 'new' | 'reviewed' | 'contacted') => {
    setSubmissions(submissions.map(sub =>
      sub.id === id ? { ...sub, status: newStatus } : sub
    ));
  };

  if (error) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-brand-50 to-brand-100"
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-950 mb-2">Access Denied</h1>
          <p className="text-brand-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            Back to Home
          </a>
        </div>
      </motion.div>
    );
  }

  if (!adminData) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-brand-600 font-medium">Loading dashboard...</p>
        </div>
      </motion.div>
    );
  }

  const org = adminData.org;
  const stats = adminData.stats;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-50"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="border-b border-brand-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            {org.logoUrl && (
              <img
                src={org.logoUrl}
                alt={org.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-950">{org.name}</h1>
              <p className="text-sm text-brand-600">Admin Dashboard</p>
            </div>
            {org.adminEmail && (
              <a
                href={`mailto:${org.adminEmail}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Admin
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Stats Grid */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={FileText}
              label="Total Submissions"
              value={stats.totalSubmissions}
              isNumeric
            />
            <StatCard
              icon={Gift}
              label="Total Offerings"
              value={stats.totalOfferings}
              isNumeric
            />
            <StatCard
              icon={Zap}
              label="New Submissions"
              value={stats.newSubmissions}
              isNumeric
            />
            <StatCard
              icon={DollarSign}
              label="Estimated Value"
              value={stats.estimatedValue}
            />
          </motion.div>

          {/* Share Link */}
          <ShareLinkSection org={org} slug={org.slug} />

          {/* Submissions Section */}
          <div>
            <motion.div variants={fadeUp} className="mb-6">
              <h2 className="text-2xl font-bold text-brand-950 flex items-center gap-2">
                <Badge className="w-6 h-6 text-brand-600" />
                Submissions
              </h2>
              <p className="text-sm text-brand-600 mt-1">
                {isLoading ? 'Loading submissions...' : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''}`}
              </p>
            </motion.div>

            {isLoading ? (
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-center py-12"
              >
                <div className="flex flex-col items-center gap-3">
                  <Loader className="w-8 h-8 text-brand-600 animate-spin" />
                  <p className="text-brand-600 font-medium">Loading submissions...</p>
                </div>
              </motion.div>
            ) : submissions.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-3"
              >
                <AnimatePresence mode="popLayout">
                  {submissions.map(submission => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      token={token}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
