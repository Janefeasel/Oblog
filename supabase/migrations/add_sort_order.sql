-- ============================================================
-- Migration: Add sort_order column for admin position control
--
-- Allows admins to set a numeric sort order for posts.
-- Sorting logic: pinned posts by sort_order ASC, then
-- non-pinned posts by sort_order ASC, with date fallback.
--
-- Run this in Supabase Dashboard > SQL Editor
-- Safe to re-run (uses IF NOT EXISTS)
-- ============================================================

ALTER TABLE posts ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Index for efficient sorting by sort_order
CREATE INDEX IF NOT EXISTS idx_posts_sort_order ON posts(sort_order ASC);
