/**
 * Supabase Edge Function: News Aggregation
 *
 * Fetches trending movies from TMDB API and inserts them into the posts table
 * as published, aggregated content. The RSS feed at /rss.xml automatically
 * picks up these new posts — no additional RSS work needed.
 *
 * Deployment:
 *   supabase functions deploy aggregate-news --no-verify-jwt
 *
 * Environment variables required:
 *   TMDB_API_KEY - Your TMDB API key (v3 auth)
 *   SUPABASE_URL - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (bypasses RLS)
 *
 * Schedule (cron):
 *   Option 1 — Supabase pg_cron: Run supabase/cron-setup.sql in SQL Editor
 *   Option 2 — GitHub Actions: Use curl to POST the function URL daily
 *   Option 3 — Manual:     curl -X POST https://<project>.supabase.co/functions/v1/aggregate-news
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

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

// Category mapping based on content type
function determineCategory(movie: TMDBMovie): string {
  if (movie.media_type === 'trailer') return 'trailer'
  if (movie.vote_average >= 7) return 'review'
  return 'news'
}

// Generate a unique slug from the movie title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// Map TMDB genre IDs to our genre system
function mapGenre(genreIds: number[]): string | null {
  for (const id of genreIds) {
    const genre = TMDB_GENRE_MAP[id]
    if (genre) return genre
  }
  return null
}

// Normalize star rating from TMDB's 10-point scale to our 5-point scale
function normalizeRating(voteAverage: number): number | null {
  if (voteAverage <= 0) return null
  return Math.round(voteAverage / 2)
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Authorization' } })
  }

  try {
    const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!TMDB_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch trending movies from TMDB
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!tmdbResponse.ok) {
      throw new Error(`TMDB API responded with ${tmdbResponse.status}`)
    }

    const tmdbData: TMDBResponse = await tmdbResponse.json()
    const movies = tmdbData.results || []

    // Also fetch now playing movies for upcoming releases
    const nowPlayingResponse = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
      { headers: { 'Accept': 'application/json' } }
    )

    let nowPlayingMovies: TMDBMovie[] = []
    if (nowPlayingResponse.ok) {
      const nowPlayingData: TMDBResponse = await nowPlayingResponse.json()
      nowPlayingMovies = nowPlayingData.results || []
    }

    // Combine and deduplicate by TMDB ID
    const allMovies = [...movies, ...nowPlayingMovies]
    const seenIds = new Set<number>()
    const uniqueMovies = allMovies.filter((movie) => {
      if (seenIds.has(movie.id)) return false
      seenIds.add(movie.id)
      return true
    })

    // Fetch existing slugs to avoid inserting duplicates
    const { data: existingPosts } = await supabase
      .from('posts')
      .select('slug')
      .eq('is_aggregated', true)

    const existingSlugs = new Set(existingPosts?.map((p: { slug: string }) => p.slug) || [])

    let insertedCount = 0
    let skippedCount = 0

    for (const movie of uniqueMovies) {
      const slug = `${slugify(movie.title)}-tmdb-${movie.id}`

      // Skip if already aggregated
      if (existingSlugs.has(slug)) {
        skippedCount++
        continue
      }

      const category = determineCategory(movie)
      const genre = mapGenre(movie.genre_ids)
      const starRating = category === 'review' ? normalizeRating(movie.vote_average) : null

      // Build excerpt from overview
      const excerpt = movie.overview
        ? movie.overview.slice(0, 200) + (movie.overview.length > 200 ? '…' : '')
        : `Latest trending movie: ${movie.title}`

      const featuredImage = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null

      // Build rich content from TMDB data
      const content = buildRichContent(movie)

      const { error } = await supabase
        .from('posts')
        .insert({
          title: movie.title,
          slug,
          content,
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
          seo_title: `${movie.title} - Movie News & Updates`,
          seo_description: excerpt,
          is_aggregated: true,
          source_name: 'TMDB',
          source_url: `https://www.themoviedb.org/movie/${movie.id}`,
        })

      if (error) {
        console.error(`Failed to insert ${movie.title}:`, error.message)
      } else {
        insertedCount++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        inserted: insertedCount,
        skipped: skippedCount,
        total: uniqueMovies.length,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Aggregation failed:', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        status: 500,
      }
    )
  }
})

/**
 * Build rich HTML content from TMDB movie data.
 */
function buildRichContent(movie: TMDBMovie): string {
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
