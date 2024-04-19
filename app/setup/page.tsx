import Input from "@/components/Input";
import { getPrisma } from "@/util/db";
import { redirect } from "next/navigation";
import Form from "@/components/Form";
import { getCoderApiUser } from "@/util/coder/user";

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
    const { password } = Object.fromEntries(formData)
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
    // Set configured
    await prisma.setting.upsert({
      where: { key: "CONFIGURED" },
      create: { key: "CONFIGURED", value: "true" },
      update: { value: "true" },
    });
    return redirect("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-[60%] p-3">
        <span className="text-xl">Setup</span>
        <div className="">
          <Form submitButtonChildren="Finish setup" action={finishSetup}>
            <label>Set a strong password for the {apiUser.name} ({apiUser.email}) user</label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
          </Form>
        </div>
      </div>
    </div>
  );
}
