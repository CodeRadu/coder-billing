import { getUser } from "@/util/db/user";
import { getServerSession } from "next-auth";
import { stripe } from "@/util/stripe";
import { env } from "@/util/env";
import { redirect } from "next/navigation";
import PortalButton from "./PortalButton";
import { getPrisma } from "@/util/db";

const prisma = getPrisma();

export default async function Page() {
  const session = await getServerSession();
  const user = await getUser(session!);
  async function subscribe() {
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      success_url: `${env.PUBLIC_URL}/dashboard/stripe`,
      cancel_url: `${env.PUBLIC_URL}/dashboard/stripe/error`,
      line_items: [
        {
          price: env.STRIPE_UNIT_PRICE,
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
  return (
    <div className="py-5 px-20 ">
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
    </div>
  );
}
