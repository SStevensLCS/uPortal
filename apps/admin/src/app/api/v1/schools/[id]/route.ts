import { NextRequest, NextResponse } from 'next/server';

// In-memory mock data for development
const mockSchool = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Oakridge Academy',
  slug: 'oakridge-academy',
  logo_url: null,
  website_url: 'https://oakridgeacademy.edu',
  address: {
    street: '123 Oakridge Lane',
    street2: null,
    city: 'Springfield',
    state: 'IL',
    postal_code: '62701',
    country: 'US',
  },
  phone: '(217) 555-0100',
  timezone: 'America/Chicago',
  currency: 'USD',
  school_type: 'independent' as const,
  grade_levels: ['PK4', 'K', '1', '2', '3', '4', '5', '6', '7', '8'],
  divisions: [
    { name: 'Early Childhood', grade_levels: ['PK4', 'K'] },
    { name: 'Lower School', grade_levels: ['1', '2', '3', '4', '5'] },
    { name: 'Middle School', grade_levels: ['6', '7', '8'] },
  ],
  settings: {
    primary_color: '#1e40af',
    secondary_color: '#f59e0b',
    portal_welcome_message:
      'Welcome to Oakridge Academy! We are thrilled you are considering our school for your child.',
  },
  subscription_tier: 'professional',
  stripe_account_id: null,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  deleted_at: null,
};

let schoolData = { ...mockSchool };

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (params.id !== schoolData.id) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'School not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: schoolData });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (params.id !== schoolData.id) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'School not found' } },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    schoolData = {
      ...schoolData,
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ data: schoolData });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
