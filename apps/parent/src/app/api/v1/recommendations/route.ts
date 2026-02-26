import { NextRequest, NextResponse } from 'next/server';

// In-memory mock data for development
const mockRecommendations = [
  {
    id: 'rec-001',
    application_id: 'app-001',
    token: 'tok-abc123def456',
    recommender_name: 'Ms. Patricia Davis',
    recommender_email: 'pdavis@lincolnelementary.edu',
    recommender_type: 'current_teacher',
    student_name: 'Emma Thompson',
    status: 'completed',
    sent_at: '2026-01-15T10:00:00Z',
    last_reminder_at: null,
    completed_at: '2026-01-22T14:30:00Z',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-22T14:30:00Z',
  },
  {
    id: 'rec-002',
    application_id: 'app-001',
    token: 'tok-ghi789jkl012',
    recommender_name: 'Mr. Robert Kim',
    recommender_email: 'rkim@lincolnelementary.edu',
    recommender_type: 'math_teacher',
    student_name: 'Emma Thompson',
    status: 'sent',
    sent_at: '2026-02-20T09:00:00Z',
    last_reminder_at: null,
    completed_at: null,
    created_at: '2026-02-20T09:00:00Z',
    updated_at: '2026-02-20T09:00:00Z',
  },
];

let recommendations = [...mockRecommendations];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newRecommendation = {
      id: `rec-${crypto.randomUUID().slice(0, 8)}`,
      application_id: body.application_id || 'app-001',
      token: `tok-${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`,
      recommender_name: body.recommender_name,
      recommender_email: body.recommender_email,
      recommender_type: body.recommender_type,
      student_name: body.student_name || 'Emma Thompson',
      status: 'sent' as const,
      sent_at: now,
      last_reminder_at: null,
      completed_at: null,
      created_at: now,
      updated_at: now,
    };

    recommendations.push(newRecommendation);

    return NextResponse.json({ data: newRecommendation }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
