-- Migration: 00019_cron_jobs
-- Description: pg_cron setup for scheduled background jobs

-- Enable pg_cron extension (Supabase provides this)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Daily enrollment metrics snapshot at 6:00 AM UTC
SELECT cron.schedule('snapshot-enrollment-metrics', '0 6 * * *',
  $$SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/snapshot-metrics',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))
  )$$
);

-- Send checklist reminders daily at 1:00 PM UTC (8AM EST)
SELECT cron.schedule('send-checklist-reminders', '0 13 * * *',
  $$SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/send-reminders',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')),
    body := '{"type": "checklist"}'::jsonb
  )$$
);

-- Send recommendation reminders daily at 2:00 PM UTC
SELECT cron.schedule('send-recommendation-reminders', '0 14 * * *',
  $$SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/send-reminders',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')),
    body := '{"type": "recommendation"}'::jsonb
  )$$
);

-- Check for scheduled decision releases every 5 minutes
SELECT cron.schedule('release-decisions', '*/5 * * * *',
  $$SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/release-decisions',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))
  )$$
);

-- Calculate lead scores hourly
SELECT cron.schedule('calculate-lead-scores', '0 * * * *',
  $$SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/calculate-lead-scores',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))
  )$$
);

-- Expire waitlist entries daily at midnight UTC
SELECT cron.schedule('expire-waitlist', '0 0 * * *',
  $$SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/expire-waitlist',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))
  )$$
);

-- Cleanup expired tokens daily at 2 AM UTC
SELECT cron.schedule('cleanup-tokens', '0 2 * * *',
  $$SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/cleanup-tokens',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'))
  )$$
);
