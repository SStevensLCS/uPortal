'use client';

import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@admissions-compass/ui';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const UPCOMING_EVENTS = [
  { id: '1', title: 'Open House - Lower School', date: 'Mar 1, 2026', time: '9:00 AM - 12:00 PM', location: 'Main Campus', type: 'open_house', capacity: 50, registered: 38 },
  { id: '2', title: 'Campus Tour Group A', date: 'Mar 3, 2026', time: '10:00 AM', location: 'Main Campus', type: 'tour', capacity: 15, registered: 12 },
  { id: '3', title: 'Application Deadline - Round 2', date: 'Mar 5, 2026', time: '11:59 PM', location: 'Online', type: 'deadline', capacity: null, registered: null },
  { id: '4', title: 'Interview Day', date: 'Mar 8, 2026', time: '9:00 AM - 4:00 PM', location: 'Admin Building', type: 'interview', capacity: 20, registered: 16 },
  { id: '5', title: 'Campus Tour Group B', date: 'Mar 10, 2026', time: '2:00 PM', location: 'Main Campus', type: 'tour', capacity: 15, registered: 8 },
  { id: '6', title: 'Open House - Upper School', date: 'Mar 15, 2026', time: '10:00 AM - 1:00 PM', location: 'Main Campus', type: 'open_house', capacity: 40, registered: 22 },
  { id: '7', title: 'Financial Aid Workshop', date: 'Mar 20, 2026', time: '6:00 PM', location: 'Virtual (Zoom)', type: 'workshop', capacity: 100, registered: 45 },
  { id: '8', title: 'Decision Release Date', date: 'Apr 1, 2026', time: '5:00 PM', location: 'Online Portal', type: 'deadline', capacity: null, registered: null },
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  open_house: 'bg-green-100 text-green-700',
  tour: 'bg-blue-100 text-blue-700',
  interview: 'bg-purple-100 text-purple-700',
  deadline: 'bg-red-100 text-red-700',
  workshop: 'bg-orange-100 text-orange-700',
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  open_house: 'Open House',
  tour: 'Tour',
  interview: 'Interview',
  deadline: 'Deadline',
  workshop: 'Workshop',
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Manage admissions events, tours, interviews, and deadlines.</p>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Event</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Upcoming Events', value: '12', color: 'bg-blue-100 text-blue-600' },
          { label: 'This Week', value: '3', color: 'bg-green-100 text-green-600' },
          { label: 'Open Registrations', value: '5', color: 'bg-purple-100 text-purple-600' },
          { label: 'Total RSVPs', value: '141', color: 'bg-orange-100 text-orange-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Upcoming Events</CardTitle>
              <CardDescription>All scheduled events and deadlines</CardDescription>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="open_house">Open House</SelectItem>
                <SelectItem value="tour">Tours</SelectItem>
                <SelectItem value="interview">Interviews</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
                <SelectItem value="workshop">Workshops</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map((event) => (
              <div key={event.id} className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.date} at {event.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                        {event.capacity && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />{event.registered}/{event.capacity} registered
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={EVENT_TYPE_COLORS[event.type] || ''}>
                        {EVENT_TYPE_LABELS[event.type] || event.type}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Event</DropdownMenuItem>
                          <DropdownMenuItem>View Registrations</DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem>Cancel Event</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
