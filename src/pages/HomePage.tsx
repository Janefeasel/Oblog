import { Link } from 'react-router-dom'
import { ArrowRightIcon, FilmIcon, CalendarDaysIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { usePublishedPosts } from '../hooks/useSupabaseQuery'
import { useRealtimePosts } from '../hooks/useRealtimePosts'
import { useInvalidatePosts } from '../hooks/useSupabaseQuery'
import PostCard from '../components/PostCard'
import { PostGridSkeleton, SidebarSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'
import { formatDate, getCategoryColor, getStarsArray } from '../lib/utils'
import { useCallback } from 'react'

const exploreLinks = [
  { to: '/news', label: 'News', icon: NewspaperIcon },
  { to: '/reviews', label: 'Reviews', icon: StarIcon },
]

const genreTags = [
  'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror',
  'Thriller', 'Romance', 'Animation', 'Fantasy', 'Documentary',
]

export default function HomePage() {
  const { data: posts, isLoading } = usePublishedPosts()
  const invalidatePosts = useInvalidatePosts()

  useRealtimePosts(
    useCallback(() => invalidatePosts(), [invalidatePosts])
  )

  const pinnedPosts = (posts || []).filter((p) => p.is_pinned)
  const [heroPost, ...secondaryPinned] = pinnedPosts
  const regularPosts = (posts || []).filter((p) => !p.is_pinned)
  const latestReviews = regularPosts.filter((p) => p.category === 'review').slice(0, 4)
  const latestNews = regularPosts.filter((p) => p.category === 'news').slice(0, 6)
  const sidePosts = regularPosts.slice(0, 6)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero skeleton */}
        <div className="mb-16 overflow-hidden rounded-2xl bg-surface-900">
          <div className="skeleton aspect-[21/9] rounded-none" />
        </div>
        <div className="mb-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-surface-900">
              <div className="skeleton aspect-[16/9] rounded-none" />
            </div>
          ))}
        </div>
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="skeleton mb-6 h-5 w-40" />
            <PostGridSkeleton count={4} />
          </div>
          <SidebarSkeleton />
        </div>
      </div>
    )
  }

  const hasContent = posts && posts.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ── Hero Section ── */}
      {heroPost && (
        <section className="mb-16 animate-fade-in">
          <div className="overflow-hidden rounded-2xl bg-surface-900 transition-all duration-300 card-shadow">
            <Link
              to={`/category/${heroPost.slug}`}
              className="group relative block"
            >
              {/* Hero Image */}
              <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[3/1]">
                {heroPost.featured_image ? (
                  <img
                    src={heroPost.featured_image}
                    alt={heroPost.title}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                    loading="eager"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface-900">
                    <FilmIcon className="h-16 w-16 text-surface-800" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/60 to-surface-950/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-surface-950/40 to-transparent" />
              </div>

              {/* Hero Content */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-8 lg:p-12">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium capitalize ${getCategoryColor(heroPost.category)}`}>
                    {heroPost.category}
                  </span>
                  <span className="text-xs text-surface-400/80">{formatDate(heroPost.post_date)}</span>
                  {heroPost.source_name && <span className="text-xs text-surface-500">· Via {heroPost.source_name}</span>}
                </div>
                <h1 className="font-heading text-3xl tracking-wide text-white transition-colors duration-200 group-hover:text-cinema-400 sm:text-4xl lg:text-5xl max-w-3xl">
                  {heroPost.title}
                </h1>
                {heroPost.excerpt && (
                  <p className="mt-2 max-w-2xl text-sm text-surface-300/80 sm:text-base line-clamp-2">
                    {heroPost.excerpt}
                  </p>
                )}
                {heroPost.star_rating && heroPost.category === 'review' && (
                  <div className="mt-3 flex items-center gap-0.5">
                    {getStarsArray(heroPost.star_rating).map((type, i) => (
                      <StarIcon key={i} className={`h-5 w-5 ${type === 'full' ? 'fill-cinema-400 text-cinema-400' : 'text-surface-600'}`} />
                    ))}
                    <span className="ml-2 text-sm font-medium text-cinema-400">{heroPost.star_rating}/5</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Secondary Pinned Posts */}
          {secondaryPinned.length > 0 && (
            <div className={`mt-6 grid gap-5 ${secondaryPinned.length === 1 ? 'sm:grid-cols-1 lg:grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {secondaryPinned.map((post, i) => (
                <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {!hasContent ? (
        <EmptyState icon="film" title="No posts yet" description="Check back soon for the latest movie news." />
      ) : (
        <div className="grid gap-12 lg:grid-cols-3">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-14">
            {/* Latest Reviews */}
            {latestReviews.length > 0 && (
              <section className="animate-fade-up">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <StarIcon className="h-4 w-4 text-amber-400" />
                    </div>
                    <h2 className="text-sm font-semibold tracking-wide text-white uppercase">Reviews</h2>
                  </div>
                  <Link
                    to="/reviews"
                    className="flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                  >
                    View all <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {latestReviews.map((post, i) => (
                    <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Latest News */}
            {latestNews.length > 0 && (
              <section className="animate-fade-up">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <NewspaperIcon className="h-4 w-4 text-blue-400" />
                    </div>
                    <h2 className="text-sm font-semibold tracking-wide text-white uppercase">News</h2>
                  </div>
                  <Link
                    to="/news"
                    className="flex items-center gap-1.5 text-sm text-surface-400 transition-colors hover:text-white"
                  >
                    View all <ArrowRightIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {latestNews.map((post, i) => (
                    <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Features, Interviews & Trailers */}
            {regularPosts.filter(p => !['review', 'news'].includes(p.category)).length > 0 && (
              <section className="animate-fade-up">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                    <FilmIcon className="h-4 w-4 text-purple-400" />
                  </div>
                  <h2 className="text-sm font-semibold tracking-wide text-white uppercase">More</h2>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {regularPosts.filter(p => !['review', 'news'].includes(p.category)).slice(0, 4).map((post, i) => (
                    <div key={post.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-10">
            {/* Recent Posts */}
            {sidePosts.length > 0 && (
              <div className="animate-fade-up">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDaysIcon className="h-4 w-4 text-surface-400" />
                  <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Recent</h3>
                </div>
                <div className="space-y-1">
                  {sidePosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/category/${post.slug}`}
                      className="group flex items-center justify-between rounded-lg px-3 py-2.5 -mx-3 transition-colors hover:bg-surface-800/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-surface-300 transition-colors group-hover:text-white line-clamp-1">{post.title}</p>
                        <p className="text-xs text-surface-600 mt-0.5">{formatDate(post.post_date)}</p>
                      </div>
                      <span className={`ml-3 flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Top Reviews (compact) */}
            {latestReviews.length > 0 && (
              <div className="animate-fade-up">
                <div className="mb-4 flex items-center gap-2">
                  <StarIcon className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Top Reviews</h3>
                </div>
                <div className="space-y-3">
                  {latestReviews.slice(0, 3).map((review) => (
                    <Link
                      key={review.id}
                      to={`/category/${review.slug}`}
                      className="group flex gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-surface-800/50"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface-800">
                        {review.featured_image ? (
                          <img src={review.featured_image} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">                      <StarIcon className="h-5 w-5 text-surface-600" /></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white transition-colors group-hover:text-cinema-400 line-clamp-2">{review.title}</p>
                        <div className="mt-1 flex items-center gap-1">
                          {review.star_rating && getStarsArray(review.star_rating).map((type, i) => (
                            <StarIcon key={i} className={`h-3 w-3 ${type === 'full' ? 'fill-cinema-400 text-cinema-400' : 'text-surface-600'}`} />
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Explore */}
            <div className="animate-fade-up">
              <div className="mb-4 flex items-center gap-2">                  <FilmIcon className="h-4 w-4 text-surface-400" />
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Explore</h3>
              </div>
              <div className="space-y-1">
                {exploreLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 -mx-3 text-sm text-surface-400 transition-colors hover:bg-surface-800/50 hover:text-white"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Genre Tags */}
            <div className="animate-fade-up">
              <div className="mb-4 flex items-center gap-2">
                <FilmIcon className="h-4 w-4 text-surface-400" />
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Genres</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {genreTags.map((genre) => (
                  <Link
                    key={genre}
                    to={`/genre/${genre.toLowerCase()}`}
                    className="rounded-full border border-surface-700/50 px-3 py-1.5 text-xs text-surface-400 transition-all duration-200 hover:border-surface-600 hover:text-white hover:bg-surface-800/50"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
