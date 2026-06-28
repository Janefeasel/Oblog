import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftEndOnRectangleIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ServerStackIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { useAllPosts, useDeletePost, useDuplicatePost, useTogglePinPost, useTogglePostStatus } from '../../hooks/useSupabaseQuery'
import { useRealtimePosts } from '../../hooks/useRealtimePosts'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, getCategoryColor, capitalize } from '../../lib/utils'
import type { Post } from '../../lib/database.types'

type FilterMode = 'all' | 'published' | 'drafts' | 'pinned' | 'aggregated'

export default function Dashboard() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: posts, isLoading, refetch } = useAllPosts()
  const deletePost = useDeletePost()
  const duplicatePost = useDuplicatePost()
  const togglePin = useTogglePinPost()
  const toggleStatus = useTogglePostStatus()

  // Real-time updates
  useRealtimePosts(
    useCallback(() => refetch(), [refetch])
  )

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Filter posts
  const filteredPosts = (posts || []).filter((post) => {
    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!post.title.toLowerCase().includes(q) && !post.excerpt?.toLowerCase().includes(q)) {
        return false
      }
    }

    // Mode filter
    switch (filterMode) {
      case 'published':
        return post.status === 'published'
      case 'drafts':
        return post.status === 'draft'
      case 'pinned':
        return post.is_pinned
      case 'aggregated':
        return post.is_aggregated
      default:
        return true
    }
  })

  const handleDelete = async (id: string) => {
    try {
      await deletePost.mutateAsync(id)
      showToast('Post deleted successfully')
      setDeleteConfirmId(null)
    } catch {
      showToast('Failed to delete post', 'error')
    }
  }

  const handleDuplicate = async (post: Post) => {
    try {
      await duplicatePost.mutateAsync(post)
      showToast('Post duplicated as draft')
    } catch {
      showToast('Failed to duplicate post', 'error')
    }
  }

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    try {
      await togglePin.mutateAsync({ id, isPinned })
      showToast(isPinned ? 'Post unpinned' : 'Post pinned')
    } catch {
      showToast('Failed to toggle pin', 'error')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: Post['status']) => {
    try {
      await toggleStatus.mutateAsync({ id, currentStatus })
      showToast(
        currentStatus === 'published' ? 'Post moved to drafts' : 'Post published'
      )
    } catch {
      showToast('Failed to toggle status', 'error')
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/editor/login')
  }

  return (
    <div className="flex min-h-screen bg-surface-950">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 shadow-2xl transition-all duration-300 ${
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircleIcon className="h-4 w-4" />
          ) : (
            <XCircleIcon className="h-4 w-4" />
          )}
          <span className="text-sm">{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-surface-800 bg-surface-900 lg:block">
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="border-b border-surface-800 p-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cinema-500">
                <Squares2X2Icon className="h-4 w-4 text-black" />
              </div>
              <span className="font-heading text-xl tracking-wide text-white">Editor</span>
            </Link>
          </div>

          {/* Sidebar Nav */}
          <nav className="flex-1 space-y-1 p-4">
            <button
              onClick={() => setFilterMode('all')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                filterMode === 'all'
                  ? 'bg-cinema-500/10 text-cinema-400'
                  : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
              }`}
            >
              <DocumentTextIcon className="h-4 w-4" />
              All Posts
            </button>
            <button
              onClick={() => setFilterMode('pinned')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                filterMode === 'pinned'
                  ? 'bg-cinema-500/10 text-cinema-400'
                  : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
              }`}
            >
              <ArrowTrendingUpIcon className="h-4 w-4" />
              Pinned Posts
            </button>
            <button
              onClick={() => setFilterMode('aggregated')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                filterMode === 'aggregated'
                  ? 'bg-cinema-500/10 text-cinema-400'
                  : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
              }`}
            >
              <ServerStackIcon className="h-4 w-4" />
              Aggregated
            </button>

            <div className="my-4 border-t border-surface-800" />

            <Link
              to="/editor/new"
              className="flex w-full items-center gap-3 rounded-xl bg-cinema-500 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cinema-400"
            >
              <PlusIcon className="h-4 w-4" />
              Create New Post
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-surface-800 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-surface-400 transition-all duration-200 hover:bg-surface-800 hover:text-red-400"
            >
              <ArrowLeftEndOnRectangleIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Top Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl tracking-wide text-white">Dashboard</h1>
              <p className="text-sm text-surface-400">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                {filterMode !== 'all' && ` (${capitalize(filterMode)})`}
              </p>
            </div>

            {/* Mobile Create Button */}
            <Link
              to="/editor/new"
              className="flex items-center justify-center gap-2 rounded-xl bg-cinema-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cinema-400 lg:hidden"
            >
              <PlusIcon className="h-4 w-4" />
              New Post
            </Link>
          </div>

          {/* Filters & Search */}
          <div className="mb-6 space-y-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { mode: 'all' as FilterMode, label: 'Show All' },
                { mode: 'published' as FilterMode, label: 'Published' },
                { mode: 'drafts' as FilterMode, label: 'Drafts' },
                { mode: 'pinned' as FilterMode, label: 'Pinned' },
                { mode: 'aggregated' as FilterMode, label: 'Aggregated' },
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    filterMode === mode
                      ? 'bg-cinema-500 text-black'
                      : 'border border-surface-700 text-surface-300 hover:border-surface-600 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts by title..."
                className="w-full rounded-xl border border-surface-700 bg-surface-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-all duration-200 focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden overflow-hidden rounded-xl border border-surface-800 lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800 bg-surface-900">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-400">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-400">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-400">
                    Pos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-400">
                    Pinned
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-surface-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-surface-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-20 text-center text-surface-500">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cinema-500 border-t-transparent" />
                    </td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-20 text-center text-surface-500">
                      No posts found
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="bg-surface-900/50 transition-colors hover:bg-surface-800/50"
                    >
                      {/* Title */}
                      <td className="px-4 py-4">
                        <Link
                          to={`/editor/edit/${post.id}`}
                          className="text-sm font-medium text-white transition-colors hover:text-cinema-400"
                        >
                          {post.title}
                        </Link>
                        {post.is_aggregated && (
                          <span className="ml-2 text-[10px] text-surface-500">
                            (Aggregated)
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${getCategoryColor(post.category)}`}
                        >
                          {post.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              post.status === 'published'
                                ? 'bg-emerald-500'
                                : 'bg-surface-500'
                            }`}
                          />
                          <span className="text-xs text-surface-300">
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="px-4 py-4">
                        <span className="text-xs font-mono text-surface-300">
                          {post.sort_order || '—'}
                        </span>
                      </td>

                      {/* Pinned */}
                      <td className="px-4 py-4">
                        {post.is_pinned ? (
                          <span className="text-cinema-400">📌</span>
                        ) : (
                          <span className="text-surface-600">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <span className="text-xs text-surface-400">
                          {formatDate(post.post_date)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/editor/edit/${post.id}`}
                            className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-700 hover:text-cinema-400"
                            title="Edit"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleTogglePin(post.id, post.is_pinned)}
                            className={`rounded-lg p-2 transition-colors hover:bg-surface-700 ${
                              post.is_pinned
                                ? 'text-cinema-400'
                                : 'text-surface-400 hover:text-cinema-400'
                            }`}
                            title={post.is_pinned ? 'Unpin' : 'Pin'}
                          >
                            {post.is_pinned ? (
                              <BookmarkSlashIcon className="h-4 w-4" />
                            ) : (
                              <BookmarkIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(post.id, post.status)}
                            className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-700 hover:text-blue-400"
                            title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {post.status === 'published' ? (
                              <EyeSlashIcon className="h-4 w-4" />
                            ) : (
                              <EyeIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDuplicate(post)}
                            className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-700 hover:text-purple-400"
                            title="Duplicate"
                          >                              <DocumentDuplicateIcon className="h-4 w-4" />
                          </button>
                          {deleteConfirmId === post.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="rounded-lg bg-red-500/20 p-2 text-red-400 transition-colors hover:bg-red-500/30"
                                title="Confirm delete"
                              >
                                <CheckCircleIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded-lg bg-surface-700 p-2 text-surface-400 transition-colors hover:bg-surface-600"
                                title="Cancel"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(post.id)}
                              className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-700 hover:text-red-400"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-3 lg:hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cinema-500 border-t-transparent" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-20 text-center text-surface-500">No posts found</div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl border border-surface-800 bg-surface-900 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/editor/edit/${post.id}`}
                        className="text-sm font-medium text-white transition-colors hover:text-cinema-400 line-clamp-2"
                      >
                        {post.title}
                        {post.is_aggregated && (
                          <span className="ml-2 text-[10px] text-surface-500">
                            (Aggregated)
                          </span>
                        )}
                      </Link>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${getCategoryColor(post.category)}`}
                        >
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              post.status === 'published'
                                ? 'bg-emerald-500'
                                : 'bg-surface-500'
                            }`}
                          />
                          <span className="text-[10px] text-surface-400">
                            {post.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        {post.is_pinned && (
                          <span className="text-[10px] text-cinema-400">📌 Pinned</span>
                        )}
                        <span className="text-[10px] text-surface-500">
                          {formatDate(post.post_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="mt-3 flex items-center gap-1 border-t border-surface-800 pt-3">
                    <Link
                      to={`/editor/edit/${post.id}`}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-cinema-400"
                    >
                      <PencilSquareIcon className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => handleTogglePin(post.id, post.is_pinned)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-surface-800 ${
                        post.is_pinned ? 'text-cinema-400' : 'text-surface-300'
                      }`}
                    >
                      {post.is_pinned ? (
                        <BookmarkSlashIcon className="h-3.5 w-3.5" />
                      ) : (
                        <BookmarkIcon className="h-3.5 w-3.5" />
                      )}
                      {post.is_pinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button
                      onClick={() => handleToggleStatus(post.id, post.status)}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-blue-400"
                    >
                      {post.status === 'published' ? (
                        <EyeSlashIcon className="h-3.5 w-3.5" />
                      ) : (
                        <EyeIcon className="h-3.5 w-3.5" />
                      )}
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDuplicate(post)}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-purple-400"
                    >
                      <DocumentDuplicateIcon className="h-3.5 w-3.5" /> Duplicate
                    </button>
                    {deleteConfirmId === post.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="rounded-lg px-2 py-1.5 text-xs text-red-400 hover:bg-surface-800"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg px-2 py-1.5 text-xs text-surface-400 hover:bg-surface-800"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(post.id)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-red-400"
                      >
                        <TrashIcon className="h-3.5 w-3.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
