/**
 * Supabase Edge Function: RSS Feed
 *
 * Generates an RSS 2.0 feed of published posts for The Movie Desk.
 * Readers can subscribe in any RSS client (Feedly, Apple News, etc.).
 *
 * Deployment:
 *   supabase functions deploy rss-feed --no-verify-jwt
 *
 * Environment variables required:
 *   SITE_URL          - Public URL of your site (e.g., https://themoviedesk.com)
 *   SUPABASE_URL      - Supabase project URL
 *   SUPABASE_ANON_KEY - Supabase anon key
 *
 * The function is unauthenticated (--no-verify-jwt) so RSS readers can access it.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface Post {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  featured_image: string | null
  category: string
  genre: string | null
  star_rating: number | null
  post_date: string
  updated_at: string
  source_name: string | null
  source_url: string | null
}

/**
 * Build a valid RSS 2.0 feed from posts, following WordPress-style conventions.
 */
function buildRssFeed(posts: Post[], siteUrl: string): string {
  const now = new Date().toUTCString()
  const title = 'The Movie Desk'
  const description = 'Your definitive source for movie news, reviews, and industry insights. Curated for cinema enthusiasts.'
  const language = 'en-us'
  const feedUrl = `${siteUrl}/rss.xml`

  const items = posts.map((post) => {
    const postUrl = `${siteUrl}/category/${post.slug}`
    const pubDate = new Date(post.post_date).toUTCString()
    const category = post.category.charAt(0).toUpperCase() + post.category.slice(1)
    const author = post.source_name || 'The Movie Desk'
    const featuredImage = post.featured_image
      ? `<figure><img src="${escapeXml(post.featured_image)}" alt="${escapeXml(post.title)}" /></figure>`
      : ''

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <dc:creator><![CDATA[ ${author} ]]></dc:creator>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[ ${category} ]]></category>
      ${post.genre ? `<category><![CDATA[ ${post.genre} ]]></category>` : ''}
      <guid isPermaLink="false">${escapeXml(postUrl)}</guid>
      <description><![CDATA[
<p>${post.excerpt || ''}</p>
      ]]></description>
      <content:encoded><![CDATA[
${featuredImage}
<p>${post.excerpt || ''}</p>
${post.content ? safeCdata(post.content) : ''}
      ]]></content:encoded>
      ${post.star_rating ? `<media:rating>${post.star_rating}</media:rating>` : ''}
      <wfw:commentRss>${escapeXml(siteUrl)}/</wfw:commentRss>
      <slash:comments>0</slash:comments>
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
  xmlns:media="http://search.yahoo.com/mrss/"
>
  <channel>
    <title>${escapeXml(title)}</title>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <lastBuildDate>${now}</lastBuildDate>
    <language>${language}</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>The Movie Desk — Supabase Edge Function</generator>
    <image>
      <url>${escapeXml(siteUrl)}/favicon.svg</url>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(siteUrl)}</link>
      <width>64</width>
      <height>64</height>
    </image>
${items}
  </channel>
</rss>`
}

/**
 * Escape XML special characters to prevent injection.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Safely wrap content in CDATA by splitting on any `]]>` sequences.
 * Prevents XML parsing errors if post content accidentally contains the CDATA close marker.
 */
function safeCdata(content: string): string {
  return content.replace(/]]>/g, ']]]]><![CDATA[>')}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')
    const SITE_URL = Deno.env.get('SITE_URL') || 'https://themoviedesk.com'

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Fetch published posts, newest first
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, slug, content, excerpt, featured_image, category, genre, star_rating, post_date, updated_at, source_name, source_url')
      .eq('status', 'published')
      .order('post_date', { ascending: false })
      .limit(50)

    if (error) throw error

    const rssXml = buildRssFeed((posts || []) as Post[], SITE_URL)

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600',
      },
      status: 200,
    })
  } catch (error) {
    console.error('RSS feed generation failed:', error.message)

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Movie Desk</title>
    <link>https://themoviedesk.com</link>
    <description>RSS feed temporarily unavailable</description>
  </channel>
</rss>`,
      {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
        status: 200,
      }
    )
  }
})
