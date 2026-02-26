import { MessageCircle, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  Badge,
  Input,
} from '@admissions-compass/ui';

const PLACEHOLDER_MESSAGES = [
  {
    id: '1',
    sender: 'Lincoln Academy Admissions',
    subject: 'Application Received - Confirmation',
    preview:
      'Thank you for submitting your application. We have received all required documents and will...',
    timestamp: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    sender: 'Westfield Prep - Mrs. Thompson',
    subject: 'Interview Schedule Confirmation',
    preview:
      'Dear Sarah, this email confirms your interview appointment scheduled for March 8th at 2:00 PM...',
    timestamp: 'Yesterday',
    unread: true,
  },
  {
    id: '3',
    sender: 'Oak Hill School',
    subject: 'Missing Document Reminder',
    preview:
      'We noticed that the academic transcript has not been uploaded yet. Please submit this document...',
    timestamp: '2 days ago',
    unread: false,
  },
  {
    id: '4',
    sender: 'Admissions Compass Support',
    subject: 'Welcome to Admissions Compass!',
    preview:
      'Welcome to your admissions portal! Here are some tips to get started with your applications...',
    timestamp: '1 week ago',
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Communications from schools and the admissions team.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search messages..."
          className="min-h-[44px] pl-10"
        />
      </div>

      {/* Message list */}
      <div className="space-y-2">
        {PLACEHOLDER_MESSAGES.map((message) => (
          <Card
            key={message.id}
            className={`cursor-pointer transition-shadow hover:shadow-md ${
              message.unread ? 'border-primary/30 bg-primary/[0.02]' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm ${
                        message.unread ? 'font-bold' : 'font-medium'
                      } text-foreground`}
                    >
                      {message.sender}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <p
                    className={`mt-0.5 text-sm ${
                      message.unread ? 'font-semibold' : ''
                    } text-foreground`}
                  >
                    {message.subject}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {message.preview}
                  </p>
                </div>
                {message.unread && (
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
