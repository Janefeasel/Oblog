/**
 * Database type definitions for the Movie Blog.
 * These types correspond to the Supabase PostgreSQL schema.
 */
export type PostCategory = 'news' | 'review' | 'feature' | 'trailer' | 'interview'
export type PostStatus = 'published' | 'draft'
export type PostGenre =
  | 'action'
  | 'comedy'
  | 'drama'
  | 'horror'
  | 'sci-fi'
  | 'thriller'
  | 'romance'
  | 'animation'
  | 'documentary'
  | 'fantasy'
  | 'mystery'
  | 'musical'
  | 'war'
  | 'western'
  | 'crime'
  | 'adventure'

export interface Post {
  id: string
  title: string
  slug: string
  content: string // JSON string from TipTap editor
  excerpt: string
  featured_image: string | null
  category: PostCategory
  genre: PostGenre | null
  star_rating: number | null
  is_pinned: boolean
  sort_order: number
  post_date: string // ISO timestamp
  status: PostStatus
  seo_title: string | null
  seo_description: string | null
  directed_by: string | null
  produced_by: string | null
  is_aggregated: boolean
  source_name: string | null
  source_url: string | null
  created_at: string
  updated_at: string
}

/**
 * Schema for Supabase type generation.
 * This matches the SQL schema defined in the project README.
 */
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Functions: {}
  }
}
