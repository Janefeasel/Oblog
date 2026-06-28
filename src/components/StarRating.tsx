import { StarIcon } from '@heroicons/react/24/solid'

interface StarRatingProps {
  value: number | null
  onChange: (rating: number | null) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ value, onChange, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(value === star ? null : star)}
          className={`${sizeClasses[size]} transition-all duration-150 ${
            value !== null && star <= value
              ? 'fill-cinema-400 text-cinema-400'
              : 'text-surface-600 hover:text-cinema-400/50'
          } ${value !== null && star <= value ? 'scale-110' : ''}`}
        >
          <StarIcon className="h-full w-full" />
        </button>
      ))}
      {value && (
        <span className="ml-2 text-sm font-medium text-cinema-400">{value}/5</span>
      )}
      {value === null && (
        <span className="ml-2 text-xs text-surface-500">Click to rate</span>
      )}
    </div>
  )
}
