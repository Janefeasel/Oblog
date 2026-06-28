/**
 * Utility functions for the Movie Blog.
 */

/**
 * Generate a URL-friendly slug from a title string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

/**
 * Format a date string for display.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date for the date-time input (local datetime-local format).
 */
export function toDatetimeLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Get the category badge color class.
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    news: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    review: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    feature: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    trailer: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    interview: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  }
  return colors[category] || 'bg-surface-700 text-surface-300 border-surface-600'
}

/**
 * Get the genre display color.
 */
export function getGenreColor(genre: string): string {
  const colors: Record<string, string> = {
    action: 'bg-red-500/10 text-red-400',
    comedy: 'bg-yellow-500/10 text-yellow-400',
    drama: 'bg-indigo-500/10 text-indigo-400',
    horror: 'bg-gray-500/10 text-gray-300',
    'sci-fi': 'bg-cyan-500/10 text-cyan-400',
    thriller: 'bg-orange-500/10 text-orange-400',
    romance: 'bg-pink-500/10 text-pink-400',
    animation: 'bg-sky-500/10 text-sky-400',
    documentary: 'bg-teal-500/10 text-teal-400',
    fantasy: 'bg-violet-500/10 text-violet-400',
    mystery: 'bg-slate-500/10 text-slate-300',
    musical: 'bg-fuchsia-500/10 text-fuchsia-400',
    war: 'bg-stone-500/10 text-stone-300',
    western: 'bg-amber-600/10 text-amber-500',
    crime: 'bg-neutral-500/10 text-neutral-300',
    adventure: 'bg-lime-500/10 text-lime-400',
  }
  return colors[genre] || 'bg-surface-700 text-surface-300'
}

/**
 * Get the star rating array for display (filled and empty stars).
 */
export function getStarsArray(rating: number): ('full' | 'empty')[] {
  const stars: ('full' | 'empty')[] = []
  const full = Math.min(Math.floor(rating), 5)

  for (let i = 0; i < full; i++) stars.push('full')
  while (stars.length < 5) stars.push('empty')

  return stars
}

/**
 * Truncate text to a specified length.
 */
export function truncate(text: string, length: number = 150): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}

/**
 * Capitalize first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
