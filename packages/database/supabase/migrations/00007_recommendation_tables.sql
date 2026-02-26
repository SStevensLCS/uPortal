-- Migration: 00007_recommendation_tables
-- Description: Recommendation requests with secure token access

-- Recommendation requests sent to external recommenders
CREATE TABLE recommendation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  checklist_item_id UUID REFERENCES checklist_items(id) ON DELETE SET NULL,
  recommender_name TEXT NOT NULL,
  recommender_email TEXT NOT NULL,
  recommender_relationship TEXT NOT NULL CHECK (recommender_relationship IN ('teacher', 'counselor', 'coach', 'principal', 'clergy', 'family_friend', 'other')),
  secure_token UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'submitted', 'expired', 'cancelled')),
  form_definition_id UUID REFERENCES form_definitions(id),
  response_data JSONB,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index on secure token for public lookups
CREATE UNIQUE INDEX idx_recommendation_requests_token ON recommendation_requests(secure_token);
