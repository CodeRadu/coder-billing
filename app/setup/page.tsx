import Input from "@/components/Input";
import { getPrisma } from "@/util/db";
import { redirect } from "next/navigation";
import Form from "@/components/Form";
import { getCoderApiUser } from "@/util/coder/user";
import { stripe } from "@/util/stripe";
import { setSetting } from "@/util/config";

export const dynamic = "force-dynamic";

const prisma = getPrisma();

export default async function Page() {
  const configured = await prisma.setting.findUnique({
    where: { key: "CONFIGURED" },
  });
  if (configured?.value === "true") return redirect("/");

  const apiUser = await getCoderApiUser()

  async function finishSetup(formData: FormData) {
    "use server";
    const { password, currency, workspacePrice } = Object.fromEntries(formData)
    let price: string
    if (workspacePrice === "new") {
      const newProduct = await stripe.products.create({
        name: "Workspace Unit",
        default_price_data: {
          currency: currency.toString(),
          recurring: { interval: "month" },
          unit_amount: 1 // 1 cent
        }
      })
      price = newProduct.default_price?.toString() as string
    }
    else price = workspacePrice.toString()
    const user = await prisma.user.create({
      data: {
        email: apiUser.email,
        name: apiUser.name,
        password: password as string,
        coderUserId: apiUser.id,
        username: apiUser.username,
        admin: true,
      }
    })
    await setSetting("STRIPE_UNIT_PRICE", price)
    await setSetting("STRIPE_CURRENCY", currency.toString())
    await setSetting("CONFIGURED", "true")
    return redirect("/");
  }

  const products = await stripe.products.list({ active: true });
  const prices = await stripe.prices.list({ active: true });

  return (
    <div className="flex justify-center">
      <div className="w-[60%] p-3">
        <span className="text-xl">Setup</span>
        <div className="">
          <Form submitButtonChildren="Finish setup" action={finishSetup}>
            <label>Set a strong password for {apiUser.name} ({apiUser.email}).</label>
            A new user will be created with this email and password.
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
            <label>Choose a currency</label>
            <Input
              type="select"
              id="currency"
              name="currency"
              required
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
            </Input>
            <label>Select a product for workspaces:</label>
            <Input type="select" id="workspacePrice" name="workspacePrice" required>
              {products.data.map(product => <option value={product.id} key={product.id}>
                {product.name} - {prices.data.find(price => price.product === product.id)?.id} (Created {new Date(product.created * 1000).toLocaleDateString()})
              </option>)}
              <option value="new">Create a new product and price</option>
            </Input>
          </Form>
        </div>
      </div>
    </div>
  );
}
