-- Migration: 00017_indexes
-- Description: Performance indexes for foreign keys, status columns, common filters, and full-text search

-- ============================================================================
-- Schools
-- ============================================================================
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_school_type ON schools(school_type);
CREATE INDEX idx_schools_deleted_at ON schools(deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- Enrollment Seasons
-- ============================================================================
CREATE INDEX idx_enrollment_seasons_school_id ON enrollment_seasons(school_id);
CREATE INDEX idx_enrollment_seasons_active ON enrollment_seasons(school_id, is_active) WHERE is_active = true;

-- ============================================================================
-- User Profiles
-- ============================================================================
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_user_type ON user_profiles(user_type);

-- ============================================================================
-- School Staff
-- ============================================================================
CREATE INDEX idx_school_staff_school_id ON school_staff(school_id);
CREATE INDEX idx_school_staff_user_id ON school_staff(user_id);
CREATE INDEX idx_school_staff_active ON school_staff(school_id, is_active) WHERE is_active = true;

-- ============================================================================
-- Household Members
-- ============================================================================
CREATE INDEX idx_household_members_household_id ON household_members(household_id);
CREATE INDEX idx_household_members_user_id ON household_members(user_id);

-- ============================================================================
-- Students
-- ============================================================================
CREATE INDEX idx_students_household_id ON students(household_id);

-- ============================================================================
-- Applications (most heavily queried table)
-- ============================================================================
CREATE INDEX idx_applications_school_id ON applications(school_id);
CREATE INDEX idx_applications_season_id ON applications(season_id);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_submitted_by ON applications(submitted_by);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_school_season ON applications(school_id, season_id);
CREATE INDEX idx_applications_school_season_status ON applications(school_id, season_id, status);
CREATE INDEX idx_applications_school_grade ON applications(school_id, applying_for_grade);
CREATE INDEX idx_applications_deleted_at ON applications(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_applications_inquiry_date ON applications(inquiry_date);
CREATE INDEX idx_applications_submitted_date ON applications(submitted_date);

-- ============================================================================
-- Application Payments
-- ============================================================================
CREATE INDEX idx_application_payments_application_id ON application_payments(application_id);
CREATE INDEX idx_application_payments_status ON application_payments(status);

-- ============================================================================
-- Checklist Templates
-- ============================================================================
CREATE INDEX idx_checklist_templates_school_id ON checklist_templates(school_id);

-- ============================================================================
-- Checklist Template Items
-- ============================================================================
CREATE INDEX idx_checklist_template_items_template_id ON checklist_template_items(template_id);
CREATE INDEX idx_checklist_template_items_sort ON checklist_template_items(template_id, sort_order);

-- ============================================================================
-- Checklist Items
-- ============================================================================
CREATE INDEX idx_checklist_items_application_id ON checklist_items(application_id);
CREATE INDEX idx_checklist_items_status ON checklist_items(status);
CREATE INDEX idx_checklist_items_app_status ON checklist_items(application_id, status);

-- ============================================================================
-- Form Definitions
-- ============================================================================
CREATE INDEX idx_form_definitions_school_id ON form_definitions(school_id);
CREATE INDEX idx_form_definitions_form_type ON form_definitions(form_type);

-- ============================================================================
-- Form Submissions
-- ============================================================================
CREATE INDEX idx_form_submissions_form_id ON form_submissions(form_definition_id);
CREATE INDEX idx_form_submissions_application_id ON form_submissions(application_id);
CREATE INDEX idx_form_submissions_submitted_by ON form_submissions(submitted_by);

-- ============================================================================
-- Recommendation Requests
-- ============================================================================
CREATE INDEX idx_recommendation_requests_application_id ON recommendation_requests(application_id);
CREATE INDEX idx_recommendation_requests_status ON recommendation_requests(status);
CREATE INDEX idx_recommendation_requests_email ON recommendation_requests(recommender_email);

-- ============================================================================
-- Event Calendars
-- ============================================================================
CREATE INDEX idx_event_calendars_school_id ON event_calendars(school_id);
CREATE INDEX idx_event_calendars_type ON event_calendars(event_type);

-- ============================================================================
-- Event Slots
-- ============================================================================
CREATE INDEX idx_event_slots_calendar_id ON event_slots(calendar_id);
CREATE INDEX idx_event_slots_start_time ON event_slots(start_time);
CREATE INDEX idx_event_slots_available ON event_slots(calendar_id, is_available) WHERE is_available = true;

-- ============================================================================
-- Event Bookings
-- ============================================================================
CREATE INDEX idx_event_bookings_slot_id ON event_bookings(slot_id);
CREATE INDEX idx_event_bookings_application_id ON event_bookings(application_id);
CREATE INDEX idx_event_bookings_booked_by ON event_bookings(booked_by);
CREATE INDEX idx_event_bookings_status ON event_bookings(status);

-- ============================================================================
-- Review Rubrics
-- ============================================================================
CREATE INDEX idx_review_rubrics_school_id ON review_rubrics(school_id);

-- ============================================================================
-- Application Reviews
-- ============================================================================
CREATE INDEX idx_application_reviews_application_id ON application_reviews(application_id);
CREATE INDEX idx_application_reviews_reviewer_id ON application_reviews(reviewer_id);

-- ============================================================================
-- Decision Templates
-- ============================================================================
CREATE INDEX idx_decision_templates_school_id ON decision_templates(school_id);
CREATE INDEX idx_decision_templates_type ON decision_templates(decision_type);

-- ============================================================================
-- Enrollment Contracts
-- ============================================================================
CREATE INDEX idx_enrollment_contracts_application_id ON enrollment_contracts(application_id);
CREATE INDEX idx_enrollment_contracts_school_id ON enrollment_contracts(school_id);
CREATE INDEX idx_enrollment_contracts_status ON enrollment_contracts(status);

-- ============================================================================
-- Tuition Payments
-- ============================================================================
CREATE INDEX idx_tuition_payments_contract_id ON tuition_payments(contract_id);
CREATE INDEX idx_tuition_payments_status ON tuition_payments(status);

-- ============================================================================
-- Email Templates
-- ============================================================================
CREATE INDEX idx_email_templates_school_id ON email_templates(school_id);
CREATE INDEX idx_email_templates_type ON email_templates(template_type);

-- ============================================================================
-- Messages
-- ============================================================================
CREATE INDEX idx_messages_school_id ON messages(school_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_application_id ON messages(application_id);
CREATE INDEX idx_messages_status ON messages(status);

-- ============================================================================
-- Conversation Threads
-- ============================================================================
CREATE INDEX idx_conversation_threads_school_id ON conversation_threads(school_id);
CREATE INDEX idx_conversation_threads_application_id ON conversation_threads(application_id);
CREATE INDEX idx_conversation_threads_created_by ON conversation_threads(created_by);

-- ============================================================================
-- Conversation Messages
-- ============================================================================
CREATE INDEX idx_conversation_messages_thread_id ON conversation_messages(thread_id);
CREATE INDEX idx_conversation_messages_sender_id ON conversation_messages(sender_id);

-- ============================================================================
-- Documents
-- ============================================================================
CREATE INDEX idx_documents_school_id ON documents(school_id);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_type ON documents(document_type);

-- ============================================================================
-- Waitlist Entries
-- ============================================================================
CREATE INDEX idx_waitlist_entries_application_id ON waitlist_entries(application_id);
CREATE INDEX idx_waitlist_entries_school_season ON waitlist_entries(school_id, season_id);
CREATE INDEX idx_waitlist_entries_grade ON waitlist_entries(school_id, season_id, grade);
CREATE INDEX idx_waitlist_entries_status ON waitlist_entries(status);

-- ============================================================================
-- Audit Log
-- ============================================================================
CREATE INDEX idx_audit_log_school_id ON audit_log(school_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- ============================================================================
-- Enrollment Snapshots
-- ============================================================================
CREATE INDEX idx_enrollment_snapshots_school_season ON enrollment_snapshots(school_id, season_id);
CREATE INDEX idx_enrollment_snapshots_date ON enrollment_snapshots(snapshot_date);

-- ============================================================================
-- Tags
-- ============================================================================
CREATE INDEX idx_tags_school_id ON tags(school_id);

-- ============================================================================
-- Application Tags
-- ============================================================================
CREATE INDEX idx_application_tags_tag_id ON application_tags(tag_id);

-- ============================================================================
-- Full-text search indexes
-- ============================================================================
CREATE INDEX idx_schools_name_fts ON schools USING GIN (to_tsvector('english', name));

CREATE INDEX idx_user_profiles_name_fts ON user_profiles
  USING GIN (to_tsvector('english', first_name || ' ' || last_name));

CREATE INDEX idx_user_profiles_email_fts ON user_profiles
  USING GIN (to_tsvector('english', email));

CREATE INDEX idx_students_name_fts ON students
  USING GIN (to_tsvector('english', first_name || ' ' || last_name));
