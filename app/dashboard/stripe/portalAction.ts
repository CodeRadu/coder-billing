"use server"

import { env } from "@/util/env"
import { stripe } from "@/util/stripe"

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.NEXTAUTH_URL}/dashboard/stripe`
  })
  return { id: session.id, url: session.url }
}