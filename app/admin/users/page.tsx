import { getAllCoderUsers } from "@/util/coder/user";
import { getAllUsers } from "@/util/db/user";
import { getServerSession } from "next-auth";
import { DeleteUserButton, ImportUserButton } from "./Actions";
import { getPrisma } from "@/util/db";
import { Metadata } from "next";
import RefreshButton from "@/components/Refresh";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage users",
};

const prisma = getPrisma();

export default async function Users() {
  const session = await getServerSession();
  const users = await getAllUsers();
  const coderUsers = await getAllCoderUsers();

  return (
    <div className="">
      <span className="text-2xl">Imported Users</span>
      <div className="relative top-0 right-0">
        <RefreshButton />
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Stripe Customer ID</th>
              <th scope="col">Subscribed</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(async (user) => {
              const customer = user.stripeCustomerId
                ? await prisma.stripeCustomer.findUnique({
                  where: { id: user.stripeCustomerId },
                })
                : null;
              return (
                <tr key={user.id}>
                  <td>{user.name || user.username}</td>
                  <td>{user.email}</td>
                  <td>{customer?.id || "-"}</td>
                  <td>
                    {customer?.stripeSubscriptionId ? "Yes" : "No"}{" "}
                    {customer?.stripeSubscriptionEndDate &&
                      `(ends on ${new Date(
                        customer.stripeSubscriptionEndDate * 1000
                      ).toLocaleDateString()})`}
                  </td>
                  <td>
                    <DeleteUserButton
                      disabled={user.email == session!.user?.email}
                      user={user}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <span className="text-2xl">Coder Users</span>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {coderUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>
                <td>
                  <ImportUserButton
                    disabled={users.find((u) => u.email == user.email) != null}
                    user={user}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
