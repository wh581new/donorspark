import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts';
import { DonorInput, SuggestionsResponse } from '@/lib/types';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set ANTHROPIC_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const body: DonorInput = await request.json();

    if (!body.method) {
      return NextResponse.json(
        { error: 'Invalid request: missing input method' },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(body),
        },
      ],
      system: buildSystemPrompt(),
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    // Parse the JSON from Claude's response
    let rawText = textBlock.text.trim();

    // Handle markdown code fences if present
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    const suggestions: SuggestionsResponse = JSON.parse(rawText);

    return NextResponse.json(suggestions);
  } catch (error: unknown) {
    console.error('API Error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Provide user-friendly error messages instead of raw API errors
    let userMessage = 'An unexpected error occurred. Please try again.';
    const rawMessage = error instanceof Error ? error.message : '';

    if (rawMessage.includes('credit') || rawMessage.includes('billing') || rawMessage.includes('balance')) {
      userMessage = 'Our AI service is temporarily unavailable. Please try again shortly.';
    } else if (rawMessage.includes('rate') || rawMessage.includes('throttl') || rawMessage.includes('overloaded')) {
      userMessage = 'We\'re experiencing high demand. Please wait a moment and try again.';
    } else if (rawMessage.includes('timeout') || rawMessage.includes('ETIMEDOUT')) {
      userMessage = 'The request took too long. Please try again.';
    }

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
