-- Migration: 00013_waitlist_tables
-- Description: Waitlist management for applications

-- Waitlist entries for waitlisted applications
CREATE TABLE waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES enrollment_seasons(id) ON DELETE CASCADE,
  grade TEXT NOT NULL,
  position INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'offered', 'accepted', 'declined', 'expired', 'removed')),
  offered_at TIMESTAMPTZ,
  response_deadline TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, season_id, grade, position)
);
