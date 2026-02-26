'use client';

import { useState } from 'react';
import {
  Scale,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ListOrdered,
  Mail,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@admissions-compass/ui';

const DECISION_STATS = {
  pending: 32,
  accepted: 28,
  waitlisted: 15,
  denied: 8,
  total: 83,
  acceptRate: '33.7%',
};

const DEMO_DECISIONS = [
  { id: '1', studentName: 'Lily Chen', grade: '1', reviewScore: 8.15, recommendation: 'accept', decision: 'accepted', released: true, releasedAt: 'Feb 1, 2026', financialAid: true, aidAmount: '$12,000' },
  { id: '2', studentName: 'Sofia Martinez', grade: 'K', reviewScore: 9.0, recommendation: 'accept', decision: 'accepted', released: true, releasedAt: 'Feb 1, 2026', financialAid: false, aidAmount: null },
  { id: '3', studentName: 'Noah Thompson', grade: '5', reviewScore: 6.75, recommendation: 'waitlist', decision: 'waitlisted', released: false, releasedAt: null, financialAid: false, aidAmount: null },
  { id: '4', studentName: 'Ethan Williams', grade: '2', reviewScore: 7.2, recommendation: null, decision: null, released: false, releasedAt: null, financialAid: true, aidAmount: null },
  { id: '5', studentName: 'Emma Johnson', grade: 'K', reviewScore: null, recommendation: null, decision: null, released: false, releasedAt: null, financialAid: false, aidAmount: null },
  { id: '6', studentName: 'Mia Anderson', grade: '2', reviewScore: null, recommendation: null, decision: null, released: false, releasedAt: null, financialAid: false, aidAmount: null },
  { id: '7', studentName: 'Lucas Anderson', grade: 'PK4', reviewScore: 8.8, recommendation: 'accept', decision: 'accepted', released: true, releasedAt: 'Jan 25, 2026', financialAid: true, aidAmount: '$8,500' },
  { id: '8', studentName: 'Arjun Patel', grade: '1', reviewScore: 5.5, recommendation: 'deny', decision: 'denied', released: true, releasedAt: 'Feb 5, 2026', financialAid: false, aidAmount: null },
];

const DECISION_COLORS: Record<string, string> = {
  accepted: 'bg-green-100 text-green-700',
  denied: 'bg-red-100 text-red-700',
  waitlisted: 'bg-purple-100 text-purple-700',
  deferred: 'bg-yellow-100 text-yellow-700',
};

function getScoreColor(score: number | null) {
  if (score === null) return 'text-muted-foreground';
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
}

export default function DecisionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('all');

  const filtered = DEMO_DECISIONS.filter((d) => {
    const matchesSearch = searchQuery === '' || d.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDecision = decisionFilter === 'all' || (decisionFilter === 'pending' ? d.decision === null : d.decision === decisionFilter);
    return matchesSearch && matchesDecision;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decisions</h1>
          <p className="text-muted-foreground">Make and publish admissions decisions for all applicants.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><ListOrdered className="mr-2 h-4 w-4" />Manage Waitlist</Button>
          <Button size="sm"><Mail className="mr-2 h-4 w-4" />Release Decisions</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {[
          { label: 'Pending Decision', value: DECISION_STATS.pending, color: 'bg-gray-100', iconColor: 'text-gray-600', icon: Clock },
          { label: 'Accepted', value: DECISION_STATS.accepted, color: 'bg-green-100', iconColor: 'text-green-600', icon: CheckCircle2 },
          { label: 'Waitlisted', value: DECISION_STATS.waitlisted, color: 'bg-purple-100', iconColor: 'text-purple-600', icon: ListOrdered },
          { label: 'Denied', value: DECISION_STATS.denied, color: 'bg-red-100', iconColor: 'text-red-600', icon: XCircle },
          { label: 'Accept Rate', value: DECISION_STATS.acceptRate, color: 'bg-blue-100', iconColor: 'text-blue-600', icon: Scale },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                  <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search by student name..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={decisionFilter} onValueChange={setDecisionFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Decisions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
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
                <TableHead className="w-[180px]">Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Review Score</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Financial Aid</TableHead>
                <TableHead>Released</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{d.studentName.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                      <span className="font-medium">{d.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{d.grade}</Badge></TableCell>
                  <TableCell><span className={`text-sm font-semibold ${getScoreColor(d.reviewScore)}`}>{d.reviewScore?.toFixed(1) ?? '—'}</span></TableCell>
                  <TableCell>
                    {d.recommendation ? (
                      <Badge variant="secondary" className={DECISION_COLORS[`${d.recommendation === 'accept' ? 'accepted' : d.recommendation === 'deny' ? 'denied' : d.recommendation + 'ed'}`] || 'bg-gray-100'}>
                        {d.recommendation.charAt(0).toUpperCase() + d.recommendation.slice(1)}
                      </Badge>
                    ) : <span className="text-sm text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    {d.decision ? (
                      <Badge variant="secondary" className={DECISION_COLORS[d.decision] || ''}>
                        {d.decision.charAt(0).toUpperCase() + d.decision.slice(1)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {d.financialAid ? (
                      <span className="text-sm text-green-600 font-medium">{d.aidAmount || 'Requested'}</span>
                    ) : <span className="text-sm text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    {d.released ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="text-xs">{d.releasedAt}</span>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">Not released</span>}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Application</DropdownMenuItem>
                        <DropdownMenuItem>Set Decision</DropdownMenuItem>
                        <DropdownMenuItem><Send className="mr-2 h-4 w-4" />Release Letter</DropdownMenuItem>
                        <DropdownMenuItem>Financial Aid Details</DropdownMenuItem>
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
