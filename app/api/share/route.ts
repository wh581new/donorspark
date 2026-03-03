import { NextRequest, NextResponse } from 'next/server';
import { SharePayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: SharePayload = await request.json();

    if (!body.donorName || !body.donorEmail || !body.selectedOfferings?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build the email-ready summary
    const offeringsList = body.selectedOfferings
      .map(
        (item, i) =>
          `${i + 1}. ${item.title}${item.isHiddenGem ? ' ⭐ Hidden Gem' : ''}\n` +
          `   Category: ${item.category}\n` +
          `   Expected Value: ${item.estimatedValue}\n` +
          `   ${item.description}\n` +
          `   Catalog Copy: "${item.catalogDescription}"`
      )
      .join('\n\n');

    const emailBody = `
New Offering Submission from What Could I Offer?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FROM: ${body.donorName} (${body.donorEmail})
TO: ${body.orgName || 'Your Organization'}

ABOUT THIS DONOR:
${body.donorSummary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OFFERINGS (${body.selectedOfferings.length} item${body.selectedOfferings.length > 1 ? 's' : ''}):

${offeringsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Powered by What Could I Offer? — by BetterWorld
https://whatcouldioffer.com
`.trim();

    // For hackathon: log the email and return success
    // In production: integrate with SendGrid, Resend, or similar
    console.log('=== SHARE EMAIL ===');
    console.log(`To: ${body.orgEmail}`);
    console.log(`Subject: ${body.donorName} wants to offer ${body.selectedOfferings.length} item${body.selectedOfferings.length > 1 ? 's' : ''} for your auction!`);
    console.log(emailBody);
    console.log('=== END EMAIL ===');

    // Return the formatted content so the UI can show a preview
    return NextResponse.json({
      success: true,
      message: `Your ${body.selectedOfferings.length} offering${body.selectedOfferings.length > 1 ? 's' : ''} ${body.selectedOfferings.length > 1 ? 'have' : 'has'} been shared with ${body.orgName || body.orgEmail}!`,
      emailPreview: emailBody,
    });
  } catch (error: unknown) {
    console.error('Share Error:', error);
    const message = error instanceof Error ? error.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
