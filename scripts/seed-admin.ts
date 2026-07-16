import { config } from 'dotenv'
config({ path: ['.env.local', '.env'] })

import { auth } from '../src/lib/auth.ts'

async function createAdmin() {
  console.log('→ Creating admin account...')
  
  try {
    // API better-auth untuk register manual dari server
    const user = await auth.api.signUpEmail({
      body: {
        email: 'admin@salarasa.id',
        password: 'password123',
        name: 'Admin Salarasa'
      }
    })
    
    console.log('✓ Admin account created successfully!')
    console.log('  Email: admin@salarasa.id')
    console.log('  Password: password123')
  } catch (error: any) {
    if (error?.message?.includes('User already exists')) {
       console.log('✓ Admin account already exists.')
    } else {
       console.error('X Failed to create admin:', error)
    }
  }
  process.exit(0)
}

createAdmin()