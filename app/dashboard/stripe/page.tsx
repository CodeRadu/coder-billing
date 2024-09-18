import { getUser } from "@/util/db/user";
import { getServerSession } from "next-auth";
import { stripe } from "@/util/stripe";
import { env } from "@/util/env";
import { redirect } from "next/navigation";
import PortalButton from "./PortalButton";
import { getPrisma } from "@/util/db";
import { Metadata } from "next";
import { getSetting } from "@/util/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaPlus } from "react-icons/fa6";
import PurchaseButton from "./Purchase";

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
  if (user?.admin) return <div>
    You cannot subscribe because you are an admin.
  </div>
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold">
              Your subscription is currently {subscription.status}.
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">
              The next invoice is for {subscription.currency.toUpperCase()} {nextInvoice.amount_due / 100}.
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">
              {customer?.stripeSubscriptionEndDate ? "Your subscription ends on " + new Date(customer.stripeSubscriptionEndDate * 1000).toLocaleDateString() : "Your subscription renews on " + new Date(subscription.current_period_end * 1000).toLocaleDateString()}.
            </p>
          </div>
          <div className="">
            You pay for the following items:
            <ul>
              {subscription.items.data.map(async (item) => {
                const product = await stripe.products.retrieve(item.price.product.toString());

                return <li key={item.id}>{product.name} - {item.price.currency.toLocaleUpperCase()} {(item.price.unit_amount ?? 0) / 100} {item.price.recurring?.usage_type == "metered" ? "/unit/month" : "/month"}</li>
              })}
            </ul>
          </div>
          <div className="flex items-center justify-between">
            <PortalButton customerId={customer!.id} />
            <PurchaseButton disabled={customer?.stripeSubscriptionEndDate != null} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
