-- ============================================================
-- TEMPLATE — Cron Job: Automatic News Aggregation (Edge Function)
--
-- This sets up a daily cron job that triggers the aggregate-news
-- Edge Function. Before running this SQL, deploy the function:
--   1. npx supabase login
--   2. npx supabase link --project-ref YOUR_PROJECT_REF
--   3. npx supabase functions deploy aggregate-news --no-verify-jwt
--   4. npx supabase secrets set TMDB_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
--
-- Alternatively, use .github/workflows/daily-tmdb-seed.yml (recommended)
-- which runs the seed script via GitHub Actions without deploying a function.
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
