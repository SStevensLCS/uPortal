import { CreditCard, DollarSign, Receipt, CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Separator,
} from '@admissions-compass/ui';

const PAYMENT_HISTORY = [
  {
    id: '1',
    description: 'Application Fee - Lincoln Academy',
    amount: '$75.00',
    date: 'Jan 10, 2026',
    status: 'Paid',
  },
  {
    id: '2',
    description: 'Application Fee - Westfield Prep',
    amount: '$100.00',
    date: 'Jan 22, 2026',
    status: 'Paid',
  },
  {
    id: '3',
    description: 'Application Fee - Oak Hill School',
    amount: '$50.00',
    date: 'Pending',
    status: 'Unpaid',
  },
];

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Billing & Payments
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage application fees and payment history.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Paid</p>
              <p className="text-lg font-bold">$175.00</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
              <Receipt className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="text-lg font-bold">$50.00</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Method</p>
              <p className="text-sm font-medium">Visa ****4242</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment History</CardTitle>
          <CardDescription>
            All application fees and transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <div className="space-y-3">
            {PAYMENT_HISTORY.map((payment, index) => (
              <div key={payment.id}>
                <div className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {payment.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payment.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {payment.amount}
                    </span>
                    <Badge
                      variant={
                        payment.status === 'Paid' ? 'secondary' : 'outline'
                      }
                      className={
                        payment.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'text-orange-600 border-orange-200'
                      }
                    >
                      {payment.status === 'Paid' && (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      )}
                      {payment.status}
                    </Badge>
                  </div>
                </div>
                {index < PAYMENT_HISTORY.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pay now CTA for outstanding */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="flex flex-col items-center gap-3 p-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">
              Outstanding Balance: $50.00
            </p>
            <p className="text-sm text-muted-foreground">
              Application fee for Oak Hill School
            </p>
          </div>
          <Button className="min-h-[44px] w-full sm:w-auto">
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
