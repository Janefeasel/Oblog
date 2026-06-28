import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './hooks/useAuth'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import NewsPage from './pages/NewsPage'
import ReviewsPage from './pages/ReviewsPage'
import SinglePost from './pages/SinglePost'
import GenrePage from './pages/GenrePage'
import SearchPage from './pages/SearchPage'
import UpcomingPage from './pages/UpcomingPage'
import LoginPage from './pages/editor/LoginPage'
import Dashboard from './pages/editor/Dashboard'
import PostEditor from './pages/editor/PostEditor'

/**
 * React Query client with optimized defaults for the blog.
 * - staleTime: 30 seconds — data is fresh for 30s before refetch
 * - gcTime: 5 minutes — cached data persists for 5 minutes
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
  },
})

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/category/:slug" element={<SinglePost />} />
                <Route path="/genre/:genre" element={<GenrePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category/upcoming" element={<UpcomingPage />} />
              </Route>

              {/* Editor Login (no layout) */}
              <Route path="/editor/login" element={<LoginPage />} />

              {/* Protected Editor Routes */}
              <Route path="/editor" element={<ProtectedRoute />}>
                <Route index element={<Dashboard />} />
                <Route path="new" element={<PostEditor />} />
                <Route path="edit/:id" element={<PostEditor />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )
}
