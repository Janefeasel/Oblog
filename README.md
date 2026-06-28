# The Movie Desk — Cinema Movie Blog

A professional, modern movie blog built with React, Supabase, and TipTap. Features a cinematic dark UI, real-time content sync, admin dashboard, and automatic news aggregation.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7
- **Backend/Database:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **State Management:** TanStack React Query with real-time cache invalidation
- **Rich Text Editor:** TipTap (headless WYSIWYG with YouTube embeds, image uploads)
- **Form Handling:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS with custom cinematic theme (dark, amber/gold accents)
- **Icons:** Lucide React
- **SEO:** React Helmet Async + JSON-LD structured data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone <repo-url> oblog
cd oblog
npm install
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the SQL from `schema.sql` to create the `posts` table
3. Go to **Database > Replication** and enable Realtime on the `posts` table
4. Go to **Storage** and create a bucket called `images` (public)
5. Go to **Authentication > Settings** and disable "Confirm email" for development

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Admin User

Run the seed script with a password:

```bash
npm install -D dotenv tsx
ADMIN_PASSWORD=your-password npx dotenv -e .env -- npx tsx scripts/seed-admin.ts
```

Or create manually via Supabase Dashboard > Authentication > Users > Add User.

Default username: `editor` (maps to `editor@movieblog.com`).

**⚠️ Use a strong password — the default is for local development only!**

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Database Schema

The `posts` table (see `schema.sql` for full SQL):

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `title` | TEXT | Post title |
| `slug` | TEXT (unique) | URL-friendly identifier |
| `content` | TEXT | Rich text HTML from TipTap editor |
| `excerpt` | TEXT | Short summary for cards |
| `featured_image` | TEXT | Image URL |
| `category` | TEXT | news, review, feature, trailer, interview |
| `genre` | TEXT | action, comedy, drama, horror, sci-fi, etc. |
| `star_rating` | INTEGER | 1-5 (for reviews) |
| `is_pinned` | BOOLEAN | Pinned posts stay at top of feed |
| `post_date` | TIMESTAMPTZ | Manually settable display date |
| `status` | TEXT | published or draft |
| `seo_title` | TEXT | Meta title override |
| `seo_description` | TEXT | Meta description |
| `is_aggregated` | BOOLEAN | Auto-fetched content flag |
| `source_name` | TEXT | Attribution for aggregated posts |
| `source_url` | TEXT | Original source link |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

## Route Structure

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, pinned posts, latest grid, sidebar |
| `/news` | All news posts, filterable by genre |
| `/reviews` | All reviews, sortable by rating/date |
| `/category/:slug` | Single post view with full rich content |
| `/genre/:genre` | Posts filtered by genre |
| `/search?q=` | Search results |
| `/category/upcoming` | Upcoming releases and trailers |
| `/editor/login` | Admin login page |
| `/editor` | Admin dashboard (protected) |
| `/editor/new` | Create new post |
| `/editor/edit/:id` | Edit existing post |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   ├── TipTapEditor.tsx
│   ├── StarRating.tsx
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   ├── useRealtimePosts.ts
│   └── useSupabaseQuery.ts
├── lib/              # Core utilities
│   ├── supabase.ts
│   ├── supabaseQueries.ts
│   ├── database.types.ts
│   └── utils.ts
├── pages/            # Route pages
│   ├── HomePage.tsx
│   ├── NewsPage.tsx
│   ├── ReviewsPage.tsx
│   ├── SinglePost.tsx
│   ├── GenrePage.tsx
│   ├── SearchPage.tsx
│   ├── UpcomingPage.tsx
│   └── editor/
│       ├── LoginPage.tsx
│       ├── Dashboard.tsx
│       └── PostEditor.tsx
├── styles/
│   └── index.css     # Tailwind + custom styles
├── App.tsx           # Router + providers
└── main.tsx          # Entry point
```

## Key Features

### Real-Time Sync
All post changes (create, edit, delete) sync instantly across all devices via Supabase Realtime subscriptions. The React Query cache is invalidated when Realtime events fire, so the UI always reflects the latest data.

### Pinned Posts System
Pinned posts always appear at the top of the feed, ordered by most recent edit date. Regular posts appear below in chronological order by their `post_date`.

### Rich Text Editor (TipTap)
The admin post editor includes a full WYSIWYG toolbar with:
- Text formatting (bold, italic, underline, strikethrough)
- Headings (H1, H2, H3)
- Lists (bullet, ordered)
- Blockquotes
- Text alignment
- Link insertion
- Image upload (to Supabase Storage) or paste URL
- YouTube video embeds
- Undo/Redo

### Auto News Aggregation
A Supabase Edge Function (`supabase/functions/aggregate-news/`) fetches trending movies from TMDB API and inserts them as aggregated posts with `is_aggregated = true`. Schedule via GitHub Actions or Supabase Cron.

### SEO
- Dynamic meta tags via React Helmet Async
- JSON-LD structured data for Article and Review schema types
- Editable SEO title and description per post

## Deployment

### Frontend (Vercel / Netlify)

1. Push to GitHub
2. Connect repo to Vercel/Netlify
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy

### Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login and deploy
supabase login
supabase functions deploy aggregate-news --no-verify-jwt
```

Set the `TMDB_API_KEY` secret:
```bash
supabase secrets set TMDB_API_KEY=your-tmdb-api-key
```

## License

MIT
