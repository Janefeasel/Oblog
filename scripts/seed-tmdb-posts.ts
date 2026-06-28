/**
 * Seed Script: Fetch Real TMDB Movie Data
 *
 * Replaces hardcoded seed posts with real trending movie data from TMDB.
 * Run this once to populate your Supabase database with real content,
 * which will then automatically appear in the RSS feed at /rss.xml.
 *
 * Prerequisites:
 *   1. Get a TMDB API key: https://www.themoviedb.org/settings/api
 *   2. Run schema.sql in Supabase SQL Editor to create the posts table
 *   3. Find your service_role key: Supabase Dashboard > Project Settings > API
 *   4. Ensure VITE_SUPABASE_URL is in your .env file
 *
 * Usage (pass env vars directly, no dotenv needed):
 *   TMDB_API_KEY=your-key VITE_SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/seed-tmdb-posts.ts
 *
 * Or with dotenv:
 *   TMDB_API_KEY=your-key SUPABASE_SERVICE_ROLE_KEY=your-key npx dotenv -e .env -- npx tsx scripts/seed-tmdb-posts.ts
 *
 * The script will:
 *   - Delete any existing hardcoded (non-aggregated) posts
 *   - Fetch trending + now-playing movies from TMDB
 *   - Insert them as published posts with proper categories
 *   - Show a summary of what was inserted
 *
 * Note: Uses SUPABASE_SERVICE_ROLE_KEY (not the anon key) to bypass RLS.
 * The anon key cannot insert or delete posts due to RLS policies.
 */

import { createClient } from '@supabase/supabase-js'

// ── Config ──────────────────────────────────────────────────────────────

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!TMDB_API_KEY) {
  console.error('\n  ❌ Missing TMDB_API_KEY')
  console.error('  Get one at: https://www.themoviedb.org/settings/api')
  console.error('  Then run: TMDB_API_KEY=your-key SUPABASE_SERVICE_ROLE_KEY=your-key npx tsx scripts/seed-tmdb-posts.ts\n')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\n  ❌ Missing Supabase credentials')
  console.error('  Set VITE_SUPABASE_URL in your .env file or pass it as an env var')
  console.error('  Pass SUPABASE_SERVICE_ROLE_KEY as an env var')
  console.error('  Find it at: Supabase Dashboard > Project Settings > API\n')
  process.exit(1)
}

// ── Types ───────────────────────────────────────────────────────────────

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
  media_type: string
  original_language: string
}

interface TMDBResponse {
  results: TMDBMovie[]
}

// Genre mapping from TMDB genre IDs to our slug-based genres
const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'action',
  12: 'adventure',
  16: 'animation',
  35: 'comedy',
  80: 'crime',
  99: 'documentary',
  18: 'drama',
  10751: 'fantasy',
  14: 'fantasy',
  36: 'history',
  27: 'horror',
  10402: 'musical',
  9648: 'mystery',
  10749: 'romance',
  878: 'sci-fi',
  10770: 'thriller',
  53: 'thriller',
  10752: 'war',
  37: 'western',
}

// ── Helpers ─────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function mapGenre(genreIds: number[]): string | null {
  for (const id of genreIds) {
    const genre = TMDB_GENRE_MAP[id]
    if (genre) return genre
  }
  return null
}

function normalizeRating(voteAverage: number): number | null {
  if (voteAverage <= 0) return null
  return Math.round(voteAverage / 2)
}

function determineCategory(movie: TMDBMovie): string {
  if (movie.vote_average >= 7) return 'review'
  return 'news'
}

function buildContent(movie: TMDBMovie): string {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null

  return `<h2>${movie.title}</h2>
${backdropUrl ? `<img src="${backdropUrl}" alt="${movie.title}" />` : ''}
<p>${movie.overview || 'No overview available.'}</p>
${posterUrl ? `<img src="${posterUrl}" alt="${movie.title} poster" />` : ''}
<p><strong>Release Date:</strong> ${movie.release_date || 'TBA'}</p>
<p><strong>TMDB Rating:</strong> ${movie.vote_average ? `${movie.vote_average}/10` : 'Not yet rated'}</p>
<p><em>This article was automatically aggregated from TMDB. For more details, visit the <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">TMDB page</a>.</em></p>`
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '…' : text
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  // Use service_role key to bypass RLS (anon key cannot insert/delete posts)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  console.log('\n  🎬 Fetching real TMDB trending movies...\n')

  // Step 1: Fetch trending movies
  const trendingRes = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`,
    { headers: { Accept: 'application/json' } }
  )

  if (!trendingRes.ok) {
    console.error(`  ❌ TMDB API error: ${trendingRes.status} ${trendingRes.statusText}`)
    process.exit(1)
  }

  const trendingData: TMDBResponse = await trendingRes.json()

  // Step 2: Fetch now playing movies
  const nowPlayingRes = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    { headers: { Accept: 'application/json' } }
  )

  let nowPlayingMovies: TMDBMovie[] = []
  if (nowPlayingRes.ok) {
    const nowPlayingData: TMDBResponse = await nowPlayingRes.json()
    nowPlayingMovies = nowPlayingData.results || []
  }

  // Step 3: Combine and deduplicate
  const allMovies = [...(trendingData.results || []), ...nowPlayingMovies]
  const seenIds = new Set<number>()
  const uniqueMovies = allMovies.filter((m) => {
    if (seenIds.has(m.id)) return false
    seenIds.add(m.id)
    return true
  })

  console.log(`  Found ${uniqueMovies.length} unique movies from TMDB\n`)

  // Step 4: Delete existing non-aggregated posts (the hardcoded seed data)
  console.log('  🗑️  Removing old hardcoded seed posts...')

  const { data: hardcodedPosts, error: fetchError } = await supabase
    .from('posts')
    .select('id, title, slug')
    .eq('is_aggregated', false)

  if (fetchError) {
    console.error(`  ❌ Failed to fetch existing posts: ${fetchError.message}`)
    process.exit(1)
  }

  if (hardcodedPosts && hardcodedPosts.length > 0) {
    const ids = hardcodedPosts.map((p: { id: string }) => p.id)
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .in('id', ids)

    if (deleteError) {
      console.error(`  ❌ Failed to delete old posts: ${deleteError.message}`)
      process.exit(1)
    }

    console.log(`  Removed ${ids.length} hardcoded posts\n`)
  } else {
    console.log('  No hardcoded posts to remove\n')
  }

  // Step 5: Fetch existing slugs to avoid duplicates
  const { data: existingPosts } = await supabase
    .from('posts')
    .select('slug')
    .eq('is_aggregated', true)

  const existingSlugs = new Set(existingPosts?.map((p: { slug: string }) => p.slug) || [])

  // Step 6: Insert real TMDB movie posts
  let inserted = 0
  let skipped = 0

  for (const movie of uniqueMovies.slice(0, 30)) {
    const slug = `${slugify(movie.title)}-tmdb-${movie.id}`

    if (existingSlugs.has(slug)) {
      skipped++
      continue
    }

    const category = determineCategory(movie)
    const genre = mapGenre(movie.genre_ids)
    const starRating = category === 'review' ? normalizeRating(movie.vote_average) : null
    const excerpt = movie.overview
      ? truncate(movie.overview, 200)
      : `Latest trending movie: ${movie.title}`

    const featuredImage = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null

    const { error } = await supabase
      .from('posts')
      .insert({
        title: movie.title,
        slug,
        content: buildContent(movie),
        excerpt,
        featured_image: featuredImage,
        category,
        genre,
        star_rating: starRating,
        is_pinned: false,
        sort_order: 0,
        post_date: movie.release_date
          ? new Date(movie.release_date).toISOString()
          : new Date().toISOString(),
        status: 'published',
        seo_title: `${movie.title} - Movie News`,
        seo_description: excerpt,
        is_aggregated: true,
        source_name: 'TMDB',
        source_url: `https://www.themoviedb.org/movie/${movie.id}`,
      })

    if (error) {
      console.error(`  ❌ Failed to insert "${movie.title}": ${error.message}`)
    } else {
      console.log(`  ✅ Inserted: ${movie.title}`)
      inserted++
    }

    // Small delay to avoid rate-limiting
    await new Promise((r) => setTimeout(r, 50))
  }

  // Step 7: Summary
  console.log('\n', '─'.repeat(40))
  console.log(`\n  📊 Summary:`)
  console.log(`     Inserted: ${inserted}`)
  console.log(`     Skipped:  ${skipped}`)
  console.log(`     Total:    ${uniqueMovies.length}`)
  console.log(`\n  The RSS feed at /rss.xml will now show real TMDB movie data!\n`)

  if (inserted === 0 && skipped === 0) {
    console.log('  ⚠️  No movies were processed. This might mean:')
    console.log('     - Your Supabase table doesn\'t exist yet (run schema.sql first)')
    console.log('     - Your service_role key doesn\'t have the right permissions')
    console.log('     - The posts table might be named differently')
    console.log()
  }
}

main().catch((err) => {
  console.error('\n  ❌ Unexpected error:', err.message, '\n')
  process.exit(1)
})
