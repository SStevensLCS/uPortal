-- Migration: 00003_student_tables
-- Description: Students and sibling relationships

-- Student records belong to a household
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  photo_url TEXT,
  current_school TEXT,
  current_grade TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sibling links between students (bidirectional)
CREATE TABLE sibling_links (
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  sibling_id UUID REFERENCES students(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, sibling_id),
  CHECK (student_id <> sibling_id)
);
