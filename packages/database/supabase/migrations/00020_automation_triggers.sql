-- Migration: 00020_automation_triggers
-- Description: Database triggers for event-driven automations

-- ============================================================================
-- Trigger when application status changes to 'submitted'
-- ============================================================================
CREATE OR REPLACE FUNCTION on_application_submitted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
    NEW.submitted_date = NOW();
    -- Record audit
    INSERT INTO audit_log (school_id, user_id, action, entity_type, entity_id, changes)
    VALUES (NEW.school_id, NEW.submitted_by, 'status_change', 'application', NEW.id,
      jsonb_build_object('status', jsonb_build_object('old', OLD.status, 'new', NEW.status)));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER application_submitted_trigger
  BEFORE UPDATE ON applications
  FOR EACH ROW
  WHEN (NEW.status = 'submitted' AND OLD.status != 'submitted')
  EXECUTE FUNCTION on_application_submitted();

-- ============================================================================
-- Trigger when recommendation is completed
-- ============================================================================
CREATE OR REPLACE FUNCTION on_recommendation_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
    NEW.submitted_at = NOW();
    -- Auto-complete linked checklist item
    UPDATE checklist_items
    SET status = 'completed', completed_at = NOW()
    WHERE application_id = NEW.application_id
      AND item_type = 'recommendation'
      AND data->>'recommendation_request_id' = NEW.id::text
      AND status != 'completed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recommendation_completed_trigger
  BEFORE UPDATE ON recommendation_requests
  FOR EACH ROW
  WHEN (NEW.status = 'submitted' AND OLD.status != 'submitted')
  EXECUTE FUNCTION on_recommendation_completed();

-- ============================================================================
-- Trigger when form is submitted to auto-complete checklist item
-- ============================================================================
CREATE OR REPLACE FUNCTION on_form_submitted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_complete = true AND OLD.is_complete = false THEN
    NEW.submitted_at = NOW();
    -- Auto-complete linked checklist item
    UPDATE checklist_items
    SET status = 'completed', completed_at = NOW()
    WHERE application_id = NEW.application_id
      AND item_type = 'form'
      AND data->>'form_submission_id' = NEW.id::text
      AND status != 'completed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER form_submitted_trigger
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  WHEN (NEW.is_complete = true AND OLD.is_complete = false)
  EXECUTE FUNCTION on_form_submitted();

-- ============================================================================
-- Trigger when event booking is confirmed to auto-complete checklist
-- ============================================================================
CREATE OR REPLACE FUNCTION on_event_booked()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    -- Increment booked count on slot
    UPDATE event_slots SET booked_count = booked_count + 1 WHERE id = NEW.slot_id;
    -- Auto-complete linked checklist item
    UPDATE checklist_items
    SET status = 'completed', completed_at = NOW()
    WHERE application_id = NEW.application_id
      AND item_type = 'interview'
      AND status != 'completed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_booked_trigger
  AFTER INSERT ON event_bookings
  FOR EACH ROW
  EXECUTE FUNCTION on_event_booked();

-- ============================================================================
-- Trigger when contract is fully signed (countersigned by school)
-- ============================================================================
CREATE OR REPLACE FUNCTION on_contract_signed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'countersigned' AND OLD.status != 'countersigned' THEN
    NEW.countersigned_at = NOW();
    -- Update application status to contract_signed
    UPDATE applications SET status = 'contract_signed' WHERE id = NEW.application_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contract_signed_trigger
  BEFORE UPDATE ON enrollment_contracts
  FOR EACH ROW
  WHEN (NEW.status = 'countersigned' AND OLD.status != 'countersigned')
  EXECUTE FUNCTION on_contract_signed();

-- ============================================================================
-- Trigger when payment succeeds
-- ============================================================================
CREATE OR REPLACE FUNCTION on_payment_succeeded()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'succeeded' AND OLD.status != 'succeeded' THEN
    NEW.paid_at = NOW();
    -- Auto-complete payment checklist item
    UPDATE checklist_items
    SET status = 'completed', completed_at = NOW()
    WHERE application_id = NEW.application_id
      AND item_type = 'fee'
      AND status != 'completed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_succeeded_trigger
  BEFORE UPDATE ON application_payments
  FOR EACH ROW
  WHEN (NEW.status = 'succeeded' AND OLD.status != 'succeeded')
  EXECUTE FUNCTION on_payment_succeeded();
