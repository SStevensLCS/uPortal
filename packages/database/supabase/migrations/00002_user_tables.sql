-- Migration: 00002_user_tables
-- Description: User profiles, school staff, households, household members

-- User profiles linked to Supabase auth
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'parent', 'super_admin')),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff members at a school with role-based access
CREATE TABLE school_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('system_admin', 'admin', 'user', 'limited_user', 'reviewer')),
  permissions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, user_id)
);

-- Households group parents/guardians together
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_address JSONB,
  secondary_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members of a household (parents/guardians)
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL CHECK (relationship IN ('parent', 'guardian', 'step_parent', 'grandparent', 'other')),
  is_primary_contact BOOLEAN DEFAULT false,
  is_financial_contact BOOLEAN DEFAULT false,
  employer TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
