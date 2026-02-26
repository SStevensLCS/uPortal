-- Migration: 00010_contract_tables
-- Description: Enrollment contracts and tuition payments

-- Enrollment contracts sent to accepted families
CREATE TABLE enrollment_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  template_url TEXT,
  contract_url TEXT,
  tuition_amount_cents INTEGER NOT NULL,
  financial_aid_amount_cents INTEGER DEFAULT 0,
  net_tuition_cents INTEGER GENERATED ALWAYS AS (tuition_amount_cents - COALESCE(financial_aid_amount_cents, 0)) STORED,
  deposit_amount_cents INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'countersigned', 'voided', 'expired')),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signed_by UUID REFERENCES user_profiles(id),
  countersigned_at TIMESTAMPTZ,
  countersigned_by UUID REFERENCES school_staff(id),
  expires_at TIMESTAMPTZ,
  signature_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tuition and deposit payments
CREATE TABLE tuition_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES enrollment_contracts(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'tuition', 'fee', 'refund')),
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
