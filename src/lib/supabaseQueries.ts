/**
 * Supabase database query functions for the Movie Blog.
 *
 * These functions handle all CRUD operations for blog posts.
 * Ordering logic:
 * - Pinned posts appear first, ordered by sort_order ASC, then updated_at DESC
 * - Non-pinned posts appear below, ordered by sort_order ASC, then post_date DESC
 * - sort_order 0 means "no position set" so those fall back to date ordering
 */
import { supabase } from './supabase'
import type { Post, PostCategory, PostGenre, PostStatus, Database } from './database.types'

// Helper types for insert/update operations
// Using Database type since Post['Insert'] / Post['Update'] aren't direct properties
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']

export type PostsFilter = {
  status?: PostStatus
  category?: PostCategory
  genre?: PostGenre
  is_pinned?: boolean
  is_aggregated?: boolean
}

/**
 * Fetch published posts for the public feed.
 * Pinned posts first (by sort_order ASC, then updated_at DESC),
 * then non-pinned posts (by sort_order ASC, then post_date DESC).
 */
export async function getPublishedPosts(filter?: PostsFilter) {
  let query = supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('is_pinned', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false })

  if (filter?.category) query = query.eq('category', filter.category)
  if (filter?.genre) query = query.eq('genre', filter.genre)
  if (filter?.is_pinned !== undefined) query = query.eq('is_pinned', filter.is_pinned)
  if (filter?.is_aggregated !== undefined) query = query.eq('is_aggregated', filter.is_aggregated)

  const { data, error } = await query
  if (error) throw error

  const posts = (data || []) as Post[]

  const pinned = posts.filter((p) => p.is_pinned)
  const unpinned = posts.filter((p) => !p.is_pinned)

  const bySortOrderAndDate = (a: Post, b: Post, dateKey: 'post_date' | 'updated_at') => {
    const aOrder = a.sort_order || 999999
    const bOrder = b.sort_order || 999999
    if (aOrder !== bOrder) return aOrder - bOrder
    return new Date(b[dateKey]).getTime() - new Date(a[dateKey]).getTime()
  }

  pinned.sort((a, b) => bySortOrderAndDate(a, b, 'updated_at'))
  unpinned.sort((a, b) => bySortOrderAndDate(a, b, 'post_date'))

  return [...pinned, ...unpinned] as Post[]
}

/**
 * Fetch a single published post by slug for the public view.
 */
export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) throw error
  return data as Post
}

/**
 * Fetch all posts (including drafts) for the admin dashboard.
 */
export async function getAllPosts(filter?: PostsFilter) {
  let query = supabase
    .from('posts')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false })

  if (filter?.status) query = query.eq('status', filter.status)
  if (filter?.category) query = query.eq('category', filter.category)
  if (filter?.is_pinned !== undefined) query = query.eq('is_pinned', filter.is_pinned)
  if (filter?.is_aggregated !== undefined) query = query.eq('is_aggregated', filter.is_aggregated)

  const { data, error } = await query
  if (error) throw error

  const posts = (data || []) as Post[]

  const pinned = posts.filter((p) => p.is_pinned)
  const unpinned = posts.filter((p) => !p.is_pinned)

  const bySortOrderAndDate = (a: Post, b: Post, dateKey: 'post_date' | 'updated_at') => {
    const aOrder = a.sort_order || 999999
    const bOrder = b.sort_order || 999999
    if (aOrder !== bOrder) return aOrder - bOrder
    return new Date(b[dateKey]).getTime() - new Date(a[dateKey]).getTime()
  }

  pinned.sort((a, b) => bySortOrderAndDate(a, b, 'updated_at'))
  unpinned.sort((a, b) => bySortOrderAndDate(a, b, 'post_date'))

  return [...pinned, ...unpinned] as Post[]
}

/**
 * Fetch a single post by ID for editing in the dashboard.
 */
export async function getPostById(id: string) {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
  if (error) throw error
  return data as Post
}

/**
 * Create a new post.
 */
export async function createPost(post: PostInsert) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error }: any = await (supabase.from('posts') as any).insert(post).select().single()
  if (error) throw error
  return data as Post
}

/**
 * Update an existing post.
 */
export async function updatePost(id: string, updates: PostUpdate) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error }: any = await (supabase.from('posts') as any).update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data as Post
}

/**
 * Delete a post.
 */
export async function deletePost(id: string) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

/**
 * Duplicate a post (create a copy with a new slug and current timestamp).
 */
export async function duplicatePost(post: Post) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error }: any = await (supabase.from('posts') as any).insert({
    title: `${post.title} (Copy)`,
    slug: `${post.slug}-copy-${Date.now()}`,
    content: post.content,
    excerpt: post.excerpt,
    featured_image: post.featured_image,
    category: post.category,
    genre: post.genre,
    star_rating: post.star_rating,
    is_pinned: false,
    sort_order: 0,
    post_date: new Date().toISOString(),
    status: 'draft',
    seo_title: post.seo_title,
    seo_description: post.seo_description,
    is_aggregated: false,
    source_name: post.source_name,
    source_url: post.source_url,
    directed_by: post.directed_by,
    produced_by: post.produced_by,
  }).select().single()
  if (error) throw error
  return data as Post
}

/**
 * Search posts by title, excerpt, or content.
 */
export async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .or(
      `title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`
    )
    .order('post_date', { ascending: false })

  if (error) throw error
  return (data || []) as Post[]
}

/**
 * Toggle the pinned status of a post.
 */
export async function togglePinPost(id: string, isPinned: boolean) {
  return updatePost(id, { is_pinned: !isPinned })
}

/**
 * Toggle the publish/draft status of a post.
 */
export async function togglePostStatus(id: string, currentStatus: PostStatus) {
  const newStatus: PostStatus = currentStatus === 'published' ? 'draft' : 'published'
  return updatePost(id, { status: newStatus })
}

/**
 * Fetch posts by genre for genre-based browsing.
 */
export async function getPostsByGenre(genre: PostGenre) {
  return getPublishedPosts({ genre })
}

/**
 * Fetch aggregated/news posts with source attribution.
 */
export async function getAggregatedPosts() {
  return getPublishedPosts({ is_aggregated: true })
}
