-- Migration: 00004_application_tables
-- Description: Applications and application payments

-- Core application record
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES enrollment_seasons(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES user_profiles(id),
  application_type TEXT NOT NULL DEFAULT 'standard' CHECK (application_type IN ('standard', 'sibling', 'transfer', 'international', 're_enrollment', 'early_admission')),
  applying_for_grade TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inquiry' CHECK (status IN (
    'inquiry', 'prospect', 'started', 'submitted', 'under_review',
    'waitlisted', 'accepted', 'denied', 'deferred',
    'enrolled', 'contract_sent', 'contract_signed',
    'withdrawn', 'declined_offer'
  )),
  status_history JSONB NOT NULL DEFAULT '[]',
  lead_source TEXT,
  lead_score INTEGER DEFAULT 0,
  inquiry_date TIMESTAMPTZ,
  submitted_date TIMESTAMPTZ,
  decision TEXT,
  decision_date TIMESTAMPTZ,
  decision_released_at TIMESTAMPTZ,
  decision_letter_template_id UUID,
  financial_aid_requested BOOLEAN DEFAULT false,
  financial_aid_amount_cents INTEGER,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(school_id, season_id, student_id)
);

-- Application fee payments
CREATE TABLE application_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'waived')),
  fee_waiver_code TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
