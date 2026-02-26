'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Send,
  ChevronLeft,
  ChevronRight,
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
  Avatar,
  AvatarFallback,
  Progress,
} from '@admissions-compass/ui';

const PIPELINE_STAGES = [
  { label: 'Inquiry', value: 'inquiry', count: 156, color: 'bg-gray-500' },
  { label: 'Prospect', value: 'prospect', count: 89, color: 'bg-blue-500' },
  { label: 'Started', value: 'started', count: 67, color: 'bg-indigo-500' },
  { label: 'Submitted', value: 'submitted', count: 45, color: 'bg-yellow-500' },
  { label: 'Under Review', value: 'under_review', count: 32, color: 'bg-orange-500' },
  { label: 'Accepted', value: 'accepted', count: 28, color: 'bg-green-500' },
  { label: 'Enrolled', value: 'enrolled', count: 18, color: 'bg-emerald-500' },
];

const DEMO_APPLICATIONS = [
  { id: '1', studentName: 'Emma Johnson', parentName: 'Sarah Johnson', grade: 'K', status: 'submitted', type: 'standard', checklistProgress: 85, submittedDate: 'Jan 15, 2026', leadScore: 87 },
  { id: '2', studentName: 'Lily Chen', parentName: 'Michael Chen', grade: '1', status: 'under_review', type: 'standard', checklistProgress: 100, submittedDate: 'Jan 10, 2026', leadScore: 92 },
  { id: '3', studentName: 'James Chen', parentName: 'Michael Chen', grade: '3', status: 'inquiry', type: 'sibling', checklistProgress: 20, submittedDate: null, leadScore: 65 },
  { id: '4', studentName: 'Ethan Williams', parentName: 'Amanda Williams', grade: '2', status: 'under_review', type: 'standard', checklistProgress: 100, submittedDate: 'Jan 8, 2026', leadScore: 78 },
  { id: '5', studentName: 'Sofia Martinez', parentName: 'David Martinez', grade: 'K', status: 'accepted', type: 'standard', checklistProgress: 100, submittedDate: 'Dec 20, 2025', leadScore: 95 },
  { id: '6', studentName: 'Olivia Taylor', parentName: 'Jennifer Taylor', grade: '4', status: 'prospect', type: 'transfer', checklistProgress: 30, submittedDate: null, leadScore: 55 },
  { id: '7', studentName: 'Lucas Anderson', parentName: 'Robert Anderson', grade: 'PK4', status: 'enrolled', type: 'standard', checklistProgress: 100, submittedDate: 'Nov 15, 2025', leadScore: 98 },
  { id: '8', studentName: 'Arjun Patel', parentName: 'Lisa Patel', grade: '1', status: 'started', type: 'standard', checklistProgress: 45, submittedDate: null, leadScore: 72 },
  { id: '9', studentName: 'Noah Thompson', parentName: 'Chris Thompson', grade: '5', status: 'accepted', type: 'standard', checklistProgress: 100, submittedDate: 'Dec 5, 2025', leadScore: 88 },
  { id: '10', studentName: 'Mia Anderson', parentName: 'Robert Anderson', grade: '2', status: 'submitted', type: 'sibling', checklistProgress: 90, submittedDate: 'Jan 18, 2026', leadScore: 82 },
];

const STATUS_COLORS: Record<string, string> = {
  inquiry: 'bg-gray-100 text-gray-700', prospect: 'bg-blue-100 text-blue-700', started: 'bg-indigo-100 text-indigo-700',
  submitted: 'bg-yellow-100 text-yellow-700', under_review: 'bg-orange-100 text-orange-700', accepted: 'bg-green-100 text-green-700',
  enrolled: 'bg-emerald-100 text-emerald-700', denied: 'bg-red-100 text-red-700', withdrawn: 'bg-gray-100 text-gray-500',
};

const STATUS_LABELS: Record<string, string> = {
  inquiry: 'Inquiry', prospect: 'Prospect', started: 'Started', submitted: 'Submitted',
  under_review: 'Under Review', accepted: 'Accepted', enrolled: 'Enrolled', denied: 'Denied', withdrawn: 'Withdrawn',
};

function getLeadScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApps = DEMO_APPLICATIONS.filter((app) => {
    const matchesSearch = searchQuery === '' || app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || app.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPipeline = PIPELINE_STAGES.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Review and manage student applications across all stages.</p>
        </div>
        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Application Pipeline</CardTitle>
          <CardDescription>{totalPipeline} total applications this season</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-8 w-full overflow-hidden rounded-full">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage.value} className={`${stage.color} relative flex items-center justify-center transition-all hover:opacity-80`} style={{ width: `${(stage.count / totalPipeline) * 100}%` }} title={`${stage.label}: ${stage.count}`}>
                {stage.count > 20 && <span className="text-xs font-medium text-white">{stage.count}</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {PIPELINE_STAGES.map((stage) => (
              <div key={stage.value} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                <span className="text-xs text-muted-foreground">{stage.label} ({stage.count})</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search by student or parent name..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="started">Started</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="enrolled">Enrolled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" />More Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Student</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Checklist</TableHead>
                <TableHead>Lead Score</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{app.studentName.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                      <span className="font-medium">{app.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{app.parentName}</TableCell>
                  <TableCell><Badge variant="outline">{app.grade}</Badge></TableCell>
                  <TableCell className="text-sm capitalize">{app.type}</TableCell>
                  <TableCell><Badge variant="secondary" className={STATUS_COLORS[app.status] || ''}>{STATUS_LABELS[app.status] || app.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={app.checklistProgress} className="h-2 w-16" />
                      <span className="text-xs text-muted-foreground">{app.checklistProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell><span className={`text-sm font-semibold ${getLeadScoreColor(app.leadScore)}`}>{app.leadScore}</span></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{app.submittedDate || '—'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Application</DropdownMenuItem>
                        <DropdownMenuItem>View Checklist</DropdownMenuItem>
                        <DropdownMenuItem><Send className="mr-2 h-4 w-4" />Send Message</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">Showing {filteredApps.length} of {DEMO_APPLICATIONS.length} applications</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm">Page 1 of 1</span>
            <Button variant="outline" size="sm" disabled><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
