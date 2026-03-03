import { NextRequest, NextResponse } from 'next/server';
import { getOrgBySlug } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const org = await getOrgBySlug(params.slug);
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Return public-safe org data (no access token)
    return NextResponse.json({
      id: org.id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.logoUrl,
      message: org.message,
      brandColor: org.brandColor,
    });
  } catch (error: unknown) {
    console.error('Org fetch error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
