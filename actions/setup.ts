"use server"

import { getCoderApiUser } from "@/util/coder/user";
import { getPrisma } from "@/util/db";
import { redirect } from "next/navigation";

const prisma = getPrisma()

export async function finishSetup(formData: FormData) {
  const password = formData.get("password");
  if (!password) return;
  const apiUser = await getCoderApiUser()
  const user = await prisma.user.create({
    data: {
      coderUserId: apiUser.id,
      email: apiUser.email,
      name: apiUser.name,
      username: apiUser.username,
      password: password.toString(),
      admin: true
    }
  })
  return redirect("/")
}