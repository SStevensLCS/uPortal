'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button, Skeleton } from '@admissions-compass/ui';
import { ChecklistTemplateBuilder } from '@/components/checklists/template-builder';

interface TemplateData {
  id: string;
  name: string;
  stage: string;
  grade_levels: string[];
  application_types: string[];
  is_active: boolean;
  items: Array<{
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
  }>;
}

async function fetchTemplate(id: string): Promise<TemplateData> {
  const res = await fetch(`/api/v1/checklists/templates/${id}`);
  if (!res.ok) throw new Error('Failed to fetch template');
  const json = await res.json();
  return json.data;
}

export default function ChecklistTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: template, isLoading } = useQuery({
    queryKey: ['checklist-template', id],
    queryFn: () => fetchTemplate(id),
    enabled: id !== 'new',
  });

  if (id !== 'new' && isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/checklists">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {id === 'new' ? 'New Checklist Template' : 'Edit Template'}
          </h1>
          <p className="text-muted-foreground">
            {id === 'new'
              ? 'Create a new checklist template for an admissions stage.'
              : `Editing: ${template?.name || ''}`}
          </p>
        </div>
      </div>

      <ChecklistTemplateBuilder
        template={id === 'new' ? undefined : template}
        isNew={id === 'new'}
      />
    </div>
  );
}
