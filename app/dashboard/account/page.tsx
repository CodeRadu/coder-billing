import { getServerSession } from "next-auth";
import { getUser } from "@/util/db/user";
import UserCard from "./UserCard";

export default async function Page() {
  const session = await getServerSession()
  const user = await getUser(session!)
  return <UserCard user={{
    email: user!.email,
    realName: user!.name,
    username: user!.username,
  }} />
}