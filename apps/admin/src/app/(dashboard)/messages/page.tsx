'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Send,
  MoreHorizontal,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  FileText,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@admissions-compass/ui';

const MESSAGE_STATS = { sent: 1247, delivered: 1198, opened: 876, clicked: 312 };

const DEMO_MESSAGES = [
  { id: '1', subject: 'Application Received Confirmation', channel: 'email', recipients: 45, status: 'sent', sentAt: 'Feb 15, 2026', openRate: '92%', type: 'automated' },
  { id: '2', subject: 'Interview Reminder', channel: 'email', recipients: 12, status: 'sent', sentAt: 'Feb 14, 2026', openRate: '100%', type: 'automated' },
  { id: '3', subject: 'Missing Document Follow-up', channel: 'email', recipients: 28, status: 'sent', sentAt: 'Feb 13, 2026', openRate: '78%', type: 'bulk' },
  { id: '4', subject: 'Open House Invitation', channel: 'email', recipients: 350, status: 'sent', sentAt: 'Feb 10, 2026', openRate: '45%', type: 'campaign' },
  { id: '5', subject: 'Deadline Reminder - Application Due', channel: 'sms', recipients: 89, status: 'delivered', sentAt: 'Feb 8, 2026', openRate: '—', type: 'bulk' },
  { id: '6', subject: 'Welcome to Admissions Compass', channel: 'email', recipients: 156, status: 'sent', sentAt: 'Feb 1, 2026', openRate: '67%', type: 'automated' },
  { id: '7', subject: 'Financial Aid Application Reminder', channel: 'email', recipients: 42, status: 'draft', sentAt: null, openRate: '—', type: 'bulk' },
];

const TEMPLATES = [
  { id: '1', name: 'Application Confirmation', category: 'Automated', lastEdited: '2 weeks ago' },
  { id: '2', name: 'Interview Scheduling', category: 'Automated', lastEdited: '1 month ago' },
  { id: '3', name: 'Decision Letter - Accept', category: 'Decision', lastEdited: '1 week ago' },
  { id: '4', name: 'Decision Letter - Waitlist', category: 'Decision', lastEdited: '1 week ago' },
  { id: '5', name: 'Decision Letter - Deny', category: 'Decision', lastEdited: '1 week ago' },
  { id: '6', name: 'Missing Document Reminder', category: 'Reminder', lastEdited: '3 days ago' },
  { id: '7', name: 'Welcome Email', category: 'Onboarding', lastEdited: '2 months ago' },
];

const CHANNEL_BADGES: Record<string, string> = {
  email: 'bg-blue-100 text-blue-700',
  sms: 'bg-purple-100 text-purple-700',
};

const STATUS_BADGES: Record<string, string> = {
  sent: 'bg-green-100 text-green-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-gray-100 text-gray-700',
  failed: 'bg-red-100 text-red-700',
};

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Send and manage communications with families.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4" />Templates</Button>
          <Button size="sm"><Plus className="mr-2 h-4 w-4" />New Message</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Sent', value: MESSAGE_STATS.sent.toLocaleString(), icon: Send, color: 'bg-blue-100 text-blue-600' },
          { label: 'Delivered', value: MESSAGE_STATS.delivered.toLocaleString(), icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
          { label: 'Opened', value: MESSAGE_STATS.opened.toLocaleString(), icon: Mail, color: 'bg-purple-100 text-purple-600' },
          { label: 'Clicked', value: MESSAGE_STATS.clicked.toLocaleString(), icon: MessageSquare, color: 'bg-orange-100 text-orange-600' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color.split(' ')[0]}`}>
                  <s.icon className={`h-5 w-5 ${s.color.split(' ')[1]}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="sent">
        <TabsList>
          <TabsTrigger value="sent">Sent Messages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="sent" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="search" placeholder="Search messages..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" />Filter</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Subject</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEMO_MESSAGES.filter((m) => searchQuery === '' || m.subject.toLowerCase().includes(searchQuery.toLowerCase())).map((msg) => (
                    <TableRow key={msg.id} className="cursor-pointer">
                      <TableCell className="font-medium">{msg.subject}</TableCell>
                      <TableCell><Badge variant="secondary" className={CHANNEL_BADGES[msg.channel] || ''}>{msg.channel.toUpperCase()}</Badge></TableCell>
                      <TableCell className="text-sm capitalize">{msg.type}</TableCell>
                      <TableCell className="text-sm">{msg.recipients}</TableCell>
                      <TableCell><Badge variant="secondary" className={STATUS_BADGES[msg.status] || ''}>{msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}</Badge></TableCell>
                      <TableCell className="text-sm">{msg.openRate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{msg.sentAt || '—'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>View Recipients</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Message Templates</CardTitle>
                  <CardDescription>Reusable email and SMS templates with merge fields</CardDescription>
                </div>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" />New Template</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Edited</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TEMPLATES.map((t) => (
                    <TableRow key={t.id} className="cursor-pointer">
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.lastEdited}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Preview</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
