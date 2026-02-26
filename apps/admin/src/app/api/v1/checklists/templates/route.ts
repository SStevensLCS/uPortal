import { NextRequest, NextResponse } from 'next/server';
import type {
  ChecklistTemplate,
  ChecklistTemplateItem,
  ApplicationStatus,
  ApplicationType,
  ChecklistItemType,
} from '@admissions-compass/shared';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockTemplateItems: Record<string, ChecklistTemplateItem[]> = {
  'tmpl-001': [
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
  'tmpl-002': [
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
  'tmpl-003': [
    {
      id: 'ti-009',
      template_id: 'tmpl-003',
      title: 'Upload Academic Transcript',
      description: 'Official transcript from the current school.',
      item_type: 'document_upload',
      is_required: true,
      sort_order: 0,
      config: { accepted_types: ['pdf'], max_size_mb: 10 },
      due_date_rule: null,
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-01T00:00:00Z',
    },
    {
      id: 'ti-010',
      template_id: 'tmpl-003',
      title: 'Schedule Interview',
      description: 'Book a family interview with the admissions committee.',
      item_type: 'interview',
      is_required: true,
      sort_order: 1,
      config: { event_calendar_id: 'cal-003' },
      due_date_rule: { type: 'relative_to_submission', days_offset: 14 },
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-01T00:00:00Z',
    },
  ],
  'tmpl-004': [
    {
      id: 'ti-011',
      template_id: 'tmpl-004',
      title: 'Sign Enrollment Contract',
      description: 'Review and sign the enrollment contract.',
      item_type: 'custom',
      is_required: true,
      sort_order: 0,
      config: { action_type: 'contract' },
      due_date_rule: { type: 'relative_to_start', days_offset: 14 },
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-01T00:00:00Z',
    },
    {
      id: 'ti-012',
      template_id: 'tmpl-004',
      title: 'Submit Tuition Deposit',
      description: 'Pay the enrollment deposit to secure your spot.',
      item_type: 'payment',
      is_required: true,
      sort_order: 1,
      config: { payment_amount: 200000, currency: 'usd', description: 'Tuition Deposit' },
      due_date_rule: { type: 'relative_to_start', days_offset: 14 },
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-01T00:00:00Z',
    },
    {
      id: 'ti-013',
      template_id: 'tmpl-004',
      title: 'Upload Medical Forms',
      description: 'Complete and upload all required medical forms.',
      item_type: 'document_upload',
      is_required: true,
      sort_order: 2,
      config: { accepted_types: ['pdf'], max_size_mb: 10 },
      due_date_rule: { type: 'fixed', fixed_date: '2026-06-01' },
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-01T00:00:00Z',
    },
    {
      id: 'ti-014',
      template_id: 'tmpl-004',
      title: 'Attend Orientation',
      description: 'Attend the new family orientation session.',
      item_type: 'event_attendance',
      is_required: false,
      sort_order: 3,
      config: { event_calendar_id: 'cal-004' },
      due_date_rule: { type: 'fixed', fixed_date: '2026-08-15' },
      created_at: '2024-09-01T00:00:00Z',
      updated_at: '2024-09-01T00:00:00Z',
    },
  ],
};

const mockTemplates: (ChecklistTemplate & { items: ChecklistTemplateItem[] })[] = [
  {
    id: 'tmpl-001',
    school_id: '00000000-0000-0000-0000-000000000001',
    season_id: 'season-2026',
    name: 'Inquiry Checklist',
    stage: 'inquiry' as ApplicationStatus,
    grade_levels: ['PK4', 'K', '1', '2', '3', '4', '5', '6', '7', '8'],
    application_types: ['standard', 'rolling'] as ApplicationType[],
    is_active: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
    items: mockTemplateItems['tmpl-001'],
  },
  {
    id: 'tmpl-002',
    school_id: '00000000-0000-0000-0000-000000000001',
    season_id: 'season-2026',
    name: 'Application Checklist - K-5',
    stage: 'started' as ApplicationStatus,
    grade_levels: ['K', '1', '2', '3', '4', '5'],
    application_types: ['standard', 'early_decision', 'early_action'] as ApplicationType[],
    is_active: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z',
    items: mockTemplateItems['tmpl-002'],
  },
  {
    id: 'tmpl-003',
    school_id: '00000000-0000-0000-0000-000000000001',
    season_id: 'season-2026',
    name: 'Application Checklist - Middle School',
    stage: 'started' as ApplicationStatus,
    grade_levels: ['6', '7', '8'],
    application_types: ['standard', 'transfer'] as ApplicationType[],
    is_active: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
    items: mockTemplateItems['tmpl-003'],
  },
  {
    id: 'tmpl-004',
    school_id: '00000000-0000-0000-0000-000000000001',
    season_id: 'season-2026',
    name: 'Enrollment Checklist',
    stage: 'enrolled' as ApplicationStatus,
    grade_levels: ['PK4', 'K', '1', '2', '3', '4', '5', '6', '7', '8'],
    application_types: ['standard', 'early_decision', 'early_action', 'rolling', 'transfer'] as ApplicationType[],
    is_active: true,
    created_at: '2024-09-01T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z',
    items: mockTemplateItems['tmpl-004'],
  },
  {
    id: 'tmpl-005',
    school_id: '00000000-0000-0000-0000-000000000001',
    season_id: 'season-2025',
    name: 'Inquiry Checklist (2025)',
    stage: 'inquiry' as ApplicationStatus,
    grade_levels: ['K', '1', '2', '3', '4', '5'],
    application_types: ['standard'] as ApplicationType[],
    is_active: false,
    created_at: '2023-09-01T00:00:00Z',
    updated_at: '2024-08-01T00:00:00Z',
    items: [],
  },
];

let templates = [...mockTemplates];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stage = searchParams.get('stage');
  const active = searchParams.get('active');

  let filtered = [...templates];

  if (stage) {
    filtered = filtered.filter((t) => t.stage === stage);
  }
  if (active !== null) {
    filtered = filtered.filter((t) => t.is_active === (active === 'true'));
  }

  // Return templates with item counts
  const result = filtered.map(({ items, ...template }) => ({
    ...template,
    item_count: items.length,
  }));

  return NextResponse.json({
    data: result,
    meta: {
      total: result.length,
      page: 1,
      per_page: 50,
      total_pages: 1,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newTemplate: ChecklistTemplate & { items: ChecklistTemplateItem[] } = {
      id: `tmpl-${Date.now()}`,
      school_id: '00000000-0000-0000-0000-000000000001',
      season_id: body.season_id || 'season-2026',
      name: body.name,
      stage: body.stage,
      grade_levels: body.grade_levels || [],
      application_types: body.application_types || [],
      is_active: body.is_active ?? false,
      created_at: now,
      updated_at: now,
      items: [],
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
