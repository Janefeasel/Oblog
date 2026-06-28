import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const AUTH_PASSWORD = 'testaccount'
const AUTH_KEY = 'oblog_auth'

interface AuthContextType {
  user: { email: string } | null
  loading: boolean
  signIn: (password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY)
    if (stored === 'true') {
      setUser({ email: 'editor' })
    }
    setLoading(false)
  }, [])

  const signIn = async (password: string) => {
    if (password !== AUTH_PASSWORD) {
      return { error: new Error('Invalid password') }
    }
    sessionStorage.setItem(AUTH_KEY, 'true')
    setUser({ email: 'editor' })
    return { error: null }
  }

  const signOut = async () => {
    sessionStorage.removeItem(AUTH_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
