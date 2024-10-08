import { getPrisma } from "@/util/db";
import { getUser } from "@/util/db/user";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import RefreshButton from "@/components/Refresh";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

const prisma = getPrisma();

export default async function Page() {
  const session = await getServerSession();
  const user = await getUser(session!);
  const workspaces = await prisma.workspace.findMany({
    where: {
      userId: user!.id,
    },
    include: {
      builds: {
        orderBy: {
          createdAt: "desc",
        },
        take: 2,
      },
      template: true,
    },
  });
  return (
    <div className="">
      <span className="text-2xl">Your workspaces</span>
      {user?.admin && (
        <span className="text-sm">
          <br />
          As an admin you don&apos;t pay for workspaces.
        </span>
      )}
      <div className="relative top-0 right-0">
        <RefreshButton />
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Template</th>
              <th scope="col">Last build</th>
              <th scope="col">Pricing type</th>
              <th scope="col">Last cost</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.map((workspace) => {
              return (
                <tr key={workspace.id}>
                  <td>{workspace.name}</td>
                  <td>
                    {workspace.template?.displayName ||
                      workspace.template?.name}
                  </td>
                  <td>{workspace.builds[0]?.action || "N/A"}</td>
                  <td>{workspace.template?.pricingType == "fixed" ? "Fixed" : "Pay as you go"}</td>
                  <td>{workspace.builds[1]?.buildCost?.toFixed(4) || "N/A"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
