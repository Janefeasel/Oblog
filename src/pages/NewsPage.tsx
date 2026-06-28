import { useState, useCallback } from 'react'
import { NewspaperIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { usePublishedPosts } from '../hooks/useSupabaseQuery'
import { useRealtimePosts } from '../hooks/useRealtimePosts'
import { useInvalidatePosts } from '../hooks/useSupabaseQuery'
import PostCard from '../components/PostCard'
import { PostGridSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { capitalize } from '../lib/utils'
import type { PostGenre } from '../lib/database.types'

const genreOptions: PostGenre[] = [
  'action', 'comedy', 'drama', 'horror', 'sci-fi',
  'thriller', 'romance', 'animation', 'fantasy', 'documentary',
]

export default function NewsPage() {
  const [selectedGenre, setSelectedGenre] = useState<PostGenre | ''>('')
  const invalidatePosts = useInvalidatePosts()

  useRealtimePosts(
    useCallback(() => invalidatePosts(), [invalidatePosts])
  )

  const filterParams = selectedGenre
    ? { category: 'news' as const, genre: selectedGenre }
    : { category: 'news' as const }

  const { data: posts, isLoading } = usePublishedPosts(filterParams)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-cinema-500/10 p-3">
            <NewspaperIcon className="h-7 w-7 text-cinema-400" />
          </div>
          <div>
            <h1 className="font-heading text-4xl tracking-wide text-white sm:text-5xl">
              Movie News
            </h1>
            <p className="mt-1 text-surface-400">
              Stay up to date with the latest casting announcements, trailers, and industry updates.
            </p>
          </div>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <FunnelIcon className="h-4 w-4 text-surface-500" />
        <button
          onClick={() => setSelectedGenre('')}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
            selectedGenre === ''
              ? 'bg-cinema-500 text-black'
              : 'border border-surface-700 text-surface-300 hover:border-surface-600 hover:text-white'
          }`}
        >
          All
        </button>
        {genreOptions.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre === selectedGenre ? '' : genre)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${
              selectedGenre === genre
                ? 'bg-cinema-500 text-black'
                : 'border border-surface-700 text-surface-300 hover:border-surface-600 hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
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
          icon="news"
          title={selectedGenre ? `No ${capitalize(selectedGenre)} news` : 'No news found'}
          description={selectedGenre ? `No news articles in the ${selectedGenre} genre yet` : 'No news articles published yet'}
        />
      )}
    </div>
  )
}
