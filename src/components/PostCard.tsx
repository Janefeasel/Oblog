import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookmarkIcon, FilmIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import type { Post } from '../lib/database.types'
import { formatDate, getCategoryColor, getStarsArray, truncate } from '../lib/utils'

interface PostCardProps {
  post: Post
  featured?: boolean
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (featured) {
    return (
      <Link
        to={`/category/${post.slug}`}
        className="group relative block overflow-hidden rounded-xl bg-surface-900 transition-all duration-300 hover:-translate-y-0.5 card-shadow"
      >
        {/* Image */}
        <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[2/1]">
          {!imgLoaded && !imgError && <div className="absolute inset-0 skeleton" />}
          {post.featured_image && !imgError ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-900">
              <FilmIcon className="h-12 w-12 text-surface-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />

          {/* Badges */}
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            {post.is_pinned && (
              <span className="inline-flex items-center gap-1 rounded-md bg-cinema-500/15 px-2 py-0.5 text-[11px] font-medium text-cinema-400">
                <BookmarkIcon className="h-3 w-3" />
                Pinned
              </span>
            )}
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-surface-400/80">
              <span>{formatDate(post.post_date)}</span>
              {post.source_name && <span>· Via {post.source_name}</span>}
            </div>
            <h2 className="mt-1 font-heading text-2xl tracking-wide text-white transition-colors duration-200 group-hover:text-cinema-400 sm:text-3xl">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-1 max-w-2xl text-sm text-surface-300/80 line-clamp-1">{post.excerpt}</p>
            )}
            {post.star_rating && post.category === 'review' && (
              <div className="mt-2 flex items-center gap-0.5">
                {getStarsArray(post.star_rating).map((type, i) => (
                  <StarIcon key={i} className={`h-4 w-4 ${                  type === 'full' ? 'text-cinema-400' : 'text-surface-600'}`} />
                ))}
                <span className="ml-1.5 text-sm text-cinema-400">{post.star_rating}/5</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/category/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface-900 transition-all duration-200 card-shadow"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {!imgLoaded && !imgError && <div className="absolute inset-0 skeleton" />}
        {post.featured_image && !imgError ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-850">              <FilmIcon className="h-8 w-8 text-surface-700" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium capitalize ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          {post.is_pinned && (
            <span className="inline-flex items-center gap-1 rounded-md bg-cinema-500/15 px-2 py-0.5 text-[10px] font-medium text-cinema-400">
              <BookmarkIcon className="h-2.5 w-2.5" />
              Pinned
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-surface-500">
          <span>{formatDate(post.post_date)}</span>
          {post.source_name && (
            <>
              <span className="text-surface-700">·</span>
              <span className="text-surface-400">Via {post.source_name}</span>
            </>
          )}
          {!post.source_name && !post.is_aggregated && (
            <>
              <span className="text-surface-700">·</span>
              <span className="text-surface-500">Editorial</span>
            </>
          )}
        </div>
        <h3 className="mt-1 font-heading text-xl tracking-wide text-white transition-colors duration-200 group-hover:text-cinema-400">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-1.5 text-sm leading-relaxed text-surface-400 line-clamp-2">
            {truncate(post.excerpt, 120)}
          </p>
        )}          {(post.directed_by || post.produced_by) && (
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-surface-500">
              {post.directed_by && (
                <span><span className="text-surface-600">Dir.</span> {post.directed_by}</span>
              )}
              {post.produced_by && (
                <span><span className="text-surface-600">Prod.</span> {post.produced_by}</span>
              )}
            </div>
          )}

          {post.star_rating && post.category === 'review' && (
            <div className="mt-3 flex items-center gap-0.5">
              {getStarsArray(post.star_rating).map((type, i) => (
                <StarIcon
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    type === 'full' ? 'text-cinema-400' : 'text-surface-600'
                  }`}
                />
              ))}
              <span className="ml-1.5 text-xs text-cinema-400">{post.star_rating}/5</span>
            </div>
          )}
      </div>
    </Link>
  )
}
