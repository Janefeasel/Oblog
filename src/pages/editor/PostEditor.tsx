import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  CheckIcon,
  ArrowLeftIcon,
  BookmarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhotoIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePostById, useCreatePost, useUpdatePost } from '../../hooks/useSupabaseQuery'
import TipTapEditor from '../../components/TipTapEditor'
import StarRating from '../../components/StarRating'
import { slugify, toDatetimeLocal } from '../../lib/utils'
import { supabase } from '../../lib/supabase'
import type { PostCategory, PostGenre } from '../../lib/database.types'

/**
 * Zod validation schema for the post editor form.
 * All fields are validated before submission.
 */
const editorSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  post_date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  genre: z.string().nullable().optional(),
  star_rating: z.number().nullable().optional(),
  featured_image: z.string().nullable().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  is_pinned: z.boolean(),
  sort_order: z.number().int().min(0).max(999999),
  status: z.enum(['published', 'draft']),
  seo_title: z.string().nullable().optional(),
  seo_description: z.string().nullable().optional(),
  directed_by: z.string().nullable().optional(),
  produced_by: z.string().nullable().optional(),
  is_aggregated: z.boolean().optional(),
  source_name: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
})

type EditorFormData = z.infer<typeof editorSchema>

const categories: { value: PostCategory; label: string }[] = [
  { value: 'news', label: 'News' },
  { value: 'review', label: 'Review' },
  { value: 'feature', label: 'Feature' },
  { value: 'trailer', label: 'Trailer' },
  { value: 'interview', label: 'Interview' },
]

const genres: { value: PostGenre; label: string }[] = [
  { value: 'action', label: 'Action' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'horror', label: 'Horror' },
  { value: 'sci-fi', label: 'Sci-Fi' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'romance', label: 'Romance' },
  { value: 'animation', label: 'Animation' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'musical', label: 'Musical' },
  { value: 'war', label: 'War' },
  { value: 'western', label: 'Western' },
  { value: 'crime', label: 'Crime' },
  { value: 'adventure', label: 'Adventure' },
]

export default function PostEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id
  const [richContent, setRichContent] = useState('')
  const [seoExpanded, setSeoExpanded] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { data: existingPost, isLoading: loadingPost } = usePostById(id || '')
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditorFormData>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      title: '',
      slug: '',
      post_date: toDatetimeLocal(new Date()),
      category: 'news',
      genre: null,
      star_rating: null,
      featured_image: '',
      excerpt: '',
      content: '',
      is_pinned: false,
      sort_order: 0,
      status: 'draft',
      seo_title: '',
      seo_description: '',
      directed_by: '',
      produced_by: '',
      is_aggregated: false,
      source_name: '',
      source_url: '',
    },
  })

  const watchCategory = watch('category')
  const watchTitle = watch('title')
  const watchSlug = watch('slug')

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setValue('title', title)
    const currentSlug = watchSlug
    const generatedSlug = slugify(title)
    // Only auto-update slug if it hasn't been manually edited
    if (!currentSlug || currentSlug === slugify('')) {
      setValue('slug', generatedSlug)
    }
  }

  // Load existing post data when editing
  useEffect(() => {
    if (existingPost && isEditing) {
      reset({
        title: existingPost.title,
        slug: existingPost.slug,
        post_date: toDatetimeLocal(new Date(existingPost.post_date)),
        category: existingPost.category,
        genre: existingPost.genre,
        star_rating: existingPost.star_rating,
        featured_image: existingPost.featured_image || '',
        excerpt: existingPost.excerpt || '',
        content: existingPost.content || '',
        is_pinned: existingPost.is_pinned,
        sort_order: existingPost.sort_order,
        status: existingPost.status,
        seo_title: existingPost.seo_title || '',
        seo_description: existingPost.seo_description || '',
        directed_by: existingPost.directed_by || '',
        produced_by: existingPost.produced_by || '',
        is_aggregated: existingPost.is_aggregated,
        source_name: existingPost.source_name || '',
        source_url: existingPost.source_url || '',
      })
      setRichContent(existingPost.content || '')
    }
  }, [existingPost, isEditing, reset])

  /**
   * Handle form submission.
   * Creates a new post or updates an existing one based on isEditing.
   */
  const onSubmit = async (data: EditorFormData) => {
    setSaveSuccess(false)

    try {
      const postData = {
        title: data.title,
        slug: data.slug,
        content: richContent,
        excerpt: data.excerpt || '',
        featured_image: data.featured_image || null,
        category: data.category as PostCategory,
        genre: (data.genre || null) as PostGenre | null,
        star_rating: data.star_rating || null,
        is_pinned: data.is_pinned,
        sort_order: data.sort_order,
        post_date: new Date(data.post_date).toISOString(),
        status: data.status,
        seo_title: data.seo_title || null,
        seo_description: data.seo_description || null,
        directed_by: data.directed_by || null,
        produced_by: data.produced_by || null,
        is_aggregated: data.is_aggregated || false,
        source_name: data.source_name || null,
        source_url: data.source_url || null,
      }

      if (isEditing && id) {
        await updatePost.mutateAsync({ id, updates: postData })
      } else {
        const result = await createPost.mutateAsync(postData)
        // Navigate to edit the newly created post
        if (result) {
          navigate(`/editor/edit/${result.id}`, { replace: true })
          return
        }
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  /**
   * Upload featured image to Supabase Storage.
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `featured/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      setValue('featured_image', publicUrl)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  if (isEditing && loadingPost) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-950">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-cinema-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 border-b border-surface-800 bg-surface-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/editor"
              className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-800 hover:text-surface-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-heading text-xl tracking-wide text-white">
                {isEditing ? 'Edit Post' : 'New Post'}
              </h1>
              <p className="text-xs text-surface-500">
                {isEditing ? `Editing: ${existingPost?.title || ''}` : 'Create a new blog post'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-sm text-emerald-400">Saved!</span>
            )}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-cinema-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cinema-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={watchTitle}
              onChange={handleTitleChange}
              placeholder="Post Title"
              className="w-full border-0 bg-transparent font-heading text-3xl tracking-wide text-white placeholder-surface-600 outline-none sm:text-4xl lg:text-5xl"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-surface-400">
              Slug
            </label>
            <input
              {...register('slug')}
              className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-red-400">{errors.slug.message}</p>
            )}
            <p className="mt-1 text-xs text-surface-500">
              URL: /category/{watchSlug || 'your-post-slug'}
            </p>
          </div>

          {/* Meta Fields Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Post Date */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-400">
                Display Date
              </label>
              <input
                type="datetime-local"
                {...register('post_date')}
                className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
              />
              {errors.post_date && (
                <p className="mt-1 text-xs text-red-400">{errors.post_date.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-400">
                Category
              </label>
              <select
                {...register('category')}
                className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-400">
                Genre
              </label>
              <select
                {...register('genre')}
                className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
              >
                <option value="">None</option>
                {genres.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Star Rating (visible only for reviews) */}
          {watchCategory === 'review' && (
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-400">
                Star Rating
              </label>
              <Controller
                name="star_rating"
                control={control}
                render={({ field }) => (
                  <StarRating
                    value={field.value ?? null}
                    onChange={(val) => field.onChange(val)}
                    size="lg"
                  />
                )}
              />
            </div>
          )}

          {/* Featured Image */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-400">
              Featured Image
            </label>
            <Controller
              name="featured_image"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Image URL..."
                      className="flex-1 rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
                    />
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-surface-300 transition-colors hover:bg-surface-800">
                      {uploadingImage ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      ) : (
                        <PhotoIcon className="h-4 w-4" />
                      )}
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {field.value && (
                    <div className="relative aspect-video overflow-hidden rounded-xl">
                      <img
                        src={field.value}
                        alt="Featured preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange('')}
                        className="absolute right-2 top-2 rounded-lg bg-red-500/80 px-2 py-1 text-xs text-white transition-colors hover:bg-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-400">
              Excerpt
            </label>
            <textarea
              {...register('excerpt')}
              rows={3}
              placeholder="Brief summary for cards and previews..."
              className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
            />
            {errors.excerpt && (
              <p className="mt-1 text-xs text-red-400">{errors.excerpt.message}</p>
            )}
          </div>

          {/* Rich Text Editor (TipTap) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-400">
              Content
            </label>
            <TipTapEditor
              content={richContent}
              onChange={(html) => {
                setRichContent(html)
                setValue('content', html)
              }}
            />
          </div>

          {/* Toggles Row */}
          <div className="flex flex-wrap gap-6">
            {/* Sort Order */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-surface-400">
                Position
              </label>
              <Controller
                name="sort_order"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => field.onChange(Math.max(0, (field.value || 0) - 1))}
                      className="rounded-lg border border-surface-700 p-2 text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={999999}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-16 rounded-lg border border-surface-700 bg-surface-900 py-2 text-center text-sm text-white outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => field.onChange((field.value || 0) + 1)}
                      className="rounded-lg border border-surface-700 p-2 text-surface-400 transition-colors hover:bg-surface-800 hover:text-white"
                    >
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              />
              <p className="mt-1 text-xs text-surface-500">0 = automatic order</p>
            </div>

            {/* Pin Toggle */}
            <label className="flex cursor-pointer items-center gap-2">
              <Controller
                name="is_pinned"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      field.value
                        ? 'border-cinema-500/50 bg-cinema-500/10 text-cinema-400'
                        : 'border-surface-700 text-surface-300 hover:border-surface-600'
                    }`}
                  >
                    <BookmarkIcon className={`h-4 w-4 ${field.value ? 'text-cinema-400' : ''}`} />
                    {field.value ? 'Pinned' : 'Pin Post'}
                  </button>
                )}
              />
            </label>

            {/* Status Toggle */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() =>
                    field.onChange(field.value === 'published' ? 'draft' : 'published')
                  }
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    field.value === 'published'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-surface-700 text-surface-300 hover:border-surface-600'
                  }`}
                >                    {field.value === 'published' ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeSlashIcon className="h-4 w-4" />
                    )}
                  {field.value === 'published' ? 'Published' : 'Draft'}
                </button>
              )}
            />
          </div>

          {/* SEO Section */}
          <div className="rounded-xl border border-surface-800">
            <button
              type="button"
              onClick={() => setSeoExpanded(!seoExpanded)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-medium text-surface-300">SEO Metadata</span>
              {seoExpanded ? (
                <ChevronUpIcon className="h-4 w-4 text-surface-400" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-surface-400" />
              )}
            </button>
            {seoExpanded && (
              <div className="space-y-4 border-t border-surface-800 px-5 py-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-400">
                    Meta Title
                  </label>
                  <input
                    {...register('seo_title')}
                    placeholder="SEO title (overrides title tag)"
                    className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
                  />
                  <p className="mt-1 text-xs text-surface-500">Recommended: under 70 characters</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-surface-400">
                    Meta Description
                  </label>
                  <textarea
                    {...register('seo_description')}
                    rows={2}
                    placeholder="Brief description for search results"
                    className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
                  />
                  <p className="mt-1 text-xs text-surface-500">Recommended: under 160 characters</p>
                </div>
              </div>
            )}
          </div>

          {/* Credits */}
          <div className="rounded-xl border border-surface-800 p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400">
              Credits
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-surface-400">Directed By</label>
                <input
                  {...register('directed_by')}
                  placeholder="e.g., Steven Spielberg"
                  className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-surface-400">Produced By</label>
                <input
                  {...register('produced_by')}
                  placeholder="e.g., Kristie Macosko Krieger"
                  className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
                />
              </div>
            </div>
          </div>

          {/* Source attribution (for aggregated posts) */}
          <div className="rounded-xl border border-surface-800 p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-400">
              Source Attribution
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-surface-400">Source Name</label>
                <input
                  {...register('source_name')}
                  placeholder="e.g., TMDB, Variety"
                  className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-surface-400">Source URL</label>
                <input
                  {...register('source_url')}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-surface-700 bg-surface-900 px-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-cinema-500 focus:ring-1 focus:ring-cinema-500/50"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
