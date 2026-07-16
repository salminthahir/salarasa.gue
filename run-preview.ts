import { config } from 'dotenv'
config({ path: ['.env.local', '.env'] })

import('./scripts/seed-preview.ts')