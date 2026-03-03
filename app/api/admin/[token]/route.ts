import { NextRequest, NextResponse } from 'next/server';
import { getOrgByAccessToken, getOrgStats } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const org = await getOrgByAccessToken(params.token);
    if (!org) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
    }

    const stats = await getOrgStats(org.id);

    return NextResponse.json({
      org: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        logoUrl: org.logoUrl,
        message: org.message,
        adminEmail: org.adminEmail,
        brandColor: org.brandColor,
      },
      stats,
    });
  } catch (error: unknown) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
