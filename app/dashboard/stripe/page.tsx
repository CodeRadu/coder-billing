import { getUser } from "@/util/db/user";
import { getServerSession } from "next-auth";
import { stripe } from "@/util/stripe";
import { env } from "@/util/env";
import { redirect } from "next/navigation";
import PortalButton from "./PortalButton";
import { getPrisma } from "@/util/db";
import { Metadata } from "next";
import { getSetting } from "@/util/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your subscription",
};

const prisma = getPrisma();

export default async function Page() {
  const session = await getServerSession();
  const user = await getUser(session!);
  async function subscribe() {
    const stripeUnitPrice = await getSetting("STRIPE_UNIT_PRICE");
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      success_url: `${env.NEXTAUTH_URL}/dashboard/stripe`,
      cancel_url: `${env.NEXTAUTH_URL}/dashboard/stripe/error`,
      line_items: [
        {
          price: stripeUnitPrice,
        },
      ],
      mode: "subscription",
    });
    return session;
  }
  if (!user?.stripeCustomerId) return redirect((await subscribe()).url!);
  const customer = await prisma.stripeCustomer.findUnique({
    where: { id: user.stripeCustomerId },
  });
  const subscription = await stripe.subscriptions.retrieve(
    customer?.stripeSubscriptionId!
  );
  const nextInvoice = await stripe.invoices.retrieveUpcoming({
    subscription: customer?.stripeSubscriptionId!,
  });
  return (
    <div className="">
      You are subscribed <PortalButton customerId={user.stripeCustomerId} />
      <br />
      {customer?.stripeSubscriptionEndDate && (
        <span>
          Your subscription ends on{" "}
          {new Date(
            customer.stripeSubscriptionEndDate * 1000
          ).toLocaleDateString()}
        </span>
      )}
      <span>
        Next payment:{" "}
        {subscription.current_period_end &&
          new Date(
            subscription.current_period_end * 1000
          ).toLocaleDateString()}{" "}
        of {(nextInvoice.amount_due / 100).toFixed(2)}{" "}
        {subscription.currency.toUpperCase()}
      </span>
    </div>
  );
}
