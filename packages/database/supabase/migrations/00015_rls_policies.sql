-- Migration: 00015_rls_policies
-- Description: Row Level Security policies for all tables

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sibling_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tuition_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_tags ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Helper function: Check if user is super_admin
-- ============================================================================
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND user_type = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- Helper function: Check if user is staff at a given school
-- ============================================================================
CREATE OR REPLACE FUNCTION is_school_staff(p_school_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM school_staff
    WHERE school_id = p_school_id
      AND user_id = auth.uid()
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- Helper function: Get school IDs where user is staff
-- ============================================================================
CREATE OR REPLACE FUNCTION user_school_ids()
RETURNS SETOF UUID AS $$
  SELECT school_id FROM school_staff
  WHERE user_id = auth.uid() AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- Helper function: Get household IDs for a user
-- ============================================================================
CREATE OR REPLACE FUNCTION user_household_ids()
RETURNS SETOF UUID AS $$
  SELECT household_id FROM household_members
  WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================================
-- SCHOOLS
-- ============================================================================
-- Super admin: full access
CREATE POLICY "super_admin_schools" ON schools
  FOR ALL USING (is_super_admin());

-- Staff: can view their own school
CREATE POLICY "staff_view_school" ON schools
  FOR SELECT USING (id IN (SELECT user_school_ids()));

-- Parents: can view schools they have applications with
CREATE POLICY "parent_view_school" ON schools
  FOR SELECT USING (
    id IN (
      SELECT DISTINCT a.school_id FROM applications a
      WHERE a.submitted_by = auth.uid()
    )
  );

-- ============================================================================
-- SCHOOL GROUPS
-- ============================================================================
CREATE POLICY "super_admin_school_groups" ON school_groups
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_view_school_groups" ON school_groups
  FOR SELECT USING (
    id IN (
      SELECT sgm.school_group_id FROM school_group_members sgm
      WHERE sgm.school_id IN (SELECT user_school_ids())
    )
  );

-- ============================================================================
-- SCHOOL GROUP MEMBERS
-- ============================================================================
CREATE POLICY "super_admin_school_group_members" ON school_group_members
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_view_school_group_members" ON school_group_members
  FOR SELECT USING (school_id IN (SELECT user_school_ids()));

-- ============================================================================
-- ENROLLMENT SEASONS
-- ============================================================================
CREATE POLICY "super_admin_enrollment_seasons" ON enrollment_seasons
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_enrollment_seasons" ON enrollment_seasons
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "parent_view_active_seasons" ON enrollment_seasons
  FOR SELECT USING (is_active = true);

-- ============================================================================
-- USER PROFILES
-- ============================================================================
CREATE POLICY "super_admin_user_profiles" ON user_profiles
  FOR ALL USING (is_super_admin());

-- Users can view and update their own profile
CREATE POLICY "user_view_own_profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "user_update_own_profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Staff can view profiles of parents who applied to their school
CREATE POLICY "staff_view_applicant_profiles" ON user_profiles
  FOR SELECT USING (
    id IN (
      SELECT a.submitted_by FROM applications a
      WHERE a.school_id IN (SELECT user_school_ids())
    )
  );

-- Staff can view other staff at their school
CREATE POLICY "staff_view_school_staff_profiles" ON user_profiles
  FOR SELECT USING (
    id IN (
      SELECT ss.user_id FROM school_staff ss
      WHERE ss.school_id IN (SELECT user_school_ids())
    )
  );

-- ============================================================================
-- SCHOOL STAFF
-- ============================================================================
CREATE POLICY "super_admin_school_staff" ON school_staff
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_view_own_school_staff" ON school_staff
  FOR SELECT USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "admin_manage_school_staff" ON school_staff
  FOR ALL USING (
    school_id IN (
      SELECT school_id FROM school_staff
      WHERE user_id = auth.uid() AND is_active = true AND role IN ('system_admin', 'admin')
    )
  );

-- ============================================================================
-- HOUSEHOLDS
-- ============================================================================
CREATE POLICY "super_admin_households" ON households
  FOR ALL USING (is_super_admin());

CREATE POLICY "member_access_household" ON households
  FOR ALL USING (id IN (SELECT user_household_ids()));

CREATE POLICY "staff_view_applicant_households" ON households
  FOR SELECT USING (
    id IN (
      SELECT s.household_id FROM students s
      JOIN applications a ON a.student_id = s.id
      WHERE a.school_id IN (SELECT user_school_ids())
    )
  );

-- ============================================================================
-- HOUSEHOLD MEMBERS
-- ============================================================================
CREATE POLICY "super_admin_household_members" ON household_members
  FOR ALL USING (is_super_admin());

CREATE POLICY "member_access_household_members" ON household_members
  FOR ALL USING (household_id IN (SELECT user_household_ids()));

CREATE POLICY "staff_view_household_members" ON household_members
  FOR SELECT USING (
    household_id IN (
      SELECT s.household_id FROM students s
      JOIN applications a ON a.student_id = s.id
      WHERE a.school_id IN (SELECT user_school_ids())
    )
  );

-- ============================================================================
-- STUDENTS
-- ============================================================================
CREATE POLICY "super_admin_students" ON students
  FOR ALL USING (is_super_admin());

CREATE POLICY "parent_manage_students" ON students
  FOR ALL USING (household_id IN (SELECT user_household_ids()));

CREATE POLICY "staff_view_applicant_students" ON students
  FOR SELECT USING (
    id IN (
      SELECT a.student_id FROM applications a
      WHERE a.school_id IN (SELECT user_school_ids())
    )
  );

-- ============================================================================
-- SIBLING LINKS
-- ============================================================================
CREATE POLICY "super_admin_sibling_links" ON sibling_links
  FOR ALL USING (is_super_admin());

CREATE POLICY "parent_manage_sibling_links" ON sibling_links
  FOR ALL USING (
    student_id IN (
      SELECT id FROM students WHERE household_id IN (SELECT user_household_ids())
    )
  );

CREATE POLICY "staff_view_sibling_links" ON sibling_links
  FOR SELECT USING (
    student_id IN (
      SELECT a.student_id FROM applications a
      WHERE a.school_id IN (SELECT user_school_ids())
    )
  );

-- ============================================================================
-- APPLICATIONS
-- ============================================================================
CREATE POLICY "super_admin_applications" ON applications
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_applications" ON applications
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "parent_view_own_applications" ON applications
  FOR SELECT USING (submitted_by = auth.uid());

CREATE POLICY "parent_insert_applications" ON applications
  FOR INSERT WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "parent_update_own_applications" ON applications
  FOR UPDATE USING (submitted_by = auth.uid() AND status IN ('inquiry', 'prospect', 'started'));

-- ============================================================================
-- APPLICATION PAYMENTS
-- ============================================================================
CREATE POLICY "super_admin_application_payments" ON application_payments
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_application_payments" ON application_payments
  FOR ALL USING (
    application_id IN (
      SELECT id FROM applications WHERE school_id IN (SELECT user_school_ids())
    )
  );

CREATE POLICY "parent_view_own_payments" ON application_payments
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE submitted_by = auth.uid()
    )
  );

-- ============================================================================
-- CHECKLIST TEMPLATES
-- ============================================================================
CREATE POLICY "super_admin_checklist_templates" ON checklist_templates
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_checklist_templates" ON checklist_templates
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

-- ============================================================================
-- CHECKLIST TEMPLATE ITEMS
-- ============================================================================
CREATE POLICY "super_admin_checklist_template_items" ON checklist_template_items
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_checklist_template_items" ON checklist_template_items
  FOR ALL USING (
    template_id IN (
      SELECT id FROM checklist_templates WHERE school_id IN (SELECT user_school_ids())
    )
  );

-- ============================================================================
-- CHECKLIST ITEMS
-- ============================================================================
CREATE POLICY "super_admin_checklist_items" ON checklist_items
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_checklist_items" ON checklist_items
  FOR ALL USING (
    application_id IN (
      SELECT id FROM applications WHERE school_id IN (SELECT user_school_ids())
    )
  );

CREATE POLICY "parent_view_own_checklist_items" ON checklist_items
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE submitted_by = auth.uid()
    )
  );

CREATE POLICY "parent_update_own_checklist_items" ON checklist_items
  FOR UPDATE USING (
    application_id IN (
      SELECT id FROM applications WHERE submitted_by = auth.uid()
    )
  );

-- ============================================================================
-- FORM DEFINITIONS
-- ============================================================================
CREATE POLICY "super_admin_form_definitions" ON form_definitions
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_form_definitions" ON form_definitions
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "parent_view_active_forms" ON form_definitions
  FOR SELECT USING (is_active = true);

-- ============================================================================
-- FORM SUBMISSIONS
-- ============================================================================
CREATE POLICY "super_admin_form_submissions" ON form_submissions
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_view_form_submissions" ON form_submissions
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE school_id IN (SELECT user_school_ids())
    )
  );

CREATE POLICY "parent_manage_own_form_submissions" ON form_submissions
  FOR ALL USING (submitted_by = auth.uid());

-- ============================================================================
-- RECOMMENDATION REQUESTS
-- ============================================================================
CREATE POLICY "super_admin_recommendation_requests" ON recommendation_requests
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_recommendations" ON recommendation_requests
  FOR ALL USING (
    application_id IN (
      SELECT id FROM applications WHERE school_id IN (SELECT user_school_ids())
    )
  );

CREATE POLICY "parent_view_own_recommendations" ON recommendation_requests
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE submitted_by = auth.uid()
    )
  );

-- Public access via secure token (for recommenders without an account)
CREATE POLICY "public_access_via_token" ON recommendation_requests
  FOR SELECT USING (true);

CREATE POLICY "public_submit_via_token" ON recommendation_requests
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- ============================================================================
-- EVENT CALENDARS
-- ============================================================================
CREATE POLICY "super_admin_event_calendars" ON event_calendars
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_event_calendars" ON event_calendars
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "parent_view_active_calendars" ON event_calendars
  FOR SELECT USING (is_active = true);

-- ============================================================================
-- EVENT SLOTS
-- ============================================================================
CREATE POLICY "super_admin_event_slots" ON event_slots
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_event_slots" ON event_slots
  FOR ALL USING (
    calendar_id IN (
      SELECT id FROM event_calendars WHERE school_id IN (SELECT user_school_ids())
    )
  );

CREATE POLICY "parent_view_available_slots" ON event_slots
  FOR SELECT USING (is_available = true);

-- ============================================================================
-- EVENT BOOKINGS
-- ============================================================================
CREATE POLICY "super_admin_event_bookings" ON event_bookings
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_event_bookings" ON event_bookings
  FOR ALL USING (
    slot_id IN (
      SELECT es.id FROM event_slots es
      JOIN event_calendars ec ON ec.id = es.calendar_id
      WHERE ec.school_id IN (SELECT user_school_ids())
    )
  );

CREATE POLICY "parent_manage_own_bookings" ON event_bookings
  FOR ALL USING (booked_by = auth.uid());

-- ============================================================================
-- REVIEW RUBRICS
-- ============================================================================
CREATE POLICY "super_admin_review_rubrics" ON review_rubrics
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_review_rubrics" ON review_rubrics
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

-- ============================================================================
-- APPLICATION REVIEWS
-- ============================================================================
CREATE POLICY "super_admin_application_reviews" ON application_reviews
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_application_reviews" ON application_reviews
  FOR ALL USING (
    application_id IN (
      SELECT id FROM applications WHERE school_id IN (SELECT user_school_ids())
    )
  );

-- ============================================================================
-- DECISION TEMPLATES
-- ============================================================================
CREATE POLICY "super_admin_decision_templates" ON decision_templates
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_decision_templates" ON decision_templates
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

-- ============================================================================
-- ENROLLMENT CONTRACTS
-- ============================================================================
CREATE POLICY "super_admin_enrollment_contracts" ON enrollment_contracts
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_enrollment_contracts" ON enrollment_contracts
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "parent_view_own_contracts" ON enrollment_contracts
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE submitted_by = auth.uid()
    )
  );

CREATE POLICY "parent_sign_own_contracts" ON enrollment_contracts
  FOR UPDATE USING (
    application_id IN (
      SELECT id FROM applications WHERE submitted_by = auth.uid()
    )
    AND status IN ('sent', 'viewed')
  );

-- ============================================================================
-- TUITION PAYMENTS
-- ============================================================================
CREATE POLICY "super_admin_tuition_payments" ON tuition_payments
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_tuition_payments" ON tuition_payments
  FOR ALL USING (
    contract_id IN (
      SELECT id FROM enrollment_contracts WHERE school_id IN (SELECT user_school_ids())
    )
  );

CREATE POLICY "parent_view_own_tuition_payments" ON tuition_payments
  FOR SELECT USING (
    contract_id IN (
      SELECT ec.id FROM enrollment_contracts ec
      JOIN applications a ON a.id = ec.application_id
      WHERE a.submitted_by = auth.uid()
    )
  );

-- ============================================================================
-- EMAIL TEMPLATES
-- ============================================================================
CREATE POLICY "super_admin_email_templates" ON email_templates
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_email_templates" ON email_templates
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

-- ============================================================================
-- MESSAGES
-- ============================================================================
CREATE POLICY "super_admin_messages" ON messages
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_school_messages" ON messages
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "user_view_own_messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- ============================================================================
-- CONVERSATION THREADS
-- ============================================================================
CREATE POLICY "super_admin_conversation_threads" ON conversation_threads
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_conversation_threads" ON conversation_threads
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "parent_view_own_threads" ON conversation_threads
  FOR SELECT USING (
    created_by = auth.uid()
    OR application_id IN (
      SELECT id FROM applications WHERE submitted_by = auth.uid()
    )
  );

-- ============================================================================
-- CONVERSATION MESSAGES
-- ============================================================================
CREATE POLICY "super_admin_conversation_messages" ON conversation_messages
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_conversation_messages" ON conversation_messages
  FOR ALL USING (
    thread_id IN (
      SELECT id FROM conversation_threads WHERE school_id IN (SELECT user_school_ids())
    )
  );

CREATE POLICY "parent_view_own_conversation_messages" ON conversation_messages
  FOR SELECT USING (
    thread_id IN (
      SELECT id FROM conversation_threads
      WHERE created_by = auth.uid()
        OR application_id IN (
          SELECT id FROM applications WHERE submitted_by = auth.uid()
        )
    )
    AND is_internal = false
  );

CREATE POLICY "parent_insert_conversation_messages" ON conversation_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND thread_id IN (
      SELECT id FROM conversation_threads
      WHERE created_by = auth.uid()
        OR application_id IN (
          SELECT id FROM applications WHERE submitted_by = auth.uid()
        )
    )
  );

-- ============================================================================
-- DOCUMENTS
-- ============================================================================
CREATE POLICY "super_admin_documents" ON documents
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_documents" ON documents
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "parent_manage_own_documents" ON documents
  FOR ALL USING (uploaded_by = auth.uid());

-- ============================================================================
-- WAITLIST ENTRIES
-- ============================================================================
CREATE POLICY "super_admin_waitlist_entries" ON waitlist_entries
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_waitlist_entries" ON waitlist_entries
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

CREATE POLICY "parent_view_own_waitlist" ON waitlist_entries
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE submitted_by = auth.uid()
    )
  );

-- ============================================================================
-- AUDIT LOG
-- ============================================================================
CREATE POLICY "super_admin_audit_log" ON audit_log
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_view_audit_log" ON audit_log
  FOR SELECT USING (school_id IN (SELECT user_school_ids()));

-- ============================================================================
-- ENROLLMENT SNAPSHOTS
-- ============================================================================
CREATE POLICY "super_admin_enrollment_snapshots" ON enrollment_snapshots
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_view_enrollment_snapshots" ON enrollment_snapshots
  FOR SELECT USING (school_id IN (SELECT user_school_ids()));

-- ============================================================================
-- TAGS
-- ============================================================================
CREATE POLICY "super_admin_tags" ON tags
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_tags" ON tags
  FOR ALL USING (school_id IN (SELECT user_school_ids()));

-- ============================================================================
-- APPLICATION TAGS
-- ============================================================================
CREATE POLICY "super_admin_application_tags" ON application_tags
  FOR ALL USING (is_super_admin());

CREATE POLICY "staff_manage_application_tags" ON application_tags
  FOR ALL USING (
    application_id IN (
      SELECT id FROM applications WHERE school_id IN (SELECT user_school_ids())
    )
  );
