import { NextRequest, NextResponse } from 'next/server';
import type { ChecklistItemStatus } from '@admissions-compass/shared';

// In a real app, this would query the database.
// For the mock, we maintain state here.
const mockChecklistItems: Record<string, Record<string, { status: ChecklistItemStatus; completed_at: string | null; completed_by: string | null }>> = {};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newStatus = body.status as ChecklistItemStatus;
    const validStatuses: ChecklistItemStatus[] = [
      'not_started',
      'in_progress',
      'submitted',
      'completed',
      'waived',
      'overdue',
    ];

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: { code: 'INVALID_STATUS', message: `Invalid status: ${newStatus}` } },
        { status: 400 }
      );
    }

    const isCompleted = newStatus === 'completed' || newStatus === 'waived';

    // Store the update
    if (!mockChecklistItems[id]) {
      mockChecklistItems[id] = {};
    }
    mockChecklistItems[id][itemId] = {
      status: newStatus,
      completed_at: isCompleted ? now : null,
      completed_by: isCompleted ? 'admin-user-001' : null,
    };

    return NextResponse.json({
      data: {
        id: itemId,
        application_id: id,
        status: newStatus,
        completed_at: isCompleted ? now : null,
        completed_by: isCompleted ? 'admin-user-001' : null,
        updated_at: now,
      },
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}
