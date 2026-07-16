import { createAuthClient } from 'better-auth/client'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000', // Pastikan sama dengan di .env.local
})

export const {
  signIn,
  signUp,
  signOut,
  getSession,
  useSession,
} = authClient