-- ============================================================
-- TEMPLATE — Cron Job: Automatic News Aggregation
--
-- Copy this template, fill in your values, then run in Supabase
-- SQL Editor. The actual file (cron-setup.sql) is gitignored
-- because it contains your service_role key.
--
-- This sets up a daily cron job that triggers the aggregate-news
-- Edge Function, which fetches trending movies from TMDB and
-- inserts them as published posts. The RSS feed at /rss.xml
-- automatically picks these up.
--
-- ⚠️ Prerequisites (run these in your terminal first):
--   1. npx supabase login
--   2. npx supabase functions deploy aggregate-news --no-verify-jwt
--   3. npx supabase secrets set TMDB_API_KEY=your-tmdb-key
--   4. npx supabase secrets set SUPABASE_URL=https://your-project.supabase.co
--   5. npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
--
-- How to use this template:
--   1. Copy this file to cron-setup.sql
--   2. Replace <YOUR_PROJECT_REF> and <your_service_role_key>
--   3. Run in Supabase Dashboard > SQL Editor
--
-- Where to find these values:
--   Project Settings > API > Project URL  → https://<PROJECT_REF>.supabase.co
--   Project Settings > API > service_role key
--
-- To view scheduled jobs:  SELECT * FROM cron.job;
-- To remove the job:       SELECT cron.unschedule('aggregate-news-daily');
-- ============================================================

-- Enable required extensions (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the aggregate-news function daily at 6:00 AM UTC
SELECT cron.schedule(
  'aggregate-news-daily',
  '0 6 * * *',
  $$
    SELECT net.http_post(
      url := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/aggregate-news',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer <your_service_role_key>'
      )
    ) AS request_id;
  $$
);

-- ============================================================
-- Alternative: Run every 6 hours
-- Uncomment below and comment out the daily job to activate:
-- ============================================================
-- SELECT cron.schedule(
--   'aggregate-news-6hourly',
--   '0 */6 * * *',
--   $$
--     SELECT net.http_post(
--       url := 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/aggregate-news',
--       headers := jsonb_build_object(
--         'Content-Type', 'application/json',
--         'Authorization', 'Bearer <your_service_role_key>'
--       )
--     ) AS request_id;
--   $$
-- );
