/**
 * Skeleton loading components with shimmer animation.
 * Provides a professional loading experience instead of spinners.
 */

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

export function PostCardSkeleton({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="overflow-hidden rounded-2xl border border-surface-800 bg-surface-900" aria-label="Loading featured post">
        <div className="aspect-[21/9] sm:aspect-[2/1]">
          <SkeletonBlock className="h-full w-full rounded-none" />
        </div>
        <div className="space-y-3 p-6 sm:p-8">
          <SkeletonBlock className="h-3 w-1/3" />
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-surface-800 bg-surface-900" aria-label="Loading post">
      <SkeletonBlock className="aspect-[16/9] rounded-none" />
      <div className="space-y-2.5 p-4">
        <SkeletonBlock className="h-3 w-1/3" />
        <SkeletonBlock className="h-5 w-3/4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-surface-800 bg-surface-900 p-5">
          <SkeletonBlock className="mb-4 h-4 w-1/2" />
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="mb-3 flex gap-3">
              <SkeletonBlock className="h-16 w-16 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" aria-label="Loading article">
      <SkeletonBlock className="mb-8 h-4 w-24" />
      <SkeletonBlock className="mb-8 aspect-[2/1] w-full" />
      <div className="mb-4 flex gap-2">
        <SkeletonBlock className="h-6 w-20 rounded-full" />
        <SkeletonBlock className="h-6 w-24 rounded-full" />
      </div>
      <SkeletonBlock className="mb-4 h-12 w-full" />
      <SkeletonBlock className="mb-2 h-12 w-5/6" />
      <div className="my-6 flex gap-4">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
      <div className="my-8 space-y-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonBlock key={i} className={`h-4 ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
        ))}
      </div>
    </div>
  )
}
