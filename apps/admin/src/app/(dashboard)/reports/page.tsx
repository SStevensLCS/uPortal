'use client';

import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  GraduationCap,
  Download,
  Calendar,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from '@admissions-compass/ui';

const KPI_CARDS = [
  { title: 'Total Applications', value: '435', change: '+12%', trend: 'up', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Acceptance Rate', value: '34.2%', change: '-2.1%', trend: 'down', icon: Target, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'Yield Rate', value: '68.5%', change: '+5.3%', trend: 'up', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Avg Time to Decision', value: '18 days', change: '-3 days', trend: 'up', icon: Calendar, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { title: 'Revenue (Fees)', value: '$32,450', change: '+8%', trend: 'up', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  { title: 'Enrolled Students', value: '148', change: '+6%', trend: 'up', icon: GraduationCap, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
];

const PIPELINE_DATA = [
  { stage: 'Inquiry', count: 156, percentage: 100 },
  { stage: 'Prospect', count: 89, percentage: 57 },
  { stage: 'Started', count: 67, percentage: 43 },
  { stage: 'Submitted', count: 45, percentage: 29 },
  { stage: 'Under Review', count: 32, percentage: 21 },
  { stage: 'Accepted', count: 28, percentage: 18 },
  { stage: 'Enrolled', count: 18, percentage: 12 },
];

const GRADE_BREAKDOWN = [
  { grade: 'PK3', applied: 22, accepted: 10, enrolled: 8, capacity: 18 },
  { grade: 'PK4', applied: 35, accepted: 15, enrolled: 12, capacity: 20 },
  { grade: 'K', applied: 68, accepted: 22, enrolled: 18, capacity: 24 },
  { grade: '1', applied: 45, accepted: 18, enrolled: 14, capacity: 20 },
  { grade: '2', applied: 38, accepted: 14, enrolled: 10, capacity: 18 },
  { grade: '3', applied: 32, accepted: 12, enrolled: 9, capacity: 16 },
  { grade: '4', applied: 28, accepted: 10, enrolled: 8, capacity: 14 },
  { grade: '5', applied: 25, accepted: 8, enrolled: 6, capacity: 12 },
];

const LEAD_SOURCE_DATA = [
  { source: 'Website', count: 124, percentage: 29 },
  { source: 'Open House', count: 89, percentage: 20 },
  { source: 'Referral', count: 78, percentage: 18 },
  { source: 'Social Media', count: 52, percentage: 12 },
  { source: 'Niche/Directory', count: 45, percentage: 10 },
  { source: 'Event', count: 32, percentage: 7 },
  { source: 'Other', count: 15, percentage: 4 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Analytics and insights for your admissions pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="2025-2026">
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-2026">2025-2026</SelectItem>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="funnel">
        <TabsList>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="grades">By Grade</TabsTrigger>
          <TabsTrigger value="sources">Lead Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admissions Funnel</CardTitle>
              <CardDescription>Conversion through each stage of the pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PIPELINE_DATA.map((stage, i) => (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <div className="w-28 text-sm font-medium">{stage.stage}</div>
                    <div className="flex-1">
                      <div className="flex h-8 items-center">
                        <div
                          className="h-8 rounded-md bg-primary/80 flex items-center justify-end pr-3 transition-all"
                          style={{ width: `${stage.percentage}%`, minWidth: '40px' }}
                        >
                          <span className="text-xs font-medium text-primary-foreground">{stage.count}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm text-muted-foreground">
                      {stage.percentage}%
                    </div>
                    {i > 0 && (
                      <div className="w-20 text-right text-xs text-muted-foreground">
                        {Math.round((stage.count / PIPELINE_DATA[i - 1].count) * 100)}% conv.
                      </div>
                    )}
                    {i === 0 && <div className="w-20" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enrollment by Grade</CardTitle>
              <CardDescription>Application volume, acceptances, and enrollment vs capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
                  <div>Grade</div>
                  <div className="text-right">Applied</div>
                  <div className="text-right">Accepted</div>
                  <div className="text-right">Enrolled</div>
                  <div className="text-right">Capacity</div>
                  <div className="text-right">Fill Rate</div>
                </div>
                {GRADE_BREAKDOWN.map((g) => {
                  const fillRate = Math.round((g.enrolled / g.capacity) * 100);
                  return (
                    <div key={g.grade} className="grid grid-cols-6 gap-4 items-center">
                      <div className="text-sm font-medium">{g.grade}</div>
                      <div className="text-right text-sm">{g.applied}</div>
                      <div className="text-right text-sm">{g.accepted}</div>
                      <div className="text-right text-sm font-medium">{g.enrolled}</div>
                      <div className="text-right text-sm text-muted-foreground">{g.capacity}</div>
                      <div className="text-right">
                        <Badge variant="secondary" className={fillRate >= 80 ? 'bg-green-100 text-green-700' : fillRate >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                          {fillRate}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead Sources</CardTitle>
              <CardDescription>Where prospective families are finding your school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {LEAD_SOURCE_DATA.map((source) => (
                  <div key={source.source} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{source.source}</div>
                    <div className="flex-1">
                      <div className="h-6 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/70" style={{ width: `${source.percentage}%` }} />
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-medium">{source.count}</div>
                    <div className="w-12 text-right text-xs text-muted-foreground">{source.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
