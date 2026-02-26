import { NextRequest, NextResponse } from 'next/server';
import type { EmailTemplate } from '@admissions-compass/shared';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockTemplates: EmailTemplate[] = [
  {
    id: '00000000-0000-0000-0000-000000000901',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Inquiry Follow-Up',
    subject: 'Thank you for your interest in {{school.name}}',
    body_html: '<p>Dear {{parent.first_name}},</p><p>Thank you for your inquiry about {{school.name}}. We are excited about your interest in our school for {{student.first_name}}.</p><p>As a next step, we invite you to schedule a campus tour to see our facilities and meet our faculty. You can schedule your visit through our <a href="{{portal.login_url}}">parent portal</a>.</p><p>Please do not hesitate to reach out if you have any questions.</p><p>Warm regards,<br/>Admissions Office<br/>{{school.name}}</p>',
    body_text: null,
    template_type: 'inquiry_followup',
    merge_tags: ['parent.first_name', 'student.first_name', 'school.name', 'portal.login_url'],
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-02-15T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000902',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Application Reminder',
    subject: 'Complete Your Application for {{student.first_name}}',
    body_html: '<p>Dear {{parent.first_name}},</p><p>We noticed that your application for {{student.first_name}} to {{school.name}} has been started but not yet submitted.</p><p>Your current checklist progress is {{checklist.progress}}. The next item to complete is: {{checklist.next_item}}.</p><p>The application deadline is approaching. Please log in to the <a href="{{portal.application_url}}">parent portal</a> to complete and submit your application.</p><p>Best regards,<br/>Admissions Office</p>',
    body_text: null,
    template_type: 'application_reminder',
    merge_tags: ['parent.first_name', 'student.first_name', 'school.name', 'checklist.progress', 'checklist.next_item', 'portal.application_url'],
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000903',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Missing Document Notification',
    subject: 'Action Required: Missing Documents for {{student.full_name}}',
    body_html: '<p>Dear {{parent.first_name}},</p><p>We are reviewing the application for {{student.full_name}} and noticed that the following document(s) are still missing:</p><p><strong>{{checklist.next_item}}</strong></p><p>Please upload the required documents through your <a href="{{portal.checklist_url}}">checklist page</a> at your earliest convenience to avoid any delays in the review process.</p><p>If you have any questions, please reply to this message.</p><p>Thank you,<br/>Admissions Team<br/>{{school.name}}</p>',
    body_text: null,
    template_type: 'application_reminder',
    merge_tags: ['parent.first_name', 'student.full_name', 'checklist.next_item', 'portal.checklist_url', 'school.name'],
    is_active: true,
    created_at: '2026-01-12T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000904',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Recommendation Request',
    subject: 'Recommendation Request for {{student.full_name}} - {{school.name}}',
    body_html: '<p>Dear {{recommendation.recommender_name}},</p><p>{{parent.full_name}} has requested a recommendation for {{student.full_name}} as part of their application to {{school.name}}.</p><p>Please use the following link to submit your recommendation:</p><p><a href="{{recommendation.link}}">Submit Recommendation</a></p><p>This link will expire on {{checklist.due_date}}. If you have any questions, please contact our admissions office.</p><p>Thank you for your time,<br/>{{school.name}} Admissions</p>',
    body_text: null,
    template_type: 'recommendation_request',
    merge_tags: ['recommendation.recommender_name', 'parent.full_name', 'student.full_name', 'school.name', 'recommendation.link', 'checklist.due_date'],
    is_active: true,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000905',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Event Confirmation',
    subject: 'Confirmed: {{event.name}} on {{event.date}}',
    body_html: '<p>Dear {{parent.first_name}},</p><p>Your registration for the following event has been confirmed:</p><ul><li><strong>Event:</strong> {{event.name}}</li><li><strong>Date:</strong> {{event.date}}</li><li><strong>Time:</strong> {{event.time}}</li><li><strong>Location:</strong> {{event.location}}</li></ul><p>Please arrive 10 minutes early. If you need to cancel or reschedule, please do so through your <a href="{{portal.login_url}}">parent portal</a>.</p><p>We look forward to seeing you!</p><p>{{school.name}} Admissions</p>',
    body_text: null,
    template_type: 'event_confirmation',
    merge_tags: ['parent.first_name', 'event.name', 'event.date', 'event.time', 'event.location', 'portal.login_url', 'school.name'],
    is_active: true,
    created_at: '2026-01-18T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000906',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Payment Reminder',
    subject: 'Payment Reminder: {{contract.status}} for {{student.first_name}}',
    body_html: '<p>Dear {{parent.first_name}},</p><p>This is a friendly reminder regarding a pending payment for {{student.first_name}}.</p><p><strong>Amount Due:</strong> {{contract.net_amount}}<br/><strong>Status:</strong> {{contract.status}}</p><p>Please submit your payment through the <a href="{{portal.login_url}}">parent portal</a> at your earliest convenience.</p><p>If you have already made this payment, please disregard this message.</p><p>Thank you,<br/>{{school.name}} Business Office</p>',
    body_text: null,
    template_type: 'payment_reminder',
    merge_tags: ['parent.first_name', 'student.first_name', 'contract.net_amount', 'contract.status', 'portal.login_url', 'school.name'],
    is_active: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000907',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Decision Notification - Accepted',
    subject: 'Admissions Decision for {{student.full_name}}',
    body_html: '<p>Dear {{parent.first_name}},</p><p>We are delighted to inform you that {{student.first_name}} has been accepted to {{school.name}} for the {{season.name}} school year in Grade {{application.applying_for_grade}}!</p><p>An enrollment contract will be sent to you shortly. Please review and sign the contract through your <a href="{{portal.login_url}}">parent portal</a>.</p><p>We are excited to welcome {{student.first_name}} to our school community!</p><p>Congratulations,<br/>{{school.name}} Admissions</p>',
    body_text: null,
    template_type: 'decision',
    merge_tags: ['parent.first_name', 'student.first_name', 'student.full_name', 'school.name', 'season.name', 'application.applying_for_grade', 'portal.login_url'],
    is_active: true,
    created_at: '2026-01-25T00:00:00Z',
    updated_at: '2026-02-05T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000908',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Contract Sent',
    subject: 'Enrollment Contract Ready - {{student.full_name}}',
    body_html: '<p>Dear {{parent.first_name}},</p><p>The enrollment contract for {{student.full_name}} is now available for review.</p><p><strong>Tuition:</strong> {{contract.tuition_amount}}<br/><strong>Financial Aid:</strong> {{contract.financial_aid_amount}}<br/><strong>Net Amount:</strong> {{contract.net_amount}}</p><p>Please review and sign the contract through your <a href="{{portal.login_url}}">parent portal</a>.</p><p>Thank you,<br/>{{school.name}} Business Office</p>',
    body_text: null,
    template_type: 'contract',
    merge_tags: ['parent.first_name', 'student.full_name', 'contract.tuition_amount', 'contract.financial_aid_amount', 'contract.net_amount', 'portal.login_url', 'school.name'],
    is_active: true,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000909',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Spring Open House Invitation',
    subject: 'You\'re Invited: Spring Open House at {{school.name}}',
    body_html: '<p>Dear {{parent.first_name}},</p><p>We are excited to invite you and your family to our Spring Open House!</p><p><strong>Date:</strong> March 15, 2026<br/><strong>Time:</strong> 9:00 AM - 12:00 PM<br/><strong>Location:</strong> {{school.address}}</p><p>Come meet our faculty, tour the campus, and learn about our academic programs. Student activities and refreshments will be provided.</p><p>RSVP through your <a href="{{portal.login_url}}">parent portal</a>.</p><p>We look forward to seeing you!</p><p>{{school.name}} Admissions</p>',
    body_text: null,
    template_type: 'marketing',
    merge_tags: ['parent.first_name', 'school.name', 'school.address', 'portal.login_url'],
    is_active: true,
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-02-10T00:00:00Z',
  },
];

let templates = [...mockTemplates];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let filtered = [...templates];

  if (category && category !== 'all') {
    filtered = filtered.filter((t) => t.template_type === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return NextResponse.json({
    data: filtered,
    meta: { total: filtered.length },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newTemplate: EmailTemplate = {
      id: crypto.randomUUID(),
      school_id: '00000000-0000-0000-0000-000000000001',
      name: body.name,
      subject: body.subject || '',
      body_html: body.body_html || '',
      body_text: body.body_text || null,
      template_type: body.template_type || 'general',
      merge_tags: body.merge_tags || [],
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    templates.push(newTemplate);

    return NextResponse.json({ data: newTemplate }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
