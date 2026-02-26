// @admissions-compass/shared - Checklist Utilities
// Functions for creating, evaluating, and managing checklists

import type {
  ChecklistTemplate,
  ChecklistTemplateItem,
  ChecklistItem,
  ChecklistItemStatus,
  Application,
  DueDateRule,
} from '../types/database';

// ─── Progress Tracking ───────────────────────────────────────────────────────

export interface ChecklistProgress {
  completed: number;
  total: number;
  percentage: number;
}

// ─── Checklist Instantiation ─────────────────────────────────────────────────

/**
 * Creates checklist items from a template and its items for a specific application.
 * This is used when an application enters a new stage that triggers a checklist.
 *
 * @param template - The checklist template
 * @param templateItems - The template's items (ordered by sort_order)
 * @param application - The application to create checklist items for
 * @returns An array of new checklist items (without id, created_at, updated_at -- those are set by the DB)
 *
 * @example
 * ```ts
 * const items = instantiateChecklist(template, templateItems, application);
 * // Insert items into the database
 * ```
 */
export function instantiateChecklist(
  _template: ChecklistTemplate,
  templateItems: ChecklistTemplateItem[],
  application: Application
): Omit<ChecklistItem, 'id' | 'created_at' | 'updated_at'>[] {
  return templateItems.map((templateItem) => ({
    application_id: application.id,
    template_item_id: templateItem.id,
    title: templateItem.title,
    description: templateItem.description,
    item_type: templateItem.item_type,
    is_required: templateItem.is_required,
    sort_order: templateItem.sort_order,
    status: 'not_started' as ChecklistItemStatus,
    due_date: templateItem.due_date_rule
      ? calculateDueDate(templateItem.due_date_rule, application)
      : null,
    completed_at: null,
    completed_by: null,
    config: { ...templateItem.config },
    data: {},
  }));
}

// ─── Due Date Calculation ────────────────────────────────────────────────────

/**
 * Calculates a due date based on a rule and application context.
 *
 * @param rule - The due date rule defining how to calculate the date
 * @param application - The application providing context dates
 * @returns An ISO 8601 date string, or null if the date cannot be determined
 *
 * @example
 * ```ts
 * // Fixed date
 * calculateDueDate({ type: 'fixed', fixed_date: '2024-03-01' }, app);
 * // "2024-03-01"
 *
 * // 14 days after submission
 * calculateDueDate({ type: 'relative_to_submission', days_offset: 14 }, app);
 * // "2024-02-14" (if submitted on Jan 31)
 * ```
 */
export function calculateDueDate(
  rule: DueDateRule,
  application: Application
): string | null {
  switch (rule.type) {
    case 'fixed': {
      return rule.fixed_date ?? null;
    }

    case 'relative_to_submission': {
      const baseDate = application.submitted_at;
      if (!baseDate || !rule.days_offset) {
        return null;
      }
      return addDays(baseDate, rule.days_offset);
    }

    case 'relative_to_start': {
      const startDate = application.created_at;
      if (!startDate || !rule.days_offset) {
        return null;
      }
      return addDays(startDate, rule.days_offset);
    }

    default:
      return null;
  }
}

/**
 * Adds a number of days to a date string and returns the result as an ISO date string.
 */
function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// ─── Checklist Evaluation ────────────────────────────────────────────────────

/**
 * Checks whether all required checklist items are complete.
 * Items that are waived are considered complete.
 *
 * @param items - The checklist items to evaluate
 * @returns True if every required item has a status of 'completed' or 'waived'
 *
 * @example
 * ```ts
 * isChecklistComplete(items); // true if all required items are done
 * ```
 */
export function isChecklistComplete(items: ChecklistItem[]): boolean {
  const completedStatuses: ChecklistItemStatus[] = ['completed', 'waived'];

  return items
    .filter((item) => item.is_required)
    .every((item) => completedStatuses.includes(item.status));
}

/**
 * Gets the most important next action item from a checklist.
 * Priority: overdue items first, then by earliest due date, then by sort order.
 *
 * @param items - The checklist items to evaluate
 * @returns The highest priority incomplete item, or null if all are complete
 */
export function getNextActionItem(items: ChecklistItem[]): ChecklistItem | null {
  const incompleteItems = items.filter(
    (item) =>
      item.status !== 'completed' &&
      item.status !== 'waived'
  );

  if (incompleteItems.length === 0) {
    return null;
  }

  // Sort: overdue first, then by due date (earliest first), then by sort_order
  const sorted = [...incompleteItems].sort((a, b) => {
    // Overdue items take highest priority
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;

    // Then by due date (items with due dates before items without)
    if (a.due_date && b.due_date) {
      const dateCompare =
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (dateCompare !== 0) return dateCompare;
    }
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;

    // Finally by sort order
    return a.sort_order - b.sort_order;
  });

  return sorted[0];
}

/**
 * Calculates the completion progress of a checklist.
 * Only counts required items in the progress calculation.
 *
 * @param items - The checklist items to evaluate
 * @returns An object with completed count, total required count, and percentage
 *
 * @example
 * ```ts
 * const progress = calculateProgress(items);
 * // { completed: 3, total: 5, percentage: 60 }
 * ```
 */
export function calculateProgress(items: ChecklistItem[]): ChecklistProgress {
  const completedStatuses: ChecklistItemStatus[] = ['completed', 'waived'];
  const requiredItems = items.filter((item) => item.is_required);
  const completedItems = requiredItems.filter((item) =>
    completedStatuses.includes(item.status)
  );

  const total = requiredItems.length;
  const completed = completedItems.length;
  const percentage = total === 0 ? 100 : Math.round((completed / total) * 100);

  return { completed, total, percentage };
}
