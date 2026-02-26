-- Seed data for development
-- Creates a demo school with enrollment season and basic configuration

-- ============================================================================
-- Demo School: Oakridge Academy
-- ============================================================================
INSERT INTO schools (
  id,
  name,
  slug,
  logo_url,
  website_url,
  address,
  phone,
  timezone,
  currency,
  school_type,
  grade_levels,
  divisions,
  settings,
  subscription_tier
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Oakridge Academy',
  'oakridge-academy',
  NULL,
  'https://www.oakridgeacademy.example.com',
  '{"street": "123 Academy Lane", "city": "Springfield", "state": "MA", "zip": "01103", "country": "US"}'::JSONB,
  '(413) 555-0100',
  'America/New_York',
  'USD',
  'day',
  '[
    {"code": "PK3", "name": "Pre-K 3", "sort_order": 1},
    {"code": "PK4", "name": "Pre-K 4", "sort_order": 2},
    {"code": "K", "name": "Kindergarten", "sort_order": 3},
    {"code": "1", "name": "1st Grade", "sort_order": 4},
    {"code": "2", "name": "2nd Grade", "sort_order": 5},
    {"code": "3", "name": "3rd Grade", "sort_order": 6},
    {"code": "4", "name": "4th Grade", "sort_order": 7},
    {"code": "5", "name": "5th Grade", "sort_order": 8},
    {"code": "6", "name": "6th Grade", "sort_order": 9},
    {"code": "7", "name": "7th Grade", "sort_order": 10},
    {"code": "8", "name": "8th Grade", "sort_order": 11},
    {"code": "9", "name": "9th Grade", "sort_order": 12},
    {"code": "10", "name": "10th Grade", "sort_order": 13},
    {"code": "11", "name": "11th Grade", "sort_order": 14},
    {"code": "12", "name": "12th Grade", "sort_order": 15}
  ]'::JSONB,
  '[
    {"name": "Lower School", "grades": ["PK3", "PK4", "K", "1", "2", "3", "4", "5"]},
    {"name": "Upper School", "grades": ["6", "7", "8", "9", "10", "11", "12"]}
  ]'::JSONB,
  '{
    "application_fee_cents": 7500,
    "allow_sibling_discount": true,
    "sibling_discount_percent": 10,
    "require_recommendation": true,
    "require_interview": true,
    "require_tour": false,
    "enable_financial_aid": true,
    "enable_waitlist": true,
    "decision_release_mode": "batch",
    "portal_welcome_message": "Welcome to Oakridge Academy! We look forward to learning more about your family."
  }'::JSONB,
  'standard'
);

-- ============================================================================
-- Enrollment Season: 2026-2027
-- ============================================================================
INSERT INTO enrollment_seasons (
  id,
  school_id,
  name,
  start_date,
  end_date,
  is_active,
  settings
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  '2026-2027',
  '2025-09-01',
  '2026-08-31',
  true,
  '{
    "inquiry_open_date": "2025-09-01",
    "application_open_date": "2025-10-01",
    "application_deadline": "2026-01-15",
    "decision_release_date": "2026-03-15",
    "enrollment_deadline": "2026-04-15",
    "rolling_admissions": false,
    "capacity_by_grade": {
      "PK3": 18,
      "PK4": 20,
      "K": 22,
      "1": 22,
      "2": 22,
      "3": 24,
      "4": 24,
      "5": 24,
      "6": 28,
      "7": 28,
      "8": 28,
      "9": 30,
      "10": 30,
      "11": 30,
      "12": 30
    }
  }'::JSONB
);
