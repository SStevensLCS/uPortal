'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@admissions-compass/ui';
import {
  Send,
  MoreHorizontal,
  Eye,
  Ban,
  Download,
  FileText,
  RefreshCw,
  Filter,
} from 'lucide-react';

type ContractStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'signed_primary'
  | 'signed_both'
  | 'completed'
  | 'voided';

interface Contract {
  id: string;
  studentName: string;
  grade: string;
  tuition: number;
  financialAid: number;
  netTuition: number;
  status: ContractStatus;
  primarySigner: {
    name: string;
    signedAt: string | null;
  };
  secondarySigner: {
    name: string;
    signedAt: string | null;
  } | null;
  depositPaid: boolean;
  depositAmount: number;
  paymentPlan: string;
  createdAt: string;
  sentAt: string | null;
}

const STATUS_CONFIG: Record<
  ContractStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; className: string }
> = {
  draft: { label: 'Draft', variant: 'outline', className: 'text-gray-600 border-gray-300' },
  sent: { label: 'Sent', variant: 'secondary', className: 'bg-blue-100 text-blue-700' },
  viewed: { label: 'Viewed', variant: 'secondary', className: 'bg-purple-100 text-purple-700' },
  signed_primary: { label: 'Signed (1)', variant: 'secondary', className: 'bg-amber-100 text-amber-700' },
  signed_both: { label: 'Signed (Both)', variant: 'secondary', className: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', variant: 'default', className: 'bg-green-600 text-white' },
  voided: { label: 'Voided', variant: 'destructive', className: '' },
};

const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'contract-001',
    studentName: 'Emma Chen',
    grade: 'K',
    tuition: 28500,
    financialAid: 5000,
    netTuition: 23500,
    status: 'completed',
    primarySigner: { name: 'Lisa Chen', signedAt: '2026-01-15T10:30:00Z' },
    secondarySigner: { name: 'Wei Chen', signedAt: '2026-01-15T14:22:00Z' },
    depositPaid: true,
    depositAmount: 2500,
    paymentPlan: 'monthly_10',
    createdAt: '2026-01-10T09:00:00Z',
    sentAt: '2026-01-10T09:05:00Z',
  },
  {
    id: 'contract-002',
    studentName: 'Marcus Williams',
    grade: '3',
    tuition: 30000,
    financialAid: 0,
    netTuition: 30000,
    status: 'signed_primary',
    primarySigner: { name: 'David Williams', signedAt: '2026-02-01T16:45:00Z' },
    secondarySigner: { name: 'Karen Williams', signedAt: null },
    depositPaid: false,
    depositAmount: 2500,
    paymentPlan: 'semi_annual',
    createdAt: '2026-01-28T11:00:00Z',
    sentAt: '2026-01-28T11:10:00Z',
  },
  {
    id: 'contract-003',
    studentName: 'Sofia Rodriguez',
    grade: '5',
    tuition: 31500,
    financialAid: 12000,
    netTuition: 19500,
    status: 'viewed',
    primarySigner: { name: 'Maria Rodriguez', signedAt: null },
    secondarySigner: null,
    depositPaid: false,
    depositAmount: 2500,
    paymentPlan: 'monthly_10',
    createdAt: '2026-02-05T08:30:00Z',
    sentAt: '2026-02-05T08:35:00Z',
  },
  {
    id: 'contract-004',
    studentName: 'Aiden Patel',
    grade: '1',
    tuition: 28500,
    financialAid: 8000,
    netTuition: 20500,
    status: 'sent',
    primarySigner: { name: 'Priya Patel', signedAt: null },
    secondarySigner: { name: 'Raj Patel', signedAt: null },
    depositPaid: false,
    depositAmount: 2500,
    paymentPlan: 'quarterly',
    createdAt: '2026-02-10T14:00:00Z',
    sentAt: '2026-02-10T14:05:00Z',
  },
  {
    id: 'contract-005',
    studentName: 'Olivia Thompson',
    grade: '7',
    tuition: 33000,
    financialAid: 0,
    netTuition: 33000,
    status: 'draft',
    primarySigner: { name: 'James Thompson', signedAt: null },
    secondarySigner: { name: 'Sarah Thompson', signedAt: null },
    depositPaid: false,
    depositAmount: 2500,
    paymentPlan: 'annual',
    createdAt: '2026-02-20T10:00:00Z',
    sentAt: null,
  },
  {
    id: 'contract-006',
    studentName: 'Liam O\'Brien',
    grade: '2',
    tuition: 29000,
    financialAid: 3000,
    netTuition: 26000,
    status: 'signed_both',
    primarySigner: { name: 'Sean O\'Brien', signedAt: '2026-02-12T09:15:00Z' },
    secondarySigner: { name: 'Erin O\'Brien', signedAt: '2026-02-13T11:00:00Z' },
    depositPaid: false,
    depositAmount: 2500,
    paymentPlan: 'monthly_12',
    createdAt: '2026-02-08T13:00:00Z',
    sentAt: '2026-02-08T13:10:00Z',
  },
  {
    id: 'contract-007',
    studentName: 'Zoe Kim',
    grade: '6',
    tuition: 32000,
    financialAid: 0,
    netTuition: 32000,
    status: 'voided',
    primarySigner: { name: 'Jin Kim', signedAt: null },
    secondarySigner: null,
    depositPaid: false,
    depositAmount: 2500,
    paymentPlan: 'quarterly',
    createdAt: '2026-01-20T09:00:00Z',
    sentAt: '2026-01-20T09:05:00Z',
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ContractTracker() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredContracts = useMemo(() => {
    if (statusFilter === 'all') return MOCK_CONTRACTS;
    return MOCK_CONTRACTS.filter((c) => c.status === statusFilter);
  }, [statusFilter]);

  const allSelected =
    filteredContracts.length > 0 &&
    filteredContracts.every((c) => selectedIds.includes(c.id));

  function handleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredContracts.map((c) => c.id));
    }
  }

  function handleToggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_CONTRACTS.length };
    for (const c of MOCK_CONTRACTS) {
      counts[c.status] = (counts[c.status] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Tracker
            </CardTitle>
            <CardDescription>
              Track contract status from draft to completion.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Statuses ({statusCounts.all})
                </SelectItem>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label} ({statusCounts[key] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 mt-2">
            <span className="text-sm font-medium">
              {selectedIds.length} selected
            </span>
            <Button size="sm" variant="outline">
              <Send className="mr-2 h-3 w-3" />
              Send Contracts
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
              <Ban className="mr-2 h-3 w-3" />
              Void Contracts
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Tuition</TableHead>
                <TableHead className="text-right">Aid</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Primary Signer</TableHead>
                <TableHead>Secondary Signer</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => {
                const statusConf = STATUS_CONFIG[contract.status];
                return (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(contract.id)}
                        onCheckedChange={() => handleToggle(contract.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {contract.studentName}
                    </TableCell>
                    <TableCell>{contract.grade}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(contract.tuition)}
                    </TableCell>
                    <TableCell className="text-right">
                      {contract.financialAid > 0 ? (
                        <span className="text-green-600">
                          -{formatCurrency(contract.financialAid)}
                        </span>
                      ) : (
                        '--'
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(contract.netTuition)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusConf.variant}
                        className={statusConf.className}
                      >
                        {statusConf.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-sm">{contract.primarySigner.name}</p>
                        {contract.primarySigner.signedAt ? (
                          <p className="text-xs text-green-600">
                            Signed {formatDate(contract.primarySigner.signedAt)}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Not signed
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.secondarySigner ? (
                        <div className="space-y-0.5">
                          <p className="text-sm">
                            {contract.secondarySigner.name}
                          </p>
                          {contract.secondarySigner.signedAt ? (
                            <p className="text-xs text-green-600">
                              Signed{' '}
                              {formatDate(contract.secondarySigner.signedAt)}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Not signed
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          N/A
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contract.depositPaid ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700"
                        >
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Contract
                          </DropdownMenuItem>
                          {contract.status === 'draft' && (
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send Contract
                            </DropdownMenuItem>
                          )}
                          {contract.status === 'sent' && (
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Resend Contract
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {contract.status !== 'voided' &&
                            contract.status !== 'completed' && (
                              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Ban className="mr-2 h-4 w-4" />
                                Void Contract
                              </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredContracts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No contracts found matching the selected filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
