"use server";
import { Session } from "next-auth";
import { getPrisma } from "../db";
import { stripe } from "../stripe";

const prisma = getPrisma();

export async function getUser(session: Session) {
  if (!session.user?.email) return null
  return prisma.user.findUnique({
    where: {
      email: session.user?.email,
    },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function deleteUser(id: string) {
  const customer = await prisma.stripeCustomer.findUnique({ where: { userId: id } })
  if (customer) {
    if (customer.stripeSubscriptionId) await stripe.subscriptions.cancel(customer.stripeSubscriptionId)
    await stripe.customers.del(customer.id)
  }
  return prisma.user.delete({ where: { id } })
}
