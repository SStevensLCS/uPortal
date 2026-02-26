import { NextRequest, NextResponse } from 'next/server';

// Re-use the same mock data store (in real app this would be a database)
// For the mock, we inline some data here

const mockTemplates = [
  {
    id: 'tmpl-001',
    school_id: '00000000-0000-0000-0000-000000000001',
    season_id: 'season-2026',
    name: 'Inquiry Checklist',
    stage: 'inquiry',
    grade_levels: ['PK4', 'K', '1', '2', '3', '4', '5', '6', '7', '8'],
    application_types: ['standard', 'rolling'],
    is_active: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
    items: [
      {
        id: 'ti-001',
        template_id: 'tmpl-001',
        title: 'Complete Inquiry Form',
        description: 'Fill out the initial inquiry form with family and student details.',
        item_type: 'form_submission',
        is_required: true,
        sort_order: 0,
        config: { form_id: '00000000-0000-0000-0000-000000000301' },
        due_date_rule: { type: 'relative_to_start', days_offset: 7 },
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2024-09-01T00:00:00Z',
      },
      {
        id: 'ti-002',
        template_id: 'tmpl-001',
        title: 'Schedule Campus Tour',
        description: 'Book a campus visit to learn more about the school.',
        item_type: 'event_attendance',
        is_required: false,
        sort_order: 1,
        config: { event_calendar_id: 'cal-001' },
        due_date_rule: { type: 'relative_to_start', days_offset: 14 },
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2024-09-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'tmpl-002',
    school_id: '00000000-0000-0000-0000-000000000001',
    season_id: 'season-2026',
    name: 'Application Checklist - K-5',
    stage: 'started',
    grade_levels: ['K', '1', '2', '3', '4', '5'],
    application_types: ['standard', 'early_decision', 'early_action'],
    is_active: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z',
    items: [
      {
        id: 'ti-003',
        template_id: 'tmpl-002',
        title: 'Submit Application Form',
        description: 'Complete and submit the full application form.',
        item_type: 'form_submission',
        is_required: true,
        sort_order: 0,
        config: { form_id: '00000000-0000-0000-0000-000000000302' },
        due_date_rule: null,
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2024-09-01T00:00:00Z',
      },
      {
        id: 'ti-004',
        template_id: 'tmpl-002',
        title: 'Upload Birth Certificate',
        description: 'Upload a certified copy of the student birth certificate.',
        item_type: 'document_upload',
        is_required: true,
        sort_order: 1,
        config: { accepted_types: ['pdf', 'jpg', 'png'], max_size_mb: 10 },
        due_date_rule: null,
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2024-09-01T00:00:00Z',
      },
      {
        id: 'ti-005',
        template_id: 'tmpl-002',
        title: 'Upload Immunization Records',
        description: 'Provide current immunization records from your pediatrician.',
        item_type: 'document_upload',
        is_required: true,
        sort_order: 2,
        config: { accepted_types: ['pdf', 'jpg', 'png'], max_size_mb: 10 },
        due_date_rule: { type: 'relative_to_submission', days_offset: 30 },
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2024-09-01T00:00:00Z',
      },
      {
        id: 'ti-006',
        template_id: 'tmpl-002',
        title: 'Request Teacher Recommendation',
        description: 'Request a recommendation letter from a current teacher.',
        item_type: 'recommendation',
        is_required: true,
        sort_order: 3,
        config: { form_id: '00000000-0000-0000-0000-000000000303' },
        due_date_rule: { type: 'relative_to_start', days_offset: 21 },
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2024-09-01T00:00:00Z',
      },
      {
        id: 'ti-007',
        template_id: 'tmpl-002',
        title: 'Pay Application Fee',
        description: 'Submit the non-refundable application fee of $75.',
        item_type: 'payment',
        is_required: true,
        sort_order: 4,
        config: { payment_amount: 7500, currency: 'usd', description: 'Application Fee' },
        due_date_rule: null,
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2024-09-01T00:00:00Z',
      },
      {
        id: 'ti-008',
        template_id: 'tmpl-002',
        title: 'Schedule Student Assessment',
        description: 'Book a time slot for the student readiness assessment.',
        item_type: 'assessment',
        is_required: true,
        sort_order: 5,
        config: { event_calendar_id: 'cal-002' },
        due_date_rule: { type: 'relative_to_start', days_offset: 28 },
        created_at: '2024-09-01T00:00:00Z',
        updated_at: '2024-09-01T00:00:00Z',
      },
    ],
  },
];

let templates = [...mockTemplates];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const template = templates.find((t) => t.id === id);

  if (!template) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Template not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: template });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const templateIndex = templates.findIndex((t) => t.id === id);

  if (templateIndex === -1) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Template not found' } },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    templates[templateIndex] = {
      ...templates[templateIndex],
      ...body,
      updated_at: now,
    };

    return NextResponse.json({ data: templates[templateIndex] });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const templateIndex = templates.findIndex((t) => t.id === id);

  if (templateIndex === -1) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Template not found' } },
      { status: 404 }
    );
  }

  templates = templates.filter((t) => t.id !== id);

  return NextResponse.json({ data: { success: true } });
}
