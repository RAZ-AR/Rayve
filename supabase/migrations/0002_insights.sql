-- ============================================================
-- Rayve Phase 4 — Campaign Insights Cache
-- ============================================================
-- Adds two columns to campaigns so we can cache Meta Insights
-- data locally and avoid hammering the Meta API on every page load.

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS insights_json       JSONB,
  ADD COLUMN IF NOT EXISTS insights_fetched_at TIMESTAMPTZ;
