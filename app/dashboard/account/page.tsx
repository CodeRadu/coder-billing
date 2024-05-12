import {getServerSession} from "next-auth";
import {getUser} from "@/util/db/user";

export default async function Page() {
  const session = await getServerSession()
  const user = await getUser(session!)
  return <div className="flex flex-col">
    <div><span className="font-bold">Name: </span> {user?.name ? `${user.name} (${user.username})` : user?.username}</div>
    <div><span className="font-bold">Email address: </span> {user?.email}</div>
  </div>
}