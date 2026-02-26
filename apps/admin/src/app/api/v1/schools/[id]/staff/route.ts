import { NextRequest, NextResponse } from 'next/server';

// In-memory mock data for development
const mockStaff = [
  {
    id: '00000000-0000-0000-0000-000000000101',
    school_id: '00000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000201',
    role: 'admin' as const,
    title: 'Director of Admissions',
    department: 'Admissions',
    permissions: {
      configure_school_settings: true,
      manage_staff: true,
      create_edit_forms: true,
      create_edit_checklists: true,
      view_all_applications: true,
      edit_application_data: true,
      send_communications: true,
      make_decisions: true,
      release_decisions: true,
      view_financial_aid: true,
      generate_contracts: true,
      review_score_applicants: true,
      export_data: true,
      view_reports: true,
      impersonate_parent: true,
    },
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    user: {
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@oakridgeacademy.edu',
      avatar_url: null,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    school_id: '00000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000202',
    role: 'user' as const,
    title: 'Admissions Coordinator',
    department: 'Admissions',
    permissions: {
      create_edit_forms: true,
      create_edit_checklists: true,
      view_all_applications: true,
      edit_application_data: true,
      send_communications: true,
      make_decisions: true,
      view_financial_aid: true,
      review_score_applicants: true,
      export_data: true,
      view_reports: true,
    },
    is_active: true,
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
    user: {
      first_name: 'Michael',
      last_name: 'Chen',
      email: 'michael.chen@oakridgeacademy.edu',
      avatar_url: null,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    school_id: '00000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000203',
    role: 'reviewer' as const,
    title: 'Math Department Head',
    department: 'Academics',
    permissions: {
      view_all_applications: true,
      review_score_applicants: true,
    },
    is_active: true,
    created_at: '2024-03-05T00:00:00Z',
    updated_at: '2024-03-05T00:00:00Z',
    user: {
      first_name: 'Emily',
      last_name: 'Rodriguez',
      email: 'emily.rodriguez@oakridgeacademy.edu',
      avatar_url: null,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000104',
    school_id: '00000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000204',
    role: 'limited_user' as const,
    title: 'Administrative Assistant',
    department: 'Administration',
    permissions: {
      view_all_applications: true,
      send_communications: true,
      view_reports: true,
    },
    is_active: false,
    created_at: '2024-04-20T00:00:00Z',
    updated_at: '2024-09-01T00:00:00Z',
    user: {
      first_name: 'David',
      last_name: 'Park',
      email: 'david.park@oakridgeacademy.edu',
      avatar_url: null,
    },
  },
];

let staffMembers = [...mockStaff];

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const schoolStaff = staffMembers.filter((s) => s.school_id === params.id);

  return NextResponse.json({
    data: schoolStaff,
    meta: {
      total: schoolStaff.length,
      page: 1,
      per_page: 50,
      total_pages: 1,
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newStaff = {
      id: crypto.randomUUID(),
      school_id: params.id,
      user_id: crypto.randomUUID(),
      role: body.role || 'limited_user',
      title: body.title || null,
      department: body.department || null,
      permissions: body.permissions || {},
      is_active: true,
      created_at: now,
      updated_at: now,
      user: {
        first_name: body.first_name || 'Invited',
        last_name: body.last_name || 'User',
        email: body.email,
        avatar_url: null,
      },
    };

    staffMembers.push(newStaff);

    return NextResponse.json({ data: newStaff }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
