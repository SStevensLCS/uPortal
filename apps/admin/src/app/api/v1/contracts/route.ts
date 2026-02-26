import { NextRequest, NextResponse } from 'next/server';

interface Contract {
  id: string;
  school_id: string;
  application_id: string;
  student_name: string;
  grade: string;
  parent_name: string;
  parent_email: string;
  tuition_amount: number;
  financial_aid_amount: number;
  net_tuition: number;
  deposit_amount: number;
  deposit_paid: boolean;
  template_id: string;
  payment_plan: string;
  status: string;
  primary_signer: { name: string; email: string; signed_at: string | null };
  secondary_signer: { name: string; email: string; signed_at: string | null } | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

const mockContracts: Contract[] = [
  {
    id: 'contract-001',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: 'app-001',
    student_name: 'Emma Chen',
    grade: 'K',
    parent_name: 'Lisa Chen',
    parent_email: 'lisa.chen@email.com',
    tuition_amount: 28500,
    financial_aid_amount: 5000,
    net_tuition: 23500,
    deposit_amount: 2500,
    deposit_paid: true,
    template_id: 'financial_aid',
    payment_plan: 'monthly_10',
    status: 'completed',
    primary_signer: { name: 'Lisa Chen', email: 'lisa.chen@email.com', signed_at: '2026-01-15T10:30:00Z' },
    secondary_signer: { name: 'Wei Chen', email: 'wei.chen@email.com', signed_at: '2026-01-15T14:22:00Z' },
    sent_at: '2026-01-10T09:05:00Z',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-01-15T14:22:00Z',
  },
  {
    id: 'contract-002',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: 'app-002',
    student_name: 'Marcus Williams',
    grade: '3',
    parent_name: 'David Williams',
    parent_email: 'd.williams@email.com',
    tuition_amount: 30000,
    financial_aid_amount: 0,
    net_tuition: 30000,
    deposit_amount: 2500,
    deposit_paid: false,
    template_id: 'standard',
    payment_plan: 'semi_annual',
    status: 'signed_primary',
    primary_signer: { name: 'David Williams', email: 'd.williams@email.com', signed_at: '2026-02-01T16:45:00Z' },
    secondary_signer: { name: 'Karen Williams', email: 'k.williams@email.com', signed_at: null },
    sent_at: '2026-01-28T11:10:00Z',
    created_at: '2026-01-28T11:00:00Z',
    updated_at: '2026-02-01T16:45:00Z',
  },
  {
    id: 'contract-003',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: 'app-003',
    student_name: 'Sofia Rodriguez',
    grade: '5',
    parent_name: 'Maria Rodriguez',
    parent_email: 'm.rodriguez@email.com',
    tuition_amount: 31500,
    financial_aid_amount: 12000,
    net_tuition: 19500,
    deposit_amount: 2500,
    deposit_paid: false,
    template_id: 'financial_aid',
    payment_plan: 'monthly_10',
    status: 'viewed',
    primary_signer: { name: 'Maria Rodriguez', email: 'm.rodriguez@email.com', signed_at: null },
    secondary_signer: null,
    sent_at: '2026-02-05T08:35:00Z',
    created_at: '2026-02-05T08:30:00Z',
    updated_at: '2026-02-06T09:00:00Z',
  },
  {
    id: 'contract-004',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: 'app-004',
    student_name: 'Aiden Patel',
    grade: '1',
    parent_name: 'Priya Patel',
    parent_email: 'priya.patel@email.com',
    tuition_amount: 28500,
    financial_aid_amount: 8000,
    net_tuition: 20500,
    deposit_amount: 2500,
    deposit_paid: false,
    template_id: 'financial_aid',
    payment_plan: 'quarterly',
    status: 'sent',
    primary_signer: { name: 'Priya Patel', email: 'priya.patel@email.com', signed_at: null },
    secondary_signer: { name: 'Raj Patel', email: 'raj.patel@email.com', signed_at: null },
    sent_at: '2026-02-10T14:05:00Z',
    created_at: '2026-02-10T14:00:00Z',
    updated_at: '2026-02-10T14:05:00Z',
  },
  {
    id: 'contract-005',
    school_id: '00000000-0000-0000-0000-000000000001',
    application_id: 'app-005',
    student_name: 'Olivia Thompson',
    grade: '7',
    parent_name: 'James Thompson',
    parent_email: 'j.thompson@email.com',
    tuition_amount: 33000,
    financial_aid_amount: 0,
    net_tuition: 33000,
    deposit_amount: 2500,
    deposit_paid: false,
    template_id: 'standard',
    payment_plan: 'annual',
    status: 'draft',
    primary_signer: { name: 'James Thompson', email: 'j.thompson@email.com', signed_at: null },
    secondary_signer: { name: 'Sarah Thompson', email: 's.thompson@email.com', signed_at: null },
    sent_at: null,
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-02-20T10:00:00Z',
  },
];

let contracts = [...mockContracts];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let filtered = contracts;

  if (status && status !== 'all') {
    filtered = filtered.filter((c) => c.status === status);
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

    const applicationIds: string[] = body.application_ids || [];
    const newContracts: Contract[] = [];

    for (const appId of applicationIds) {
      const newContract: Contract = {
        id: `contract-${crypto.randomUUID().slice(0, 8)}`,
        school_id: '00000000-0000-0000-0000-000000000001',
        application_id: appId,
        student_name: `Student for ${appId}`,
        grade: 'K',
        parent_name: 'Parent Name',
        parent_email: 'parent@email.com',
        tuition_amount: body.tuition_amount,
        financial_aid_amount: body.financial_aid_amount || 0,
        net_tuition: body.tuition_amount - (body.financial_aid_amount || 0),
        deposit_amount: body.deposit_amount,
        deposit_paid: false,
        template_id: body.template_id || 'standard',
        payment_plan: body.payment_plan || 'monthly_10',
        status: 'draft',
        primary_signer: { name: 'Parent Name', email: 'parent@email.com', signed_at: null },
        secondary_signer: null,
        sent_at: null,
        created_at: now,
        updated_at: now,
      };
      contracts.push(newContract);
      newContracts.push(newContract);
    }

    return NextResponse.json(
      { data: newContracts, meta: { count: newContracts.length } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
