import { Link } from 'react-router-dom'
import { FilmIcon, MagnifyingGlassIcon, StarIcon, NewspaperIcon, Squares2X2Icon, XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface EmptyStateProps {
  icon?: 'film' | 'search' | 'reviews' | 'news' | 'genre' | 'error'
  title: string
  description: string
  action?: { label: string; to: string }
}

const iconMap: Record<string, typeof FilmIcon> = {
  film: FilmIcon,
  search: MagnifyingGlassIcon,
  reviews: StarIcon,
  news: NewspaperIcon,
  genre: Squares2X2Icon,
  error: XCircleIcon,
}

export default function EmptyState({ icon = 'film', title, description, action }: EmptyStateProps) {
  const IconComponent = iconMap[icon] || FilmIcon

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-700 px-6 py-20 transition-all duration-300 hover:border-surface-600">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800/50">
        <IconComponent className="h-8 w-8 text-surface-500" />
      </div>
      <h3 className="text-xl font-semibold tracking-wide text-surface-400">{title}</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-surface-600">{description}</p>
      {action && (
        <Link
          to={action.to}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cinema-500/10 px-5 py-2.5 text-sm font-medium text-cinema-400 transition-all duration-200 hover:bg-cinema-500/20 hover:text-cinema-300"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {action.label}
        </Link>
      )}
    </div>
  )
}
