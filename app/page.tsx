import { getPrisma } from "@/util/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  const adminUsers = await getPrisma().user.findMany({
    where: { admin: true },
  });
  if (adminUsers.length === 0) redirect("/setup"); // If no admin user has been created, redirect to setup page
  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard");
}
