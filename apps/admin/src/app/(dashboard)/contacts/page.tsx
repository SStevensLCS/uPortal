'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Filter,
} from 'lucide-react';
import {
  Card,
  CardContent,
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
} from '@admissions-compass/ui';

const DEMO_CONTACTS = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', phone: '(555) 123-4567', students: ['Emma Johnson'], stage: 'submitted', leadSource: 'website', lastActivity: '2 hours ago' },
  { id: '2', firstName: 'Michael', lastName: 'Chen', email: 'mchen@email.com', phone: '(555) 234-5678', students: ['Lily Chen', 'James Chen'], stage: 'inquiry', leadSource: 'open_house', lastActivity: '1 day ago' },
  { id: '3', firstName: 'Amanda', lastName: 'Williams', email: 'awilliams@email.com', phone: '(555) 345-6789', students: ['Ethan Williams'], stage: 'under_review', leadSource: 'referral', lastActivity: '3 days ago' },
  { id: '4', firstName: 'David', lastName: 'Martinez', email: 'dmartinez@email.com', phone: '(555) 456-7890', students: ['Sofia Martinez'], stage: 'accepted', leadSource: 'social_ad', lastActivity: '5 days ago' },
  { id: '5', firstName: 'Jennifer', lastName: 'Taylor', email: 'jtaylor@email.com', phone: '(555) 567-8901', students: ['Olivia Taylor'], stage: 'prospect', leadSource: 'niche', lastActivity: '2 weeks ago' },
  { id: '6', firstName: 'Robert', lastName: 'Anderson', email: 'randerson@email.com', phone: '(555) 678-9012', students: ['Lucas Anderson', 'Mia Anderson'], stage: 'enrolled', leadSource: 'referral', lastActivity: '1 day ago' },
  { id: '7', firstName: 'Lisa', lastName: 'Patel', email: 'lpatel@email.com', phone: '(555) 789-0123', students: ['Arjun Patel'], stage: 'started', leadSource: 'directory', lastActivity: '4 days ago' },
  { id: '8', firstName: 'Chris', lastName: 'Thompson', email: 'cthompson@email.com', phone: '(555) 890-1234', students: ['Noah Thompson'], stage: 'contract_sent', leadSource: 'website', lastActivity: '6 hours ago' },
];

const STAGE_COLORS: Record<string, string> = {
  inquiry: 'bg-gray-100 text-gray-700', prospect: 'bg-blue-100 text-blue-700', started: 'bg-indigo-100 text-indigo-700',
  submitted: 'bg-yellow-100 text-yellow-700', under_review: 'bg-orange-100 text-orange-700', accepted: 'bg-green-100 text-green-700',
  enrolled: 'bg-emerald-100 text-emerald-700', contract_sent: 'bg-teal-100 text-teal-700', denied: 'bg-red-100 text-red-700',
};

const STAGE_LABELS: Record<string, string> = {
  inquiry: 'Inquiry', prospect: 'Prospect', started: 'Started', submitted: 'Submitted',
  under_review: 'Under Review', accepted: 'Accepted', enrolled: 'Enrolled', contract_sent: 'Contract Sent',
};

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const filtered = DEMO_CONTACTS.filter((c) => {
    const matchesSearch = searchQuery === '' || `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || c.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage prospective families and contacts in your admissions database.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button size="sm"><UserPlus className="mr-2 h-4 w-4" />Add Contact</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Contacts', value: '1,284' },
          { label: 'New This Week', value: '47' },
          { label: 'Active Families', value: '892' },
          { label: 'Avg Lead Score', value: '72' },
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
              <Input type="search" placeholder="Search by name or email..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Stages" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
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
                <TableHead className="w-[250px]">Contact</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Lead Source</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarFallback className="text-xs">{c.firstName[0]}{c.lastName[0]}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      {c.students.map((s) => <span key={s} className="text-sm">{s}</span>)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={STAGE_COLORS[c.stage] || ''}>
                      {STAGE_LABELS[c.stage] || c.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm capitalize">{c.leadSource.replace('_', ' ')}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.lastActivity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" />Send Email</DropdownMenuItem>
                        <DropdownMenuItem><Phone className="mr-2 h-4 w-4" />Call</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">Showing {filtered.length} of {DEMO_CONTACTS.length} contacts</p>
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
