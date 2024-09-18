import { getUser } from "@/util/db/user";
import { stripe } from "@/util/stripe";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export interface Product extends Stripe.Product {
  prices?: Stripe.Price[]
}

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const user = await getUser(session)
  if (!user || !user.admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  // Get all products from Stripe
  const products: Product[] = (await stripe.products.list()).data;
  // For each product, get the prices
  for (const product of products) {
    product.prices = (await stripe.prices.list({ product: product.id })).data
  }

  return NextResponse.json(products);
}