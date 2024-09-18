import { getPrisma } from "@/util/db";
import { env } from "@/util/env";
import { stripe } from "@/util/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = getPrisma()

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature')
    let event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature!, env.STRIPE_SIGNING_SECRET)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ statusCode: 400, message: 'Webhook Error' }, { status: 400 });
    }
    switch (event.type) {
      case "checkout.session.completed": {
        const session: Stripe.Checkout.Session = event.data.object
        const subscriptionId = event.data.object.subscription

        const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)

        const email = session.customer_email
        const itemId = subscription.items.data[0].id
        const customer = await prisma.stripeCustomer.create({
          data: {
            id: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            User: {
              connect: {
                email: email!
              }
            },
            subscriptionItems: [itemId]
          }
        })
        await prisma.user.update({
          where: {
            email: email!
          },
          data: {
            stripeCustomerId: customer.id
          }
        })
        break;
      }
      case "customer.subscription.updated": {
        const subscription: Stripe.Subscription = event.data.object
        await prisma.stripeCustomer.update({
          where: {
            id: subscription.customer as string
          },
          data: {
            stripeSubscriptionEndDate: subscription.cancel_at
          }
        })
        break
      }
      case "customer.subscription.deleted": {
        const subscription: Stripe.Subscription = event.data.object
        const deletedCustomer = await prisma.stripeCustomer.delete({
          where: {
            id: subscription.customer as string
          },
        })
        await prisma.user.update({
          where: {
            id: deletedCustomer.userId
          },
          data: {
            stripeCustomerId: null
          }
        })
        await stripe.customers.del(subscription.customer as string)
      }
    }
    return NextResponse.json({ status: "ok" })
  } catch (err: any) {
    console.error(err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}