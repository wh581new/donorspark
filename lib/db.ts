/**
 * Persistent KV database for WCIO.
 * Uses Vercel KV (Upstash Redis) for persistent storage.
 * Drop-in replacement for the old /tmp filesystem approach.
 */

import { kv } from '@vercel/kv';
import { v4 as uuid } from 'uuid';

// KV keys
const ORGS_KEY = 'wcio:orgs';
const SUBMISSIONS_KEY = 'wcio:submissions';

// --- Types ---

export interface Org {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  message: string;
  adminEmail: string;
  brandColor: string;
  accessToken: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  orgId: string;
  donorName: string;
  donorEmail: string;
  donorSummary: string;
  offerings: Array<{
    title: string;
    description: string;
    category: string;
    estimatedValue: string;
    donorCost: string;
    whyItWorks: string;
    isHiddenGem: boolean;
    catalogDescription: string;
  }>;
  status: 'new' | 'reviewed' | 'contacted';
  createdAt: string;
}

// --- KV Helpers ---

async function getList<T>(key: string): Promise<T[]> {
  try {
    const data = await kv.get<T[]>(key);
    return data || [];
  } catch {
    return [];
  }
}

async function setList<T>(key: string, data: T[]): Promise<void> {
  await kv.set(key, data);
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

function generateToken(): string {
  return uuid().replace(/-/g, '') + uuid().replace(/-/g, '');
}

// --- Org Operations ---

export async function createOrg(data: {
  name: string;
  logoUrl?: string;
  message: string;
  adminEmail: string;
  brandColor?: string;
}): Promise<Org> {
  const orgs = await getList<Org>(ORGS_KEY);

  let slug = generateSlug(data.name);
  let suffix = 1;
  while (orgs.some(o => o.slug === slug)) {
    slug = generateSlug(data.name) + '-' + suffix;
    suffix++;
  }

  const org: Org = {
    id: uuid(),
    slug,
    name: data.name,
    logoUrl: data.logoUrl || null,
    message: data.message,
    adminEmail: data.adminEmail,
    brandColor: data.brandColor || '#6b8b74',
    accessToken: generateToken(),
    createdAt: new Date().toISOString(),
  };

  orgs.push(org);
  await setList(ORGS_KEY, orgs);
  return org;
}

export async function getOrgBySlug(slug: string): Promise<Org | null> {
  const orgs = await getList<Org>(ORGS_KEY);
  return orgs.find(o => o.slug === slug) || null;
}

export async function getOrgByAccessToken(token: string): Promise<Org | null> {
  const orgs = await getList<Org>(ORGS_KEY);
  return orgs.find(o => o.accessToken === token) || null;
}

export async function getOrgById(id: string): Promise<Org | null> {
  const orgs = await getList<Org>(ORGS_KEY);
  return orgs.find(o => o.id === id) || null;
}

export async function updateOrg(id: string, updates: Partial<Pick<Org, 'name' | 'logoUrl' | 'message' | 'adminEmail' | 'brandColor'>>): Promise<Org | null> {
  const orgs = await getList<Org>(ORGS_KEY);
  const idx = orgs.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orgs[idx] = { ...orgs[idx], ...updates };
  await setList(ORGS_KEY, orgs);
  return orgs[idx];
}

// --- Submission Operations ---

export async function createSubmission(data: {
  orgId: string;
  donorName: string;
  donorEmail: string;
  donorSummary: string;
  offerings: Submission['offerings'];
}): Promise<Submission> {
  const submissions = await getList<Submission>(SUBMISSIONS_KEY);

  const submission: Submission = {
    id: uuid(),
    orgId: data.orgId,
    donorName: data.donorName,
    donorEmail: data.donorEmail,
    donorSummary: data.donorSummary,
    offerings: data.offerings,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  submissions.push(submission);
  await setList(SUBMISSIONS_KEY, submissions);
  return submission;
}

export async function getSubmissionsByOrg(orgId: string): Promise<Submission[]> {
  const submissions = await getList<Submission>(SUBMISSIONS_KEY);
  return submissions
    .filter(s => s.orgId === orgId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const submissions = await getList<Submission>(SUBMISSIONS_KEY);
  return submissions.find(s => s.id === id) || null;
}

export async function updateSubmissionStatus(id: string, status: Submission['status']): Promise<Submission | null> {
  const submissions = await getList<Submission>(SUBMISSIONS_KEY);
  const idx = submissions.findIndex(s => s.id === id);
  if (idx === -1) return null;
  submissions[idx].status = status;
  await setList(SUBMISSIONS_KEY, submissions);
  return submissions[idx];
}

// --- Stats ---

export async function getOrgStats(orgId: string): Promise<{
  totalSubmissions: number;
  totalOfferings: number;
  newSubmissions: number;
  estimatedValue: string;
}> {
  const submissions = await getSubmissionsByOrg(orgId);
  const totalOfferings = submissions.reduce((sum, s) => sum + s.offerings.length, 0);
  const newSubmissions = submissions.filter(s => s.status === 'new').length;

  let totalValue = 0;
  for (const sub of submissions) {
    for (const offering of sub.offerings) {
      const match = offering.estimatedValue.match(/\$?([\d,]+)/g);
      if (match && match.length >= 2) {
        const low = parseInt(match[0].replace(/[\$,]/g, ''));
        const high = parseInt(match[1].replace(/[\$,]/g, ''));
        totalValue += (low + high) / 2;
      } else if (match) {
        totalValue += parseInt(match[0].replace(/[\$,]/g, ''));
      }
    }
  }

  return {
    totalSubmissions: submissions.length,
    totalOfferings,
    newSubmissions,
    estimatedValue: '$' + Math.round(totalValue).toLocaleString(),
  };
}
