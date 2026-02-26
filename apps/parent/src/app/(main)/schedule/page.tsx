import { Calendar, Clock, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@admissions-compass/ui';

const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'Campus Tour - Westfield Prep',
    date: 'Mar 5, 2026',
    time: '10:00 AM',
    location: '123 Westfield Ave',
    type: 'Tour',
  },
  {
    id: '2',
    title: 'Admissions Interview - Lincoln Academy',
    date: 'Mar 8, 2026',
    time: '2:00 PM',
    location: 'Virtual (Zoom)',
    type: 'Interview',
  },
  {
    id: '3',
    title: 'Open House - Oak Hill School',
    date: 'Mar 15, 2026',
    time: '9:00 AM - 12:00 PM',
    location: '456 Oak Hill Road',
    type: 'Open House',
  },
  {
    id: '4',
    title: 'Application Deadline - Westfield Prep',
    date: 'Apr 1, 2026',
    time: '11:59 PM',
    location: 'Online submission',
    type: 'Deadline',
  },
];

function getEventBadgeColor(type: string) {
  switch (type) {
    case 'Tour':
      return 'bg-blue-100 text-blue-700';
    case 'Interview':
      return 'bg-purple-100 text-purple-700';
    case 'Open House':
      return 'bg-green-100 text-green-700';
    case 'Deadline':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export default function SchedulePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Upcoming Events
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tours, interviews, open houses, and important deadlines.
        </p>
      </div>

      <div className="space-y-3">
        {UPCOMING_EVENTS.map((event) => (
          <Card key={event.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-semibold text-foreground">
                      {event.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`w-fit shrink-0 ${getEventBadgeColor(event.type)}`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.date} at {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
