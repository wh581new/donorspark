import { NextRequest, NextResponse } from 'next/server';
import { createOrg } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name?.trim() || !body.adminEmail?.trim()) {
      return NextResponse.json(
        { error: 'Organization name and admin email are required.' },
        { status: 400 }
      );
    }

    const org = await createOrg({
      name: body.name.trim(),
      logoUrl: body.logoUrl || undefined,
      message: body.message?.trim() || '',
      adminEmail: body.adminEmail.trim(),
      brandColor: body.brandColor || undefined,
    });

    return NextResponse.json({
      success: true,
      org: {
        id: org.id,
        slug: org.slug,
        name: org.name,
        accessToken: org.accessToken,
      },
      donorLink: `/org/${org.slug}`,
      adminLink: `/admin/${org.accessToken}`,
    });
  } catch (error: unknown) {
    console.error('Org register error:', error);
    const message = error instanceof Error ? error.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
