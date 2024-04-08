import { getServerSession } from "next-auth";
import SideBar from "./SideBar";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <>
      <SideBar />
      <div className="my-5 mx-20">{children}</div>
    </>
  );
}
