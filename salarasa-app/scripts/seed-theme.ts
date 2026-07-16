import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

import { themes } from '../src/db/schema.ts'
import { RIQQA_PASTEL_GARDEN_THEME } from '../src/lib/themes/riqqa-pastel-garden.ts'

config({ path: ['.env.local', '.env'] })

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL required in .env.local')

const pool = new pg.Pool({ connectionString: url })
const db = drizzle(pool)

async function main() {
  console.log('→ Seeding Riqqa Pastel Garden theme…')
  await db
    .insert(themes)
    .values({
      name: 'Riqqa Pastel Garden',
      slug: 'riqqa-pastel-garden',
      styleConfig: RIQQA_PASTEL_GARDEN_THEME,
    })
    .onConflictDoNothing({ target: themes.slug })
  console.log('  ✓ done.')
}

main()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e)
    pool.end()
    process.exit(1)
  })
