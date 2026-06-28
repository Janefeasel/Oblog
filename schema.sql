-- ============================================================
-- Movie Blog — Full Database Schema
-- Run this in the Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing table to start fresh (safe to re-run)
DROP TABLE IF EXISTS posts CASCADE;

-- Create the posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  category TEXT NOT NULL DEFAULT 'news' CHECK (category IN ('news', 'review', 'feature', 'trailer', 'interview')),
  genre TEXT CHECK (genre IN ('action', 'comedy', 'drama', 'horror', 'sci-fi', 'thriller', 'romance', 'animation', 'documentary', 'fantasy', 'mystery', 'musical', 'war', 'western', 'crime', 'adventure')),
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
  is_pinned BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  post_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  seo_title TEXT,
  seo_description TEXT,
  directed_by TEXT,
  produced_by TEXT,
  is_aggregated BOOLEAN DEFAULT FALSE,
  source_name TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_pinned ON posts(is_pinned);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_genre ON posts(genre);
CREATE INDEX idx_posts_post_date ON posts(post_date DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_is_aggregated ON posts(is_aggregated);

-- Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public can only read published posts
CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  USING (status = 'published');

-- Authenticated users can read all posts (including drafts)
CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert posts
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Enable Realtime (this is what makes live sync work)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- ============================================================
-- Admin User
-- Create via: Authentication > Users > Add User
--   Email:    editor@movieblog.com
--   Password: account
-- ============================================================
