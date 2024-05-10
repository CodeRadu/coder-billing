import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    CODER_URL: z.string().url(),
    CODER_API_KEY: z.string(),
    STRIPE_PUBLISHABLE_KEY: z.string(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_SIGNING_SECRET: z.string(),
  },
  runtimeEnv: process.env,
  skipValidation: process.env.NEXT_BUILD === 'true',
})