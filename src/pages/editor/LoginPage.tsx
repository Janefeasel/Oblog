import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilmIcon, ArrowRightEndOnRectangleIcon, ExclamationCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  if (user) {
    navigate('/editor', { replace: true })
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await signIn(password)
    if (signInError) {
      setError('Invalid password')
    } else {
      navigate('/editor')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cinema-500/10">
            <FilmIcon className="h-6 w-6 text-cinema-400" />
          </div>
          <h1 className="text-lg font-semibold text-white">Editor Access</h1>
          <p className="mt-1 text-sm text-surface-500">
            Enter the password to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 rounded-lg border border-red-500/15 bg-red-500/5 px-4 py-3">
              <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-surface-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-surface-600 outline-none transition-all duration-200 focus:border-cinema-500/50 focus:ring-2 focus:ring-cinema-500/15"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-500 transition-colors hover:text-surface-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition-all duration-200 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            ) : (
              <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
            )}
            {loading ? 'Verifying...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-surface-600">
          <a href="/" className="transition-colors hover:text-surface-400">
            &larr; Back to the blog
          </a>
        </p>
      </div>
    </div>
  )
}
