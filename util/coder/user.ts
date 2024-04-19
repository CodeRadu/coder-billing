"use server";

import { CoderUser } from "@/types/coder";
import { coderApiRequest } from "./apiRequest";
import { getPrisma } from "../db";
import { User } from "@prisma/client";

const prisma = getPrisma()

export async function getCoderApiUser() {
  const user = await coderApiRequest({ path: "/users/me", method: "GET" }) as CoderUser
  return user
}

export async function getCoderUser(userId: string) {
  const user = await coderApiRequest({ path: `/users/${userId}`, method: "GET" }) as CoderUser
  return user
}

export async function getAllCoderUsers() {
  const users = await coderApiRequest({ path: "/users", method: "GET" })
  return users.users as CoderUser[]
}

export async function importCoderUser(user: CoderUser, password: string) {
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