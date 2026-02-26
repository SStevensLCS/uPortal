'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Badge,
  Separator,
} from '@admissions-compass/ui';
import { FileSignature, DollarSign, Users, Loader2 } from 'lucide-react';

interface AcceptedStudent {
  id: string;
  studentName: string;
  grade: string;
  parentName: string;
  parentEmail: string;
  baseTuition: number;
}

const MOCK_ACCEPTED_STUDENTS: AcceptedStudent[] = [
  {
    id: 'app-001',
    studentName: 'Emma Chen',
    grade: 'K',
    parentName: 'Lisa Chen',
    parentEmail: 'lisa.chen@email.com',
    baseTuition: 28500,
  },
  {
    id: 'app-002',
    studentName: 'Marcus Williams',
    grade: '3',
    parentName: 'David Williams',
    parentEmail: 'd.williams@email.com',
    baseTuition: 30000,
  },
  {
    id: 'app-003',
    studentName: 'Sofia Rodriguez',
    grade: '5',
    parentName: 'Maria Rodriguez',
    parentEmail: 'm.rodriguez@email.com',
    baseTuition: 31500,
  },
  {
    id: 'app-004',
    studentName: 'Aiden Patel',
    grade: '1',
    parentName: 'Priya Patel',
    parentEmail: 'priya.patel@email.com',
    baseTuition: 28500,
  },
  {
    id: 'app-005',
    studentName: 'Olivia Thompson',
    grade: '7',
    parentName: 'James Thompson',
    parentEmail: 'j.thompson@email.com',
    baseTuition: 33000,
  },
];

const CONTRACT_TEMPLATES = [
  { id: 'standard', label: 'Standard Enrollment Agreement' },
  { id: 'financial_aid', label: 'Financial Aid Enrollment Agreement' },
  { id: 'international', label: 'International Student Agreement' },
  { id: 'sibling', label: 'Sibling Enrollment Agreement' },
];

const PAYMENT_PLANS = [
  { id: 'annual', label: 'Annual (1 payment)', discount: '3% discount' },
  { id: 'semi_annual', label: 'Semi-Annual (2 payments)', discount: '1.5% discount' },
  { id: 'quarterly', label: 'Quarterly (4 payments)', discount: '' },
  { id: 'monthly_10', label: 'Monthly - 10 payments', discount: '' },
  { id: 'monthly_12', label: 'Monthly - 12 payments', discount: '' },
];

export function ContractGenerator({ onGenerated }: { onGenerated?: () => void }) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [tuitionAmount, setTuitionAmount] = useState('');
  const [aidAmount, setAidAmount] = useState('0');
  const [depositAmount, setDepositAmount] = useState('2500');
  const [template, setTemplate] = useState('standard');
  const [paymentPlan, setPaymentPlan] = useState('monthly_10');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedStudentData = useMemo(
    () => MOCK_ACCEPTED_STUDENTS.filter((s) => selectedStudents.includes(s.id)),
    [selectedStudents]
  );

  const netTuition = useMemo(() => {
    const tuition = parseFloat(tuitionAmount) || 0;
    const aid = parseFloat(aidAmount) || 0;
    return Math.max(0, tuition - aid);
  }, [tuitionAmount, aidAmount]);

  function handleStudentToggle(studentId: string) {
    setSelectedStudents((prev) => {
      const newSelected = prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId];

      // Auto-fill tuition from first selected student
      if (newSelected.length === 1) {
        const student = MOCK_ACCEPTED_STUDENTS.find((s) => s.id === newSelected[0]);
        if (student) {
          setTuitionAmount(student.baseTuition.toString());
        }
      }

      return newSelected;
    });
  }

  function handleSelectAll() {
    if (selectedStudents.length === MOCK_ACCEPTED_STUDENTS.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(MOCK_ACCEPTED_STUDENTS.map((s) => s.id));
    }
  }

  async function handleGenerate() {
    if (selectedStudents.length === 0) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/v1/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_ids: selectedStudents,
          tuition_amount: parseFloat(tuitionAmount),
          financial_aid_amount: parseFloat(aidAmount) || 0,
          deposit_amount: parseFloat(depositAmount),
          template_id: template,
          payment_plan: paymentPlan,
        }),
      });

      if (response.ok) {
        setSelectedStudents([]);
        setTuitionAmount('');
        setAidAmount('0');
        onGenerated?.();
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSignature className="h-5 w-5" />
          Generate Contracts
        </CardTitle>
        <CardDescription>
          Create enrollment contracts for accepted students. Select students,
          configure terms, and generate individually or in bulk.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Student Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Select Students</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs"
            >
              {selectedStudents.length === MOCK_ACCEPTED_STUDENTS.length
                ? 'Deselect All'
                : 'Select All'}
            </Button>
          </div>
          <div className="space-y-2 rounded-lg border p-3 max-h-[240px] overflow-y-auto">
            {MOCK_ACCEPTED_STUDENTS.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 rounded-md p-2 cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  onCheckedChange={() => handleStudentToggle(student.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{student.studentName}</p>
                  <p className="text-xs text-muted-foreground">
                    {student.parentName} &middot; {student.parentEmail}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  Grade {student.grade}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground shrink-0">
                  ${student.baseTuition.toLocaleString()}
                </span>
              </label>
            ))}
          </div>
          {selectedStudents.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <Users className="inline h-3 w-3 mr-1" />
              {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <Separator />

        {/* Financial Details */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Financial Details</Label>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="tuition" className="text-xs text-muted-foreground">
                Tuition Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="tuition"
                  type="number"
                  placeholder="0.00"
                  value={tuitionAmount}
                  onChange={(e) => setTuitionAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aid" className="text-xs text-muted-foreground">
                Financial Aid
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="aid"
                  type="number"
                  placeholder="0.00"
                  value={aidAmount}
                  onChange={(e) => setAidAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Net Tuition
              </Label>
              <div className="flex h-10 items-center rounded-md border bg-muted/50 px-3">
                <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-sm font-semibold text-green-700">
                  {netTuition.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit" className="text-xs text-muted-foreground">
              Deposit Amount
            </Label>
            <div className="relative max-w-[200px]">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="deposit"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Contract Configuration */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Contract Template
            </Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Payment Plan
            </Label>
            <Select value={paymentPlan} onValueChange={setPaymentPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment plan" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_PLANS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span>{p.label}</span>
                    {p.discount && (
                      <span className="ml-2 text-xs text-green-600">
                        ({p.discount})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        {selectedStudents.length > 0 && (
          <>
            <Separator />
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-semibold">Contract Summary</p>
              <div className="grid gap-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Students:</span>
                  <span className="font-medium text-foreground">
                    {selectedStudents.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net Tuition (each):</span>
                  <span className="font-medium text-foreground">
                    ${netTuition.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Deposit (each):</span>
                  <span className="font-medium text-foreground">
                    ${parseFloat(depositAmount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Template:</span>
                  <span className="font-medium text-foreground">
                    {CONTRACT_TEMPLATES.find((t) => t.id === template)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Plan:</span>
                  <span className="font-medium text-foreground">
                    {PAYMENT_PLANS.find((p) => p.id === paymentPlan)?.label}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleGenerate}
            disabled={selectedStudents.length === 0 || !tuitionAmount || isGenerating}
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <FileSignature className="mr-2 h-4 w-4" />
            {selectedStudents.length > 1
              ? `Generate ${selectedStudents.length} Contracts`
              : 'Generate Contract'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
