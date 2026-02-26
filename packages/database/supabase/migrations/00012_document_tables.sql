-- Migration: 00012_document_tables
-- Description: Document storage metadata for uploaded files

-- Documents uploaded by families or staff
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  checklist_item_id UUID REFERENCES checklist_items(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES user_profiles(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'documents',
  document_type TEXT NOT NULL CHECK (document_type IN (
    'transcript', 'report_card', 'test_score', 'recommendation',
    'birth_certificate', 'immunization', 'photo', 'financial',
    'iep', 'evaluation', 'essay', 'other'
  )),
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'verified', 'rejected')),
  verified_by UUID REFERENCES school_staff(id),
  verified_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
