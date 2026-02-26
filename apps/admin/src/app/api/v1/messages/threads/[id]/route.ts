import { NextRequest, NextResponse } from 'next/server';
import type { ConversationMessage } from '@admissions-compass/shared';

// ─── Mock Thread Messages ───────────────────────────────────────────────────

const mockThreadMessages: Record<string, ConversationMessage[]> = {
  '00000000-0000-0000-0000-000000000701': [
    {
      id: 'msg-001',
      thread_id: '00000000-0000-0000-0000-000000000701',
      sender_id: 'staff-001',
      body: 'Dear Sarah, thank you for submitting your application for Emma. We have received all documents and will begin our review shortly. Please let us know if you have any questions.',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-20T15:00:00Z',
      created_at: '2026-02-20T14:00:00Z',
      updated_at: '2026-02-20T14:00:00Z',
    },
    {
      id: 'msg-002',
      thread_id: '00000000-0000-0000-0000-000000000701',
      sender_id: 'parent-101',
      body: 'Thank you for the confirmation! I wanted to ask - when can we expect to hear back about the interview schedule?',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-21T09:00:00Z',
      created_at: '2026-02-21T08:30:00Z',
      updated_at: '2026-02-21T08:30:00Z',
    },
    {
      id: 'msg-003',
      thread_id: '00000000-0000-0000-0000-000000000701',
      sender_id: 'staff-001',
      body: 'Great question! We typically schedule interviews within 2-3 weeks of application submission. You should receive an interview invitation by the first week of March. We will reach out with available time slots.',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-22T10:00:00Z',
      created_at: '2026-02-22T09:15:00Z',
      updated_at: '2026-02-22T09:15:00Z',
    },
    {
      id: 'msg-004',
      thread_id: '00000000-0000-0000-0000-000000000701',
      sender_id: 'staff-002',
      body: '[Internal note] Parent seems very engaged. High-priority family - father is an alum.',
      attachments: [],
      is_internal: true,
      read_at: null,
      created_at: '2026-02-22T09:30:00Z',
      updated_at: '2026-02-22T09:30:00Z',
    },
    {
      id: 'msg-005',
      thread_id: '00000000-0000-0000-0000-000000000701',
      sender_id: 'parent-101',
      body: 'Thank you for the update! We will submit the remaining documents by Friday.',
      attachments: [],
      is_internal: false,
      read_at: null,
      created_at: '2026-02-26T09:15:00Z',
      updated_at: '2026-02-26T09:15:00Z',
    },
  ],
  '00000000-0000-0000-0000-000000000702': [
    {
      id: 'msg-010',
      thread_id: '00000000-0000-0000-0000-000000000702',
      sender_id: 'staff-001',
      body: 'Dear Michael, we would like to schedule an interview for Lucas. Are you available during the week of March 8-12?',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-18T14:00:00Z',
      created_at: '2026-02-18T10:00:00Z',
      updated_at: '2026-02-18T10:00:00Z',
    },
    {
      id: 'msg-011',
      thread_id: '00000000-0000-0000-0000-000000000702',
      sender_id: 'parent-102',
      body: 'Yes, we are available! March 8th in the afternoon would work best for us.',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-19T08:00:00Z',
      created_at: '2026-02-18T18:30:00Z',
      updated_at: '2026-02-18T18:30:00Z',
    },
    {
      id: 'msg-012',
      thread_id: '00000000-0000-0000-0000-000000000702',
      sender_id: 'staff-001',
      body: 'Great, we have confirmed the interview for March 8th at 2:00 PM. The interview will be conducted via Zoom. I will send the meeting link closer to the date.',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-25T16:30:00Z',
      created_at: '2026-02-25T16:30:00Z',
      updated_at: '2026-02-25T16:30:00Z',
    },
  ],
  '00000000-0000-0000-0000-000000000703': [
    {
      id: 'msg-020',
      thread_id: '00000000-0000-0000-0000-000000000703',
      sender_id: 'parent-103',
      body: 'Hello, I have a question about the financial aid process. What documents are needed and when is the deadline?',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-22T10:00:00Z',
      created_at: '2026-02-22T09:30:00Z',
      updated_at: '2026-02-22T09:30:00Z',
    },
    {
      id: 'msg-021',
      thread_id: '00000000-0000-0000-0000-000000000703',
      sender_id: 'staff-003',
      body: 'Hello Jennifer, thank you for your interest in financial aid. You will need to submit your most recent tax return, W-2 forms, and the financial aid application form. The deadline is April 15, 2026.',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-23T08:00:00Z',
      created_at: '2026-02-22T15:00:00Z',
      updated_at: '2026-02-22T15:00:00Z',
    },
    {
      id: 'msg-022',
      thread_id: '00000000-0000-0000-0000-000000000703',
      sender_id: 'parent-103',
      body: 'Could you please clarify the financial aid application deadline? Is it April 15 for all grades?',
      attachments: [],
      is_internal: false,
      read_at: null,
      created_at: '2026-02-24T11:00:00Z',
      updated_at: '2026-02-24T11:00:00Z',
    },
  ],
  '00000000-0000-0000-0000-000000000704': [
    {
      id: 'msg-030',
      thread_id: '00000000-0000-0000-0000-000000000704',
      sender_id: 'staff-001',
      body: 'Dear Lisa, we are still awaiting the recommendation letter for Olivia from her current teacher. Could you please follow up with them?',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-15T12:00:00Z',
      created_at: '2026-02-15T08:00:00Z',
      updated_at: '2026-02-15T08:00:00Z',
    },
    {
      id: 'msg-031',
      thread_id: '00000000-0000-0000-0000-000000000704',
      sender_id: 'parent-104',
      body: 'I spoke with Mrs. Thompson and she said she will submit it this week. Sorry for the delay!',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-16T09:00:00Z',
      created_at: '2026-02-15T20:00:00Z',
      updated_at: '2026-02-15T20:00:00Z',
    },
    {
      id: 'msg-032',
      thread_id: '00000000-0000-0000-0000-000000000704',
      sender_id: 'parent-104',
      body: 'The recommendation letter has been submitted. Thank you for your patience.',
      attachments: [],
      is_internal: false,
      read_at: '2026-02-24T08:00:00Z',
      created_at: '2026-02-23T14:45:00Z',
      updated_at: '2026-02-23T14:45:00Z',
    },
  ],
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const messages = mockThreadMessages[id];

  if (!messages) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Thread not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: messages,
    meta: { total: messages.length },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const threadMessages = mockThreadMessages[id];

  if (!threadMessages) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Thread not found' } },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      thread_id: id,
      sender_id: body.sender_id || 'staff-001',
      body: body.body,
      attachments: body.attachments || [],
      is_internal: body.is_internal || false,
      read_at: null,
      created_at: now,
      updated_at: now,
    };

    threadMessages.push(newMessage);

    return NextResponse.json({ data: newMessage }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
