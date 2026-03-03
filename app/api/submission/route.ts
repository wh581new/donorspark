import { NextRequest, NextResponse } from 'next/server';
import { createSubmission, getSubmissionsByOrg, getOrgByAccessToken } from '@/lib/db';

// POST — donor submits offerings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.orgId || !body.donorName?.trim() || !body.donorEmail?.trim() || !body.offerings?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: orgId, donorName, donorEmail, offerings' },
        { status: 400 }
      );
    }

    const submission = await createSubmission({
      orgId: body.orgId,
      donorName: body.donorName.trim(),
      donorEmail: body.donorEmail.trim(),
      donorSummary: body.donorSummary || '',
      offerings: body.offerings,
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: `Your ${submission.offerings.length} offering${submission.offerings.length > 1 ? 's have' : ' has'} been shared!`,
    });
  } catch (error: unknown) {
    console.error('Submission error:', error);
    const message = error instanceof Error ? error.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — admin fetches submissions (requires access token)
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('x-access-token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const org = await getOrgByAccessToken(token);
    if (!org) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
    }

    const submissions = await getSubmissionsByOrg(org.id);
    return NextResponse.json({ submissions });
  } catch (error: unknown) {
    console.error('Submissions fetch error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
