import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById, updateSubmissionStatus, getOrgByAccessToken } from '@/lib/db';

// PATCH — update submission status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('x-access-token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const org = await getOrgByAccessToken(token);
    if (!org) {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
    }

    const body = await request.json();
    if (!['new', 'reviewed', 'contacted'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const submission = await getSubmissionById(params.id);
    if (!submission || submission.orgId !== org.id) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const updated = await updateSubmissionStatus(params.id, body.status);
    return NextResponse.json({ success: true, submission: updated });
  } catch (error: unknown) {
    console.error('Submission update error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
