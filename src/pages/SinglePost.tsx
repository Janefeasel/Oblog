import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  BookmarkIcon,
  ArrowTopRightOnSquareIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { usePostBySlug } from '../hooks/useSupabaseQuery'
import { formatDate, getCategoryColor, getStarsArray } from '../lib/utils'
import { ArticleSkeleton } from '../components/Skeleton'
import EmptyState from '../components/EmptyState'

export default function SinglePost() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, error } = usePostBySlug(slug || '')
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setReadingProgress(Math.min((scrollTop / docHeight) * 100, 100))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isLoading) return <ArticleSkeleton />

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState icon="error" title="Post not found" description="The article you're looking for doesn't exist or has been removed." action={{ label: 'Back to Home', to: '/' }} />
      </div>
    )
  }

  const postUrl = typeof window !== 'undefined' ? window.location.href : ''
  const siteName = 'The Movie Desk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.category === 'review' ? 'Review' : 'Article',
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: post.featured_image,
    datePublished: post.post_date,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    ...(post.category === 'review' && post.star_rating
      ? { reviewRating: { '@type': 'Rating', ratingValue: post.star_rating, bestRating: 5, worstRating: 1 } }
      : {}),
  }

  return (
    <>
      <Helmet>
        <title>{post.seo_title || post.title} | The Movie Desk</title>
        <meta name="description" content={post.seo_description || post.excerpt || ''} />
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta property="og:description" content={post.seo_description || post.excerpt || ''} />
        {post.featured_image && <meta property="og:image" content={post.featured_image} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="reading-progress" style={{ width: `${readingProgress}%` }} />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500 transition-colors hover:text-white"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-10 overflow-hidden rounded-xl">
            <img src={post.featured_image} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        {/* Header */}
        <header className="mb-10 max-w-3xl mx-auto">
          {/* Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium capitalize ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
            {post.genre && (
              <span className="rounded-md bg-surface-800 px-2.5 py-0.5 text-xs font-medium capitalize text-surface-400">
                {post.genre}
              </span>
            )}
            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 rounded-md bg-cinema-500/15 px-2.5 py-0.5 text-xs font-medium text-cinema-400">
                <BookmarkIcon className="h-3 w-3" />
                Pinned
              </span>
            )}
          </div>

          <h1 className="font-heading text-4xl tracking-wide text-white sm:text-5xl leading-[1.1]">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-surface-500">
            <span className="flex items-center gap-1.5">
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              {formatDate(post.post_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              {formatDate(post.updated_at)}
            </span>
            {post.source_name && (
              <a href={post.source_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-cinema-400 transition-colors hover:text-cinema-300">
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                Via {post.source_name}
              </a>
            )}
            {!post.source_name && !post.is_aggregated && (
              <span className="flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5" />
                Editorial
              </span>
            )}
          </div>

          {/* Credits */}
          {(post.directed_by || post.produced_by) && (
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {post.directed_by && (
                <div className="flex items-center gap-2">
                  <span className="text-surface-500 font-medium uppercase tracking-wider text-[11px]">Directed by</span>
                  <span className="text-white">{post.directed_by}</span>
                </div>
              )}
              {post.produced_by && (
                <div className="flex items-center gap-2">
                  <span className="text-surface-500 font-medium uppercase tracking-wider text-[11px]">Produced by</span>
                  <span className="text-white">{post.produced_by}</span>
                </div>
              )}
            </div>
          )}

          {post.star_rating && post.category === 'review' && (
            <div className="mt-4 flex items-center gap-1">
              {getStarsArray(post.star_rating).map((type, i) => (
                <StarIcon key={i} className={`h-5 w-5 ${type === 'full' ? 'text-cinema-400' : 'text-surface-600'}`} />
              ))}
              <span className="ml-1.5 text-base font-medium text-cinema-400">{post.star_rating} / 5</span>
            </div>
          )}

          {post.excerpt && (
            <p className="mt-6 text-base leading-relaxed text-surface-400 border-l-2 border-cinema-500/30 pl-4">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Bottom */}
        <div className="mt-12 border-t border-surface-800/50 pt-8 max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500 transition-colors hover:text-white"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Back to all posts
          </Link>
        </div>
      </article>
    </>
  )
}
