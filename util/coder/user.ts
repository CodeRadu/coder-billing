"use server";

import { CoderUser, CoderUserType } from "@/types/coder";
import { coderApiRequest } from "./apiRequest";
import { getPrisma } from "../db";
import { User } from "@prisma/client";

const prisma = getPrisma()

export async function getCoderApiUser() {
  const user = CoderUser.parse(await coderApiRequest({ path: "/users/me", method: "GET" }))
  return user
}

export async function getCoderUser(userId: string) {
  const user = CoderUser.parse(await coderApiRequest({ path: `/users/${userId}`, method: "GET" }))
  return user
}

export async function getAllCoderUsers() {
  const users = await coderApiRequest({ path: "/users", method: "GET" })
  return CoderUser.array().parse(users.users)
}

export async function importCoderUser(user: CoderUserType, password: string) {
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      coderUserId: user.id,
      password: password,
      username: user.username
    }
  })
  return newUser
}