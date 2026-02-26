import { NextRequest, NextResponse } from 'next/server';
import type { Message, MessageChannel, MessageStatus } from '@admissions-compass/shared';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockMessages: Message[] = [
  {
    id: '00000000-0000-0000-0000-000000000801',
    school_id: '00000000-0000-0000-0000-000000000001',
    template_id: null,
    channel: 'email',
    from_address: 'admissions@lincolnacademy.edu',
    to_address: 'sarah.johnson@email.com',
    subject: 'Application Received - Confirmation',
    body: 'Dear Sarah, Thank you for submitting your application for Emma. We have received all required documents and will begin our review process shortly. You can track your application status through the parent portal.',
    status: 'delivered',
    sent_at: '2026-02-25T14:30:00Z',
    delivered_at: '2026-02-25T14:30:15Z',
    opened_at: '2026-02-25T15:12:00Z',
    clicked_at: null,
    metadata: { recipient_name: 'Sarah Johnson', student_name: 'Emma Johnson' },
    created_at: '2026-02-25T14:30:00Z',
    updated_at: '2026-02-25T15:12:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000802',
    school_id: '00000000-0000-0000-0000-000000000001',
    template_id: '00000000-0000-0000-0000-000000000901',
    channel: 'email',
    from_address: 'admissions@lincolnacademy.edu',
    to_address: 'michael.chen@email.com',
    subject: 'Interview Schedule Confirmation',
    body: 'Dear Michael, This email confirms your interview appointment for Lucas scheduled on March 8, 2026 at 2:00 PM. Please arrive 10 minutes early. The interview will be conducted via Zoom.',
    status: 'opened',
    sent_at: '2026-02-24T10:00:00Z',
    delivered_at: '2026-02-24T10:00:12Z',
    opened_at: '2026-02-24T11:45:00Z',
    clicked_at: '2026-02-24T11:46:00Z',
    metadata: { recipient_name: 'Michael Chen', student_name: 'Lucas Chen' },
    created_at: '2026-02-24T10:00:00Z',
    updated_at: '2026-02-24T11:46:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000803',
    school_id: '00000000-0000-0000-0000-000000000001',
    template_id: null,
    channel: 'sms',
    from_address: '+15551234567',
    to_address: '+15559876543',
    subject: null,
    body: 'Reminder: Your campus tour at Lincoln Academy is tomorrow at 10 AM. Reply CONFIRM to confirm or CANCEL to cancel.',
    status: 'delivered',
    sent_at: '2026-02-23T16:00:00Z',
    delivered_at: '2026-02-23T16:00:05Z',
    opened_at: null,
    clicked_at: null,
    metadata: { recipient_name: 'Jennifer Williams' },
    created_at: '2026-02-23T16:00:00Z',
    updated_at: '2026-02-23T16:00:05Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000804',
    school_id: '00000000-0000-0000-0000-000000000001',
    template_id: '00000000-0000-0000-0000-000000000903',
    channel: 'email',
    from_address: 'admissions@lincolnacademy.edu',
    to_address: 'david.rodriguez@email.com',
    subject: 'Missing Document Reminder',
    body: 'Dear David, We noticed that the academic transcript for Sofia has not yet been uploaded. Please submit this document at your earliest convenience to avoid delays in the review process.',
    status: 'bounced',
    sent_at: '2026-02-22T09:00:00Z',
    delivered_at: null,
    opened_at: null,
    clicked_at: null,
    metadata: { recipient_name: 'David Rodriguez', student_name: 'Sofia Rodriguez', bounce_reason: 'invalid_email' },
    created_at: '2026-02-22T09:00:00Z',
    updated_at: '2026-02-22T09:00:30Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000805',
    school_id: '00000000-0000-0000-0000-000000000001',
    template_id: null,
    channel: 'in_app',
    from_address: 'system',
    to_address: 'user:00000000-0000-0000-0000-000000000101',
    subject: 'Welcome to Lincoln Academy Admissions Portal',
    body: 'Welcome! Your admissions portal account has been created. You can now track your application, upload documents, and communicate with our admissions team.',
    status: 'sent',
    sent_at: '2026-02-20T08:00:00Z',
    delivered_at: null,
    opened_at: null,
    clicked_at: null,
    metadata: { recipient_name: 'Emily Park' },
    created_at: '2026-02-20T08:00:00Z',
    updated_at: '2026-02-20T08:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000806',
    school_id: '00000000-0000-0000-0000-000000000001',
    template_id: '00000000-0000-0000-0000-000000000904',
    channel: 'email',
    from_address: 'admissions@lincolnacademy.edu',
    to_address: 'lisa.martinez@email.com',
    subject: 'Recommendation Request Sent',
    body: 'Dear Lisa, We have sent a recommendation request to Mrs. Thompson on behalf of your child Olivia. We will notify you once the recommendation has been submitted.',
    status: 'delivered',
    sent_at: '2026-02-19T11:30:00Z',
    delivered_at: '2026-02-19T11:30:10Z',
    opened_at: '2026-02-19T14:20:00Z',
    clicked_at: null,
    metadata: { recipient_name: 'Lisa Martinez', student_name: 'Olivia Martinez' },
    created_at: '2026-02-19T11:30:00Z',
    updated_at: '2026-02-19T14:20:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000807',
    school_id: '00000000-0000-0000-0000-000000000001',
    template_id: null,
    channel: 'email',
    from_address: 'admissions@lincolnacademy.edu',
    to_address: 'robert.kim@email.com',
    subject: 'Open House Invitation - March 15',
    body: 'Dear Robert, We are excited to invite you to our upcoming Open House on March 15, 2026 from 9:00 AM to 12:00 PM. Come meet our faculty, tour the campus, and learn about our academic programs.',
    status: 'sent',
    sent_at: '2026-02-18T09:00:00Z',
    delivered_at: '2026-02-18T09:00:08Z',
    opened_at: null,
    clicked_at: null,
    metadata: { recipient_name: 'Robert Kim', campaign: 'open_house_march' },
    created_at: '2026-02-18T09:00:00Z',
    updated_at: '2026-02-18T09:00:08Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000808',
    school_id: '00000000-0000-0000-0000-000000000001',
    template_id: '00000000-0000-0000-0000-000000000906',
    channel: 'email',
    from_address: 'admissions@lincolnacademy.edu',
    to_address: 'amanda.taylor@email.com',
    subject: 'Payment Reminder - Application Fee',
    body: 'Dear Amanda, This is a friendly reminder that the application fee for Noah is still pending. Please submit payment at your earliest convenience to complete the application process.',
    status: 'delivered',
    sent_at: '2026-02-17T08:30:00Z',
    delivered_at: '2026-02-17T08:30:12Z',
    opened_at: '2026-02-17T10:05:00Z',
    clicked_at: '2026-02-17T10:06:00Z',
    metadata: { recipient_name: 'Amanda Taylor', student_name: 'Noah Taylor' },
    created_at: '2026-02-17T08:30:00Z',
    updated_at: '2026-02-17T10:06:00Z',
  },
];

let messages = [...mockMessages];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel') as MessageChannel | null;
  const status = searchParams.get('status') as MessageStatus | null;
  const search = searchParams.get('search');
  const dateFrom = searchParams.get('date_from');
  const dateTo = searchParams.get('date_to');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '20', 10);

  let filtered = [...messages];

  if (channel) {
    filtered = filtered.filter((m) => m.channel === channel);
  }
  if (status) {
    filtered = filtered.filter((m) => m.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.to_address.toLowerCase().includes(q) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        m.body.toLowerCase().includes(q) ||
        ((m.metadata as Record<string, string>).recipient_name || '').toLowerCase().includes(q)
    );
  }
  if (dateFrom) {
    filtered = filtered.filter((m) => m.sent_at && m.sent_at >= dateFrom);
  }
  if (dateTo) {
    filtered = filtered.filter((m) => m.sent_at && m.sent_at <= dateTo);
  }

  // Sort by most recent first
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  return NextResponse.json({
    data: paged,
    meta: {
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newMessage: Message = {
      id: crypto.randomUUID(),
      school_id: '00000000-0000-0000-0000-000000000001',
      template_id: body.template_id || null,
      channel: body.channel || 'email',
      from_address: body.from_address || 'admissions@lincolnacademy.edu',
      to_address: body.to_address,
      subject: body.subject || null,
      body: body.body,
      status: body.schedule_at ? 'queued' : 'sent',
      sent_at: body.schedule_at || now,
      delivered_at: body.schedule_at ? null : now,
      opened_at: null,
      clicked_at: null,
      metadata: body.metadata || {},
      created_at: now,
      updated_at: now,
    };

    messages.push(newMessage);

    return NextResponse.json({ data: newMessage }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
