// @admissions-compass/database types
// Comprehensive Database type interface matching all migration tables
// This file mirrors what `supabase gen types typescript` would produce

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          website_url: string | null;
          address: Json | null;
          phone: string | null;
          timezone: string;
          currency: string;
          school_type: 'day' | 'boarding' | 'day_boarding' | 'charter' | 'religious' | 'montessori' | 'other';
          grade_levels: Json;
          divisions: Json | null;
          settings: Json;
          subscription_tier: string;
          stripe_account_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          website_url?: string | null;
          address?: Json | null;
          phone?: string | null;
          timezone?: string;
          currency?: string;
          school_type: 'day' | 'boarding' | 'day_boarding' | 'charter' | 'religious' | 'montessori' | 'other';
          grade_levels: Json;
          divisions?: Json | null;
          settings?: Json;
          subscription_tier?: string;
          stripe_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          website_url?: string | null;
          address?: Json | null;
          phone?: string | null;
          timezone?: string;
          currency?: string;
          school_type?: 'day' | 'boarding' | 'day_boarding' | 'charter' | 'religious' | 'montessori' | 'other';
          grade_levels?: Json;
          divisions?: Json | null;
          settings?: Json;
          subscription_tier?: string;
          stripe_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      school_groups: {
        Row: {
          id: string;
          name: string;
          settings: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          settings?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          settings?: Json;
          created_at?: string;
        };
      };
      school_group_members: {
        Row: {
          school_group_id: string;
          school_id: string;
        };
        Insert: {
          school_group_id: string;
          school_id: string;
        };
        Update: {
          school_group_id?: string;
          school_id?: string;
        };
      };
      enrollment_seasons: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_active: boolean;
          settings: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          user_type: 'admin' | 'parent' | 'super_admin';
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          user_type: 'admin' | 'parent' | 'super_admin';
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          user_type?: 'admin' | 'parent' | 'super_admin';
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      school_staff: {
        Row: {
          id: string;
          school_id: string;
          user_id: string;
          role: 'system_admin' | 'admin' | 'user' | 'limited_user' | 'reviewer';
          permissions: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          user_id: string;
          role: 'system_admin' | 'admin' | 'user' | 'limited_user' | 'reviewer';
          permissions?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          user_id?: string;
          role?: 'system_admin' | 'admin' | 'user' | 'limited_user' | 'reviewer';
          permissions?: Json;
          is_active?: boolean;
          created_at?: string;
        };
      };
      households: {
        Row: {
          id: string;
          primary_address: Json | null;
          secondary_address: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          primary_address?: Json | null;
          secondary_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          primary_address?: Json | null;
          secondary_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      household_members: {
        Row: {
          id: string;
          household_id: string;
          user_id: string;
          relationship: 'parent' | 'guardian' | 'step_parent' | 'grandparent' | 'other';
          is_primary_contact: boolean;
          is_financial_contact: boolean;
          employer: string | null;
          occupation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          user_id: string;
          relationship: 'parent' | 'guardian' | 'step_parent' | 'grandparent' | 'other';
          is_primary_contact?: boolean;
          is_financial_contact?: boolean;
          employer?: string | null;
          occupation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          user_id?: string;
          relationship?: 'parent' | 'guardian' | 'step_parent' | 'grandparent' | 'other';
          is_primary_contact?: boolean;
          is_financial_contact?: boolean;
          employer?: string | null;
          occupation?: string | null;
          created_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          household_id: string;
          first_name: string;
          last_name: string;
          preferred_name: string | null;
          date_of_birth: string | null;
          gender: string | null;
          photo_url: string | null;
          current_school: string | null;
          current_grade: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          first_name: string;
          last_name: string;
          preferred_name?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          photo_url?: string | null;
          current_school?: string | null;
          current_grade?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          first_name?: string;
          last_name?: string;
          preferred_name?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          photo_url?: string | null;
          current_school?: string | null;
          current_grade?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      sibling_links: {
        Row: {
          student_id: string;
          sibling_id: string;
        };
        Insert: {
          student_id: string;
          sibling_id: string;
        };
        Update: {
          student_id?: string;
          sibling_id?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          school_id: string;
          season_id: string;
          student_id: string;
          submitted_by: string;
          application_type: 'standard' | 'sibling' | 'transfer' | 'international' | 're_enrollment' | 'early_admission';
          applying_for_grade: string;
          status:
            | 'inquiry'
            | 'prospect'
            | 'started'
            | 'submitted'
            | 'under_review'
            | 'waitlisted'
            | 'accepted'
            | 'denied'
            | 'deferred'
            | 'enrolled'
            | 'contract_sent'
            | 'contract_signed'
            | 'withdrawn'
            | 'declined_offer';
          status_history: Json;
          lead_source: string | null;
          lead_score: number;
          inquiry_date: string | null;
          submitted_date: string | null;
          decision: string | null;
          decision_date: string | null;
          decision_released_at: string | null;
          decision_letter_template_id: string | null;
          financial_aid_requested: boolean;
          financial_aid_amount_cents: number | null;
          notes: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          school_id: string;
          season_id: string;
          student_id: string;
          submitted_by: string;
          application_type?: 'standard' | 'sibling' | 'transfer' | 'international' | 're_enrollment' | 'early_admission';
          applying_for_grade: string;
          status?:
            | 'inquiry'
            | 'prospect'
            | 'started'
            | 'submitted'
            | 'under_review'
            | 'waitlisted'
            | 'accepted'
            | 'denied'
            | 'deferred'
            | 'enrolled'
            | 'contract_sent'
            | 'contract_signed'
            | 'withdrawn'
            | 'declined_offer';
          status_history?: Json;
          lead_source?: string | null;
          lead_score?: number;
          inquiry_date?: string | null;
          submitted_date?: string | null;
          decision?: string | null;
          decision_date?: string | null;
          decision_released_at?: string | null;
          decision_letter_template_id?: string | null;
          financial_aid_requested?: boolean;
          financial_aid_amount_cents?: number | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          school_id?: string;
          season_id?: string;
          student_id?: string;
          submitted_by?: string;
          application_type?: 'standard' | 'sibling' | 'transfer' | 'international' | 're_enrollment' | 'early_admission';
          applying_for_grade?: string;
          status?:
            | 'inquiry'
            | 'prospect'
            | 'started'
            | 'submitted'
            | 'under_review'
            | 'waitlisted'
            | 'accepted'
            | 'denied'
            | 'deferred'
            | 'enrolled'
            | 'contract_sent'
            | 'contract_signed'
            | 'withdrawn'
            | 'declined_offer';
          status_history?: Json;
          lead_source?: string | null;
          lead_score?: number;
          inquiry_date?: string | null;
          submitted_date?: string | null;
          decision?: string | null;
          decision_date?: string | null;
          decision_released_at?: string | null;
          decision_letter_template_id?: string | null;
          financial_aid_requested?: boolean;
          financial_aid_amount_cents?: number | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      application_payments: {
        Row: {
          id: string;
          application_id: string;
          amount_cents: number;
          currency: string;
          stripe_payment_intent_id: string | null;
          status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'waived';
          fee_waiver_code: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          amount_cents: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'waived';
          fee_waiver_code?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          amount_cents?: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'waived';
          fee_waiver_code?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
      };
      checklist_templates: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          description: string | null;
          application_type: 'standard' | 'sibling' | 'transfer' | 'international' | 're_enrollment' | 'early_admission' | null;
          grade_levels: Json | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          description?: string | null;
          application_type?: 'standard' | 'sibling' | 'transfer' | 'international' | 're_enrollment' | 'early_admission' | null;
          grade_levels?: Json | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          description?: string | null;
          application_type?: 'standard' | 'sibling' | 'transfer' | 'international' | 're_enrollment' | 'early_admission' | null;
          grade_levels?: Json | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      checklist_template_items: {
        Row: {
          id: string;
          template_id: string;
          title: string;
          description: string | null;
          item_type: 'form' | 'document' | 'recommendation' | 'interview' | 'test' | 'fee' | 'custom';
          is_required: boolean;
          sort_order: number;
          config: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          title: string;
          description?: string | null;
          item_type: 'form' | 'document' | 'recommendation' | 'interview' | 'test' | 'fee' | 'custom';
          is_required?: boolean;
          sort_order?: number;
          config?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string;
          title?: string;
          description?: string | null;
          item_type?: 'form' | 'document' | 'recommendation' | 'interview' | 'test' | 'fee' | 'custom';
          is_required?: boolean;
          sort_order?: number;
          config?: Json;
          created_at?: string;
        };
      };
      checklist_items: {
        Row: {
          id: string;
          application_id: string;
          template_item_id: string | null;
          title: string;
          description: string | null;
          item_type: 'form' | 'document' | 'recommendation' | 'interview' | 'test' | 'fee' | 'custom';
          status: 'pending' | 'in_progress' | 'completed' | 'waived' | 'not_applicable';
          is_required: boolean;
          sort_order: number;
          completed_at: string | null;
          completed_by: string | null;
          data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          template_item_id?: string | null;
          title: string;
          description?: string | null;
          item_type: 'form' | 'document' | 'recommendation' | 'interview' | 'test' | 'fee' | 'custom';
          status?: 'pending' | 'in_progress' | 'completed' | 'waived' | 'not_applicable';
          is_required?: boolean;
          sort_order?: number;
          completed_at?: string | null;
          completed_by?: string | null;
          data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          template_item_id?: string | null;
          title?: string;
          description?: string | null;
          item_type?: 'form' | 'document' | 'recommendation' | 'interview' | 'test' | 'fee' | 'custom';
          status?: 'pending' | 'in_progress' | 'completed' | 'waived' | 'not_applicable';
          is_required?: boolean;
          sort_order?: number;
          completed_at?: string | null;
          completed_by?: string | null;
          data?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      form_definitions: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          description: string | null;
          form_type: 'inquiry' | 'application' | 'supplemental' | 'parent_questionnaire' | 'student_questionnaire' | 'financial_aid' | 'custom';
          schema: Json;
          ui_schema: Json | null;
          version: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          description?: string | null;
          form_type: 'inquiry' | 'application' | 'supplemental' | 'parent_questionnaire' | 'student_questionnaire' | 'financial_aid' | 'custom';
          schema: Json;
          ui_schema?: Json | null;
          version?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          description?: string | null;
          form_type?: 'inquiry' | 'application' | 'supplemental' | 'parent_questionnaire' | 'student_questionnaire' | 'financial_aid' | 'custom';
          schema?: Json;
          ui_schema?: Json | null;
          version?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      form_submissions: {
        Row: {
          id: string;
          form_definition_id: string;
          application_id: string | null;
          submitted_by: string;
          data: Json;
          is_complete: boolean;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          form_definition_id: string;
          application_id?: string | null;
          submitted_by: string;
          data?: Json;
          is_complete?: boolean;
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          form_definition_id?: string;
          application_id?: string | null;
          submitted_by?: string;
          data?: Json;
          is_complete?: boolean;
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recommendation_requests: {
        Row: {
          id: string;
          application_id: string;
          checklist_item_id: string | null;
          recommender_name: string;
          recommender_email: string;
          recommender_relationship: 'teacher' | 'counselor' | 'coach' | 'principal' | 'clergy' | 'family_friend' | 'other';
          secure_token: string;
          status: 'pending' | 'sent' | 'opened' | 'submitted' | 'expired' | 'cancelled';
          form_definition_id: string | null;
          response_data: Json | null;
          sent_at: string | null;
          opened_at: string | null;
          submitted_at: string | null;
          expires_at: string | null;
          reminder_sent_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          checklist_item_id?: string | null;
          recommender_name: string;
          recommender_email: string;
          recommender_relationship: 'teacher' | 'counselor' | 'coach' | 'principal' | 'clergy' | 'family_friend' | 'other';
          secure_token?: string;
          status?: 'pending' | 'sent' | 'opened' | 'submitted' | 'expired' | 'cancelled';
          form_definition_id?: string | null;
          response_data?: Json | null;
          sent_at?: string | null;
          opened_at?: string | null;
          submitted_at?: string | null;
          expires_at?: string | null;
          reminder_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          checklist_item_id?: string | null;
          recommender_name?: string;
          recommender_email?: string;
          recommender_relationship?: 'teacher' | 'counselor' | 'coach' | 'principal' | 'clergy' | 'family_friend' | 'other';
          secure_token?: string;
          status?: 'pending' | 'sent' | 'opened' | 'submitted' | 'expired' | 'cancelled';
          form_definition_id?: string | null;
          response_data?: Json | null;
          sent_at?: string | null;
          opened_at?: string | null;
          submitted_at?: string | null;
          expires_at?: string | null;
          reminder_sent_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_calendars: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          description: string | null;
          event_type: 'tour' | 'open_house' | 'interview' | 'assessment' | 'shadow_day' | 'orientation' | 'custom';
          location: string | null;
          duration_minutes: number;
          max_attendees: number | null;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          description?: string | null;
          event_type: 'tour' | 'open_house' | 'interview' | 'assessment' | 'shadow_day' | 'orientation' | 'custom';
          location?: string | null;
          duration_minutes?: number;
          max_attendees?: number | null;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          description?: string | null;
          event_type?: 'tour' | 'open_house' | 'interview' | 'assessment' | 'shadow_day' | 'orientation' | 'custom';
          location?: string | null;
          duration_minutes?: number;
          max_attendees?: number | null;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_slots: {
        Row: {
          id: string;
          calendar_id: string;
          start_time: string;
          end_time: string;
          capacity: number;
          booked_count: number;
          is_available: boolean;
          staff_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          calendar_id: string;
          start_time: string;
          end_time: string;
          capacity?: number;
          booked_count?: number;
          is_available?: boolean;
          staff_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          calendar_id?: string;
          start_time?: string;
          end_time?: string;
          capacity?: number;
          booked_count?: number;
          is_available?: boolean;
          staff_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      event_bookings: {
        Row: {
          id: string;
          slot_id: string;
          application_id: string | null;
          booked_by: string;
          attendee_count: number;
          status: 'confirmed' | 'cancelled' | 'no_show' | 'completed';
          notes: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slot_id: string;
          application_id?: string | null;
          booked_by: string;
          attendee_count?: number;
          status?: 'confirmed' | 'cancelled' | 'no_show' | 'completed';
          notes?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slot_id?: string;
          application_id?: string | null;
          booked_by?: string;
          attendee_count?: number;
          status?: 'confirmed' | 'cancelled' | 'no_show' | 'completed';
          notes?: string | null;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      review_rubrics: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          description: string | null;
          criteria: Json;
          max_score: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          description?: string | null;
          criteria?: Json;
          max_score?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          description?: string | null;
          criteria?: Json;
          max_score?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      application_reviews: {
        Row: {
          id: string;
          application_id: string;
          reviewer_id: string;
          rubric_id: string | null;
          scores: Json;
          total_score: number | null;
          recommendation: 'strong_accept' | 'accept' | 'borderline' | 'deny' | 'waitlist' | null;
          comments: string | null;
          is_complete: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          reviewer_id: string;
          rubric_id?: string | null;
          scores?: Json;
          total_score?: number | null;
          recommendation?: 'strong_accept' | 'accept' | 'borderline' | 'deny' | 'waitlist' | null;
          comments?: string | null;
          is_complete?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          reviewer_id?: string;
          rubric_id?: string | null;
          scores?: Json;
          total_score?: number | null;
          recommendation?: 'strong_accept' | 'accept' | 'borderline' | 'deny' | 'waitlist' | null;
          comments?: string | null;
          is_complete?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      decision_templates: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          decision_type: 'accepted' | 'denied' | 'waitlisted' | 'deferred';
          subject: string;
          body_template: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          decision_type: 'accepted' | 'denied' | 'waitlisted' | 'deferred';
          subject: string;
          body_template: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          decision_type?: 'accepted' | 'denied' | 'waitlisted' | 'deferred';
          subject?: string;
          body_template?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollment_contracts: {
        Row: {
          id: string;
          application_id: string;
          school_id: string;
          template_url: string | null;
          contract_url: string | null;
          tuition_amount_cents: number;
          financial_aid_amount_cents: number;
          net_tuition_cents: number;
          deposit_amount_cents: number;
          status: 'draft' | 'sent' | 'viewed' | 'signed' | 'countersigned' | 'voided' | 'expired';
          sent_at: string | null;
          viewed_at: string | null;
          signed_at: string | null;
          signed_by: string | null;
          countersigned_at: string | null;
          countersigned_by: string | null;
          expires_at: string | null;
          signature_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          school_id: string;
          template_url?: string | null;
          contract_url?: string | null;
          tuition_amount_cents: number;
          financial_aid_amount_cents?: number;
          deposit_amount_cents?: number;
          status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'countersigned' | 'voided' | 'expired';
          sent_at?: string | null;
          viewed_at?: string | null;
          signed_at?: string | null;
          signed_by?: string | null;
          countersigned_at?: string | null;
          countersigned_by?: string | null;
          expires_at?: string | null;
          signature_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          school_id?: string;
          template_url?: string | null;
          contract_url?: string | null;
          tuition_amount_cents?: number;
          financial_aid_amount_cents?: number;
          deposit_amount_cents?: number;
          status?: 'draft' | 'sent' | 'viewed' | 'signed' | 'countersigned' | 'voided' | 'expired';
          sent_at?: string | null;
          viewed_at?: string | null;
          signed_at?: string | null;
          signed_by?: string | null;
          countersigned_at?: string | null;
          countersigned_by?: string | null;
          expires_at?: string | null;
          signature_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tuition_payments: {
        Row: {
          id: string;
          contract_id: string;
          amount_cents: number;
          currency: string;
          payment_type: 'deposit' | 'tuition' | 'fee' | 'refund';
          stripe_payment_intent_id: string | null;
          status: 'pending' | 'succeeded' | 'failed' | 'refunded';
          due_date: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          amount_cents: number;
          currency?: string;
          payment_type: 'deposit' | 'tuition' | 'fee' | 'refund';
          stripe_payment_intent_id?: string | null;
          status: 'pending' | 'succeeded' | 'failed' | 'refunded';
          due_date?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          contract_id?: string;
          amount_cents?: number;
          currency?: string;
          payment_type?: 'deposit' | 'tuition' | 'fee' | 'refund';
          stripe_payment_intent_id?: string | null;
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded';
          due_date?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
      };
      email_templates: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          subject: string;
          body_html: string;
          body_text: string | null;
          template_type:
            | 'inquiry_confirmation'
            | 'application_received'
            | 'status_update'
            | 'recommendation_request'
            | 'event_confirmation'
            | 'event_reminder'
            | 'decision_notification'
            | 'contract_sent'
            | 'payment_receipt'
            | 'checklist_reminder'
            | 'general'
            | 'custom';
          variables: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          subject: string;
          body_html: string;
          body_text?: string | null;
          template_type:
            | 'inquiry_confirmation'
            | 'application_received'
            | 'status_update'
            | 'recommendation_request'
            | 'event_confirmation'
            | 'event_reminder'
            | 'decision_notification'
            | 'contract_sent'
            | 'payment_receipt'
            | 'checklist_reminder'
            | 'general'
            | 'custom';
          variables?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          subject?: string;
          body_html?: string;
          body_text?: string | null;
          template_type?:
            | 'inquiry_confirmation'
            | 'application_received'
            | 'status_update'
            | 'recommendation_request'
            | 'event_confirmation'
            | 'event_reminder'
            | 'decision_notification'
            | 'contract_sent'
            | 'payment_receipt'
            | 'checklist_reminder'
            | 'general'
            | 'custom';
          variables?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          school_id: string;
          sender_id: string;
          recipient_id: string;
          template_id: string | null;
          application_id: string | null;
          channel: 'email' | 'in_app' | 'sms';
          subject: string | null;
          body_html: string | null;
          body_text: string | null;
          status: 'queued' | 'sent' | 'delivered' | 'opened' | 'failed' | 'bounced';
          sent_at: string | null;
          opened_at: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          sender_id: string;
          recipient_id: string;
          template_id?: string | null;
          application_id?: string | null;
          channel?: 'email' | 'in_app' | 'sms';
          subject?: string | null;
          body_html?: string | null;
          body_text?: string | null;
          status?: 'queued' | 'sent' | 'delivered' | 'opened' | 'failed' | 'bounced';
          sent_at?: string | null;
          opened_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          sender_id?: string;
          recipient_id?: string;
          template_id?: string | null;
          application_id?: string | null;
          channel?: 'email' | 'in_app' | 'sms';
          subject?: string | null;
          body_html?: string | null;
          body_text?: string | null;
          status?: 'queued' | 'sent' | 'delivered' | 'opened' | 'failed' | 'bounced';
          sent_at?: string | null;
          opened_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      conversation_threads: {
        Row: {
          id: string;
          school_id: string;
          application_id: string | null;
          subject: string;
          status: 'open' | 'closed' | 'archived';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          application_id?: string | null;
          subject: string;
          status?: 'open' | 'closed' | 'archived';
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          application_id?: string | null;
          subject?: string;
          status?: 'open' | 'closed' | 'archived';
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversation_messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          body: string;
          attachments: Json;
          is_internal: boolean;
          read_by: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_id: string;
          body: string;
          attachments?: Json;
          is_internal?: boolean;
          read_by?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          sender_id?: string;
          body?: string;
          attachments?: Json;
          is_internal?: boolean;
          read_by?: Json;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          school_id: string;
          application_id: string | null;
          checklist_item_id: string | null;
          uploaded_by: string;
          file_name: string;
          file_type: string;
          file_size_bytes: number;
          storage_path: string;
          bucket: string;
          document_type:
            | 'transcript'
            | 'report_card'
            | 'test_score'
            | 'recommendation'
            | 'birth_certificate'
            | 'immunization'
            | 'photo'
            | 'financial'
            | 'iep'
            | 'evaluation'
            | 'essay'
            | 'other';
          status: 'uploaded' | 'processing' | 'verified' | 'rejected';
          verified_by: string | null;
          verified_at: string | null;
          notes: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          application_id?: string | null;
          checklist_item_id?: string | null;
          uploaded_by: string;
          file_name: string;
          file_type: string;
          file_size_bytes: number;
          storage_path: string;
          bucket?: string;
          document_type:
            | 'transcript'
            | 'report_card'
            | 'test_score'
            | 'recommendation'
            | 'birth_certificate'
            | 'immunization'
            | 'photo'
            | 'financial'
            | 'iep'
            | 'evaluation'
            | 'essay'
            | 'other';
          status?: 'uploaded' | 'processing' | 'verified' | 'rejected';
          verified_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          application_id?: string | null;
          checklist_item_id?: string | null;
          uploaded_by?: string;
          file_name?: string;
          file_type?: string;
          file_size_bytes?: number;
          storage_path?: string;
          bucket?: string;
          document_type?:
            | 'transcript'
            | 'report_card'
            | 'test_score'
            | 'recommendation'
            | 'birth_certificate'
            | 'immunization'
            | 'photo'
            | 'financial'
            | 'iep'
            | 'evaluation'
            | 'essay'
            | 'other';
          status?: 'uploaded' | 'processing' | 'verified' | 'rejected';
          verified_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      waitlist_entries: {
        Row: {
          id: string;
          application_id: string;
          school_id: string;
          season_id: string;
          grade: string;
          position: number;
          status: 'active' | 'offered' | 'accepted' | 'declined' | 'expired' | 'removed';
          offered_at: string | null;
          response_deadline: string | null;
          responded_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          school_id: string;
          season_id: string;
          grade: string;
          position: number;
          status?: 'active' | 'offered' | 'accepted' | 'declined' | 'expired' | 'removed';
          offered_at?: string | null;
          response_deadline?: string | null;
          responded_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          school_id?: string;
          season_id?: string;
          grade?: string;
          position?: number;
          status?: 'active' | 'offered' | 'accepted' | 'declined' | 'expired' | 'removed';
          offered_at?: string | null;
          response_deadline?: string | null;
          responded_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          school_id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          changes: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          changes?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string;
          changes?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      enrollment_snapshots: {
        Row: {
          id: string;
          school_id: string;
          season_id: string;
          snapshot_date: string;
          grade: string;
          inquiry_count: number;
          prospect_count: number;
          started_count: number;
          submitted_count: number;
          under_review_count: number;
          waitlisted_count: number;
          accepted_count: number;
          denied_count: number;
          enrolled_count: number;
          withdrawn_count: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          season_id: string;
          snapshot_date: string;
          grade: string;
          inquiry_count?: number;
          prospect_count?: number;
          started_count?: number;
          submitted_count?: number;
          under_review_count?: number;
          waitlisted_count?: number;
          accepted_count?: number;
          denied_count?: number;
          enrolled_count?: number;
          withdrawn_count?: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          season_id?: string;
          snapshot_date?: string;
          grade?: string;
          inquiry_count?: number;
          prospect_count?: number;
          started_count?: number;
          submitted_count?: number;
          under_review_count?: number;
          waitlisted_count?: number;
          accepted_count?: number;
          denied_count?: number;
          enrolled_count?: number;
          withdrawn_count?: number;
          metadata?: Json;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
      };
      application_tags: {
        Row: {
          application_id: string;
          tag_id: string;
          added_by: string | null;
          created_at: string;
        };
        Insert: {
          application_id: string;
          tag_id: string;
          added_by?: string | null;
          created_at?: string;
        };
        Update: {
          application_id?: string;
          tag_id?: string;
          added_by?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_school_staff: {
        Args: { p_school_id: string };
        Returns: boolean;
      };
      user_school_ids: {
        Args: Record<string, never>;
        Returns: string[];
      };
      user_household_ids: {
        Args: Record<string, never>;
        Returns: string[];
      };
      instantiate_checklist: {
        Args: { p_application_id: string; p_template_id: string };
        Returns: Database['public']['Tables']['checklist_items']['Row'][];
      };
      calculate_lead_score: {
        Args: { p_application_id: string };
        Returns: number;
      };
      record_audit: {
        Args: {
          p_school_id: string;
          p_user_id: string;
          p_action: string;
          p_entity_type: string;
          p_entity_id: string;
          p_changes?: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ============================================================================
// Convenience type aliases
// ============================================================================
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Table row type aliases for direct import
export type School = Tables<'schools'>;
export type SchoolGroup = Tables<'school_groups'>;
export type SchoolGroupMember = Tables<'school_group_members'>;
export type EnrollmentSeason = Tables<'enrollment_seasons'>;
export type UserProfile = Tables<'user_profiles'>;
export type SchoolStaff = Tables<'school_staff'>;
export type Household = Tables<'households'>;
export type HouseholdMember = Tables<'household_members'>;
export type Student = Tables<'students'>;
export type SiblingLink = Tables<'sibling_links'>;
export type Application = Tables<'applications'>;
export type ApplicationPayment = Tables<'application_payments'>;
export type ChecklistTemplate = Tables<'checklist_templates'>;
export type ChecklistTemplateItem = Tables<'checklist_template_items'>;
export type ChecklistItem = Tables<'checklist_items'>;
export type FormDefinition = Tables<'form_definitions'>;
export type FormSubmission = Tables<'form_submissions'>;
export type RecommendationRequest = Tables<'recommendation_requests'>;
export type EventCalendar = Tables<'event_calendars'>;
export type EventSlot = Tables<'event_slots'>;
export type EventBooking = Tables<'event_bookings'>;
export type ReviewRubric = Tables<'review_rubrics'>;
export type ApplicationReview = Tables<'application_reviews'>;
export type DecisionTemplate = Tables<'decision_templates'>;
export type EnrollmentContract = Tables<'enrollment_contracts'>;
export type TuitionPayment = Tables<'tuition_payments'>;
export type EmailTemplate = Tables<'email_templates'>;
export type Message = Tables<'messages'>;
export type ConversationThread = Tables<'conversation_threads'>;
export type ConversationMessage = Tables<'conversation_messages'>;
export type Document = Tables<'documents'>;
export type WaitlistEntry = Tables<'waitlist_entries'>;
export type AuditLogEntry = Tables<'audit_log'>;
export type EnrollmentSnapshot = Tables<'enrollment_snapshots'>;
export type Tag = Tables<'tags'>;
export type ApplicationTag = Tables<'application_tags'>;

// Enum-like types extracted from CHECK constraints
export type SchoolType = School['school_type'];
export type UserType = UserProfile['user_type'];
export type StaffRole = SchoolStaff['role'];
export type HouseholdRelationship = HouseholdMember['relationship'];
export type ApplicationType = Application['application_type'];
export type ApplicationStatus = Application['status'];
export type PaymentStatus = ApplicationPayment['status'];
export type ChecklistItemType = ChecklistItem['item_type'];
export type ChecklistItemStatus = ChecklistItem['status'];
export type FormType = FormDefinition['form_type'];
export type RecommenderRelationship = RecommendationRequest['recommender_relationship'];
export type RecommendationStatus = RecommendationRequest['status'];
export type EventType = EventCalendar['event_type'];
export type BookingStatus = EventBooking['status'];
export type ReviewRecommendation = NonNullable<ApplicationReview['recommendation']>;
export type DecisionType = DecisionTemplate['decision_type'];
export type ContractStatus = EnrollmentContract['status'];
export type TuitionPaymentType = TuitionPayment['payment_type'];
export type EmailTemplateType = EmailTemplate['template_type'];
export type MessageChannel = Message['channel'];
export type MessageStatus = Message['status'];
export type ThreadStatus = ConversationThread['status'];
export type DocumentType = Document['document_type'];
export type DocumentStatus = Document['status'];
export type WaitlistStatus = WaitlistEntry['status'];
