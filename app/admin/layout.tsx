import { getUser } from "@/util/db/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session) return redirect("/login");
  const user = await getUser(session);
  if (!user || !user.admin) return redirect("/");
  return <div className="mx-10 my-5">{children}</div>;
}
