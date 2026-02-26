-- Migration: 00006_form_tables
-- Description: Dynamic form definitions and submissions

-- Form definitions (JSON Schema-based form builder)
CREATE TABLE form_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  form_type TEXT NOT NULL CHECK (form_type IN ('inquiry', 'application', 'supplemental', 'parent_questionnaire', 'student_questionnaire', 'financial_aid', 'custom')),
  schema JSONB NOT NULL,
  ui_schema JSONB,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submitted form data linked to an application
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_definition_id UUID NOT NULL REFERENCES form_definitions(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES user_profiles(id),
  data JSONB NOT NULL DEFAULT '{}',
  is_complete BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
