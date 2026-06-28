/**
 * Seed script to create the admin user in Supabase.
 *
 * Creates the default editor account using the Supabase Auth API.
 *
 * Prerequisites:
 *   1. Create a .env file with:
 *      VITE_SUPABASE_URL=https://your-project.supabase.co
 *      VITE_SUPABASE_ANON_KEY=your-anon-key
 *
 * Usage:
 *   npm install -D dotenv tsx
 *   npx dotenv -e .env -- npx tsx scripts/seed-admin.ts
 *
 * Or create manually via Supabase Dashboard:
 *   - Go to Authentication > Users > Add User
 *   - Email: editor@movieblog.com
 *   - Password: account
 *   - Disable email confirmation if needed
 *
 * ⚠️ IMPORTANT: Change the password in production!
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('')
  console.error('Missing Supabase credentials.')
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
  console.error('')
  console.error('  npx dotenv -e .env -- npx tsx scripts/seed-admin.ts')
  console.error('')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'editor@movieblog.com'
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    console.error('')
    console.error('Please set ADMIN_PASSWORD to create the editor account.')
    console.error('')
    console.error('  ADMIN_PASSWORD=your-password npx dotenv -e .env -- npx tsx scripts/seed-admin.ts')
    console.error('')
    process.exit(1)
  }

  console.log(`\nCreating editor account: ${email}\n`)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'admin',
      },
    },
  })

  if (error) {
    console.error('Error creating user:', error.message)
    console.error('')
    console.error('Possible causes:')
    console.error('  - User may already exist (check Supabase Auth dashboard)')
    console.error('  - Email confirmation may be required (check Supabase Auth settings)')
    console.error('')
    process.exit(1)
  }

  console.log('Editor account created!')
  console.log('')
  console.log('  Account created.')
  console.log('  Login with username: editor')
  console.log('')
  console.log('IMPORTANT: In production, set a strong password via Supabase Dashboard.')
  console.log('')
}

seedAdmin()
