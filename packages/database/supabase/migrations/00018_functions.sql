-- Migration: 00018_functions
-- Description: Stored functions for checklist instantiation, lead scoring, and audit logging

-- ============================================================================
-- instantiate_checklist: Creates checklist_items from a template for an application
-- ============================================================================
CREATE OR REPLACE FUNCTION instantiate_checklist(
  p_application_id UUID,
  p_template_id UUID
)
RETURNS SETOF checklist_items AS $$
DECLARE
  v_item checklist_template_items%ROWTYPE;
  v_new_item checklist_items%ROWTYPE;
BEGIN
  -- Validate application exists
  IF NOT EXISTS (SELECT 1 FROM applications WHERE id = p_application_id) THEN
    RAISE EXCEPTION 'Application % not found', p_application_id;
  END IF;

  -- Validate template exists
  IF NOT EXISTS (SELECT 1 FROM checklist_templates WHERE id = p_template_id) THEN
    RAISE EXCEPTION 'Checklist template % not found', p_template_id;
  END IF;

  -- Create a checklist item for each template item
  FOR v_item IN
    SELECT * FROM checklist_template_items
    WHERE template_id = p_template_id
    ORDER BY sort_order
  LOOP
    INSERT INTO checklist_items (
      application_id,
      template_item_id,
      title,
      description,
      item_type,
      status,
      is_required,
      sort_order,
      data
    ) VALUES (
      p_application_id,
      v_item.id,
      v_item.title,
      v_item.description,
      v_item.item_type,
      'pending',
      v_item.is_required,
      v_item.sort_order,
      v_item.config
    )
    RETURNING * INTO v_new_item;

    RETURN NEXT v_new_item;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- calculate_lead_score: Recalculates the lead score for an application
-- Score is based on: completeness of checklist, engagement (events, forms),
-- timing, and financial aid status
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_lead_score(p_application_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_total_items INTEGER;
  v_completed_items INTEGER;
  v_has_event_booking BOOLEAN;
  v_has_recommendation BOOLEAN;
  v_form_submissions INTEGER;
  v_app applications%ROWTYPE;
BEGIN
  -- Get the application
  SELECT * INTO v_app FROM applications WHERE id = p_application_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application % not found', p_application_id;
  END IF;

  -- Base score from application status (0-30 points)
  v_score := v_score + CASE v_app.status
    WHEN 'inquiry' THEN 5
    WHEN 'prospect' THEN 10
    WHEN 'started' THEN 15
    WHEN 'submitted' THEN 25
    WHEN 'under_review' THEN 30
    ELSE 0
  END;

  -- Checklist completion (0-30 points)
  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
  INTO v_total_items, v_completed_items
  FROM checklist_items
  WHERE application_id = p_application_id;

  IF v_total_items > 0 THEN
    v_score := v_score + ((v_completed_items::NUMERIC / v_total_items) * 30)::INTEGER;
  END IF;

  -- Event engagement (0-15 points)
  SELECT EXISTS (
    SELECT 1 FROM event_bookings
    WHERE application_id = p_application_id AND status IN ('confirmed', 'completed')
  ) INTO v_has_event_booking;

  IF v_has_event_booking THEN
    v_score := v_score + 15;
  END IF;

  -- Recommendation submitted (0-10 points)
  SELECT EXISTS (
    SELECT 1 FROM recommendation_requests
    WHERE application_id = p_application_id AND status = 'submitted'
  ) INTO v_has_recommendation;

  IF v_has_recommendation THEN
    v_score := v_score + 10;
  END IF;

  -- Form submissions (0-10 points)
  SELECT COUNT(*) INTO v_form_submissions
  FROM form_submissions
  WHERE application_id = p_application_id AND is_complete = true;

  v_score := v_score + LEAST(v_form_submissions * 5, 10);

  -- Financial aid (0-5 points for transparency)
  IF v_app.financial_aid_requested IS NOT NULL THEN
    v_score := v_score + 5;
  END IF;

  -- Clamp to 0-100
  v_score := GREATEST(0, LEAST(100, v_score));

  -- Update the application
  UPDATE applications SET lead_score = v_score WHERE id = p_application_id;

  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- record_audit: Adds an entry to the audit log
-- ============================================================================
CREATE OR REPLACE FUNCTION record_audit(
  p_school_id UUID,
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_changes JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO audit_log (
    school_id,
    user_id,
    action,
    entity_type,
    entity_id,
    changes
  ) VALUES (
    p_school_id,
    p_user_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_changes
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
