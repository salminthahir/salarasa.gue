import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { db } from '../db'
import * as schema from '../db/schema'
import { env } from '../env'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
    env.BETTER_AUTH_URL,
    'https://salarasa.my.id',
    'https://www.salarasa.my.id',
  ].filter(Boolean) as string[],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: '.salarasa.my.id',
    },
    useSecureCookies: env.NODE_ENV === 'production',
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      name: {
        type: 'string',
        required: false,
      },
    },
  },
  plugins: [tanstackStartCookies()],
})

export type Auth = typeof auth