/**
 * React Query (TanStack Query) hooks for Supabase data fetching.
 *
 * These hooks provide caching, automatic refetching, and stale data management.
 * Combined with useRealtimePosts, the cache is invalidated in real-time whenever
 * changes are made from any source (admin dashboard, aggregation function, etc.).
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPublishedPosts,
  getPostBySlug,
  getAllPosts,
  getPostById,
  createPost as createPostQuery,
  updatePost as updatePostQuery,
  deletePost as deletePostQuery,
  duplicatePost as duplicatePostQuery,
  searchPosts as searchPostsQuery,
  togglePinPost,
  togglePostStatus,
  getPostsByGenre,
  type PostsFilter,
} from '../lib/supabaseQueries'
import type { Post, PostGenre, PostStatus, Database } from '../lib/database.types'

// Helper types matching the Database schema
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']

const QUERY_KEY_POSTS = 'posts'
const QUERY_KEY_POST = 'post'

/**
 * Hook for fetching published posts (public feed).
 */
export function usePublishedPosts(filter?: PostsFilter) {
  return useQuery({
    queryKey: [QUERY_KEY_POSTS, 'published', filter],
    queryFn: () => getPublishedPosts(filter),
  })
}

/**
 * Hook for fetching a single post by slug (public view).
 */
export function usePostBySlug(slug: string) {
  return useQuery({
    queryKey: [QUERY_KEY_POST, slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  })
}

/**
 * Hook for fetching all posts including drafts (admin dashboard).
 */
export function useAllPosts(filter?: PostsFilter) {
  return useQuery({
    queryKey: [QUERY_KEY_POSTS, 'all', filter],
    queryFn: () => getAllPosts(filter),
  })
}

/**
 * Hook for fetching a single post by ID (admin editor).
 */
export function usePostById(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY_POST, 'id', id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  })
}

/**
 * Hook for searching published posts.
 */
export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: [QUERY_KEY_POSTS, 'search', query],
    queryFn: () => searchPostsQuery(query),
    enabled: query.length > 0,
  })
}

/**
 * Hook for fetching posts by genre.
 */
export function usePostsByGenre(genre: PostGenre) {
  return useQuery({
    queryKey: [QUERY_KEY_POSTS, 'genre', genre],
    queryFn: () => getPostsByGenre(genre),
    enabled: !!genre,
  })
}

/**
 * Helper to invalidate all post queries (used after mutations and real-time events).
 */
export function useInvalidatePosts() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY_POSTS] })
}

/**
 * Mutation hook for creating a new post.
 */
export function useCreatePost() {
  const invalidatePosts = useInvalidatePosts()

  return useMutation({
    mutationFn: (post: PostInsert) => createPostQuery(post),
    onSuccess: invalidatePosts,
  })
}

/**
 * Mutation hook for updating an existing post.
 */
export function useUpdatePost() {
  const invalidatePosts = useInvalidatePosts()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: PostUpdate }) =>
      updatePostQuery(id, updates),
    onSuccess: invalidatePosts,
  })
}

/**
 * Mutation hook for deleting a post.
 *
 * Uses optimistic updates: immediately removes the post from cache,
 * then rolls back if the server request fails.
 * NOTE: useQueryClient() is called at the top level of the hook,
 * NOT inside the mutation callbacks, to avoid React hooks violations.
 */
export function useDeletePost() {
  const queryClient = useQueryClient()
  const invalidatePosts = useInvalidatePosts()

  return useMutation({
    mutationFn: (id: string) => deletePostQuery(id),
    // Optimistic update: immediately remove from cache
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY_POSTS] })
      const previousPosts = queryClient.getQueryData([QUERY_KEY_POSTS])
      queryClient.setQueryData([QUERY_KEY_POSTS], (old: Post[] | undefined) =>
        old ? old.filter((p) => p.id !== id) : []
      )
      return { previousPosts }
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData([QUERY_KEY_POSTS], context.previousPosts)
      }
    },
    onSettled: invalidatePosts,
  })
}

/**
 * Mutation hook for duplicating a post.
 */
export function useDuplicatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: Post) => duplicatePostQuery(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_POSTS] })
    },
  })
}

/**
 * Mutation hook for toggling the pinned status of a post.
 */
export function useTogglePinPost() {
  const invalidatePosts = useInvalidatePosts()

  return useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      togglePinPost(id, isPinned),
    onSuccess: invalidatePosts,
  })
}

/**
 * Mutation hook for toggling the publish/draft status of a post.
 */
export function useTogglePostStatus() {
  const invalidatePosts = useInvalidatePosts()

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: PostStatus }) =>
      togglePostStatus(id, currentStatus),
    onSuccess: invalidatePosts,
  })
}
