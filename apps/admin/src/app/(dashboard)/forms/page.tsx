'use client';

import { useState } from 'react';
import {
  ClipboardList,
  Plus,
  MoreHorizontal,
  Copy,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@admissions-compass/ui';

const DEMO_FORMS = [
  { id: '1', name: 'General Inquiry Form', type: 'inquiry', status: 'published', submissions: 234, fields: 8, lastEdited: '2 days ago', season: '2025-2026' },
  { id: '2', name: 'Standard Application - Lower School', type: 'application', status: 'published', submissions: 156, fields: 24, lastEdited: '1 week ago', season: '2025-2026' },
  { id: '3', name: 'Standard Application - Upper School', type: 'application', status: 'published', submissions: 98, fields: 28, lastEdited: '1 week ago', season: '2025-2026' },
  { id: '4', name: 'Teacher Recommendation', type: 'recommendation', status: 'published', submissions: 87, fields: 12, lastEdited: '3 weeks ago', season: '2025-2026' },
  { id: '5', name: 'Counselor Recommendation', type: 'recommendation', status: 'published', submissions: 45, fields: 15, lastEdited: '3 weeks ago', season: '2025-2026' },
  { id: '6', name: 'Re-enrollment Form', type: 're_enrollment', status: 'draft', submissions: 0, fields: 10, lastEdited: '1 day ago', season: '2026-2027' },
  { id: '7', name: 'Parent Questionnaire', type: 'supplemental', status: 'published', submissions: 112, fields: 18, lastEdited: '2 weeks ago', season: '2025-2026' },
  { id: '8', name: 'Financial Aid Application', type: 'supplemental', status: 'published', submissions: 67, fields: 22, lastEdited: '1 month ago', season: '2025-2026' },
];

const TYPE_COLORS: Record<string, string> = {
  inquiry: 'bg-blue-100 text-blue-700',
  application: 'bg-purple-100 text-purple-700',
  recommendation: 'bg-orange-100 text-orange-700',
  re_enrollment: 'bg-green-100 text-green-700',
  supplemental: 'bg-yellow-100 text-yellow-700',
};

const TYPE_LABELS: Record<string, string> = {
  inquiry: 'Inquiry',
  application: 'Application',
  recommendation: 'Recommendation',
  re_enrollment: 'Re-enrollment',
  supplemental: 'Supplemental',
};

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-700',
  archived: 'bg-red-100 text-red-700',
};

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = DEMO_FORMS.filter((f) => {
    const matchesSearch = searchQuery === '' || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || f.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground">Design and manage application forms, inquiry forms, and other data collection templates.</p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" />Create Form</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Forms', value: DEMO_FORMS.length.toString() },
          { label: 'Published', value: DEMO_FORMS.filter((f) => f.status === 'published').length.toString() },
          { label: 'Total Submissions', value: DEMO_FORMS.reduce((sum, f) => sum + f.submissions, 0).toLocaleString() },
          { label: 'Avg Fields per Form', value: Math.round(DEMO_FORMS.reduce((sum, f) => sum + f.fields, 0) / DEMO_FORMS.length).toString() },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search forms..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="recommendation">Recommendation</SelectItem>
                <SelectItem value="re_enrollment">Re-enrollment</SelectItem>
                <SelectItem value="supplemental">Supplemental</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Form Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((form) => (
                <TableRow key={form.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{form.name}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className={TYPE_COLORS[form.type] || ''}>{TYPE_LABELS[form.type] || form.type}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={STATUS_COLORS[form.status] || ''}>{form.status.charAt(0).toUpperCase() + form.status.slice(1)}</Badge></TableCell>
                  <TableCell className="text-sm">{form.submissions}</TableCell>
                  <TableCell className="text-sm">{form.fields}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{form.season}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{form.lastEdited}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit Form</DropdownMenuItem>
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Preview</DropdownMenuItem>
                        <DropdownMenuItem><Copy className="mr-2 h-4 w-4" />Duplicate</DropdownMenuItem>
                        <DropdownMenuItem><ExternalLink className="mr-2 h-4 w-4" />Share Link</DropdownMenuItem>
                        <DropdownMenuItem>View Submissions</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
