import { NextRequest, NextResponse } from 'next/server';

// Shared mock seasons data (in a real app this would be a database)
const mockSeasons = [
  {
    id: '00000000-0000-0000-0000-000000000010',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: '2025-2026 Enrollment',
    start_date: '2025-09-01',
    end_date: '2026-06-30',
    is_active: true,
    settings: {
      capacity: {
        PK4: 20,
        K: 44,
        '1': 44,
        '2': 44,
        '3': 44,
        '4': 44,
        '5': 44,
        '6': 60,
        '7': 60,
        '8': 60,
      },
    },
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000011',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: '2024-2025 Enrollment',
    start_date: '2024-09-01',
    end_date: '2025-06-30',
    is_active: false,
    settings: {
      capacity: {
        PK4: 20,
        K: 40,
        '1': 40,
        '2': 40,
        '3': 40,
        '4': 40,
        '5': 40,
        '6': 55,
        '7': 55,
        '8': 55,
      },
    },
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-08-15T00:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000012',
    school_id: '00000000-0000-0000-0000-000000000001',
    name: '2026-2027 Enrollment',
    start_date: '2026-09-01',
    end_date: '2027-06-30',
    is_active: false,
    settings: { capacity: {} },
    created_at: '2025-12-01T00:00:00Z',
    updated_at: '2025-12-01T00:00:00Z',
  },
];

let seasons = [...mockSeasons];

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string; seasonId: string } }
) {
  const season = seasons.find(
    (s) => s.school_id === params.id && s.id === params.seasonId
  );

  if (!season) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Season not found' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: season });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; seasonId: string } }
) {
  const seasonIndex = seasons.findIndex(
    (s) => s.school_id === params.id && s.id === params.seasonId
  );

  if (seasonIndex === -1) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Season not found' } },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    seasons[seasonIndex] = {
      ...seasons[seasonIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ data: seasons[seasonIndex] });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
