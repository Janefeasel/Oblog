import { useCallback } from 'react'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { usePublishedPosts } from '../hooks/useSupabaseQuery'
import { useRealtimePosts } from '../hooks/useRealtimePosts'
import { useInvalidatePosts } from '../hooks/useSupabaseQuery'
import PostCard from '../components/PostCard'
import { PostGridSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'

export default function UpcomingPage() {
  const invalidatePosts = useInvalidatePosts()

  useRealtimePosts(
    useCallback(() => invalidatePosts(), [invalidatePosts])
  )

  const { data: posts, isLoading } = usePublishedPosts()

  const upcomingContent = (posts || []).filter(
    (p) => p.category === 'trailer' || (p.category === 'news' && p.genre !== null)
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-cinema-500/10 p-3">
            <CalendarDaysIcon className="h-7 w-7 text-cinema-400" />
          </div>
          <div>
            <h1 className="font-heading text-4xl tracking-wide text-white sm:text-5xl">
              Upcoming Releases
            </h1>
            <p className="mt-1 text-surface-400">
              Stay ahead with release dates, trailers, and synopses for upcoming films.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <PostGridSkeleton count={6} />
      ) : upcomingContent.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingContent.map((post, i) => (
            <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="film"
          title="No upcoming releases yet"
          description="Trailer and release date posts will appear here."
        />
      )}
    </div>
  )
}
