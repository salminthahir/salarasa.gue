import { config } from 'dotenv'
config({ path: ['.env.local', '.env'] })

// Dynamic import bypasses ESM hoisting
import('./scripts/seed-admin.ts')