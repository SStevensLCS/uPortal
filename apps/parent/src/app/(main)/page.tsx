'use client';

import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  GraduationCap,
  Upload,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@admissions-compass/ui';
import { Button } from '@admissions-compass/ui';
import { Badge } from '@admissions-compass/ui';

const COMPLETED_ITEMS = 4;
const TOTAL_ITEMS = 7;
const PROGRESS_PERCENTAGE = Math.round((COMPLETED_ITEMS / TOTAL_ITEMS) * 100);

const RECENT_UPDATES = [
  {
    id: '1',
    title: 'Application submitted to Lincoln Academy',
    timestamp: '2 hours ago',
    icon: FileText,
    status: 'completed' as const,
  },
  {
    id: '2',
    title: 'Recommendation letter received from Ms. Davis',
    timestamp: 'Yesterday',
    icon: CheckCircle2,
    status: 'completed' as const,
  },
  {
    id: '3',
    title: 'Interview scheduled at Westfield Prep',
    timestamp: '2 days ago',
    icon: Clock,
    status: 'pending' as const,
  },
  {
    id: '4',
    title: 'Transcript upload required for Oak Hill School',
    timestamp: '3 days ago',
    icon: Upload,
    status: 'action' as const,
  },
];

const QUICK_LINKS = [
  { label: 'Upload Documents', href: '/checklist', icon: Upload },
  { label: 'View Applications', href: '/applications', icon: FileText },
  { label: 'Upcoming Events', href: '/schedule', icon: Clock },
  { label: 'School Directory', href: '/applications', icon: GraduationCap },
];

function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 10,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">
          {percentage}%
        </span>
        <span className="text-xs text-muted-foreground">complete</span>
      </div>
    </div>
  );
}

export default function ParentHomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back, Sarah
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Here is an overview of your admissions progress.
        </p>
      </div>

      {/* Progress + Next Step row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Progress Ring Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Progress</CardTitle>
            <CardDescription>Application checklist completion</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3 pt-2">
            <ProgressRing percentage={PROGRESS_PERCENTAGE} />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {COMPLETED_ITEMS} of {TOTAL_ITEMS}
              </span>{' '}
              items complete
            </p>
          </CardContent>
        </Card>

        {/* Next Step Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                Next Step
              </Badge>
            </div>
            <CardTitle className="text-base">
              Upload Transcript for Oak Hill School
            </CardTitle>
            <CardDescription>
              The school requires an official transcript from the current school
              year. You can upload a PDF or image file.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button size="sm" className="min-h-[44px] w-full sm:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Updates</CardTitle>
          <CardDescription>
            Latest activity across all applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 p-4 pt-0 md:p-6 md:pt-0">
          {RECENT_UPDATES.map((update) => {
            const Icon = update.icon;
            return (
              <div
                key={update.id}
                className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    update.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : update.status === 'action'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {update.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {update.timestamp}
                  </p>
                </div>
                {update.status === 'action' && (
                  <Badge
                    variant="outline"
                    className="shrink-0 text-orange-600 border-orange-200"
                  >
                    Action needed
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Links
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-lg border bg-card p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium leading-tight">
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
