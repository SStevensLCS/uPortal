# Admissions Compass — Full Product Specification

> **Purpose**: This document is the single source of truth for building v1 of a TK-12 private school admissions SaaS platform. It is written for an AI coding agent (Claude Code) to implement end-to-end. Every section contains enough detail to write code against without further clarification.

---

## Table of Contents

1. [Product Vision & Positioning](#1-product-vision--positioning)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Database Schema](#4-database-schema)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Admin Interface (Desktop Only)](#6-admin-interface-desktop-only)
7. [Parent Interface (Mobile + Desktop)](#7-parent-interface-mobile--desktop)
8. [API Design](#8-api-design)
9. [Background Jobs & Automations](#9-background-jobs--automations)
10. [Integrations](#10-integrations)
11. [Compliance & Security](#11-compliance--security)
12. [Build Phases](#12-build-phases)

---

## 1. Product Vision & Positioning

### The Opportunity

Every major competitor (Finalsite Enrollment, Ravenna, Blackbaud, Veracross, OpenApply, TADS) is admin-first. The parent experience universally reads like a 2012 government form. The #1 gap across the entire market is **a consumer-grade, mobile-first parent experience**. The #2 gap is **real-time visual reporting with self-service dashboards**. The #3 gap is **AI-powered admissions intelligence** (yield prediction, lead scoring, smart communication timing).

### Product Name

**Admissions Compass** (working title — use this throughout the codebase)

### Core Differentiators

1. **Parent UX that feels like a modern consumer app** — not a bureaucratic portal.
2. **Checklist-driven workflow engine** — the entire admissions lifecycle (inquiry → application → review → decision → enrollment → re-enrollment) is powered by configurable, auto-updating checklists.
3. **Real-time analytics dashboard** with natural-language filtering.
4. **AI layer** for lead scoring, yield prediction, and communication timing.
5. **Multi-school support from day one** — a single parent account works across multiple schools on the platform.

### User Personas

| Persona | Description | Interface |
|---------|-------------|-----------|
| **School Admin** (Admissions Director) | Manages the full admissions funnel. Power user. Configures forms, checklists, workflows, decisions. | Desktop only |
| **Reviewer** (Committee Member) | Reads application packets, scores candidates during admissions season. | Desktop (tablet-optimized) |
| **Parent/Guardian** | Submits inquiries, completes applications, uploads documents, schedules visits, signs contracts, pays tuition. | Mobile-first + desktop |
| **Recommender** (Teacher, Counselor) | Receives a secure link, completes a recommendation form for a specific student. | Mobile + desktop |
| **Super Admin** (Platform Operator) | Manages schools on the platform, billing, feature flags. | Desktop only |

---

## 2. Tech Stack

### Frontend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Admin app** | Next.js 14+ (App Router) with TypeScript | Server components, layouts, parallel routes for complex admin views |
| **Parent app** | Next.js 14+ (App Router) with TypeScript | Same framework, separate build/deploy, mobile-first responsive design |
| **UI library** | shadcn/ui + Tailwind CSS 4 | Composable, accessible, easily themed per-school |
| **State management** | TanStack Query (server state) + Zustand (client state) | Minimal boilerplate, excellent cache invalidation |
| **Forms** | React Hook Form + Zod validation | Schema-first validation shared with backend |
| **Rich text** | Tiptap (for admin email templates, form descriptions) | Extensible, headless |
| **Charts** | Recharts | Already available in artifact runtime, lightweight |
| **Drag-and-drop** | dnd-kit | For form builder, checklist reordering, waitlist ranking |

### Backend

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Database** | Supabase (PostgreSQL) | Row-level security, real-time subscriptions, built-in auth, storage, edge functions |
| **API layer** | Supabase Edge Functions (Deno) + Next.js API routes | Edge functions for webhooks/integrations; API routes for server-side rendering |
| **Auth** | Supabase Auth | Email/password, Google SSO, Magic link; supports multi-tenant with custom claims |
| **File storage** | Supabase Storage | S3-compatible; per-school buckets; virus scanning via ClamAV edge function |
| **Background jobs** | Supabase pg_cron + Edge Functions | Scheduled reminders, report generation, automated emails |
| **Search** | PostgreSQL full-text search (pg_trgm) | Good enough for v1; upgrade to Typesense later if needed |
| **Email** | Resend (transactional) | Modern API, great deliverability, React email templates |
| **SMS** | Twilio | US/Canada to start; TCPA-compliant opt-in/out |
| **Payments** | Stripe | PCI Level 1; supports ACH, cards, Apple Pay, Google Pay; Stripe Connect for multi-school |
| **PDF generation** | @react-pdf/renderer | For decision letters, contracts, reports |

### Deployment

| Layer | Technology |
|-------|-----------|
| **Hosting** | Vercel (frontend) + Supabase (backend) |
| **CDN** | Vercel Edge Network |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Vercel Analytics + Sentry |
| **Feature flags** | Supabase `feature_flags` table (simple v1) |

---

## 3. Architecture Overview

### Multi-Tenancy Model

Use **shared database, schema-level isolation** via Supabase Row Level Security (RLS). Every table that stores school data includes a `school_id` column. RLS policies enforce that users only see data for schools they belong to.

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel (Frontend)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Admin App   │  │  Parent App  │  │  Recommender App  │  │
│  │  (Desktop)   │  │  (Mobile+D)  │  │  (Public forms)   │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘  │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Platform                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │   Auth       │  │  PostgreSQL  │  │  Edge Functions   │  │
│  │  (JWT+RLS)   │  │  (Data+RLS)  │  │  (Webhooks/Jobs)  │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │   Storage    │  │  Realtime    │  │  pg_cron          │  │
│  │  (Files)     │  │  (Live UX)   │  │  (Scheduled jobs) │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌───────────────────┐
│   Stripe     │  │   Resend     │  │   Twilio          │
│  (Payments)  │  │  (Email)     │  │  (SMS)            │
└──────────────┘  └──────────────┘  └───────────────────┘
```

### URL Structure

- `admin.admissionscompass.com` → Admin SPA (desktop-only, show "use desktop" message on mobile)
- `app.admissionscompass.com` → Parent-facing app (responsive, mobile-first)
- `app.admissionscompass.com/recommend/:token` → Recommender public form
- `app.admissionscompass.com/inquiry/:school_slug` → Embeddable inquiry form

### Realtime

Use Supabase Realtime subscriptions for:
- Admin: live checklist status updates, new inquiry notifications, application status changes
- Parent: checklist item completion confirmations, decision letter availability, message notifications

---

## 4. Database Schema

### Core Principles

- Every tenant-scoped table has `school_id UUID NOT NULL REFERENCES schools(id)`.
- Every table has `created_at TIMESTAMPTZ DEFAULT NOW()` and `updated_at TIMESTAMPTZ DEFAULT NOW()` with a trigger to auto-update `updated_at`.
- Soft deletes via `deleted_at TIMESTAMPTZ` on all major tables.
- All monetary amounts stored as integers in cents (avoid floating-point).
- All dates stored as `TIMESTAMPTZ` (UTC).
- Use UUIDs for all primary keys (`gen_random_uuid()`).

### Tables

#### Platform Level

```sql
-- Schools on the platform
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-safe identifier
  logo_url TEXT,
  website_url TEXT,
  address JSONB, -- {street, city, state, zip, country}
  phone TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  currency TEXT NOT NULL DEFAULT 'USD',
  school_type TEXT NOT NULL CHECK (school_type IN ('day', 'boarding', 'day_boarding', 'charter', 'religious', 'montessori', 'other')),
  grade_levels JSONB NOT NULL, -- ["PK3", "PK4", "K", "1", "2", ... "12"]
  divisions JSONB, -- [{"name": "Lower School", "grades": ["PK3","PK4","K","1","2","3","4"]}, ...]
  settings JSONB NOT NULL DEFAULT '{}', -- feature flags, branding colors, custom labels
  subscription_tier TEXT NOT NULL DEFAULT 'standard',
  stripe_account_id TEXT, -- Stripe Connect
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- School groups (dioceses, districts, management organizations)
CREATE TABLE school_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE school_group_members (
  school_group_id UUID REFERENCES school_groups(id),
  school_id UUID REFERENCES schools(id),
  PRIMARY KEY (school_group_id, school_id)
);

-- Enrollment seasons / academic years
CREATE TABLE enrollment_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  name TEXT NOT NULL, -- "2026-2027"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  settings JSONB NOT NULL DEFAULT '{}', -- deadlines, capacity per grade, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Users & Auth

```sql
-- Extends Supabase auth.users
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'parent', 'super_admin')),
  settings JSONB NOT NULL DEFAULT '{}', -- notification preferences, UI preferences
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links admins to schools with role-based access
CREATE TABLE school_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  role TEXT NOT NULL CHECK (role IN ('system_admin', 'admin', 'user', 'limited_user', 'reviewer')),
  permissions JSONB NOT NULL DEFAULT '{}', -- granular: {can_view_financial_aid: true, can_send_decisions: false, ...}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, user_id)
);

-- Parent households
CREATE TABLE households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_address JSONB, -- {street, city, state, zip, country}
  secondary_address JSONB, -- for split households
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links parents to households
CREATE TABLE household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  relationship TEXT NOT NULL CHECK (relationship IN ('parent', 'guardian', 'step_parent', 'grandparent', 'other')),
  is_primary_contact BOOLEAN DEFAULT false,
  is_financial_contact BOOLEAN DEFAULT false,
  employer TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Students & Applications

```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  photo_url TEXT,
  current_school TEXT,
  current_grade TEXT,
  metadata JSONB NOT NULL DEFAULT '{}', -- flexible: nationality, languages, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Links students to siblings
CREATE TABLE sibling_links (
  student_id UUID REFERENCES students(id),
  sibling_id UUID REFERENCES students(id),
  PRIMARY KEY (student_id, sibling_id)
);

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  season_id UUID NOT NULL REFERENCES enrollment_seasons(id),
  student_id UUID NOT NULL REFERENCES students(id),
  submitted_by UUID NOT NULL REFERENCES user_profiles(id), -- the parent
  application_type TEXT NOT NULL DEFAULT 'standard' CHECK (application_type IN ('standard', 'sibling', 'transfer', 'international', 're_enrollment', 'early_admission')),
  applying_for_grade TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inquiry' CHECK (status IN (
    'inquiry', 'prospect', 'started', 'submitted', 'under_review',
    'waitlisted', 'accepted', 'denied', 'deferred',
    'enrolled', 'contract_sent', 'contract_signed',
    'withdrawn', 'declined_offer'
  )),
  status_history JSONB NOT NULL DEFAULT '[]', -- [{status, changed_at, changed_by, note}]
  lead_source TEXT, -- 'website', 'open_house', 'referral', 'niche', 'social_ad', 'directory', 'other'
  lead_score INTEGER DEFAULT 0,
  inquiry_date TIMESTAMPTZ,
  submitted_date TIMESTAMPTZ,
  decision TEXT, -- 'accept', 'deny', 'waitlist', 'defer'
  decision_date TIMESTAMPTZ,
  decision_released_at TIMESTAMPTZ,
  decision_letter_template_id UUID,
  financial_aid_requested BOOLEAN DEFAULT false,
  financial_aid_amount_cents INTEGER,
  notes TEXT, -- internal admin notes
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(school_id, season_id, student_id) -- one application per student per school per season
);

-- Application fee payments
CREATE TABLE application_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'waived')),
  fee_waiver_code TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Checklist Engine

```sql
-- Template checklists that admins configure
CREATE TABLE checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  season_id UUID NOT NULL REFERENCES enrollment_seasons(id),
  name TEXT NOT NULL, -- "Kindergarten Admissions Checklist"
  stage TEXT NOT NULL CHECK (stage IN ('inquiry', 'application', 'enrollment', 're_enrollment')),
  grade_levels JSONB, -- null = all grades; ["K", "1", "2"] = specific grades
  application_types JSONB, -- null = all types; ["standard", "sibling"] = specific types
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual items within a checklist template
CREATE TABLE checklist_template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES checklist_templates(id),
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN (
    'form', 'upload', 'recommendation', 'transcript_request',
    'schedule_event', 'payment', 'contract', 'e_signature',
    'test_score', 'manual', 'info_only'
  )),
  is_required BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  config JSONB NOT NULL DEFAULT '{}', -- type-specific: {form_id, event_calendar_id, payment_amount_cents, ...}
  due_date_rule JSONB, -- {type: 'fixed', date: '...'} or {type: 'relative', days_after: 'application_submitted', count: 14}
  gate_next_stage BOOLEAN DEFAULT false, -- must complete before progressing
  parent_visible BOOLEAN DEFAULT true, -- some items are admin-only
  reminder_config JSONB, -- {intervals_days: [7, 14, 21], template_id: '...'}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instantiated checklist items per application
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  template_item_id UUID REFERENCES checklist_template_items(id),
  title TEXT NOT NULL,
  item_type TEXT NOT NULL,
  is_required BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'completed', 'waived', 'overdue')),
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES user_profiles(id), -- null if auto-completed
  due_date TIMESTAMPTZ,
  parent_visible BOOLEAN DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}', -- stores linked form_submission_id, payment_id, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Forms Engine

```sql
-- Admin-defined forms (inquiry forms, application forms, recommendation forms, internal forms)
CREATE TABLE form_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  name TEXT NOT NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('inquiry', 'application', 'recommendation', 'supplemental', 'internal', 'enrollment', 're_enrollment', 'event_registration')),
  description TEXT,
  schema JSONB NOT NULL, -- JSON Schema defining all fields, sections, conditional logic
  ui_schema JSONB NOT NULL DEFAULT '{}', -- field ordering, layout hints, display options
  settings JSONB NOT NULL DEFAULT '{}', -- {require_payment: false, allow_save_resume: true, confirmation_message: "..."}
  version INTEGER DEFAULT 1,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submitted form data
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_definition_id UUID NOT NULL REFERENCES form_definitions(id),
  application_id UUID REFERENCES applications(id), -- null for standalone inquiry forms
  submitted_by UUID NOT NULL REFERENCES user_profiles(id),
  data JSONB NOT NULL, -- the actual form data
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
  submitted_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Recommendations

```sql
CREATE TABLE recommendation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  form_definition_id UUID NOT NULL REFERENCES form_definitions(id),
  recommender_name TEXT NOT NULL,
  recommender_email TEXT NOT NULL,
  recommender_type TEXT NOT NULL CHECK (recommender_type IN (
    'current_teacher', 'math_teacher', 'english_teacher', 'principal',
    'counselor', 'personal_reference', 'other'
  )),
  secure_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'in_progress', 'completed', 'declined')),
  is_confidential BOOLEAN DEFAULT true,
  form_submission_id UUID REFERENCES form_submissions(id), -- linked when completed
  reminder_count INTEGER DEFAULT 0,
  last_reminded_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  ip_address INET, -- logged on submission
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Events & Scheduling

```sql
CREATE TABLE event_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  season_id UUID NOT NULL REFERENCES enrollment_seasons(id),
  name TEXT NOT NULL, -- "Campus Tours", "Open Houses", "Parent Interviews"
  calendar_type TEXT NOT NULL CHECK (calendar_type IN ('tour', 'open_house', 'interview', 'shadow_day', 'testing', 'welcome_event', 'play_date', 'other')),
  description TEXT,
  location TEXT,
  is_public BOOLEAN DEFAULT false, -- available on website without login
  settings JSONB NOT NULL DEFAULT '{}', -- {allow_reschedule: true, cancel_cutoff_hours: 24, guest_limit: 2}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES event_calendars(id),
  title TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 1,
  booked_count INTEGER NOT NULL DEFAULT 0,
  location TEXT, -- override calendar location
  assigned_staff_id UUID REFERENCES school_staff(id),
  virtual_meeting_url TEXT,
  is_available BOOLEAN DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES event_slots(id),
  application_id UUID NOT NULL REFERENCES applications(id),
  booked_by UUID NOT NULL REFERENCES user_profiles(id),
  guest_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'no_show', 'attended', 'waitlisted')),
  attendance_marked_at TIMESTAMPTZ,
  attendance_marked_by UUID REFERENCES user_profiles(id),
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Review & Decisions

```sql
-- Scoring rubrics configured by admins
CREATE TABLE review_rubrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  season_id UUID NOT NULL REFERENCES enrollment_seasons(id),
  name TEXT NOT NULL,
  criteria JSONB NOT NULL, -- [{name: "Academic Readiness", weight: 2.0, scale_min: 1, scale_max: 5, allow_na: true}, ...]
  grade_levels JSONB, -- null = all grades
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE application_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  reviewer_id UUID NOT NULL REFERENCES school_staff(id),
  rubric_id UUID NOT NULL REFERENCES review_rubrics(id),
  scores JSONB NOT NULL, -- [{criterion: "Academic Readiness", score: 4, note: "Strong math skills"}, ...]
  overall_score NUMERIC(5,2),
  recommendation TEXT CHECK (recommendation IN ('strong_accept', 'accept', 'waitlist', 'deny', 'discuss')),
  notes TEXT,
  is_submitted BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, reviewer_id) -- one review per reviewer per application
);

-- Decision letter templates
CREATE TABLE decision_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  name TEXT NOT NULL,
  decision_type TEXT NOT NULL CHECK (decision_type IN ('accept', 'deny', 'waitlist', 'defer')),
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL, -- with merge tokens: {{student_first_name}}, {{parent_name}}, {{grade_level}}, {{financial_aid_amount}}
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Enrollment & Contracts

```sql
CREATE TABLE enrollment_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id),
  school_id UUID NOT NULL REFERENCES schools(id),
  contract_template_html TEXT NOT NULL,
  tuition_amount_cents INTEGER NOT NULL,
  financial_aid_amount_cents INTEGER DEFAULT 0,
  net_tuition_cents INTEGER NOT NULL, -- tuition - aid
  deposit_amount_cents INTEGER NOT NULL,
  deposit_paid BOOLEAN DEFAULT false,
  deposit_stripe_payment_id TEXT,
  payment_plan TEXT CHECK (payment_plan IN ('annual', 'semi_annual', 'quarterly', 'monthly_10', 'monthly_12')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed_primary', 'signed_both', 'completed', 'voided')),
  primary_signer_id UUID REFERENCES user_profiles(id),
  primary_signed_at TIMESTAMPTZ,
  primary_signer_ip INET,
  secondary_signer_id UUID REFERENCES user_profiles(id),
  secondary_signed_at TIMESTAMPTZ,
  secondary_signer_ip INET,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  supplemental_forms JSONB DEFAULT '[]', -- [{form_id, title, required}]
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment tracking (tuition installments)
CREATE TABLE tuition_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES enrollment_contracts(id),
  amount_cents INTEGER NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'late', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,
  late_fee_cents INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Communications

```sql
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('inquiry_followup', 'application_reminder', 'recommendation_request', 'event_confirmation', 'decision', 'contract', 'payment_reminder', 'general', 'marketing')),
  subject TEXT NOT NULL, -- with merge tokens
  body_html TEXT NOT NULL, -- with merge tokens
  body_text TEXT, -- plain text fallback
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  application_id UUID REFERENCES applications(id),
  sender_id UUID REFERENCES user_profiles(id),
  recipient_id UUID REFERENCES user_profiles(id),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'in_app', 'letter')),
  template_id UUID REFERENCES email_templates(id),
  subject TEXT,
  body_html TEXT,
  body_text TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  external_id TEXT, -- Resend message ID or Twilio SID
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- In-app messaging (parent ↔ admissions office)
CREATE TABLE conversation_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  application_id UUID REFERENCES applications(id),
  subject TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES conversation_threads(id),
  sender_id UUID NOT NULL REFERENCES user_profiles(id),
  body TEXT NOT NULL,
  attachments JSONB DEFAULT '[]', -- [{name, url, size, type}]
  read_at TIMESTAMPTZ, -- by the other party
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Documents & Files

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  application_id UUID REFERENCES applications(id),
  student_id UUID REFERENCES students(id),
  uploaded_by UUID NOT NULL REFERENCES user_profiles(id),
  document_type TEXT NOT NULL CHECK (document_type IN (
    'transcript', 'test_score', 'recommendation', 'photo', 'passport',
    'visa', 'iep_504', 'portfolio', 'video', 'financial', 'contract',
    'medical', 'other'
  )),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_size_bytes INTEGER,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'scanned', 'verified', 'rejected')),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Waitlist

```sql
CREATE TABLE waitlist_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id),
  school_id UUID NOT NULL REFERENCES schools(id),
  season_id UUID NOT NULL REFERENCES enrollment_seasons(id),
  grade TEXT NOT NULL,
  rank INTEGER, -- null = unranked; lower = higher priority
  priority_tags JSONB DEFAULT '[]', -- ["sibling", "legacy", "diversity"]
  intent_to_remain BOOLEAN,
  intent_confirmed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'offered', 'accepted', 'declined', 'expired')),
  offered_at TIMESTAMPTZ,
  response_deadline TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Analytics & Audit

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id),
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'view', 'login', 'export', 'decision_change'
  entity_type TEXT NOT NULL, -- 'application', 'student', 'contract', 'checklist_item', etc.
  entity_id UUID,
  changes JSONB, -- {field: {old: ..., new: ...}}
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Materialized view refreshed by pg_cron for dashboard
CREATE TABLE enrollment_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  season_id UUID NOT NULL REFERENCES enrollment_seasons(id),
  snapshot_date DATE NOT NULL,
  grade TEXT NOT NULL,
  metrics JSONB NOT NULL, -- {inquiries, applications, submitted, reviewed, accepted, denied, waitlisted, enrolled, capacity, yield_rate, selectivity_rate}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, season_id, snapshot_date, grade)
);
```

#### Tags

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  UNIQUE(school_id, name)
);

CREATE TABLE application_tags (
  application_id UUID REFERENCES applications(id),
  tag_id UUID REFERENCES tags(id),
  PRIMARY KEY (application_id, tag_id)
);
```

---

## 5. Authentication & Authorization

### Auth Flows

| User Type | Auth Method | Details |
|-----------|------------|---------|
| Admin | Email/password + optional MFA | Google SSO restricted to school domain. 3 failed attempts → 10-min lockout. 2-week session timeout. |
| Parent | Email/password, Google SSO, Magic Link | Passwordless magic link as primary option for mobile. Persistent sessions (30 days). |
| Recommender | Secure token link (no account required) | Token in URL, single-use after submission, expires after 60 days. |
| Super Admin | Email/password + required MFA | Platform operator access. |

### Role Permissions Matrix (Admin)

| Permission | System Admin | Admin | User | Limited User | Reviewer |
|------------|:---:|:---:|:---:|:---:|:---:|
| Configure school settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage staff accounts | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create/edit forms | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create/edit checklists | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all applications | ✅ | ✅ | ✅ | Grade-filtered | Assigned only |
| Edit application data | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send communications | ✅ | ✅ | ✅ | ❌ | ❌ |
| Make decisions | ✅ | ✅ | ❌ | ❌ | ❌ |
| Release decisions | ✅ | ✅ | ❌ | ❌ | ❌ |
| View financial aid | ✅ | ✅ | ❌ | ❌ | ❌ |
| Generate contracts | ✅ | ✅ | ❌ | ❌ | ❌ |
| Review/score applicants | ✅ | ✅ | ✅ | ❌ | ✅ |
| Export data | ✅ | ✅ | ✅ | ❌ | ❌ |
| View reports | ✅ | ✅ | ✅ | ❌ | ❌ |
| Impersonate parent | ✅ | ✅ | ❌ | ❌ | ❌ |

### RLS Policy Pattern

```sql
-- Example: applications table
CREATE POLICY "Admins see their school's applications"
  ON applications FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM school_staff
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Parents see their own applications"
  ON applications FOR SELECT
  USING (
    submitted_by = auth.uid()
  );
```

---

## 6. Admin Interface (Desktop Only)

### Global Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Top Bar: School Switcher | Season Switcher | Search | Notif | Profile │
├─────────────┬──────────────────────────────────────────────────┤
│             │                                                  │
│  Sidebar    │  Main Content Area                               │
│  Navigation │                                                  │
│             │                                                  │
│  Dashboard  │  ┌──────────────────────────────────────────┐    │
│  Contacts   │  │  Page content with tabs, tables,         │    │
│  Applications│  │  forms, detail views                     │    │
│  Checklists │  │                                          │    │
│  Calendar   │  └──────────────────────────────────────────┘    │
│  Messaging  │                                                  │
│  Reviews    │  ┌──────────────────────────────────────────┐    │
│  Decisions  │  │  Contextual side panel (contact detail,  │    │
│  Contracts  │  │  quick actions, preview)                 │    │
│  Reports    │  └──────────────────────────────────────────┘    │
│  Settings   │                                                  │
│             │                                                  │
└─────────────┴──────────────────────────────────────────────────┘
```

Minimum viewport: **1280px wide**. Show a "please use a desktop browser" message below this.

### 6.1 Dashboard

The landing page after login. Provides at-a-glance admissions health.

**Widgets (configurable layout):**

- **Funnel visualization**: Horizontal bar chart showing counts at each stage (Inquiry → Applied → Submitted → Reviewed → Accepted → Enrolled) with YoY comparison line. Clickable — each bar filters the contacts list.
- **Grade capacity tracker**: Table showing per-grade: capacity, returning students, available spots, applications received, accepted, enrolled. Color-coded (green = on track, yellow = behind, red = critical).
- **Speed-to-lead**: Average hours from inquiry to first response, last 7 days. Trend sparkline.
- **Upcoming deadlines**: Next 5 deadlines across all active workflows.
- **Recent activity feed**: Last 20 actions (new inquiry, application submitted, recommendation completed, contract signed) with timestamp, clickable.
- **Open tasks**: Items requiring admin action (unread messages, pending reviews, overdue reminders).

### 6.2 Contacts / CRM

A unified view of all people: parents, students, recommenders.

**List view:**
- Filterable data table using TanStack Table.
- Columns: Name, Email, Phone, Student(s), Status, Grade, Lead Source, Lead Score, Tags, Last Activity, Created.
- Filters: Status (multi-select), Grade (multi-select), Season, Lead Source, Tags, Date Range, Custom field filters.
- Bulk actions: Send email, Send SMS, Change status, Add tag, Export CSV, Assign to reviewer.
- Quick search: Full-text search across name, email, phone, student name, notes.

**Contact detail view (side panel or full page):**
- **Header**: Name, photo, contact info, lead score badge, status badge.
- **Tabs**:
  - **Overview**: Household info, students, linked applications, timeline of all interactions.
  - **Applications**: All applications for this household across seasons.
  - **Checklists**: Current checklist status for each application.
  - **Documents**: All uploaded files.
  - **Communications**: Full email/SMS/message history.
  - **Notes**: Internal notes with timestamps and attribution.
  - **Activity log**: Every touchpoint (form views, logins, email opens, event attendance).
- **Quick actions sidebar**: Send email, Send SMS, Schedule event, Add note, Change status, Impersonate.

**Duplicate detection:**
- On contact creation, fuzzy match against existing records (name + email, name + phone, name + DOB).
- Present merge UI when duplicates found.

### 6.3 Applications Manager

**Pipeline board view** (Kanban, like a lightweight Trello):
- Columns represent statuses: Inquiry → Started → Submitted → Under Review → Decision Made → Enrolled.
- Cards show: Student name, grade, completeness %, days in stage, key flags (sibling, legacy, financial aid, international).
- Drag-and-drop to change status.
- Filter bar: Grade, Season, Application Type, Tags, Reviewer Assigned.

**Table view** (alternative):
- Same data in sortable/filterable table format.
- Inline quick-edit for status, assigned reviewer, tags.

**Application detail page:**
- Full read/edit view of all submitted form data.
- Checklist progress sidebar.
- Attached documents viewer (inline PDF preview).
- Review scores summary.
- Decision controls.
- Communication thread.
- Status change audit trail.

### 6.4 Form Builder

Visual drag-and-drop form builder for all form types.

**Field types:**
- Text (short, long, rich text)
- Number, Currency
- Date, Date of Birth (with grade auto-suggestion)
- Email, Phone, URL
- Select (dropdown, radio), Multi-select (checkboxes)
- File upload (with type/size restrictions)
- Address (with country-specific formatting)
- E-signature
- Likert scale (for recommendations)
- Section break, Instructional text, Divider
- Hidden (for tracking/metadata)

**Features:**
- **Conditional logic**: Show/hide fields based on other field values. UI: "If [Field A] equals [Value X], then show [Field B]".
- **Required/optional per field**.
- **Sections**: Group fields into collapsible sections with progress indicator.
- **Pre-population rules**: Map fields to student/parent/household data for auto-fill.
- **Form preview**: Render form as parent would see it.
- **Version history**: Each publish creates a new version; submissions link to the version used.

### 6.5 Checklist Manager

**Template builder:**
- Create checklist templates per stage (inquiry, application, enrollment, re-enrollment).
- Add items with type, title, description, required/optional, sort order.
- Link items to: forms, event calendars, payment amounts, document upload types.
- Set due date rules (fixed date, or relative to application event).
- Configure auto-completion triggers (e.g., "mark complete when linked form is submitted").
- Set gating rules (must complete item X before item Y becomes available).
- Grade/division filtering (different checklists per grade band).

**Application checklist view:**
- Per-application view showing all items, statuses, dates.
- Admin can manually complete, waive, or reset items.
- Bulk operations across multiple applications.

### 6.6 Calendar & Events

- Create event calendars by type (tour, open house, interview, shadow day, testing).
- Manage time slots with capacity limits.
- Assign staff to slots.
- View bookings by slot, by date, by applicant.
- Attendance tracking (mark attended/no-show after event).
- Public calendar link generator for website embedding.
- Virtual event support: paste Zoom/Teams URL into slot.
- Export ICS files.
- Waitlist management when slots are full.

### 6.7 Communication Center

**Compose:**
- Rich text editor with merge token insertion (click to insert `{{student_first_name}}`, `{{parent_name}}`, `{{portal_link}}`, `{{checklist_status}}`, etc.).
- Recipient selection: individual, search results, filtered list, all in status X.
- Channel: Email, SMS, In-app message.
- Schedule for later or send immediately.
- Template save/load.

**Templates library:**
- CRUD for email/SMS templates.
- Categorized: inquiry follow-up, application reminders, event confirmations, decision letters, contract reminders, payment reminders.
- Preview with sample data.

**Automation rules** (v1 — simple trigger → action):
- Trigger: Status change, Checklist item overdue, Days since last activity, Event booking.
- Action: Send email template, Send SMS template, Create task, Change status.
- Configurable delays.

**Message log:**
- Searchable history of all sent messages.
- Delivery status (sent, delivered, opened, clicked, bounced).
- Per-applicant communication timeline.

### 6.8 Review Center

**Reviewer dashboard:**
- List of assigned applications to review.
- Progress bar: reviewed X of Y.
- Filter: grade, status, score range.

**Review interface:**
- Left panel: Application packet (scrollable): student info, parent info, forms, documents, test scores, recommendation summaries (inline PDF/content viewer).
- Right panel: Scoring rubric. Each criterion with scale, optional note field. Overall recommendation dropdown.
- Navigation: Previous / Next applicant buttons.
- Blind mode toggle: hide other reviewers' scores.

**Committee view:**
- Table of all reviewed applications with score columns.
- Sort by any criterion or overall score.
- Flag discrepancies (>2-point spread between reviewers).
- Side-by-side comparison of selected candidates.
- Bulk decision assignment.

### 6.9 Decision Manager

- Batch select applicants and assign decisions (Accept, Deny, Waitlist, Defer).
- Map each decision to a letter template.
- Preview merged letters before release.
- Schedule release date/time (all decisions become visible simultaneously in parent portal).
- Financial aid award entry and coordination (award attached to acceptance letter).
- Decision audit trail (who made/changed each decision, when).

### 6.10 Waitlist Manager

- Sortable, ranked list per grade.
- Drag to reorder priority.
- Priority tags (sibling, legacy, diversity, mission fit).
- Automated intent-to-remain check-ins.
- One-click "Offer spot" → triggers acceptance workflow for waitlisted family.
- Historical movement analytics.

### 6.11 Contracts & Billing

- Generate enrollment contracts from templates.
- Bulk generation for all accepted students.
- Track contract status: sent → viewed → signed (primary) → signed (secondary) → deposit paid → completed.
- Payment plan configuration per school.
- Tuition schedule management.
- Payment tracking with Stripe integration.
- Late fee configuration.
- Refund processing.
- Export to QuickBooks (CSV with configurable field mapping).

### 6.12 Reports & Analytics

**Pre-built reports:**
- Admissions Funnel (with YoY comparison)
- Yield Analysis (accepted → enrolled rate by grade, aid level)
- Lead Source ROI (inquiries and conversions per source)
- Checklist Completion Rates
- Communication Engagement (open rates, response rates)
- Financial Summary (tuition committed, aid awarded, NTR)
- Capacity Report (seats available vs. filled per grade)
- Diversity Metrics
- Attrition Report (re-enrollment rates, departure reasons)
- Feeder School Analysis

**Custom report builder:**
- Select entity (applications, students, contacts, events).
- Choose columns from all available fields.
- Add filters.
- Group by, sort by.
- Save and name for reuse.
- Export: CSV, Excel, PDF.
- Schedule recurring export via email.

**Dashboard builder:**
- Drag-and-drop widgets (chart types: bar, line, donut, number card, table).
- Each widget backed by a saved report or query.
- Share dashboards with other staff.

### 6.13 Settings

**School settings:**
- Profile (name, logo, address, website, timezone).
- Branding (primary color, secondary color, portal welcome message, custom CSS).
- Grade configuration (which grades the school offers).
- Division configuration.
- Application fee amounts and waiver codes.
- Tuition rates per grade.
- Financial aid settings.
- Notification preferences (which events trigger admin emails).
- Integration credentials (Stripe, Resend, Twilio API keys — stored encrypted).

**Season settings:**
- Create new enrollment season.
- Copy checklists, forms, templates from previous season.
- Set deadlines.
- Configure capacity per grade.

**User management:**
- Invite staff by email.
- Assign role and permissions.
- Deactivate accounts.
- View login history.

---

## 7. Parent Interface (Mobile + Desktop)

### Design Principles

1. **Mobile-first**: Design at 375px, scale up to desktop. Touch targets ≥ 44px.
2. **Consumer-grade UX**: Think Airbnb, not government form. Clean, calm, encouraging.
3. **Progressive disclosure**: Don't overwhelm. Show what's needed now; hide what's not.
4. **Instant feedback**: Every action produces immediate visual confirmation.
5. **Minimize typing on mobile**: Use selection, toggle, date pickers, camera for document upload.
6. **Persistent progress**: Every field saves automatically. Show "saved" micro-confirmation.

### Global Layout (Mobile)

```
┌───────────────────────┐
│  Logo  | School Name  │  ← sticky top bar
├───────────────────────┤
│                       │
│   Main Content        │
│                       │
│                       │
│                       │
├───────────────────────┤
│ 🏠  📋  📅  💬  👤  │  ← bottom tab bar
│ Home List Sched Msg Me│
└───────────────────────┘
```

### Global Layout (Desktop)

```
┌────────────────────────────────────────────────┐
│  Logo | School Name | Notifications | Profile  │
├──────────┬─────────────────────────────────────┤
│ Sidebar  │  Main Content                       │
│  Home    │                                     │
│  My Apps │                                     │
│  Schedule│                                     │
│  Messages│                                     │
│  Billing │                                     │
│  Profile │                                     │
└──────────┴─────────────────────────────────────┘
```

### 7.1 Onboarding & Login

**First visit:**
- School-branded landing page with logo, welcome message, and clear CTAs: "Start an Inquiry" or "Continue Application".
- Auth options: "Sign up with Google", "Sign up with Email", or "Continue with Magic Link" (recommended on mobile).
- After auth, profile completion: parent name, phone, address, student(s) basic info (name, DOB, current grade).

**Returning visit:**
- Biometric/face ID unlock on mobile (via WebAuthn).
- Magic link as easy re-entry option.
- Session persists 30 days.

### 7.2 Home / Dashboard

**The parent's home base.** Shows a clear, personalized summary.

**If applying to ONE school:**
- Student card(s) at top showing photo/name/grade.
- **Progress ring** (circular progress indicator showing overall application completeness, e.g., "4 of 7 items complete").
- **Next step CTA**: Big, prominent button for the single most important next action ("Complete Teacher Recommendation Request", "Schedule Your Tour", "Pay Application Fee").
- **Checklist preview**: 3-5 most relevant items with status icons.
- **Recent updates feed**: "Your recommendation from Ms. Johnson was received ✓", "Decision letters release on March 15".
- **Quick links**: View full checklist, Message admissions, View upcoming events.

**If applying to MULTIPLE schools (on the platform):**
- School cards with per-school progress rings.
- Unified "next steps" across all schools, sorted by urgency.

### 7.3 Application Checklist (Core Experience)

This is the heart of the parent experience. Every required and optional task for the application appears here.

**Visual design:**
- Vertical list of items, grouped by category if configured.
- Each item has: icon (type-specific), title, status badge, due date (if applicable), action button.
- Status badges: ⬜ Not Started, 🔵 In Progress, ✅ Completed, ⚠️ Overdue, ⏭️ Waived.
- Tapping an item either opens an inline form, navigates to a subpage, or triggers an action (schedule event, upload file, etc.).
- Completed items visually recede (muted color) so remaining items stand out.
- Sticky progress indicator at top.

**Item types and their behaviors:**

| Item Type | Parent Action | Completion Trigger |
|-----------|--------------|-------------------|
| Form | Fill out and submit the form | Form submitted |
| Upload | Tap to upload file (camera or file picker on mobile) | File uploaded and accepted |
| Recommendation | Enter recommender name + email, system sends request | Recommender completes form |
| Transcript Request | Enter school name + registrar email | School uploads transcript |
| Schedule Event | View available slots and book | Booking confirmed |
| Payment | Pay via Stripe (card, ACH, Apple Pay, Google Pay) | Payment succeeded |
| Contract | Review terms, select payment plan, e-sign | Both signatures completed |
| E-Signature | Sign a standalone document | Signature captured |
| Test Score | Self-report or auto-imported (SSAT/ISEE) | Score received |
| Manual | Admin marks this complete (e.g., in-person interview occurred) | Admin action |
| Info Only | Read-only information block (no action required) | Auto-complete on view |

### 7.4 Form Filling Experience

When a parent taps a form-type checklist item:

- **One-screen-at-a-time** on mobile (section-by-section pagination). Full scrollable form on desktop.
- Progress bar at top showing sections completed.
- Auto-save after every field blur (debounced 1s). Show "✓ Saved" confirmation.
- Pre-populated fields from profile (name, address, DOB, etc.) shown as filled, editable.
- Conditional fields animate in/out smoothly.
- Validation: inline errors on blur, summary of errors on submit attempt.
- File upload fields: camera option on mobile, drag-and-drop on desktop.
- "Save & Continue Later" button always visible.
- On final submit: confirmation dialog → success screen with confetti/celebration animation → return to checklist with item marked complete.

### 7.5 Recommendation Management

- Parent sees a list of recommendation slots (e.g., "Math Teacher Recommendation", "English Teacher Recommendation", "Personal Reference").
- For each slot: enter recommender's name and email.
- On save: system sends a branded email to the recommender with a secure link.
- Parent sees status: Pending → Sent → In Progress → Completed.
- Parent can resend reminder (rate-limited to 1 per 3 days).
- Parent cannot view confidential recommendation content.

### 7.6 Event Scheduling

- View available event types (Tours, Open Houses, Shadow Days, etc.).
- Calendar view (month) or list view showing available dates/times.
- Select a slot → confirm booking → receive confirmation with ICS calendar attachment.
- View upcoming bookings.
- Cancel/reschedule (if allowed by school, with cutoff enforcement).
- Add to phone calendar (deep link to native calendar on mobile).

### 7.7 Messaging

- Threaded conversation view with the admissions office.
- Start new thread or reply to existing.
- Rich text input with file attachment support.
- Push notification (browser/mobile) on new message from school.
- Unread badge on Messages tab.

### 7.8 Decision Portal

- **Before release date**: "Decisions will be released on [date]" message.
- **On release**: Prominent notification (push + in-app + email).
- **Decision display**: Full-screen, school-branded letter with personalization. Clean, respectful design regardless of outcome.
- **If accepted**: Celebration UI → clear next steps CTA ("View Your Enrollment Checklist", "Review Financial Aid Award").
- **If waitlisted**: Compassionate messaging → intent-to-remain form → position status.
- **If denied**: Gracious messaging → option to message admissions with questions.

### 7.9 Enrollment & Contract Signing

Post-acceptance workflow:

1. **Review contract**: Rendered as a clean, readable document (not a PDF embed). Key terms highlighted: tuition amount, financial aid, deposit, payment plan options.
2. **Select payment plan**: Visual comparison cards (Annual, Semi-Annual, Quarterly, Monthly) showing amounts.
3. **E-sign**: Tap/click to sign. Primary guardian signs first → secondary guardian receives prompt.
4. **Pay deposit**: Inline Stripe payment (card, ACH, Apple Pay, Google Pay).
5. **Supplemental forms**: Any additional forms (medical, emergency contacts, t-shirt sizes, etc.) presented as a mini-checklist.
6. **Completion celebration**: "Welcome to [School Name]!" screen with next steps and timeline.

### 7.10 Billing & Payments

- View current balance.
- View payment schedule (upcoming and past).
- Make one-time payment.
- Set up autopay.
- View/download payment receipts.
- Update payment method.
- View financial aid award details.

### 7.11 Profile & Settings

- Edit parent contact information.
- Edit student information.
- Manage notification preferences (email, SMS, push).
- Switch between schools (if multi-school).
- Switch between students.
- Log out.

### 7.12 Multi-Child Experience

- "My Students" switcher at the top of the app.
- Each student has their own checklist, application status, and timeline.
- Shared data (address, parent info, payment methods) entered once.
- Sibling auto-detection: if a student's last name and household match an existing student, flag as sibling and offer pre-populated sibling application.
- Combined billing view across all children.

---

## 8. API Design

### API Conventions

- RESTful endpoints under `/api/v1/`.
- All requests authenticated via Supabase JWT (Authorization: Bearer token).
- JSON request/response bodies.
- Pagination: `?page=1&per_page=25` → response includes `{data: [], meta: {total, page, per_page, total_pages}}`.
- Filtering: `?filter[status]=submitted&filter[grade]=K`.
- Sorting: `?sort=-created_at` (prefix `-` for descending).
- Errors: `{error: {code: "VALIDATION_ERROR", message: "...", details: [...]}}`.

### Key Endpoints

```
# Auth
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/magic-link
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

# Schools (admin)
GET    /api/v1/schools/:id
PATCH  /api/v1/schools/:id
GET    /api/v1/schools/:id/seasons
POST   /api/v1/schools/:id/seasons

# Contacts (admin)
GET    /api/v1/contacts                    # list/search/filter
POST   /api/v1/contacts                    # create
GET    /api/v1/contacts/:id                # detail
PATCH  /api/v1/contacts/:id                # update
POST   /api/v1/contacts/merge              # merge duplicates
POST   /api/v1/contacts/bulk-action        # bulk status change, tag, email

# Applications (admin + parent)
GET    /api/v1/applications                # list (admin: school-scoped, parent: own)
POST   /api/v1/applications                # create new application
GET    /api/v1/applications/:id            # detail
PATCH  /api/v1/applications/:id            # update
GET    /api/v1/applications/:id/checklist  # get checklist items
PATCH  /api/v1/applications/:id/checklist/:item_id  # update item status

# Forms
GET    /api/v1/forms                       # list form definitions
GET    /api/v1/forms/:id                   # get form schema
POST   /api/v1/forms/:id/submissions       # submit form
PATCH  /api/v1/forms/:id/submissions/:sid  # update draft submission
GET    /api/v1/forms/:id/submissions/:sid  # get submission

# Recommendations
POST   /api/v1/recommendations             # create request (parent)
GET    /api/v1/recommendations/:token      # get form for recommender (public)
POST   /api/v1/recommendations/:token/submit  # submit recommendation (public)

# Events
GET    /api/v1/events/calendars            # list calendars
GET    /api/v1/events/calendars/:id/slots  # available slots
POST   /api/v1/events/bookings             # book a slot
DELETE /api/v1/events/bookings/:id         # cancel booking

# Reviews (admin)
GET    /api/v1/reviews/queue               # reviewer's assigned applications
POST   /api/v1/reviews                     # submit a review
GET    /api/v1/reviews/summary/:app_id     # aggregated scores for an application

# Decisions (admin)
POST   /api/v1/decisions/batch             # batch assign decisions
POST   /api/v1/decisions/release           # release decisions at scheduled time

# Contracts
POST   /api/v1/contracts                   # generate contract
GET    /api/v1/contracts/:id               # get contract details
POST   /api/v1/contracts/:id/sign          # e-sign
POST   /api/v1/contracts/:id/deposit       # pay deposit

# Payments
POST   /api/v1/payments/create-intent      # Stripe payment intent
GET    /api/v1/payments/history             # payment history
POST   /api/v1/payments/setup-autopay      # setup recurring

# Messages
GET    /api/v1/messages/threads            # list threads
POST   /api/v1/messages/threads            # new thread
GET    /api/v1/messages/threads/:id        # get messages in thread
POST   /api/v1/messages/threads/:id        # reply

# Reports (admin)
GET    /api/v1/reports/funnel              # admissions funnel data
GET    /api/v1/reports/capacity            # grade capacity data
GET    /api/v1/reports/yield               # yield analysis
GET    /api/v1/reports/custom              # custom report query
POST   /api/v1/reports/export              # trigger async export

# Documents
POST   /api/v1/documents/upload            # upload file
GET    /api/v1/documents/:id               # get file
DELETE /api/v1/documents/:id               # delete file

# Webhooks (Supabase Edge Functions)
POST   /api/v1/webhooks/stripe             # Stripe payment events
POST   /api/v1/webhooks/resend             # Email delivery events
POST   /api/v1/webhooks/twilio             # SMS delivery events
```

---

## 9. Background Jobs & Automations

Implemented via `pg_cron` + Supabase Edge Functions.

### Scheduled Jobs

| Job | Schedule | Description |
|-----|----------|-------------|
| `snapshot_enrollment_metrics` | Daily 6:00 AM UTC | Calculate and store daily enrollment metrics per grade per school |
| `send_checklist_reminders` | Daily 8:00 AM local per school timezone | Send reminders for overdue or approaching-deadline checklist items |
| `send_recommendation_reminders` | Daily 9:00 AM local | Remind recommenders who haven't completed after 7, 14, 21 days |
| `send_payment_reminders` | 3 days before, 1 day before, day of, 3 days after due | Escalating payment reminders |
| `expire_waitlist_entries` | Daily midnight | Mark expired entries based on school's waitlist expiration date |
| `scheduled_decision_release` | Every 5 minutes | Check for scheduled decision releases and trigger them |
| `calculate_lead_scores` | Hourly | Recalculate lead scores based on engagement signals |
| `cleanup_expired_tokens` | Daily 2:00 AM | Remove expired recommendation and magic link tokens |
| `generate_reports` | Per scheduled export config | Generate and email recurring reports |

### Event-Driven Automations

| Trigger | Action |
|---------|--------|
| New inquiry submitted | Create contact record, assign to funnel stage, send welcome email |
| Application status → "submitted" | Notify assigned admissions staff, update checklist, send confirmation to parent |
| Recommendation completed | Update checklist item, notify admin, send thank-you to recommender |
| Event booked | Send confirmation + ICS to parent, notify assigned staff |
| Event attended (manual mark) | Update checklist item, award lead score points |
| Payment succeeded | Update contract/payment record, send receipt, update checklist |
| Contract fully signed | Update application status → "contract_signed", trigger enrollment onboarding checklist |
| Decision released | Send notification email/push to parent, make decision visible in portal |
| Accepted student declines | Auto-prompt next waitlisted family (if configured) |

---

## 10. Integrations

### v1 Integrations (Build These)

| Integration | Type | Priority |
|-------------|------|----------|
| **Stripe** | Payment processing (cards, ACH, Apple Pay, Google Pay) | Critical |
| **Resend** | Transactional email with tracking | Critical |
| **Twilio** | SMS (US/Canada) with TCPA compliance | High |
| **Google SSO** | Parent + Admin authentication | Critical |
| **ICS Calendar** | Event export to Google/Outlook/Apple Calendar | High |
| **CSV/Excel Export** | Data export for all reports and lists | Critical |

### v2 Integrations (Plan For, Don't Build Yet)

| Integration | Type | Priority |
|-------------|------|----------|
| SSAT/EMA API | Test score import | High |
| Clarity (Financial Aid) | Bidirectional FA data sync | High |
| Blackbaud SIS | Student data sync | Medium |
| Veracross SIS | Student data sync | Medium |
| PowerSchool SIS | Student data sync | Medium |
| QuickBooks | Accounting export | Medium |
| SAO/Gateway to Prep | Consortium application import | Medium |
| Google Analytics 4 | Portal analytics | Low |
| Zoom/Teams | Virtual event auto-link | Low |

### Webhook Architecture

All external service events flow through Supabase Edge Functions:

```
External Service → Edge Function → Validate Signature → Process → Update DB → Trigger Automations
```

---

## 11. Compliance & Security

### Must-Haves for v1

| Requirement | Implementation |
|-------------|---------------|
| **FERPA** | RLS on all student data; role-based access; audit trails; no student data in logs; DPA template for schools |
| **COPPA** | Parental consent flow for students under 13; minimal data collection; no advertising/tracking of minors |
| **PCI DSS** | Stripe handles all card data; no card numbers ever touch our servers; PCI Level 1 via Stripe |
| **Encryption at rest** | Supabase (PostgreSQL) encrypts at rest by default (AES-256) |
| **Encryption in transit** | TLS 1.2+ on all connections (Vercel + Supabase enforce this) |
| **Audit logging** | Every create/update/delete/view/export action logged to `audit_log` table with user, IP, timestamp |
| **Session management** | Admin: 2-week timeout, 3-attempt lockout (10 min). Parent: 30-day persistent, biometric re-auth option |
| **File security** | Virus scanning on all uploads (ClamAV via Edge Function); signed URLs with expiration for file access |
| **E-signature legal trail** | IP address, timestamp, user agent logged for every signature event |
| **Data retention** | Configurable per school; annual purge tools; deletion scheduling |

### Should-Haves for v2

| Requirement | Notes |
|-------------|-------|
| GDPR consent management | Cookie banners, data export, right-to-erasure |
| SOC 2 certification | Pursue after v1 launch |
| MFA for admins | TOTP authenticator app |
| Anomaly detection | Alert on unusual login patterns, bulk downloads |
| Rate limiting | Per-IP and per-user rate limits on all endpoints |
| CSRF protection | Built into Next.js; verify for Edge Functions |

---

## 12. Build Phases

### Phase 1: Foundation (Weeks 1-4)

**Goal**: Core infrastructure, auth, basic CRUD, skeleton UI.

- [ ] Supabase project setup (database, auth, storage, edge functions)
- [ ] Database migrations for all core tables
- [ ] RLS policies for multi-tenancy
- [ ] Next.js project setup (admin app + parent app, shared packages)
- [ ] Auth flows: email/password, Google SSO, magic link
- [ ] Admin layout: sidebar, top bar, school/season switcher
- [ ] Parent layout: responsive shell, bottom tabs (mobile), sidebar (desktop)
- [ ] User profile management
- [ ] School settings CRUD
- [ ] Enrollment season CRUD

### Phase 2: Core Admissions (Weeks 5-8)

**Goal**: The primary admissions workflow from inquiry to submitted application.

- [ ] Form builder (admin): field types, conditional logic, sections, preview
- [ ] Form renderer (parent): section pagination, auto-save, validation, file upload
- [ ] Checklist template builder (admin)
- [ ] Checklist instantiation per application
- [ ] Checklist display (parent): status, navigation, completion
- [ ] Contact/CRM list view with search, filter, sort
- [ ] Contact detail view with tabs
- [ ] Application creation flow (parent)
- [ ] Application pipeline board + table view (admin)
- [ ] Application detail view (admin)
- [ ] Inquiry form (embeddable, public)
- [ ] Lead source tracking
- [ ] Application fee payment via Stripe

### Phase 3: Communications & Events (Weeks 9-11)

**Goal**: Two-way communication and event scheduling.

- [ ] Email template builder with merge tokens
- [ ] Bulk email send
- [ ] SMS send (individual and bulk) via Twilio
- [ ] In-app messaging (threads between parent and admissions)
- [ ] Notification system (in-app bell + push via web push)
- [ ] Email/SMS delivery tracking (Resend/Twilio webhooks)
- [ ] Event calendar CRUD (admin)
- [ ] Event slot management
- [ ] Event booking flow (parent)
- [ ] Booking confirmation emails with ICS attachment
- [ ] Attendance tracking (admin)

### Phase 4: Recommendations & Documents (Weeks 12-13)

**Goal**: Complete the application packet.

- [ ] Recommendation request flow (parent enters recommender email)
- [ ] Recommender form experience (public, token-authenticated)
- [ ] Recommendation status tracking
- [ ] Reminder automation for recommenders
- [ ] Document upload with type tagging
- [ ] Document viewer (inline PDF preview)
- [ ] Transcript request workflow
- [ ] Auto-completion of checklist items when linked actions complete

### Phase 5: Review & Decisions (Weeks 14-16)

**Goal**: Committee review, scoring, and decision management.

- [ ] Review rubric configuration (admin)
- [ ] Reviewer assignment
- [ ] Review interface (packet viewer + scoring form)
- [ ] Blind review mode
- [ ] Score aggregation and discrepancy flagging
- [ ] Committee summary view with sort/filter
- [ ] Decision assignment (individual + batch)
- [ ] Decision letter template configuration
- [ ] Scheduled decision release
- [ ] Decision display in parent portal
- [ ] Waitlist management (ranking, intent-to-remain, spot-open triggers)

### Phase 6: Enrollment & Billing (Weeks 17-19)

**Goal**: Post-acceptance enrollment workflow.

- [ ] Contract template builder
- [ ] Contract generation (individual + bulk)
- [ ] Contract viewing and e-signing flow (parent)
- [ ] Dual-signer workflow (primary → secondary)
- [ ] Deposit payment collection
- [ ] Payment plan selection
- [ ] Tuition payment scheduling
- [ ] Autopay setup
- [ ] Payment reminders (automated)
- [ ] Payment tracking dashboard (admin)
- [ ] Billing view (parent)
- [ ] Re-enrollment workflow (copy from prior year, intent-to-return, bulk contracts)
- [ ] Financial aid award entry and contract integration

### Phase 7: Reporting & Polish (Weeks 20-22)

**Goal**: Analytics, reporting, and overall polish.

- [ ] Admissions funnel dashboard
- [ ] Grade capacity tracker
- [ ] Yield analysis report
- [ ] Lead source report
- [ ] Custom report/search builder
- [ ] CSV/Excel/PDF export
- [ ] Scheduled report delivery
- [ ] Enrollment snapshot daily job
- [ ] Speed-to-lead metric
- [ ] Admin activity dashboard
- [ ] Audit log viewer
- [ ] Duplicate contact detection and merge
- [ ] Data import tools (CSV import with mapping)
- [ ] Comprehensive error handling and empty states
- [ ] Loading skeletons and optimistic updates
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance audit (Core Web Vitals)

### Phase 8: Launch Prep (Weeks 23-24)

- [ ] End-to-end testing of complete parent workflow
- [ ] End-to-end testing of complete admin workflow
- [ ] Security audit (OWASP top 10)
- [ ] Load testing
- [ ] Documentation: admin user guide, parent FAQ
- [ ] Seed data for demo environment
- [ ] Production deployment configuration
- [ ] Monitoring and alerting setup
- [ ] Backup and disaster recovery verification

---

## Appendix A: Merge Token Reference

Tokens available in email templates, decision letters, and contracts:

```
{{student_first_name}}
{{student_last_name}}
{{student_full_name}}
{{student_preferred_name}}
{{student_grade}}
{{student_dob}}
{{parent_first_name}}
{{parent_last_name}}
{{parent_full_name}}
{{parent_email}}
{{parent_phone}}
{{household_address}}
{{school_name}}
{{school_phone}}
{{school_website}}
{{season_name}}
{{application_status}}
{{application_type}}
{{checklist_status}}  -- "4 of 7 items complete"
{{portal_link}}
{{checklist_link}}
{{recommendation_link}}
{{event_date}}
{{event_time}}
{{event_location}}
{{tuition_amount}}
{{financial_aid_amount}}
{{net_tuition}}
{{deposit_amount}}
{{payment_plan}}
{{contract_link}}
{{decision_text}}
{{fee_amount}}
{{fee_waiver_code}}
{{today_date}}
{{deadline_date}}
```

## Appendix B: Status Lifecycle

```
INQUIRY ──→ PROSPECT ──→ STARTED ──→ SUBMITTED ──→ UNDER REVIEW
                                                         │
                                    ┌────────────────────┼────────────────────┐
                                    ▼                    ▼                    ▼
                                ACCEPTED             WAITLISTED           DENIED
                                    │                    │
                                    ▼                    ▼
                              CONTRACT SENT        OFFERED (from WL)
                                    │                    │
                                    ▼                    ▼
                             CONTRACT SIGNED       ACCEPTED (from WL)
                                    │                    │
                                    ▼                    ▼
                                ENROLLED           CONTRACT SENT → ...
                                    
At any point:  ──→ WITHDRAWN (by family)
               ──→ DECLINED OFFER (accepted but chose another school)
               ──→ DEFERRED (to next season)
```

## Appendix C: Lead Score Rules (Default, Configurable Per School)

| Action | Points |
|--------|--------|
| Inquiry submitted | +5 |
| Attended open house | +10 |
| Scheduled campus tour | +5 |
| Attended campus tour | +10 |
| Started application | +10 |
| Submitted application | +15 |
| Sibling currently enrolled | +15 |
| Legacy family (alumni parent) | +10 |
| Referred by current family | +10 |
| Opened 3+ emails | +5 |
| Visited portal 3+ times | +5 |
| Attended shadow day | +15 |
| Financial aid requested | -0 (neutral, tracked separately) |

## Appendix D: Notification Matrix

| Event | Admin In-App | Admin Email | Parent In-App | Parent Email | Parent SMS | Parent Push |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| New inquiry | ✅ | Configurable | — | ✅ Welcome | — | — |
| Application submitted | ✅ | ✅ | ✅ | ✅ Confirmation | Configurable | ✅ |
| Checklist item completed | ✅ | — | ✅ | — | — | — |
| Checklist item overdue | ✅ | — | ✅ | ✅ Reminder | Configurable | ✅ |
| Recommendation completed | ✅ | Configurable | ✅ | ✅ | — | ✅ |
| Event booking | ✅ | ✅ | ✅ | ✅ + ICS | Configurable | ✅ |
| Event reminder (24h) | — | — | ✅ | ✅ | ✅ | ✅ |
| Decision released | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contract sent | ✅ | — | ✅ | ✅ | Configurable | ✅ |
| Contract signed | ✅ | ✅ | ✅ | ✅ Receipt | — | — |
| Payment received | ✅ | ✅ | ✅ | ✅ Receipt | — | — |
| Payment overdue | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| New message from parent | ✅ | ✅ | — | — | — | — |
| New message from school | — | — | ✅ | ✅ | Configurable | ✅ |
| Waitlist spot offered | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
