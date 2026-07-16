import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url().optional(),
    APP_BASE_DOMAIN: z.string().min(1).default('salarasa.id'),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  runtimeEnv: {
    ...process.env,
    ...import.meta.env,
  },

  emptyStringAsUndefined: true,
})
