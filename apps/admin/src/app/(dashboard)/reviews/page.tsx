'use client';

import { useState } from 'react';
import {
  Star,
  Search,
  Filter,
  Eye,
  MessageSquare,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
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

const REVIEW_STATS = { pendingReview: 32, inProgress: 12, completed: 45, avgScore: 7.4 };

const DEMO_REVIEWS = [
  { id: '1', studentName: 'Lily Chen', grade: '1', status: 'completed', reviewers: [{ name: 'Dr. Adams', score: 8.5, completed: true }, { name: 'Mrs. Park', score: 7.8, completed: true }], avgScore: 8.15, dueDate: 'Feb 15, 2026', recommendation: 'accept' },
  { id: '2', studentName: 'Ethan Williams', grade: '2', status: 'in_progress', reviewers: [{ name: 'Dr. Adams', score: 7.2, completed: true }, { name: 'Mrs. Park', score: null, completed: false }], avgScore: 7.2, dueDate: 'Feb 15, 2026', recommendation: null },
  { id: '3', studentName: 'Emma Johnson', grade: 'K', status: 'pending', reviewers: [{ name: 'Mr. Garcia', score: null, completed: false }, { name: 'Mrs. Park', score: null, completed: false }], avgScore: null, dueDate: 'Feb 20, 2026', recommendation: null },
  { id: '4', studentName: 'Sofia Martinez', grade: 'K', status: 'completed', reviewers: [{ name: 'Dr. Adams', score: 9.2, completed: true }, { name: 'Mr. Garcia', score: 8.8, completed: true }], avgScore: 9.0, dueDate: 'Jan 30, 2026', recommendation: 'accept' },
  { id: '5', studentName: 'Noah Thompson', grade: '5', status: 'completed', reviewers: [{ name: 'Mrs. Park', score: 6.5, completed: true }, { name: 'Mr. Garcia', score: 7.0, completed: true }], avgScore: 6.75, dueDate: 'Jan 15, 2026', recommendation: 'waitlist' },
  { id: '6', studentName: 'Mia Anderson', grade: '2', status: 'pending', reviewers: [{ name: 'Dr. Adams', score: null, completed: false }, { name: 'Mrs. Park', score: null, completed: false }], avgScore: null, dueDate: 'Feb 25, 2026', recommendation: null },
];

const REVIEW_STATUS_BADGES: Record<string, { label: string; className: string }> = {
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-700' },
};

const REC_BADGES: Record<string, string> = {
  accept: 'bg-green-100 text-green-700',
  deny: 'bg-red-100 text-red-700',
  waitlist: 'bg-purple-100 text-purple-700',
  defer: 'bg-yellow-100 text-yellow-700',
};

function getScoreColor(score: number | null) {
  if (score === null) return 'text-muted-foreground';
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
}

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReviews = DEMO_REVIEWS.filter((review) => {
    const matchesSearch = searchQuery === '' || review.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">Manage application reviews, assign reviewers, and track evaluation scores.</p>
        </div>
        <Button size="sm"><UserCheck className="mr-2 h-4 w-4" />Assign Reviewers</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Pending Review', value: REVIEW_STATS.pendingReview, icon: AlertCircle, iconClass: 'text-gray-600', bgClass: 'bg-gray-100' },
          { label: 'In Progress', value: REVIEW_STATS.inProgress, icon: Clock, iconClass: 'text-yellow-600', bgClass: 'bg-yellow-100' },
          { label: 'Completed', value: REVIEW_STATS.completed, icon: CheckCircle2, iconClass: 'text-green-600', bgClass: 'bg-green-100' },
          { label: 'Avg Score', value: `${REVIEW_STATS.avgScore}/10`, icon: Star, iconClass: 'text-blue-600', bgClass: 'bg-blue-100' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bgClass}`}>
                  <s.icon className={`h-5 w-5 ${s.iconClass}`} />
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                <TableHead>Status</TableHead>
                <TableHead>Reviewers</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{review.studentName.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                      <span className="font-medium">{review.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{review.grade}</Badge></TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={REVIEW_STATUS_BADGES[review.status]?.className}>
                      {REVIEW_STATUS_BADGES[review.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {review.reviewers.map((r) => (
                        <div key={r.name} className="flex items-center gap-2 text-sm">
                          {r.completed ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Clock className="h-3.5 w-3.5 text-gray-400" />}
                          <span className={r.completed ? '' : 'text-muted-foreground'}>{r.name}</span>
                          {r.score !== null && <span className={`font-medium ${getScoreColor(r.score)}`}>{r.score}</span>}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-lg font-bold ${getScoreColor(review.avgScore)}`}>
                      {review.avgScore !== null ? review.avgScore.toFixed(1) : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {review.recommendation ? (
                      <Badge variant="secondary" className={REC_BADGES[review.recommendation] || ''}>
                        {review.recommendation.charAt(0).toUpperCase() + review.recommendation.slice(1)}
                      </Badge>
                    ) : <span className="text-sm text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{review.dueDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Application</DropdownMenuItem>
                        <DropdownMenuItem>Start Review</DropdownMenuItem>
                        <DropdownMenuItem>Reassign Reviewer</DropdownMenuItem>
                        <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" />Add Comment</DropdownMenuItem>
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
