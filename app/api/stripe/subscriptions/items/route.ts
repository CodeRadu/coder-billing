import { getPrisma } from "@/util/db";
import { getUser } from "@/util/db/user";
import { stripe } from "@/util/stripe";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const prisma = getPrisma();

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "You must be logged in to do this." }, { status: 401 });

  const user = await getUser(session);
  if (!user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const subscription = await prisma.stripeCustomer.findUnique({
    where: {
      userId: user.id
    }
  })

  if (!subscription) return NextResponse.json({ error: "No subscription found" }, { status: 400 });

  const items = await stripe.subscriptionItems.list({
    subscription: subscription.stripeSubscriptionId
  })

  return NextResponse.json(items.data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "You must be logged in to do this." }, { status: 401 });

  const user = await getUser(session);
  if (!user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const body = await req.json()

  const { priceId } = body;
  const subscription = await prisma.stripeCustomer.findUnique({
    where: {
      userId: user.id
    }
  })

  if (!subscription) return NextResponse.json({ error: "No subscription found" }, { status: 400 });

  const item = await stripe.subscriptionItems.create({
    subscription: subscription.stripeSubscriptionId,
    price: priceId
  })

  await prisma.stripeCustomer.update({
    where: {
      userId: user.id
    },
    data: {
      subscriptionItems: {
        push: item.id
      }
    }
  })

  return NextResponse.json({ success: true });
}