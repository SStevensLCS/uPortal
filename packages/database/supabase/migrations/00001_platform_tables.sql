-- Migration: 00001_platform_tables
-- Description: Core platform tables - schools, school groups, enrollment seasons

-- Schools on the platform
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  address JSONB,
  phone TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  currency TEXT NOT NULL DEFAULT 'USD',
  school_type TEXT NOT NULL CHECK (school_type IN ('day', 'boarding', 'day_boarding', 'charter', 'religious', 'montessori', 'other')),
  grade_levels JSONB NOT NULL,
  divisions JSONB,
  settings JSONB NOT NULL DEFAULT '{}',
  subscription_tier TEXT NOT NULL DEFAULT 'standard',
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- School groups for multi-school management
CREATE TABLE school_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many relationship between school groups and schools
CREATE TABLE school_group_members (
  school_group_id UUID REFERENCES school_groups(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  PRIMARY KEY (school_group_id, school_id)
);

-- Enrollment seasons (admission cycles)
CREATE TABLE enrollment_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
