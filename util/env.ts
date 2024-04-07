import { z } from 'zod'

export const envSchema = z.object({
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url().optional(),
  DATABASE_URL: z.string().url(),
  PUBLIC_URL: z.string().url(),
  CODER_URL: z.string().url(),
  CODER_API_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_SIGNING_SECRET: z.string(),
  STRIPE_UNIT_PRICE: z.string()
})

export type Env = z.infer<typeof envSchema>
export const env = envSchema.parse(process.env)