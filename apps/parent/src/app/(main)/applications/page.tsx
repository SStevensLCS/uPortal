import { FileText, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@admissions-compass/ui';

const PLACEHOLDER_APPLICATIONS = [
  {
    id: '1',
    schoolName: 'Lincoln Academy',
    status: 'Submitted',
    deadline: 'Jan 15, 2026',
    statusColor: 'bg-green-100 text-green-700',
  },
  {
    id: '2',
    schoolName: 'Westfield Preparatory',
    status: 'In Progress',
    deadline: 'Feb 1, 2026',
    statusColor: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: '3',
    schoolName: 'Oak Hill School',
    status: 'Not Started',
    deadline: 'Mar 1, 2026',
    statusColor: 'bg-gray-100 text-gray-700',
  },
];

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage all school applications in one place.
          </p>
        </div>
        <Button className="min-h-[44px] w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <div className="space-y-3">
        {PLACEHOLDER_APPLICATIONS.map((app) => (
          <Card key={app.id} className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-4 md:p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">
                  {app.schoolName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Deadline: {app.deadline}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={`shrink-0 ${app.statusColor}`}
              >
                {app.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
