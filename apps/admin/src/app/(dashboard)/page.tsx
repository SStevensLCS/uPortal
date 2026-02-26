import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@admissions-compass/ui';
import {
  Users,
  FileText,
  CheckSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  UserPlus,
  Send,
  Eye,
  Calendar,
  Mail,
  Upload,
} from 'lucide-react';

const STAT_CARDS = [
  { title: 'Total Contacts', value: '1,284', description: '+12% from last month', icon: Users },
  { title: 'Active Applications', value: '342', description: '28 submitted this week', icon: FileText },
  { title: 'Pending Checklists', value: '89', description: '15 completed today', icon: CheckSquare },
  { title: 'Conversion Rate', value: '24.8%', description: '+2.1% from last season', icon: TrendingUp },
];

const PIPELINE_STAGES = [
  { label: 'Inquiry', count: 156, color: 'bg-gray-500' },
  { label: 'Prospect', count: 89, color: 'bg-blue-500' },
  { label: 'Started', count: 67, color: 'bg-indigo-500' },
  { label: 'Submitted', count: 45, color: 'bg-yellow-500' },
  { label: 'Under Review', count: 32, color: 'bg-orange-500' },
  { label: 'Accepted', count: 28, color: 'bg-green-500' },
  { label: 'Enrolled', count: 18, color: 'bg-emerald-500' },
];

const RECENT_ACTIVITY = [
  { id: '1', text: 'Sarah Johnson submitted application for Emma Johnson', time: '2 hours ago', icon: Send, color: 'bg-blue-100 text-blue-600' },
  { id: '2', text: 'Recommendation received for Lily Chen from Ms. Davis', time: '3 hours ago', icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
  { id: '3', text: 'New inquiry from Michael Chen via website', time: '5 hours ago', icon: UserPlus, color: 'bg-purple-100 text-purple-600' },
  { id: '4', text: 'Interview scheduled for Ethan Williams on Mar 8', time: '6 hours ago', icon: Calendar, color: 'bg-orange-100 text-orange-600' },
  { id: '5', text: 'Decision letter sent to Sofia Martinez family', time: 'Yesterday', icon: Mail, color: 'bg-teal-100 text-teal-600' },
  { id: '6', text: 'Transcript uploaded for Noah Thompson', time: 'Yesterday', icon: Upload, color: 'bg-indigo-100 text-indigo-600' },
  { id: '7', text: 'Application reviewed by Dr. Adams for Lily Chen', time: '2 days ago', icon: Eye, color: 'bg-yellow-100 text-yellow-600' },
  { id: '8', text: 'Contract signed by Robert Anderson family', time: '2 days ago', icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
];

const UPCOMING_DEADLINES = [
  { title: 'Round 2 Application Deadline', date: 'Mar 5, 2026', daysLeft: 7 },
  { title: 'Interview Day', date: 'Mar 8, 2026', daysLeft: 10 },
  { title: 'Open House - Upper School', date: 'Mar 15, 2026', daysLeft: 17 },
  { title: 'Decision Release', date: 'Apr 1, 2026', daysLeft: 34 },
];

export default function DashboardPage() {
  const totalPipeline = PIPELINE_STAGES.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here is an overview of your admissions pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline + Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Application Pipeline</CardTitle>
            <CardDescription>Applications by stage for the current season ({totalPipeline} total)</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Horizontal bar chart */}
            <div className="space-y-3">
              {PIPELINE_STAGES.map((stage) => (
                <div key={stage.label} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium text-right">{stage.label}</div>
                  <div className="flex-1">
                    <div className="flex h-7 items-center">
                      <div
                        className={`h-7 rounded-md ${stage.color} flex items-center justify-end pr-2.5 transition-all`}
                        style={{ width: `${(stage.count / PIPELINE_STAGES[0].count) * 100}%`, minWidth: '36px' }}
                      >
                        <span className="text-xs font-medium text-white">{stage.count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across your admissions workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_ACTIVITY.slice(0, 6).map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${activity.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Important dates and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {UPCOMING_DEADLINES.map((deadline) => (
              <div key={deadline.title} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{deadline.title}</p>
                  <p className="text-xs text-muted-foreground">{deadline.date}</p>
                </div>
                <Badge variant="outline" className="ml-auto shrink-0">
                  {deadline.daysLeft}d
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
