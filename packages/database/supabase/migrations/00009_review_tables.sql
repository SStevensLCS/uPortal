-- Migration: 00009_review_tables
-- Description: Review rubrics, application reviews, and decision letter templates

-- Review rubrics define scoring criteria
CREATE TABLE review_rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL DEFAULT '[]',
  max_score INTEGER NOT NULL DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual reviews of an application by staff members
CREATE TABLE application_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES school_staff(id) ON DELETE CASCADE,
  rubric_id UUID REFERENCES review_rubrics(id) ON DELETE SET NULL,
  scores JSONB NOT NULL DEFAULT '{}',
  total_score NUMERIC(6, 2),
  recommendation TEXT CHECK (recommendation IN ('strong_accept', 'accept', 'borderline', 'deny', 'waitlist')),
  comments TEXT,
  is_complete BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, reviewer_id)
);

-- Decision letter templates
CREATE TABLE decision_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  decision_type TEXT NOT NULL CHECK (decision_type IN ('accepted', 'denied', 'waitlisted', 'deferred')),
  subject TEXT NOT NULL,
  body_template TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
