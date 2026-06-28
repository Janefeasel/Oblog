import { Link } from 'react-router-dom'
import { FilmIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-surface-800/50 bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-2">
              <FilmIcon className="h-5 w-5 text-cinema-400 transition-all duration-300 group-hover:scale-110" />
              <span className="font-heading text-lg tracking-wider text-white transition-colors duration-300 group-hover:text-cinema-400">
                The Movie Desk
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-surface-500 max-w-xs">
              Your definitive source for movie news, reviews, and industry insights. Curated for cinema enthusiasts.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-surface-500">Sections</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/news', label: 'News' },
                { to: '/reviews', label: 'Reviews' },
                { to: '/category/upcoming', label: 'Upcoming' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-surface-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-surface-500">Genres</h3>
            <ul className="space-y-2.5">
              {['Action', 'Drama', 'Horror', 'Sci-Fi', 'Comedy'].map((genre) => (
                <li key={genre}>
                  <Link
                    to={`/genre/${genre.toLowerCase()}`}
                    className="text-sm text-surface-400 transition-colors duration-200 hover:text-white"
                  >
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-surface-500">About</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-surface-400 transition-colors duration-200 hover:text-white">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-surface-800/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-surface-600">
              &copy; {new Date().getFullYear()} The Movie Desk
            </p>
            <p className="text-xs text-surface-600">
              Made for cinema lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
