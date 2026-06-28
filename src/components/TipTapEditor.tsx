import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ListBulletIcon,
  NumberedListIcon,
  ChatBubbleBottomCenterTextIcon,
  LinkIcon,
  PhotoIcon,
  VideoCameraIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline'
import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
}

/* ── Text Alignment Icons (custom SVGs) ── */
function AlignLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="10" x2="15" y2="10" />
      <line x1="3" y1="14" x2="19" y2="14" />
      <line x1="3" y1="18" x2="13" y2="18" />
    </svg>
  )
}

function AlignCenterIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="6" y1="10" x2="18" y2="10" />
      <line x1="5" y1="14" x2="19" y2="14" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  )
}

function AlignRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="9" y1="10" x2="21" y2="10" />
      <line x1="5" y1="14" x2="21" y2="14" />
      <line x1="11" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg p-1.5 transition-all duration-150 ${
        active
          ? 'bg-cinema-500/20 text-cinema-400'
          : 'text-surface-400 hover:bg-surface-800 hover:text-surface-200'
      }`}
    >
      {children}
    </button>
  )
}

function MenuDivider() {
  return <div className="mx-1 h-5 w-px bg-surface-700" />
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`
      const filePath = `editor-images/${fileName}`

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Upload failed:', error)
      return null
    } finally {
      setUploading(false)
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-cinema-400 underline hover:text-cinema-300',
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg my-4',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        modestBranding: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your post...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content || '',
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px]',
      },
    },
  })

  if (!editor) return null

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const addYoutubeVideo = () => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run()
      setYoutubeUrl('')
      setShowYoutubeInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = await handleImageUpload(file)
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }
  }

  return (
    <div className="rounded-xl border border-surface-700 bg-surface-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-surface-700 px-3 py-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <BoldIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <ItalicIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <StrikethroughIcon className="h-4 w-4" />
        </ToolbarButton>

        <MenuDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <H1Icon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <H2Icon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <H3Icon className="h-4 w-4" />
        </ToolbarButton>

        <MenuDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <ListBulletIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <NumberedListIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Quote"
        >
          <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
        </ToolbarButton>

        <MenuDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeftIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenterIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRightIcon className="h-4 w-4" />
        </ToolbarButton>

        <MenuDivider />

        <ToolbarButton
          onClick={() => setShowLinkInput(!showLinkInput)}
          active={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setShowImageInput(!showImageInput)}
          title="Add Image"
        >
          <PhotoIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setShowYoutubeInput(!showYoutubeInput)}
          title="Embed YouTube Video"
        >
          <VideoCameraIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <ArrowUturnRightIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="border-b border-surface-700 px-3 py-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL..."
              className="flex-1 rounded-lg border border-surface-700 bg-surface-800 px-3 py-1.5 text-sm text-white placeholder-surface-500 outline-none focus:border-cinema-500"
              onKeyDown={(e) => e.key === 'Enter' && addLink()}
            />
            <button
              type="button"
              onClick={addLink}
              className="rounded-lg bg-cinema-500 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-cinema-400"
            >
              Add
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="rounded-lg bg-surface-700 px-3 py-1.5 text-sm text-surface-300 transition-colors hover:bg-surface-600"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="border-b border-surface-700 px-3 py-2">
          <div className="mb-2 flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL..."
              className="flex-1 rounded-lg border border-surface-700 bg-surface-800 px-3 py-1.5 text-sm text-white placeholder-surface-500 outline-none focus:border-cinema-500"
              onKeyDown={(e) => e.key === 'Enter' && addImage()}
            />
            <button
              type="button"
              onClick={addImage}
              className="rounded-lg bg-cinema-500 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-cinema-400"
            >
              Add URL
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-surface-500">
            <span>Or upload:</span>
            <label className="cursor-pointer rounded-lg bg-surface-800 px-3 py-1.5 text-sm text-surface-300 transition-colors hover:bg-surface-700">
              {uploading ? 'Uploading...' : 'Choose file'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* YouTube Input */}
      {showYoutubeInput && (
        <div className="border-b border-surface-700 px-3 py-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="YouTube video URL..."
              className="flex-1 rounded-lg border border-surface-700 bg-surface-800 px-3 py-1.5 text-sm text-white placeholder-surface-500 outline-none focus:border-cinema-500"
              onKeyDown={(e) => e.key === 'Enter' && addYoutubeVideo()}
            />
            <button
              type="button"
              onClick={addYoutubeVideo}
              className="rounded-lg bg-cinema-500 px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-cinema-400"
            >
              Embed
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="px-1">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
