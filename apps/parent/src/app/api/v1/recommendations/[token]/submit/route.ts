import { NextRequest, NextResponse } from 'next/server';

// In-memory store for submitted recommendations
const submittedRecommendations: Record<string, {
  token: string;
  ratings: Record<string, number>;
  comments: Record<string, string>;
  overall_recommendation: string;
  is_confidential: boolean;
  submitted_at: string;
}> = {};

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  // Check if already submitted
  if (submittedRecommendations[token]) {
    return NextResponse.json(
      { error: { code: 'ALREADY_SUBMITTED', message: 'This recommendation has already been submitted.' } },
      { status: 409 }
    );
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    // Validate required fields
    if (!body.ratings || !body.overall_recommendation) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Ratings and overall recommendation are required.' } },
        { status: 422 }
      );
    }

    const submission = {
      token,
      ratings: body.ratings,
      comments: body.comments || {},
      overall_recommendation: body.overall_recommendation,
      is_confidential: body.is_confidential ?? true,
      submitted_at: now,
    };

    submittedRecommendations[token] = submission;

    return NextResponse.json({
      data: {
        ...submission,
        message: 'Recommendation submitted successfully.',
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body.' } },
      { status: 400 }
    );
  }
}
