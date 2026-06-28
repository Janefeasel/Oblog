import { useSearchParams } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useSearchPosts } from '../hooks/useSupabaseQuery'
import PostCard from '../components/PostCard'
import { PostGridSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data: results, isLoading } = useSearchPosts(query)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-cinema-500/10 p-3">
            <MagnifyingGlassIcon className="h-7 w-7 text-cinema-400" />
          </div>
          <div>
            <h1 className="font-heading text-4xl tracking-wide text-white sm:text-5xl">
              Search Results
            </h1>
            {query && (
              <p className="mt-1 text-surface-400">
                Showing results for "<span className="text-white font-medium">{query}</span>"
              </p>
            )}
          </div>
        </div>
      </div>

      {!query ? (
        <EmptyState
          icon="search"
          title="Enter a search term"
          description="Use the search bar above to find content by title, actor, director, or keyword."
        />
      ) : isLoading ? (
        <PostGridSkeleton count={6} />
      ) : results && results.length > 0 ? (
        <>
          <p className="mb-6 text-sm text-surface-400">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((post, i) => (
              <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon="search"
          title="No results found"
          description={`No posts match your search for "${query}". Try different keywords or browse categories.`}
        />
      )}
    </div>
  )
}
