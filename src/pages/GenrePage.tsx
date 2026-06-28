import { useParams } from 'react-router-dom'
import { useCallback } from 'react'
import { FilmIcon } from '@heroicons/react/24/outline'
import { usePublishedPosts } from '../hooks/useSupabaseQuery'
import { useRealtimePosts } from '../hooks/useRealtimePosts'
import { useInvalidatePosts } from '../hooks/useSupabaseQuery'
import PostCard from '../components/PostCard'
import { PostGridSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { capitalize, getGenreColor } from '../lib/utils'
import type { PostGenre } from '../lib/database.types'

const validGenres: PostGenre[] = [
  'action', 'comedy', 'drama', 'horror', 'sci-fi',
  'thriller', 'romance', 'animation', 'documentary', 'fantasy',
  'mystery', 'musical', 'war', 'western', 'crime', 'adventure',
]

export default function GenrePage() {
  const { genre } = useParams<{ genre: string }>()
  const invalidatePosts = useInvalidatePosts()

  useRealtimePosts(
    useCallback(() => invalidatePosts(), [invalidatePosts])
  )

  const isValidGenre = genre && validGenres.includes(genre as PostGenre)
  const { data: posts, isLoading } = usePublishedPosts(
    isValidGenre ? { genre: genre as PostGenre } : undefined
  )

  if (!isValidGenre) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          icon="genre"
          title="Genre not found"
          description="The genre you're looking for doesn't exist."
          action={{ label: 'Back to Home', to: '/' }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <span className={`rounded-xl px-3 py-2 text-sm font-medium capitalize ${getGenreColor(genre)}`}>
            <FilmIcon className="mr-1.5 inline h-5 w-5" />
            {capitalize(genre)}
          </span>
          <div>
            <h1 className="font-heading text-4xl tracking-wide text-white sm:text-5xl">
              {capitalize(genre)}
            </h1>
            <p className="mt-1 text-surface-400">
              Browse all {genre} movie content — news, reviews, trailers, and more.
            </p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <PostGridSkeleton count={6} />
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="film"
          title={`No ${genre} content yet`}
          description={`Check back soon for new posts in the ${genre} genre.`}
        />
      )}
    </div>
  )
}
