'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import {
  DonorType,
  InputMethod,
  GuidedAnswers,
  DonorInput,
  AuctionSuggestion,
  SuggestionsResponse,
} from '@/lib/types';

/* ─── Suggestion Card ─── */
function SuggestionCard({
  item,
  index,
}: {
  item: AuctionSuggestion;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCatalog = () => {
    navigator.clipboard.writeText(
      `${item.title}\n\n${item.catalogDescription}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="animate-slide-up bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full">
                {item.category}
              </span>
              {item.isHiddenGem && (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Gem className="w-3 h-3" />
                  Hidden Gem
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-navy-800">
              {item.title}
            </h3>
          </div>
        </div>

        <p className="text-navy-600 text-sm leading-relaxed mb-4">
          {item.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-green-700 mb-0.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Expected Bids</span>
            </div>
            <span className="text-sm font-bold text-green-800">
              {item.estimatedValue}
            </span>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-blue-700 mb-0.5">
              <Tag className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Your Cost</span>
            </div>
            <span className="text-sm font-bold text-blue-800">
              {item.donorCost}
            </span>
          </div>
        </div>

        <p className="text-xs text-navy-600 italic mb-3">
          {item.whyItWorks}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1 transition-colors"
        >
          {expanded ? (
            <>
              Hide catalog copy <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              View auction catalog copy <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-3 bg-cream-100 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-navy-600 uppercase tracking-wider">
                Ready-to-Use Catalog Description
              </span>
              <button
                onClick={copyCatalog}
                className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-navy-700 leading-relaxed italic">
              &ldquo;{item.catalogDescription}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          <span className="text-lg font-medium text-navy-700">
            Discovering what you could offer...
          </span>
        </div>
        <p className="text-sm text-navy-600">
          Uncovering your hidden gems — this takes 10-20 seconds
        </p>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-brand-100 p-6">
          <div className="skeleton h-5 w-24 mb-3" />
          <div className="skeleton h-6 w-3/4 mb-3" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-2/3 mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <div className="skeleton h-16 w-full" />
            <div className="skeleton h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main App ─── */
export default function Home() {
  const [step, setStep] = useState<'select' | 'input' | 'results'>('select');
  const [method, setMethod] = useState<InputMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SuggestionsResponse | null>(null);

  // Free text
  const [freetext, setFreetext] = useState('');

  // Guided
  const [donorType, setDonorType] = useState<DonorType>('individual');
  const [guided, setGuided] = useState<GuidedAnswers>({
    donorType: 'individual',
  });

  // Social
  const [socialText, setSocialText] = useState('');

  // Optional nonprofit context
  const [nonprofitContext, setNonprofitContext] = useState('');

  const selectMethod = (m: InputMethod) => {
    setMethod(m);
    setStep('input');
  };

  const updateGuided = (key: keyof GuidedAnswers, value: string) => {
    setGuided((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const input: DonorInput = {
      method: method!,
      nonprofitContext: nonprofitContext || undefined,
    };

    switch (method) {
      case 'freetext':
        input.freetext = freetext;
        break;
      case 'guided':
        input.guided = { ...guided, donorType };
        break;
      case 'social':
        input.socialText = socialText;
        break;
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
      setResults(data);
      setStep('results');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    setStep('select');
    setMethod(null);
    setResults(null);
    setError(null);
    setFreetext('');
    setGuided({ donorType: 'individual' });
    setSocialText('');
    setNonprofitContext('');
  };

  const hiddenGemsCount =
    results?.suggestions.filter((s) => s.isHiddenGem).length || 0;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-cream-100 border-b border-brand-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy-800 leading-tight tracking-tight">
                What Could I Offer?
              </h1>
              <p className="text-[11px] text-brand-600 leading-tight">
                by BetterWorld
              </p>
            </div>
          </div>
          {step !== 'select' && (
            <button
              onClick={startOver}
              className="text-sm text-navy-600 hover:text-navy-800 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Start over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-20">
        {/* ─── STEP 1: Select Input Method ─── */}
        {step === 'select' && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-800 mb-3 tracking-tight">
                You have more to offer than you think
              </h2>
              <p className="text-lg text-navy-600 max-w-xl mx-auto leading-relaxed">
                Tell us a little about yourself and we&apos;ll uncover creative,
                high-value offerings unique to you — things you never knew
                could raise serious money at auction.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <button
                onClick={() => selectMethod('freetext')}
                className="group text-left p-6 bg-white rounded-2xl border border-brand-100 hover:border-brand-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-cream-100 group-hover:bg-brand-50 flex items-center justify-center mb-4 transition-colors">
                  <MessageSquareText className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-navy-800 mb-1">
                  In Your Own Words
                </h3>
                <p className="text-sm text-navy-600">
                  Describe what you do, what you love, and what makes you you
                </p>
              </button>

              <button
                onClick={() => selectMethod('guided')}
                className="group text-left p-6 bg-white rounded-2xl border border-brand-100 hover:border-brand-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-cream-100 group-hover:bg-brand-50 flex items-center justify-center mb-4 transition-colors">
                  <ClipboardList className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-navy-800 mb-1">
                  Quick Questions
                </h3>
                <p className="text-sm text-navy-600">
                  Answer a few prompts and we&apos;ll surface your hidden offerings
                </p>
              </button>

              <button
                onClick={() => selectMethod('social')}
                className="group text-left p-6 bg-white rounded-2xl border border-brand-100 hover:border-brand-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-cream-100 group-hover:bg-brand-50 flex items-center justify-center mb-4 transition-colors">
                  <Linkedin className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-navy-800 mb-1">
                  Use Your Profile
                </h3>
                <p className="text-sm text-navy-600">
                  Paste your LinkedIn or bio and we&apos;ll do the thinking
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Input Form ─── */}
        {step === 'input' && !loading && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <button
              onClick={() => setStep('select')}
              className="text-sm text-navy-600 hover:text-navy-800 flex items-center gap-1 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {/* Free Text */}
            {method === 'freetext' && (
              <div>
                <h2 className="text-2xl font-bold text-navy-800 mb-2">
                  What makes you, you?
                </h2>
                <p className="text-navy-600 mb-6">
                  Share anything — your profession, hobbies, skills, property,
                  business — the more we know, the more surprising your offerings
                  will be.
                </p>
                <textarea
                  value={freetext}
                  onChange={(e) => setFreetext(e.target.value)}
                  placeholder="Example: I'm a dentist who loves sailing. I have a vacation condo in Hilton Head and I'm also a pretty good amateur photographer. My wife runs a catering business..."
                  rows={6}
                  className="w-full rounded-xl border border-brand-100 p-4 text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent resize-none text-sm"
                />
              </div>
            )}

            {/* Guided */}
            {method === 'guided' && (
              <div>
                <h2 className="text-2xl font-bold text-navy-800 mb-2">
                  Let&apos;s find what you could offer
                </h2>
                <p className="text-navy-600 mb-6">
                  A few quick details and we&apos;ll discover offerings you didn&apos;t
                  know you had.
                </p>

                {/* Donor type toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setDonorType('individual')}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      donorType === 'individual'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-cream-100 text-navy-600 hover:bg-cream-200'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    onClick={() => setDonorType('business')}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      donorType === 'business'
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'bg-cream-100 text-navy-600 hover:bg-cream-200'
                    }`}
                  >
                    Business
                  </button>
                </div>

                <div className="space-y-4">
                  {donorType === 'individual' ? (
                    <>
                      <InputField
                        label="What do you do for work?"
                        placeholder="e.g. Dentist, Software Engineer, Real Estate Agent, Teacher..."
                        value={guided.profession || ''}
                        onChange={(v) => updateGuided('profession', v)}
                      />
                      <InputField
                        label="Hobbies & interests"
                        placeholder="e.g. Sailing, photography, cooking, golf, woodworking..."
                        value={guided.hobbies || ''}
                        onChange={(v) => updateGuided('hobbies', v)}
                      />
                      <InputField
                        label="Special skills or expertise"
                        placeholder="e.g. Wine knowledge, piano, yoga instruction, public speaking..."
                        value={guided.skills || ''}
                        onChange={(v) => updateGuided('skills', v)}
                      />
                      <InputField
                        label="Assets or access (optional)"
                        placeholder="e.g. Beach house, boat, season tickets, country club membership..."
                        value={guided.assets || ''}
                        onChange={(v) => updateGuided('assets', v)}
                      />
                    </>
                  ) : (
                    <>
                      <InputField
                        label="Business name"
                        placeholder="e.g. Sunrise Coffee Roasters"
                        value={guided.businessName || ''}
                        onChange={(v) => updateGuided('businessName', v)}
                      />
                      <InputField
                        label="Industry"
                        placeholder="e.g. Restaurant, Law Firm, Fitness Studio, Tech Company..."
                        value={guided.industry || ''}
                        onChange={(v) => updateGuided('industry', v)}
                      />
                      <InputField
                        label="What type of business?"
                        placeholder="e.g. Coffee shop with roasting facility, boutique fitness studio..."
                        value={guided.businessType || ''}
                        onChange={(v) => updateGuided('businessType', v)}
                      />
                      <InputField
                        label="Special services you offer"
                        placeholder="e.g. Private dining, custom cakes, personal training, tax prep..."
                        value={guided.specialServices || ''}
                        onChange={(v) => updateGuided('specialServices', v)}
                      />
                      <InputField
                        label="Physical space / venue (optional)"
                        placeholder="e.g. Event room for 50, outdoor patio, private studio..."
                        value={guided.physicalSpace || ''}
                        onChange={(v) => updateGuided('physicalSpace', v)}
                      />
                      <InputField
                        label="Team expertise (optional)"
                        placeholder="e.g. Certified sommelier on staff, master barber, licensed therapist..."
                        value={guided.teamExpertise || ''}
                        onChange={(v) => updateGuided('teamExpertise', v)}
                      />
                      <InputField
                        label="Products or inventory (optional)"
                        placeholder="e.g. Craft beer selection, organic skincare line, handmade furniture..."
                        value={guided.inventoryOrProducts || ''}
                        onChange={(v) =>
                          updateGuided('inventoryOrProducts', v)
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Social / LinkedIn */}
            {method === 'social' && (
              <div>
                <h2 className="text-2xl font-bold text-navy-800 mb-2">
                  Drop in your profile
                </h2>
                <p className="text-navy-600 mb-6">
                  Paste your LinkedIn &ldquo;About,&rdquo; website bio, or any
                  profile text — we&apos;ll find the offerings hidden in your
                  background.
                </p>
                <textarea
                  value={socialText}
                  onChange={(e) => setSocialText(e.target.value)}
                  placeholder={"Paste your LinkedIn About section, Instagram bio, website About page, or just your profile URL here...\n\nTip: On LinkedIn, go to your profile → click your About section → copy the text"}
                  rows={8}
                  className="w-full rounded-xl border border-brand-100 p-4 text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent resize-none text-sm"
                />
              </div>
            )}

            {/* Nonprofit context (all methods) */}
            <div className="mt-6 pt-6 border-t border-brand-100">
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                What&apos;s the event?{' '}
                <span className="text-navy-600 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={nonprofitContext}
                onChange={(e) => setNonprofitContext(e.target.value)}
                placeholder="e.g. School gala, animal shelter fundraiser, community arts program..."
                className="w-full rounded-xl border border-brand-100 p-3 text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent text-sm"
              />
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                (method === 'freetext' && !freetext.trim()) ||
                (method === 'social' && !socialText.trim()) ||
                (method === 'guided' &&
                  donorType === 'individual' &&
                  !guided.profession) ||
                (method === 'guided' &&
                  donorType === 'business' &&
                  !guided.businessName)
              }
              className="mt-6 w-full py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-5 h-5" />
              Show Me What I Could Offer
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* ─── STEP 3: Results ─── */}
        {step === 'results' && results && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-navy-800 mb-2 tracking-tight">
                Here&apos;s what you could offer
              </h2>
              <p className="text-navy-600 max-w-lg mx-auto mb-4">
                {results.donorSummary}
              </p>
              {hiddenGemsCount > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                  <Gem className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    {hiddenGemsCount} Hidden Gem
                    {hiddenGemsCount > 1 ? 's' : ''} — costs you little,
                    worth a lot to bidders
                  </span>
                </div>
              )}
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {results.suggestions.map((item, i) => (
                <SuggestionCard key={i} item={item} index={i} />
              ))}
            </div>

            <div className="max-w-3xl mx-auto mt-8 text-center">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lightbulb className="w-5 h-5" />
                  Discover More Offerings
                </button>
                <button
                  onClick={startOver}
                  className="px-6 py-3 rounded-xl bg-white border border-brand-200 text-navy-700 font-semibold hover:bg-cream-50 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Start Over
                </button>
              </div>
              <p className="mt-6 text-xs text-navy-600">
                Built by{' '}
                <a
                  href="https://betterworld.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-500 hover:text-brand-600"
                >
                  BetterWorld
                </a>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Reusable input field ─── */
function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-700 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brand-100 p-3 text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent text-sm"
      />
    </div>
  );
}
