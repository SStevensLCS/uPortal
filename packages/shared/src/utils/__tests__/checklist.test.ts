import { describe, it, expect } from 'vitest';
import {
  isChecklistComplete,
  getNextActionItem,
  calculateProgress,
} from '../checklist';
import type { ChecklistItem, ChecklistItemStatus } from '../../types/database';

function makeItem(overrides: Partial<ChecklistItem> = {}): ChecklistItem {
  return {
    id: 'item-1',
    application_id: 'app-1',
    template_item_id: 'tmpl-1',
    title: 'Test Item',
    description: null,
    item_type: 'manual',
    is_required: true,
    status: 'not_started' as ChecklistItemStatus,
    completed_at: null,
    completed_by: null,
    due_date: null,
    parent_visible: true,
    config: {},
    sort_order: 0,
    metadata: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  } as ChecklistItem;
}

describe('isChecklistComplete', () => {
  it('returns true when all required items are completed', () => {
    const items = [
      makeItem({ id: '1', status: 'completed', is_required: true }),
      makeItem({ id: '2', status: 'completed', is_required: true }),
    ];
    expect(isChecklistComplete(items)).toBe(true);
  });

  it('returns true when required items are completed or waived', () => {
    const items = [
      makeItem({ id: '1', status: 'completed', is_required: true }),
      makeItem({ id: '2', status: 'waived', is_required: true }),
    ];
    expect(isChecklistComplete(items)).toBe(true);
  });

  it('returns false when a required item is not completed', () => {
    const items = [
      makeItem({ id: '1', status: 'completed', is_required: true }),
      makeItem({ id: '2', status: 'not_started', is_required: true }),
    ];
    expect(isChecklistComplete(items)).toBe(false);
  });

  it('ignores non-required items', () => {
    const items = [
      makeItem({ id: '1', status: 'completed', is_required: true }),
      makeItem({ id: '2', status: 'not_started', is_required: false }),
    ];
    expect(isChecklistComplete(items)).toBe(true);
  });

  it('returns true for empty list', () => {
    expect(isChecklistComplete([])).toBe(true);
  });
});

describe('calculateProgress', () => {
  it('calculates correct percentage', () => {
    const items = [
      makeItem({ id: '1', status: 'completed', is_required: true }),
      makeItem({ id: '2', status: 'not_started', is_required: true }),
      makeItem({ id: '3', status: 'completed', is_required: true }),
    ];
    const result = calculateProgress(items);
    expect(result.completed).toBe(2);
    expect(result.total).toBe(3);
    expect(result.percentage).toBe(67);
  });

  it('returns 100% for empty checklist', () => {
    const result = calculateProgress([]);
    expect(result.percentage).toBe(100);
  });

  it('counts waived items as completed', () => {
    const items = [
      makeItem({ id: '1', status: 'waived', is_required: true }),
      makeItem({ id: '2', status: 'completed', is_required: true }),
    ];
    const result = calculateProgress(items);
    expect(result.percentage).toBe(100);
  });

  it('excludes non-required items from calculation', () => {
    const items = [
      makeItem({ id: '1', status: 'completed', is_required: true }),
      makeItem({ id: '2', status: 'not_started', is_required: false }),
    ];
    const result = calculateProgress(items);
    expect(result.completed).toBe(1);
    expect(result.total).toBe(1);
    expect(result.percentage).toBe(100);
  });
});

describe('getNextActionItem', () => {
  it('returns null when all items are complete', () => {
    const items = [
      makeItem({ id: '1', status: 'completed' }),
      makeItem({ id: '2', status: 'waived' }),
    ];
    expect(getNextActionItem(items)).toBeNull();
  });

  it('returns overdue item first', () => {
    const items = [
      makeItem({ id: '1', status: 'not_started', sort_order: 0 }),
      makeItem({ id: '2', status: 'overdue', sort_order: 1 }),
    ];
    const result = getNextActionItem(items);
    expect(result?.id).toBe('2');
  });

  it('returns item with earliest due date', () => {
    const items = [
      makeItem({ id: '1', status: 'not_started', due_date: '2024-03-15' }),
      makeItem({ id: '2', status: 'not_started', due_date: '2024-02-15' }),
    ];
    const result = getNextActionItem(items);
    expect(result?.id).toBe('2');
  });

  it('returns item with due date over item without', () => {
    const items = [
      makeItem({ id: '1', status: 'not_started', due_date: null, sort_order: 0 }),
      makeItem({ id: '2', status: 'not_started', due_date: '2024-03-15', sort_order: 1 }),
    ];
    const result = getNextActionItem(items);
    expect(result?.id).toBe('2');
  });

  it('falls back to sort order', () => {
    const items = [
      makeItem({ id: '1', status: 'not_started', sort_order: 2 }),
      makeItem({ id: '2', status: 'not_started', sort_order: 1 }),
    ];
    const result = getNextActionItem(items);
    expect(result?.id).toBe('2');
  });
});
