import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  FilmIcon,
} from '@heroicons/react/24/outline'

const genres = [
  { slug: 'action', label: 'Action' },
  { slug: 'comedy', label: 'Comedy' },
  { slug: 'drama', label: 'Drama' },
  { slug: 'horror', label: 'Horror' },
  { slug: 'sci-fi', label: 'Sci-Fi' },
  { slug: 'thriller', label: 'Thriller' },
  { slug: 'romance', label: 'Romance' },
  { slug: 'animation', label: 'Animation' },
  { slug: 'fantasy', label: 'Fantasy' },
  { slug: 'documentary', label: 'Documentary' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [genreOpen, setGenreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const linkClass = (path: string) =>
    `text-sm transition-colors duration-200 ${
      location.pathname === path
        ? 'text-white'
        : 'text-surface-400 hover:text-white'
    }`

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-950/90 shadow-sm shadow-black/20 backdrop-blur-lg'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <FilmIcon className="h-5 w-5 text-cinema-400 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-heading text-lg tracking-wide text-white transition-colors duration-300 group-hover:text-cinema-400">
            The Movie Desk
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/news" className={linkClass('/news')}>News</Link>
          <Link to="/reviews" className={linkClass('/reviews')}>Reviews</Link>

          {/* Genres */}
          <div
            className="relative"
            onMouseEnter={() => setGenreOpen(true)}
            onMouseLeave={() => setGenreOpen(false)}
          >
            <button
              className={`flex items-center gap-1 text-sm transition-colors duration-200 ${
                genreOpen ? 'text-white' : 'text-surface-400 hover:text-white'
              }`}
              aria-expanded={genreOpen}
            >
              Genres
              <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ${genreOpen ? 'rotate-180' : ''}`} />
            </button>
            {genreOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 origin-top-right animate-fade-in rounded-xl border border-surface-800 bg-surface-900 p-2 shadow-xl shadow-black/30">
                <div className="grid grid-cols-2 gap-0.5">
                  {genres.map((g) => (
                    <Link
                      key={g.slug}
                      to={`/genre/${g.slug}`}
                      className="rounded-lg px-3 py-2 text-xs text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
                      onClick={() => setGenreOpen(false)}
                    >
                      {g.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/category/upcoming" className={linkClass('/category/upcoming')}>Upcoming</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-lg p-2 text-surface-400 transition-colors hover:text-white"
            aria-label="Toggle search"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-surface-400 transition-colors hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-4 w-4" /> : <Bars3Icon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-surface-800/50 px-4 py-3 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="mx-auto max-w-xl">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts…"
                className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-600 outline-none transition-all focus:border-cinema-500/40 focus:ring-1 focus:ring-cinema-500/20"
                autoFocus
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile */}
      <div className={`overflow-hidden transition-all duration-300 md:hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-surface-800/50 px-4 py-4">
          <div className="flex flex-col gap-1">
            <Link to="/news" className="rounded-lg px-3 py-2.5 text-sm text-surface-300 hover:bg-surface-800" onClick={() => setMobileMenuOpen(false)}>News</Link>
            <Link to="/reviews" className="rounded-lg px-3 py-2.5 text-sm text-surface-300 hover:bg-surface-800" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
            <hr className="my-2 border-surface-800/50" />
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-surface-600">Genres</p>
            <div className="grid grid-cols-2 gap-0.5">
              {genres.map((g) => (
                <Link
                  key={g.slug}
                  to={`/genre/${g.slug}`}
                  className="rounded-lg px-3 py-2 text-sm text-surface-400 hover:bg-surface-800 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {g.label}
                </Link>
              ))}
            </div>
            <hr className="my-2 border-surface-800/50" />
            <Link to="/category/upcoming" className="rounded-lg px-3 py-2.5 text-sm text-surface-300 hover:bg-surface-800" onClick={() => setMobileMenuOpen(false)}>Upcoming</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
