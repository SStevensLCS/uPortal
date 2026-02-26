'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Plus,
  Search,
  MoreHorizontal,
  CheckSquare,
  Copy,
  Trash2,
  Pencil,
} from 'lucide-react';
import {
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@admissions-compass/ui';
import { APPLICATION_STATUS_LABELS } from '@admissions-compass/shared';
import type { ApplicationStatus } from '@admissions-compass/shared';

interface TemplateListItem {
  id: string;
  name: string;
  stage: ApplicationStatus;
  grade_levels: string[];
  application_types: string[];
  is_active: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
}

async function fetchTemplates(stage?: string): Promise<TemplateListItem[]> {
  const params = new URLSearchParams();
  if (stage && stage !== 'all') params.set('stage', stage);
  const res = await fetch(`/api/v1/checklists/templates?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  const json = await res.json();
  return json.data;
}

export default function ChecklistsPage() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['checklist-templates', stageFilter],
    queryFn: () => fetchTemplates(stageFilter),
  });

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const stageBadgeVariant = (stage: ApplicationStatus) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      inquiry: 'outline',
      started: 'secondary',
      submitted: 'default',
      under_review: 'default',
      enrolled: 'default',
    };
    return variants[stage] || 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklists</h1>
          <p className="text-muted-foreground">
            Manage checklist templates for each stage of the admissions process.
          </p>
        </div>
        <Link href="/checklists/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="started">Application</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="enrolled">Enrollment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Grade Levels</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Loading templates...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No templates found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((template) => (
                  <TableRow key={template.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/checklists/${template.id}`}
                        className="flex items-center gap-2 font-medium hover:underline"
                      >
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        {template.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stageBadgeVariant(template.stage)}>
                        {APPLICATION_STATUS_LABELS[template.stage]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {template.grade_levels.length > 4 ? (
                          <span className="text-sm text-muted-foreground">
                            {template.grade_levels.slice(0, 3).join(', ')} +{template.grade_levels.length - 3} more
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {template.grade_levels.join(', ')}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{template.item_count}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={template.is_active ? 'default' : 'secondary'}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/checklists/${template.id}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
