import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@admissions-compass/ui';
import {
  Users,
  FileText,
  CheckSquare,
  TrendingUp,
} from 'lucide-react';

const STAT_CARDS = [
  {
    title: 'Total Contacts',
    value: '1,284',
    description: '+12% from last month',
    icon: Users,
  },
  {
    title: 'Active Applications',
    value: '342',
    description: '28 submitted this week',
    icon: FileText,
  },
  {
    title: 'Pending Checklists',
    value: '89',
    description: '15 completed today',
    icon: CheckSquare,
  },
  {
    title: 'Conversion Rate',
    value: '24.8%',
    description: '+2.1% from last season',
    icon: TrendingUp,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here is an overview of your admissions pipeline.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder Widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Application Pipeline</CardTitle>
            <CardDescription>
              Applications by stage for the current season.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
              Pipeline chart placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions across your admissions workflow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
              Activity feed placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
