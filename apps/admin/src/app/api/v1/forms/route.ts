import { NextRequest, NextResponse } from 'next/server';

// In-memory mock data for development
const mockForms = [
  {
    id: '00000000-0000-0000-0000-000000000301',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Inquiry Form',
    description: 'Initial inquiry form for prospective families',
    form_type: 'inquiry' as const,
    schema: {
      fields: [
        {
          id: 'f1',
          type: 'text',
          label: 'Parent/Guardian Name',
          placeholder: 'Enter your full name',
          required: true,
          options: [],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'f2',
          type: 'email',
          label: 'Email Address',
          placeholder: 'you@example.com',
          required: true,
          options: [],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'f3',
          type: 'phone',
          label: 'Phone Number',
          placeholder: '(555) 123-4567',
          required: false,
          options: [],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'f4',
          type: 'select',
          label: 'Grade Applying For',
          placeholder: 'Select a grade',
          required: true,
          options: ['PK4', 'K', '1', '2', '3', '4', '5', '6', '7', '8'],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'f5',
          type: 'long_text',
          label: 'How did you hear about us?',
          placeholder: 'Tell us how you learned about our school',
          required: false,
          options: [],
          validation: {},
          conditional_logic: null,
        },
      ],
    },
    ui_schema: {},
    settings: {},
    version: 2,
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-05-15T00:00:00Z',
    deleted_at: null,
  },
  {
    id: '00000000-0000-0000-0000-000000000302',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Application Form',
    description: 'Full application form for K-8 admissions',
    form_type: 'application' as const,
    schema: {
      fields: [
        {
          id: 'a1',
          type: 'section_break',
          label: 'Student Information',
          placeholder: '',
          required: false,
          options: [],
          validation: {},
          conditional_logic: null,
          description: 'Please provide the following details about your child.',
        },
        {
          id: 'a2',
          type: 'text',
          label: 'Student First Name',
          placeholder: '',
          required: true,
          options: [],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'a3',
          type: 'text',
          label: 'Student Last Name',
          placeholder: '',
          required: true,
          options: [],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'a4',
          type: 'date_of_birth',
          label: 'Date of Birth',
          placeholder: '',
          required: true,
          options: [],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'a5',
          type: 'radio',
          label: 'Gender',
          placeholder: '',
          required: true,
          options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'a6',
          type: 'address',
          label: 'Home Address',
          placeholder: '',
          required: true,
          options: [],
          validation: {},
          conditional_logic: null,
        },
      ],
    },
    ui_schema: {},
    settings: {},
    version: 3,
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: '00000000-0000-0000-0000-000000000303',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Teacher Recommendation',
    description: 'Recommendation form for current teachers',
    form_type: 'recommendation' as const,
    schema: {
      fields: [
        {
          id: 'r1',
          type: 'text',
          label: 'Recommender Name',
          placeholder: '',
          required: true,
          options: [],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'r2',
          type: 'likert_scale',
          label: 'Academic Performance',
          placeholder: '',
          required: true,
          options: ['Poor', 'Below Average', 'Average', 'Above Average', 'Excellent'],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'r3',
          type: 'long_text',
          label: 'Additional Comments',
          placeholder: 'Please share any additional thoughts...',
          required: false,
          options: [],
          validation: {},
          conditional_logic: null,
        },
      ],
    },
    ui_schema: {},
    settings: {},
    version: 1,
    is_active: true,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: '00000000-0000-0000-0000-000000000304',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: 'Financial Aid Application',
    description: 'Financial aid request form',
    form_type: 'financial_aid' as const,
    schema: {
      fields: [
        {
          id: 'fa1',
          type: 'currency',
          label: 'Annual Household Income',
          placeholder: '',
          required: true,
          options: [],
          validation: {},
          conditional_logic: null,
        },
        {
          id: 'fa2',
          type: 'file_upload',
          label: 'Tax Return (most recent)',
          placeholder: '',
          required: true,
          options: [],
          validation: { allowed_types: ['pdf'], max_size_mb: 10 },
          conditional_logic: null,
        },
      ],
    },
    ui_schema: {},
    settings: {},
    version: 1,
    is_active: false,
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
    deleted_at: null,
  },
];

let forms = [...mockForms];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const formType = searchParams.get('form_type');

  let filtered = forms.filter((f) => f.deleted_at === null);

  if (formType && formType !== 'all') {
    filtered = filtered.filter((f) => f.form_type === formType);
  }

  return NextResponse.json({
    data: filtered,
    meta: {
      total: filtered.length,
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

    const newForm = {
      id: crypto.randomUUID(),
      school_id: '00000000-0000-0000-0000-000000000001',
      name: body.name,
      description: body.description || null,
      form_type: body.form_type,
      schema: body.schema || { fields: [] },
      ui_schema: body.ui_schema || {},
      settings: body.settings || {},
      version: 1,
      is_active: false,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };

    forms.push(newForm);

    return NextResponse.json({ data: newForm }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
