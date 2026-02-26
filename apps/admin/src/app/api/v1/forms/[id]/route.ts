import { NextRequest, NextResponse } from 'next/server';

// In-memory mock data for development (mirrored from the list route)
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
];

let forms = [...mockForms];

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const form = forms.find((f) => f.id === params.id && f.deleted_at === null);

  if (!form) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Form not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: form });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const formIndex = forms.findIndex(
    (f) => f.id === params.id && f.deleted_at === null
  );

  if (formIndex === -1) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Form not found' } },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    forms[formIndex] = {
      ...forms[formIndex],
      ...body,
      version: forms[formIndex].version + 1,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ data: forms[formIndex] });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const formIndex = forms.findIndex(
    (f) => f.id === params.id && f.deleted_at === null
  );

  if (formIndex === -1) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Form not found' } },
      { status: 404 }
    );
  }

  forms[formIndex] = {
    ...forms[formIndex],
    deleted_at: new Date().toISOString(),
  };

  return NextResponse.json({ data: { success: true } });
}
