'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
} from '@admissions-compass/ui';

const CHECKLIST_ITEMS = [
  {
    id: '1',
    title: 'Complete student profile',
    description: 'Fill out all required student information fields.',
    completed: true,
  },
  {
    id: '2',
    title: 'Upload birth certificate',
    description: 'A certified copy of the student birth certificate.',
    completed: true,
  },
  {
    id: '3',
    title: 'Submit immunization records',
    description: 'Current immunization records from your pediatrician.',
    completed: true,
  },
  {
    id: '4',
    title: 'Request recommendation letter',
    description: 'One recommendation from a current teacher.',
    completed: true,
  },
  {
    id: '5',
    title: 'Upload academic transcript',
    description: 'Official transcript from current school.',
    completed: false,
  },
  {
    id: '6',
    title: 'Schedule campus tour',
    description: 'Book a campus visit at your preferred school.',
    completed: false,
  },
  {
    id: '7',
    title: 'Submit application fee',
    description: 'Pay the non-refundable application fee.',
    completed: false,
  },
];

export default function ChecklistPage() {
  const completedCount = CHECKLIST_ITEMS.filter((i) => i.completed).length;
  const progressValue = Math.round(
    (completedCount / CHECKLIST_ITEMS.length) * 100
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Application Checklist
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete all items to finalize your application.
        </p>
      </div>

      {/* Progress summary */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {completedCount} of {CHECKLIST_ITEMS.length} completed
            </span>
            <span className="text-sm font-semibold text-primary">
              {progressValue}%
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </CardContent>
      </Card>

      {/* Checklist items */}
      <div className="space-y-2">
        {CHECKLIST_ITEMS.map((item) => (
          <Card
            key={item.id}
            className={`transition-shadow hover:shadow-sm ${
              item.completed ? 'opacity-75' : ''
            }`}
          >
            <CardContent className="flex items-start gap-3 p-4">
              <button
                type="button"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center"
                aria-label={
                  item.completed
                    ? `${item.title} - completed`
                    : `${item.title} - not completed`
                }
              >
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    item.completed
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {!item.completed && (
                <Badge variant="outline" className="shrink-0 text-xs">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
