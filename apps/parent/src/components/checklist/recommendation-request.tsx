'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@admissions-compass/ui';
import {
  Send,
  Clock,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Mail,
  User,
} from 'lucide-react';

type RecommendationStatus = 'pending' | 'sent' | 'in_progress' | 'completed';

interface RecommendationRequest {
  id: string;
  recommender_name: string;
  recommender_email: string;
  recommender_type: string;
  status: RecommendationStatus;
  sent_at: string | null;
  last_reminder_at: string | null;
  completed_at: string | null;
}

const RECOMMENDER_TYPES = [
  { value: 'current_teacher', label: 'Current Teacher' },
  { value: 'math_teacher', label: 'Math Teacher' },
  { value: 'english_teacher', label: 'English Teacher' },
  { value: 'principal', label: 'Principal' },
  { value: 'counselor', label: 'School Counselor' },
  { value: 'personal_reference', label: 'Personal Reference' },
  { value: 'other', label: 'Other' },
];

const STATUS_CONFIG: Record<
  RecommendationStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: typeof Clock }
> = {
  pending: { label: 'Pending', variant: 'outline', icon: Clock },
  sent: { label: 'Sent', variant: 'secondary', icon: Send },
  in_progress: { label: 'In Progress', variant: 'default', icon: RefreshCw },
  completed: { label: 'Completed', variant: 'default', icon: CheckCircle2 },
};

// Mock existing requests
const MOCK_REQUESTS: RecommendationRequest[] = [
  {
    id: 'rec-001',
    recommender_name: 'Ms. Patricia Davis',
    recommender_email: 'pdavis@lincolnelementary.edu',
    recommender_type: 'current_teacher',
    status: 'completed',
    sent_at: '2026-01-15T10:00:00Z',
    last_reminder_at: null,
    completed_at: '2026-01-22T14:30:00Z',
  },
  {
    id: 'rec-002',
    recommender_name: 'Mr. Robert Kim',
    recommender_email: 'rkim@lincolnelementary.edu',
    recommender_type: 'math_teacher',
    status: 'sent',
    sent_at: '2026-02-20T09:00:00Z',
    last_reminder_at: null,
    completed_at: null,
  },
];

interface RecommendationRequestProps {
  applicationId?: string;
  studentName?: string;
}

export function RecommendationRequest({
  applicationId: _applicationId,
  studentName = 'Emma Thompson',
}: RecommendationRequestProps) {
  const [requests, setRequests] = useState<RecommendationRequest[]>(MOCK_REQUESTS);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [reminderLoadingId, setReminderLoadingId] = useState<string | null>(null);

  const canSendReminder = (request: RecommendationRequest) => {
    if (request.status === 'completed') return false;
    if (request.status === 'pending') return false;
    const lastSent = request.last_reminder_at || request.sent_at;
    if (!lastSent) return false;
    const daysSinceSent = (Date.now() - new Date(lastSent).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceSent >= 3;
  };

  const daysSinceLastSent = (request: RecommendationRequest) => {
    const lastSent = request.last_reminder_at || request.sent_at;
    if (!lastSent) return 0;
    return Math.floor((Date.now() - new Date(lastSent).getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSendRequest = async () => {
    if (!name || !email || !type) return;
    setIsSending(true);

    try {
      const response = await fetch('/api/v1/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommender_name: name,
          recommender_email: email,
          recommender_type: type,
          student_name: studentName,
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setRequests((prev) => [...prev, data]);
        setName('');
        setEmail('');
        setType('');
      }
    } catch {
      // In mock mode, add directly
      const newRequest: RecommendationRequest = {
        id: `rec-${Date.now()}`,
        recommender_name: name,
        recommender_email: email,
        recommender_type: type,
        status: 'sent',
        sent_at: new Date().toISOString(),
        last_reminder_at: null,
        completed_at: null,
      };
      setRequests((prev) => [...prev, newRequest]);
      setName('');
      setEmail('');
      setType('');
    } finally {
      setIsSending(false);
    }
  };

  const handleResendReminder = async (requestId: string) => {
    setReminderLoadingId(requestId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, last_reminder_at: new Date().toISOString() }
          : r
      )
    );
    setReminderLoadingId(null);
  };

  const getTypeLabel = (value: string) =>
    RECOMMENDER_TYPES.find((t) => t.value === value)?.label ?? value;

  return (
    <div className="space-y-6">
      {/* Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Request a Recommendation</CardTitle>
          <CardDescription>
            Send a recommendation request to a teacher, counselor, or other reference for {studentName}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rec-name">
                <User className="mr-1 inline h-3.5 w-3.5" />
                Recommender Name
              </Label>
              <Input
                id="rec-name"
                placeholder="e.g., Ms. Patricia Davis"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rec-email">
                <Mail className="mr-1 inline h-3.5 w-3.5" />
                Recommender Email
              </Label>
              <Input
                id="rec-email"
                type="email"
                placeholder="e.g., pdavis@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Recommender Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type of recommender" />
              </SelectTrigger>
              <SelectContent>
                {RECOMMENDER_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSendRequest}
            disabled={!name || !email || !type || isSending}
            className="min-h-[44px] w-full sm:w-auto"
          >
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Request
          </Button>
        </CardContent>
      </Card>

      {/* Existing Requests */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommendation Requests</CardTitle>
            <CardDescription>
              Track the status of your recommendation requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map((request) => {
              const statusConfig = STATUS_CONFIG[request.status];
              const StatusIcon = statusConfig.icon;
              const canRemind = canSendReminder(request);
              const daysSince = daysSinceLastSent(request);

              return (
                <div
                  key={request.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{request.recommender_name}</span>
                      <Badge variant={statusConfig.variant} className="text-xs">
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.recommender_email} &middot; {getTypeLabel(request.recommender_type)}
                    </p>
                    {request.sent_at && (
                      <p className="text-xs text-muted-foreground">
                        Sent {new Date(request.sent_at).toLocaleDateString()}
                        {request.completed_at &&
                          ` \u2022 Completed ${new Date(request.completed_at).toLocaleDateString()}`}
                      </p>
                    )}
                  </div>
                  {request.status !== 'completed' && request.status !== 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResendReminder(request.id)}
                      disabled={!canRemind || reminderLoadingId === request.id}
                      className="min-h-[44px] shrink-0 sm:min-h-0"
                    >
                      {reminderLoadingId === request.id ? (
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                      )}
                      {canRemind
                        ? 'Resend Reminder'
                        : `Wait ${3 - daysSince} day${3 - daysSince !== 1 ? 's' : ''}`}
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
