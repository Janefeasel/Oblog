import { useState, useCallback } from 'react'
import { StarIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { usePublishedPosts } from '../hooks/useSupabaseQuery'
import { useRealtimePosts } from '../hooks/useRealtimePosts'
import { useInvalidatePosts } from '../hooks/useSupabaseQuery'
import PostCard from '../components/PostCard'
import { PostGridSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import type { Post } from '../lib/database.types'

type SortBy = 'date' | 'rating'

export default function ReviewsPage() {
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const invalidatePosts = useInvalidatePosts()

  useRealtimePosts(
    useCallback(() => invalidatePosts(), [invalidatePosts])
  )

  const { data: posts, isLoading } = usePublishedPosts({ category: 'review' })

  const sortedPosts: Post[] = posts
    ? [...posts].sort((a, b) => {
        if (sortBy === 'rating') {
          const aRating = a.star_rating || 0
          const bRating = b.star_rating || 0
          return bRating - aRating
        }
        return new Date(b.post_date).getTime() - new Date(a.post_date).getTime()
      })
    : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-cinema-500/10 p-3">
            <StarIcon className="h-7 w-7 text-cinema-400" />
          </div>
          <div>
            <h1 className="font-heading text-4xl tracking-wide text-white sm:text-5xl">
              Movie Reviews
            </h1>
            <p className="mt-1 text-surface-400">
              In-depth reviews with star ratings, pros/cons, and critical analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="mb-8 flex items-center gap-3">
        <ArrowsUpDownIcon className="h-4 w-4 text-surface-500" />
        <span className="text-sm text-surface-400">Sort by:</span>
        <button
          onClick={() => setSortBy('date')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            sortBy === 'date'
              ? 'bg-cinema-500 text-black'
              : 'border border-surface-700 text-surface-300 hover:border-surface-600'
          }`}
        >
          Most Recent
        </button>
        <button
          onClick={() => setSortBy('rating')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            sortBy === 'rating'
              ? 'bg-cinema-500 text-black'
              : 'border border-surface-700 text-surface-300 hover:border-surface-600'
          }`}
        >
          Highest Rated
        </button>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <PostGridSkeleton count={6} />
      ) : sortedPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post, i) => (
            <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="reviews"
          title="No reviews yet"
          description="Review articles will appear here once published."
        />
      )}
    </div>
  )
}
