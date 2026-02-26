'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Plus,
  Trash2,
  FileText,
  Upload,
  UserCheck,
  Calendar,
  DollarSign,
  ClipboardCheck,
  Star,
  Info,
  Pencil,
  Settings,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Separator,
} from '@admissions-compass/ui';
import type { ApplicationStatus, ApplicationType, ChecklistItemType } from '@admissions-compass/shared';
import { APPLICATION_STATUS_LABELS } from '@admissions-compass/shared';
import { ItemConfigDialog } from './item-config';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TemplateItem {
  id: string;
  template_id: string;
  title: string;
  description: string | null;
  item_type: string;
  is_required: boolean;
  sort_order: number;
  config: Record<string, unknown>;
  due_date_rule: { type: string; days_offset?: number; fixed_date?: string } | null;
  created_at: string;
  updated_at: string;
}

interface TemplateData {
  id: string;
  name: string;
  stage: string;
  grade_levels: string[];
  application_types: string[];
  is_active: boolean;
  items: TemplateItem[];
}

interface ChecklistTemplateBuilderProps {
  template?: TemplateData;
  isNew?: boolean;
}

// ─── Item Type Metadata ─────────────────────────────────────────────────────

const ITEM_TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  form_submission: { label: 'Form', icon: FileText, color: 'bg-blue-100 text-blue-700' },
  document_upload: { label: 'Upload', icon: Upload, color: 'bg-green-100 text-green-700' },
  recommendation: { label: 'Recommendation', icon: UserCheck, color: 'bg-purple-100 text-purple-700' },
  interview: { label: 'Interview', icon: Calendar, color: 'bg-orange-100 text-orange-700' },
  assessment: { label: 'Assessment', icon: ClipboardCheck, color: 'bg-amber-100 text-amber-700' },
  payment: { label: 'Payment', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700' },
  event_attendance: { label: 'Event', icon: Calendar, color: 'bg-indigo-100 text-indigo-700' },
  custom: { label: 'Custom', icon: Settings, color: 'bg-gray-100 text-gray-700' },
};

const GRADE_OPTIONS = ['PK3', 'PK4', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const STAGE_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'started', label: 'Application' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'enrolled', label: 'Enrollment' },
  { value: 'contract_sent', label: 'Contract Sent' },
];

const APP_TYPE_OPTIONS: { value: ApplicationType; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'early_decision', label: 'Early Decision' },
  { value: 'early_action', label: 'Early Action' },
  { value: 'rolling', label: 'Rolling' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'international', label: 'International' },
  { value: 'scholarship', label: 'Scholarship' },
];

// ─── Sortable Item Component ────────────────────────────────────────────────

function SortableItem({
  item,
  onEdit,
  onDelete,
}: {
  item: TemplateItem;
  onEdit: (item: TemplateItem) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const meta = ITEM_TYPE_META[item.item_type] || ITEM_TYPE_META.custom;
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm"
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${meta.color}`}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{item.title}</span>
          {item.is_required && (
            <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
        )}
      </div>

      <Badge variant="secondary" className={`shrink-0 text-xs ${meta.color}`}>
        {meta.label}
      </Badge>

      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onEdit(item)}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ─── Template Builder Component ─────────────────────────────────────────────

export function ChecklistTemplateBuilder({ template, isNew }: ChecklistTemplateBuilderProps) {
  const [name, setName] = useState(template?.name || '');
  const [stage, setStage] = useState(template?.stage || 'started');
  const [gradeFilter, setGradeFilter] = useState<string[]>(template?.grade_levels || []);
  const [appTypes, setAppTypes] = useState<string[]>(template?.application_types || ['standard']);
  const [isActive, setIsActive] = useState(template?.is_active ?? false);
  const [items, setItems] = useState<TemplateItem[]>(template?.items || []);
  const [editingItem, setEditingItem] = useState<TemplateItem | null>(null);
  const [showItemConfig, setShowItemConfig] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        setItems((prev) => {
          const oldIndex = prev.findIndex((item) => item.id === active.id);
          const newIndex = prev.findIndex((item) => item.id === over.id);
          const reordered = arrayMove(prev, oldIndex, newIndex);
          return reordered.map((item, index) => ({ ...item, sort_order: index }));
        });
      }
    },
    []
  );

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemConfig(true);
  };

  const handleEditItem = (item: TemplateItem) => {
    setEditingItem(item);
    setShowItemConfig(true);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, sort_order: index }))
    );
  };

  const handleSaveItem = (itemData: Partial<TemplateItem>) => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...itemData, updated_at: new Date().toISOString() } : item
        )
      );
    } else {
      const newItem: TemplateItem = {
        id: `ti-new-${Date.now()}`,
        template_id: template?.id || 'new',
        title: itemData.title || 'Untitled Item',
        description: itemData.description || null,
        item_type: itemData.item_type || 'custom',
        is_required: itemData.is_required ?? true,
        sort_order: items.length,
        config: itemData.config || {},
        due_date_rule: itemData.due_date_rule || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setItems((prev) => [...prev, newItem]);
    }
    setShowItemConfig(false);
    setEditingItem(null);
  };

  const handleGradeToggle = (grade: string) => {
    setGradeFilter((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handleAppTypeToggle = (type: string) => {
    setAppTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSaveTemplate = async () => {
    const payload = {
      name,
      stage,
      grade_levels: gradeFilter,
      application_types: appTypes,
      is_active: isActive,
      items,
    };

    const url = isNew ? '/api/v1/checklists/templates' : `/api/v1/checklists/templates/${template?.id}`;
    const method = isNew ? 'POST' : 'PATCH';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  return (
    <div className="space-y-6">
      {/* Template Header */}
      <Card>
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., Application Checklist - K-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-stage">Stage</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger id="template-stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Grade Levels</Label>
            <div className="flex flex-wrap gap-2">
              {GRADE_OPTIONS.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => handleGradeToggle(grade)}
                  className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                    gradeFilter.includes(grade)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-accent'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Application Types</Label>
            <div className="flex flex-wrap gap-2">
              {APP_TYPE_OPTIONS.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleAppTypeToggle(type.value)}
                  className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                    appTypes.includes(type.value)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background hover:bg-accent'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="template-active"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
            />
            <Label htmlFor="template-active">Active</Label>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>
            Checklist Items ({items.length})
          </CardTitle>
          <Button onClick={handleAddItem} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
              <div className="text-center">
                <Info className="mx-auto h-8 w-8 mb-2" />
                <p>No items yet. Click "Add Item" to get started.</p>
              </div>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((item) => (
                      <SortableItem
                        key={item.id}
                        item={item}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" asChild>
          <a href="/checklists">Cancel</a>
        </Button>
        <Button onClick={handleSaveTemplate}>
          {isNew ? 'Create Template' : 'Save Changes'}
        </Button>
      </div>

      {/* Item Config Dialog */}
      <ItemConfigDialog
        open={showItemConfig}
        onOpenChange={setShowItemConfig}
        item={editingItem}
        onSave={handleSaveItem}
      />
    </div>
  );
}
