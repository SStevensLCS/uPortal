import { NextRequest, NextResponse } from 'next/server';
import type { ConversationThread } from '@admissions-compass/shared';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockThreads: ConversationThread[] = [
  {
    id: '00000000-0000-0000-0000-000000000701',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: '00000000-0000-0000-0000-000000000201',
    household_id: '00000000-0000-0000-0000-000000000101',
    subject: 'Application Status - Emma Johnson',
    is_archived: false,
    last_message_at: '2026-02-26T09:15:00Z',
    created_at: '2026-02-20T14:00:00Z',
    updated_at: '2026-02-26T09:15:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000702',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: '00000000-0000-0000-0000-000000000202',
    household_id: '00000000-0000-0000-0000-000000000102',
    subject: 'Interview Scheduling - Lucas Chen',
    is_archived: false,
    last_message_at: '2026-02-25T16:30:00Z',
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-25T16:30:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000703',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: null,
    household_id: '00000000-0000-0000-0000-000000000103',
    subject: 'Financial Aid Question',
    is_archived: false,
    last_message_at: '2026-02-24T11:00:00Z',
    created_at: '2026-02-22T09:30:00Z',
    updated_at: '2026-02-24T11:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000704',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: '00000000-0000-0000-0000-000000000204',
    household_id: '00000000-0000-0000-0000-000000000104',
    subject: 'Missing Recommendation Letter - Olivia Martinez',
    is_archived: false,
    last_message_at: '2026-02-23T14:45:00Z',
    created_at: '2026-02-15T08:00:00Z',
    updated_at: '2026-02-23T14:45:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000705',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: null,
    household_id: '00000000-0000-0000-0000-000000000105',
    subject: 'Campus Tour Follow-Up',
    is_archived: true,
    last_message_at: '2026-02-10T17:00:00Z',
    created_at: '2026-02-05T12:00:00Z',
    updated_at: '2026-02-10T17:00:00Z',
  },
];

// Mock thread metadata for enrichment
const threadMetadata: Record<string, { participant_name: string; unread_count: number; last_message_preview: string }> = {
  '00000000-0000-0000-0000-000000000701': {
    participant_name: 'Sarah Johnson',
    unread_count: 1,
    last_message_preview: 'Thank you for the update! We will submit the remaining documents by Friday.',
  },
  '00000000-0000-0000-0000-000000000702': {
    participant_name: 'Michael Chen',
    unread_count: 0,
    last_message_preview: 'Great, we have confirmed the interview for March 8th at 2:00 PM.',
  },
  '00000000-0000-0000-0000-000000000703': {
    participant_name: 'Jennifer Williams',
    unread_count: 2,
    last_message_preview: 'Could you please clarify the financial aid application deadline?',
  },
  '00000000-0000-0000-0000-000000000704': {
    participant_name: 'Lisa Martinez',
    unread_count: 0,
    last_message_preview: 'The recommendation letter has been submitted. Thank you for your patience.',
  },
  '00000000-0000-0000-0000-000000000705': {
    participant_name: 'Robert Kim',
    unread_count: 0,
    last_message_preview: 'Thank you for the wonderful tour experience. We are very interested.',
  },
};

let threads = [...mockThreads];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const archived = searchParams.get('archived') === 'true';
  const search = searchParams.get('search');

  let filtered = threads.filter((t) => t.is_archived === archived);

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        (threadMetadata[t.id]?.participant_name || '').toLowerCase().includes(q)
    );
  }

  // Sort by most recent message
  filtered.sort(
    (a, b) =>
      new Date(b.last_message_at || b.created_at).getTime() -
      new Date(a.last_message_at || a.created_at).getTime()
  );

  // Enrich with metadata
  const enriched = filtered.map((t) => ({
    ...t,
    ...(threadMetadata[t.id] || { participant_name: 'Unknown', unread_count: 0, last_message_preview: '' }),
  }));

  return NextResponse.json({
    data: enriched,
    meta: { total: enriched.length },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newThread: ConversationThread = {
      id: crypto.randomUUID(),
      school_id: '00000000-0000-0000-0000-000000000001',
      application_id: body.application_id || null,
      household_id: body.household_id || null,
      subject: body.subject,
      is_archived: false,
      last_message_at: now,
      created_at: now,
      updated_at: now,
    };

    threads.push(newThread);

    // Store metadata
    threadMetadata[newThread.id] = {
      participant_name: body.participant_name || 'New Participant',
      unread_count: 0,
      last_message_preview: body.initial_message || '',
    };

    return NextResponse.json({ data: newThread }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
